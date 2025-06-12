// App Store configuration and metadata for SpendLot Receipt Tracker
export interface AppStoreMetadata {
  appName: string;
  bundleId: string;
  version: string;
  buildNumber: string;
  description: {
    short: string;
    full: string;
    keywords: string[];
  };
  categories: {
    primary: string;
    secondary?: string;
  };
  ageRating: string;
  contentRating: {
    ios: string;
    android: string;
  };
  screenshots: {
    ios: ScreenshotConfig[];
    android: ScreenshotConfig[];
  };
  features: string[];
  whatsNew: string[];
  supportInfo: {
    email: string;
    website: string;
    privacyPolicy: string;
    termsOfService: string;
  };
  marketing: {
    tagline: string;
    highlights: string[];
    targetAudience: string[];
  };
}

interface ScreenshotConfig {
  device: string;
  size: string;
  filename: string;
  description: string;
}

// App Store metadata configuration
export const appStoreMetadata: AppStoreMetadata = {
  appName: 'SpendLot Receipt Tracker',
  bundleId: 'com.spendlot.app',
  version: '1.0.0',
  buildNumber: '1',
  
  description: {
    short: 'Smart receipt tracking with OCR, bank sync, and spending analytics. Effortlessly manage expenses and gain insights into your spending habits.',
    
    full: `SpendLot Receipt Tracker is the ultimate expense management solution that transforms how you track and analyze your spending. With advanced OCR technology, seamless bank integration, and intelligent analytics, managing your finances has never been easier.

KEY FEATURES:
• Smart Receipt Capture: Use your camera to instantly digitize receipts with AI-powered OCR
• Bank Account Sync: Automatically import transactions from your bank accounts via Plaid
• Gmail Integration: Automatically detect and import receipts from your email
• Intelligent Categorization: AI-powered expense categorization with custom categories
• Rich Analytics: Beautiful charts and insights into your spending patterns
• Real-time Sync: All your data synced across devices in real-time
• Secure & Private: Bank-level security with end-to-end encryption

PERFECT FOR:
• Individuals tracking personal expenses
• Small business owners managing receipts
• Freelancers organizing business expenses
• Anyone wanting better financial insights

ADVANCED FEATURES:
• Monthly spending summaries and trends
• Category-based spending analysis
• Receipt verification and editing
• Export capabilities for tax preparation
• Offline mode for on-the-go tracking
• Dark mode support
• Accessibility features

Start your journey to better financial management today with SpendLot Receipt Tracker!`,
    
    keywords: [
      'receipt tracker', 'expense manager', 'OCR scanner', 'spending tracker',
      'financial app', 'budget tracker', 'receipt scanner', 'expense report',
      'bank sync', 'plaid integration', 'receipt organizer', 'tax preparation',
      'business expenses', 'personal finance', 'money management', 'analytics',
      'spending insights', 'receipt capture', 'expense analytics', 'financial tracking'
    ],
  },
  
  categories: {
    primary: 'Finance',
    secondary: 'Business',
  },
  
  ageRating: '4+',
  
  contentRating: {
    ios: '4+',
    android: 'Everyone',
  },
  
  screenshots: {
    ios: [
      {
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-screenshot-1-dashboard.png',
        description: 'Beautiful dashboard with spending overview and quick actions',
      },
      {
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-screenshot-2-camera.png',
        description: 'Smart receipt capture with AI-powered OCR technology',
      },
      {
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-screenshot-3-analytics.png',
        description: 'Rich analytics and spending insights with interactive charts',
      },
      {
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-screenshot-4-receipts.png',
        description: 'Organized receipt management with smart categorization',
      },
      {
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-screenshot-5-bank-sync.png',
        description: 'Seamless bank account integration with automatic sync',
      },
      {
        device: 'iPad Pro 12.9"',
        size: '2048x2732',
        filename: 'ipad-screenshot-1-dashboard.png',
        description: 'Optimized iPad experience with enhanced productivity',
      },
    ],
    android: [
      {
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-screenshot-1-dashboard.png',
        description: 'Material Design dashboard with spending overview',
      },
      {
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-screenshot-2-camera.png',
        description: 'Advanced receipt scanning with real-time OCR',
      },
      {
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-screenshot-3-analytics.png',
        description: 'Comprehensive spending analytics and trends',
      },
      {
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-screenshot-4-receipts.png',
        description: 'Smart receipt organization and management',
      },
      {
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-screenshot-5-bank-sync.png',
        description: 'Secure bank integration with Plaid technology',
      },
    ],
  },
  
  features: [
    'Smart OCR Receipt Scanning',
    'Bank Account Integration (Plaid)',
    'Gmail Receipt Detection',
    'AI-Powered Categorization',
    'Real-time Analytics',
    'Spending Insights & Trends',
    'Multi-device Sync',
    'Offline Mode',
    'Export Capabilities',
    'Dark Mode Support',
    'Accessibility Features',
    'Bank-level Security',
  ],
  
  whatsNew: [
    'Initial release of SpendLot Receipt Tracker',
    'Smart receipt capture with advanced OCR technology',
    'Seamless bank account integration via Plaid',
    'Gmail integration for automatic receipt detection',
    'Beautiful analytics dashboard with spending insights',
    'Real-time sync across all your devices',
    'Dark mode and accessibility support',
  ],
  
  supportInfo: {
    email: 'support@spendlot.com',
    website: 'https://spendlot.com',
    privacyPolicy: 'https://spendlot.com/privacy',
    termsOfService: 'https://spendlot.com/terms',
  },
  
  marketing: {
    tagline: 'Smart Receipt Tracking, Simplified',
    highlights: [
      'Capture receipts instantly with your camera',
      'Automatically sync with your bank accounts',
      'Get insights into your spending patterns',
      'Organize expenses effortlessly',
      'Secure and private by design',
    ],
    targetAudience: [
      'Personal finance enthusiasts',
      'Small business owners',
      'Freelancers and contractors',
      'Budget-conscious individuals',
      'Tax preparation users',
    ],
  },
};

// App Store optimization keywords
export const ASO_KEYWORDS = {
  primary: [
    'receipt tracker',
    'expense manager',
    'spending tracker',
    'receipt scanner',
    'expense app',
  ],
  secondary: [
    'OCR scanner',
    'bank sync',
    'financial app',
    'budget tracker',
    'receipt organizer',
  ],
  longTail: [
    'receipt tracking app',
    'expense management tool',
    'smart receipt scanner',
    'automatic expense tracker',
    'receipt capture app',
  ],
};

// App Store review guidelines compliance
export const COMPLIANCE_CHECKLIST = {
  contentGuidelines: [
    '✅ No inappropriate content',
    '✅ Accurate app description',
    '✅ No misleading claims',
    '✅ Proper age rating',
    '✅ No spam or repetitive content',
  ],
  functionalityGuidelines: [
    '✅ App functions as described',
    '✅ No crashes or major bugs',
    '✅ Proper error handling',
    '✅ Responsive user interface',
    '✅ Offline functionality works',
  ],
  designGuidelines: [
    '✅ Follows platform design guidelines',
    '✅ Consistent user interface',
    '✅ Proper navigation patterns',
    '✅ Accessibility features implemented',
    '✅ Dark mode support',
  ],
  businessGuidelines: [
    '✅ Clear privacy policy',
    '✅ Transparent terms of service',
    '✅ Proper data handling disclosure',
    '✅ No deceptive practices',
    '✅ Appropriate monetization',
  ],
  legalGuidelines: [
    '✅ Proper intellectual property usage',
    '✅ No trademark violations',
    '✅ Compliance with local laws',
    '✅ GDPR compliance (if applicable)',
    '✅ CCPA compliance (if applicable)',
  ],
};

// Release notes template
export const generateReleaseNotes = (version: string, features: string[]): string => {
  return `What's New in SpendLot Receipt Tracker v${version}

${features.map(feature => `• ${feature}`).join('\n')}

We're constantly working to improve your experience. If you love using SpendLot, please leave us a review!

Questions or feedback? Contact us at ${appStoreMetadata.supportInfo.email}`;
};

// App Store Connect configuration
export const APP_STORE_CONNECT_CONFIG = {
  teamId: 'YOUR_TEAM_ID',
  appId: 'YOUR_APP_ID',
  bundleId: appStoreMetadata.bundleId,
  sku: 'spendlot-receipt-tracker',
  primaryLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  availableCountries: [
    'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE',
    'NO', 'DK', 'FI', 'CH', 'AT', 'BE', 'IE', 'PT', 'LU',
  ],
  priceTier: 'Free',
  contentRights: {
    containsThirdPartyContent: false,
    hasRights: true,
  },
};

// Google Play Console configuration
export const GOOGLE_PLAY_CONFIG = {
  packageName: appStoreMetadata.bundleId,
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US'],
  contentRating: 'Everyone',
  targetAudience: 'General',
  containsAds: false,
  inAppProducts: false,
  distributionCountries: [
    'US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE',
    'NO', 'DK', 'FI', 'CH', 'AT', 'BE', 'IE', 'PT', 'LU',
  ],
};

export default {
  appStoreMetadata,
  ASO_KEYWORDS,
  COMPLIANCE_CHECKLIST,
  generateReleaseNotes,
  APP_STORE_CONNECT_CONFIG,
  GOOGLE_PLAY_CONFIG,
};
