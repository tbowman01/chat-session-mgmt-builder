import { test, expect, Page } from '@playwright/test';
import { AuthPage } from '../page-objects/AuthPage';
import { TestHelpers } from '../utils/test-helpers';
import { testUsers, testConfig, mockData } from '../fixtures/test-data';

test.describe('Enhanced Authentication E2E Tests', () => {
  let authPage: AuthPage;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    helpers = new TestHelpers(page);
    
    await helpers.clearSession();
    await authPage.goto();
    await helpers.waitForPageLoad();
  });

  test.afterEach(async ({ page }) => {
    if (test.info().status !== test.info().expectedStatus) {
      await helpers.takeScreenshot(`auth-enhanced-failure-${test.info().title}`);
    }
    await helpers.clearSession();
  });

  test.describe('OAuth Flow Validation', () => {
    test('should handle GitHub OAuth state validation', async ({ page, context }) => {
      // Mock GitHub OAuth endpoints
      await helpers.mockApiResponse('**/login/oauth/authorize*', {
        redirect: 'http://localhost:3000/auth/callback?code=test-code&state=test-state'
      });
      
      await helpers.mockApiResponse('**/api/auth/github/callback*', {
        success: true,
        token: 'mock-jwt-token',
        user: mockData.githubUser
      });
      
      // Start OAuth flow
      await authPage.clickLogin();
      await expect(authPage.githubLoginButton).toBeVisible();
      
      // Intercept the OAuth redirect to validate parameters
      const oauthUrl = await page.evaluate(() => {
        return new Promise((resolve) => {
          const originalLocation = window.location.href;
          
          // Mock click that would normally redirect
          const button = document.querySelector('[data-testid="github-login"]') as HTMLElement;
          if (button) {
            button.click();
          }
          
          // Return the would-be redirect URL
          setTimeout(() => resolve(originalLocation + '?oauth=github'), 100);
        });
      });
      
      // Validate OAuth URL parameters
      const url = new URL(oauthUrl as string);
      expect(url.searchParams.get('client_id')).toBeTruthy();
      expect(url.searchParams.get('state')).toBeTruthy();
      expect(url.searchParams.get('scope')).toContain('user:email');
    });

    test('should handle OAuth callback with valid parameters', async ({ page }) => {
      // Mock successful OAuth callback
      await helpers.mockApiResponse('**/api/auth/github/callback*', {
        success: true,
        token: 'valid-jwt-token',
        user: mockData.githubUser
      });
      
      // Simulate OAuth callback by navigating directly
      await page.goto('/?code=valid-auth-code&state=valid-csrf-state');
      
      await authPage.waitForAuthentication();
      
      const isAuthenticated = await authPage.isAuthenticated();
      expect(isAuthenticated).toBe(true);
      
      const userData = await authPage.getUserDisplayName();
      expect(userData).toBe('Test User');
    });

    test('should handle OAuth callback with CSRF state mismatch', async ({ page }) => {
      // Mock CSRF state validation failure
      await helpers.mockApiResponse('**/api/auth/github/callback*', {
        error: 'Invalid state parameter'
      }, 400);
      
      // Simulate malicious callback with wrong state
      await page.goto('/?code=valid-code&state=malicious-state');
      
      await expect(authPage.errorMessage).toBeVisible({ timeout: testConfig.timeouts.medium });
      
      const errorMessage = await authPage.getErrorMessage();
      expect(errorMessage).toContain('Invalid');
      
      const isAuthenticated = await authPage.isAuthenticated();
      expect(isAuthenticated).toBe(false);
    });
  });

  test.describe('Security Validation', () => {
    test('should prevent XSS in login form', async ({ page }) => {
      const xssPayload = '<script>window.xssExecuted=true</script>';
      
      await authPage.clickLogin();
      
      // Try to inject XSS in email field
      await authPage.emailInput.fill(xssPayload);
      await authPage.passwordInput.fill('TestPassword123!');
      await authPage.submitButton.click();
      
      // Check that XSS was not executed
      const xssExecuted = await page.evaluate(() => (window as any).xssExecuted);
      expect(xssExecuted).toBeUndefined();
      
      // Should show validation error, not execute script
      await expect(authPage.errorMessage).toBeVisible();
    });

    test('should handle SQL injection attempts safely', async ({ page }) => {
      const sqlInjection = "' OR '1'='1' --";
      
      await helpers.mockApiResponse('**/api/auth/login', {
        error: 'Validation failed',
        details: [{ msg: 'Invalid email format', path: 'email' }]
      }, 400);
      
      await authPage.clickLogin();
      await authPage.emailInput.fill(sqlInjection);
      await authPage.passwordInput.fill('password');
      await authPage.submitButton.click();
      
      await expect(authPage.errorMessage).toBeVisible();
      
      // Should not be authenticated
      const isAuthenticated = await authPage.isAuthenticated();
      expect(isAuthenticated).toBe(false);
    });

    test('should enforce rate limiting on failed login attempts', async ({ page }) => {
      await helpers.mockApiResponse('**/api/auth/login', {
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      }, 401);
      
      await authPage.clickLogin();
      
      // Make multiple rapid failed login attempts
      for (let i = 0; i < 6; i++) {
        await authPage.emailInput.fill('test@example.com');
        await authPage.passwordInput.fill('wrongpassword');
        await authPage.submitButton.click();
        
        if (i < 4) {
          await expect(page.locator('text=incorrect')).toBeVisible({ timeout: 2000 });
        }
      }
      
      // Should eventually show rate limit error
      await expect(page.locator('text*=rate limit')).toBeVisible({ timeout: testConfig.timeouts.medium });
    });

    test('should validate JWT token expiration', async ({ page }) => {
      // Mock initial successful login
      await helpers.mockApiResponse('**/api/auth/login', {
        success: true,
        token: 'valid-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' }
      });
      
      await authPage.loginWithCredentials('test@example.com', 'TestPassword123!');
      await authPage.waitForAuthentication();
      
      // Mock token expiration
      await helpers.mockApiResponse('**/api/auth/verify', {
        error: 'Authentication token expired'
      }, 401);
      
      // Simulate page reload that would trigger token verification
      await page.reload();
      
      // Should redirect back to login due to expired token
      await expect(authPage.loginButton).toBeVisible({ timeout: testConfig.timeouts.medium });
      
      const isAuthenticated = await authPage.isAuthenticated();
      expect(isAuthenticated).toBe(false);
    });
  });

  test.describe('Error Handling and Recovery', () => {
    test('should handle OAuth provider downtime gracefully', async ({ page }) => {
      // Mock GitHub service unavailable
      await helpers.mockApiResponse('**/login/oauth/authorize*', {
        error: 'Service Temporarily Unavailable'
      }, 503);
      
      await authPage.clickLogin();
      await authPage.githubLoginButton.click();
      
      // Should show appropriate error message
      await expect(page.locator('text*=temporarily unavailable')).toBeVisible({
        timeout: testConfig.timeouts.medium
      });
      
      // Should allow retry
      await expect(authPage.githubLoginButton).toBeEnabled();
    });

    test('should handle network connectivity issues', async ({ page, context }) => {
      // Simulate network failure
      await context.setOffline(true);
      
      await authPage.clickLogin();
      await authPage.emailInput.fill('test@example.com');
      await authPage.passwordInput.fill('TestPassword123!');
      await authPage.submitButton.click();
      
      // Should show network error
      await expect(page.locator('text*=network')).toBeVisible({
        timeout: testConfig.timeouts.medium
      });
      
      // Restore network and retry
      await context.setOffline(false);
      
      await helpers.mockApiResponse('**/api/auth/login', {
        success: true,
        token: 'valid-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' }
      });
      
      await authPage.submitButton.click();
      await authPage.waitForAuthentication();
      
      const isAuthenticated = await authPage.isAuthenticated();
      expect(isAuthenticated).toBe(true);
    });

    test('should handle backend API errors gracefully', async ({ page }) => {
      const errorScenarios = [
        { status: 500, message: 'Internal Server Error' },
        { status: 502, message: 'Bad Gateway' },
        { status: 503, message: 'Service Unavailable' },
        { status: 504, message: 'Gateway Timeout' },
      ];
      
      for (const scenario of errorScenarios) {
        await helpers.mockApiResponse('**/api/auth/login', {
          error: scenario.message
        }, scenario.status);
        
        await authPage.clickLogin();
        await authPage.emailInput.fill('test@example.com');
        await authPage.passwordInput.fill('TestPassword123!');
        await authPage.submitButton.click();
        
        // Should show user-friendly error message
        await expect(authPage.errorMessage).toBeVisible();
        
        const errorText = await authPage.getErrorMessage();
        expect(errorText).not.toContain('500');
        expect(errorText).not.toContain('502');
        expect(errorText).not.toContain('Internal Server Error');
        
        // Reset for next test
        await page.reload();
      }
    });

    test('should handle malformed server responses', async ({ page }) => {
      // Mock malformed JSON response
      await page.route('**/api/auth/login', route => {
        route.fulfill({
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: 'invalid json {[}',
        });
      });
      
      await authPage.clickLogin();
      await authPage.emailInput.fill('test@example.com');
      await authPage.passwordInput.fill('TestPassword123!');
      await authPage.submitButton.click();
      
      // Should handle parsing error gracefully
      await expect(authPage.errorMessage).toBeVisible();
      
      const errorMessage = await authPage.getErrorMessage();
      expect(errorMessage).not.toContain('SyntaxError');
      expect(errorMessage).not.toContain('JSON');
    });
  });

  test.describe('Accessibility and UX', () => {
    test('should be keyboard navigable', async ({ page }) => {
      // Navigate using Tab key
      await page.keyboard.press('Tab'); // Should focus login button
      
      let focusedElement = await page.locator(':focus').textContent();
      expect(focusedElement).toContain('GitHub');
      
      await page.keyboard.press('Enter'); // Activate login
      
      await expect(authPage.emailInput).toBeVisible();
      
      // Navigate through form fields
      await page.keyboard.press('Tab'); // Email field
      await page.keyboard.type('test@example.com');
      
      await page.keyboard.press('Tab'); // Password field
      await page.keyboard.type('TestPassword123!');
      
      await page.keyboard.press('Tab'); // Submit button
      
      const submitButton = page.locator(':focus');
      expect(await submitButton.textContent()).toContain('Sign');
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await authPage.clickLogin();
      
      // Check form has proper labels
      await expect(authPage.emailInput).toHaveAttribute('aria-label', /email/i);
      await expect(authPage.passwordInput).toHaveAttribute('aria-label', /password/i);
      
      // Check error messages have proper ARIA attributes
      await authPage.emailInput.fill('invalid-email');
      await authPage.submitButton.click();
      
      const errorElement = authPage.errorMessage;
      await expect(errorElement).toHaveAttribute('role', 'alert');
      await expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    test('should work with screen readers', async ({ page }) => {
      // Simulate screen reader user flow
      await authPage.clickLogin();
      
      // Check that form elements are properly announced
      const emailField = authPage.emailInput;
      await expect(emailField).toHaveAccessibleName(/email/i);
      
      const passwordField = authPage.passwordInput;
      await expect(passwordField).toHaveAccessibleName(/password/i);
      
      // Check error announcement
      await emailField.fill('invalid');
      await authPage.submitButton.click();
      
      const errorMessage = authPage.errorMessage;
      await expect(errorMessage).toBeVisible();
      
      // Error should be announced to screen readers
      await expect(errorMessage).toHaveAttribute('aria-live');
    });

    test('should support high contrast mode', async ({ page }) => {
      // Enable high contrast mode simulation
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.addStyleTag({
        content: `
          @media (prefers-contrast: high) {
            * { 
              background: black !important; 
              color: white !important; 
              border: 1px solid white !important; 
            }
          }
        `
      });
      
      await authPage.clickLogin();
      
      // Verify elements are still visible and functional
      await expect(authPage.emailInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
      await expect(authPage.submitButton).toBeVisible();
      
      // Test form interaction
      await authPage.emailInput.fill('test@example.com');
      await authPage.passwordInput.fill('TestPassword123!');
      
      const emailValue = await authPage.emailInput.inputValue();
      expect(emailValue).toBe('test@example.com');
    });
  });

  test.describe('Mobile and Responsive Design', () => {
    test('should work on mobile viewports', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await authPage.goto();
      await helpers.waitForPageLoad();
      
      // Should show mobile-optimized login
      await expect(authPage.loginButton).toBeVisible();
      
      await authPage.clickLogin();
      
      // Form should be usable on mobile
      await expect(authPage.emailInput).toBeVisible();
      await expect(authPage.passwordInput).toBeVisible();
      
      // Touch interaction should work
      await authPage.emailInput.tap();
      await authPage.emailInput.fill('test@example.com');
      
      await authPage.passwordInput.tap();
      await authPage.passwordInput.fill('TestPassword123!');
      
      const emailValue = await authPage.emailInput.inputValue();
      expect(emailValue).toBe('test@example.com');
    });

    test('should handle virtual keyboard on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await authPage.clickLogin();
      
      // Focus on input should adjust viewport
      await authPage.emailInput.tap();
      
      // Form should remain accessible even with virtual keyboard
      await expect(authPage.emailInput).toBeFocused();
      await expect(authPage.submitButton).toBeVisible();
      
      // Typing should work normally
      await page.keyboard.type('test@example.com');
      
      const value = await authPage.emailInput.inputValue();
      expect(value).toBe('test@example.com');
    });

    test('should support tablet viewports', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await authPage.goto();
      
      // Should adapt to tablet layout
      await expect(authPage.loginButton).toBeVisible();
      
      await authPage.clickLogin();
      
      // Form should be properly sized for tablet
      const formContainer = page.locator('[data-testid="login-form"]');
      const boundingBox = await formContainer.boundingBox();
      
      expect(boundingBox?.width).toBeGreaterThan(300);
      expect(boundingBox?.width).toBeLessThan(600);
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load authentication UI quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await authPage.goto();
      await authPage.loginButton.waitFor({ state: 'visible' });
      
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time
      expect(loadTime).toBeLessThan(3000); // 3 seconds
    });

    test('should handle slow network conditions', async ({ page, context }) => {
      // Simulate slow 3G connection
      await context.route('**/*', route => {
        // Add delay to simulate slow network
        setTimeout(() => route.continue(), 100);
      });
      
      const startTime = Date.now();
      
      await authPage.goto();
      await helpers.waitForPageLoad();
      
      // Should still be usable, just slower
      await expect(authPage.loginButton).toBeVisible({ timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(15000); // Should load within 15 seconds even on slow connection
    });

    test('should show appropriate loading states', async ({ page }) => {
      // Mock slow login response
      await helpers.mockApiResponse('**/api/auth/login', {
        success: true,
        token: 'valid-token',
        user: { id: '1', email: 'test@example.com', name: 'Test User' }
      }, 200, 2000); // 2 second delay
      
      await authPage.clickLogin();
      await authPage.emailInput.fill('test@example.com');
      await authPage.passwordInput.fill('TestPassword123!');
      
      await authPage.submitButton.click();
      
      // Should show loading spinner
      await expect(authPage.loadingSpinner).toBeVisible({ timeout: 1000 });
      
      // Submit button should be disabled during loading
      await expect(authPage.submitButton).toBeDisabled();
      
      // Should complete successfully
      await authPage.waitForAuthentication();
      
      const isAuthenticated = await authPage.isAuthenticated();
      expect(isAuthenticated).toBe(true);
    });
  });
});