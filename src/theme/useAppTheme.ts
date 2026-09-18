import { useAppThemeConfig } from "@/theme/useAppThemeConfig";


export function useAppTheme() {
  const { theme } = useAppThemeConfig();

  return theme;
}
