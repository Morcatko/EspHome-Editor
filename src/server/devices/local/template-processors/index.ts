import { readFile } from "node:fs/promises";
import { processTemplate_eta } from "./eta";
import { getDevicePath } from "../utils";


export type TCompiler = "none" | "etajs" | "unknown";

type FileInfo = {
    type: "basic" | "patch" |"unknown",
    compiler: TCompiler
};


export const getFileInfo = (file_path: string): FileInfo => {
    const lower = file_path.toLowerCase();
    if (lower.endsWith(".patch.yaml")) {
        return {
            type: "patch",
            compiler: "none"
        };
    } else if (lower.endsWith(".yaml")) {
        return {
            type: "basic",
            compiler: "none"
        };
    } else if (lower.endsWith(".patch.eta")) {
        return {
            type: "patch",
            compiler: "etajs"
        };
    }
    else if (lower.endsWith(".eta")) {
        return {
            type: "basic",
            compiler: "etajs"
        };
    } else {
        return {
            type: "unknown",
            compiler: "unknown"
        }
    }
}

export const compileFile = async (device_id: string, file_path: string, testData: string | null) => {
    const filePath = getDevicePath(device_id, file_path);
    const fileInfo = getFileInfo(file_path);
    switch (fileInfo.compiler) {
        case "etajs":
            return processTemplate_eta(device_id + "/" + file_path, testData);
        case "none":
            return readFile(filePath, 'utf-8');
        default:
            throw new Error(`Unsupported file type:${fileInfo.compiler}`);
    }
};
