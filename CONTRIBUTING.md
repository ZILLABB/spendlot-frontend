# Contributing to SpendLot Receipt Tracker

Thank you for your interest in contributing to the SpendLot Receipt Tracker! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Deployment Process](#deployment-process)

## 🤝 Code of Conduct

This project adheres to a code of conduct that we expect all contributors to follow:

- **Be respectful**: Treat all community members with respect and kindness
- **Be inclusive**: Welcome newcomers and help them get started
- **Be collaborative**: Work together to improve the project
- **Be constructive**: Provide helpful feedback and suggestions
- **Be professional**: Maintain a professional tone in all communications

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Expo CLI** for React Native development
- **iOS Simulator** (macOS) or **Android Emulator**

### Development Setup

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/ZILLABB/spendlot-frontend.git
   cd spendlot-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```

5. **Run Tests**
   ```bash
   npm test
   npm run test:production
   ```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **🐛 Bug Reports**: Report issues and bugs
- **✨ Feature Requests**: Suggest new features
- **🔧 Bug Fixes**: Fix existing issues
- **⚡ Performance Improvements**: Optimize app performance
- **📚 Documentation**: Improve documentation
- **🧪 Tests**: Add or improve test coverage
- **🎨 UI/UX Improvements**: Enhance user interface and experience

### Before Contributing

1. **Check Existing Issues**: Look for existing issues or discussions
2. **Create an Issue**: For new features or bugs, create an issue first
3. **Discuss**: Engage with maintainers and community before starting work
4. **Assign Yourself**: Comment on the issue to indicate you're working on it

### Branch Naming Convention

Use descriptive branch names following this pattern:

- **Features**: `feature/description-of-feature`
- **Bug Fixes**: `fix/description-of-fix`
- **Documentation**: `docs/description-of-change`
- **Performance**: `perf/description-of-improvement`
- **Refactoring**: `refactor/description-of-refactor`

Examples:
```bash
git checkout -b feature/plaid-bank-integration
git checkout -b fix/receipt-camera-crash
git checkout -b docs/deployment-guide-update
```

## 🔄 Pull Request Process

### 1. Prepare Your Changes

- **Create a Branch**: Create a new branch for your changes
- **Make Changes**: Implement your feature or fix
- **Test Thoroughly**: Ensure all tests pass
- **Update Documentation**: Update relevant documentation

### 2. Pre-Submission Checklist

- [ ] Code follows project coding standards
- [ ] All tests pass (`npm test`)
- [ ] Production tests pass (`npm run test:production`)
- [ ] ESLint passes (`npm run lint`)
- [ ] TypeScript compiles without errors
- [ ] Documentation is updated
- [ ] Commit messages are descriptive

### 3. Submit Pull Request

1. **Push to Your Fork**
   ```bash
   git push origin your-branch-name
   ```

2. **Create Pull Request**
   - Go to GitHub and create a pull request
   - Use the pull request template
   - Provide clear description of changes
   - Link related issues

3. **Pull Request Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tests pass locally
   - [ ] Added tests for new functionality
   - [ ] Manual testing completed

   ## Screenshots (if applicable)
   Add screenshots for UI changes

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes (or documented)
   ```

### 4. Review Process

- **Automated Checks**: CI/CD pipeline runs automatically
- **Code Review**: Maintainers will review your code
- **Feedback**: Address any feedback or requested changes
- **Approval**: Once approved, your PR will be merged

## 💻 Coding Standards

### TypeScript Guidelines

- **Use TypeScript**: All new code should be written in TypeScript
- **Type Safety**: Avoid `any` types, use proper type definitions
- **Interfaces**: Define interfaces for complex objects
- **Enums**: Use enums for constants and options

### React Native Best Practices

- **Functional Components**: Use functional components with hooks
- **Component Structure**: Follow consistent component structure
- **Props Interface**: Define props interfaces for all components
- **Performance**: Use React.memo and useMemo for optimization

### Code Style

- **ESLint**: Follow ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   └── forms/          # Form components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # API and external services
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── constants/          # App constants
└── config/             # Configuration files
```

## 🧪 Testing Guidelines

### Test Types

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows
4. **Production Tests**: Test production readiness

### Writing Tests

- **Test Coverage**: Aim for high test coverage
- **Descriptive Names**: Use descriptive test names
- **Arrange-Act-Assert**: Follow AAA pattern
- **Mock External Dependencies**: Mock API calls and external services

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run production tests
npm run test:production

# Run specific test file
npm test -- ComponentName.test.tsx
```

## 🚀 Deployment Process

### Development Deployment

1. **Validate Changes**
   ```bash
   npm run deploy:validate
   ```

2. **Run Tests**
   ```bash
   npm run test:production
   ```

3. **Generate Assets**
   ```bash
   npm run deploy:screenshots
   npm run deploy:checklist
   ```

### Production Deployment

Follow the comprehensive deployment guide in `DEPLOYMENT_CHECKLIST.md`:

1. **Configuration Update**: Update production configuration
2. **Testing**: Run full test suite
3. **Build**: Create production builds
4. **App Store Submission**: Submit to app stores

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and discussions
- **Email**: dev@spendlot.com for direct communication

### Resources

- **Documentation**: Complete documentation in README.md
- **Deployment Guide**: DEPLOYMENT_CHECKLIST.md
- **API Documentation**: Backend API documentation
- **Design System**: UI component documentation

## 🏆 Recognition

Contributors will be recognized in:

- **Contributors Section**: Listed in README.md
- **Release Notes**: Mentioned in release notes
- **GitHub**: GitHub contributor statistics

## 📄 License

By contributing to SpendLot Receipt Tracker, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to SpendLot Receipt Tracker! Your contributions help make expense management easier for everyone. 🙏
