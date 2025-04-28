import { listDirEntries } from "@/server/utils/fs-utils";
import { ManifestUtils } from "./manifest-utils";
import { TLocalDirectory, TLocalFile, TLocalFileOrDirectory } from "../types";
import { getFileInfo } from "./template-processors";

export const awaitArray = async <T>(arr: Promise<T>[]): Promise<T[]> =>
    (await Promise
        .allSettled(arr))
        .map((r) => r.status === "fulfilled" ? r.value : null)
        .filter((r) => r !== null)
        .map((r) => r as T);

export const scanDirectory = async (device_id: string, fullPath: string, parentPath: string | null, parentEnabled: boolean): Promise<TLocalFileOrDirectory[]> => {
    const resAsync =
        (await listDirEntries(fullPath, _ => true))
            .map(async (e) => {
                const path = parentPath ? `${parentPath}/${e.name}` : e.name;
                if (e.isDirectory()) {
                    const enabled = parentEnabled && await ManifestUtils.isPathEnabled(device_id, path);
                    return <TLocalDirectory>{
                        id: e.name,
                        name: e.name,
                        path: path,
                        enabled: enabled,
                        type: "directory",
                        files: await scanDirectory(device_id, `${fullPath}/${e.name}`, path, enabled),
                    };
                } else {
                    if (e.name.endsWith(".testdata") || (e.name == ManifestUtils.manifestFileName))
                        return null;

                    return <TLocalFile>{
                        id: e.name,
                        name: e.name,
                        path: path,
                        enabled: parentEnabled && await ManifestUtils.isPathEnabled(device_id, path),
                        language: getFileInfo(e.name).language,
                        type: "file",
                    };
                }
            });

    return (await awaitArray(resAsync))
        .filter((e) => e !== null)
        .sort((a, b) => a.type.localeCompare(b.type));
};


export const flattenTree = (tree: TLocalFileOrDirectory[]): TLocalFileOrDirectory[] => {
    const res: TLocalFileOrDirectory[] = [];

    for (const entry of tree.filter(e => e.enabled)) {
        res.push(entry);
        if (entry.type === "directory") {
            const subEntries = flattenTree(entry.files ?? []);
            res.push(...subEntries);
        }
    }

    return res;
}