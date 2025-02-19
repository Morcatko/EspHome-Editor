import { useDarkTheme } from "@/app/utils/hooks";

export const darkTheme = "esphome-dark";
export const lightTheme = "esphome-light";

export const useMonacoTheme = () => {
    const isDarkMode = useDarkTheme();
    return isDarkMode ? darkTheme : lightTheme;
}