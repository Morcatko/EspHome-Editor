import fs from "node:fs/promises";

import type { TDevice, TLocalDirectory, TLocalFile, TLocalFileOrDirectory } from "../types";
import { c } from "../../config";
import { listDirEntries } from "../../utils/dir-utils";
import { compileFile as _compileFile, getFileInfo } from "./template-processors";
import { log } from "@/shared/log";
import { mergeEspHomeYamlFiles } from "./template-processors/yaml-merger";
import { ensureDeviceDirExists, getDeviceDir, getDevicePath } from "./utils";
import { dirname, join } from "node:path";

const awaitArray = async <T>(arr: Promise<T>[]): Promise<T[]> =>
    (await Promise
        .allSettled(arr))
        .map((r) => r.status === "fulfilled" ? r.value : null)
        .filter((r) => r !== null)
        .map((r) => r as T);

const scanDirectory = async (fullPath: string, parentPath: string | null): Promise<TLocalFileOrDirectory[]> => {
    const resAsync =
        (await listDirEntries(fullPath, _ => true))
            .map(async (d) => {
                const path = parentPath ? `${parentPath}/${d.name}` : d.name;
                if (d.isDirectory()) {
                    return <TLocalDirectory>{
                        id: d.name,
                        name: d.name,
                        path: path,
                        type: "directory",
                        files: await scanDirectory(`${fullPath}/${d.name}`, path),
                    };
                } else {
                    return <TLocalFile>{
                        id: d.name,
                        path: path,
                        name: d.name,
                        compiler: getFileInfo(`${fullPath}/${d.name}`).compiler,
                        type: "file",
                    };
                }
            })

    return (await awaitArray(resAsync))
        .sort((a, b) => a.type.localeCompare(b.type));
};

export namespace local {
    export const getDevices = async (): Promise<TDevice[]> => {
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
                    files: await scanDirectory(`${c.devicesDir}/${d.name}`, null),
                } as TDevice;
            });

        return awaitArray(resAsync);
    }

    export const createDirectory = async (device_id: string, path: string) => {
        await ensureDeviceDirExists(device_id);
        const fullPath = getDevicePath(device_id, path);
        await fs.mkdir(fullPath);
    }

    export const createFile = async (device_id: string, path: string) => {
        await saveFileContent(device_id, path, "");
    }

    export const getFileContent = async (device_id: string, file_path: string) => {
        const path = getDevicePath(device_id, file_path);
        const content = await fs.readFile(path, "utf-8");
        return content;
    }

    export const saveFileContent = async (device_id: string, file_path: string, content: string) => {
        await ensureDeviceDirExists(device_id);
        const path = getDevicePath(device_id, file_path);
        await fs.writeFile(path, content, "utf-8");
    }

    export const compileDevice = async (device_id: string) => {
        log.debug("Compiling device", device_id);
        const deviceDirectory = getDeviceDir(device_id);

        const outputYamls: string[] = [];
        const outputPatches: string[] = [];

        const fileEntries = await listDirEntries(deviceDirectory, (e) => e.isFile());
        const inputFiles = fileEntries
            .map(f => ({
                id: f.name,
                info: getFileInfo(f.name)
            }));

        for (const file of inputFiles.filter(i => i.info.type === "basic")) {
            const filePath = getDevicePath(device_id, file.id)
            log.debug("Compiling Configuration", filePath);
            const output = await compileFile(device_id, file.id, null);
            log.success("Compiled Configuration", filePath);
            outputYamls.push(output);
        }

        log.debug("Merging compiled configurations", device_id);
        const mergedYaml = mergeEspHomeYamlFiles(outputYamls);
        log.success("Merged compiled configurations", device_id);

        for (const file of inputFiles.filter(i => i.info.type === "patch")) {
            const filePath = getDevicePath(device_id, file.id)
            log.debug("Compiling patch", filePath);
            const output = await compileFile(device_id, file.id, null);
            log.success("Compiled patch", filePath);
            outputPatches.push(output);
        }

        //apply patches;

        return mergedYaml.toString();
    }

    export const compileFile = _compileFile;

    export const createDevice = async (device_id: string) =>
        await fs.mkdir(getDeviceDir(device_id));

    export const renameFile = async (device_id: string, path: string, newName: string) => {
        const oldPath = getDevicePath(device_id, path);
        const parentDir = dirname(oldPath);
        const newPath = join(parentDir, newName);
        console.debug(`Renaming file '${oldPath}' to '${newName}'`);
        await fs.rename(oldPath, newPath);
    };

    export const deletePath = async (device_id: string, path: string) => {
        const fullPath = getDevicePath(device_id, path);
        console.debug(`Deleting file '${fullPath}'`);
        const stats = await fs.stat(fullPath);
        if (stats.isDirectory())
            await fs.rmdir(fullPath)
        else
            await fs.unlink(fullPath);
    }
}