// Gmail OAuth configuration for different environments
export interface GmailConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  responseType: string;
  accessType: string;
  prompt: string;
}

const GMAIL_ENVIRONMENTS = {
  development: {
    clientId: 'your-dev-client-id.apps.googleusercontent.com',
    redirectUri: 'com.spendlot.app://oauth/gmail',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    responseType: 'code',
    accessType: 'offline',
    prompt: 'consent',
  },
  staging: {
    clientId: 'your-staging-client-id.apps.googleusercontent.com',
    redirectUri: 'com.spendlot.staging://oauth/gmail',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    responseType: 'code',
    accessType: 'offline',
    prompt: 'consent',
  },
  production: {
    clientId: 'your-prod-client-id.apps.googleusercontent.com',
    redirectUri: 'com.spendlot.app://oauth/gmail',
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    responseType: 'code',
    accessType: 'offline',
    prompt: 'consent',
  },
};

// Get current Gmail configuration based on environment
export const getGmailConfig = (): GmailConfig => {
  if (__DEV__) {
    return GMAIL_ENVIRONMENTS.development;
  }
  
  // In a real app, you might check an environment variable or config
  // For now, we'll use production for non-dev builds
  return GMAIL_ENVIRONMENTS.production;
};

// Build Gmail OAuth URL
export const buildGmailAuthUrl = (state?: string): string => {
  const config = getGmailConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scopes.join(' '),
    response_type: config.responseType,
    access_type: config.accessType,
    prompt: config.prompt,
    ...(state && { state }),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

// Gmail search queries for receipt detection
export const GMAIL_RECEIPT_QUERIES = [
  // E-commerce platforms
  'from:amazon.com OR from:amazon.ca OR from:amazon.co.uk',
  'from:ebay.com OR from:paypal.com',
  'from:walmart.com OR from:target.com',
  'from:bestbuy.com OR from:homedepot.com',
  'from:costco.com OR from:samsclub.com',
  
  // Food delivery
  'from:uber.com OR from:ubereats.com',
  'from:doordash.com OR from:grubhub.com',
  'from:postmates.com OR from:seamless.com',
  
  // Subscription services
  'from:netflix.com OR from:spotify.com',
  'from:apple.com OR from:google.com',
  'from:microsoft.com OR from:adobe.com',
  
  // Travel
  'from:airbnb.com OR from:booking.com',
  'from:expedia.com OR from:hotels.com',
  'from:uber.com OR from:lyft.com',
  
  // Utilities and services
  'subject:receipt OR subject:invoice OR subject:bill',
  'subject:"your order" OR subject:"order confirmation"',
  'subject:"payment confirmation" OR subject:"transaction"',
  
  // Generic receipt keywords
  'receipt OR invoice OR "order confirmation"',
  '"payment received" OR "transaction complete"',
  '"your purchase" OR "order summary"',
];

// Common receipt email patterns
export const RECEIPT_EMAIL_PATTERNS = {
  // Subject line patterns
  subjectPatterns: [
    /receipt/i,
    /invoice/i,
    /order\s+(confirmation|receipt|summary)/i,
    /payment\s+(confirmation|receipt)/i,
    /transaction\s+(confirmation|receipt)/i,
    /your\s+(order|purchase|payment)/i,
    /bill\s+(statement|summary)/i,
  ],
  
  // Sender patterns (domains that commonly send receipts)
  senderPatterns: [
    /@amazon\./i,
    /@paypal\./i,
    /@uber\./i,
    /@apple\./i,
    /@google\./i,
    /@microsoft\./i,
    /@walmart\./i,
    /@target\./i,
    /@bestbuy\./i,
    /@homedepot\./i,
    /@costco\./i,
    /@netflix\./i,
    /@spotify\./i,
    /@airbnb\./i,
    /@booking\./i,
    /@expedia\./i,
    /noreply@/i,
    /receipts@/i,
    /orders@/i,
    /billing@/i,
  ],
  
  // Content patterns (text that indicates a receipt)
  contentPatterns: [
    /total\s*[:$]\s*\$?\d+\.\d{2}/i,
    /amount\s*[:$]\s*\$?\d+\.\d{2}/i,
    /subtotal\s*[:$]\s*\$?\d+\.\d{2}/i,
    /tax\s*[:$]\s*\$?\d+\.\d{2}/i,
    /order\s*#?\s*\w+/i,
    /transaction\s*#?\s*\w+/i,
    /invoice\s*#?\s*\w+/i,
    /receipt\s*#?\s*\w+/i,
    /confirmation\s*#?\s*\w+/i,
  ],
};

// Check if email is likely a receipt
export const isLikelyReceipt = (email: {
  subject: string;
  from: string;
  body: string;
}): boolean => {
  const { subject, from, body } = email;
  
  // Check subject patterns
  const hasReceiptSubject = RECEIPT_EMAIL_PATTERNS.subjectPatterns.some(
    pattern => pattern.test(subject)
  );
  
  // Check sender patterns
  const hasReceiptSender = RECEIPT_EMAIL_PATTERNS.senderPatterns.some(
    pattern => pattern.test(from)
  );
  
  // Check content patterns
  const hasReceiptContent = RECEIPT_EMAIL_PATTERNS.contentPatterns.some(
    pattern => pattern.test(body)
  );
  
  // Email is likely a receipt if it matches at least 2 criteria
  const matchCount = [hasReceiptSubject, hasReceiptSender, hasReceiptContent]
    .filter(Boolean).length;
  
  return matchCount >= 2;
};

// Extract receipt data from email content
export const extractReceiptData = (email: {
  subject: string;
  from: string;
  body: string;
  date: string;
}): {
  merchantName?: string;
  amount?: number;
  currency?: string;
  orderNumber?: string;
  date?: string;
  confidence: number;
} => {
  const { subject, from, body, date } = email;
  let confidence = 0;
  
  // Extract merchant name from sender
  const merchantMatch = from.match(/@([^.]+)\./);
  const merchantName = merchantMatch ? 
    merchantMatch[1].replace(/[^a-zA-Z]/g, ' ').trim() : 
    undefined;
  
  if (merchantName) confidence += 0.2;
  
  // Extract amount
  const amountMatches = body.match(/(?:total|amount|subtotal)\s*[:$]\s*\$?(\d+\.\d{2})/i);
  const amount = amountMatches ? parseFloat(amountMatches[1]) : undefined;
  
  if (amount) confidence += 0.3;
  
  // Extract currency (default to USD)
  const currencyMatch = body.match(/([A-Z]{3})\s*\$?\d+\.\d{2}/);
  const currency = currencyMatch ? currencyMatch[1] : 'USD';
  
  // Extract order number
  const orderMatches = body.match(/(?:order|transaction|invoice|receipt|confirmation)\s*#?\s*(\w+)/i);
  const orderNumber = orderMatches ? orderMatches[1] : undefined;
  
  if (orderNumber) confidence += 0.2;
  
  // Use email date as transaction date
  const transactionDate = date;
  confidence += 0.3;
  
  return {
    merchantName,
    amount,
    currency,
    orderNumber,
    date: transactionDate,
    confidence,
  };
};

// Gmail API error messages
export const GMAIL_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid Gmail credentials. Please try connecting again.',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions to access Gmail. Please grant all required permissions.',
  QUOTA_EXCEEDED: 'Gmail API quota exceeded. Please try again later.',
  RATE_LIMIT_EXCEEDED: 'Too many requests to Gmail API. Please wait and try again.',
  INVALID_GRANT: 'Gmail authorization has expired. Please reconnect your account.',
  ACCESS_DENIED: 'Access to Gmail was denied. Please try connecting again.',
  INVALID_REQUEST: 'Invalid request to Gmail API.',
  BACKEND_ERROR: 'Gmail service is temporarily unavailable. Please try again later.',
  SERVICE_UNAVAILABLE: 'Gmail service is currently unavailable. Please try again later.',
};

// Get user-friendly Gmail error message
export const getGmailErrorMessage = (errorCode: string): string => {
  return GMAIL_ERROR_MESSAGES[errorCode as keyof typeof GMAIL_ERROR_MESSAGES] || 
         'An unexpected error occurred while accessing Gmail. Please try again.';
};

// Gmail sync configuration
export const GMAIL_SYNC_CONFIG = {
  maxEmailsPerSync: 100,
  maxDaysBack: 30,
  syncInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  batchSize: 10,
  retryAttempts: 3,
  retryDelay: 5000, // 5 seconds
};

export default {
  getGmailConfig,
  buildGmailAuthUrl,
  isLikelyReceipt,
  extractReceiptData,
  getGmailErrorMessage,
  GMAIL_RECEIPT_QUERIES,
  GMAIL_SYNC_CONFIG,
};
