import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { darkTheme, lightTheme } from "./useMonacoTheme";

export const init = async () => {
    //Themes based on
    //https://github.com/microsoft/vscode/blob/main/src/vs/editor/standalone/common/themes.ts
    //https://github.com/esphome/dashboard/blob/main/src/editor/monaco-provider.ts

    monaco.editor.defineTheme(lightTheme, {
        base: "vs", // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
            { token: "key", foreground: "008080" },  //Key same as type
            { token: "type", foreground: "0451A5" }, //Type same as string.yaml
            //{ token: "number", foreground: "098658" },
        ],
        colors: {}
    });

    monaco.editor.defineTheme(darkTheme, {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "key", foreground: "3DC9B0" },  //Key same as type
            { token: "type", foreground: "CE9178" } //Type same as string.yaml
        ],
        colors: {}
    });
}