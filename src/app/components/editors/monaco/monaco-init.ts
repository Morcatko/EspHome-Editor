import { useEffect, useState } from 'react';
import { loader } from "@monaco-editor/react";
import { initEspHomeLanguage } from './esphome-language';

const init = async () => {
    //Monaco editor based on https://github.com/graphql/graphiql/blob/main/examples/monaco-graphql-nextjs/next.config.js
    const monaco = await import('monaco-editor');
    loader.config({ monaco });
    await initEspHomeLanguage();
}

export const useMonacoInit = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
       init().then(() => setLoaded(true));
    }, []);

    return loaded;
}