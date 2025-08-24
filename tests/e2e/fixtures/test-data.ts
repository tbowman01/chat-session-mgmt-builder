// Test data fixtures for E2E tests

export const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'TestPassword123!',
    name: 'Test User',
    github: {
      username: 'testuser',
      email: process.env.TEST_GITHUB_EMAIL || 'test@example.com'
    },
    google: {
      email: process.env.TEST_GOOGLE_EMAIL || 'test@gmail.com'
    }
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'AdminPassword123!',
    name: 'Admin User',
    role: 'admin'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
    name: 'Invalid User'
  }
};

export const wizardTestData = {
  simpleProject: {
    projectName: 'Test Project',
    projectDescription: 'A test project for E2E testing',
    template: 'basic',
    framework: 'react',
    features: ['authentication', 'database']
  },
  complexProject: {
    projectName: 'Complex Test Project',
    projectDescription: 'A complex project with multiple features for comprehensive testing',
    template: 'advanced',
    framework: 'nextjs',
    features: ['authentication', 'database', 'api', 'testing', 'deployment']
  },
  minimalProject: {
    projectName: 'Minimal Project',
    projectDescription: 'Minimal project setup',
    template: 'minimal',
    framework: 'vanilla',
    features: []
  }
};

export const sessionTestData = {
  validSession: {
    id: 'test-session-1',
    name: 'Test Session',
    description: 'Test session for E2E testing',
    settings: {
      theme: 'dark',
      language: 'en',
      notifications: true
    }
  },
  longSession: {
    id: 'test-session-long',
    name: 'Long Running Session',
    description: 'Session for testing long-running operations',
    settings: {
      timeout: 3600000, // 1 hour
      autoSave: true,
      backupInterval: 300000 // 5 minutes
    }
  }
};

export const apiEndpoints = {
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
    github: '/api/auth/github',
    google: '/api/auth/google'
  },
  sessions: {
    create: '/api/sessions',
    list: '/api/sessions',
    get: (id: string) => `/api/sessions/${id}`,
    update: (id: string) => `/api/sessions/${id}`,
    delete: (id: string) => `/api/sessions/${id}`
  },
  wizard: {
    validate: '/api/wizard/validate',
    create: '/api/wizard/create',
    templates: '/api/wizard/templates',
    frameworks: '/api/wizard/frameworks'
  }
};

export const selectors = {
  common: {
    loadingSpinner: '[data-testid="loading-spinner"]',
    errorMessage: '[data-testid="error-message"]',
    successMessage: '[data-testid="success-message"]',
    modal: '[data-testid="modal"]',
    closeButton: '[data-testid="close-button"]'
  },
  auth: {
    loginForm: '[data-testid="login-form"]',
    emailInput: '[data-testid="email-input"]',
    passwordInput: '[data-testid="password-input"]',
    loginButton: '[data-testid="login-button"]',
    logoutButton: '[data-testid="logout-button"]',
    userMenu: '[data-testid="user-menu"]',
    githubButton: '[data-testid="github-login"]',
    googleButton: '[data-testid="google-login"]'
  },
  wizard: {
    container: '[data-testid="wizard-container"]',
    progressBar: '[data-testid="wizard-progress"]',
    nextButton: '[data-testid="wizard-next"]',
    previousButton: '[data-testid="wizard-previous"]',
    finishButton: '[data-testid="wizard-finish"]',
    cancelButton: '[data-testid="wizard-cancel"]',
    stepTitle: '[data-testid="step-title"]',
    projectNameInput: '[data-testid="project-name-input"]',
    projectDescriptionInput: '[data-testid="project-description-input"]'
  }
};

export const testConfig = {
  timeouts: {
    short: 5000,
    medium: 10000,
    long: 30000,
    veryLong: 60000
  },
  retries: {
    authTests: 2,
    wizardTests: 1,
    integrationTests: 3
  },
  browsers: {
    desktop: ['chromium', 'firefox', 'webkit'],
    mobile: ['Mobile Chrome', 'Mobile Safari']
  }
};

export const mockData = {
  githubUser: {
    id: 12345,
    login: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    avatar_url: 'https://github.com/images/avatar.jpg'
  },
  googleUser: {
    id: '67890',
    email: 'test@gmail.com',
    name: 'Test User',
    picture: 'https://google.com/images/avatar.jpg'
  },
  templates: [
    {
      id: 'basic',
      name: 'Basic Template',
      description: 'Simple starter template',
      features: ['basic-ui', 'routing']
    },
    {
      id: 'advanced',
      name: 'Advanced Template',
      description: 'Feature-rich template',
      features: ['advanced-ui', 'state-management', 'testing']
    },
    {
      id: 'minimal',
      name: 'Minimal Template',
      description: 'Bare-bones template',
      features: []
    }
  ],
  frameworks: [
    {
      id: 'react',
      name: 'React',
      version: '18.x',
      description: 'React JavaScript library'
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      version: '14.x',
      description: 'React framework with SSR'
    },
    {
      id: 'vanilla',
      name: 'Vanilla JS',
      version: 'ES2022',
      description: 'Plain JavaScript'
    }
  ]
};