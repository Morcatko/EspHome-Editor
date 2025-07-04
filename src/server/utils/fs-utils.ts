import { type Dirent } from "node:fs";
import fs from "node:fs/promises";

export const directoryExists = async (path: string) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

export const fileExists = directoryExists;

export async function listDirEntries(
  path: string,
  predicate?: (item: Dirent) => boolean | Promise<boolean>,
) {
  const dirs = await fs.readdir(path, { withFileTypes: true });
  return predicate ? dirs.filter(predicate) : dirs;
}