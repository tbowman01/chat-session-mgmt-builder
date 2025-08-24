import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly logoutButton: Locator;
  readonly userMenu: Locator;
  readonly githubLoginButton: Locator;
  readonly googleLoginButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Authentication buttons
    this.loginButton = page.getByRole('button', { name: /sign in|login/i });
    this.logoutButton = page.getByRole('button', { name: /sign out|logout/i });
    this.userMenu = page.getByTestId('user-menu');
    
    // OAuth buttons
    this.githubLoginButton = page.getByRole('button', { name: /github/i });
    this.googleLoginButton = page.getByRole('button', { name: /google/i });
    
    // Form inputs
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole('button', { name: /submit|sign in/i });
    
    // Messages
    this.errorMessage = page.getByTestId('auth-error');
    this.successMessage = page.getByTestId('auth-success');
    this.loadingSpinner = page.getByTestId('loading-spinner');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickLogout() {
    await this.logoutButton.click();
  }

  async loginWithGitHub() {
    await this.clickLogin();
    await this.githubLoginButton.click();
    
    // Handle GitHub OAuth redirect
    await this.page.waitForURL(/github\.com/, { timeout: 10000 });
    
    // Fill GitHub credentials if needed (for testing purposes)
    const githubEmailInput = this.page.locator('input[name="login"]');
    const githubPasswordInput = this.page.locator('input[name="password"]');
    const githubSubmitButton = this.page.locator('input[type="submit"]');
    
    if (await githubEmailInput.isVisible()) {
      await githubEmailInput.fill(process.env.TEST_GITHUB_EMAIL || '');
      await githubPasswordInput.fill(process.env.TEST_GITHUB_PASSWORD || '');
      await githubSubmitButton.click();
    }
    
    // Wait for redirect back to app
    await this.page.waitForURL(/localhost/, { timeout: 30000 });
  }

  async loginWithGoogle() {
    await this.clickLogin();
    await this.googleLoginButton.click();
    
    // Handle Google OAuth redirect
    await this.page.waitForURL(/accounts\.google\.com/, { timeout: 10000 });
    
    // Fill Google credentials if needed (for testing purposes)
    const googleEmailInput = this.page.locator('input[type="email"]');
    const googlePasswordInput = this.page.locator('input[type="password"]');
    const googleNextButton = this.page.locator('button:has-text("Next")');
    
    if (await googleEmailInput.isVisible()) {
      await googleEmailInput.fill(process.env.TEST_GOOGLE_EMAIL || '');
      await googleNextButton.click();
      
      await this.page.waitForTimeout(2000);
      
      if (await googlePasswordInput.isVisible()) {
        await googlePasswordInput.fill(process.env.TEST_GOOGLE_PASSWORD || '');
        await googleNextButton.click();
      }
    }
    
    // Wait for redirect back to app
    await this.page.waitForURL(/localhost/, { timeout: 30000 });
  }

  async loginWithCredentials(email: string, password: string) {
    await this.clickLogin();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async waitForAuthentication() {
    // Wait for either success message or user menu to appear
    await expect(this.userMenu.or(this.successMessage)).toBeVisible({ timeout: 30000 });
  }

  async waitForLogout() {
    // Wait for login button to appear again
    await expect(this.loginButton).toBeVisible({ timeout: 10000 });
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await expect(this.userMenu).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async hasError(): Promise<boolean> {
    try {
      await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async getUserDisplayName(): Promise<string | null> {
    if (await this.isAuthenticated()) {
      const userDisplay = this.page.getByTestId('user-display-name');
      return await userDisplay.textContent();
    }
    return null;
  }
}