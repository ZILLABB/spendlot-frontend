// Production test execution script for SpendLot Receipt Tracker
import { testRunner, TestRunSummary } from '../testing/testRunner';
import { backendTestService } from '../services/backendTestService';
import { config, validateConfig } from '../config/environment';
import { errorHandler, getErrorStats } from '../utils/errorHandler';

interface ProductionTestReport {
  timestamp: string;
  environment: string;
  configurationValid: boolean;
  testResults: TestRunSummary;
  performanceMetrics: {
    averageApiResponseTime: number;
    memoryUsage: number;
    errorRate: number;
  };
  readinessScore: number;
  criticalIssues: string[];
  recommendations: string[];
  nextSteps: string[];
}

class ProductionTestRunner {
  async runFullProductionTestSuite(): Promise<ProductionTestReport> {
    console.log('🧪 Starting Production Test Suite');
    console.log('==================================');
    console.log(`Environment: ${config.environment}`);
    console.log(`API Base URL: ${config.apiBaseUrl}`);
    console.log(`Timestamp: ${new Date().toISOString()}\n`);

    const startTime = Date.now();
    
    // Step 1: Validate Configuration
    console.log('📋 Step 1: Validating Configuration...');
    const configValid = this.validateProductionConfig();
    
    // Step 2: Run Backend Health Check
    console.log('\n🔗 Step 2: Backend Health Check...');
    const healthCheck = await this.runHealthCheck();
    
    // Step 3: Run Comprehensive Test Suite
    console.log('\n🧪 Step 3: Running Comprehensive Test Suite...');
    const testResults = await testRunner.runAllTests();
    
    // Step 4: Performance Analysis
    console.log('\n⚡ Step 4: Performance Analysis...');
    const performanceMetrics = await this.analyzePerformance();
    
    // Step 5: Generate Report
    console.log('\n📊 Step 5: Generating Production Readiness Report...');
    const report = this.generateProductionReport({
      configValid,
      healthCheck,
      testResults,
      performanceMetrics,
      duration: Date.now() - startTime,
    });

    this.printProductionReport(report);
    return report;
  }

  private validateProductionConfig(): boolean {
    console.log('  🔍 Checking configuration validity...');
    
    const isValid = validateConfig();
    
    if (isValid) {
      console.log('  ✅ Configuration is valid');
    } else {
      console.log('  ❌ Configuration validation failed');
    }

    // Additional production-specific checks
    const prodChecks = [
      {
        name: 'HTTPS API URL',
        check: () => config.apiBaseUrl.startsWith('https://') || config.apiBaseUrl.includes('localhost'),
        critical: true,
      },
      {
        name: 'Production Plaid Environment',
        check: () => config.plaid.environment === 'production' || config.plaid.environment === 'development',
        critical: false,
      },
      {
        name: 'Error Reporting Enabled',
        check: () => config.enableCrashReporting,
        critical: false,
      },
      {
        name: 'Analytics Enabled',
        check: () => config.enableAnalytics,
        critical: false,
      },
    ];

    let allPassed = isValid;
    prodChecks.forEach(check => {
      const passed = check.check();
      const icon = passed ? '✅' : (check.critical ? '❌' : '⚠️');
      console.log(`  ${icon} ${check.name}: ${passed ? 'PASS' : 'FAIL'}`);
      
      if (!passed && check.critical) {
        allPassed = false;
      }
    });

    return allPassed;
  }

  private async runHealthCheck(): Promise<{
    isHealthy: boolean;
    responseTime: number;
    issues: string[];
  }> {
    console.log('  🏥 Checking backend health...');
    
    try {
      const result = await backendTestService.quickHealthCheck();
      
      if (result.isHealthy) {
        console.log(`  ✅ Backend is healthy (${result.responseTime}ms)`);
      } else {
        console.log(`  ❌ Backend health issues detected`);
        result.criticalIssues.forEach(issue => {
          console.log(`    - ${issue}`);
        });
      }

      return {
        isHealthy: result.isHealthy,
        responseTime: result.responseTime,
        issues: result.criticalIssues,
      };
    } catch (error) {
      console.log(`  ❌ Health check failed: ${error}`);
      return {
        isHealthy: false,
        responseTime: 0,
        issues: [`Health check failed: ${error}`],
      };
    }
  }

  private async analyzePerformance(): Promise<{
    averageApiResponseTime: number;
    memoryUsage: number;
    errorRate: number;
  }> {
    console.log('  ⚡ Analyzing performance metrics...');
    
    // Test API response times
    const apiTests = [];
    const endpoints = ['/health', '/auth/verify', '/categories', '/receipts'];
    
    for (const endpoint of endpoints) {
      try {
        const result = await backendTestService.testEndpoint(endpoint);
        apiTests.push(result.responseTime);
      } catch (error) {
        console.log(`    ⚠️ Failed to test ${endpoint}: ${error}`);
      }
    }

    const averageApiResponseTime = apiTests.length > 0 
      ? apiTests.reduce((sum, time) => sum + time, 0) / apiTests.length 
      : 0;

    // Get error statistics
    const errorStats = getErrorStats();
    const errorRate = errorStats.totalErrors > 0 
      ? (errorStats.totalErrors / (errorStats.totalErrors + 100)) * 100 
      : 0;

    // Memory usage (simplified)
    const memoryUsage = (global as any).performance?.memory?.usedJSHeapSize || 0;

    console.log(`  📊 Average API Response Time: ${averageApiResponseTime.toFixed(0)}ms`);
    console.log(`  💾 Memory Usage: ${(memoryUsage / 1024 / 1024).toFixed(1)}MB`);
    console.log(`  🚨 Error Rate: ${errorRate.toFixed(1)}%`);

    return {
      averageApiResponseTime,
      memoryUsage,
      errorRate,
    };
  }

  private generateProductionReport(data: {
    configValid: boolean;
    healthCheck: any;
    testResults: TestRunSummary;
    performanceMetrics: any;
    duration: number;
  }): ProductionTestReport {
    const { configValid, healthCheck, testResults, performanceMetrics, duration } = data;
    
    // Calculate readiness score
    let readinessScore = 0;
    
    // Configuration (20 points)
    if (configValid) readinessScore += 20;
    
    // Backend health (20 points)
    if (healthCheck.isHealthy) readinessScore += 20;
    
    // Test success rate (40 points)
    readinessScore += (testResults.successRate / 100) * 40;
    
    // Performance (20 points)
    if (performanceMetrics.averageApiResponseTime < 1000) readinessScore += 10;
    if (performanceMetrics.errorRate < 5) readinessScore += 10;

    // Identify critical issues
    const criticalIssues: string[] = [];
    
    if (!configValid) {
      criticalIssues.push('Configuration validation failed');
    }
    
    if (!healthCheck.isHealthy) {
      criticalIssues.push('Backend health check failed');
      criticalIssues.push(...healthCheck.issues);
    }
    
    if (testResults.successRate < 80) {
      criticalIssues.push(`Low test success rate: ${testResults.successRate.toFixed(1)}%`);
    }
    
    if (performanceMetrics.averageApiResponseTime > 2000) {
      criticalIssues.push(`Slow API response times: ${performanceMetrics.averageApiResponseTime.toFixed(0)}ms`);
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (testResults.successRate < 95) {
      recommendations.push('Fix failing tests before production deployment');
    }
    
    if (performanceMetrics.averageApiResponseTime > 1000) {
      recommendations.push('Optimize API response times');
    }
    
    if (performanceMetrics.errorRate > 2) {
      recommendations.push('Investigate and reduce error rate');
    }
    
    if (!config.enableCrashReporting) {
      recommendations.push('Enable crash reporting for production monitoring');
    }

    // Generate next steps
    const nextSteps: string[] = [];
    
    if (readinessScore >= 90) {
      nextSteps.push('✅ Ready for production deployment');
      nextSteps.push('📱 Create app store screenshots');
      nextSteps.push('📝 Prepare app store metadata');
      nextSteps.push('🚀 Submit to app stores');
    } else if (readinessScore >= 75) {
      nextSteps.push('⚠️ Address critical issues before deployment');
      nextSteps.push('🔧 Fix failing tests');
      nextSteps.push('⚡ Optimize performance');
      nextSteps.push('🔄 Re-run test suite');
    } else {
      nextSteps.push('❌ Not ready for production');
      nextSteps.push('🔧 Fix configuration issues');
      nextSteps.push('🏥 Resolve backend connectivity problems');
      nextSteps.push('🧪 Fix failing tests');
      nextSteps.push('📞 Contact development team');
    }

    return {
      timestamp: new Date().toISOString(),
      environment: config.environment,
      configurationValid: configValid,
      testResults,
      performanceMetrics,
      readinessScore: Math.round(readinessScore),
      criticalIssues,
      recommendations,
      nextSteps,
    };
  }

  private printProductionReport(report: ProductionTestReport): void {
    console.log('\n📊 PRODUCTION READINESS REPORT');
    console.log('==============================');
    console.log(`Generated: ${report.timestamp}`);
    console.log(`Environment: ${report.environment}`);
    console.log(`Readiness Score: ${report.readinessScore}/100`);
    
    // Overall status
    console.log('\n🎯 Overall Status:');
    if (report.readinessScore >= 90) {
      console.log('🟢 EXCELLENT - Ready for production deployment!');
    } else if (report.readinessScore >= 75) {
      console.log('🟡 GOOD - Minor issues to address before deployment');
    } else if (report.readinessScore >= 50) {
      console.log('🟠 FAIR - Several issues need attention');
    } else {
      console.log('🔴 POOR - Major issues must be fixed before deployment');
    }

    // Test results summary
    console.log('\n📋 Test Results:');
    console.log(`  Total Tests: ${report.testResults.totalTests}`);
    console.log(`  Passed: ${report.testResults.passed} ✅`);
    console.log(`  Failed: ${report.testResults.failed} ❌`);
    console.log(`  Success Rate: ${report.testResults.successRate.toFixed(1)}%`);

    // Performance metrics
    console.log('\n⚡ Performance:');
    console.log(`  API Response Time: ${report.performanceMetrics.averageApiResponseTime.toFixed(0)}ms`);
    console.log(`  Memory Usage: ${(report.performanceMetrics.memoryUsage / 1024 / 1024).toFixed(1)}MB`);
    console.log(`  Error Rate: ${report.performanceMetrics.errorRate.toFixed(1)}%`);

    // Critical issues
    if (report.criticalIssues.length > 0) {
      console.log('\n❌ Critical Issues:');
      report.criticalIssues.forEach(issue => console.log(`  - ${issue}`));
    }

    // Recommendations
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }

    // Next steps
    console.log('\n🚀 Next Steps:');
    report.nextSteps.forEach(step => console.log(`  ${step}`));
  }

  // Quick production readiness check
  async quickReadinessCheck(): Promise<boolean> {
    console.log('🚀 Quick Production Readiness Check');
    console.log('===================================\n');

    const checks = [
      {
        name: 'Configuration Valid',
        test: () => validateConfig(),
      },
      {
        name: 'Backend Accessible',
        test: async () => {
          const health = await backendTestService.quickHealthCheck();
          return health.isHealthy;
        },
      },
      {
        name: 'Critical Tests Pass',
        test: async () => {
          const results = await testRunner.runTestsByPriority('critical');
          return results.successRate >= 90;
        },
      },
    ];

    let allPassed = true;

    for (const check of checks) {
      try {
        const result = await check.test();
        const icon = result ? '✅' : '❌';
        console.log(`${icon} ${check.name}: ${result ? 'PASS' : 'FAIL'}`);
        if (!result) allPassed = false;
      } catch (error) {
        console.log(`❌ ${check.name}: ERROR - ${error}`);
        allPassed = false;
      }
    }

    console.log(`\n🎯 Overall: ${allPassed ? '✅ READY' : '❌ NOT READY'}`);
    return allPassed;
  }
}

// Create instance
const productionTestRunner = new ProductionTestRunner();

// Export for use
export { ProductionTestRunner, ProductionTestReport };

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--quick')) {
    productionTestRunner.quickReadinessCheck();
  } else {
    productionTestRunner.runFullProductionTestSuite();
  }
}

export default productionTestRunner;
