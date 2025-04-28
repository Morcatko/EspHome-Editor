import { compileDevice } from "./compiler";
import { compileFile } from "./template-processors";
import { createDevice, createDirectory, createFile, deleteDevice, deletePath, getDevices, getFileContent, renameFile, saveFileContent, tryGetFileContent } from "./files";

export const local = {
    getDevices,
    createDirectory,
    createFile,
    getFileContent,
    tryGetFileContent,
    saveFileContent,
    createDevice,
    renameFile,
    deletePath,
    deleteDevice,
    compileFile,
    compileDevice,
}