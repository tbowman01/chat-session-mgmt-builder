import { PlatformConfig, SelectionOption, Platform, Priority, Feature, TeamSize, Complexity } from './index';

// Platform configurations
export const PLATFORMS: Record<Platform, PlatformConfig> = {
  'discord-js': {
    name: 'discord-js',
    displayName: 'Discord Bot',
    icon: '🎮',
    description: 'Build Discord bots with powerful slash commands and server management',
    requirements: ['Node.js 16+', 'Discord Developer Account', 'Bot Token'],
    estimatedTime: '2-4 hours',
    complexity: 'intermediate',
    supportedFeatures: ['conversation-branching', 'context-awareness', 'custom-commands', 'webhooks', 'ai-integration'],
    defaultPriorities: ['session-management', 'real-time-sync', 'error-handling']
  },
  'telegram-bot-api': {
    name: 'telegram-bot-api',
    displayName: 'Telegram Bot',
    icon: '✈️',
    description: 'Create Telegram bots with inline keyboards and file handling',
    requirements: ['Node.js 16+', 'Telegram Bot Token from @BotFather'],
    estimatedTime: '1-3 hours',
    complexity: 'basic',
    supportedFeatures: ['file-attachments', 'custom-commands', 'ai-integration', 'multi-language'],
    defaultPriorities: ['message-persistence', 'session-management', 'rate-limiting']
  },
  'whatsapp-web': {
    name: 'whatsapp-web',
    displayName: 'WhatsApp Bot',
    icon: '📱',
    description: 'WhatsApp automation using web interface',
    requirements: ['Node.js 16+', 'Chrome/Chromium', 'WhatsApp Account'],
    estimatedTime: '3-5 hours',
    complexity: 'advanced',
    supportedFeatures: ['file-attachments', 'context-awareness', 'backup-restore'],
    defaultPriorities: ['message-persistence', 'session-management', 'error-handling', 'scalability']
  },
  'slack-bolt': {
    name: 'slack-bolt',
    displayName: 'Slack App',
    icon: '💼',
    description: 'Enterprise Slack applications with Bolt framework',
    requirements: ['Node.js 16+', 'Slack App Configuration', 'Workspace Admin Access'],
    estimatedTime: '4-6 hours',
    complexity: 'advanced',
    supportedFeatures: ['conversation-branching', 'context-awareness', 'custom-commands', 'webhooks', 'ai-integration', 'analytics-logging'],
    defaultPriorities: ['user-authentication', 'real-time-sync', 'analytics-logging', 'scalability']
  },
  'twitter-api': {
    name: 'twitter-api',
    displayName: 'Twitter Bot',
    icon: '🐦',
    description: 'Twitter automation and engagement bot',
    requirements: ['Node.js 16+', 'Twitter Developer Account', 'API Keys'],
    estimatedTime: '2-4 hours',
    complexity: 'intermediate',
    supportedFeatures: ['ai-integration', 'analytics-logging', 'rate-limiting'],
    defaultPriorities: ['rate-limiting', 'analytics-logging', 'error-handling']
  },
  'web-chat': {
    name: 'web-chat',
    displayName: 'Web Chat Widget',
    icon: '💬',
    description: 'Embeddable web chat interface with real-time messaging',
    requirements: ['Node.js 16+', 'Socket.io', 'Web Server'],
    estimatedTime: '4-8 hours',
    complexity: 'expert',
    supportedFeatures: ['conversation-branching', 'context-awareness', 'multi-language', 'file-attachments', 'ai-integration', 'backup-restore'],
    defaultPriorities: ['real-time-sync', 'user-authentication', 'message-persistence', 'scalability']
  },
  'cli-interface': {
    name: 'cli-interface',
    displayName: 'CLI Tool',
    icon: '⌨️',
    description: 'Command-line interface for chat session management',
    requirements: ['Node.js 16+', 'Terminal/Command Prompt'],
    estimatedTime: '1-2 hours',
    complexity: 'basic',
    supportedFeatures: ['custom-commands', 'backup-restore', 'context-awareness'],
    defaultPriorities: ['session-management', 'error-handling']
  }
};

// Selection options for different steps
export const PLATFORM_OPTIONS: SelectionOption<Platform>[] = Object.entries(PLATFORMS).map(([key, config]) => ({
  value: key as Platform,
  label: config.displayName,
  description: config.description,
  icon: config.icon
}));

export const PRIORITY_OPTIONS: SelectionOption<Priority>[] = [
  {
    value: 'message-persistence',
    label: 'Message Persistence',
    description: 'Store and retrieve chat messages reliably',
    icon: '💾',
    recommended: true
  },
  {
    value: 'session-management',
    label: 'Session Management',
    description: 'Handle user sessions and context switching',
    icon: '🔄',
    recommended: true
  },
  {
    value: 'user-authentication',
    label: 'User Authentication',
    description: 'Secure user identification and authorization',
    icon: '🔐'
  },
  {
    value: 'real-time-sync',
    label: 'Real-time Sync',
    description: 'Live message synchronization across clients',
    icon: '⚡',
    recommended: true
  },
  {
    value: 'analytics-logging',
    label: 'Analytics & Logging',
    description: 'Track usage patterns and system events',
    icon: '📊'
  },
  {
    value: 'rate-limiting',
    label: 'Rate Limiting',
    description: 'Prevent abuse and manage API quotas',
    icon: '🚦'
  },
  {
    value: 'error-handling',
    label: 'Error Handling',
    description: 'Robust error recovery and reporting',
    icon: '🛡️',
    recommended: true
  },
  {
    value: 'scalability',
    label: 'Scalability',
    description: 'Handle increasing load and users',
    icon: '📈'
  }
];

export const FEATURE_OPTIONS: SelectionOption<Feature>[] = [
  {
    value: 'conversation-branching',
    label: 'Conversation Branching',
    description: 'Support multiple conversation threads',
    icon: '🌳'
  },
  {
    value: 'context-awareness',
    label: 'Context Awareness',
    description: 'Remember conversation history and context',
    icon: '🧠'
  },
  {
    value: 'multi-language',
    label: 'Multi-language Support',
    description: 'International language support',
    icon: '🌍'
  },
  {
    value: 'file-attachments',
    label: 'File Attachments',
    description: 'Upload and share files in conversations',
    icon: '📎'
  },
  {
    value: 'custom-commands',
    label: 'Custom Commands',
    description: 'Define custom bot commands and responses',
    icon: '⚙️'
  },
  {
    value: 'webhooks',
    label: 'Webhooks Integration',
    description: 'Connect with external services via webhooks',
    icon: '🔗'
  },
  {
    value: 'ai-integration',
    label: 'AI Integration',
    description: 'Integrate with AI services for smart responses',
    icon: '🤖'
  },
  {
    value: 'backup-restore',
    label: 'Backup & Restore',
    description: 'Data backup and recovery capabilities',
    icon: '💿'
  }
];

export const TEAM_SIZE_OPTIONS: SelectionOption<TeamSize>[] = [
  {
    value: 'solo',
    label: 'Solo Developer',
    description: 'Individual developer working alone',
    icon: '👤'
  },
  {
    value: 'small',
    label: 'Small Team (2-5)',
    description: 'Small development team',
    icon: '👥'
  },
  {
    value: 'medium',
    label: 'Medium Team (6-15)',
    description: 'Medium-sized development team',
    icon: '👨‍👩‍👧‍👦'
  },
  {
    value: 'large',
    label: 'Large Team (16-50)',
    description: 'Large development organization',
    icon: '🏢'
  },
  {
    value: 'enterprise',
    label: 'Enterprise (50+)',
    description: 'Enterprise-level organization',
    icon: '🏙️'
  }
];

export const COMPLEXITY_OPTIONS: SelectionOption<Complexity>[] = [
  {
    value: 'basic',
    label: 'Basic',
    description: 'Simple setup with essential features',
    icon: '🟢'
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'Moderate complexity with additional features',
    icon: '🟡'
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Complex setup with enterprise features',
    icon: '🟠'
  },
  {
    value: 'expert',
    label: 'Expert',
    description: 'Full-featured, production-ready solution',
    icon: '🔴'
  }
];

// Validation rules
export const VALIDATION_RULES = {
  PRIORITIES: {
    MIN: 2,
    MAX: 4
  },
  FEATURES: {
    MIN: 0,
    MAX: 8
  },
  PROJECT_NAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9\-_\s]+$/
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500
  }
};

// Step configuration
export const STEPS = [
  { id: 1, title: 'Platform', description: 'Choose your chat platform' },
  { id: 2, title: 'Priorities', description: 'Select key priorities' },
  { id: 3, title: 'Features', description: 'Pick desired features' },
  { id: 4, title: 'Configuration', description: 'Set team & complexity' },
  { id: 5, title: 'Review', description: 'Review your choices' },
  { id: 6, title: 'Generate', description: 'Get your solution' },
  { id: 7, title: 'Setup', description: 'Auto-setup (optional)' },
  { id: 8, title: 'Complete', description: 'You\'re all set!' }
];

export const TOTAL_STEPS = STEPS.length;

// Local storage keys
export const STORAGE_KEYS = {
  CONFIGURATION: 'chat-mgmt-config',
  WIZARD_STATE: 'chat-mgmt-wizard-state',
  ANALYTICS: 'chat-mgmt-analytics'
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  GENERATE: '/api/generate',
  VALIDATE: '/api/validate',
  DOWNLOAD: '/api/download',
  SETUP: '/api/setup'
} as const;