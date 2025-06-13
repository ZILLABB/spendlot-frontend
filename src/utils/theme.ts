import { COLORS, TYPOGRAPHY, SHADOWS, GRADIENTS } from '../constants';

export interface ThemeColors {
  primary: typeof COLORS.primary;
  secondary: typeof COLORS.secondary;
  success: typeof COLORS.success;
  warning: typeof COLORS.warning;
  error: typeof COLORS.error;
  gray: typeof COLORS.gray;
  accent: typeof COLORS.accent;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
    accent: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
    error: string;
  };
  surface: {
    primary: string;
    secondary: string;
    elevated: string;
    overlay: string;
    card: string;
  };
}

export interface ThemeTypography {
  fontFamily: typeof TYPOGRAPHY.fontFamily;
  fontSize: typeof TYPOGRAPHY.fontSize;
  fontWeight: typeof TYPOGRAPHY.fontWeight;
  lineHeight: typeof TYPOGRAPHY.lineHeight;
  letterSpacing: typeof TYPOGRAPHY.letterSpacing;
}

export interface ThemeDesign {
  shadows: typeof SHADOWS;
  gradients: typeof GRADIENTS;
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  design: ThemeDesign;
}

// Premium light theme with enhanced colors and surfaces
export const lightThemeColors: ThemeColors = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  success: COLORS.success,
  warning: COLORS.warning,
  error: COLORS.error,
  gray: COLORS.gray,
  accent: COLORS.accent,
  background: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    elevated: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.5)',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    inverse: '#ffffff',
    accent: '#6366f1',
  },
  border: {
    primary: '#e2e8f0',
    secondary: '#cbd5e1',
    focus: '#6366f1',
    error: '#ef4444',
  },
  surface: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    elevated: '#ffffff',
    overlay: 'rgba(248, 250, 252, 0.95)',
    card: '#ffffff',
  },
};

// Premium dark theme with enhanced colors and surfaces
export const darkThemeColors: ThemeColors = {
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
    950: '#ffffff',
  },
  accent: COLORS.accent,
  background: {
    primary: '#020617',
    secondary: '#0f172a',
    tertiary: '#1e293b',
    elevated: '#1e293b',
    overlay: 'rgba(2, 6, 23, 0.8)',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    inverse: '#0f172a',
    accent: '#a5b4fc',
  },
  border: {
    primary: '#334155',
    secondary: '#475569',
    focus: '#6366f1',
    error: '#ef4444',
  },
  surface: {
    primary: '#0f172a',
    secondary: '#1e293b',
    elevated: '#334155',
    overlay: 'rgba(15, 23, 42, 0.95)',
    card: '#1e293b',
  },
};

// Complete theme objects with typography and design tokens
export const lightTheme: Theme = {
  colors: lightThemeColors,
  typography: TYPOGRAPHY,
  design: {
    shadows: SHADOWS,
    gradients: GRADIENTS,
  },
};

export const darkTheme: Theme = {
  colors: darkThemeColors,
  typography: TYPOGRAPHY,
  design: {
    shadows: SHADOWS,
    gradients: GRADIENTS,
  },
};

// Theme utilities
export const getTheme = (theme: 'light' | 'dark'): Theme => {
  return theme === 'dark' ? darkTheme : lightTheme;
};

export const getThemeColors = (theme: 'light' | 'dark'): ThemeColors => {
  return theme === 'dark' ? darkThemeColors : lightThemeColors;
};

export const createThemedStyles = <T extends Record<string, any>>(
  styleCreator: (theme: Theme) => T
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
