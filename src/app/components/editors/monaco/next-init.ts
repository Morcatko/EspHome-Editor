import { useEffect, useState } from 'react';
import { loader } from "@monaco-editor/react";

export const useMonacoInit = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        //Monaco editor based on https://github.com/graphql/graphiql/blob/main/examples/monaco-graphql-nextjs/next.config.js
        import('monaco-editor').then(m => {
            loader.config({ monaco: m });
            m
            setLoaded(true);
        });
    }, []);

    return loaded;
}