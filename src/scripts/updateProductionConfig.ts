// Production configuration updater for SpendLot Receipt Tracker
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

interface ProductionConfig {
  apiBaseUrl: string;
  plaidClientId: string;
  plaidSecret: string;
  plaidEnvironment: 'sandbox' | 'development' | 'production';
  gmailClientId: string;
  gmailClientSecret: string;
  sentryDsn?: string;
  analyticsKey?: string;
  pushNotificationKey?: string;
}

interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class ProductionConfigUpdater {
  private configPath = join(__dirname, '../config/environment.ts');
  private constantsPath = join(__dirname, '../constants/index.ts');

  // Update production configuration
  updateProductionConfig(config: ProductionConfig): ConfigValidationResult {
    const validation = this.validateConfig(config);
    
    if (!validation.isValid) {
      console.error('❌ Configuration validation failed:');
      validation.errors.forEach(error => console.error(`  - ${error}`));
      return validation;
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Configuration warnings:');
      validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }

    try {
      // Update environment configuration
      this.updateEnvironmentConfig(config);
      
      // Update constants
      this.updateConstants(config);
      
      // Update Plaid configuration
      this.updatePlaidConfig(config);
      
      // Update Gmail configuration
      this.updateGmailConfig(config);

      console.log('✅ Production configuration updated successfully!');
      console.log('\n📋 Updated configurations:');
      console.log(`  - API Base URL: ${config.apiBaseUrl}`);
      console.log(`  - Plaid Environment: ${config.plaidEnvironment}`);
      console.log(`  - Gmail Client ID: ${config.gmailClientId.substring(0, 20)}...`);
      
      return { isValid: true, errors: [], warnings: [] };
    } catch (error) {
      console.error('❌ Failed to update configuration:', error);
      return {
        isValid: false,
        errors: [`Failed to update configuration: ${error}`],
        warnings: [],
      };
    }
  }

  // Validate production configuration
  private validateConfig(config: ProductionConfig): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate API Base URL
    if (!config.apiBaseUrl) {
      errors.push('API Base URL is required');
    } else {
      try {
        const url = new URL(config.apiBaseUrl);
        if (!url.protocol.startsWith('https') && !config.apiBaseUrl.includes('localhost')) {
          warnings.push('API Base URL should use HTTPS in production');
        }
      } catch {
        errors.push('API Base URL is not a valid URL');
      }
    }

    // Validate Plaid configuration
    if (!config.plaidClientId) {
      errors.push('Plaid Client ID is required');
    }
    if (!config.plaidSecret) {
      errors.push('Plaid Secret is required');
    }
    if (!['sandbox', 'development', 'production'].includes(config.plaidEnvironment)) {
      errors.push('Plaid Environment must be sandbox, development, or production');
    }

    // Validate Gmail configuration
    if (!config.gmailClientId) {
      errors.push('Gmail Client ID is required');
    } else if (!config.gmailClientId.includes('.apps.googleusercontent.com')) {
      warnings.push('Gmail Client ID format may be incorrect');
    }

    if (!config.gmailClientSecret) {
      errors.push('Gmail Client Secret is required');
    }

    // Validate optional services
    if (config.sentryDsn && !config.sentryDsn.startsWith('https://')) {
      warnings.push('Sentry DSN should start with https://');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Update environment.ts file
  private updateEnvironmentConfig(config: ProductionConfig): void {
    const envContent = readFileSync(this.configPath, 'utf8');
    
    let updatedContent = envContent;
    
    // Update production API URL
    updatedContent = updatedContent.replace(
      /apiBaseUrl: 'https:\/\/api\.spendlot\.com\/api\/v1'/,
      `apiBaseUrl: '${config.apiBaseUrl}'`
    );

    // Update Plaid configuration
    updatedContent = updatedContent.replace(
      /environment: 'production'/,
      `environment: '${config.plaidEnvironment}'`
    );

    // Update Gmail client ID
    updatedContent = updatedContent.replace(
      /clientId: 'your-prod-client-id\.apps\.googleusercontent\.com'/,
      `clientId: '${config.gmailClientId}'`
    );

    writeFileSync(this.configPath, updatedContent, 'utf8');
  }

  // Update constants/index.ts file
  private updateConstants(config: ProductionConfig): void {
    const constantsContent = readFileSync(this.constantsPath, 'utf8');
    
    let updatedContent = constantsContent;
    
    // Update API base URL if it exists in constants
    if (constantsContent.includes('API_BASE_URL')) {
      updatedContent = updatedContent.replace(
        /export const API_BASE_URL = .+;/,
        `export const API_BASE_URL = '${config.apiBaseUrl}';`
      );
    }

    writeFileSync(this.constantsPath, updatedContent, 'utf8');
  }

  // Update Plaid configuration
  private updatePlaidConfig(config: ProductionConfig): void {
    const plaidConfigPath = join(__dirname, '../config/plaidConfig.ts');
    const plaidContent = readFileSync(plaidConfigPath, 'utf8');
    
    let updatedContent = plaidContent;
    
    // Update production environment
    updatedContent = updatedContent.replace(
      /environment: 'production' as const/,
      `environment: '${config.plaidEnvironment}' as const`
    );

    writeFileSync(plaidConfigPath, updatedContent, 'utf8');
  }

  // Update Gmail configuration
  private updateGmailConfig(config: ProductionConfig): void {
    const gmailConfigPath = join(__dirname, '../config/gmailConfig.ts');
    const gmailContent = readFileSync(gmailConfigPath, 'utf8');
    
    let updatedContent = gmailContent;
    
    // Update production client ID
    updatedContent = updatedContent.replace(
      /clientId: 'your-prod-client-id\.apps\.googleusercontent\.com'/,
      `clientId: '${config.gmailClientId}'`
    );

    writeFileSync(gmailConfigPath, updatedContent, 'utf8');
  }

  // Generate environment variables template
  generateEnvTemplate(): string {
    return `# SpendLot Receipt Tracker - Environment Variables
# Copy this file to .env and fill in your actual values

# Backend API Configuration
REACT_APP_API_BASE_URL=https://api.spendlot.com/api/v1

# Plaid Configuration
REACT_APP_PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
REACT_APP_PLAID_ENVIRONMENT=production

# Gmail OAuth Configuration
REACT_APP_GMAIL_CLIENT_ID=your_gmail_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_gmail_client_secret

# Optional Services
REACT_APP_SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
REACT_APP_ANALYTICS_KEY=your_analytics_key
REACT_APP_PUSH_NOTIFICATION_KEY=your_push_notification_key

# App Configuration
REACT_APP_APP_VERSION=1.0.0
REACT_APP_BUILD_NUMBER=1
REACT_APP_ENVIRONMENT=production`;
  }

  // Check current configuration status
  checkConfigurationStatus(): {
    environment: string;
    apiConfigured: boolean;
    plaidConfigured: boolean;
    gmailConfigured: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    try {
      const envContent = readFileSync(this.configPath, 'utf8');
      
      // Check API configuration
      const apiConfigured = !envContent.includes('your-domain.com') && 
                           !envContent.includes('localhost:8000');
      
      // Check Plaid configuration
      const plaidConfigured = !envContent.includes('your-prod-client-id');
      
      // Check Gmail configuration
      const gmailConfigured = !envContent.includes('your-prod-client-id.apps.googleusercontent.com');
      
      if (!apiConfigured) {
        issues.push('API Base URL not configured for production');
      }
      
      if (!plaidConfigured) {
        issues.push('Plaid configuration contains placeholder values');
      }
      
      if (!gmailConfigured) {
        issues.push('Gmail configuration contains placeholder values');
      }

      return {
        environment: process.env.NODE_ENV || 'development',
        apiConfigured,
        plaidConfigured,
        gmailConfigured,
        issues,
      };
    } catch (error) {
      return {
        environment: 'unknown',
        apiConfigured: false,
        plaidConfigured: false,
        gmailConfigured: false,
        issues: [`Failed to read configuration: ${error}`],
      };
    }
  }

  // Interactive configuration setup
  async interactiveSetup(): Promise<void> {
    console.log('🔧 SpendLot Production Configuration Setup');
    console.log('==========================================\n');

    const status = this.checkConfigurationStatus();
    
    console.log('📋 Current Configuration Status:');
    console.log(`  Environment: ${status.environment}`);
    console.log(`  API Configured: ${status.apiConfigured ? '✅' : '❌'}`);
    console.log(`  Plaid Configured: ${status.plaidConfigured ? '✅' : '❌'}`);
    console.log(`  Gmail Configured: ${status.gmailConfigured ? '✅' : '❌'}`);
    
    if (status.issues.length > 0) {
      console.log('\n⚠️ Configuration Issues:');
      status.issues.forEach(issue => console.log(`  - ${issue}`));
    }

    console.log('\n📝 Environment Variables Template:');
    console.log('Save this to a .env file in your project root:\n');
    console.log(this.generateEnvTemplate());
    
    console.log('\n🔧 Manual Configuration Steps:');
    console.log('1. Update src/config/environment.ts with your production values');
    console.log('2. Update src/config/plaidConfig.ts with your Plaid credentials');
    console.log('3. Update src/config/gmailConfig.ts with your Gmail OAuth credentials');
    console.log('4. Run the test suite to verify configuration');
    console.log('5. Build and test the production app');
  }
}

// Example usage
const configUpdater = new ProductionConfigUpdater();

// Export for use in scripts
export { ProductionConfigUpdater, ProductionConfig };

// CLI usage
if (require.main === module) {
  configUpdater.interactiveSetup();
}

export default configUpdater;
