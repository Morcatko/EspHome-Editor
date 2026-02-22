import fs from "node:fs/promises";
import { fixPath, getDevicePath } from "./utils";
import { fileExists } from "@/server/utils/fs-utils";

type TManifestFileInfo = {
    disabled?: boolean;
}

type TManifest = {
    files: { [path: string]: TManifestFileInfo };
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

async function updateManifest(device_id: string, updateFn: (manifest: TManifest) => Promise<void>) {
    const manifest = await loadManifest(device_id);
    await updateFn(manifest);
    await saveManifest(device_id, manifest);
}

async function renameFile(device_id: string, old_path: string, new_path: string) {
    await updateManifest(device_id, async (manifest) => {
        old_path = fixPath(old_path);
        new_path = fixPath(new_path);
        if (manifest.files[old_path]) {
            manifest.files[new_path] = manifest.files[old_path];
            delete manifest.files[old_path];
        }
    });
}

async function deleteFile(device_id: string, path: string) {
    await updateManifest(device_id, async (manifest) => {
        path = fixPath(path);
        if (manifest.files[path]) {
            delete manifest.files[path];
        }
    });
}

async function togglePathEnabled(device_id: string, path: string) {
    await updateManifest(device_id, async (manifest) => {
        path = fixPath(path);
        if (!manifest.files[path])
            manifest.files[path] = {};

        manifest.files[path].disabled = manifest.files[path].disabled ? false : true;
    });
}

async function isPathDisabled(device_id: string, path: string) {
    const manifest = await loadManifest(device_id);
    path = fixPath(path);
    return !!(manifest.files[path]?.disabled);
}

export const ManifestUtils = {
    manifestFileName,
    renameFile,
    deleteFile,
    togglePathEnabled,
    isPathDisabled
}