import { useDarkTheme } from "@/app/utils/hooks";

export const useMonacoTheme = () => {
    const isDarkMode = useDarkTheme();
    return isDarkMode ? "vs-dark" : "vs-light";
}