import { tryCompileDevice } from "./compiler";
import { createDevice, createDirectory, createFile, deleteDevice, deletePath, getDevices, getFileContent, renameFile, saveFileContent, tryGetFileContent } from "./files";
import { compileFile } from "./template-processors";

export const local = {
    getDevices,
    createDirectory,
    createFile,
    getFileContent,
    tryGetFileContent,
    saveFileContent,
    compileFile,
    createDevice,
    renameFile,
    deletePath,
    deleteDevice,
    tryCompileDevice
}