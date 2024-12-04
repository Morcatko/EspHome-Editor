import path from "path";
const cwd = process.cwd() + "/";

const optimize = path.normalize;

export const workFolder = optimize(cwd + (process.env.WORK_FOLDER || "/work-folder/"));
export const devicesDir = optimize(workFolder + "/devices");
export const espHomeUrl = process.env.ESPHOME_URL?.replace(/\/+$/, "");
export const haUrl = process.env.HA_URL?.replace(/\/+$/, "") ?? "http://supervisor";
export const haToken = process.env.SUPERVISOR_TOKEN;
