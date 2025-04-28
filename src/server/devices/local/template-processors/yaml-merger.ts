import { yamlParse } from "@/server/utils/yaml-utils";
import { log } from "@/shared/log";
import * as YAML from "yaml";
import { isMap, isScalar, isSeq } from "yaml";
import { TOperationResult } from "../../types";

const mergeEspHomeYamls = (target: YAML.Document, source: YAML.Document) => {
    if (!source.contents) {
        return;
    }

    if (!target.contents) {
        target.contents = new YAML.YAMLMap<YAML.Scalar<string>, unknown>();
    }
    const tgtContent = target.contents as YAML.YAMLMap<
        YAML.Scalar<string>,
        unknown
    >;

    const srcContent = source.contents as YAML.YAMLMap<
        YAML.Scalar<string>,
        unknown
    >;
    const tgtItems = tgtContent.items;

    srcContent.items.forEach((srcItem) => {
        const key = srcItem.key.value;
        const tgtItem = tgtItems.find((i) => i.key.value === key);
        if (!tgtItem) {
            tgtItems.push(srcItem);
        } else {
            if (isScalar(srcItem.value) && (srcItem.value as YAML.Scalar).value === null) {
                return;
            }

            if (isMap(tgtItem.value) && isMap(srcItem.value)) {
                const tgtMap = tgtItem.value as YAML.YAMLMap;
                const srcMap = srcItem.value as YAML.YAMLMap;
                srcMap.items.forEach((srcMapItem) => tgtMap.add(srcMapItem));
                return;

            }
            if (isScalar(tgtItem.value) && (tgtItem.value.value === null)) {
                tgtItem.value = srcItem.value;
                return;
            }

            if (!isSeq(srcItem.value)) {
                throw new Error(`Unsupported merge - '${srcItem.value}'`);
            }
            if (!isSeq(tgtItem.value)) {
                throw new Error(`Unsupported merge - '${srcItem.value}'`);
            }

            const tgtValues = tgtItem.value as YAML.YAMLSeq;
            const srcValues = srcItem.value as YAML.YAMLSeq;
            srcValues.items.forEach((srcValue) =>
                tgtValues.items.push(srcValue)
            );
        }
    });
};

export const mergeEspHomeYamlFiles = (yamls: string[]) => {
    const result: TOperationResult<YAML.Document<YAML.Node, true>> = {
        success: false,
        value: new YAML.Document(),
        logs: [],
    };

    for (const yaml of yamls) {
        try {
            const yamlContent = yamlParse(yaml);
            mergeEspHomeYamls(result.value, yamlContent);
        } catch (e) {
            result.logs.push({
                type: "error",
                message: `Error merging yaml`,
                path: "unknown",
                data: yaml?.toString(),
                exception: e?.toString(),
            });
            log.error("Error merging yaml", e, yaml);
            return result;
        }
    }

    result.success = true;
    return result;
};
