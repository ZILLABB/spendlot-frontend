# SpendLot Receipt Tracker - Mobile Frontend

A React Native mobile application for tracking expenses by uploading and managing receipts from multiple sources.

## Features

### Core Functionality
- 📱 **Receipt Management**: Camera integration for taking photos and gallery access for uploading existing images
- 🔍 **OCR Processing**: Automatic text extraction from receipts with edit capability
- 💳 **Transaction Tracking**: Comprehensive transaction list with filtering and search
- 📊 **Dashboard**: Monthly spending summary with interactive charts
- 🔗 **External Integrations**: Gmail and bank account connections

### User Experience
- 🎨 **Modern UI**: Clean, intuitive interface with dark/light theme support
- 📱 **Responsive Design**: Optimized for mobile devices
- 🔄 **Offline Support**: View previously loaded data when offline
- ♿ **Accessibility**: Screen reader support and proper contrast ratios

## Technical Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6+
- **State Management**: Context API with useReducer
- **Styling**: React Native with custom design system
- **Forms**: React Hook Form with validation
- **HTTP Client**: Axios with interceptors
- **Storage**: AsyncStorage for local data persistence
- **Charts**: Victory Native for data visualization

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # Basic UI components (Button, Input, Card, etc.)
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   └── main/           # Main app screens
├── navigation/         # Navigation configuration
├── services/           # API services and external integrations
├── context/            # Global state management
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── constants/          # App constants and configurations
└── types/              # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Studio
- Backend API running (see backend setup)
- Plaid account for bank integration (optional)
- Gmail OAuth credentials (optional)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spendlot-mobilefront
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - For iOS: `npm run ios`
   - For Android: `npm run android`
   - For Web: `npm run web`

### Development Commands

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Core Features Implementation

### Authentication Flow
- ✅ Login/Register screens with form validation
- ✅ Password reset functionality
- ✅ JWT token management with auto-refresh
- ✅ Secure storage of authentication data

### Dashboard
- ✅ Monthly spending summary
- ✅ Quick action buttons
- ✅ Recent transactions preview
- 🔄 Spending charts (placeholder ready)

### Receipt Management
- ✅ Camera integration with Expo Camera
- ✅ Gallery access with Expo Image Picker
- ✅ OCR processing with status tracking
- ✅ Receipt editing interface
- ✅ Receipt detail view with image display
- ✅ Receipt deletion and management

### Transaction Management
- ✅ Transaction service with CRUD operations
- ✅ Transaction filtering and search
- ✅ Category management with hierarchical structure
- ✅ Manual transaction entry support

### Analytics & Insights
- ✅ Comprehensive analytics dashboard
- ✅ Spending summaries by period (week/month/year)
- ✅ Category breakdown with pie charts
- ✅ Monthly spending trends with line charts
- ✅ Spending comparison between periods
- ✅ Interactive charts with SVG rendering

### Bank Account Integration
- ✅ Plaid integration service
- ✅ Bank account management screen
- ✅ Account sync functionality
- ✅ Balance display and account status
- ✅ Multiple account support

### Settings
- ✅ User profile management
- ✅ Logout functionality
- ✅ Notification preferences
- ✅ Theme selection (light/dark/system)
- ✅ Bank account navigation
- 🔄 Data export options

### External Integrations
- ✅ Gmail OAuth integration service
- ✅ Bank connection via Plaid SDK
- ✅ Integration status monitoring
- ✅ Automatic sync capabilities
- 🔄 Receipt detection from emails (service ready)

## API Integration

The app includes a comprehensive API service layer with:

- **Authentication Service**: Login, register, token refresh, password reset
- **Receipt Service**: Upload, OCR processing, CRUD operations, offline support
- **Transaction Service**: CRUD operations, filtering, search, summaries
- **Category Service**: Hierarchical categories, default categories, CRUD operations
- **Bank Account Service**: Plaid integration, account management, sync operations
- **Analytics Service**: Spending analysis, trends, category statistics
- **Integration Service**: Gmail OAuth, external service connections, status monitoring
- **Camera Service**: Image capture, gallery access, OCR processing

### API Endpoints Structure
```
/auth/*              - Authentication endpoints
/receipts/*          - Receipt management
/transactions/*      - Transaction operations
/categories/*        - Category management
/bank-accounts/*     - Bank account operations
/analytics/*         - Spending analytics
/auth/gmail/*        - Gmail integration
/users/me            - User profile management
```

## New Components & Screens

### Chart Components
- **PieChart**: Interactive pie chart with legends for category breakdowns
- **LineChart**: Line chart with grid lines for spending trends
- **SpendingChart**: Existing chart component for dashboard
- **SpendingTrendsChart**: Existing trends visualization

### New Screens
- **AnalyticsScreen**: Comprehensive analytics dashboard with period selection
- **BankAccountsScreen**: Bank account management with Plaid integration
- **ReceiptDetailScreen**: Detailed receipt view with OCR results and editing

### Enhanced Navigation
- **Settings Stack Navigator**: Hierarchical settings navigation
- **Analytics Tab**: New tab for spending insights
- **Bank Accounts**: Accessible from settings menu

## State Management

The app uses React Context API for global state management:

- **AuthContext**: User authentication state and operations
- **AppContext**: Theme, offline status, and app-wide settings

## Styling and Design

- Custom design system with consistent colors, spacing, and typography
- Reusable UI components following design patterns
- Support for light and dark themes
- Responsive design for various screen sizes
- Accessibility features (screen reader support, proper contrast ratios)

## Error Handling

- Comprehensive error handling in API services
- User-friendly error messages
- Offline capability with graceful degradation
- Retry mechanisms for failed operations

## Security

- Secure token storage using AsyncStorage
- API request/response interceptors
- Input validation and sanitization
- Secure handling of sensitive data

## 🧪 Testing

### Service Testing
The app includes a comprehensive service testing utility:

```typescript
import { runServiceTests, runHealthCheck } from './src/utils/testServices';

// Run all service tests
await runServiceTests();

// Quick health check
const isHealthy = await runHealthCheck();
```

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration with email/password
- [ ] Login with valid credentials
- [ ] Password reset functionality
- [ ] Token refresh on expiration
- [ ] Logout and session cleanup

#### Receipt Management
- [ ] Camera capture with OCR processing
- [ ] Gallery image selection
- [ ] Receipt editing with smart parsing
- [ ] Receipt detail view with status
- [ ] Receipt deletion

#### Analytics Dashboard
- [ ] Monthly spending summary
- [ ] Category breakdown pie chart
- [ ] Spending trends line chart
- [ ] Period selection (week/month/year)
- [ ] Spending comparison between periods

#### Bank Integration
- [ ] Plaid link token creation
- [ ] Bank account connection flow
- [ ] Account sync functionality
- [ ] Account management (enable/disable)
- [ ] Balance display and formatting

#### External Integrations
- [ ] Gmail OAuth connection
- [ ] Integration status monitoring
- [ ] Sync functionality
- [ ] Disconnect integrations

### Performance Testing
- [ ] App startup time < 3 seconds
- [ ] Navigation transitions smooth
- [ ] Image loading and caching
- [ ] Offline functionality
- [ ] Memory usage optimization

### Automated Testing
- Unit tests for utility functions
- Component testing with React Native Testing Library
- API service testing with mocked responses
- End-to-end testing capabilities

## 🚀 Production Deployment

### Quick Start Deployment

The SpendLot Receipt Tracker includes a comprehensive deployment automation system. Follow these steps to deploy to production:

#### 1. **Automated Deployment Pipeline**
```bash
# Run the complete deployment pipeline
npm run deploy

# Interactive deployment wizard (recommended for first-time deployment)
npm run deploy:wizard

# Validate deployment readiness
npm run deploy:validate
```

#### 2. **Step-by-Step Deployment**
```bash
# Step 1: Update production configuration
npm run deploy:config

# Step 2: Run production tests
npm run deploy:test

# Step 3: Generate screenshot assets
npm run deploy:screenshots

# Step 4: Generate deployment checklist
npm run deploy:checklist
```

### Environment Configuration

#### 1. **Production Configuration Setup**
```bash
# Interactive configuration setup
npm run deploy:config

# This will generate a .env template with all required variables:
# REACT_APP_API_BASE_URL=https://api.spendlot.com/api/v1
# REACT_APP_PLAID_CLIENT_ID=your_plaid_client_id
# PLAID_SECRET=your_plaid_secret
# REACT_APP_PLAID_ENVIRONMENT=production
# REACT_APP_GMAIL_CLIENT_ID=your_gmail_client_id.apps.googleusercontent.com
# GMAIL_CLIENT_SECRET=your_gmail_client_secret
```

#### 2. **External Service Configuration**

**Plaid Integration:**
1. Create Plaid production account at https://dashboard.plaid.com
2. Configure webhook endpoints for transaction updates
3. Update `src/config/plaidConfig.ts` with production credentials

**Gmail OAuth Setup:**
1. Create project in Google Cloud Console
2. Enable Gmail API and configure OAuth consent screen
3. Create OAuth 2.0 credentials for mobile app
4. Update `src/config/gmailConfig.ts` with production client ID

### Testing & Validation

#### **Comprehensive Testing**
```bash
# Run full production test suite
npm run test:production

# Quick readiness check
npm run test:quick

# Validate specific components
npm run deploy:validate
```

The test suite includes:
- ✅ Backend connectivity and health checks
- ✅ Authentication flow testing
- ✅ API endpoint validation
- ✅ External service integration testing
- ✅ Performance and security testing
- ✅ Configuration validation

#### **Test Results Analysis**
The testing system provides:
- **Readiness Score**: 0-100 based on test results
- **Performance Metrics**: API response times, memory usage
- **Critical Issues**: Must-fix items before deployment
- **Recommendations**: Optimization suggestions

### App Store Preparation

#### **Screenshot Generation**
```bash
# Generate screenshot guide and automation
npm run deploy:screenshots
```

This creates:
- 📱 **Screenshot Guide**: Detailed instructions for capturing app store screenshots
- 🤖 **Capture Script**: Automated screenshot capture workflow
- 📊 **Screenshot Plan**: Complete specification for all required screenshots

**Screenshot Requirements:**
- **iOS**: iPhone 14 Pro (1290x2796), iPad Pro 12.9" (2048x2732)
- **Android**: Pixel 7 Pro (1440x3120) or equivalent
- **Marketing**: Feature showcase and comparison screenshots

#### **App Store Metadata**
Pre-configured metadata includes:
- 📝 **App Descriptions**: Optimized for App Store and Google Play
- 🔍 **Keywords**: ASO-optimized keyword sets
- 🎯 **Categories**: Finance (primary), Business (secondary)
- ⭐ **Age Rating**: 4+ (iOS), Everyone (Android)

### Build and Deploy

#### **iOS Deployment**
```bash
# Build production iOS app
expo build:ios --release-channel production

# Or with EAS Build (recommended)
eas build --platform ios --profile production
```

#### **Android Deployment**
```bash
# Build production Android app
expo build:android --release-channel production

# Or with EAS Build (recommended)
eas build --platform android --profile production
```

### Deployment Checklist

The automated deployment system generates a comprehensive checklist covering:

#### **Phase 1: Pre-Deployment (2-3 days)**
- [ ] Production configuration update
- [ ] Environment variables setup
- [ ] External service configuration
- [ ] SSL certificate verification
- [ ] Error monitoring setup

#### **Phase 2: Build & Package (1-2 days)**
- [ ] iOS production build
- [ ] Android production build
- [ ] Code signing verification
- [ ] Production build testing

#### **Phase 3: Testing & QA (3-5 days)**
- [ ] Backend integration tests
- [ ] Multi-device testing
- [ ] Performance testing
- [ ] Security testing
- [ ] Accessibility testing

#### **Phase 4: App Store Preparation (2-3 days)**
- [ ] Screenshot creation
- [ ] App icon preparation
- [ ] Store metadata preparation
- [ ] Privacy policy finalization
- [ ] App store submission

#### **Phase 5: Launch (1-2 weeks)**
- [ ] App store review response
- [ ] Launch monitoring setup
- [ ] Customer support preparation
- [ ] Marketing launch execution

#### **Phase 6: Post-Launch (Ongoing)**
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Bug fix prioritization
- [ ] Feature planning

### Monitoring & Maintenance

#### **Production Monitoring**
- 📊 **Analytics**: User engagement and retention tracking
- 🚨 **Error Monitoring**: Real-time crash and error reporting
- ⚡ **Performance**: API response times and app performance
- 💬 **User Feedback**: App store reviews and in-app feedback

#### **Maintenance Schedule**
- **Daily**: Monitor error rates and user feedback
- **Weekly**: Review performance metrics and user analytics
- **Monthly**: Security updates and dependency maintenance
- **Quarterly**: Feature updates and major improvements

### Support & Resources

#### **Documentation**
- 📋 `DEPLOYMENT_CHECKLIST.md`: Complete deployment checklist
- 📱 `screenshots/SCREENSHOT_GUIDE.md`: Screenshot capture guide
- 🔧 `src/config/`: All configuration files and templates

#### **Support Contacts**
- **Development Team**: dev@spendlot.com
- **DevOps/Infrastructure**: devops@spendlot.com
- **Product Manager**: product@spendlot.com

#### **Emergency Procedures**
- **Rollback Plan**: Documented in deployment checklist
- **Incident Response**: 24/7 monitoring and response procedures
- **Communication**: Stakeholder notification protocols

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📊 Implementation Status

### ✅ Completed Features
- **Authentication System**: Complete JWT-based auth with refresh tokens
- **Receipt Management**: Camera capture, OCR processing, editing, and detail views
- **Transaction Management**: CRUD operations, filtering, and search
- **Analytics Dashboard**: Comprehensive spending insights with interactive charts
- **Bank Integration**: Plaid SDK integration with account management
- **Category System**: Hierarchical categories with default presets
- **External Integrations**: Gmail OAuth and integration status monitoring
- **UI/UX**: Premium design with dark/light themes and accessibility
- **Navigation**: Complete navigation structure with stack and tab navigators
- **Error Handling**: Comprehensive error handling and offline support
- **Testing**: Service testing utilities and manual testing checklists

### 🔄 Ready for Backend Integration
All services are implemented and ready to connect to the backend API:
- API endpoints match backend specification exactly
- Request/response types are properly typed
- Error handling is comprehensive
- Offline fallbacks are implemented

### 🎯 Production Ready Components
- **Chart Components**: PieChart, LineChart with SVG rendering
- **UI Components**: Button, Input, Card, Loading, IntegrationStatus
- **Screen Components**: All major screens implemented and functional
- **Service Layer**: Complete API service layer with proper error handling
- **Type System**: Comprehensive TypeScript types matching backend

### 🚀 Next Steps for Production
1. **Backend Connection**: Update API_BASE_URL to production endpoint
2. **External Services**: Configure Plaid and Gmail OAuth credentials
3. **Testing**: Run comprehensive testing with real backend
4. **Deployment**: Build and deploy to app stores
5. **Monitoring**: Set up error tracking and analytics

## License

This project is licensed under the MIT License.

---

**SpendLot Receipt Tracker** - A comprehensive expense tracking solution with OCR, bank integration, and intelligent analytics. Built with React Native, TypeScript, and modern development practices.
