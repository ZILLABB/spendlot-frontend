// Environment configuration for SpendLot Receipt Tracker
import { Platform } from 'react-native';

export type Environment = 'development' | 'staging' | 'production';

export interface EnvironmentConfig {
  environment: Environment;
  apiBaseUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
  enableCrashReporting: boolean;
  enableAnalytics: boolean;
  plaid: {
    environment: 'sandbox' | 'development' | 'production';
    clientName: string;
  };
  gmail: {
    clientId: string;
    redirectUri: string;
  };
  features: {
    enableBankIntegration: boolean;
    enableGmailIntegration: boolean;
    enableOfflineMode: boolean;
    enablePushNotifications: boolean;
    enableBiometricAuth: boolean;
    enableDarkMode: boolean;
    enableExportFeatures: boolean;
    enableAdvancedAnalytics: boolean;
  };
  limits: {
    maxReceiptsPerUser: number;
    maxTransactionsPerUser: number;
    maxFileUploadSize: number; // in bytes
    maxImageResolution: number; // in pixels
    maxRetryAttempts: number;
    cacheExpirationTime: number; // in milliseconds
  };
  urls: {
    privacyPolicy: string;
    termsOfService: string;
    supportEmail: string;
    helpCenter: string;
    appStore: string;
    playStore: string;
  };
}

// Development environment configuration
const developmentConfig: EnvironmentConfig = {
  environment: 'development',
  apiBaseUrl: 'http://localhost:8000/api/v1',
  apiTimeout: 30000,
  enableLogging: true,
  enableCrashReporting: false,
  enableAnalytics: false,
  plaid: {
    environment: 'sandbox',
    clientName: 'SpendLot Receipt Tracker (Dev)',
  },
  gmail: {
    clientId: 'your-dev-client-id.apps.googleusercontent.com',
    redirectUri: 'com.spendlot.dev://oauth/gmail',
  },
  features: {
    enableBankIntegration: true,
    enableGmailIntegration: true,
    enableOfflineMode: true,
    enablePushNotifications: false,
    enableBiometricAuth: true,
    enableDarkMode: true,
    enableExportFeatures: true,
    enableAdvancedAnalytics: true,
  },
  limits: {
    maxReceiptsPerUser: 1000,
    maxTransactionsPerUser: 10000,
    maxFileUploadSize: 10 * 1024 * 1024, // 10MB
    maxImageResolution: 4096,
    maxRetryAttempts: 3,
    cacheExpirationTime: 5 * 60 * 1000, // 5 minutes
  },
  urls: {
    privacyPolicy: 'https://spendlot.com/privacy',
    termsOfService: 'https://spendlot.com/terms',
    supportEmail: 'support@spendlot.com',
    helpCenter: 'https://help.spendlot.com',
    appStore: 'https://apps.apple.com/app/spendlot',
    playStore: 'https://play.google.com/store/apps/details?id=com.spendlot.app',
  },
};

// Staging environment configuration
const stagingConfig: EnvironmentConfig = {
  environment: 'staging',
  apiBaseUrl: 'https://staging-api.spendlot.com/api/v1',
  apiTimeout: 30000,
  enableLogging: true,
  enableCrashReporting: true,
  enableAnalytics: true,
  plaid: {
    environment: 'development',
    clientName: 'SpendLot Receipt Tracker (Staging)',
  },
  gmail: {
    clientId: 'your-staging-client-id.apps.googleusercontent.com',
    redirectUri: 'com.spendlot.staging://oauth/gmail',
  },
  features: {
    enableBankIntegration: true,
    enableGmailIntegration: true,
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableBiometricAuth: true,
    enableDarkMode: true,
    enableExportFeatures: true,
    enableAdvancedAnalytics: true,
  },
  limits: {
    maxReceiptsPerUser: 5000,
    maxTransactionsPerUser: 50000,
    maxFileUploadSize: 20 * 1024 * 1024, // 20MB
    maxImageResolution: 4096,
    maxRetryAttempts: 3,
    cacheExpirationTime: 15 * 60 * 1000, // 15 minutes
  },
  urls: {
    privacyPolicy: 'https://staging.spendlot.com/privacy',
    termsOfService: 'https://staging.spendlot.com/terms',
    supportEmail: 'support@spendlot.com',
    helpCenter: 'https://help.spendlot.com',
    appStore: 'https://apps.apple.com/app/spendlot',
    playStore: 'https://play.google.com/store/apps/details?id=com.spendlot.app',
  },
};

// Production environment configuration
const productionConfig: EnvironmentConfig = {
  environment: 'production',
  apiBaseUrl: 'https://api.spendlot.com/api/v1',
  apiTimeout: 30000,
  enableLogging: false,
  enableCrashReporting: true,
  enableAnalytics: true,
  plaid: {
    environment: 'production',
    clientName: 'SpendLot Receipt Tracker',
  },
  gmail: {
    clientId: 'your-prod-client-id.apps.googleusercontent.com',
    redirectUri: 'com.spendlot.app://oauth/gmail',
  },
  features: {
    enableBankIntegration: true,
    enableGmailIntegration: true,
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableBiometricAuth: true,
    enableDarkMode: true,
    enableExportFeatures: true,
    enableAdvancedAnalytics: true,
  },
  limits: {
    maxReceiptsPerUser: 10000,
    maxTransactionsPerUser: 100000,
    maxFileUploadSize: 50 * 1024 * 1024, // 50MB
    maxImageResolution: 8192,
    maxRetryAttempts: 5,
    cacheExpirationTime: 60 * 60 * 1000, // 1 hour
  },
  urls: {
    privacyPolicy: 'https://spendlot.com/privacy',
    termsOfService: 'https://spendlot.com/terms',
    supportEmail: 'support@spendlot.com',
    helpCenter: 'https://help.spendlot.com',
    appStore: 'https://apps.apple.com/app/spendlot',
    playStore: 'https://play.google.com/store/apps/details?id=com.spendlot.app',
  },
};

// Get current environment
export const getCurrentEnvironment = (): Environment => {
  if (__DEV__) {
    return 'development';
  }
  
  // In a real app, you might check:
  // - Environment variables
  // - Build configuration
  // - Bundle identifier
  // - Server response
  
  // For now, we'll determine based on bundle ID or other indicators
  // This is a simplified approach - in production you'd have a more robust method
  return 'production';
};

// Get environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const environment = getCurrentEnvironment();
  
  switch (environment) {
    case 'development':
      return developmentConfig;
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      return developmentConfig;
  }
};

// Current configuration
export const config = getEnvironmentConfig();

// Utility functions
export const isDevelopment = () => config.environment === 'development';
export const isStaging = () => config.environment === 'staging';
export const isProduction = () => config.environment === 'production';

// Feature flags
export const isFeatureEnabled = (feature: keyof EnvironmentConfig['features']): boolean => {
  return config.features[feature];
};

// Platform-specific configurations
export const getPlatformConfig = () => {
  const baseConfig = getEnvironmentConfig();
  
  return {
    ...baseConfig,
    platform: Platform.OS,
    platformVersion: Platform.Version,
    // Platform-specific overrides
    ...(Platform.OS === 'ios' && {
      // iOS-specific configurations
      features: {
        ...baseConfig.features,
        enableBiometricAuth: true, // Face ID/Touch ID
      },
    }),
    ...(Platform.OS === 'android' && {
      // Android-specific configurations
      features: {
        ...baseConfig.features,
        enableBiometricAuth: true, // Fingerprint/Face unlock
      },
    }),
  };
};

// Validation functions
export const validateConfig = (): boolean => {
  const config = getEnvironmentConfig();
  
  // Check required fields
  if (!config.apiBaseUrl) {
    console.error('API Base URL is required');
    return false;
  }
  
  if (!config.plaid.clientName) {
    console.error('Plaid client name is required');
    return false;
  }
  
  if (!config.gmail.clientId) {
    console.error('Gmail client ID is required');
    return false;
  }
  
  // Validate URLs
  try {
    new URL(config.apiBaseUrl);
    new URL(config.urls.privacyPolicy);
    new URL(config.urls.termsOfService);
  } catch (error) {
    console.error('Invalid URL in configuration:', error);
    return false;
  }
  
  return true;
};

// Debug information
export const getDebugInfo = () => {
  const config = getEnvironmentConfig();
  
  return {
    environment: config.environment,
    platform: Platform.OS,
    platformVersion: Platform.Version,
    apiBaseUrl: config.apiBaseUrl,
    enabledFeatures: Object.entries(config.features)
      .filter(([, enabled]) => enabled)
      .map(([feature]) => feature),
    limits: config.limits,
  };
};

export default {
  config,
  getCurrentEnvironment,
  getEnvironmentConfig,
  getPlatformConfig,
  isDevelopment,
  isStaging,
  isProduction,
  isFeatureEnabled,
  validateConfig,
  getDebugInfo,
};
