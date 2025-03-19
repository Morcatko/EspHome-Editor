import * as YAML from "yaml";

export const yamlParse = (yaml: string) => YAML.parseDocument(yaml, { intAsBigInt: true });