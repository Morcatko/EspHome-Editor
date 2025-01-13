'use client';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import { useEffect, useState } from 'react';
import { useDarkTheme } from './utils/hooks';

const ModeSwitcher = () => {
  const isDark = useDarkTheme();
  const cs = useColorScheme();
  useEffect(() => {
    cs.setMode(isDark ? 'dark' : 'light');
  }, [isDark, cs]);

  return null;
}

//Copied from https://mui.com/joy-ui/integrations/next-js-app-router/
export default function ThemeRegistry(props: any) {
  const { children } = props;

  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "joy" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <CssVarsProvider>
        <ModeSwitcher />
        {children}
      </CssVarsProvider>
    </CacheProvider>
  );
}