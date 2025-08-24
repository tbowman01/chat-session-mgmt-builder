# E2E Testing with Playwright

This directory contains end-to-end tests for the Chat Session Management Builder application.

## 🚀 Quick Start

```bash
# Install Playwright
npm install @playwright/test

# Install browsers
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run tests in headed mode
npm run test:e2e:headed

# Run tests in debug mode
npm run test:e2e:debug

# Generate and show HTML report
npm run test:e2e:report
```

## 📁 Directory Structure

```
tests/e2e/
├── fixtures/           # Test data and fixtures
│   └── test-data.ts
├── page-objects/       # Page Object Model classes
│   ├── AuthPage.ts
│   └── WizardPage.ts
├── specs/             # Test specifications
│   ├── auth.spec.ts
│   └── wizard.spec.ts
└── utils/             # Test utilities and helpers
    ├── global-setup.ts
    ├── global-teardown.ts
    └── test-helpers.ts
```

## 🧪 Test Categories

### Authentication Tests (`auth.spec.ts`)
- OAuth login flows (GitHub, Google)
- Credential-based authentication
- Session persistence
- Error handling
- Form validation

### Wizard Tests (`wizard.spec.ts`)
- Multi-step wizard navigation
- Form validation and data persistence
- Project creation flow
- Template and framework selection
- Feature configuration

## 📋 Page Object Model

### AuthPage
Handles authentication-related interactions:
- Login/logout actions
- OAuth provider selection
- Form field interactions
- Authentication state verification

### WizardPage
Manages wizard flow interactions:
- Step navigation
- Form filling and validation
- Selection components
- Progress tracking
- Completion verification

## 🛠️ Configuration

### Environment Variables
Create a `.env` file with the following variables for testing:

```bash
# E2E Testing
TEST_GITHUB_EMAIL=your_test_github_email
TEST_GITHUB_PASSWORD=your_test_github_password
TEST_GOOGLE_EMAIL=your_test_google_email
TEST_GOOGLE_PASSWORD=your_test_google_password
BASE_URL=http://localhost:3000
```

### Playwright Config
The `playwright.config.ts` file includes:
- Multi-browser testing (Chrome, Firefox, Safari, Edge)
- Mobile viewport testing
- Parallel test execution
- Automatic screenshot/video capture on failure
- Test artifacts and reporting

## 🎯 Test Helpers

The `TestHelpers` class provides utilities for:
- Safe element interactions
- API response mocking
- Screenshot capture
- Session management
- Network simulation
- Accessibility checks

## 📊 Reporting

Tests generate multiple report formats:
- **HTML Report**: Interactive test results with screenshots/videos
- **JSON Report**: Machine-readable test results
- **JUnit Report**: CI/CD integration compatible
- **Screenshots**: Captured on test failures
- **Videos**: Recorded for failed tests
- **Traces**: Detailed execution traces for debugging

## 🔧 Best Practices

### Test Data Management
- Use fixtures for consistent test data
- Mock external API responses
- Isolate tests with proper setup/teardown

### Page Object Pattern
- Encapsulate page interactions in page objects
- Use semantic locators (roles, labels, test-ids)
- Provide meaningful helper methods

### Assertions
- Use Playwright's auto-waiting assertions
- Verify both positive and negative scenarios
- Check for proper error handling

### Debugging
```bash
# Run specific test in debug mode
npx playwright test auth.spec.ts --debug

# Run with browser visible
npx playwright test --headed

# Generate trace
npx playwright test --trace on
```

## 🚀 CI/CD Integration

The tests are configured for CI environments with:
- Automatic browser installation
- Retry logic for flaky tests
- Artifact collection
- Performance optimizations

## 📈 Performance

- Tests run in parallel by default
- Optimized for CI environments
- Efficient resource usage
- Smart retry mechanisms

## 🔒 Security

- Sensitive data handled via environment variables
- API mocking to avoid real authentication
- Test isolation and cleanup
- No hardcoded credentials

## 📞 Troubleshooting

### Common Issues

1. **Tests fail with timeout**: Increase timeout in config or use `test.slow()`
2. **Elements not found**: Check selectors and wait conditions
3. **Authentication issues**: Verify OAuth credentials and mock setup
4. **Network errors**: Check if services are running and accessible

### Debug Commands
```bash
# Show browser during test execution
npx playwright test --headed --project=chromium

# Run single test file
npx playwright test auth.spec.ts

# Generate and open trace viewer
npx playwright show-trace test-results/trace.zip
```