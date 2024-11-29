import { log } from "@/shared/log";
import * as YAML from "yaml";

const mergeEspHomeYamls = (target: YAML.Document, yaml2: YAML.Document) => {
    if (!target.contents) {
        target.contents = new YAML.YAMLMap<YAML.Scalar<string>, unknown>();
    }
    const target_content = target.contents as YAML.YAMLMap<
        YAML.Scalar<string>,
        unknown
    >;

    const add_content = yaml2.contents as YAML.YAMLMap<
        YAML.Scalar<string>,
        unknown
    >;
    const result_items = target_content.items;

    add_content.items.forEach((item) => {
        const key = item.key.value;
        const result_item = result_items.find((i) => i.key.value === key);
        if (!result_item) {
            result_items.push(item);
        } else {
            if (
                (result_item.value instanceof YAML.YAMLSeq) &&
                (item.value instanceof YAML.YAMLSeq)
            ) {
                const result_values = result_item.value as YAML.YAMLSeq;
                const add_values = item.value as YAML.YAMLSeq;
                add_values.items.forEach((add_value) =>
                    result_values.items.push(add_value)
                );
            } else {
                //unsupported merge
            }
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
