import { apiService } from './api';
import { authService } from './authService';
import { receiptService } from './receiptService';
import { transactionService } from './transactionService';
import { categoryService } from './categoryService';
import { bankAccountService } from './bankAccountService';
import { analyticsService } from './analyticsService';
import { integrationService } from './integrationService';

interface TestResult {
  service: string;
  endpoint: string;
  method: string;
  success: boolean;
  responseTime: number;
  error?: string;
  statusCode?: number;
}

interface BackendTestSuite {
  connectionTest: TestResult;
  authenticationTests: TestResult[];
  coreServiceTests: TestResult[];
  integrationTests: TestResult[];
  summary: {
    totalTests: number;
    passed: number;
    failed: number;
    averageResponseTime: number;
    overallHealth: 'healthy' | 'degraded' | 'unhealthy';
  };
}

class BackendTestService {
  async runFullTestSuite(): Promise<BackendTestSuite> {
    console.log('🧪 Starting comprehensive backend integration tests...');
    
    const results: BackendTestSuite = {
      connectionTest: await this.testConnection(),
      authenticationTests: await this.testAuthenticationFlow(),
      coreServiceTests: await this.testCoreServices(),
      integrationTests: await this.testExternalIntegrations(),
      summary: {
        totalTests: 0,
        passed: 0,
        failed: 0,
        averageResponseTime: 0,
        overallHealth: 'unhealthy',
      },
    };

    // Calculate summary
    const allTests = [
      results.connectionTest,
      ...results.authenticationTests,
      ...results.coreServiceTests,
      ...results.integrationTests,
    ];

    results.summary.totalTests = allTests.length;
    results.summary.passed = allTests.filter(t => t.success).length;
    results.summary.failed = allTests.filter(t => !t.success).length;
    results.summary.averageResponseTime = allTests.reduce((sum, t) => sum + t.responseTime, 0) / allTests.length;

    // Determine overall health
    const successRate = results.summary.passed / results.summary.totalTests;
    if (successRate >= 0.9) results.summary.overallHealth = 'healthy';
    else if (successRate >= 0.7) results.summary.overallHealth = 'degraded';
    else results.summary.overallHealth = 'unhealthy';

    this.printTestResults(results);
    return results;
  }

  private async testConnection(): Promise<TestResult> {
    return await this.runTest('API', '/health', 'GET', async () => {
      return await apiService.testConnection();
    });
  }

  private async testAuthenticationFlow(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test user registration (if test user doesn't exist)
    tests.push(await this.runTest('Auth', '/auth/register', 'POST', async () => {
      return await authService.register({
        email: 'test@spendlot.com',
        password: 'TestPassword123!',
        full_name: 'Test User',
      });
    }));

    // Test user login
    tests.push(await this.runTest('Auth', '/auth/login', 'POST', async () => {
      return await authService.login('test@spendlot.com', 'TestPassword123!');
    }));

    // Test token verification
    tests.push(await this.runTest('Auth', '/auth/verify', 'GET', async () => {
      return await apiService.testAuthentication();
    }));

    // Test user profile retrieval
    tests.push(await this.runTest('Auth', '/users/me', 'GET', async () => {
      return await authService.getCurrentUser();
    }));

    return tests;
  }

  private async testCoreServices(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test Categories
    tests.push(await this.runTest('Categories', '/categories', 'GET', async () => {
      return await categoryService.getCategories();
    }));

    tests.push(await this.runTest('Categories', '/categories/tree', 'GET', async () => {
      return await categoryService.getCategoryTree();
    }));

    // Test Receipts
    tests.push(await this.runTest('Receipts', '/receipts', 'GET', async () => {
      return await receiptService.getReceipts();
    }));

    // Test Transactions
    tests.push(await this.runTest('Transactions', '/transactions', 'GET', async () => {
      return await transactionService.getTransactions();
    }));

    tests.push(await this.runTest('Transactions', '/transactions/summary/current-month', 'GET', async () => {
      return await transactionService.getCurrentMonthSummary();
    }));

    // Test Analytics
    tests.push(await this.runTest('Analytics', '/analytics/spending-summary', 'GET', async () => {
      return await analyticsService.getCurrentMonthSummary();
    }));

    tests.push(await this.runTest('Analytics', '/analytics/monthly-trends', 'GET', async () => {
      return await analyticsService.getMonthlyTrends();
    }));

    // Test Bank Accounts
    tests.push(await this.runTest('BankAccounts', '/bank-accounts', 'GET', async () => {
      return await bankAccountService.getBankAccounts();
    }));

    return tests;
  }

  private async testExternalIntegrations(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test Gmail Integration
    tests.push(await this.runTest('Integration', '/auth/gmail/status', 'GET', async () => {
      return await integrationService.getGmailStatus();
    }));

    // Test Plaid Integration
    tests.push(await this.runTest('BankAccounts', '/bank-accounts/plaid/link-token', 'POST', async () => {
      return await bankAccountService.createPlaidLinkToken();
    }));

    return tests;
  }

  private async runTest(
    service: string,
    endpoint: string,
    method: string,
    testFn: () => Promise<any>
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const responseTime = Date.now() - startTime;
      
      return {
        service,
        endpoint,
        method,
        success: result.success || result.data !== undefined,
        responseTime,
        statusCode: 200,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      
      return {
        service,
        endpoint,
        method,
        success: false,
        responseTime,
        error: error.message || 'Unknown error',
        statusCode: error.response?.status || 0,
      };
    }
  }

  private printTestResults(results: BackendTestSuite): void {
    console.log('\n📊 Backend Integration Test Results');
    console.log('=====================================');
    
    // Connection Test
    console.log('\n🔗 Connection Test:');
    this.printTestResult(results.connectionTest);
    
    // Authentication Tests
    console.log('\n🔐 Authentication Tests:');
    results.authenticationTests.forEach(test => this.printTestResult(test));
    
    // Core Service Tests
    console.log('\n⚙️ Core Service Tests:');
    results.coreServiceTests.forEach(test => this.printTestResult(test));
    
    // Integration Tests
    console.log('\n🔗 External Integration Tests:');
    results.integrationTests.forEach(test => this.printTestResult(test));
    
    // Summary
    console.log('\n📋 Summary:');
    console.log(`Total Tests: ${results.summary.totalTests}`);
    console.log(`Passed: ${results.summary.passed} ✅`);
    console.log(`Failed: ${results.summary.failed} ❌`);
    console.log(`Success Rate: ${((results.summary.passed / results.summary.totalTests) * 100).toFixed(1)}%`);
    console.log(`Average Response Time: ${results.summary.averageResponseTime.toFixed(0)}ms`);
    console.log(`Overall Health: ${this.getHealthEmoji(results.summary.overallHealth)} ${results.summary.overallHealth.toUpperCase()}`);
  }

  private printTestResult(test: TestResult): void {
    const status = test.success ? '✅' : '❌';
    const time = `${test.responseTime}ms`;
    console.log(`  ${status} ${test.service} ${test.method} ${test.endpoint} (${time})`);
    
    if (!test.success && test.error) {
      console.log(`    Error: ${test.error}`);
    }
  }

  private getHealthEmoji(health: string): string {
    switch (health) {
      case 'healthy': return '🟢';
      case 'degraded': return '🟡';
      case 'unhealthy': return '🔴';
      default: return '⚪';
    }
  }

  // Quick health check for critical endpoints
  async quickHealthCheck(): Promise<{
    isHealthy: boolean;
    criticalIssues: string[];
    responseTime: number;
  }> {
    const startTime = Date.now();
    const criticalIssues: string[] = [];

    try {
      // Test basic connection
      const connectionResult = await apiService.testConnection();
      if (!connectionResult.success) {
        criticalIssues.push('Backend connection failed');
      }

      // Test authentication endpoint
      const authResult = await apiService.testAuthentication();
      if (!authResult.success && authResult.error !== 'No authentication token found') {
        criticalIssues.push('Authentication endpoint failed');
      }

      const responseTime = Date.now() - startTime;
      
      return {
        isHealthy: criticalIssues.length === 0,
        criticalIssues,
        responseTime,
      };
    } catch (error) {
      return {
        isHealthy: false,
        criticalIssues: ['Backend completely unreachable'],
        responseTime: Date.now() - startTime,
      };
    }
  }

  // Test specific endpoint with detailed response analysis
  async testEndpoint(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'): Promise<{
    success: boolean;
    responseTime: number;
    statusCode?: number;
    headers?: Record<string, string>;
    data?: any;
    error?: string;
  }> {
    const startTime = Date.now();
    
    try {
      let response;
      switch (method) {
        case 'GET':
          response = await apiService.get(endpoint);
          break;
        case 'POST':
          response = await apiService.post(endpoint, {});
          break;
        case 'PUT':
          response = await apiService.put(endpoint, {});
          break;
        case 'DELETE':
          response = await apiService.delete(endpoint);
          break;
      }

      return {
        success: response.success,
        responseTime: Date.now() - startTime,
        statusCode: 200,
        data: response.data,
        error: response.error,
      };
    } catch (error: any) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        statusCode: error.response?.status,
        error: error.message,
      };
    }
  }
}

export const backendTestService = new BackendTestService();
export default BackendTestService;
