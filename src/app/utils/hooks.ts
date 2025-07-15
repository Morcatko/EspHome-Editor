'use client';
import { useMantineTheme } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

export const useDarkTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleThemeChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);

    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    setIsDarkMode(darkModeMediaQuery.matches)

    darkModeMediaQuery.addEventListener("change", handleThemeChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  return isDarkMode;
}


function stringToHash(str: string) {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    return hash;
}

export const useDeviceColor = (device_id: string | undefined) => {
    const theme = useMantineTheme();
    const isDark = useDarkTheme();
    return useMemo(() => {
        if (!device_id) return undefined;

        const index = (typeof theme.primaryShade === "object")
            ? isDark ? theme.primaryShade.light : theme.primaryShade.dark
            : theme.primaryShade as number;

        //Tune colors - https://v5.mantine.dev/theming/colors/
        const colors = [
            theme.colors.blue[index],
            theme.colors.red[index],
            theme.colors.green[index],
            theme.colors.yellow[index],
            theme.colors.cyan[index],
            theme.colors.pink[index],
            theme.colors.violet[index],
            theme.colors.grape[index],
            theme.colors.orange[index],
            theme.colors.teal[index],
            theme.colors.indigo[index],
            //theme.colors.dark[index],
        ];

        const hash = stringToHash(device_id);
        const colorIndex = ((hash % colors.length) + colors.length) % colors.length;

        //console.log("useDeviceColor", device_id, index, isDark, colors[colorIndex]);

        return colors[colorIndex];
    }, [device_id, isDark]);
}