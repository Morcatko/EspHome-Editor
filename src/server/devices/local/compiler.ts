import { log } from "@/shared/log";
import {  getDevicePath } from "./utils";
import { compileFile, getFileInfo } from "./template-processors";
import { listDirEntries } from "@/server/utils/fs-utils";
import { tryMergeEspHomeYamlFiles } from "./template-processors/yaml-merger";
import { tryPatchEspHomeYaml } from "./template-processors/yaml-patcher";
import { TOperationResult } from "../types";
import { ManifestUtils } from "./manifest-utils";
import { join } from "path";

async function listRecursiveFiles(device_id: string, relative_path: string): Promise<string[]> {
    const result: string[] = [];
    const entries = await listDirEntries(
        getDevicePath(device_id, relative_path),
        relative_path
            ? undefined
            : (p) => (p.isDirectory() && p.name !== ".lib")
            || (p.isFile() && p.name !== ManifestUtils.manifestFileName)
        );

    for (const entry of entries) {
        const path = join(relative_path, entry.name);

        if (!await ManifestUtils.isPathDisabled(device_id, path)) {
            if (entry.isDirectory()) {
                const subFiles = await listRecursiveFiles(device_id, path);
                result.push(...subFiles);
            } else if (entry.isFile()) {
                result.push(path);
            }
        }
    }

    return result;
}

export const compileDevice = async (device_id: string) => {
    log.debug("Compiling device", device_id);

    const result: TOperationResult<string> = {
        success: false,
        value: "",
        logs: [],
    };

    const files = await listRecursiveFiles(device_id, '');
    const inputFiles = files.map(f => ({
        path: f,
        info: getFileInfo(f)
    }));

    console.log("Input files", inputFiles);

    const compiledYamls: TFileContent[] = [];
    for (const file of inputFiles.filter(i => i.info.type === "basic")) {
        const isFileDisabled = await ManifestUtils.isPathDisabled(device_id, file.path);
        if (isFileDisabled) {
            log.debug("Skipping disabled file", file.path);
            continue;
        }

        try {
            compiledYamls.push({
                path: file.path,
                value: await compileFile(device_id, file.path, false),
            });

            result.logs.push({
                type: "info",
                path: file.path,
                message: "Compiling file",
            });
        } catch (e) {
            result.logs.push({
                type: "error",
                path: file.path,
                message: `Error compiling file - ${e?.toString() ?? "no more info"}`,
            });
            return result;
        }
    }

    log.debug("Merging compiled configurations", device_id);
    const mergeResult = tryMergeEspHomeYamlFiles(compiledYamls);
    result.logs.push(...mergeResult.logs);
    if (!mergeResult.success)
        return result;
    log.success("Merged compiled configurations", device_id);

    const compiledPatches: TFileContent[] = [];
    for (const file of inputFiles.filter(i => i.info.type === "patch")) {
        const isFileDisabled = await ManifestUtils.isPathDisabled(device_id, file.path);
        if (isFileDisabled) {
            log.debug("Skipping disabled file", file.path);
            continue;
        }

        try {
            compiledPatches.push({
                path: file.path,
                value: await compileFile(device_id, file.path, false),
            });

            result.logs.push({
                type: "info",
                path: file.path,
                message: "Compiling patch file",
            });
        }
        catch (e) {
            result.logs.push({
                type: "error",
                path: file.path,
                message: `Error compiling patch file - ${e?.toString() ?? "no more info"}`
            });
            return result;
        }
    }

    log.debug("Patching configuration", device_id);
    const patchResult = tryPatchEspHomeYaml(mergeResult.value, compiledPatches);
    result.logs.push(...patchResult.logs);
    if (!patchResult.success)
        return result;
    log.success("Patched configuration", device_id);

    result.value = patchResult.value.toString();
    result.success = true;
    return result;
}