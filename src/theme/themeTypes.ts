import { gradients } from "@/theme/gradients";
import { typography } from "@/theme/typography";

export type ThemeMode = 'light' | 'dark' | 'system';

export type AppTheme = {
  mode: 'light' | 'dark',

  colors: {
    primary: string;
    primaryPressed: string;
    primaryLight: string;

    background: string;
    surface: string;
    surfaceSecondary: string;

    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
      disabled: string;
    },

    border: {
      default: string;
      strong: string;
    },

    icon: {
      primary: string;
      secondary: string;
      disabled: string;
    },

    success: string;
    warning: string;
    error: string;

    overlay: string;
  },

  typography: typeof typography,

  gradients: typeof gradients,
};


export interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}
