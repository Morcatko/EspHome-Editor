import { expect, test } from "vitest";
import { slugifyFriendlyName } from "./utils";

test("slugifyFriendlyName", () => {
    expect(slugifyFriendlyName("My Device")).toEqual("my-device");
    expect(slugifyFriendlyName("Čočka_na_kyseló")).toEqual("cocka-na-kyselo");
    expect(slugifyFriendlyName("Device__Name")).toEqual("device-name");
})