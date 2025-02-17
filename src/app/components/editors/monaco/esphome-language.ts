import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { ESPHomeDocuments } from "@3rd-party/esphome-dashboard/src/editor/esphome-document";
import { HoverHandler } from "@3rd-party/esphome-dashboard/src/editor/hover-handler";
import { CompletionsHandler } from "@3rd-party/esphome-dashboard/src/editor/completions-handler";
import { DefinitionHandler } from "@3rd-party/esphome-dashboard/src/editor/definition-handler";
import { fromMonacoPosition } from "@3rd-party/esphome-dashboard/src/editor/editor-shims";
import { TextBuffer } from "@3rd-party/esphome-dashboard/src/editor/utils/text-buffer";

//Taken from https://github.com/microsoft/monaco-editor/blob/main/src/basic-languages/_.contribution.ts
interface ILangImpl {
    conf: monaco.languages.LanguageConfiguration;
    language: monaco.languages.IMonarchLanguage;
}

//based on https://github.com/esphome/dashboard/blob/main/src/editor/monaco-provider.ts
export const initEspHomeLanguage = async () => {
    const documents = new ESPHomeDocuments();

    monaco.languages.register({ id: "esphome" });

    const hoverHandler = new HoverHandler(documents);
    monaco.languages.registerHoverProvider("esphome", {
        provideHover: async function (model, position) {
            documents.update(model.uri.toString(), new TextBuffer(model));
            const hover = await hoverHandler.getHover(
                model.uri.toString(),
                fromMonacoPosition(position),
            );
            return hover;
        },
    });

    const completionsHandler = new CompletionsHandler(documents);
    monaco.languages.registerCompletionItemProvider("esphome", {
        provideCompletionItems: async function (model, position) {
            documents.update(model.uri.toString(), new TextBuffer(model));
            const completions = await completionsHandler.getCompletions(
                model.uri.toString(),
                fromMonacoPosition(position),
            );
            return { suggestions: completions };
        },
    });

    const definitionHandler = new DefinitionHandler(documents);
    monaco.languages.registerDefinitionProvider("esphome", {
        provideDefinition: async function (model, position) {
            documents.update(model.uri.toString(), new TextBuffer(model));
            const ret = await definitionHandler.getDefinition(
                model.uri.toString(),
                fromMonacoPosition(position),
            );
            if (!ret) return;

            return {
                uri: model.uri,
                range: {
                    startLineNumber: ret.range.start.line + 1,
                    startColumn: ret.range.start.character + 1,
                    endLineNumber: ret.range.end.line + 1,
                    endColumn: ret.range.end.character + 1,
                },
            };
        },
    });


    //esphome is exact copy of YAML language so make a deep-copy of it and reuse
    const yaml = monaco.languages.getLanguages().find((lang) => lang.id === "yaml")
    const res = await (yaml as any).loader() as ILangImpl;
    const esphomeLanguageConfig = structuredClone(res.conf);
    const espHomeMonarchTokens = structuredClone(res.language);
    delete espHomeMonarchTokens["languageId"];

    monaco.languages.setLanguageConfiguration("esphome", esphomeLanguageConfig);
    monaco.languages.setMonarchTokensProvider("esphome", espHomeMonarchTokens);
}