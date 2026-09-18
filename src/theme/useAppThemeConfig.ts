import { useContext } from "react";
import { AppThemeContext } from "@/theme/ThemeProvider";
import { ThemeMode } from "@/theme/themeTypes";

export function useAppThemeConfig() {
  const context = useContext(AppThemeContext);

  if (!context) {
    throw new Error(
      'useAppTheme must be used inside ThemeProvider',
    );
  }

  const { theme, setMode, mode } = context;

  const setThemeMode = (themeMode: ThemeMode) => {
    // TODO:: save settings to sqlite

    setMode(themeMode);
  };

  return { theme, mode, setThemeMode };
}
