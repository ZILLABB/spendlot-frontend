#!/usr/bin/env node
// Master deployment script for SpendLot Receipt Tracker
import { ProductionConfigUpdater } from './updateProductionConfig';
import { ProductionTestRunner } from './runProductionTests';
import { ScreenshotGenerator } from './generateScreenshots';
import { DeploymentChecklistManager } from './deploymentChecklist';
import { config } from '../config/environment';
import { appStoreMetadata } from '../config/appStoreConfig';

interface DeploymentOptions {
  step?: string;
  skipTests?: boolean;
  skipScreenshots?: boolean;
  interactive?: boolean;
  dryRun?: boolean;
}

class MasterDeploymentManager {
  private configUpdater: ProductionConfigUpdater;
  private testRunner: ProductionTestRunner;
  private screenshotGenerator: ScreenshotGenerator;
  private checklistManager: DeploymentChecklistManager;

  constructor() {
    this.configUpdater = new ProductionConfigUpdater();
    this.testRunner = new ProductionTestRunner();
    this.screenshotGenerator = new ScreenshotGenerator();
    this.checklistManager = new DeploymentChecklistManager();
  }

  async runDeploymentPipeline(options: DeploymentOptions = {}): Promise<void> {
    console.log('🚀 SpendLot Receipt Tracker - Master Deployment Pipeline');
    console.log('======================================================');
    console.log(`Version: ${appStoreMetadata.version}`);
    console.log(`Environment: ${config.environment}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('');

    if (options.dryRun) {
      console.log('🔍 DRY RUN MODE - No changes will be made');
      console.log('');
    }

    try {
      // Step 1: Configuration Update
      if (!options.step || options.step === '1' || options.step === 'config') {
        await this.executeStep1(options);
      }

      // Step 2: Testing
      if (!options.step || options.step === '2' || options.step === 'test') {
        if (!options.skipTests) {
          await this.executeStep2(options);
        } else {
          console.log('⏭️ Skipping tests (--skip-tests flag)');
        }
      }

      // Step 3: Screenshots
      if (!options.step || options.step === '3' || options.step === 'screenshots') {
        if (!options.skipScreenshots) {
          await this.executeStep3(options);
        } else {
          console.log('⏭️ Skipping screenshots (--skip-screenshots flag)');
        }
      }

      // Generate final deployment checklist
      if (!options.step || options.step === 'checklist') {
        await this.generateFinalChecklist(options);
      }

      console.log('\n🎉 Deployment pipeline completed successfully!');
      this.printNextSteps();

    } catch (error) {
      console.error('\n❌ Deployment pipeline failed:', error);
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check configuration files for errors');
      console.log('2. Verify backend API connectivity');
      console.log('3. Review error logs for specific issues');
      console.log('4. Contact development team if issues persist');
      process.exit(1);
    }
  }

  private async executeStep1(options: DeploymentOptions): Promise<void> {
    console.log('📋 STEP 1: Configuration Update');
    console.log('================================');

    if (options.interactive) {
      await this.configUpdater.interactiveSetup();
    } else {
      // Check current configuration status
      const status = this.configUpdater.checkConfigurationStatus();
      
      console.log('📊 Current Configuration Status:');
      console.log(`  Environment: ${status.environment}`);
      console.log(`  API Configured: ${status.apiConfigured ? '✅' : '❌'}`);
      console.log(`  Plaid Configured: ${status.plaidConfigured ? '✅' : '❌'}`);
      console.log(`  Gmail Configured: ${status.gmailConfigured ? '✅' : '❌'}`);

      if (status.issues.length > 0) {
        console.log('\n⚠️ Configuration Issues Found:');
        status.issues.forEach(issue => console.log(`  - ${issue}`));
        console.log('\n🔧 Please update configuration before proceeding.');
        console.log('Run with --interactive flag for guided setup.');
        
        if (!options.dryRun) {
          throw new Error('Configuration issues must be resolved before deployment');
        }
      } else {
        console.log('\n✅ Configuration appears to be ready for production');
      }
    }

    console.log('\n📝 Environment Variables Template Generated');
    console.log('Save the following to your .env file:');
    console.log('');
    console.log(this.configUpdater.generateEnvTemplate());
    console.log('');
  }

  private async executeStep2(options: DeploymentOptions): Promise<void> {
    console.log('🧪 STEP 2: Production Testing');
    console.log('==============================');

    if (options.dryRun) {
      console.log('🔍 DRY RUN: Would run comprehensive test suite');
      return;
    }

    // Run quick readiness check first
    console.log('🚀 Running quick readiness check...');
    const isReady = await this.testRunner.quickReadinessCheck();

    if (!isReady) {
      console.log('\n⚠️ Quick readiness check failed. Running full test suite for detailed analysis...');
    }

    // Run full test suite
    console.log('\n🧪 Running comprehensive test suite...');
    const testReport = await this.testRunner.runFullProductionTestSuite();

    // Analyze results
    if (testReport.readinessScore < 75) {
      console.log('\n❌ Test results indicate the app is not ready for production deployment');
      console.log('🔧 Please address the critical issues before proceeding');
      throw new Error(`Low readiness score: ${testReport.readinessScore}/100`);
    } else if (testReport.readinessScore < 90) {
      console.log('\n⚠️ Test results show some issues that should be addressed');
      console.log('📋 Review the recommendations and consider fixing before deployment');
    } else {
      console.log('\n✅ Test results indicate the app is ready for production deployment');
    }

    // Save test report
    const reportPath = `./test-reports/production-test-${Date.now()}.json`;
    console.log(`\n📊 Test report saved to: ${reportPath}`);
  }

  private async executeStep3(options: DeploymentOptions): Promise<void> {
    console.log('📱 STEP 3: Screenshot Generation');
    console.log('=================================');

    if (options.dryRun) {
      console.log('🔍 DRY RUN: Would generate screenshot assets');
      return;
    }

    // Generate screenshot assets
    this.screenshotGenerator.saveScreenshotAssets();

    console.log('\n📋 Screenshot assets generated successfully!');
    console.log('\n🎯 Next steps for screenshots:');
    console.log('1. Review the generated screenshot guide');
    console.log('2. Set up demo data in the app');
    console.log('3. Use the capture script to take screenshots');
    console.log('4. Edit and optimize screenshots as needed');
    console.log('5. Upload to App Store Connect and Google Play Console');

    // Generate screenshot plan summary
    const plan = this.screenshotGenerator.generateScreenshotPlan();
    console.log('\n📊 Screenshot Plan Summary:');
    console.log(`  iOS Screenshots: ${plan.ios.length}`);
    console.log(`  Android Screenshots: ${plan.android.length}`);
    console.log(`  Marketing Screenshots: ${plan.marketing.length}`);
  }

  private async generateFinalChecklist(options: DeploymentOptions): Promise<void> {
    console.log('📋 FINAL: Deployment Checklist');
    console.log('===============================');

    if (options.dryRun) {
      console.log('🔍 DRY RUN: Would generate deployment checklist');
      return;
    }

    // Generate and save checklist
    this.checklistManager.saveChecklist();

    const summary = this.checklistManager.getChecklistSummary();
    console.log('\n📊 Deployment Checklist Generated:');
    console.log(`  Total Phases: ${summary.totalPhases}`);
    console.log(`  Total Items: ${summary.totalItems}`);
    console.log(`  Estimated Duration: ${summary.estimatedDuration}`);

    console.log('\n🎯 Critical Items by Priority:');
    Object.entries(summary.itemsByPriority).forEach(([priority, count]) => {
      const emoji = {
        critical: '🔴',
        high: '🟡',
        medium: '🔵',
        low: '⚪',
      }[priority] || '⚪';
      console.log(`  ${emoji} ${priority}: ${count} items`);
    });
  }

  private printNextSteps(): void {
    console.log('\n🚀 NEXT STEPS FOR PRODUCTION DEPLOYMENT');
    console.log('=======================================');
    console.log('');
    console.log('1. 📋 Review the generated deployment checklist');
    console.log('2. 🔧 Complete any remaining configuration items');
    console.log('3. 📱 Create app store screenshots using the guide');
    console.log('4. 🏗️ Build production iOS and Android apps');
    console.log('5. 🧪 Test production builds on physical devices');
    console.log('6. 📝 Prepare app store metadata and descriptions');
    console.log('7. 🚀 Submit to App Store Connect and Google Play Console');
    console.log('8. 📊 Monitor submission status and respond to reviews');
    console.log('9. 🎉 Launch and monitor app performance');
    console.log('');
    console.log('📞 Support: For assistance, contact dev@spendlot.com');
    console.log('📚 Documentation: See DEPLOYMENT_CHECKLIST.md for detailed steps');
  }

  // Interactive deployment wizard
  async runInteractiveWizard(): Promise<void> {
    console.log('🧙‍♂️ SpendLot Deployment Wizard');
    console.log('===============================');
    console.log('');
    console.log('This wizard will guide you through the deployment process step by step.');
    console.log('');

    // Step selection
    console.log('📋 Available Steps:');
    console.log('1. Configuration Update');
    console.log('2. Production Testing');
    console.log('3. Screenshot Generation');
    console.log('4. Generate Deployment Checklist');
    console.log('');

    // For now, run all steps interactively
    await this.runDeploymentPipeline({ interactive: true });
  }

  // Validate deployment readiness
  async validateDeploymentReadiness(): Promise<boolean> {
    console.log('🔍 Validating Deployment Readiness');
    console.log('===================================');

    const checks = [
      {
        name: 'Configuration',
        check: () => {
          const status = this.configUpdater.checkConfigurationStatus();
          return status.issues.length === 0;
        },
      },
      {
        name: 'Backend Connectivity',
        check: async () => {
          const health = await this.testRunner.quickReadinessCheck();
          return health;
        },
      },
    ];

    let allPassed = true;

    for (const check of checks) {
      try {
        const result = await check.check();
        const icon = result ? '✅' : '❌';
        console.log(`${icon} ${check.name}: ${result ? 'PASS' : 'FAIL'}`);
        if (!result) allPassed = false;
      } catch (error) {
        console.log(`❌ ${check.name}: ERROR - ${error}`);
        allPassed = false;
      }
    }

    console.log(`\n🎯 Overall Readiness: ${allPassed ? '✅ READY' : '❌ NOT READY'}`);
    return allPassed;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options: DeploymentOptions = {};

  // Parse command line arguments
  args.forEach(arg => {
    if (arg === '--interactive') options.interactive = true;
    if (arg === '--dry-run') options.dryRun = true;
    if (arg === '--skip-tests') options.skipTests = true;
    if (arg === '--skip-screenshots') options.skipScreenshots = true;
    if (arg.startsWith('--step=')) options.step = arg.split('=')[1];
  });

  const deployment = new MasterDeploymentManager();

  // Handle different commands
  if (args.includes('--wizard')) {
    await deployment.runInteractiveWizard();
  } else if (args.includes('--validate')) {
    await deployment.validateDeploymentReadiness();
  } else if (args.includes('--help')) {
    console.log(`
SpendLot Receipt Tracker - Master Deployment Script

Usage:
  npm run deploy                    # Run full deployment pipeline
  npm run deploy -- --wizard       # Interactive deployment wizard
  npm run deploy -- --validate     # Validate deployment readiness
  npm run deploy -- --step=1       # Run specific step (1, 2, 3, or checklist)
  npm run deploy -- --dry-run      # Dry run mode (no changes)
  npm run deploy -- --interactive  # Interactive configuration
  npm run deploy -- --skip-tests   # Skip testing phase
  npm run deploy -- --skip-screenshots # Skip screenshot generation

Steps:
  1 (config)      - Update production configuration
  2 (test)        - Run production test suite
  3 (screenshots) - Generate screenshot assets
  checklist       - Generate deployment checklist

Examples:
  npm run deploy -- --step=1 --interactive
  npm run deploy -- --dry-run --skip-tests
  npm run deploy -- --wizard
`);
  } else {
    await deployment.runDeploymentPipeline(options);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
}

export { MasterDeploymentManager, DeploymentOptions };
export default MasterDeploymentManager;
