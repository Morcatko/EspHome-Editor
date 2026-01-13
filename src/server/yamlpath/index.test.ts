import * as YAML from "yaml";
import { readFile } from "node:fs/promises";
import { expect, test } from 'vitest'
import { parse } from '.';

const loadYaml = async (name: string) => {
    const yamlString = await readFile("./src/server/yamlpath/" + name, "utf-8");
    return YAML.parseDocument(yamlString);
};

const yamlDocument = await loadYaml("test-sample1.yaml");


const _test = (path: string) => {
    const result = parse(
        yamlDocument, 
        path);
    /*console.log("final result: ", result);
    console.log("..............");
    console.log(new Date());*/
    return result;
}

test("simple path", () => {
    const actual = _test("$.esphome.name");
    expect(actual[0]).toBe("plc-01");
})

test("simple path - multiple", () => {
    const actual = _test("$.binary_sensor.id");
    expect(actual).toStrictEqual(["mbc_0x01_input_0x01", "mbc_0x01_input_0x02", "mbc_0x01_input_0x03"]);
})

test("attribute equals string", () => {
    const actual = _test("$.binary_sensor[?(@.id=='mbc_0x01_input_0x02')]");
    expect(actual.length).toBe(1);
    expect((actual[0] as YAML.YAMLMap).items.length).toBe(3);
    expect((actual[0] as YAML.YAMLMap).get("id")).toBe("mbc_0x01_input_0x02");
});

test("empty node", () => {
    const actual = _test("$.cover");
    //Seq is needed for YAMLPatch to add items
    //set would need YAMLMap which sucks
    expect(YAML.isSeq(actual[0])).toBeTruthy();
});