import { parse } from "@/server/yamlpath";
import * as YAML from "yaml";
import { isMap, isSeq } from "yaml";
import { TOperationResult } from "../../types";

const patchYaml = (target: YAML.Document, path: string, changes: YAML.YAMLMap[]) => {
    const nodesToChange = parse(target, path);

    for (const change of changes) {
        const pair = change.items[0] as YAML.Pair<YAML.Scalar, unknown>;
        const operation = pair.key.value;

        const values = isSeq(pair.value)
            ? (pair.value as YAML.YAMLSeq<YAML.YAMLMap>).items.flatMap(item => (item as YAML.YAMLMap).items)
            : (pair.value as YAML.YAMLMap).items;

        for (const nodeToChange of nodesToChange) {
            if (isMap(nodeToChange)) {
                if (operation === "add") {
                    for (const value of values) {
                        nodeToChange.add(value, true);
                    }
                } else if (operation === "set") {
                    for (const value of values) {
                        nodeToChange.add(value, true);
                    }
                } else {
                    throw new Error("Unsupported operation");
                }
            } else {
                throw new Error("Unsupported node type");
            }
        }
        /*
        const key = change.items[0].key.toString();
        const value = change.items[0].value;
        if (isMap(nodeToChange)) {
            const pair = new YAML.Pair(new YAML.Scalar(key), value);
            nodeToChange.add(pair, true);
        } else {
            throw new Error("Unsupported node type");
        }*/
    }
};

export const test_patchYaml = (target: YAML.Document, path: string, changes: YAML.YAMLMap[]) => {
    patchYaml(target, path, changes);
    return target;
}

export const tryPatchEspHomeYaml = (target: YAML.Document, patches: TFileContent[]) => {
    const result: TOperationResult<YAML.Document<YAML.Node, true>> = {
        success: false,
        value: target,
        logs: [],
    };

    try {
        for (const patchJob of patches) {
            try {
                const patch = YAML.parseDocument(patchJob.value, { intAsBigInt: true });
                const contents = patch.contents;

                if (!(isSeq(contents))) {
                    throw new Error("Document root must be YAMLSeq");
                } else {
                    for (const item of contents.items) {
                        if (!(isMap(item))) {
                            throw new Error("Item must be YAMLMap");
                        } else {
                            const patch = item.items[0];
                            if ((YAML.isPair(patch))
                                && (isSeq(patch.value))) {
                                const path = patch.key.toString();
                                const patches = patch.value.items as YAML.YAMLMap[];
                                patchYaml(target, path, patches);
                            }
                            else {
                                throw new Error("Invalid patch format");
                            }
                        }
                    }
                }

                result.logs.push({
                    type: "info",
                    message: `Patch applied successfully`,
                    path: patchJob.path
                });
            } catch (e) {
                result.logs.push({
                    type: "error",
                    message: `Error applying patch - ${e?.toString() ?? "no more info"}`,
                    path: patchJob.path
                });
                return result;
            }
        }
    } catch (e) {
        result.logs.push({
            type: "error",
            message: `Error patching YAML - ${e?.toString() ?? "no more info"}`,
            path: "",
        });
        return result;
    }

    result.success = true;
    return result;
};