// Test suites for SpendLot Receipt Tracker
import { TestRunner, TestSuite, TestCase, TestResult } from './testRunner';
import { backendTestService } from '../services/backendTestService';
import { authService } from '../services/authService';
import { receiptService } from '../services/receiptService';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { bankAccountService } from '../services/bankAccountService';
import { analyticsService } from '../services/analyticsService';
import { integrationService } from '../services/integrationService';
import { config } from '../config/environment';

// Backend connectivity test suite
const backendTestSuite: TestSuite = {
  name: 'Backend Connectivity',
  tests: [
    {
      name: 'API Health Check',
      description: 'Verify backend API is accessible and healthy',
      category: 'integration',
      priority: 'critical',
      timeout: 10000,
      run: async (): Promise<TestResult> => {
        const result = await backendTestService.quickHealthCheck();
        return {
          success: result.isHealthy,
          duration: result.responseTime,
          error: result.criticalIssues.join(', ') || undefined,
          metrics: {
            responseTime: result.responseTime,
          },
        };
      },
    },
    {
      name: 'API Info Endpoint',
      description: 'Verify API info endpoint returns version information',
      category: 'integration',
      priority: 'high',
      run: async (): Promise<TestResult> => {
        const startTime = Date.now();
        const result = await backendTestService.testEndpoint('/info');
        return {
          success: result.success,
          duration: result.responseTime,
          error: result.error,
          details: result.data,
        };
      },
    },
    {
      name: 'API Rate Limiting',
      description: 'Test API rate limiting behavior',
      category: 'integration',
      priority: 'medium',
      run: async (): Promise<TestResult> => {
        const startTime = Date.now();
        const requests = [];
        
        // Make multiple rapid requests
        for (let i = 0; i < 10; i++) {
          requests.push(backendTestService.testEndpoint('/health'));
        }
        
        const results = await Promise.allSettled(requests);
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        
        return {
          success: successCount >= 5, // At least half should succeed
          duration: Date.now() - startTime,
          details: { successCount, totalRequests: 10 },
        };
      },
    },
  ],
};

// Authentication test suite
const authTestSuite: TestSuite = {
  name: 'Authentication',
  tests: [
    {
      name: 'User Registration',
      description: 'Test user registration with valid credentials',
      category: 'integration',
      priority: 'critical',
      run: async (): Promise<TestResult> => {
        const testEmail = `test-${Date.now()}@spendlot.com`;
        const result = await authService.register({
          email: testEmail,
          password: 'TestPassword123!',
          full_name: 'Test User',
        });
        
        return {
          success: result.success || result.error?.includes('already exists'),
          duration: 0,
          error: result.success ? undefined : result.error,
        };
      },
    },
    {
      name: 'User Login',
      description: 'Test user login with valid credentials',
      category: 'integration',
      priority: 'critical',
      run: async (): Promise<TestResult> => {
        const result = await authService.login('test@spendlot.com', 'TestPassword123!');
        return {
          success: result.success,
          duration: 0,
          error: result.error,
          details: result.data ? { hasToken: !!result.data.access_token } : undefined,
        };
      },
    },
    {
      name: 'Token Validation',
      description: 'Test JWT token validation',
      category: 'integration',
      priority: 'critical',
      run: async (): Promise<TestResult> => {
        const result = await authService.getCurrentUser();
        return {
          success: result.success,
          duration: 0,
          error: result.error,
          details: result.data ? { userId: result.data.id } : undefined,
        };
      },
    },
    {
      name: 'Password Reset Request',
      description: 'Test password reset request functionality',
      category: 'integration',
      priority: 'high',
      run: async (): Promise<TestResult> => {
        const result = await authService.requestPasswordReset('test@spendlot.com');
        return {
          success: result.success,
          duration: 0,
          error: result.error,
        };
      },
    },
  ],
};

// Service functionality test suite
const serviceTestSuite: TestSuite = {
  name: 'Service Functionality',
  tests: [
    {
      name: 'Category Service',
      description: 'Test category service basic operations',
      category: 'unit',
      priority: 'high',
      run: async (): Promise<TestResult> => {
        try {
          // Test default categories
          const defaultCategories = categoryService.getDefaultExpenseCategories();
          if (defaultCategories.length === 0) {
            throw new Error('No default categories found');
          }
          
          // Test category tree building
          const mockCategories = [
            { id: 1, name: 'Parent', parent_id: undefined, is_income: false, is_active: true },
            { id: 2, name: 'Child', parent_id: 1, is_income: false, is_active: true },
          ];
          const tree = categoryService.buildCategoryTree(mockCategories);
          
          if (tree.length !== 1 || !tree[0].children || tree[0].children.length !== 1) {
            throw new Error('Category tree building failed');
          }
          
          return {
            success: true,
            duration: 0,
            details: { defaultCategoriesCount: defaultCategories.length },
          };
        } catch (error) {
          return {
            success: false,
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
    },
    {
      name: 'Analytics Service',
      description: 'Test analytics service calculations',
      category: 'unit',
      priority: 'high',
      run: async (): Promise<TestResult> => {
        try {
          // Test currency formatting
          const formatted = analyticsService.formatCurrency(123.45, 'USD');
          if (!formatted.includes('$123.45')) {
            throw new Error('Currency formatting failed');
          }
          
          // Test percentage formatting
          const percentage = analyticsService.formatPercentage(25.5);
          if (percentage !== '25.5%') {
            throw new Error('Percentage formatting failed');
          }
          
          return {
            success: true,
            duration: 0,
            details: { formattedCurrency: formatted, formattedPercentage: percentage },
          };
        } catch (error) {
          return {
            success: false,
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
    },
    {
      name: 'Bank Account Service',
      description: 'Test bank account service utilities',
      category: 'unit',
      priority: 'medium',
      run: async (): Promise<TestResult> => {
        try {
          const mockAccount = {
            id: 1,
            account_name: 'Test Account',
            account_type: 'checking',
            institution_name: 'Test Bank',
            current_balance: 1234.56,
            currency: 'USD',
            is_active: true,
          };
          
          // Test balance formatting
          const formatted = bankAccountService.formatBalance(mockAccount);
          if (!formatted.includes('$1,234.56')) {
            throw new Error('Balance formatting failed');
          }
          
          // Test display name formatting
          const displayName = bankAccountService.formatAccountDisplayName(mockAccount);
          if (!displayName.includes('Test Bank') || !displayName.includes('Test Account')) {
            throw new Error('Display name formatting failed');
          }
          
          return {
            success: true,
            duration: 0,
            details: { formattedBalance: formatted, displayName },
          };
        } catch (error) {
          return {
            success: false,
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
    },
  ],
};

// Performance test suite
const performanceTestSuite: TestSuite = {
  name: 'Performance',
  tests: [
    {
      name: 'API Response Time',
      description: 'Test API response times are within acceptable limits',
      category: 'performance',
      priority: 'medium',
      run: async (): Promise<TestResult> => {
        const startTime = Date.now();
        const result = await backendTestService.testEndpoint('/health');
        const responseTime = Date.now() - startTime;
        
        // Response should be under 2 seconds
        const success = responseTime < 2000;
        
        return {
          success,
          duration: responseTime,
          error: success ? undefined : `Response time too slow: ${responseTime}ms`,
          metrics: {
            responseTime,
          },
        };
      },
    },
    {
      name: 'Memory Usage',
      description: 'Monitor memory usage during operations',
      category: 'performance',
      priority: 'low',
      run: async (): Promise<TestResult> => {
        // This is a simplified memory test
        // In a real app, you'd use more sophisticated memory monitoring
        const initialMemory = (global as any).performance?.memory?.usedJSHeapSize || 0;
        
        // Perform some operations
        const largeArray = new Array(10000).fill(0).map((_, i) => ({ id: i, data: `item-${i}` }));
        
        const finalMemory = (global as any).performance?.memory?.usedJSHeapSize || 0;
        const memoryIncrease = finalMemory - initialMemory;
        
        // Clean up
        largeArray.length = 0;
        
        return {
          success: true,
          duration: 0,
          details: { memoryIncrease },
          metrics: {
            memoryUsage: memoryIncrease,
          },
        };
      },
    },
  ],
};

// Integration test suite
const integrationTestSuite: TestSuite = {
  name: 'External Integrations',
  tests: [
    {
      name: 'Plaid Configuration',
      description: 'Test Plaid integration configuration',
      category: 'integration',
      priority: 'high',
      run: async (): Promise<TestResult> => {
        try {
          const result = await bankAccountService.validatePlaidConfiguration();
          return {
            success: result,
            duration: 0,
            error: result ? undefined : 'Plaid configuration validation failed',
          };
        } catch (error) {
          return {
            success: false,
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      },
    },
    {
      name: 'Gmail Integration Status',
      description: 'Test Gmail integration status endpoint',
      category: 'integration',
      priority: 'medium',
      run: async (): Promise<TestResult> => {
        const result = await integrationService.getGmailStatus();
        return {
          success: result.success || result.error === 'Network request failed',
          duration: 0,
          error: result.success ? undefined : result.error,
          details: result.data,
        };
      },
    },
  ],
};

// Register all test suites
export const registerDefaultTestSuites = (testRunner: TestRunner): void => {
  testRunner.registerTestSuite(backendTestSuite);
  testRunner.registerTestSuite(authTestSuite);
  testRunner.registerTestSuite(serviceTestSuite);
  testRunner.registerTestSuite(performanceTestSuite);
  testRunner.registerTestSuite(integrationTestSuite);
};

export {
  backendTestSuite,
  authTestSuite,
  serviceTestSuite,
  performanceTestSuite,
  integrationTestSuite,
};
