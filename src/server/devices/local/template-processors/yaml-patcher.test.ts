import { expect, test } from "vitest";
import * as YAML from "yaml";
import { patchYaml } from "./yaml-patcher";

const testDoc = YAML.parseDocument(`
  sensor: 
    - id: s1
    - id: s2`);


const patchTestDoc = (path: string, changesYaml: string) => patchYaml(testDoc, path, (YAML.parseDocument(changesYaml).contents as YAML.YAMLSeq).items as YAML.YAMLMap[]);

test("yamlPatch - set-map", () => {
  const changesDoc = `
- set:
    name: "Test Button 5"
    x: x`;

  const res = patchTestDoc("$.sensor[?(@.id==\"s1\")]", changesDoc);

  const s1 = (res.get("sensor") as YAML.YAMLSeq).get(0) as YAML.YAMLMap;
  expect(s1.get("name")).toEqual("Test Button 5");
  expect(s1.get("x")).toEqual("x");
});

test("yamlPatch - set-seq", () => {
  const changesDoc = `
- set:
  - name: "Test Button 5"
  - x: x`;

  const res = patchTestDoc("$.sensor[?(@.id==\"s1\")]", changesDoc);

  const s1 = (res.get("sensor") as YAML.YAMLSeq).get(0) as YAML.YAMLMap;
  expect(s1.get("name")).toEqual("Test Button 5");
  expect(s1.get("x")).toEqual("x");
});