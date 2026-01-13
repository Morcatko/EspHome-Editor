import { expect, test } from "vitest";
import * as YAML from "yaml";
import { test_patchYaml } from "./yaml-patcher";
import { yamlParse } from "@/server/utils/yaml-utils";

const patchDoc = (docYaml: string, path: string, changesYaml: string) => {
  const doc = yamlParse(docYaml);
  const changes = (yamlParse(changesYaml).contents as YAML.YAMLSeq).items as YAML.YAMLMap[];
  return test_patchYaml(doc, path, changes);
}
const testDoc = `
  sensor: 
    - id: s1
    - id: s2`;


const patchTestDoc = (path: string, changesYaml: string) => 
  patchDoc(testDoc, path, changesYaml);

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

test("yamlPatch - add-map", () => {
  const changesDoc = `
- add:
    name: "added by map"
    y: by-map`;
  const res = patchTestDoc("$.sensor[?(@.id==\"s1\")]", changesDoc);
  const s1 = (res.get("sensor") as YAML.YAMLSeq).get(0) as YAML.YAMLMap;
  expect(s1.get("name")).toEqual("added by map");
  expect(s1.get("y")).toEqual("by-map");
});

test("yamlPatch - add-seq", () => {
  const changesDoc = `
- add:
    - id: s3
      name: "added by map"
    - id: s4
      y: by-map`;

  const res = patchTestDoc("$.sensor", changesDoc);
  const s3 = (res.get("sensor") as YAML.YAMLSeq).get(2) as YAML.YAMLMap;
  expect(s3.get("id")).toEqual("s3");
  expect(s3.get("name")).toEqual("added by map");
  const s4 = (res.get("sensor") as YAML.YAMLSeq).get(3) as YAML.YAMLMap;
  expect(s4.get("id")).toEqual("s4");
  expect(s4.get("y")).toEqual("by-map");
});

test("yamlPatch - add to empty", () => {
  const changesDoc = `
- add:
  - id: s1
    name: "added to empty"
  - id: s2
    name: "added to empty 2"`;

  const res = patchDoc(`sensor:`, `$.sensor`, changesDoc);
  const s1 = (res.get("sensor") as YAML.YAMLSeq).get(0) as YAML.YAMLMap;
  expect(s1.get("id")).toEqual("s1");
  expect(s1.get("name")).toEqual("added to empty");
  const s2 = (res.get("sensor") as YAML.YAMLSeq).get(1) as YAML.YAMLMap;
  expect(s2.get("id")).toEqual("s2");
  expect(s2.get("name")).toEqual("added to empty 2");
});