import { useDarkTheme } from "@/app/utils/hooks";

export const useMonacoTheme = () => {
    const isDarkMode = useDarkTheme();
    return isDarkMode ? "esphome-dark" : "esphome-light"
}