import { Page, Locator, expect } from '@playwright/test';

export class WizardPage {
  readonly page: Page;
  readonly wizardContainer: Locator;
  readonly currentStepIndicator: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly progressBar: Locator;
  readonly stepTitle: Locator;
  readonly stepDescription: Locator;
  
  // Step-specific elements
  readonly projectNameInput: Locator;
  readonly projectDescriptionInput: Locator;
  readonly templateSelector: Locator;
  readonly frameworkSelector: Locator;
  readonly featureCheckboxes: Locator;
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Wizard container and navigation
    this.wizardContainer = page.getByTestId('wizard-container');
    this.currentStepIndicator = page.getByTestId('current-step');
    this.nextButton = page.getByRole('button', { name: /next/i });
    this.previousButton = page.getByRole('button', { name: /previous|back/i });
    this.finishButton = page.getByRole('button', { name: /finish|complete/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.progressBar = page.getByTestId('wizard-progress');
    this.stepTitle = page.getByTestId('step-title');
    this.stepDescription = page.getByTestId('step-description');
    
    // Step-specific form elements
    this.projectNameInput = page.getByLabel(/project name/i);
    this.projectDescriptionInput = page.getByLabel(/project description/i);
    this.templateSelector = page.getByTestId('template-selector');
    this.frameworkSelector = page.getByTestId('framework-selector');
    this.featureCheckboxes = page.getByTestId('feature-checkbox');
    this.confirmationMessage = page.getByTestId('confirmation-message');
  }

  async goto() {
    await this.page.goto('/wizard');
  }

  async waitForWizardToLoad() {
    await expect(this.wizardContainer).toBeVisible();
    await expect(this.stepTitle).toBeVisible();
  }

  async getCurrentStep(): Promise<number> {
    const stepText = await this.currentStepIndicator.textContent();
    const match = stepText?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  }

  async getCurrentStepTitle(): Promise<string> {
    return await this.stepTitle.textContent() || '';
  }

  async clickNext() {
    await expect(this.nextButton).toBeEnabled();
    await this.nextButton.click();
  }

  async clickPrevious() {
    await expect(this.previousButton).toBeEnabled();
    await this.previousButton.click();
  }

  async clickFinish() {
    await expect(this.finishButton).toBeEnabled();
    await this.finishButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  // Step 1: Project Information
  async fillProjectInfo(name: string, description: string) {
    await expect(this.projectNameInput).toBeVisible();
    await this.projectNameInput.fill(name);
    await this.projectDescriptionInput.fill(description);
  }

  async getProjectName(): Promise<string> {
    return await this.projectNameInput.inputValue();
  }

  async getProjectDescription(): Promise<string> {
    return await this.projectDescriptionInput.inputValue();
  }

  // Step 2: Template Selection
  async selectTemplate(templateName: string) {
    await expect(this.templateSelector).toBeVisible();
    const templateOption = this.page.getByTestId(`template-${templateName.toLowerCase()}`);
    await templateOption.click();
  }

  async getSelectedTemplate(): Promise<string | null> {
    const selectedTemplate = this.page.locator('[data-testid^="template-"][aria-selected="true"]');
    if (await selectedTemplate.count() > 0) {
      const testId = await selectedTemplate.getAttribute('data-testid');
      return testId?.replace('template-', '') || null;
    }
    return null;
  }

  // Step 3: Framework Selection
  async selectFramework(frameworkName: string) {
    await expect(this.frameworkSelector).toBeVisible();
    const frameworkOption = this.page.getByTestId(`framework-${frameworkName.toLowerCase()}`);
    await frameworkOption.click();
  }

  async getSelectedFramework(): Promise<string | null> {
    const selectedFramework = this.page.locator('[data-testid^="framework-"][aria-selected="true"]');
    if (await selectedFramework.count() > 0) {
      const testId = await selectedFramework.getAttribute('data-testid');
      return testId?.replace('framework-', '') || null;
    }
    return null;
  }

  // Step 4: Feature Selection
  async selectFeatures(features: string[]) {
    for (const feature of features) {
      const featureCheckbox = this.page.getByTestId(`feature-${feature.toLowerCase()}`);
      await featureCheckbox.check();
    }
  }

  async getSelectedFeatures(): Promise<string[]> {
    const checkedFeatures = this.page.locator('[data-testid^="feature-"]:checked');
    const count = await checkedFeatures.count();
    const features: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const testId = await checkedFeatures.nth(i).getAttribute('data-testid');
      if (testId) {
        features.push(testId.replace('feature-', ''));
      }
    }
    
    return features;
  }

  // Step 5: Confirmation
  async waitForConfirmation() {
    await expect(this.confirmationMessage).toBeVisible();
    await expect(this.finishButton).toBeVisible();
  }

  async getConfirmationSummary(): Promise<{
    projectName: string;
    template: string;
    framework: string;
    features: string[];
  }> {
    const projectNameSummary = this.page.getByTestId('summary-project-name');
    const templateSummary = this.page.getByTestId('summary-template');
    const frameworkSummary = this.page.getByTestId('summary-framework');
    const featuresSummary = this.page.getByTestId('summary-features');

    return {
      projectName: await projectNameSummary.textContent() || '',
      template: await templateSummary.textContent() || '',
      framework: await frameworkSummary.textContent() || '',
      features: (await featuresSummary.textContent() || '').split(', ').filter(Boolean)
    };
  }

  // Complete wizard flow
  async completeWizard(config: {
    projectName: string;
    projectDescription: string;
    template: string;
    framework: string;
    features: string[];
  }) {
    // Step 1: Project Information
    await this.waitForWizardToLoad();
    await this.fillProjectInfo(config.projectName, config.projectDescription);
    await this.clickNext();

    // Step 2: Template Selection
    await this.selectTemplate(config.template);
    await this.clickNext();

    // Step 3: Framework Selection
    await this.selectFramework(config.framework);
    await this.clickNext();

    // Step 4: Feature Selection
    await this.selectFeatures(config.features);
    await this.clickNext();

    // Step 5: Confirmation and Finish
    await this.waitForConfirmation();
    await this.clickFinish();
  }

  async isWizardComplete(): Promise<boolean> {
    try {
      const successMessage = this.page.getByTestId('wizard-success');
      await expect(successMessage).toBeVisible({ timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForWizardCompletion() {
    const successMessage = this.page.getByTestId('wizard-success');
    await expect(successMessage).toBeVisible({ timeout: 30000 });
  }

  async getProgressPercentage(): Promise<number> {
    const progressValue = await this.progressBar.getAttribute('value');
    return progressValue ? parseInt(progressValue) : 0;
  }

  // Validation methods
  async hasValidationErrors(): Promise<boolean> {
    const errorElements = this.page.locator('[data-testid*="error"]');
    return (await errorElements.count()) > 0;
  }

  async getValidationErrors(): Promise<string[]> {
    const errorElements = this.page.locator('[data-testid*="error"]');
    const count = await errorElements.count();
    const errors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const errorText = await errorElements.nth(i).textContent();
      if (errorText) {
        errors.push(errorText);
      }
    }
    
    return errors;
  }
}