// Screenshot generation guide and automation for SpendLot Receipt Tracker
import { appStoreMetadata } from '../config/appStoreConfig';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface ScreenshotSpec {
  screen: string;
  device: string;
  size: string;
  filename: string;
  description: string;
  setupInstructions: string[];
  captureInstructions: string[];
  postProcessing?: string[];
}

interface ScreenshotPlan {
  ios: ScreenshotSpec[];
  android: ScreenshotSpec[];
  marketing: ScreenshotSpec[];
}

class ScreenshotGenerator {
  private outputDir = join(__dirname, '../../screenshots');

  // Generate comprehensive screenshot plan
  generateScreenshotPlan(): ScreenshotPlan {
    return {
      ios: this.generateiOSScreenshots(),
      android: this.generateAndroidScreenshots(),
      marketing: this.generateMarketingScreenshots(),
    };
  }

  private generateiOSScreenshots(): ScreenshotSpec[] {
    return [
      {
        screen: 'Dashboard',
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-01-dashboard.png',
        description: 'Beautiful dashboard with spending overview and quick actions',
        setupInstructions: [
          'Login with demo account',
          'Ensure sample data is loaded (receipts, transactions)',
          'Set current month to show meaningful spending data',
          'Enable light mode for primary screenshots',
        ],
        captureInstructions: [
          'Navigate to Home tab',
          'Wait for all data to load',
          'Ensure spending chart shows colorful data',
          'Verify recent transactions are visible',
          'Take screenshot with status bar visible',
        ],
        postProcessing: [
          'Add subtle drop shadow',
          'Ensure colors are vibrant',
          'Verify text is readable',
        ],
      },
      {
        screen: 'Receipt Camera',
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-02-camera.png',
        description: 'Smart receipt capture with AI-powered OCR technology',
        setupInstructions: [
          'Navigate to Receipts tab',
          'Tap camera button',
          'Prepare a sample receipt for scanning',
          'Ensure good lighting conditions',
        ],
        captureInstructions: [
          'Open camera screen',
          'Position sample receipt in frame',
          'Show OCR detection overlay if available',
          'Capture with receipt clearly visible',
          'Show scanning animation if possible',
        ],
        postProcessing: [
          'Blur any sensitive information on receipt',
          'Enhance camera UI visibility',
          'Add scanning effect overlay',
        ],
      },
      {
        screen: 'Analytics Dashboard',
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-03-analytics.png',
        description: 'Rich analytics and spending insights with interactive charts',
        setupInstructions: [
          'Navigate to Analytics tab',
          'Ensure sample data shows diverse categories',
          'Set period to current month',
          'Load colorful pie chart data',
        ],
        captureInstructions: [
          'Show analytics screen with pie chart',
          'Ensure chart has multiple colorful segments',
          'Display spending trends graph',
          'Show period selector (Week/Month/Year)',
          'Include spending comparison data',
        ],
        postProcessing: [
          'Enhance chart colors',
          'Ensure data labels are visible',
          'Add subtle animations if possible',
        ],
      },
      {
        screen: 'Receipt Management',
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-04-receipts.png',
        description: 'Organized receipt management with smart categorization',
        setupInstructions: [
          'Navigate to Receipts tab',
          'Ensure multiple receipts are loaded',
          'Show mix of processed and pending receipts',
          'Include various merchant types',
        ],
        captureInstructions: [
          'Display receipt list view',
          'Show receipt thumbnails',
          'Include processing status indicators',
          'Display various categories and amounts',
          'Show search/filter options',
        ],
        postProcessing: [
          'Blur sensitive receipt information',
          'Enhance status indicators',
          'Ensure merchant names are generic',
        ],
      },
      {
        screen: 'Bank Integration',
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'ios-05-bank-sync.png',
        description: 'Seamless bank account integration with automatic sync',
        setupInstructions: [
          'Navigate to Settings > Bank Accounts',
          'Show connected bank accounts',
          'Display sync status and balances',
          'Include integration health indicators',
        ],
        captureInstructions: [
          'Show bank accounts list',
          'Display account balances',
          'Show sync status indicators',
          'Include "Connect Bank Account" button',
          'Display integration status',
        ],
        postProcessing: [
          'Use generic bank names',
          'Blur actual account numbers',
          'Enhance status indicators',
        ],
      },
      {
        screen: 'iPad Dashboard',
        device: 'iPad Pro 12.9"',
        size: '2048x2732',
        filename: 'ipad-01-dashboard.png',
        description: 'Optimized iPad experience with enhanced productivity',
        setupInstructions: [
          'Use iPad simulator or device',
          'Load dashboard with sample data',
          'Show landscape orientation benefits',
          'Display enhanced layout for larger screen',
        ],
        captureInstructions: [
          'Capture in landscape mode',
          'Show side-by-side layout if available',
          'Display enhanced charts and data',
          'Include iPad-specific UI elements',
        ],
      },
    ];
  }

  private generateAndroidScreenshots(): ScreenshotSpec[] {
    return [
      {
        screen: 'Dashboard',
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-01-dashboard.png',
        description: 'Material Design dashboard with spending overview',
        setupInstructions: [
          'Use Android device/emulator',
          'Login with demo account',
          'Load sample spending data',
          'Enable Material Design theme',
        ],
        captureInstructions: [
          'Navigate to Home tab',
          'Show Material Design elements',
          'Display floating action button',
          'Include Android navigation',
          'Show system status bar',
        ],
      },
      {
        screen: 'Receipt Camera',
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-02-camera.png',
        description: 'Advanced receipt scanning with real-time OCR',
        setupInstructions: [
          'Open camera for receipt scanning',
          'Prepare sample receipt',
          'Show Android camera UI',
        ],
        captureInstructions: [
          'Display camera interface',
          'Show receipt in viewfinder',
          'Include Android-specific camera controls',
          'Display OCR detection overlay',
        ],
      },
      {
        screen: 'Analytics',
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-03-analytics.png',
        description: 'Comprehensive spending analytics and trends',
        setupInstructions: [
          'Navigate to Analytics',
          'Load colorful chart data',
          'Show Material Design charts',
        ],
        captureInstructions: [
          'Display analytics dashboard',
          'Show Material Design charts',
          'Include trend analysis',
          'Display period selection',
        ],
      },
      {
        screen: 'Receipt Management',
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-04-receipts.png',
        description: 'Smart receipt organization and management',
        setupInstructions: [
          'Show receipt list',
          'Include various receipt types',
          'Display Material Design cards',
        ],
        captureInstructions: [
          'Show receipt list with cards',
          'Display Material Design elements',
          'Include FAB for adding receipts',
          'Show search functionality',
        ],
      },
      {
        screen: 'Bank Integration',
        device: 'Pixel 7 Pro',
        size: '1440x3120',
        filename: 'android-05-bank-sync.png',
        description: 'Secure bank integration with Plaid technology',
        setupInstructions: [
          'Navigate to bank accounts',
          'Show connected accounts',
          'Display Material Design layout',
        ],
        captureInstructions: [
          'Show bank accounts screen',
          'Display Material Design cards',
          'Include sync status',
          'Show connection options',
        ],
      },
    ];
  }

  private generateMarketingScreenshots(): ScreenshotSpec[] {
    return [
      {
        screen: 'Feature Showcase',
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'marketing-01-features.png',
        description: 'Showcase of key features with annotations',
        setupInstructions: [
          'Create composite image',
          'Show multiple app screens',
          'Add feature callouts',
        ],
        captureInstructions: [
          'Combine multiple screenshots',
          'Add feature annotations',
          'Include app logo and branding',
          'Show key value propositions',
        ],
      },
      {
        screen: 'Before/After',
        device: 'iPhone 14 Pro',
        size: '1290x2796',
        filename: 'marketing-02-before-after.png',
        description: 'Show transformation from manual to automated tracking',
        setupInstructions: [
          'Create split-screen comparison',
          'Show manual vs automated process',
          'Highlight time savings',
        ],
        captureInstructions: [
          'Show manual receipt management',
          'Contrast with automated solution',
          'Include time/effort savings',
          'Add compelling copy',
        ],
      },
    ];
  }

  // Generate screenshot capture script
  generateCaptureScript(): string {
    const plan = this.generateScreenshotPlan();
    
    let script = `#!/bin/bash
# SpendLot Receipt Tracker - Screenshot Capture Script
# Generated automatically - customize as needed

echo "📱 SpendLot Screenshot Capture Script"
echo "====================================="

# Create screenshots directory
mkdir -p screenshots/ios
mkdir -p screenshots/android
mkdir -p screenshots/marketing

echo "📋 Screenshot Plan:"
echo "  iOS Screenshots: ${plan.ios.length}"
echo "  Android Screenshots: ${plan.android.length}"
echo "  Marketing Screenshots: ${plan.marketing.length}"
echo ""

# iOS Screenshots
echo "📱 Capturing iOS Screenshots..."
`;

    plan.ios.forEach((spec, index) => {
      script += `
echo "  ${index + 1}. ${spec.description}"
echo "     Device: ${spec.device} (${spec.size})"
echo "     Setup: ${spec.setupInstructions.join(', ')}"
echo "     File: ${spec.filename}"
echo "     ⏸️  Press Enter when ready to continue..."
read
`;
    });

    script += `
# Android Screenshots
echo "🤖 Capturing Android Screenshots..."
`;

    plan.android.forEach((spec, index) => {
      script += `
echo "  ${index + 1}. ${spec.description}"
echo "     Device: ${spec.device} (${spec.size})"
echo "     Setup: ${spec.setupInstructions.join(', ')}"
echo "     File: ${spec.filename}"
echo "     ⏸️  Press Enter when ready to continue..."
read
`;
    });

    script += `
echo "✅ Screenshot capture complete!"
echo "📁 Screenshots saved to: ./screenshots/"
echo ""
echo "🔧 Next Steps:"
echo "  1. Review all screenshots for quality"
echo "  2. Edit/enhance as needed"
echo "  3. Optimize file sizes"
echo "  4. Upload to App Store Connect / Google Play Console"
`;

    return script;
  }

  // Generate detailed screenshot guide
  generateScreenshotGuide(): string {
    const plan = this.generateScreenshotPlan();
    
    return `# SpendLot Receipt Tracker - Screenshot Guide

## Overview
This guide provides detailed instructions for capturing high-quality screenshots for app store submission.

## Requirements
- iOS device/simulator (iPhone 14 Pro, iPad Pro 12.9")
- Android device/emulator (Pixel 7 Pro or equivalent)
- Demo account with sample data
- Good lighting for camera screenshots
- Image editing software (optional)

## Screenshot Specifications

### iOS Screenshots
${plan.ios.map((spec, index) => `
#### ${index + 1}. ${spec.screen}
- **Device**: ${spec.device}
- **Size**: ${spec.size}
- **Filename**: ${spec.filename}
- **Description**: ${spec.description}

**Setup Instructions:**
${spec.setupInstructions.map(instruction => `- ${instruction}`).join('\n')}

**Capture Instructions:**
${spec.captureInstructions.map(instruction => `- ${instruction}`).join('\n')}

${spec.postProcessing ? `**Post-Processing:**
${spec.postProcessing.map(step => `- ${step}`).join('\n')}` : ''}
`).join('\n')}

### Android Screenshots
${plan.android.map((spec, index) => `
#### ${index + 1}. ${spec.screen}
- **Device**: ${spec.device}
- **Size**: ${spec.size}
- **Filename**: ${spec.filename}
- **Description**: ${spec.description}

**Setup Instructions:**
${spec.setupInstructions.map(instruction => `- ${instruction}`).join('\n')}

**Capture Instructions:**
${spec.captureInstructions.map(instruction => `- ${instruction}`).join('\n')}
`).join('\n')}

## Best Practices

### General Guidelines
- Use high-resolution devices for crisp screenshots
- Ensure consistent lighting and contrast
- Show realistic but appealing data
- Avoid sensitive or personal information
- Use generic merchant names and amounts
- Maintain consistent UI state across screenshots

### iOS Specific
- Include status bar with full battery and strong signal
- Use San Francisco font consistently
- Follow iOS Human Interface Guidelines
- Ensure proper safe area handling
- Use iOS-appropriate navigation patterns

### Android Specific
- Follow Material Design guidelines
- Use appropriate Android navigation
- Include Android system UI elements
- Ensure proper Material Design theming
- Use Android-appropriate interaction patterns

### Privacy Considerations
- Blur or replace any real receipt information
- Use generic merchant names (e.g., "Coffee Shop", "Grocery Store")
- Use rounded amounts (e.g., $12.50, $45.00)
- Avoid real bank account information
- Use placeholder email addresses

## File Organization
\`\`\`
screenshots/
├── ios/
│   ├── ios-01-dashboard.png
│   ├── ios-02-camera.png
│   ├── ios-03-analytics.png
│   ├── ios-04-receipts.png
│   ├── ios-05-bank-sync.png
│   └── ipad-01-dashboard.png
├── android/
│   ├── android-01-dashboard.png
│   ├── android-02-camera.png
│   ├── android-03-analytics.png
│   ├── android-04-receipts.png
│   └── android-05-bank-sync.png
└── marketing/
    ├── marketing-01-features.png
    └── marketing-02-before-after.png
\`\`\`

## Quality Checklist
- [ ] All screenshots are high resolution
- [ ] No sensitive information visible
- [ ] Consistent app state across screenshots
- [ ] Good contrast and readability
- [ ] Platform-appropriate UI elements
- [ ] Compelling and realistic data
- [ ] Proper file naming convention
- [ ] Optimized file sizes for upload

## Upload Requirements

### App Store Connect (iOS)
- iPhone screenshots: 1290x2796 pixels (iPhone 14 Pro)
- iPad screenshots: 2048x2732 pixels (iPad Pro 12.9")
- Maximum file size: 500 MB per screenshot
- Supported formats: JPEG, PNG

### Google Play Console (Android)
- Phone screenshots: 1440x3120 pixels minimum
- Tablet screenshots: 2048x1536 pixels minimum
- Maximum file size: 8 MB per screenshot
- Supported formats: JPEG, PNG

## Tools and Resources
- **iOS Simulator**: Xcode Simulator for consistent screenshots
- **Android Emulator**: Android Studio AVD for device simulation
- **Image Editing**: Figma, Sketch, or Photoshop for enhancements
- **Optimization**: TinyPNG or ImageOptim for file size reduction
`;
  }

  // Save all generated files
  saveScreenshotAssets(): void {
    const guide = this.generateScreenshotGuide();
    const script = this.generateCaptureScript();
    const plan = this.generateScreenshotPlan();

    // Save guide
    writeFileSync(
      join(this.outputDir, 'SCREENSHOT_GUIDE.md'),
      guide,
      'utf8'
    );

    // Save capture script
    writeFileSync(
      join(this.outputDir, 'capture-screenshots.sh'),
      script,
      'utf8'
    );

    // Save plan as JSON
    writeFileSync(
      join(this.outputDir, 'screenshot-plan.json'),
      JSON.stringify(plan, null, 2),
      'utf8'
    );

    console.log('📱 Screenshot assets generated:');
    console.log(`  📋 Guide: ${join(this.outputDir, 'SCREENSHOT_GUIDE.md')}`);
    console.log(`  🔧 Script: ${join(this.outputDir, 'capture-screenshots.sh')}`);
    console.log(`  📊 Plan: ${join(this.outputDir, 'screenshot-plan.json')}`);
  }
}

// Create instance and export
const screenshotGenerator = new ScreenshotGenerator();

// CLI usage
if (require.main === module) {
  screenshotGenerator.saveScreenshotAssets();
}

export { ScreenshotGenerator, ScreenshotSpec, ScreenshotPlan };
export default screenshotGenerator;
