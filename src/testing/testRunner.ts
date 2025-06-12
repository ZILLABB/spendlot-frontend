// Comprehensive test runner for SpendLot Receipt Tracker
import { backendTestService } from '../services/backendTestService';
import { serviceTester } from '../utils/testServices';
import { config, validateConfig } from '../config/environment';
import { errorHandler } from '../utils/errorHandler';

export interface TestSuite {
  name: string;
  tests: TestCase[];
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

export interface TestCase {
  name: string;
  description: string;
  category: 'unit' | 'integration' | 'e2e' | 'performance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeout?: number;
  run: () => Promise<TestResult>;
}

export interface TestResult {
  success: boolean;
  duration: number;
  error?: string;
  details?: any;
  metrics?: {
    responseTime?: number;
    memoryUsage?: number;
    networkRequests?: number;
  };
}

export interface TestRunSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  successRate: number;
  categories: Record<string, { passed: number; failed: number }>;
  priorities: Record<string, { passed: number; failed: number }>;
  failedTests: Array<{
    name: string;
    error: string;
    category: string;
    priority: string;
  }>;
}

class TestRunner {
  private testSuites: TestSuite[] = [];
  private results: Map<string, TestResult> = new Map();
  private isRunning = false;

  // Register test suites
  registerTestSuite(suite: TestSuite): void {
    this.testSuites.push(suite);
  }

  // Run all test suites
  async runAllTests(): Promise<TestRunSummary> {
    if (this.isRunning) {
      throw new Error('Test runner is already running');
    }

    this.isRunning = true;
    this.results.clear();

    console.log('🧪 Starting comprehensive test suite...');
    console.log(`Environment: ${config.environment}`);
    console.log(`API Base URL: ${config.apiBaseUrl}`);
    console.log('=====================================\n');

    const startTime = Date.now();
    let totalTests = 0;
    let passed = 0;
    let failed = 0;
    let skipped = 0;

    const categories: Record<string, { passed: number; failed: number }> = {};
    const priorities: Record<string, { passed: number; failed: number }> = {};
    const failedTests: Array<{
      name: string;
      error: string;
      category: string;
      priority: string;
    }> = [];

    try {
      // Validate configuration first
      if (!validateConfig()) {
        throw new Error('Configuration validation failed');
      }

      // Run each test suite
      for (const suite of this.testSuites) {
        console.log(`\n📋 Running test suite: ${suite.name}`);
        console.log('─'.repeat(50));

        // Setup
        if (suite.setup) {
          try {
            await suite.setup();
          } catch (error) {
            console.error(`Setup failed for ${suite.name}:`, error);
            continue;
          }
        }

        // Run tests
        for (const test of suite.tests) {
          totalTests++;
          
          // Initialize category/priority counters
          if (!categories[test.category]) {
            categories[test.category] = { passed: 0, failed: 0 };
          }
          if (!priorities[test.priority]) {
            priorities[test.priority] = { passed: 0, failed: 0 };
          }

          try {
            console.log(`  🔄 ${test.name}...`);
            const result = await this.runSingleTest(test);
            this.results.set(`${suite.name}.${test.name}`, result);

            if (result.success) {
              passed++;
              categories[test.category].passed++;
              priorities[test.priority].passed++;
              console.log(`  ✅ ${test.name} (${result.duration}ms)`);
            } else {
              failed++;
              categories[test.category].failed++;
              priorities[test.priority].failed++;
              failedTests.push({
                name: `${suite.name}.${test.name}`,
                error: result.error || 'Unknown error',
                category: test.category,
                priority: test.priority,
              });
              console.log(`  ❌ ${test.name} - ${result.error}`);
            }
          } catch (error) {
            failed++;
            categories[test.category].failed++;
            priorities[test.priority].failed++;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            failedTests.push({
              name: `${suite.name}.${test.name}`,
              error: errorMessage,
              category: test.category,
              priority: test.priority,
            });
            console.log(`  ❌ ${test.name} - ${errorMessage}`);
          }
        }

        // Teardown
        if (suite.teardown) {
          try {
            await suite.teardown();
          } catch (error) {
            console.error(`Teardown failed for ${suite.name}:`, error);
          }
        }
      }
    } finally {
      this.isRunning = false;
    }

    const duration = Date.now() - startTime;
    const successRate = totalTests > 0 ? (passed / totalTests) * 100 : 0;

    const summary: TestRunSummary = {
      totalTests,
      passed,
      failed,
      skipped,
      duration,
      successRate,
      categories,
      priorities,
      failedTests,
    };

    this.printSummary(summary);
    return summary;
  }

  // Run a single test with timeout and error handling
  private async runSingleTest(test: TestCase): Promise<TestResult> {
    const startTime = Date.now();
    const timeout = test.timeout || 30000; // 30 second default timeout

    try {
      const result = await Promise.race([
        test.run(),
        new Promise<TestResult>((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), timeout)
        ),
      ]);

      return {
        ...result,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Print test summary
  private printSummary(summary: TestRunSummary): void {
    console.log('\n📊 Test Run Summary');
    console.log('==================');
    console.log(`Total Tests: ${summary.totalTests}`);
    console.log(`Passed: ${summary.passed} ✅`);
    console.log(`Failed: ${summary.failed} ❌`);
    console.log(`Skipped: ${summary.skipped} ⏭️`);
    console.log(`Success Rate: ${summary.successRate.toFixed(1)}%`);
    console.log(`Duration: ${(summary.duration / 1000).toFixed(1)}s`);

    // Category breakdown
    console.log('\n📋 By Category:');
    Object.entries(summary.categories).forEach(([category, stats]) => {
      const total = stats.passed + stats.failed;
      const rate = total > 0 ? (stats.passed / total) * 100 : 0;
      console.log(`  ${category}: ${stats.passed}/${total} (${rate.toFixed(1)}%)`);
    });

    // Priority breakdown
    console.log('\n🎯 By Priority:');
    Object.entries(summary.priorities).forEach(([priority, stats]) => {
      const total = stats.passed + stats.failed;
      const rate = total > 0 ? (stats.passed / total) * 100 : 0;
      console.log(`  ${priority}: ${stats.passed}/${total} (${rate.toFixed(1)}%)`);
    });

    // Failed tests
    if (summary.failedTests.length > 0) {
      console.log('\n❌ Failed Tests:');
      summary.failedTests.forEach(test => {
        console.log(`  - ${test.name} (${test.category}/${test.priority}): ${test.error}`);
      });
    }

    // Overall status
    console.log('\n🎯 Overall Status:');
    if (summary.successRate >= 95) {
      console.log('🟢 EXCELLENT - Ready for production');
    } else if (summary.successRate >= 85) {
      console.log('🟡 GOOD - Minor issues to address');
    } else if (summary.successRate >= 70) {
      console.log('🟠 FAIR - Several issues need attention');
    } else {
      console.log('🔴 POOR - Major issues must be fixed');
    }
  }

  // Get test results
  getResults(): Map<string, TestResult> {
    return new Map(this.results);
  }

  // Clear results
  clearResults(): void {
    this.results.clear();
  }

  // Run specific test suite
  async runTestSuite(suiteName: string): Promise<TestRunSummary> {
    const suite = this.testSuites.find(s => s.name === suiteName);
    if (!suite) {
      throw new Error(`Test suite '${suiteName}' not found`);
    }

    const originalSuites = this.testSuites;
    this.testSuites = [suite];
    
    try {
      return await this.runAllTests();
    } finally {
      this.testSuites = originalSuites;
    }
  }

  // Run tests by category
  async runTestsByCategory(category: string): Promise<TestRunSummary> {
    const filteredSuites = this.testSuites.map(suite => ({
      ...suite,
      tests: suite.tests.filter(test => test.category === category),
    })).filter(suite => suite.tests.length > 0);

    const originalSuites = this.testSuites;
    this.testSuites = filteredSuites;
    
    try {
      return await this.runAllTests();
    } finally {
      this.testSuites = originalSuites;
    }
  }

  // Run tests by priority
  async runTestsByPriority(priority: string): Promise<TestRunSummary> {
    const filteredSuites = this.testSuites.map(suite => ({
      ...suite,
      tests: suite.tests.filter(test => test.priority === priority),
    })).filter(suite => suite.tests.length > 0);

    const originalSuites = this.testSuites;
    this.testSuites = filteredSuites;
    
    try {
      return await this.runAllTests();
    } finally {
      this.testSuites = originalSuites;
    }
  }
}

// Create global test runner instance
export const testRunner = new TestRunner();

// Export utility functions
export const runAllTests = () => testRunner.runAllTests();
export const runTestSuite = (suiteName: string) => testRunner.runTestSuite(suiteName);
export const runCriticalTests = () => testRunner.runTestsByPriority('critical');
export const runIntegrationTests = () => testRunner.runTestsByCategory('integration');

// Register default test suites
import { registerDefaultTestSuites } from './testSuites';

// Initialize with default test suites
registerDefaultTestSuites(testRunner);

export default TestRunner;
