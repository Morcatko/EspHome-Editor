import fs from "node:fs/promises";
import { getDevicePath } from "./utils";
import { fileExists } from "@/server/utils/fs-utils";

type TManifestFileInfo = {
    disabled?: boolean;
}

type TManifest = {
    files: { [path: string]: TManifestFileInfo};
};

const manifestFileName = "manifest.json";


async function loadManifest(device_id: string): Promise<TManifest> {
    const manifestPath = getDevicePath(device_id, manifestFileName); 
    if (await fileExists(manifestPath))
        return JSON.parse(await fs.readFile(manifestPath, "utf-8")) as TManifest;
    return { files: {} };
}

async function saveManifest(device_id: string, manifest: TManifest) {
    const manifestPath = getDevicePath(device_id, manifestFileName); 
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
}

async function renameFile(device_id: string, old_path: string, new_path: string) {
    const manifest = await loadManifest(device_id);
    if (manifest.files[old_path]) {
        manifest.files[new_path] = manifest.files[old_path];
        delete manifest.files[old_path];
    }
    await saveManifest(device_id, manifest);    
}

async function deleteFile(device_id: string, path: string) {
    const manifest = await loadManifest(device_id);
    if (manifest.files[path]) {
        delete manifest.files[path];
    }
    await saveManifest(device_id, manifest);    
}

async function toggleFileEnabled(device_id: string, path: string) {
    const manifest = await loadManifest(device_id);
    if (!manifest.files[path]) 
        manifest.files[path] = { };

    manifest.files[path].disabled = manifest.files[path].disabled ? false : true;

    await saveManifest(device_id, manifest);
}

async function isFileEnabled(device_id: string, path: string) {
    const manifest = await loadManifest(device_id);
    return !manifest.files[path]?.disabled;
}

export const ManifestUtils = {
    manifestFileName,
    renameFile,
    deleteFile,
    toggleFileEnabled,
    isFileEnabled
}