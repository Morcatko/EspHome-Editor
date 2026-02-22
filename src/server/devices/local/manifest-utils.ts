import fs from "node:fs/promises";
import { fixPath, getDevicePath } from "./utils";
import { fileExists } from "@/server/utils/fs-utils";

type TManifestFileInfo = {
    disabled?: boolean;
}

export type TDeviceInfo = {
    esphome_version: string | null;
    chip: string | null;
    compiled_on: string | null;
    ip_address: string | null;
    deviceInfoUpdatedAt: string;        //Rename to something better
}

export type TCompilationResult = {
    success: boolean;
    compilationResultUpdatedAt: string; //Rename to something better
}

type TManifest = {
    files: { [path: string]: TManifestFileInfo};
    deviceInfo?: TDeviceInfo;
    compilationResult?: TCompilationResult;
};

const manifestFileName = "manifest.json";

//TODO: Do not load for each file, load once and use the loaded manifest
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
    old_path = fixPath(old_path);
    new_path = fixPath(new_path);
    if (manifest.files[old_path]) {
        manifest.files[new_path] = manifest.files[old_path];
        delete manifest.files[old_path];
    }
    await saveManifest(device_id, manifest);    
}

async function deleteFile(device_id: string, path: string) {
    const manifest = await loadManifest(device_id);
    path = fixPath(path);
    if (manifest.files[path]) {
        delete manifest.files[path];
    }
    await saveManifest(device_id, manifest);    
}

async function togglePathEnabled(device_id: string, path: string) {
    const manifest = await loadManifest(device_id);
    path = fixPath(path);
    if (!manifest.files[path]) 
        manifest.files[path] = { };

    manifest.files[path].disabled = manifest.files[path].disabled ? false : true;

    await saveManifest(device_id, manifest);
}

async function isPathDisabled(device_id: string, path: string) {
    const manifest = await loadManifest(device_id);
    path = fixPath(path);
    return !!(manifest.files[path]?.disabled);
}

async function getDeviceInfo(device_id: string): Promise<TDeviceInfo | undefined> {
    const manifest = await loadManifest(device_id);
    return manifest.deviceInfo;
}

async function setDeviceInfo(device_id: string, deviceInfo: TDeviceInfo) {
    const manifest = await loadManifest(device_id);
    manifest.deviceInfo = deviceInfo;
    await saveManifest(device_id, manifest);
}

async function setCompilationResult(device_id: string, compilationResult: TCompilationResult) {
    const manifest = await loadManifest(device_id);
    manifest.compilationResult = compilationResult;
    await saveManifest(device_id, manifest);
}

export const ManifestUtils = {
    manifestFileName,
    renameFile,
    deleteFile,
    togglePathEnabled,
    getManifest: loadManifest,
    isPathDisabled,
    setDeviceInfo,
    setCompilationResult,
}