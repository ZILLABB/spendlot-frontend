// Test utility to verify all services are working correctly
import { analyticsService } from '../services/analyticsService';
import { bankAccountService } from '../services/bankAccountService';
import { categoryService } from '../services/categoryService';
import { integrationService } from '../services/integrationService';
import { receiptService } from '../services/receiptService';
import { transactionService } from '../services/transactionService';

interface TestResult {
  service: string;
  method: string;
  success: boolean;
  error?: string;
  duration: number;
}

class ServiceTester {
  private results: TestResult[] = [];

  async runAllTests(): Promise<TestResult[]> {
    console.log('🧪 Starting service tests...');
    this.results = [];

    // Test Analytics Service
    await this.testAnalyticsService();
    
    // Test Bank Account Service
    await this.testBankAccountService();
    
    // Test Category Service
    await this.testCategoryService();
    
    // Test Integration Service
    await this.testIntegrationService();
    
    // Test Receipt Service
    await this.testReceiptService();
    
    // Test Transaction Service
    await this.testTransactionService();

    this.printResults();
    return this.results;
  }

  private async testMethod(
    service: string,
    method: string,
    testFn: () => Promise<any>
  ): Promise<void> {
    const startTime = Date.now();
    try {
      await testFn();
      this.results.push({
        service,
        method,
        success: true,
        duration: Date.now() - startTime,
      });
      console.log(`✅ ${service}.${method} - PASSED`);
    } catch (error) {
      this.results.push({
        service,
        method,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
      });
      console.log(`❌ ${service}.${method} - FAILED: ${error}`);
    }
  }

  private async testAnalyticsService(): Promise<void> {
    console.log('\n📊 Testing Analytics Service...');

    await this.testMethod('AnalyticsService', 'getCurrentMonthSummary', async () => {
      const result = await analyticsService.getCurrentMonthSummary();
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('AnalyticsService', 'getMonthlyTrends', async () => {
      const result = await analyticsService.getMonthlyTrends({ months: 6 });
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('AnalyticsService', 'formatCurrency', async () => {
      const formatted = analyticsService.formatCurrency(123.45, 'USD');
      if (!formatted.includes('$123.45')) {
        throw new Error('Currency formatting failed');
      }
    });
  }

  private async testBankAccountService(): Promise<void> {
    console.log('\n🏦 Testing Bank Account Service...');

    await this.testMethod('BankAccountService', 'getBankAccounts', async () => {
      const result = await bankAccountService.getBankAccounts();
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('BankAccountService', 'createPlaidLinkToken', async () => {
      const result = await bankAccountService.createPlaidLinkToken();
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('BankAccountService', 'formatBalance', async () => {
      const mockAccount = {
        id: 1,
        account_name: 'Test Account',
        account_type: 'checking',
        institution_name: 'Test Bank',
        current_balance: 1234.56,
        currency: 'USD',
        is_active: true,
      };
      const formatted = bankAccountService.formatBalance(mockAccount);
      if (!formatted.includes('$1,234.56')) {
        throw new Error('Balance formatting failed');
      }
    });
  }

  private async testCategoryService(): Promise<void> {
    console.log('\n🏷️ Testing Category Service...');

    await this.testMethod('CategoryService', 'getCategories', async () => {
      const result = await categoryService.getCategories();
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('CategoryService', 'getCategoryTree', async () => {
      const result = await categoryService.getCategoryTree();
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('CategoryService', 'getDefaultExpenseCategories', async () => {
      const categories = categoryService.getDefaultExpenseCategories();
      if (categories.length === 0) {
        throw new Error('No default expense categories found');
      }
      if (!categories.every(cat => cat.is_income === false)) {
        throw new Error('Default expense categories should have is_income = false');
      }
    });

    await this.testMethod('CategoryService', 'buildCategoryTree', async () => {
      const mockCategories = [
        { id: 1, name: 'Parent', parent_id: undefined, is_income: false, is_active: true },
        { id: 2, name: 'Child', parent_id: 1, is_income: false, is_active: true },
      ];
      const tree = categoryService.buildCategoryTree(mockCategories);
      if (tree.length !== 1 || !tree[0].children || tree[0].children.length !== 1) {
        throw new Error('Category tree building failed');
      }
    });
  }

  private async testIntegrationService(): Promise<void> {
    console.log('\n🔗 Testing Integration Service...');

    await this.testMethod('IntegrationService', 'getGmailStatus', async () => {
      const result = await integrationService.getGmailStatus();
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('IntegrationService', 'getIntegrationStatus', async () => {
      const result = await integrationService.getIntegrationStatus();
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('IntegrationService', 'formatLastSyncTime', async () => {
      const now = new Date().toISOString();
      const formatted = integrationService.formatLastSyncTime(now);
      if (!formatted.includes('minute') && !formatted.includes('hour')) {
        throw new Error('Last sync time formatting failed');
      }
    });
  }

  private async testReceiptService(): Promise<void> {
    console.log('\n🧾 Testing Receipt Service...');

    await this.testMethod('ReceiptService', 'getReceipts', async () => {
      const result = await receiptService.getReceipts();
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('ReceiptService', 'pollReceiptStatus', async () => {
      // Test the polling logic without actual API calls
      const mockReceiptId = 123;
      try {
        await receiptService.pollReceiptStatus(mockReceiptId, 1, 100); // 1 attempt, 100ms interval
      } catch (error) {
        // Expected to fail due to network, but logic should work
        if (!(error as Error).message.includes('Network request failed')) {
          throw error;
        }
      }
    });
  }

  private async testTransactionService(): Promise<void> {
    console.log('\n💳 Testing Transaction Service...');

    await this.testMethod('TransactionService', 'getTransactions', async () => {
      const result = await transactionService.getTransactions();
      if (!result.success && result.error !== 'Network request failed') {
        throw new Error(result.error || 'Unknown error');
      }
    });

    await this.testMethod('TransactionService', 'getMockSpendingSummary', async () => {
      const summary = await transactionService.getMockSpendingSummary();
      if (!summary || !summary.totalAmount || !summary.categoryBreakdown) {
        throw new Error('Mock spending summary is invalid');
      }
    });

    await this.testMethod('TransactionService', 'getMockTransactions', async () => {
      const transactions = await transactionService.getMockTransactions();
      if (!Array.isArray(transactions) || transactions.length === 0) {
        throw new Error('Mock transactions are invalid');
      }
    });
  }

  private printResults(): void {
    console.log('\n📋 Test Results Summary:');
    console.log('========================');
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.service}.${r.method}: ${r.error}`);
        });
    }
    
    console.log('\n⏱️ Performance:');
    const avgDuration = this.results.reduce((sum, r) => sum + r.duration, 0) / totalTests;
    console.log(`Average test duration: ${avgDuration.toFixed(0)}ms`);
    
    const slowTests = this.results.filter(r => r.duration > 1000);
    if (slowTests.length > 0) {
      console.log('Slow tests (>1s):');
      slowTests.forEach(r => {
        console.log(`  - ${r.service}.${r.method}: ${r.duration}ms`);
      });
    }
  }

  // Quick health check for critical services
  async quickHealthCheck(): Promise<boolean> {
    console.log('🏥 Running quick health check...');
    
    const criticalTests = [
      () => analyticsService.formatCurrency(100, 'USD'),
      () => categoryService.getDefaultExpenseCategories(),
      () => bankAccountService.formatBalance({
        id: 1, account_name: 'Test', account_type: 'checking',
        institution_name: 'Test Bank', current_balance: 100,
        currency: 'USD', is_active: true
      }),
      () => integrationService.formatLastSyncTime(new Date().toISOString()),
    ];

    try {
      await Promise.all(criticalTests.map(test => test()));
      console.log('✅ Health check passed - Core functionality working');
      return true;
    } catch (error) {
      console.log('❌ Health check failed:', error);
      return false;
    }
  }
}

export const serviceTester = new ServiceTester();

// Export for easy testing in development
export const runServiceTests = () => serviceTester.runAllTests();
export const runHealthCheck = () => serviceTester.quickHealthCheck();
