import { test, expect } from '@playwright/test';
import { AuthPage } from '../page-objects/AuthPage';
import { TestHelpers, TestUtils } from '../utils/test-helpers';
import { testUsers, testConfig } from '../fixtures/test-data';

test.describe('Authentication Flow', () => {
  let authPage: AuthPage;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    helpers = new TestHelpers(page);
    
    // Clear any existing session
    await helpers.clearSession();
    
    // Navigate to the app
    await authPage.goto();
    await helpers.waitForPageLoad();
  });

  test.afterEach(async ({ page }) => {
    // Take screenshot on failure
    if (test.info().status !== test.info().expectedStatus) {
      await helpers.takeScreenshot(`auth-failure-${test.info().title}`);
    }
    
    // Clean up session
    await helpers.clearSession();
  });

  test('should display login button when not authenticated', async () => {
    // Verify login button is visible
    await expect(authPage.loginButton).toBeVisible();
    
    // Verify user is not authenticated
    const isAuthenticated = await authPage.isAuthenticated();
    expect(isAuthenticated).toBe(false);
    
    // Verify user menu is not visible
    await expect(authPage.userMenu).not.toBeVisible();
  });

  test('should handle GitHub OAuth login flow', async ({ page }) => {
    // Skip if no GitHub credentials provided
    if (!process.env.TEST_GITHUB_EMAIL || !process.env.TEST_GITHUB_PASSWORD) {
      test.skip('GitHub OAuth credentials not provided');
    }

    // Start GitHub login flow
    await authPage.clickLogin();
    await expect(authPage.githubLoginButton).toBeVisible();
    
    // Mock GitHub OAuth response for testing
    await helpers.mockApiResponse('**/api/auth/github/callback', {
      user: {
        id: '12345',
        login: 'testuser',
        name: 'Test User',
        email: 'test@example.com'
      },
      token: 'mock-jwt-token'
    });

    await authPage.githubLoginButton.click();
    
    // Verify successful authentication
    await authPage.waitForAuthentication();
    
    const isAuthenticated = await authPage.isAuthenticated();
    expect(isAuthenticated).toBe(true);
    
    // Verify user display name appears
    const displayName = await authPage.getUserDisplayName();
    expect(displayName).toBeTruthy();
  });

  test('should handle Google OAuth login flow', async ({ page }) => {
    // Skip if no Google credentials provided
    if (!process.env.TEST_GOOGLE_EMAIL || !process.env.TEST_GOOGLE_PASSWORD) {
      test.skip('Google OAuth credentials not provided');
    }

    // Start Google login flow
    await authPage.clickLogin();
    await expect(authPage.googleLoginButton).toBeVisible();
    
    // Mock Google OAuth response for testing
    await helpers.mockApiResponse('**/api/auth/google/callback', {
      user: {
        id: '67890',
        email: 'test@gmail.com',
        name: 'Test User'
      },
      token: 'mock-jwt-token'
    });

    await authPage.googleLoginButton.click();
    
    // Verify successful authentication
    await authPage.waitForAuthentication();
    
    const isAuthenticated = await authPage.isAuthenticated();
    expect(isAuthenticated).toBe(true);
  });

  test('should handle credential-based login', async () => {
    const { email, password } = testUsers.validUser;
    
    // Mock credential login response
    await helpers.mockApiResponse('**/api/auth/login', {
      user: {
        id: '1',
        email: email,
        name: 'Test User'
      },
      token: 'mock-jwt-token'
    });

    // Perform login
    await authPage.loginWithCredentials(email, password);
    
    // Verify successful authentication
    await authPage.waitForAuthentication();
    
    const isAuthenticated = await authPage.isAuthenticated();
    expect(isAuthenticated).toBe(true);
  });

  test('should show error for invalid credentials', async () => {
    const { email, password } = testUsers.invalidUser;
    
    // Mock failed login response
    await helpers.mockApiResponse('**/api/auth/login', {
      error: 'Invalid credentials'
    }, 401);

    // Attempt login with invalid credentials
    await authPage.loginWithCredentials(email, password);
    
    // Wait for error message
    await expect(authPage.errorMessage).toBeVisible({ timeout: testConfig.timeouts.short });
    
    // Verify error message content
    const errorMessage = await authPage.getErrorMessage();
    expect(errorMessage).toContain('Invalid credentials');
    
    // Verify user is not authenticated
    const isAuthenticated = await authPage.isAuthenticated();
    expect(isAuthenticated).toBe(false);
  });

  test('should handle logout flow', async () => {
    // First, log in
    const { email, password } = testUsers.validUser;
    
    await helpers.mockApiResponse('**/api/auth/login', {
      user: { id: '1', email, name: 'Test User' },
      token: 'mock-jwt-token'
    });
    
    await authPage.loginWithCredentials(email, password);
    await authPage.waitForAuthentication();
    
    // Mock logout response
    await helpers.mockApiResponse('**/api/auth/logout', { success: true });
    
    // Perform logout
    await authPage.clickLogout();
    
    // Verify logout
    await authPage.waitForLogout();
    
    const isAuthenticated = await authPage.isAuthenticated();
    expect(isAuthenticated).toBe(false);
    
    // Verify login button is visible again
    await expect(authPage.loginButton).toBeVisible();
  });

  test('should persist authentication across page reloads', async ({ page }) => {
    // Log in first
    const { email, password } = testUsers.validUser;
    
    await helpers.mockApiResponse('**/api/auth/login', {
      user: { id: '1', email, name: 'Test User' },
      token: 'mock-jwt-token'
    });
    
    await authPage.loginWithCredentials(email, password);
    await authPage.waitForAuthentication();
    
    // Mock session verification
    await helpers.mockApiResponse('**/api/auth/verify', {
      user: { id: '1', email, name: 'Test User' },
      valid: true
    });
    
    // Reload the page
    await page.reload();
    await helpers.waitForPageLoad();
    
    // Verify user is still authenticated
    const isAuthenticated = await authPage.isAuthenticated();
    expect(isAuthenticated).toBe(true);
  });

  test('should handle authentication loading states', async () => {
    // Mock slow authentication response
    await helpers.mockApiResponse('**/api/auth/login', {
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'mock-jwt-token'
    });
    
    // Simulate slow network
    await helpers.simulateSlowNetwork();
    
    const { email, password } = testUsers.validUser;
    await authPage.loginWithCredentials(email, password);
    
    // Verify loading spinner appears
    await expect(authPage.loadingSpinner).toBeVisible();
    
    // Wait for authentication to complete
    await authPage.waitForAuthentication();
    
    // Verify loading spinner disappears
    await expect(authPage.loadingSpinner).not.toBeVisible();
  });

  test('should validate form inputs', async () => {
    await authPage.clickLogin();
    
    // Try to submit empty form
    await helpers.clickSafely(authPage.submitButton);
    
    // Check for validation errors
    const emailField = authPage.emailInput;
    const passwordField = authPage.passwordInput;
    
    // Verify email validation
    await expect(emailField).toHaveAttribute('required');
    await expect(passwordField).toHaveAttribute('required');
    
    // Fill invalid email
    await helpers.fillFieldSafely(emailField, 'invalid-email');
    await helpers.clickSafely(authPage.submitButton);
    
    // Check for email format validation
    const isEmailValid = await emailField.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isEmailValid).toBe(false);
  });

  test('should redirect to intended page after login', async ({ page }) => {
    // Try to access protected page
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
    
    // Mock successful login
    await helpers.mockApiResponse('**/api/auth/login', {
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
      token: 'mock-jwt-token',
      redirectTo: '/dashboard'
    });
    
    const { email, password } = testUsers.validUser;
    await authPage.loginWithCredentials(email, password);
    await authPage.waitForAuthentication();
    
    // Should redirect back to intended page
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should handle network errors gracefully', async () => {
    // Mock network error
    await helpers.mockApiResponse('**/api/auth/login', {
      error: 'Network error'
    }, 500);
    
    const { email, password } = testUsers.validUser;
    await authPage.loginWithCredentials(email, password);
    
    // Verify error handling
    await expect(authPage.errorMessage).toBeVisible();
    
    const errorMessage = await authPage.getErrorMessage();
    expect(errorMessage).toContain('error');
    
    // Verify user remains unauthenticated
    const isAuthenticated = await authPage.isAuthenticated();
    expect(isAuthenticated).toBe(false);
  });
});