import fs from "node:fs/promises";

import type { TDevice, TLocalFileOrDirectory } from "../types";
import { c } from "../../config";
import { directoryExists, fileExists, listDirEntries } from "../../utils/fs-utils";
import { log } from "@/shared/log";
import { ensureDeviceDirExists, fixPath, getDeviceDir, getDevicePath } from "./utils";
import { dirname, join } from "node:path";
import { awaitArray, scanDirectory } from "./file-utils";

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
                files: await scanDirectory(d.name, `${c.devicesDir}/${d.name}`, null, true),
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
    return await fs.readFile(path, "utf-8");
}

export const tryGetFileContent = async (device_id: string, file_path: string) => {
    const path = getDevicePath(device_id, file_path);
    return await fileExists(path) ? await fs.readFile(path, "utf-8") : null;
}

export const saveFileContent = async (device_id: string, file_path: string, content: string) => {
    await ensureDeviceDirExists(device_id);
    const path = getDevicePath(device_id, file_path);
    await fs.writeFile(path, content, "utf-8");
}


export const createDevice = async (device_id: string) =>
    await fs.mkdir(getDeviceDir(device_id));

export const renameFile = async (device_id: string, path: string, newName: string) => {
    const oldPath = getDevicePath(device_id, path);
    const parentDir = dirname(oldPath);
    const newPath = join(parentDir, fixPath(newName));
    log.debug(`Renaming file '${oldPath}' to '${newName}'`);
    await fs.rename(oldPath, newPath);
    await ManifestUtils.renameFile(device_id, path, newName);
};

export const deletePath = async (device_id: string, path: string) => {
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

export const deleteDevice = async (device_id: string) => {
    const fullPath = getDevicePath(device_id, "");
    if (await directoryExists(fullPath)) {
        log.debug(`Deleting device '${fullPath}'`);
        await fs.rm(fullPath, { recursive: true });
    }
}