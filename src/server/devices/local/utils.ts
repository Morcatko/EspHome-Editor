import fs from "node:fs/promises";
import { devicesDir } from "@/server/config";
import { directoryExists } from "@/server/utils/dir-utils";
import { join } from "node:path";

export const getDeviceDir = (device_id: string) =>
    join(devicesDir, device_id);

export const getDevicePath = (device_id: string, path: string) =>
    join(getDeviceDir(device_id), path);

export const ensureDeviceDirExists = async (device_id: string) => {
    const path = getDeviceDir(device_id);
    if (!(await directoryExists(path)))
        await fs.mkdir(path);
}