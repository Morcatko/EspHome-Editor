import fs from "node:fs/promises";

import type { TDevice, TLocalDirectory, TLocalFile, TLocalFileOrDirectory } from "../types";
import { c } from "../../config";
import { directoryExists, fileExists, listDirEntries } from "../../utils/fs-utils";
import { compileFile, getFileInfo } from "./template-processors";
import { log } from "@/shared/log";
import { mergeEspHomeYamlFiles } from "./template-processors/yaml-merger";
import { patchEspHomeYaml } from "./template-processors/yaml-patcher";
import { ensureDeviceDirExists, fixPath, getDeviceDir, getDevicePath } from "./utils";
import { dirname, join } from "node:path";
import { ManifestUtils } from "./manifest-utils";

const awaitArray = async <T>(arr: Promise<T>[]): Promise<T[]> =>
    (await Promise
        .allSettled(arr))
        .map((r) => r.status === "fulfilled" ? r.value : null)
        .filter((r) => r !== null)
        .map((r) => r as T);

const scanDirectory = async (device_id: string, fullPath: string, parentPath: string | null, parentEnabled: boolean): Promise<TLocalFileOrDirectory[]> => {
    const resAsync =
        (await listDirEntries(fullPath, _ => true))
            .map(async (e) => {
                const path = parentPath ? `${parentPath}/${e.name}` : e.name;
                if (e.isDirectory()) {
                    const enabled = parentEnabled && await ManifestUtils.isPathEnabled(device_id, path);
                    return <TLocalDirectory>{
                        id: e.name,
                        name: e.name,
                        path: path,
                        enabled: enabled,
                        type: "directory",
                        files: await scanDirectory(device_id, `${fullPath}/${e.name}`, path, enabled),
                    };
                } else {
                    if (e.name.endsWith(".testdata") || (e.name == ManifestUtils.manifestFileName))
                        return null;

                    return <TLocalFile>{
                        id: e.name,
                        name: e.name,
                        path: path,
                        enabled: parentEnabled && await ManifestUtils.isPathEnabled(device_id, path),
                        language: getFileInfo(e.name).language,
                        type: "file",
                    };
                }
            });

    return (await awaitArray(resAsync))
        .filter((e) => e !== null)
        .sort((a, b) => a.type.localeCompare(b.type));
};

const getDevices = async (): Promise<TDevice[]> => {
    log.debug("Getting Local devices");
    const deviceDirectories = await listDirEntries(
        c.devicesDir,
        (d) => d.isDirectory(),
    );

    const resAsync = deviceDirectories
        .map(async (d) => {
            return <TDevice>{
                id: d.name,
                path: "",
                name: d.name,
                type: "device",
                files: await scanDirectory(d.name, `${c.devicesDir}/${d.name}`, null, true),
            } as TDevice;
        });

    return awaitArray(resAsync);
}

const createDirectory = async (device_id: string, path: string) => {
    await ensureDeviceDirExists(device_id);
    const fullPath = getDevicePath(device_id, path);
    await fs.mkdir(fullPath);
}

const createFile = async (device_id: string, path: string) => {
    await saveFileContent(device_id, path, "");
}

const getFileContent = async (device_id: string, file_path: string) => {
    const path = getDevicePath(device_id, file_path);
    return await fs.readFile(path, "utf-8");
}

const tryGetFileContent = async (device_id: string, file_path: string) => {
    const path = getDevicePath(device_id, file_path);
    return await fileExists(path) ? await fs.readFile(path, "utf-8") : null;
}

const saveFileContent = async (device_id: string, file_path: string, content: string) => {
    await ensureDeviceDirExists(device_id);
    const path = getDevicePath(device_id, file_path);
    await fs.writeFile(path, content, "utf-8");
}


const createDevice = async (device_id: string) =>
    await fs.mkdir(getDeviceDir(device_id));

const toggleEnabled = async (device_id: string, path: string) => {
    await ManifestUtils.togglePathEnabled(device_id, path);
}

const renameFile = async (device_id: string, path: string, newName: string) => {
    const oldPath = getDevicePath(device_id, path);
    const parentDir = dirname(oldPath);
    const newPath = join(parentDir, fixPath(newName));
    log.debug(`Renaming file '${oldPath}' to '${newName}'`);
    await fs.rename(oldPath, newPath);
    await ManifestUtils.renameFile(device_id, path, newName);
};

const deletePath = async (device_id: string, path: string) => {
    const fullPath = getDevicePath(device_id, path);
    log.debug(`Deleting file '${fullPath}'`);
    const stats = await fs.stat(fullPath);
    if (stats.isDirectory())
        await fs.rmdir(fullPath)
    else {
        await fs.unlink(fullPath);
        await ManifestUtils.deleteFile(device_id, path);
    }
}

const deleteDevice = async (device_id: string) => {
    const fullPath = getDevicePath(device_id, "");
    if (await directoryExists(fullPath)) {
        log.debug(`Deleting device '${fullPath}'`);
        await fs.rm(fullPath, { recursive: true });
    }
}

const flattenTree = (tree: TLocalFileOrDirectory[]): TLocalFileOrDirectory[] => {
    const res: TLocalFileOrDirectory[] = [];

    for (const entry of tree.filter(e => e.enabled)) {
        res.push(entry);
        if (entry.type === "directory") {
            const subEntries = flattenTree(entry.files ?? []);
            res.push(...subEntries);
        }
    }

    return res;
}


const compileDevice = async (device_id: string) => {
    log.debug("Compiling device", device_id);
    const deviceDirectory = getDeviceDir(device_id);

    const outputYamls: string[] = [];
    const outputPatches: string[] = [];

    const file_tree = await scanDirectory(device_id, deviceDirectory, null, true);
    const flat_list = flattenTree(file_tree);

    const fileEntries = flat_list.filter(e => e.type === "file");//  await listDirEntries(deviceDirectory, (e) => e.isFile());
    const inputFiles = fileEntries
        .map(f => ({
            path: f.path,
            enabled: f.enabled,
            info: getFileInfo(f.name)
        }));

    for (const file of inputFiles.filter(i => i.info.type === "basic")) {
        if (!file.enabled) {
            log.debug("Skipping disabled file", file.path);
            continue;
        }
        const filePath = getDevicePath(device_id, file.path)
        log.debug("Compiling Configuration", filePath);
        const output = await compileFile(device_id, file.path, false);
        log.success("Compiled Configuration", filePath);
        outputYamls.push(output);
    }

    log.debug("Merging compiled configurations", device_id);
    const mergedYaml = mergeEspHomeYamlFiles(outputYamls);
    log.success("Merged compiled configurations", device_id);

    for (const file of inputFiles.filter(i => i.info.type === "patch")) {
        if (!file.enabled) {
            log.debug("Skipping disabled file", file.path);
            continue;
        }
        const filePath = getDevicePath(device_id, file.path)
        log.debug("Compiling patch", filePath);
        const output = await compileFile(device_id, file.path, false);
        log.success("Compiled patch", filePath);
        outputPatches.push(output);
    }

    log.debug("Patching configuration", device_id);
    const patchedYaml = patchEspHomeYaml(mergedYaml, outputPatches);
    log.success("Patched configuration", device_id);

    return patchedYaml.toString();
}

export const local = {
    getDevices,
    createDirectory,
    createFile,
    getFileContent,
    tryGetFileContent,
    saveFileContent,
    compileFile,
    createDevice,
    toggleEnabled,
    renameFile,
    deletePath,
    deleteDevice,
    compileDevice
}