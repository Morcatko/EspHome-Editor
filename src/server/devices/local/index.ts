import { compileDevice } from "./compiler";
import { compileFile } from "./template-processors";
import { createDevice, createDirectory, createFile, deleteDevice, deletePath, getDevices, getFileContent, renameFile, saveFileContent, tryGetFileContent } from "./files";
import { ManifestUtils } from "./manifest-utils";

export const local = {
    getDevices,
    createDirectory,
    createFile,
    getFileContent,
    tryGetFileContent,
    saveFileContent,
    createDevice,
    togglePathEnabled : ManifestUtils.togglePathEnabled,
    renameFile,
    deletePath,
    deleteDevice,
    compileFile,
    compileDevice,
}