import { readFile } from "node:fs/promises";
import { marked } from "marked";
import { processTemplate_eta } from "./eta";
import { fixPath, getDevicePath } from "../utils";
import { fileExists } from "@/server/utils/fs-utils";


export type TLanguge = "plaintext" | "esphome" | "patch" | "etajs" | "markdown";

type FileInfo = {
    enabled: boolean;
    type: "basic" | "patch" | "none",
    language: TLanguge;
};



export const getFileInfo = (file_path: string): FileInfo => {
    const enabled = !file_path.endsWith(".");
    const lower = (enabled ? file_path : file_path.slice(0, -1))
        .toLowerCase();
    if (lower.endsWith(".patch.yaml")) {
        return {
            enabled,
            type: "patch",
            language: "patch"
        };
    } else if (lower.endsWith(".yaml")) {
        return {
            enabled,
            type: "basic",
            language: "esphome"
        };
    } else if (lower.endsWith(".patch.eta")) {
        return {
            enabled,
            type: "patch",
            language: "etajs"
        };
    } else if (lower.endsWith(".eta")) {
        return {
            enabled,
            type: "basic",
            language: "etajs"
        };
    } else if (lower.endsWith(".txt")) {
        return {
            enabled,
            type: "none",
            language: "plaintext"
        }
    } else if (lower.endsWith(".md")) {
        return {
            enabled,
            type: "none",
            language: "markdown"
        }
    } else {
        return {
            enabled,
            type: "none",
            language: "plaintext"
        }
    }
}

export const compileFile = async (device_id: string, file_path: string, useTestData: boolean) => {
    const fullFilePath = await getDevicePath(device_id, file_path);
    const fixedFilePath = fixPath(file_path);
    const fileInfo = getFileInfo(file_path);
    switch (fileInfo.language) {
        case "etajs":
            const testDataPath = await getDevicePath(device_id, file_path + ".testdata");
            const testData = useTestData && await fileExists(testDataPath)
                ? await readFile(testDataPath, 'utf-8')
                : null;
            return processTemplate_eta(device_id + "/" + fixedFilePath, testData);
        case "patch":
        case "esphome":
        case "plaintext":
            return readFile(fullFilePath, 'utf-8');
        case "markdown":
            const md = await readFile(fullFilePath, 'utf-8');
            return marked.parse(md);
        default:
            throw new Error(`Unsupported language:${fileInfo.language}`);
    }
};
