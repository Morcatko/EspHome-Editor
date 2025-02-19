import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { relaxedJsonLanguageId } from "./languages";

export const init = async () => {
    monaco.languages.register({ id: relaxedJsonLanguageId });

    //Created by chatGPT
    monaco.languages.setMonarchTokensProvider(relaxedJsonLanguageId, {
        tokenizer: {
          root: [
            // Whitespace
            [/\s+/, 'white'],
      
            // Comments
            [/\/\/.*$/, 'comment'],
            [/\/\*/, { token: 'comment', bracket: '@open', next: '@comment' }],
      
            // Objects and Arrays
            [/[{}]/, 'delimiter.bracket'],
            [/[[]]/, 'delimiter.array'],
      
            // Colon and Comma (trailing commas are fine)
            [/[,:]/, 'delimiter'],
      
            // Strings (single or double-quoted)
            [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated double-quoted string
            [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-terminated single-quoted string
            [/"([^"\\]|\\.)*"/, 'string'],
            [/'([^'\\]|\\.)*'/, 'string'],
      
            // Unquoted Keys (must start with a letter and contain only letters, numbers, _, or $)
            [/[a-zA-Z_$][\w$]*/, 'key'],
      
            // Numbers
            [/-?\d+(\.\d+)?([eE][+\-]?\d+)?/, 'number'],
      
            // Keywords (true, false, null)
            [/\btrue\b|\bfalse\b|\bnull\b/, 'keyword.constant'],
          ],
      
          // Multiline comments
          comment: [
            [/[^/*]+/, 'comment'],
            [/\*\//, { token: 'comment', bracket: '@close', next: '@pop' }],
            [/./, 'comment']
          ]
        }
      });

    monaco.languages.setLanguageConfiguration(relaxedJsonLanguageId, {
        brackets: [
            ['{', '}'],
            ['[', ']'],
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '"', close: '"' },
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '"', close: '"' },
        ],
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/'],
        },
    });
}