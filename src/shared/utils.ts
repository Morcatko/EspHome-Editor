//Taken from esphome
const ALLOWED_NAME_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789-";
const allowedCharsRegex = new RegExp(`[^${ALLOWED_NAME_CHARS}]`, "g");

// Convert device name to a safe directory name
// Similar to esphome's implementation:
export const slugifyFriendlyName = (name: string) =>
    name
        .normalize("NFD").replaceAll(/[\u0300-\u036f]/g, "")   //https://www.codu.co/articles/remove-accents-from-a-javascript-string-skgp1inb
        .toLowerCase()
        .replaceAll(" ", "_")
        .replaceAll("-", "_")
        .replaceAll("__", "_")
        .replaceAll("_", "-")
        .replaceAll(allowedCharsRegex, "")
        .replace(/^-+|-+$/g, "");