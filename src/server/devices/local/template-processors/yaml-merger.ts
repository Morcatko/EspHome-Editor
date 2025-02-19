import { log } from "@/shared/log";
import * as YAML from "yaml";
import { isScalar, isSeq } from "yaml";

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
            if (!isSeq(srcItem.value)) {
                //Unsupported merge
                return;
            }
            if (isScalar(tgtItem.value) && (tgtItem.value.value === null)) {
                tgtItem.value = srcItem.value;
                return;
            }
            if (!isSeq(tgtItem.value)) {
                //Unsupported merge
                return
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
            const yamlContent = YAML.parseDocument(yaml);
            mergeEspHomeYamls(targetYaml, yamlContent);
        } catch (e) {
            log.error("Error merging yaml", yaml, e);
            throw e;
        }
    }

    return targetYaml;
};
