import { expect, test } from "vitest";
import { mergeEspHomeYamlFiles } from "./yaml-merger";
import { yamlParse } from "@/server/utils/yaml-utils";

const _testMerge = (expectedYaml: string, ...yamls: string[]) => {
    const expected = yamlParse(expectedYaml);
    const actual = mergeEspHomeYamlFiles(yamls);
    expect(actual.toString()).toEqual(expected.toString());
}

test("merge different keys", () => {
    _testMerge(`
test1: abc
test2: def
test3: ghi`,
        `test1: abc`,
        `test2: def`,
        `test3: ghi`);
})

test("merge same keys", () => {
    _testMerge(`
buttons:
    - id: b_1
      name: "button 1"
    - id: b_2
      name: "button 2"
    - id: b_a
      name: "button a"`,
        `
buttons:
    - id: b_1
      name: "button 1"
    - id: b_2
      name: "button 2"`, `
buttons:
    - id: b_a
      name: "button a"`);
});

test ("merge - empty", () => {
  _testMerge(`
buttons:
  - id: b_a
    name: "button a"`,
    ``,`
buttons:
  - id: b_a
    name: "button a"`);
});

test("merge same keys - first empty - does not work", () => {
    _testMerge(`
buttons:
    - id: b_a
      name: "button a"`,
        `
buttons:`, `
buttons:
    - id: b_a
      name: "button a"`);
});

test("merge same keys - second empty", () => {
    _testMerge(`
buttons:
    - id: b_a
      name: "button a"`,
        `
buttons:
    - id: b_a
      name: "button a"`,
        `buttons:`);
});

test("bigInts (Issue #101)", () => {
  const doc = `
sensor:
    - platform: dallas_temp
      address: 0x323cc1e38143aa28`;

  _testMerge(doc, doc);
});