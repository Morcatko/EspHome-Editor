import { log } from "@/shared/log";
import { getDeviceDir } from "./utils";
import { compileFile, getFileInfo } from "./template-processors";
import { listDirEntries } from "@/server/utils/fs-utils";
import { mergeEspHomeYamlFiles } from "./template-processors/yaml-merger";
import { patchEspHomeYaml } from "./template-processors/yaml-patcher";
import { TLog } from "./result-types";

type TCompileDeviceResult = {
    success: boolean;
    value: string;
    logs: TLog[];
}

export const tryCompileDevice = async (device_id: string) => {
    log.debug("Compiling device", device_id);

    const result = <TCompileDeviceResult>{
        success: false,
        value: "",
        logs: [],
    };

    const deviceDirectory = getDeviceDir(device_id);

    const fileEntries = await listDirEntries(deviceDirectory, (e) => e.isFile());
    const inputFiles = fileEntries
        .map(f => ({
            path: f.name,
            info: getFileInfo(f.name)
        }));

    const outputYamls: string[] = [];
    for (const file of inputFiles.filter(i => i.info.type === "basic")) {
        try {
            const output = await compileFile(device_id, file.path, false);
            outputYamls.push(output);
            result.logs.push({
                type: "info",
                message: `Compiled file ${file.path}`,
            });
        } catch (e) {
            result.logs.push({
                type: "error",
                message: `Error compiling file ${file.path}`,
                exception: e?.toString(),
            });
            return result;
        }
    }

    log.debug("Merging compiled configurations", device_id);
    const mergeResult = mergeEspHomeYamlFiles(outputYamls);
    result.logs.push(...mergeResult.logs);
    if (!mergeResult.success)
        return result;
    log.success("Merged compiled configurations", device_id);


    const outputPatches: string[] = [];
    for (const file of inputFiles.filter(i => i.info.type === "patch")) {

        try {
            const output = await compileFile(device_id, file.path, false);
            outputPatches.push(output);
            result.logs.push({
                type: "info",
                message: `Compiled patch file ${file.path}`,
            });
        }
        catch (e) {
            result.logs.push({
                type: "error",
                message: `Error compiling patch file ${file.path}`,
                exception: e?.toString(),
            });
            return result;
        }
    }

    log.debug("Patching configuration", device_id);
    const patchedYaml = patchEspHomeYaml(mergeResult.value, outputPatches);
    log.success("Patched configuration", device_id);

    result.value = patchedYaml.toString();
    result.success = true;
    return result;
}