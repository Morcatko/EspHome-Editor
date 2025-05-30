import { useEffect, useState } from 'react';
import { loader } from "@monaco-editor/react";

const init = async () => {
    //Monaco editor based on https://github.com/graphql/graphiql/blob/main/examples/monaco-graphql-nextjs/next.config.js
    const monaco = await import('monaco-editor');
    loader.config({ monaco });
    const espHomeLanguage = await import('./esphome-language');
    await espHomeLanguage.init();
    monaco.editor.addKeybindingRule({
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
        command: 'editor.action.quickCommand',
    });
}

export const useMonacoInit = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
       init().then(() => setLoaded(true));
    }, []);
    return loaded;
}