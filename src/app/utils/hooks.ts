import { useEffect, useState } from "react";

export const useDarkTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    
      useEffect(() => {
        const handleThemeChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    
        const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
        darkModeMediaQuery.addEventListener("change", handleThemeChange);
        return () => darkModeMediaQuery.removeEventListener("change", handleThemeChange);
      }, []);

    return isDarkMode;
}