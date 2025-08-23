// Core configuration types
export type Platform = 
  | 'discord-js'
  | 'telegram-bot-api'
  | 'whatsapp-web'
  | 'slack-bolt'
  | 'twitter-api'
  | 'web-chat'
  | 'cli-interface';

export type Priority = 
  | 'message-persistence'
  | 'session-management'
  | 'user-authentication'
  | 'real-time-sync'
  | 'analytics-logging'
  | 'rate-limiting'
  | 'error-handling'
  | 'scalability';

export type Feature = 
  | 'conversation-branching'
  | 'context-awareness'
  | 'multi-language'
  | 'file-attachments'
  | 'custom-commands'
  | 'webhooks'
  | 'ai-integration'
  | 'backup-restore';

export type TeamSize = 'solo' | 'small' | 'medium' | 'large' | 'enterprise';
export type Complexity = 'basic' | 'intermediate' | 'advanced' | 'expert';

export interface BuildConfiguration {
  platform: Platform | null;
  priorities: Priority[];
  features: Feature[];
  teamSize: TeamSize | null;
  complexity: Complexity | null;
  projectName: string;
  description: string;
}

// Step validation interface
export interface StepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Wizard state interface
export interface WizardState extends BuildConfiguration {
  currentStep: number;
  completedSteps: number[];
  isLoading: boolean;
  error: string | null;
  generatedSolution: GeneratedSolution | null;
}

// Generated solution interface
export interface GeneratedSolution {
  platform: Platform;
  files: GeneratedFile[];
  packageJson: Record<string, any>;
  readme: string;
  setupInstructions: string[];
  estimatedTime: string;
  complexity: Complexity;
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'config' | 'source' | 'test' | 'documentation' | 'script';
  description: string;
}

// Platform-specific configuration interfaces
export interface PlatformConfig {
  name: string;
  displayName: string;
  icon: string;
  description: string;
  requirements: string[];
  estimatedTime: string;
  complexity: Complexity;
  supportedFeatures: Feature[];
  defaultPriorities: Priority[];
}

// Component props interfaces
export interface StepperProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  disabled?: boolean;
}

export interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
  canSkip?: boolean;
}

// API interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GenerateRequest {
  configuration: BuildConfiguration;
  options?: {
    includeTests: boolean;
    includeDocumentation: boolean;
    includeDocker: boolean;
    includeCI: boolean;
  };
}

// Error handling
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Utility types
export type SelectionMode = 'single' | 'multiple' | 'required-multiple';

export interface SelectionOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
  recommended?: boolean;
}

// Local storage types
export interface StoredConfiguration {
  configuration: BuildConfiguration;
  timestamp: Date;
  version: string;
}

// Event types for tracking
export interface AnalyticsEvent {
  type: 'step_completed' | 'platform_selected' | 'solution_generated' | 'download_initiated' | 'error_occurred';
  data: Record<string, any>;
  timestamp: Date;
}