import { readFile } from "node:fs/promises";
import { processTemplate_eta } from "./eta";
import { fixPath, getDevicePath } from "../utils";
import { fileExists } from "@/server/utils/fs-utils";
import { marked } from "marked";


export type TCompiler = "none" | "etajs" | "markdown" | "unknown";

type FileInfo = {
    type: "none" | "basic" | "patch" | "unknown",
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
    } else if (lower.endsWith(".eta")) {
        return {
            type: "basic",
            compiler: "etajs"
        };
    } else if (lower.endsWith(".md")) {
        return {
            type: "none",
            compiler: "markdown"
        }
    } else if (lower.endsWith(".txt")) {
        return {
            type: "none",
            compiler: "none"
        }
    } else {
        return {
            type: "unknown",
            compiler: "unknown"
        }
    }
}

export const compileFile = async (device_id: string, file_path: string, useTestData: boolean) => {
    const fullFilePath = getDevicePath(device_id, file_path);
    const fixedFilePath = fixPath(file_path);
    const fileInfo = getFileInfo(file_path);
    switch (fileInfo.compiler) {
        case "etajs":
            const testDataPath = getDevicePath(device_id, file_path + ".testdata");
            const testData = useTestData && await fileExists(testDataPath)
                ? await readFile(testDataPath, 'utf-8')
                : null;
            return processTemplate_eta(device_id + "/" + fixedFilePath, testData);
        case "markdown":
            const sourceData = await readFile(fullFilePath, 'utf-8');
            const html = marked.parse(sourceData.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/,""));
            return html;
        case "none":
            return readFile(fullFilePath, 'utf-8');
        default:
            throw new Error(`Unsupported file type:${fileInfo.compiler}`);
    }
};
