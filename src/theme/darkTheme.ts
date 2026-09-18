import { palette } from '@/theme/colors';
import { gradients } from '@/theme/gradients';
import { radius } from '@/theme/radius';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export const darkTheme = {
  mode: 'dark' as const,

  colors: {
    primary: palette.blue[400],
    primaryPressed: palette.blue[300],
    primaryLight: palette.blue[900],

    background: '#000000',
    surface: '#111111',
    surfaceSecondary: '#1C1C1E',

    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      tertiary: '#71717A',
      inverse: '#000000',
      disabled: '#52525B',
    },

    border: {
      default: '#27272A',
      strong: '#3F3F46',
    },

    icon: {
      primary: '#E4E4E7',
      secondary: '#A1A1AA',
      disabled: '#52525B',
    },

    success: '#4ADE80',
    warning: '#FACC15',
    error: '#F87171',

    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  typography,

  spacing,

  radius,

  gradients,
};