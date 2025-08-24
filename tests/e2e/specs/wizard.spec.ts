import { test, expect } from '@playwright/test';
import { WizardPage } from '../page-objects/WizardPage';
import { AuthPage } from '../page-objects/AuthPage';
import { TestHelpers, TestUtils } from '../utils/test-helpers';
import { wizardTestData, testUsers, mockData } from '../fixtures/test-data';

test.describe('Project Wizard Flow', () => {
  let wizardPage: WizardPage;
  let authPage: AuthPage;
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    wizardPage = new WizardPage(page);
    authPage = new AuthPage(page);
    helpers = new TestHelpers(page);
    
    // Clear session and authenticate user
    await helpers.clearSession();
    
    // Mock authentication
    await helpers.mockApiResponse('**/api/auth/verify', {
      user: testUsers.validUser,
      valid: true
    });
    
    // Mock wizard data endpoints
    await helpers.mockApiResponse('**/api/wizard/templates', mockData.templates);
    await helpers.mockApiResponse('**/api/wizard/frameworks', mockData.frameworks);
    
    // Navigate to wizard
    await wizardPage.goto();
  });

  test.afterEach(async () => {
    // Take screenshot on failure
    if (test.info().status !== test.info().expectedStatus) {
      await helpers.takeScreenshot(`wizard-failure-${test.info().title}`);
    }
  });

  test('should load wizard with initial step', async () => {
    await wizardPage.waitForWizardToLoad();
    
    // Verify wizard container is visible
    await expect(wizardPage.wizardContainer).toBeVisible();
    
    // Verify we're on step 1
    const currentStep = await wizardPage.getCurrentStep();
    expect(currentStep).toBe(1);
    
    // Verify step title is visible
    const stepTitle = await wizardPage.getCurrentStepTitle();
    expect(stepTitle).toContain('Project');
    
    // Verify form elements are visible
    await expect(wizardPage.projectNameInput).toBeVisible();
    await expect(wizardPage.projectDescriptionInput).toBeVisible();
    
    // Verify navigation buttons
    await expect(wizardPage.nextButton).toBeVisible();
    await expect(wizardPage.previousButton).not.toBeVisible(); // Should be hidden on first step
  });

  test('should complete simple project wizard', async () => {
    const project = wizardTestData.simpleProject;
    
    // Mock successful project creation
    await helpers.mockApiResponse('**/api/wizard/create', {
      success: true,
      projectId: 'test-project-123',
      message: 'Project created successfully'
    });
    
    await wizardPage.completeWizard(project);
    
    // Verify wizard completion
    const isComplete = await wizardPage.isWizardComplete();
    expect(isComplete).toBe(true);
    
    // Verify success message
    await wizardPage.waitForWizardCompletion();
  });

  test('should validate project information step', async () => {
    await wizardPage.waitForWizardToLoad();
    
    // Try to proceed without filling required fields
    await wizardPage.clickNext();
    
    // Should show validation errors
    const hasErrors = await wizardPage.hasValidationErrors();
    expect(hasErrors).toBe(true);
    
    // Fill project name only
    await helpers.fillFieldSafely(wizardPage.projectNameInput, 'Test Project');
    await wizardPage.clickNext();
    
    // Still should have errors for description
    expect(await wizardPage.hasValidationErrors()).toBe(true);
    
    // Fill both fields
    await helpers.fillFieldSafely(wizardPage.projectDescriptionInput, 'Test description');
    await wizardPage.clickNext();
    
    // Should proceed to next step
    const currentStep = await wizardPage.getCurrentStep();
    expect(currentStep).toBe(2);
  });

  test('should navigate between wizard steps', async () => {
    await wizardPage.waitForWizardToLoad();
    
    // Fill step 1
    await wizardPage.fillProjectInfo('Test Project', 'Test description');
    await wizardPage.clickNext();
    
    // Should be on step 2
    expect(await wizardPage.getCurrentStep()).toBe(2);
    await expect(wizardPage.templateSelector).toBeVisible();
    await expect(wizardPage.previousButton).toBeVisible();
    
    // Go back to step 1
    await wizardPage.clickPrevious();
    
    // Should be back on step 1
    expect(await wizardPage.getCurrentStep()).toBe(1);
    
    // Verify data persistence
    expect(await wizardPage.getProjectName()).toBe('Test Project');
    expect(await wizardPage.getProjectDescription()).toBe('Test description');
  });

  test('should handle template selection', async () => {
    await wizardPage.waitForWizardToLoad();
    
    // Navigate to template selection step
    await wizardPage.fillProjectInfo('Test Project', 'Test description');
    await wizardPage.clickNext();
    
    // Verify template options are loaded
    await expect(wizardPage.templateSelector).toBeVisible();
    
    // Select a template
    await wizardPage.selectTemplate('basic');
    
    // Verify selection
    const selectedTemplate = await wizardPage.getSelectedTemplate();
    expect(selectedTemplate).toBe('basic');
    
    // Should be able to proceed
    await wizardPage.clickNext();
    expect(await wizardPage.getCurrentStep()).toBe(3);
  });

  test('should handle framework selection', async () => {
    await wizardPage.waitForWizardToLoad();
    
    // Navigate to framework selection step
    await wizardPage.fillProjectInfo('Test Project', 'Test description');
    await wizardPage.clickNext();
    await wizardPage.selectTemplate('basic');
    await wizardPage.clickNext();
    
    // Verify framework options are loaded
    await expect(wizardPage.frameworkSelector).toBeVisible();
    
    // Select a framework
    await wizardPage.selectFramework('react');
    
    // Verify selection
    const selectedFramework = await wizardPage.getSelectedFramework();
    expect(selectedFramework).toBe('react');
    
    // Should be able to proceed
    await wizardPage.clickNext();
    expect(await wizardPage.getCurrentStep()).toBe(4);
  });

  test('should handle feature selection', async () => {
    await wizardPage.waitForWizardToLoad();
    
    // Navigate to feature selection step
    await wizardPage.fillProjectInfo('Test Project', 'Test description');
    await wizardPage.clickNext();
    await wizardPage.selectTemplate('advanced');
    await wizardPage.clickNext();
    await wizardPage.selectFramework('nextjs');
    await wizardPage.clickNext();
    
    // Select multiple features
    const features = ['authentication', 'database', 'api'];
    await wizardPage.selectFeatures(features);
    
    // Verify selections
    const selectedFeatures = await wizardPage.getSelectedFeatures();
    expect(selectedFeatures).toEqual(expect.arrayContaining(features));
    
    // Should be able to proceed
    await wizardPage.clickNext();
    expect(await wizardPage.getCurrentStep()).toBe(5);
  });

  test('should show confirmation summary', async () => {
    const project = wizardTestData.complexProject;
    
    await wizardPage.waitForWizardToLoad();
    
    // Complete all steps except the last one
    await wizardPage.fillProjectInfo(project.projectName, project.projectDescription);
    await wizardPage.clickNext();
    await wizardPage.selectTemplate(project.template);
    await wizardPage.clickNext();
    await wizardPage.selectFramework(project.framework);
    await wizardPage.clickNext();
    await wizardPage.selectFeatures(project.features);
    await wizardPage.clickNext();
    
    // Should be on confirmation step
    await wizardPage.waitForConfirmation();
    
    // Verify summary information
    const summary = await wizardPage.getConfirmationSummary();
    expect(summary.projectName).toBe(project.projectName);
    expect(summary.template).toBe(project.template);
    expect(summary.framework).toBe(project.framework);
    expect(summary.features).toEqual(expect.arrayContaining(project.features));
    
    // Verify finish button is available
    await expect(wizardPage.finishButton).toBeVisible();
    await expect(wizardPage.finishButton).toBeEnabled();
  });

  test('should handle wizard cancellation', async () => {
    await wizardPage.waitForWizardToLoad();
    
    // Fill some data
    await wizardPage.fillProjectInfo('Test Project', 'Test description');
    
    // Handle confirmation dialog
    await helpers.handleDialog(true);
    
    // Cancel wizard
    await wizardPage.clickCancel();
    
    // Should redirect away from wizard
    await helpers.waitForPageLoad();
    expect(wizardPage.page.url()).not.toContain('/wizard');
  });

  test('should update progress indicator', async () => {
    await wizardPage.waitForWizardToLoad();
    
    // Initial progress should be low
    let progress = await wizardPage.getProgressPercentage();
    expect(progress).toBeLessThan(50);
    
    // Complete first step
    await wizardPage.fillProjectInfo('Test Project', 'Test description');
    await wizardPage.clickNext();
    
    // Progress should increase
    progress = await wizardPage.getProgressPercentage();
    expect(progress).toBeGreaterThan(20);
    
    // Continue through steps
    await wizardPage.selectTemplate('basic');
    await wizardPage.clickNext();
    
    progress = await wizardPage.getProgressPercentage();
    expect(progress).toBeGreaterThan(40);
    
    await wizardPage.selectFramework('react');
    await wizardPage.clickNext();
    
    progress = await wizardPage.getProgressPercentage();
    expect(progress).toBeGreaterThan(60);
    
    await wizardPage.selectFeatures(['authentication']);
    await wizardPage.clickNext();
    
    // Should be near completion
    progress = await wizardPage.getProgressPercentage();
    expect(progress).toBeGreaterThan(80);
  });

  test('should handle API errors during wizard completion', async () => {
    const project = wizardTestData.simpleProject;
    
    // Mock API error
    await helpers.mockApiResponse('**/api/wizard/create', {
      error: 'Failed to create project'
    }, 500);
    
    await wizardPage.waitForWizardToLoad();
    
    // Complete wizard steps
    await wizardPage.fillProjectInfo(project.projectName, project.projectDescription);
    await wizardPage.clickNext();
    await wizardPage.selectTemplate(project.template);
    await wizardPage.clickNext();
    await wizardPage.selectFramework(project.framework);
    await wizardPage.clickNext();
    await wizardPage.selectFeatures(project.features);
    await wizardPage.clickNext();
    
    // Attempt to finish wizard
    await wizardPage.waitForConfirmation();
    await wizardPage.clickFinish();
    
    // Should show error message
    const errorMessage = wizardPage.page.getByTestId('wizard-error');
    await expect(errorMessage).toBeVisible();
    
    // Should not complete wizard
    const isComplete = await wizardPage.isWizardComplete();
    expect(isComplete).toBe(false);
  });

  test('should maintain form state during navigation', async () => {
    await wizardPage.waitForWizardToLoad();
    
    const testData = {
      projectName: 'Persistent Test Project',
      projectDescription: 'This data should persist',
      template: 'advanced',
      framework: 'nextjs',
      features: ['authentication', 'database']
    };
    
    // Fill step 1
    await wizardPage.fillProjectInfo(testData.projectName, testData.projectDescription);
    await wizardPage.clickNext();
    
    // Fill step 2
    await wizardPage.selectTemplate(testData.template);
    await wizardPage.clickNext();
    
    // Fill step 3
    await wizardPage.selectFramework(testData.framework);
    await wizardPage.clickNext();
    
    // Fill step 4
    await wizardPage.selectFeatures(testData.features);
    
    // Navigate back through all steps and verify data persistence
    await wizardPage.clickPrevious(); // Back to step 3
    expect(await wizardPage.getSelectedFramework()).toBe(testData.framework);
    
    await wizardPage.clickPrevious(); // Back to step 2
    expect(await wizardPage.getSelectedTemplate()).toBe(testData.template);
    
    await wizardPage.clickPrevious(); // Back to step 1
    expect(await wizardPage.getProjectName()).toBe(testData.projectName);
    expect(await wizardPage.getProjectDescription()).toBe(testData.projectDescription);
  });

  test('should complete minimal project wizard', async () => {
    const project = wizardTestData.minimalProject;
    
    // Mock successful minimal project creation
    await helpers.mockApiResponse('**/api/wizard/create', {
      success: true,
      projectId: 'minimal-project-123',
      message: 'Minimal project created successfully'
    });
    
    await wizardPage.completeWizard(project);
    
    // Verify wizard completion
    const isComplete = await wizardPage.isWizardComplete();
    expect(isComplete).toBe(true);
  });
});