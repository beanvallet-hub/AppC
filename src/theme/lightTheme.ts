import { palette } from '@/theme/colors';
import { gradients } from '@/theme/gradients';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const lightTheme = {
  mode: 'light' as const,

  colors: {
    primary: palette.blue[600],
    primaryPressed: palette.blue[700],
    primaryLight: palette.blue[50],

    background: palette.white,
    surface: palette.white,
    surfaceSecondary: palette.gray[50],

    text: {
      primary: palette.gray[900],
      secondary: palette.gray[600],
      tertiary: palette.gray[500],
      inverse: palette.white,
      disabled: palette.gray[400],
    },

    border: {
      default: palette.gray[200],
      strong: palette.gray[300],
    },

    icon: {
      primary: palette.gray[700],
      secondary: palette.gray[500],
      disabled: palette.gray[400],
    },

    success: palette.green[600],
    warning: palette.yellow[600],
    error: palette.red[600],

    overlay: 'rgba(0, 0, 0, 0.5)',
  },


  // TODO:: MAKE the following meaningful 
  // like heading_1, heading_2, regular
  // spacing.padding.small
  typography,

  spacing,

  radius,

  gradients,
};
