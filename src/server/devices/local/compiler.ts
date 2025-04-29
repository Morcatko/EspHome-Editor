import { log } from "@/shared/log";
import { getDeviceDir, getDevicePath } from "./utils";
import { compileFile, getFileInfo } from "./template-processors";
import { listDirEntries } from "@/server/utils/fs-utils";
import { mergeEspHomeYamlFiles } from "./template-processors/yaml-merger";
import { patchEspHomeYaml } from "./template-processors/yaml-patcher";

export const compileDevice = async (device_id: string) => {
    log.debug("Compiling device", device_id);
    const deviceDirectory = getDeviceDir(device_id);

    const fileEntries = await listDirEntries(deviceDirectory, (e) => e.isFile());
    const inputFiles = fileEntries
    .map(f => ({
        path: f.name,
        info: getFileInfo(f.name)
    }));
    
    const outputYamls: string[] = [];
    for (const file of inputFiles.filter(i => i.info.type === "basic")) {
        const filePath = getDevicePath(device_id, file.path)
        log.debug("Compiling Configuration", filePath);
        const output = await compileFile(device_id, file.path, false);
        log.success("Compiled Configuration", filePath);
        outputYamls.push(output);
    }
    
    log.debug("Merging compiled configurations", device_id);
    const mergedYaml = mergeEspHomeYamlFiles(outputYamls);
    log.success("Merged compiled configurations", device_id);
    
    const outputPatches: string[] = [];
    for (const file of inputFiles.filter(i => i.info.type === "patch")) {
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