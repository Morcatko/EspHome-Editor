import { useEffect, useState } from 'react';
import { loader } from "@monaco-editor/react";

const init = async () => {
  //Monaco editor based on https://github.com/graphql/graphiql/blob/main/examples/monaco-graphql-nextjs/next.config.js
  const monaco = await import('monaco-editor');
  loader.config({ monaco });

  const themes = await import ("./themes");
  await themes.init();
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