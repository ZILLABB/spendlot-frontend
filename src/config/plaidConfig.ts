// Plaid configuration for different environments
export interface PlaidConfig {
  environment: 'sandbox' | 'development' | 'production';
  clientName: string;
  products: string[];
  countryCodes: string[];
  language: string;
  webhook?: string;
}

const PLAID_ENVIRONMENTS = {
  development: {
    environment: 'sandbox' as const,
    clientName: 'SpendLot Receipt Tracker',
    products: ['transactions', 'auth', 'identity'],
    countryCodes: ['US', 'CA'],
    language: 'en',
    webhook: __DEV__ ? undefined : 'https://api.spendlot.com/webhooks/plaid',
  },
  staging: {
    environment: 'development' as const,
    clientName: 'SpendLot Receipt Tracker',
    products: ['transactions', 'auth', 'identity'],
    countryCodes: ['US', 'CA'],
    language: 'en',
    webhook: 'https://staging-api.spendlot.com/webhooks/plaid',
  },
  production: {
    environment: 'production' as const,
    clientName: 'SpendLot Receipt Tracker',
    products: ['transactions', 'auth', 'identity'],
    countryCodes: ['US', 'CA'],
    language: 'en',
    webhook: 'https://api.spendlot.com/webhooks/plaid',
  },
};

// Get current Plaid configuration based on environment
export const getPlaidConfig = (): PlaidConfig => {
  if (__DEV__) {
    return PLAID_ENVIRONMENTS.development;
  }
  
  // In a real app, you might check an environment variable or config
  // For now, we'll use production for non-dev builds
  return PLAID_ENVIRONMENTS.production;
};

// Plaid Link configuration for React Native
export const getPlaidLinkConfig = (linkToken: string) => {
  const config = getPlaidConfig();
  
  return {
    token: linkToken,
    onSuccess: (public_token: string, metadata: any) => {
      console.log('Plaid Link success:', { public_token, metadata });
      // This will be handled by the component using Plaid Link
    },
    onExit: (err: any, metadata: any) => {
      console.log('Plaid Link exit:', { err, metadata });
      // This will be handled by the component using Plaid Link
    },
    onEvent: (eventName: string, metadata: any) => {
      console.log('Plaid Link event:', { eventName, metadata });
      // Optional: Track events for analytics
    },
    environment: config.environment,
    clientName: config.clientName,
  };
};

// Account type mapping for display
export const PLAID_ACCOUNT_TYPES = {
  depository: {
    checking: 'Checking Account',
    savings: 'Savings Account',
    hsa: 'Health Savings Account',
    cd: 'Certificate of Deposit',
    money_market: 'Money Market Account',
    paypal: 'PayPal Account',
    prepaid: 'Prepaid Account',
    cash_management: 'Cash Management Account',
    ebt: 'EBT Account',
  },
  investment: {
    '401a': '401(a) Account',
    '401k': '401(k) Account',
    '403B': '403(b) Account',
    '457b': '457(b) Account',
    '529': '529 Education Savings Account',
    brokerage: 'Brokerage Account',
    cash_isa: 'Cash ISA',
    education_savings_account: 'Education Savings Account',
    fixed_annuity: 'Fixed Annuity',
    gic: 'Guaranteed Investment Certificate',
    health_reimbursement_arrangement: 'Health Reimbursement Arrangement',
    ira: 'Individual Retirement Account',
    isa: 'Individual Savings Account',
    keogh: 'Keogh Plan',
    lif: 'Life Income Fund',
    lira: 'Locked-in Retirement Account',
    lrif: 'Locked-in Retirement Income Fund',
    lrsp: 'Locked-in Retirement Savings Plan',
    mutual_fund: 'Mutual Fund',
    non_taxable_brokerage_account: 'Non-Taxable Brokerage Account',
    other: 'Other Investment Account',
    other_annuity: 'Other Annuity',
    other_insurance: 'Other Insurance',
    pension: 'Pension',
    prif: 'Prescribed Retirement Income Fund',
    profit_sharing_plan: 'Profit Sharing Plan',
    qshr: 'Qualified Shared Responsibility',
    rdsp: 'Registered Disability Savings Plan',
    resp: 'Registered Education Savings Plan',
    retirement: 'Retirement Account',
    rlif: 'Restricted Life Income Fund',
    roth: 'Roth IRA',
    roth_401k: 'Roth 401(k)',
    rrif: 'Registered Retirement Income Fund',
    rrsp: 'Registered Retirement Savings Plan',
    sarsep: 'Salary Reduction Simplified Employee Pension',
    sep_ira: 'Simplified Employee Pension IRA',
    simple_ira: 'Savings Incentive Match Plan for Employees IRA',
    sipp: 'Self-Invested Personal Pension',
    stock_plan: 'Stock Plan',
    tfsa: 'Tax-Free Savings Account',
    trust: 'Trust Account',
    ugma: 'Uniform Gifts to Minors Act',
    utma: 'Uniform Transfers to Minors Act',
    variable_annuity: 'Variable Annuity',
  },
  loan: {
    auto: 'Auto Loan',
    business: 'Business Loan',
    commercial: 'Commercial Loan',
    construction: 'Construction Loan',
    consumer: 'Consumer Loan',
    home_equity: 'Home Equity Loan',
    loan: 'General Loan',
    mortgage: 'Mortgage',
    overdraft: 'Overdraft',
    line_of_credit: 'Line of Credit',
    student: 'Student Loan',
    other: 'Other Loan',
  },
  credit: {
    credit_card: 'Credit Card',
    paypal: 'PayPal Credit',
    other: 'Other Credit Account',
  },
  other: {
    other: 'Other Account',
  },
};

// Get display name for account type
export const getAccountTypeDisplayName = (type: string, subtype?: string): string => {
  if (subtype && PLAID_ACCOUNT_TYPES[type as keyof typeof PLAID_ACCOUNT_TYPES]) {
    const subtypes = PLAID_ACCOUNT_TYPES[type as keyof typeof PLAID_ACCOUNT_TYPES];
    return subtypes[subtype as keyof typeof subtypes] || `${type} - ${subtype}`;
  }
  
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Plaid error codes and user-friendly messages
export const PLAID_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'The provided credentials are invalid. Please check your username and password.',
  INVALID_MFA: 'The provided multi-factor authentication code is invalid.',
  ITEM_LOGIN_REQUIRED: 'Your bank requires you to log in again. Please reconnect your account.',
  INSUFFICIENT_CREDENTIALS: 'Additional information is required to connect your account.',
  INVALID_UPDATED_USERNAME: 'The updated username is invalid.',
  INVALID_UPDATED_PASSWORD: 'The updated password is invalid.',
  ITEM_LOCKED: 'Your account is temporarily locked. Please try again later.',
  USER_SETUP_REQUIRED: 'Additional setup is required for your account.',
  MFA_NOT_SUPPORTED: 'Multi-factor authentication is not supported for this account.',
  INVALID_SEND_METHOD: 'The selected delivery method for multi-factor authentication is invalid.',
  ACCOUNT_LOCKED: 'Your account is locked. Please contact your bank.',
  ACCOUNT_NOT_SUPPORTED: 'This account type is not supported.',
  INVALID_ACCOUNT_NUMBER: 'The provided account number is invalid.',
  UNABLE_TO_FIND_INSTITUTION: 'Unable to find your financial institution.',
  INSTITUTION_DOWN: 'Your bank is currently experiencing technical difficulties. Please try again later.',
  INSTITUTION_NOT_RESPONDING: 'Your bank is not responding. Please try again later.',
  INSTITUTION_NO_LONGER_SUPPORTED: 'This financial institution is no longer supported.',
  ITEM_NOT_SUPPORTED: 'This account is no longer supported.',
  TOO_MANY_VERIFICATION_ATTEMPTS: 'Too many verification attempts. Please try again later.',
  WEBHOOKS_NOT_ENABLED: 'Webhooks are not enabled for this item.',
  WEBHOOK_UPDATE_ACKNOWLEDGED: 'Webhook update acknowledged.',
  PENDING_EXPIRATION: 'Your connection will expire soon. Please reconnect your account.',
  USER_PERMISSION_REVOKED: 'Permission to access this account has been revoked.',
  ITEM_NO_ERROR: 'No error occurred.',
};

// Get user-friendly error message
export const getPlaidErrorMessage = (errorCode: string): string => {
  return PLAID_ERROR_MESSAGES[errorCode as keyof typeof PLAID_ERROR_MESSAGES] || 
         'An unexpected error occurred while connecting to your bank. Please try again.';
};

// Plaid institution colors for UI
export const INSTITUTION_COLORS = {
  'chase': '#0066b2',
  'bank_of_america': '#e31837',
  'wells_fargo': '#d71e2b',
  'citibank': '#056dae',
  'us_bank': '#004c97',
  'pnc': '#004c97',
  'capital_one': '#004879',
  'td_bank': '#00b04f',
  'bb_t': '#00205b',
  'suntrust': '#f47920',
  'regions': '#005030',
  'fifth_third': '#004b87',
  'ally': '#7b68ee',
  'discover': '#ff6000',
  'american_express': '#006fcf',
  'default': '#6b7280',
};

// Get institution color
export const getInstitutionColor = (institutionId: string): string => {
  const normalizedId = institutionId.toLowerCase().replace(/[^a-z]/g, '_');
  return INSTITUTION_COLORS[normalizedId as keyof typeof INSTITUTION_COLORS] || 
         INSTITUTION_COLORS.default;
};

export default {
  getPlaidConfig,
  getPlaidLinkConfig,
  getAccountTypeDisplayName,
  getPlaidErrorMessage,
  getInstitutionColor,
};
