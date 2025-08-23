# Development Specifications for Chat Session Management Builder

## Overview

This document provides detailed implementation specifications for development agents to build the Chat Session Management Builder application. Each section contains specific tasks, file structures, interfaces, and implementation requirements.

## 1. Project Setup Specifications

### 1.1 Root Configuration Files

**package.json (Root)**
```json
{
  "name": "chat-session-mgmt-builder",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:server\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build": "npm run build:frontend && npm run build:server",
    "build:frontend": "cd frontend && npm run build",
    "build:server": "cd server && npm run build",
    "test": "npm run test:frontend && npm run test:server",
    "test:frontend": "cd frontend && npm run test",
    "test:server": "cd server && npm run test",
    "lint": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "npm run typecheck:frontend && npm run typecheck:server",
    "typecheck:frontend": "cd frontend && npm run typecheck",
    "typecheck:server": "cd server && npm run typecheck"
  },
  "workspaces": ["frontend", "server", "shared"],
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "concurrently": "^8.2.2",
    "eslint": "^8.57.0",
    "prettier": "^3.0.0",
    "husky": "^8.0.3",
    "lint-staged": "^14.0.1"
  }
}
```

**ESLint Configuration (.eslintrc.js)**
```javascript
module.exports = {
  root: true,
  extends: [
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn'
  },
  ignorePatterns: ['dist/', 'build/', 'node_modules/']
};
```

### 1.2 Shared Types Package

**shared/package.json**
```json
{
  "name": "@chat-builder/shared",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

**shared/src/types/index.ts**
```typescript
// Platform Types
export type PlatformId = 'notion' | 'airtable' | 'sheets' | 'excel' | 'obsidian' | 'logseq' | 'custom';
export type PriorityId = 'organization' | 'search' | 'analytics' | 'collaboration' | 'automation' | 'simplicity' | 'portability' | 'integration';
export type FeatureId = 'tags' | 'projects' | 'timeline' | 'templates' | 'reminders' | 'exports' | 'dashboard' | 'archive';
export type ComplexityId = 'simple' | 'moderate' | 'advanced';
export type TeamSizeOption = '' | 'Just me' | '2-5 people' | '6-20 people' | '20+ people';

// Core Configuration Interface
export interface Configuration {
  platform: PlatformId | '';
  priorities: PriorityId[];
  features: FeatureId[];
  teamSize: TeamSizeOption;
  complexity: ComplexityId | '';
  customizations?: CustomizationOptions;
}

export interface CustomizationOptions {
  colorScheme?: string;
  namingConvention?: string;
  timezone?: string;
  language?: string;
  dateFormat?: string;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// Platform Definitions
export interface Platform {
  id: PlatformId;
  name: string;
  description: string;
  capabilities: PlatformCapabilities;
  pricing: PlatformPricing;
}

export interface PlatformCapabilities {
  automation: boolean;
  api: boolean;
  collaboration: boolean;
  customFields: boolean;
  relations: boolean;
  views: boolean;
  formulas: boolean;
}

export interface PlatformPricing {
  free: boolean;
  paid: string[];
}

// Solution Generation Types
export interface GeneratedSolution {
  content: string;
  metadata: SolutionMetadata;
  setupInstructions: string[];
  estimatedTime: string;
  complexity: ComplexityId;
}

export interface SolutionMetadata {
  platform: PlatformId;
  generatedAt: string;
  version: string;
  configurationHash: string;
}

// Provisioning Types
export interface ProvisionRequest {
  platform: PlatformId;
  config: Configuration;
  options: ProvisioningOptions;
}

export interface ProvisioningOptions {
  createSampleData?: boolean;
  setupAutomation?: boolean;
  customTemplate?: string;
}

export interface ProvisionResponse {
  success: boolean;
  resourceUrl?: string;
  resourceId?: string;
  setupStatus: 'pending' | 'in-progress' | 'completed' | 'failed';
  error?: ProvisioningError;
}

export interface ProvisioningError {
  code: string;
  message: string;
  details?: string;
  retryable: boolean;
}
```

## 2. Frontend Development Specifications

### 2.1 Frontend Package Configuration

**frontend/package.json**
```json
{
  "name": "@chat-builder/frontend",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.45.0",
    "react-error-boundary": "^4.0.11",
    "lucide-react": "^0.263.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0",
    "zod": "^3.21.4",
    "dompurify": "^3.0.3",
    "@hookform/resolvers": "^3.1.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.6",
    "@types/dompurify": "^3.0.2",
    "@vitejs/plugin-react": "^4.0.1",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.0.2",
    "vite": "^4.4.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0"
  }
}
```

**frontend/vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../shared/src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
```

### 2.2 React Component Specifications

**Main Application Component (src/App.tsx)**
```typescript
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { WizardProvider } from '@/context/WizardContext';
import { ToastProvider } from '@/context/ToastContext';
import WizardContainer from '@/components/wizard/WizardContainer';
import ErrorFallback from '@/components/layout/ErrorFallback';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function App(): React.ReactElement {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ToastProvider>
        <WizardProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <WizardContainer />
            </main>
            <Footer />
          </div>
        </WizardProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
```

**Wizard Context Provider (src/context/WizardContext.tsx)**
```typescript
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Configuration } from '@shared/types';

interface WizardState {
  currentStep: number;
  config: Configuration;
  generatedSolution: string;
  implementationResult: string;
  errors: Record<string, string[]>;
  isLoading: boolean;
  history: StateSnapshot[];
}

interface StateSnapshot {
  step: number;
  config: Configuration;
  timestamp: number;
}

type WizardAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_CONFIG'; payload: Partial<Configuration> }
  | { type: 'SET_SOLUTION'; payload: string }
  | { type: 'SET_IMPLEMENTATION'; payload: string }
  | { type: 'SET_ERRORS'; payload: Record<string, string[]> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SAVE_SNAPSHOT' }
  | { type: 'RESTORE_SNAPSHOT'; payload: number }
  | { type: 'RESET_WIZARD' };

const initialState: WizardState = {
  currentStep: 1,
  config: {
    platform: '',
    priorities: [],
    features: [],
    teamSize: '',
    complexity: ''
  },
  generatedSolution: '',
  implementationResult: '',
  errors: {},
  isLoading: false,
  history: []
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'UPDATE_CONFIG':
      const newConfig = { ...state.config, ...action.payload };
      return { ...state, config: newConfig };
    
    case 'SET_SOLUTION':
      return { ...state, generatedSolution: action.payload };
    
    case 'SET_IMPLEMENTATION':
      return { ...state, implementationResult: action.payload };
    
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SAVE_SNAPSHOT':
      const snapshot: StateSnapshot = {
        step: state.currentStep,
        config: state.config,
        timestamp: Date.now()
      };
      return {
        ...state,
        history: [...state.history, snapshot].slice(-10) // Keep last 10 snapshots
      };
    
    case 'RESTORE_SNAPSHOT':
      const targetSnapshot = state.history[action.payload];
      if (targetSnapshot) {
        return {
          ...state,
          currentStep: targetSnapshot.step,
          config: targetSnapshot.config
        };
      }
      return state;
    
    case 'RESET_WIZARD':
      return initialState;
    
    default:
      return state;
  }
}

interface WizardContextType {
  state: WizardState;
  dispatch: React.Dispatch<WizardAction>;
  goToStep: (step: number) => void;
  updateConfig: (updates: Partial<Configuration>) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatBuilderWizard');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'SET_STEP', payload: parsedState.currentStep || 1 });
        dispatch({ type: 'UPDATE_CONFIG', payload: parsedState.config || {} });
      } catch (error) {
        console.warn('Failed to load saved wizard state:', error);
      }
    }
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    const stateToSave = {
      currentStep: state.currentStep,
      config: state.config,
      timestamp: Date.now()
    };
    localStorage.setItem('chatBuilderWizard', JSON.stringify(stateToSave));
  }, [state.currentStep, state.config]);

  const goToStep = (step: number): void => {
    if (step >= 1 && step <= 8) {
      dispatch({ type: 'SAVE_SNAPSHOT' });
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };

  const updateConfig = (updates: Partial<Configuration>): void => {
    dispatch({ type: 'UPDATE_CONFIG', payload: updates });
  };

  const nextStep = (): void => {
    if (state.currentStep < 8) {
      goToStep(state.currentStep + 1);
    }
  };

  const previousStep = (): void => {
    if (state.currentStep > 1) {
      goToStep(state.currentStep - 1);
    }
  };

  const resetWizard = (): void => {
    localStorage.removeItem('chatBuilderWizard');
    dispatch({ type: 'RESET_WIZARD' });
  };

  const value: WizardContextType = {
    state,
    dispatch,
    goToStep,
    updateConfig,
    nextStep,
    previousStep,
    resetWizard
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard(): WizardContextType {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
```

**Wizard Container Component (src/components/wizard/WizardContainer.tsx)**
```typescript
import React, { Suspense, lazy } from 'react';
import { useWizard } from '@/context/WizardContext';
import StepProgress from '@/components/wizard/StepProgress';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy load step components for better performance
const Step1Platform = lazy(() => import('@/components/wizard/steps/Step1Platform'));
const Step2Priorities = lazy(() => import('@/components/wizard/steps/Step2Priorities'));
const Step3Features = lazy(() => import('@/components/wizard/steps/Step3Features'));
const Step4TeamComplexity = lazy(() => import('@/components/wizard/steps/Step4TeamComplexity'));
const Step5Review = lazy(() => import('@/components/wizard/steps/Step5Review'));
const Step6Solution = lazy(() => import('@/components/wizard/steps/Step6Solution'));
const Step7AutoSetup = lazy(() => import('@/components/wizard/steps/Step7AutoSetup'));
const Step8Done = lazy(() => import('@/components/wizard/steps/Step8Done'));

const stepComponents = {
  1: Step1Platform,
  2: Step2Priorities,
  3: Step3Features,
  4: Step4TeamComplexity,
  5: Step5Review,
  6: Step6Solution,
  7: Step7AutoSetup,
  8: Step8Done
};

export default function WizardContainer(): React.ReactElement {
  const { state } = useWizard();
  const CurrentStepComponent = stepComponents[state.currentStep as keyof typeof stepComponents];

  return (
    <div className="max-w-4xl mx-auto">
      <StepProgress currentStep={state.currentStep} totalSteps={8} />
      
      <div className="bg-white rounded-lg shadow-xl p-8 mt-8">
        <Suspense fallback={<LoadingSpinner message="Loading step..." />}>
          <CurrentStepComponent />
        </Suspense>
      </div>
    </div>
  );
}
```

### 2.3 Step Component Specifications

**Base Step Interface (src/types/wizard.ts)**
```typescript
import type { Configuration } from '@shared/types';

export interface StepProps {
  // Props are handled through context, so no direct props needed
}

export interface StepComponentInfo {
  stepNumber: number;
  title: string;
  description: string;
  validateStep: (config: Configuration) => Promise<ValidationResult>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
```

**Step 1 - Platform Selection (src/components/wizard/steps/Step1Platform.tsx)**
```typescript
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import { platforms } from '@/utils/constants';
import Button from '@/components/common/Button';
import NavigationButtons from '@/components/wizard/NavigationButtons';
import type { PlatformId } from '@shared/types';

export default function Step1Platform(): React.ReactElement {
  const { state, updateConfig, nextStep } = useWizard();

  const handlePlatformSelect = (platformId: PlatformId): void => {
    updateConfig({ platform: platformId });
  };

  const handleNext = (): void => {
    if (state.config.platform) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Platform
        </h2>
        <p className="text-gray-600">
          Select the platform where you'd like to build your chat session management system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handlePlatformSelect(platform.id)}
            className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-md ${
              state.config.platform === platform.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <h3 className="font-semibold text-lg mb-2">{platform.name}</h3>
            <p className="text-gray-600 text-sm">{platform.description}</p>
          </button>
        ))}
      </div>

      {!state.config.platform && (
        <div className="text-center text-red-600">
          Please select a platform to continue.
        </div>
      )}

      <NavigationButtons
        onNext={handleNext}
        nextDisabled={!state.config.platform}
        showPrevious={false}
      />
    </div>
  );
}
```

### 2.4 Service Layer Specifications

**API Client (src/services/api.ts)**
```typescript
import type { Configuration, APIResponse, ValidationResult, GeneratedSolution, ProvisionRequest, ProvisionResponse } from '@shared/types';

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = '/api/v1') {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(data.error || 'Request failed', response.status, data.code);
    }

    return data;
  }

  async validateConfig(config: Configuration, step: number): Promise<ValidationResult> {
    const response = await this.request<ValidationResult>('/config/validate', {
      method: 'POST',
      body: JSON.stringify({ config, step }),
    });
    return response.data!;
  }

  async generateSolution(config: Configuration): Promise<GeneratedSolution> {
    const response = await this.request<GeneratedSolution>('/solution/generate', {
      method: 'POST',
      body: JSON.stringify({ config }),
    });
    return response.data!;
  }

  async provisionPlatform(request: ProvisionRequest): Promise<ProvisionResponse> {
    const response = await this.request<ProvisionResponse>(`/provision/${request.platform}`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
    return response.data!;
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const apiClient = new APIClient();
```

## 3. Backend Development Specifications

### 3.1 Backend Package Configuration

**server/package.json**
```json
{
  "name": "@chat-builder/server",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^4.18.2",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^6.7.1",
    "joi": "^17.9.2",
    "winston": "^3.10.0",
    "@notionhq/client": "^2.2.8",
    "airtable": "^0.12.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/cors": "^2.8.13",
    "@types/node": "^20.4.2",
    "typescript": "^5.0.2",
    "tsx": "^3.12.7",
    "jest": "^29.5.0",
    "@types/jest": "^29.5.2",
    "supertest": "^6.3.3",
    "@types/supertest": "^2.0.12"
  }
}
```

**Express Application (server/src/app.ts)**
```typescript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logging.js';
import routes from './routes/index.js';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGINS,
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(requestLogger);

// Routes
app.use('/', routes);

// Error handling
app.use(errorHandler);

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
```

### 3.2 Controller Specifications

**Provisioning Controller (server/src/controllers/provisionController.ts)**
```typescript
import { Request, Response, NextFunction } from 'express';
import { notionService } from '../services/platforms/notionService.js';
import { airtableService } from '../services/platforms/airtableService.js';
import { logger } from '../utils/logger.js';
import type { ProvisionRequest, ProvisionResponse } from '@shared/types';

export class ProvisionController {
  async provisionNotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: ProvisionRequest & { parentPageId: string } = req.body;
      
      logger.info('Starting Notion provisioning', { 
        platform: request.platform,
        parentPageId: request.parentPageId 
      });

      const result = await notionService.createDatabase(
        request.parentPageId,
        request.config
      );

      const response: ProvisionResponse = {
        success: true,
        resourceUrl: result.url,
        resourceId: result.id,
        setupStatus: 'completed'
      };

      logger.info('Notion provisioning completed', { 
        databaseId: result.id,
        url: result.url 
      });

      res.json(response);
    } catch (error) {
      logger.error('Notion provisioning failed', error);
      next(error);
    }
  }

  async provisionAirtable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const request: ProvisionRequest & { baseId: string; seedSample?: boolean } = req.body;
      
      logger.info('Starting Airtable provisioning', { 
        platform: request.platform,
        baseId: request.baseId 
      });

      const result = await airtableService.setupBase(
        request.baseId,
        request.config,
        request.seedSample
      );

      const response: ProvisionResponse = {
        success: true,
        resourceUrl: result.url,
        resourceId: result.baseId,
        setupStatus: 'completed'
      };

      logger.info('Airtable provisioning completed', { 
        baseId: result.baseId,
        url: result.url 
      });

      res.json(response);
    } catch (error) {
      logger.error('Airtable provisioning failed', error);
      next(error);
    }
  }
}

export const provisionController = new ProvisionController();
```

### 3.3 Service Layer Specifications

**Notion Service (server/src/services/platforms/notionService.ts)**
```typescript
import { Client } from '@notionhq/client';
import { config } from '../../utils/config.js';
import { logger } from '../../utils/logger.js';
import type { Configuration } from '@shared/types';

interface NotionDatabaseResult {
  id: string;
  url: string;
  properties: Record<string, any>;
  views: string[];
}

export class NotionService {
  private client: Client;

  constructor() {
    if (!config.NOTION_TOKEN) {
      throw new Error('NOTION_TOKEN is required');
    }
    this.client = new Client({ auth: config.NOTION_TOKEN });
  }

  async createDatabase(parentPageId: string, configuration: Configuration): Promise<NotionDatabaseResult> {
    try {
      // Generate properties based on configuration
      const properties = this.generateProperties(configuration);
      
      // Create database
      const database = await this.client.databases.create({
        parent: { page_id: parentPageId },
        title: [
          {
            type: 'text',
            text: { content: 'Chat Sessions' }
          }
        ],
        properties
      });

      // Create views based on configuration
      const views = await this.createViews(database.id, configuration);

      logger.info('Notion database created successfully', {
        databaseId: database.id,
        parentPageId,
        propertiesCount: Object.keys(properties).length
      });

      return {
        id: database.id,
        url: database.url,
        properties,
        views
      };
    } catch (error) {
      logger.error('Failed to create Notion database', {
        parentPageId,
        error: error.message
      });
      throw new Error(`Notion database creation failed: ${error.message}`);
    }
  }

  private generateProperties(config: Configuration): Record<string, any> {
    const baseProperties = {
      'Title': { title: {} },
      'Platform': {
        select: {
          options: [
            { name: 'ChatGPT', color: 'green' },
            { name: 'Claude', color: 'blue' },
            { name: 'Gemini', color: 'orange' },
            { name: 'Other', color: 'gray' }
          ]
        }
      },
      'Status': {
        select: {
          options: [
            { name: 'Active', color: 'green' },
            { name: 'On Hold', color: 'yellow' },
            { name: 'Completed', color: 'blue' },
            { name: 'Archived', color: 'gray' }
          ]
        }
      },
      'Created': { created_time: {} },
      'Updated': { last_edited_time: {} },
      'Summary': { rich_text: {} },
      'Key Insights': { rich_text: {} },
      'Action Items': { rich_text: {} },
      'Follow-up Date': { date: {} },
      'Notes': { rich_text: {} }
    };

    // Add properties based on selected features
    if (config.features.includes('projects')) {
      baseProperties['Project'] = {
        relation: {
          database_id: '', // Would be set to projects database
          type: 'single_property',
          single_property: {}
        }
      };
      baseProperties['Project Phase'] = {
        select: {
          options: [
            { name: 'Planning', color: 'yellow' },
            { name: 'Development', color: 'blue' },
            { name: 'Testing', color: 'orange' },
            { name: 'Deployment', color: 'green' },
            { name: 'Maintenance', color: 'gray' }
          ]
        }
      };
    }

    if (config.features.includes('tags')) {
      baseProperties['Tags'] = {
        multi_select: {
          options: [
            { name: 'Work', color: 'blue' },
            { name: 'Personal', color: 'green' },
            { name: 'Learning', color: 'orange' },
            { name: 'Research', color: 'purple' },
            { name: 'Urgent', color: 'red' },
            { name: 'Follow-up', color: 'yellow' }
          ]
        }
      };
      baseProperties['Priority'] = {
        select: {
          options: [
            { name: 'High', color: 'red' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'green' }
          ]
        }
      };
    }

    if (config.priorities.includes('analytics')) {
      baseProperties['Duration'] = { number: { format: 'number' } };
      baseProperties['Message Count'] = { number: { format: 'number' } };
      baseProperties['Satisfaction'] = {
        select: {
          options: [
            { name: 'Excellent', color: 'green' },
            { name: 'Good', color: 'blue' },
            { name: 'Average', color: 'yellow' },
            { name: 'Poor', color: 'red' }
          ]
        }
      };
      baseProperties['Value Rating'] = {
        select: {
          options: [
            { name: 'Very High', color: 'green' },
            { name: 'High', color: 'blue' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'red' }
          ]
        }
      };
    }

    if (config.priorities.includes('organization')) {
      baseProperties['Primary Topic'] = {
        select: {
          options: [
            { name: 'Development', color: 'blue' },
            { name: 'Design', color: 'purple' },
            { name: 'Business', color: 'green' },
            { name: 'Research', color: 'orange' },
            { name: 'Personal', color: 'pink' }
          ]
        }
      };
      baseProperties['Secondary Topics'] = {
        multi_select: {
          options: [
            { name: 'Frontend', color: 'blue' },
            { name: 'Backend', color: 'green' },
            { name: 'Database', color: 'orange' },
            { name: 'DevOps', color: 'red' },
            { name: 'Testing', color: 'yellow' }
          ]
        }
      };
      baseProperties['Category'] = {
        select: {
          options: [
            { name: 'Work', color: 'blue' },
            { name: 'Personal', color: 'green' },
            { name: 'Learning', color: 'orange' },
            { name: 'Research', color: 'purple' }
          ]
        }
      };
    }

    return baseProperties;
  }

  private async createViews(databaseId: string, config: Configuration): Promise<string[]> {
    // Note: Notion API doesn't currently support creating custom views
    // This would return the names of views that would be manually created
    const baseViews = [
      'All Sessions',
      'Recent',
      'Active Sessions',
      'Completed Sessions'
    ];

    if (config.priorities.includes('organization')) {
      baseViews.push('By Topic', 'By Category');
    }

    if (config.features.includes('projects')) {
      baseViews.push('By Project', 'Project Timeline');
    }

    if (config.features.includes('timeline')) {
      baseViews.push('Timeline View', 'Calendar View');
    }

    return baseViews;
  }
}

export const notionService = new NotionService();
```

This comprehensive development specification provides detailed implementation guidelines for creating the Chat Session Management Builder application. Each component includes TypeScript interfaces, implementation patterns, error handling, and integration requirements that development agents can follow to build a production-ready application.