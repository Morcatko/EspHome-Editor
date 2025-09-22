import fs from "node:fs/promises";
import { join } from "node:path";
import { c } from "@/server/config";
import { directoryExists, listDirEntries } from "@/server/utils/fs-utils";
import type { TLocalDirectory, TLocalFile, TLocalFileOrDirectory } from "../types";
import { getFileInfo } from "./template-processors";
import { ManifestUtils } from "./manifest-utils";
import { slugifyFriendlyName } from "@/shared/utils";

export const deviceNameToDirName = (device_id: string) => slugifyFriendlyName(device_id)

export const getDeviceDir = (device_id: string) =>
    join(c.devicesDir, deviceNameToDirName(device_id));

export const fixPath = (path: string) =>
    path.replaceAll("\\", "/");

export const getDevicePath = (device_id: string, path: string) =>
    join(getDeviceDir(device_id), fixPath(path));

export const ensureDeviceDirExists = async (device_id: string) => {
    const path = getDeviceDir(device_id);
    if (!(await directoryExists(path)))
        await fs.mkdir(path);
}

export const awaitArray = async <T>(arr: Promise<T>[]): Promise<T[]> =>
    (await Promise
        .allSettled(arr))
        .map((r) => r.status === "fulfilled" ? r.value : null)
        .filter((r) => r !== null)
        .map((r) => r as T);

export const scanDirectory = async (device_id: string, fullPath: string, parentPath: string | null): Promise<TLocalFileOrDirectory[]> => {
    const resAsync =
        (await listDirEntries(fullPath, _ => true))
            .map(async (e) => {
                const path = parentPath ? `${parentPath}/${e.name}` : e.name;
                if (e.isDirectory()) {
                    return <TLocalDirectory>{
                        id: e.name,
                        name: e.name,
                        path: path,
                        type: "directory",
                        disabled: await ManifestUtils.isPathDisabled(device_id, path),
                        files: await scanDirectory(device_id, `${fullPath}/${e.name}`, path),
                    };
                } else {
                    if (e.name.endsWith(".testdata") || (e.name == ManifestUtils.manifestFileName))
                        return null;

                    return <TLocalFile>{
                        id: e.name,
                        name: e.name,
                        path: path,
                        type: "file",
                        disabled: await ManifestUtils.isPathDisabled(device_id, path),
                        language: getFileInfo(`${fullPath}/${e.name}`).language,
                    };
                }
            });

    return (await awaitArray(resAsync))
        .filter((e) => e !== null)
        .sort((a, b) => a.type.localeCompare(b.type));
};