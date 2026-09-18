import React, {
  createContext,
  useMemo,
  useState,
} from 'react';

import { useColorScheme } from 'react-native';

import { lightTheme } from '@/theme/lightTheme';
import { darkTheme } from '@/theme/darkTheme';
import { AppTheme, ThemeContextValue, ThemeMode } from '@/theme/themeTypes';


export const AppThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const systemScheme = useColorScheme();

  const [mode, setMode] = useState<ThemeMode>('system');

  const resolvedMode =
    mode === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : mode;

  const theme: AppTheme = useMemo(
    () => (resolvedMode === 'dark' ? darkTheme : lightTheme),
    [resolvedMode],
  );

  const value = useMemo(
    () => ({
      theme,
      mode,
      setMode,
    }),
    [theme, mode],
  );

  return (
    <AppThemeContext.Provider value={value}>
      {children}
    </AppThemeContext.Provider>
  );
}
