import { useContext } from 'react';
import { useApp } from '../context/AppContext';
import { getTheme, getThemeColors, Theme, ThemeColors } from '../utils/theme';

export interface UseThemeReturn {
  theme: 'light' | 'dark' | 'system';
  effectiveTheme: 'light' | 'dark';
  colors: ThemeColors;
  typography: Theme['typography'];
  design: Theme['design'];
  fullTheme: Theme;
  isDark: boolean;
  isLight: boolean;
  toggleTheme: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
}

export const useTheme = (): UseThemeReturn => {
  const { theme, effectiveTheme, toggleTheme, setTheme } = useApp();

  const fullTheme = getTheme(effectiveTheme);
  const colors = getThemeColors(effectiveTheme);
  const isDark = effectiveTheme === 'dark';
  const isLight = effectiveTheme === 'light';

  return {
    theme,
    effectiveTheme,
    colors,
    typography: fullTheme.typography,
    design: fullTheme.design,
    fullTheme,
    isDark,
    isLight,
    toggleTheme,
    setTheme,
  };
};

export default useTheme;
