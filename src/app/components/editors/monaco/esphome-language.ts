import monaco from "monaco-editor/esm/vs/editor/editor.api";
const yamlLang = require('monaco-editor/esm/vs/basic-languages/yaml/yaml.js');

import { ESPHomeDocuments } from "@3rd-party/esphome-dashboard/src/editor/esphome-document";
import { HoverHandler } from "@3rd-party/esphome-dashboard/src/editor/hover-handler";
import { CompletionsHandler } from "@3rd-party/esphome-dashboard/src/editor/completions-handler";
import { DefinitionHandler } from "@3rd-party/esphome-dashboard/src/editor/definition-handler";
import { fromMonacoPosition } from "@3rd-party/esphome-dashboard/src/editor/editor-shims";
import { TextBuffer } from "@3rd-party/esphome-dashboard/src/editor/utils/text-buffer";

import { esphomeLanguageId } from "./languages";

//based on https://github.com/esphome/dashboard/blob/main/src/editor/monaco-provider.ts
export const init = async () => {
  monaco.languages.register({ id: esphomeLanguageId });

  monaco.languages.setLanguageConfiguration(esphomeLanguageId, yamlLang.conf);
  //There is a difference between yaml and esphome in
  /*
   // String nodes
        [
          /.+?(?=(\s+#|$))/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "type" / "string"
            },
          },
        ],
      */
  monaco.languages.setMonarchTokensProvider(esphomeLanguageId, {
    tokenPostfix: `.${esphomeLanguageId}`,

    brackets: [
      { token: "delimiter.bracket", open: "{", close: "}" },
      { token: "delimiter.square", open: "[", close: "]" },
    ],

    keywords: [
      "true",
      "True",
      "TRUE",
      "false",
      "False",
      "FALSE",
      "null",
      "Null",
      "Null",
      "~",
    ],

    numberInteger: /(?:0|[+-]?[0-9]+)/,
    numberFloat: /(?:0|[+-]?[0-9]+)(?:\.[0-9]+)?(?:e[-+][1-9][0-9]*)?/,
    numberOctal: /0o[0-7]+/,
    numberHex: /0x[0-9a-fA-F]+/,
    numberInfinity: /[+-]?\.(?:inf|Inf|INF)/,
    numberNaN: /\.(?:nan|Nan|NAN)/,
    numberDate:
      /\d{4}-\d\d-\d\d([Tt ]\d\d:\d\d:\d\d(\.\d+)?(( ?[+-]\d\d?(:\d\d)?)|Z)?)?/,

    escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,

    tokenizer: {
      root: [
        { include: "@whitespace" },
        { include: "@comment" },

        // Directive
        [/%[^ ]+.*$/, "meta.directive"],

        // Document Markers
        [/---/, "operators.directivesEnd"],
        [/\.{3}/, "operators.documentEnd"],

        // Block Structure Indicators
        [/[-?:](?= )/, "operators"],

        { include: "@anchor" },
        { include: "@tagHandle" },
        { include: "@flowCollections" },
        { include: "@blockStyle" },

        // Numbers
        [/@numberInteger(?![ \t]*\S+)/, "number"],
        [/@numberFloat(?![ \t]*\S+)/, "number.float"],
        [/@numberOctal(?![ \t]*\S+)/, "number.octal"],
        [/@numberHex(?![ \t]*\S+)/, "number.hex"],
        [/@numberInfinity(?![ \t]*\S+)/, "number.infinity"],
        [/@numberNaN(?![ \t]*\S+)/, "number.nan"],
        [/@numberDate(?![ \t]*\S+)/, "number.date"],

        // Key:Value pair
        [
          /(".*?"|'.*?'|[^#'"]*?)([ \t]*)(:)( |$)/,
          ["type", "white", "operators", "white"],
        ],

        { include: "@flowScalars" },

        // String nodes
        [
          /.+?(?=(\s+#|$))/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "type",
            },
          },
        ],
      ],

      // Flow Collection: Flow Mapping
      object: [
        { include: "@whitespace" },
        { include: "@comment" },

        // Flow Mapping termination
        [/\}/, "@brackets", "@pop"],

        // Flow Mapping delimiter
        [/,/, "delimiter.comma"],

        // Flow Mapping Key:Value delimiter
        [/:(?= )/, "operators"],

        // Flow Mapping Key:Value key
        [/(?:".*?"|'.*?'|[^,\{\[]+?)(?=: )/, "type"],

        // Start Flow Style
        { include: "@flowCollections" },
        { include: "@flowScalars" },

        // Scalar Data types
        { include: "@tagHandle" },
        { include: "@anchor" },
        { include: "@flowNumber" },

        // Other value (keyword or string)
        [
          /[^\},]+/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "string",
            },
          },
        ],
      ],

      // Flow Collection: Flow Sequence
      array: [
        { include: "@whitespace" },
        { include: "@comment" },

        // Flow Sequence termination
        [/\]/, "@brackets", "@pop"],

        // Flow Sequence delimiter
        [/,/, "delimiter.comma"],

        // Start Flow Style
        { include: "@flowCollections" },
        { include: "@flowScalars" },

        // Scalar Data types
        { include: "@tagHandle" },
        { include: "@anchor" },
        { include: "@flowNumber" },

        // Other value (keyword or string)
        [
          /[^\],]+/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "identifier",
            },
          },
        ],
      ],

      // First line of a Block Style
      multiString: [[/^([ \t]+).+$/, "string", "@multiStringContinued.$1"]],

      // Further lines of a Block Style
      //   Workaround for indentation detection
      multiStringContinued: [
        [
          /^([ \t]*).+$/,
          {
            cases: {
              "$1~$S2[ \t]*": "string",
              "@default": { token: "@rematch", next: "@popall" },
            },
          },
        ],
      ],

      whitespace: [[/[ \t\r\n]+/, "white"]],

      // Only line comments
      comment: [[/#.*$/, "comment"]],

      // Start Flow Collections
      flowCollections: [
        [/\[/, "@brackets", "@array"],
        [/\{/, "@brackets", "@object"],
      ],

      // Start Flow Scalars (quoted strings)
      flowScalars: [
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/'[^']*'/, "string"],
        [/"/, "string", "@doubleQuotedString"],
      ],

      doubleQuotedString: [
        [/[^\\"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"],
      ],

      // Start Block Scalar
      blockStyle: [[/[>|][0-9]*[+-]?[ \t]*$/, "operators", "@multiString"]],

      // Numbers in Flow Collections (terminate with ,]})
      flowNumber: [
        [/@numberInteger(?=[ \t]*[,\]\}])/, "number"],
        [/@numberFloat(?=[ \t]*[,\]\}])/, "number.float"],
        [/@numberOctal(?=[ \t]*[,\]\}])/, "number.octal"],
        [/@numberHex(?=[ \t]*[,\]\}])/, "number.hex"],
        [/@numberInfinity(?=[ \t]*[,\]\}])/, "number.infinity"],
        [/@numberNaN(?=[ \t]*[,\]\}])/, "number.nan"],
        [/@numberDate(?=[ \t]*[,\]\}])/, "number.date"],
      ],

      tagHandle: [[/\![^ ]*/, "tag"]],

      anchor: [[/[&*][^ ]+/, "namespace"]],
    },
  });


  const documents = new ESPHomeDocuments();

  const hoverHandler = new HoverHandler(documents);
  monaco.languages.registerHoverProvider(esphomeLanguageId, {
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
  monaco.languages.registerCompletionItemProvider(esphomeLanguageId, {
    provideCompletionItems: async function (model, position) {
      console.log("provideCompletionItems", model.uri.toString(), position);
      documents.update(model.uri.toString(), new TextBuffer(model));
      const completions = await completionsHandler.getCompletions(
        model.uri.toString(),
        fromMonacoPosition(position),
      );
      return { suggestions: completions };
    },
  });

  const definitionHandler = new DefinitionHandler(documents);
  monaco.languages.registerDefinitionProvider(esphomeLanguageId, {
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



}