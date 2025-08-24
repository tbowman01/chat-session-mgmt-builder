import { Page, expect, Locator } from '@playwright/test';
import { testConfig } from '../fixtures/test-data';

export class TestHelpers {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for an element to be visible with custom timeout
   */
  async waitForVisible(locator: Locator, timeout = testConfig.timeouts.medium) {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForHidden(locator: Locator, timeout = testConfig.timeouts.medium) {
    await expect(locator).toBeHidden({ timeout });
  }

  /**
   * Wait for page load with network idle
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take a screenshot with timestamp
   */
  async takeScreenshot(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `test-results/screenshots/${name}-${timestamp}.png`,
      fullPage: true
    });
  }

  /**
   * Simulate slow network conditions
   */
  async simulateSlowNetwork() {
    const context = this.page.context();
    await context.route('**/*', async (route, request) => {
      // Add delay to simulate slow network
      await new Promise(resolve => setTimeout(resolve, 100));
      await route.continue();
    });
  }

  /**
   * Clear all cookies and local storage
   */
  async clearSession() {
    await this.page.context().clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Fill form field with validation
   */
  async fillFieldSafely(locator: Locator, value: string, options?: {
    clear?: boolean;
    validate?: boolean;
    timeout?: number;
  }) {
    const { clear = true, validate = true, timeout = testConfig.timeouts.short } = options || {};
    
    await expect(locator).toBeVisible({ timeout });
    
    if (clear) {
      await locator.clear();
    }
    
    await locator.fill(value);
    
    if (validate) {
      await expect(locator).toHaveValue(value);
    }
  }

  /**
   * Click element with retry logic
   */
  async clickSafely(locator: Locator, options?: {
    retries?: number;
    timeout?: number;
  }) {
    const { retries = 3, timeout = testConfig.timeouts.short } = options || {};
    
    for (let i = 0; i < retries; i++) {
      try {
        await expect(locator).toBeVisible({ timeout });
        await expect(locator).toBeEnabled({ timeout });
        await locator.click();
        break;
      } catch (error) {
        if (i === retries - 1) throw error;
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(urlPattern: string | RegExp, timeout = testConfig.timeouts.long) {
    return await this.page.waitForResponse(urlPattern, { timeout });
  }

  /**
   * Mock API response
   */
  async mockApiResponse(urlPattern: string | RegExp, responseData: any, status = 200) {
    await this.page.route(urlPattern, async route => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(responseData)
      });
    });
  }

  /**
   * Check for console errors
   */
  async checkConsoleErrors(): Promise<string[]> {
    const errors: string[] = [];
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    return errors;
  }

  /**
   * Wait for element to contain text
   */
  async waitForText(locator: Locator, text: string | RegExp, timeout = testConfig.timeouts.medium) {
    await expect(locator).toContainText(text, { timeout });
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Get element text content safely
   */
  async getTextContent(locator: Locator): Promise<string> {
    await expect(locator).toBeVisible();
    return await locator.textContent() || '';
  }

  /**
   * Check if element exists without throwing
   */
  async elementExists(locator: Locator): Promise<boolean> {
    try {
      await expect(locator).toBeVisible({ timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for multiple elements to be visible
   */
  async waitForMultipleElements(locators: Locator[], timeout = testConfig.timeouts.medium) {
    await Promise.all(
      locators.map(locator => expect(locator).toBeVisible({ timeout }))
    );
  }

  /**
   * Drag and drop helper
   */
  async dragAndDrop(source: Locator, target: Locator) {
    await source.dragTo(target);
  }

  /**
   * Upload file helper
   */
  async uploadFile(fileInput: Locator, filePath: string) {
    await fileInput.setInputFiles(filePath);
  }

  /**
   * Handle dialog (alert, confirm, prompt)
   */
  async handleDialog(accept = true, promptText?: string) {
    this.page.on('dialog', async dialog => {
      if (dialog.type() === 'prompt' && promptText) {
        await dialog.accept(promptText);
      } else if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Navigate and wait for load
   */
  async navigateAndWait(url: string) {
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Check accessibility violations (basic)
   */
  async checkBasicAccessibility() {
    // Check for basic accessibility issues
    const issues: string[] = [];
    
    // Check for images without alt text
    const imagesWithoutAlt = await this.page.locator('img:not([alt])').count();
    if (imagesWithoutAlt > 0) {
      issues.push(`${imagesWithoutAlt} images without alt text`);
    }
    
    // Check for buttons without accessible names
    const buttonsWithoutNames = await this.page.locator('button:not([aria-label]):not([title])').filter({
      has: this.page.locator(':not(:has-text("."))')
    }).count();
    if (buttonsWithoutNames > 0) {
      issues.push(`${buttonsWithoutNames} buttons without accessible names`);
    }
    
    return issues;
  }

  /**
   * Generate test report data
   */
  async generateTestMetadata() {
    return {
      url: this.getCurrentUrl(),
      timestamp: new Date().toISOString(),
      viewport: await this.page.viewportSize(),
      userAgent: await this.page.evaluate(() => navigator.userAgent),
      consoleErrors: await this.checkConsoleErrors(),
      accessibilityIssues: await this.checkBasicAccessibility()
    };
  }
}

/**
 * Global test utilities
 */
export const TestUtils = {
  /**
   * Generate random test data
   */
  generateRandomString(length = 8): string {
    return Math.random().toString(36).substring(2, length + 2);
  },

  /**
   * Generate random email
   */
  generateRandomEmail(): string {
    return `test-${this.generateRandomString()}@example.com`;
  },

  /**
   * Generate random project name
   */
  generateRandomProjectName(): string {
    const adjectives = ['Amazing', 'Brilliant', 'Creative', 'Dynamic', 'Elegant'];
    const nouns = ['Project', 'App', 'Tool', 'Platform', 'Solution'];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adj} ${noun} ${this.generateRandomString(4)}`;
  },

  /**
   * Wait for condition with timeout
   */
  async waitForCondition(
    condition: () => Promise<boolean>,
    timeout = testConfig.timeouts.medium,
    interval = 1000
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  },

  /**
   * Format duration for reports
   */
  formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  }
};