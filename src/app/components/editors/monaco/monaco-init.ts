import { useEffect, useState } from 'react';
import { loader } from "@monaco-editor/react";

const init = async () => {
  //Monaco editor based on https://github.com/graphql/graphiql/blob/main/examples/monaco-graphql-nextjs/next.config.js
  const monaco = await import('monaco-editor');
  loader.config({ monaco });

  //Themes based on
  //https://github.com/microsoft/vscode/blob/main/src/vs/editor/standalone/common/themes.ts
  //https://github.com/esphome/dashboard/blob/main/src/editor/monaco-provider.ts
  
  monaco.editor.defineTheme("esphome-light", {
    base: "vs", // can also be vs-dark or hc-black
    inherit: true, // can also be false to completely replace the builtin rules
    rules: [
      { token: "key", foreground: "008080" },  //Key same as type
      { token: "type", foreground: "0451A5" }, //Type same as string.yaml
      //{ token: "number", foreground: "098658" },
    ],
    colors: {}
  });

  monaco.editor.defineTheme("esphome-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "key", foreground: "3DC9B0" },  //Key same as type
      { token: "type", foreground: "CE9178" } //Type same as string.yaml
    ],
    colors: {},
  });


  const espHomeLanguage = await import('./esphome-language');
  await espHomeLanguage.init();
  const relaxedJsonLanguage = await import('./relaxed-json-language');
  await relaxedJsonLanguage.init();

  //console.log(monaco.editor.tokenize("  reboot_timeout: 0s", "esphome"));
  //console.log(monaco.editor.tokenize("  ssid: 'abc'", "esphome"));
}

export const useMonacoInit = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    init().then(() => setLoaded(true));
  }, []);
  return loaded;
}