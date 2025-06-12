import { COLORS } from '../constants';

export interface ThemeColors {
  primary: typeof COLORS.primary;
  secondary: typeof COLORS.secondary;
  success: typeof COLORS.success;
  warning: typeof COLORS.warning;
  error: typeof COLORS.error;
  gray: typeof COLORS.gray;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  surface: {
    primary: string;
    secondary: string;
    elevated: string;
  };
}

export const lightTheme: ThemeColors = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
  gray: COLORS.gray,
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
    tertiary: '#94a3b8',
    inverse: '#ffffff',
  },
  border: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
  },
  surface: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    elevated: '#ffffff',
  },
};

export const darkTheme: ThemeColors = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
  gray: {
    50: '#1e293b',
    100: '#334155',
    200: '#475569',
    300: '#64748b',
    400: '#94a3b8',
    500: '#cbd5e1',
    600: '#e2e8f0',
    700: '#f1f5f9',
    800: '#f8fafc',
    900: '#ffffff',
  },
  background: {
    primary: '#0f172a',
    secondary: '#1e293b',
    tertiary: '#334155',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    inverse: '#1e293b',
  },
  border: {
    primary: '#334155',
    secondary: '#475569',
  },
  surface: {
    primary: '#1e293b',
    secondary: '#334155',
    elevated: '#475569',
  },
};

export const getThemeColors = (theme: 'light' | 'dark'): ThemeColors => {
  return theme === 'dark' ? darkTheme : lightTheme;
};

export const createThemedStyles = <T extends Record<string, any>>(
  styleCreator: (colors: ThemeColors) => T
) => {
  return {
    light: styleCreator(lightTheme),
    dark: styleCreator(darkTheme),
  };
};

// Theme-aware color utilities
export const getThemedColor = (
  theme: 'light' | 'dark',
  colorPath: string
): string => {
  const colors = getThemeColors(theme);
  const pathArray = colorPath.split('.');
  
  let result: any = colors;
  for (const key of pathArray) {
    result = result[key];
    if (result === undefined) {
      console.warn(`Color path "${colorPath}" not found in theme`);
      return theme === 'dark' ? '#ffffff' : '#000000';
    }
  }
  
  return result;
};

// Animation utilities for theme transitions
export const THEME_TRANSITION_DURATION = 300;

export const createThemeTransition = () => ({
  duration: THEME_TRANSITION_DURATION,
  useNativeDriver: false,
});

// Status bar utilities
export const getStatusBarStyle = (theme: 'light' | 'dark') => {
  return theme === 'dark' ? 'light-content' : 'dark-content';
};

export const getStatusBarBackgroundColor = (theme: 'light' | 'dark') => {
  const colors = getThemeColors(theme);
  return colors.background.primary;
};
