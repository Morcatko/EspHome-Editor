import path from "path";
import { getEspHomeUrls } from "./utils/ha-client";

const cwd = process.cwd() + "/";
const optimize = path.normalize;

export const initConfig = async () => {
    const ENV_WORKFOLDER = optimize(cwd + (process.env.WORK_FOLDER || "/work-folder/"));
    const ENV_ESPHOME_URL = process.env.ESPHOME_URL?.replace(/\/+$/, "");
    const ENV_HA_URL = process.env.HA_URL?.replace(/\/+$/, "") ?? "http://supervisor";
    const ENV_SUPERVISOR_TOKEN = process.env.SUPERVISOR_TOKEN;

    const mode = ENV_SUPERVISOR_TOKEN ? "ha_addon" : "standalone";

    process.env.E4E_VERSION = (await import("../../package.json")).version;
    process.env.E4E_DEVICES_DIR = optimize(ENV_WORKFOLDER + "/devices");
    process.env.E4E_MODE = mode;
    if (mode === "ha_addon") {
        const urls = await getEspHomeUrls(ENV_HA_URL, ENV_SUPERVISOR_TOKEN!);
        process.env.E4E_ESPHOME_API_URL = urls?.apiUrl;
        process.env.E4E_ESPHOME_WEB_URL = urls?.webUrl;

    } else {
        process.env.E4E_ESPHOME_API_URL = ENV_ESPHOME_URL ?? "";
        process.env.E4E_ESPHOME_WEB_URL = ENV_ESPHOME_URL ?? "";
    }
};

export const c = {
    get espHomeApiUrl() {
        return process.env.E4E_ESPHOME_API_URL || "";
    },
    get espHomeWebUrl() {
        return process.env.E4E_ESPHOME_WEB_URL || "";
    },
    get devicesDir() {
        return process.env.E4E_DEVICES_DIR || "";
    },
    get mode(): "ha_addon" | "standalone" | "unknown" {
        return (process.env.E4E_MODE || "unknown") as any;
    },
    get version() {
        return process.env.E4E_VERSION || "unknown";
    }
};
