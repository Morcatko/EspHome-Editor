import { expect, test } from "vitest";
import * as YAML from "yaml";
import { test_patchYaml } from "./yaml-patcher";

const testDoc = YAML.parseDocument(`
  sensor: 
    - id: s1
    - id: s2`);


const patchTestDoc = (path: string, changesYaml: string) => test_patchYaml(
  testDoc, 
  path, 
  (YAML.parseDocument(changesYaml,{ intAsBigInt: true }).contents as YAML.YAMLSeq).items as YAML.YAMLMap[]);

test("yamlPatch - set-map", () => {
  const changesDoc = `
- set:
    name: "set by map"
    x: by-map`;

  const res = patchTestDoc("$.sensor[?(@.id==\"s1\")]", changesDoc);

  const s1 = (res.get("sensor") as YAML.YAMLSeq).get(0) as YAML.YAMLMap;
  expect(s1.get("name")).toEqual("set by map");
  expect(s1.get("x")).toEqual("by-map");
});

test("yamlPatch - set-seq", () => {
  const changesDoc = `
- set:
  - name: "set by seq"
  - x: by-seq`;

  const res = patchTestDoc("$.sensor[?(@.id==\"s1\")]", changesDoc);

  const s1 = (res.get("sensor") as YAML.YAMLSeq).get(0) as YAML.YAMLMap;
  expect(s1.get("name")).toEqual("set by seq");
  expect(s1.get("x")).toEqual("by-seq");
});