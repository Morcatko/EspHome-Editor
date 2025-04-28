import { yamlParse } from "@/server/utils/yaml-utils";
import { log } from "@/shared/log";
import * as YAML from "yaml";
import { isMap, isScalar, isSeq } from "yaml";

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
    const targetYaml = new YAML.Document();

    for (const yaml of yamls) {
        try {
            const yamlContent = yamlParse(yaml);
            mergeEspHomeYamls(targetYaml, yamlContent);
        } catch (e) {
            log.error("Error merging yaml", e, yaml);
            throw e;
        }
    }

    return targetYaml;
};
