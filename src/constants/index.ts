// App constants and configuration
import { config } from '../config/environment';

// API Configuration from environment
export const API_CONFIG = {
  BASE_URL: config.apiBaseUrl,
  TIMEOUT: config.apiTimeout,
  RETRY_ATTEMPTS: config.limits.maxRetryAttempts,
  RETRY_DELAY: 1000, // 1 second
};

// Legacy export for backward compatibility
export const API_BASE_URL = config.apiBaseUrl;

export const COLORS = {
  // Premium primary color palette - sophisticated blue-purple gradient
  primary: {
    50: '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  // Refined secondary/neutral palette
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  // Enhanced success colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  // Premium warning colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  // Enhanced error colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  // Premium neutral gray palette
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  // New accent colors for premium feel
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
  },
};

// Premium spacing system with more granular control
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
};

// Premium typography system with Inter font family
export const TYPOGRAPHY = {
  fontFamily: {
    primary: 'Inter',
    secondary: 'Inter',
    mono: 'SF Mono', // iOS default, will fallback to system mono
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
    '6xl': 48,
    '7xl': 56,
    '8xl': 64,
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// Legacy font sizes for backward compatibility
export const FONT_SIZES = TYPOGRAPHY.fontSize;

// Enhanced border radius system
export const BORDER_RADIUS = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  '4xl': 32,
  full: 9999,
};

// Premium shadow system for elevation
export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 12,
  },
  '2xl': {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.15,
    shadowRadius: 50,
    elevation: 16,
  },
};

// Premium gradient definitions
export const GRADIENTS = {
  primary: ['#6366f1', '#8b5cf6'],
  secondary: ['#64748b', '#475569'],
  success: ['#22c55e', '#16a34a'],
  warning: ['#f59e0b', '#d97706'],
  error: ['#ef4444', '#dc2626'],
  accent: ['#d946ef', '#c026d3'],
  sunset: ['#f59e0b', '#ef4444'],
  ocean: ['#0ea5e9', '#6366f1'],
  forest: ['#22c55e', '#15803d'],
  royal: ['#8b5cf6', '#6366f1'],
};

export const DEFAULT_CATEGORIES = [
  {
    id: '1',
    name: 'Food & Dining',
    icon: '🍽️',
    color: COLORS.primary[500],
  },
  {
    id: '2',
    name: 'Groceries',
    icon: '🛒',
    color: COLORS.success[500],
  },
  {
    id: '3',
    name: 'Transportation',
    icon: '🚗',
    color: COLORS.warning[500],
  },
  {
    id: '4',
    name: 'Shopping',
    icon: '🛍️',
    color: COLORS.error[500],
  },
  {
    id: '5',
    name: 'Entertainment',
    icon: '🎬',
    color: COLORS.secondary[500],
  },
  {
    id: '6',
    name: 'Healthcare',
    icon: '🏥',
    color: COLORS.primary[600],
  },
  {
    id: '7',
    name: 'Utilities',
    icon: '⚡',
    color: COLORS.warning[600],
  },
  {
    id: '8',
    name: 'Other',
    icon: '📝',
    color: COLORS.gray[500],
  },
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
];

export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  api: 'yyyy-MM-dd',
  full: 'EEEE, MMMM dd, yyyy',
  short: 'MM/dd/yyyy',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  OFFLINE_RECEIPTS: 'offline_receipts',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  USER: {
    PROFILE: '/users/me',
    UPDATE_PROFILE: '/users/me',
    DELETE_ACCOUNT: '/users/me',
  },
  RECEIPTS: {
    LIST: '/receipts',
    UPLOAD: '/receipts/upload',
    DETAIL: '/receipts/:id',
    UPDATE: '/receipts/:id',
    DELETE: '/receipts/:id',
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    CREATE: '/transactions',
    DETAIL: '/transactions/:id',
    UPDATE: '/transactions/:id',
    DELETE: '/transactions/:id',
    SUMMARY: '/transactions/summary/current-month',
  },
  CATEGORIES: {
    LIST: '/categories',
    TREE: '/categories/tree',
    CREATE: '/categories',
    UPDATE: '/categories/:id',
    DELETE: '/categories/:id',
  },
  BANK_ACCOUNTS: {
    LIST: '/bank-accounts',
    PLAID_LINK_TOKEN: '/bank-accounts/plaid/link-token',
    PLAID_EXCHANGE_TOKEN: '/bank-accounts/plaid/exchange-token',
    SYNC: '/bank-accounts/:id/sync',
  },
  ANALYTICS: {
    SPENDING_SUMMARY: '/analytics/spending-summary',
    CATEGORY_STATS: '/analytics/category-stats',
    MONTHLY_TRENDS: '/analytics/monthly-trends',
    RECEIPT_STATS: '/analytics/receipt-stats',
  },
  EXTERNAL: {
    GMAIL: {
      AUTHORIZE: '/auth/gmail/authorize',
      STATUS: '/auth/gmail/status',
      DISCONNECT: '/auth/gmail/disconnect',
    },
  },
};

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  AMOUNT_MAX_DIGITS: 10,
  MERCHANT_NAME_MAX_LENGTH: 100,
  ITEM_NAME_MAX_LENGTH: 50,
};

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const CAMERA_OPTIONS = {
  mediaTypes: 'Images' as const,
  allowsEditing: true,
  aspect: [4, 3] as [number, number],
  quality: 0.8,
};

export const IMAGE_PICKER_OPTIONS = {
  mediaTypes: 'Images' as const,
  allowsEditing: true,
  aspect: [4, 3] as [number, number],
  quality: 0.8,
  allowsMultipleSelection: false,
};

export const CHART_COLORS = [
  COLORS.primary[500],
  COLORS.success[500],
  COLORS.warning[500],
  COLORS.error[500],
  COLORS.secondary[500],
  COLORS.primary[600],
  COLORS.success[600],
  COLORS.warning[600],
];

export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};
