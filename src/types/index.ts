// Core types for the SpendLot Receipt Tracker app

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  timezone: string;
  currency: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Receipt {
  id: number;
  merchant_name?: string;
  amount?: number;
  currency: string;
  transaction_date?: string;
  processing_status: 'pending' | 'completed' | 'failed';
  ocr_confidence?: number;
  is_verified: boolean;
  category_id?: number;
  notes?: string;
  file_path?: string;
  created_at: string;
}

export interface ReceiptItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
}

export interface Transaction {
  id: number;
  amount: number;
  currency: string;
  description?: string;
  transaction_date: string;
  transaction_type: 'credit' | 'debit';
  merchant_name?: string;
  category_id?: number;
  account_id?: number;
  is_pending: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parent_id?: number;
  is_income: boolean;
  is_active: boolean;
}

export interface SpendingSummary {
  totalAmount: number;
  currency: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  categoryBreakdown: CategorySpending[];
  transactionCount: number;
}

export interface CategorySpending {
  category: Category;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface BankAccount {
  id: number;
  account_name: string;
  account_type: string;
  institution_name: string;
  current_balance?: number;
  currency: string;
  is_active: boolean;
  last_sync_at?: string;
}

export interface Integration {
  id: string;
  type: IntegrationType;
  status: IntegrationStatus;
  lastSync?: string;
  settings: Record<string, any>;
}

// Enums
export enum OCRStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ReceiptSource {
  CAMERA = 'camera',
  GALLERY = 'gallery',
  EMAIL = 'email',
  MANUAL = 'manual',
}

export enum TransactionSource {
  RECEIPT = 'receipt',
  BANK = 'bank',
  MANUAL = 'manual',
}

export enum IntegrationType {
  GMAIL = 'gmail',
  BANK = 'bank',
}

export enum IntegrationStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  PENDING = 'pending',
}

// API Response types
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: number;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface APIError {
  error: string;
  message: string;
  details?: any;
  status_code?: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ReceiptEditForm {
  merchantName: string;
  amount: string;
  date: string;
  categoryId: string;
  items: ReceiptItemForm[];
}

export interface ReceiptItemForm {
  name: string;
  quantity: string;
  unitPrice: string;
}

// Camera and Image types
export interface CameraSettings {
  flashMode: 'on' | 'off' | 'auto';
  quality: number;
  ratio: string;
  autoFocus: boolean;
}

export interface ImageProcessingOptions {
  compress: number;
  format: 'jpeg' | 'png';
  base64: boolean;
  exif: boolean;
}

export interface ReceiptScanResult {
  imageUri: string;
  confidence: number;
  detectedText?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  processingTime: number;
}

export interface CameraState {
  isReady: boolean;
  hasPermission: boolean;
  isRecording: boolean;
  flashMode: 'on' | 'off' | 'auto';
  cameraType: 'front' | 'back';
  zoom: number;
  focusPoint: { x: number; y: number } | null;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Receipts: undefined;
  Transactions: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type ReceiptStackParamList = {
  ReceiptList: undefined;
  ReceiptCamera: undefined;
  ReceiptGallery: undefined;
  ReceiptPreview: {
    imageUri: string;
    source: 'camera' | 'gallery';
    scanResult?: ReceiptScanResult;
  };
  ReceiptEdit: {
    receiptId?: string;
    imageUri?: string;
    ocrData?: any;
  };
  ReceiptDetail: { receiptId: string };
  ReceiptSuccess: { receiptId: string };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  BankAccounts: undefined;
  Profile: undefined;
  Notifications: undefined;
  Privacy: undefined;
  BackendTest: undefined;
};

// Context types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOffline: boolean;
}
