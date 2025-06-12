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
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
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
  },
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
  },
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
  },
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
  },
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
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const BORDER_RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
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
