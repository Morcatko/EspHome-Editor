import path from "path";

const cwd = process.cwd() + "/";
const optimize = path.normalize;

export const initConfig = async () => {
    const ENV_WORKFOLDER = optimize(cwd + (process.env.WORK_FOLDER || "/work-folder/"));
    const ENV_ESPHOME_URL = process.env.ESPHOME_URL?.replace(/\/+$/, "");

    process.env.EE_VERSION = (await import("../../package.json")).version;
    process.env.EE_DEVICES_DIR = optimize(ENV_WORKFOLDER + "/devices");
    process.env.EE_ESPHOME_URL = ENV_ESPHOME_URL;
};

export const c = {
    get espHomeUrl() {
        return process.env.EE_ESPHOME_URL ||"";
    },
    get devicesDir() {
        return process.env.EE_DEVICES_DIR ||"";
    },
    get version() {
        return process.env.EE_VERSION || "unknown";
    }
};
