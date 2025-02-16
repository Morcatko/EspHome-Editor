import { useEffect, useState } from 'react';

export const useMonacoInit = () => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        //Monaco editor based on https://github.com/graphql/graphiql/blob/main/examples/monaco-graphql-nextjs/next.config.js
        import('./index').then(m => {
            m.monacoInit();
            setLoaded(true);
        });
    }, []);

    return loaded;
}