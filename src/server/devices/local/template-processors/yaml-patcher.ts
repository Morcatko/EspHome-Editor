import { parse } from "@/server/yamlpath";
import * as YAML from "yaml";

const patchYaml = (target: YAML.Document, path: string, changes: YAML.YAMLMap[]) => {

    const nodesToChange = parse(target, path);

    for(const change of changes) {
        const pair = change.items[0] as YAML.Pair<YAML.Scalar, unknown>;
        const operation = pair.key.value;
        const value = (pair.value as YAML.YAMLMap).items[0];

        for(const nodeToChange of nodesToChange) {
            if (nodeToChange instanceof YAML.YAMLMap) {
                if (operation === "add") {
                    nodeToChange.add(value, true);
                } else if (operation === "set") {
                    nodeToChange.add(value, true);
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
        if (nodeToChange instanceof YAML.YAMLMap) {
            const pair = new YAML.Pair(new YAML.Scalar(key), value);
            nodeToChange.add(pair, true);
        } else {
            throw new Error("Unsupported node type");
        }*/
    }
};

export const patchEspHomeYaml = (target: YAML.Document, patches: string[]) => {
    for (const patchString of patches) {
        const patch = YAML.parseDocument(patchString);
        const contents = patch.contents;

        if (!(contents instanceof YAML.YAMLSeq)) {
            throw new Error("Document root must be YAMLSeq");
        }
        else {
            for (const item of contents.items) {
                if (!(item instanceof YAML.YAMLMap)) {
                    throw new Error("Item must be YAMLMap");
                }else {
                    const patch = item.items[0];
                    if ((patch instanceof YAML.Pair)
                        && (patch.value instanceof YAML.YAMLSeq))
                         {
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
    }
    return target;
};