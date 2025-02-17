import type { languages } from "monaco-editor/esm/vs/editor/editor.api";
    
//Taken from https://github.com/microsoft/monaco-editor/blob/main/src/basic-languages/_.contribution.ts
interface ILangImpl {
    conf: languages.LanguageConfiguration;
    language: languages.IMonarchLanguage;
}

export const esphomeLanguageId = "esphome";

//based on https://github.com/esphome/dashboard/blob/main/src/editor/monaco-provider.ts
export const initEspHomeLanguage = async () => {
    const monaco = await import("monaco-editor/esm/vs/editor/editor.api");
    monaco.languages.register({ id: esphomeLanguageId });

    //esphome is exact copy of YAML language so make a deep-copy of it and reuse
    const yaml = monaco.languages.getLanguages().find((lang) => lang.id === "yaml")
    const res = await (yaml as any).loader() as ILangImpl;
    const esphomeLanguageConfig = structuredClone(res.conf);
    const espHomeMonarchTokens = structuredClone(res.language);
    delete espHomeMonarchTokens["languageId"];

    monaco.languages.setLanguageConfiguration(esphomeLanguageId, esphomeLanguageConfig);
    monaco.languages.setMonarchTokensProvider(esphomeLanguageId, espHomeMonarchTokens);
}