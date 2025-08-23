import { BuildConfiguration, GeneratedSolution, GeneratedFile, Platform } from '@/types';
import { generateDiscordBot } from './discord';
import { generateTelegramBot } from './telegram';
import { generateWhatsAppBot } from './whatsapp';
import { generateSlackApp } from './slack';
import { generateTwitterBot } from './twitter';
import { generateWebChat } from './webchat';
import { generateCLI } from './cli';

// Main generator function that routes to platform-specific generators
export async function generateSolution(configuration: BuildConfiguration): Promise<GeneratedSolution> {
  if (!configuration.platform) {
    throw new Error('Platform is required for solution generation');
  }

  const generators = {
    'discord-js': generateDiscordBot,
    'telegram-bot-api': generateTelegramBot,
    'whatsapp-web': generateWhatsAppBot,
    'slack-bolt': generateSlackApp,
    'twitter-api': generateTwitterBot,
    'web-chat': generateWebChat,
    'cli-interface': generateCLI,
  };

  const generator = generators[configuration.platform];
  if (!generator) {
    throw new Error(`No generator found for platform: ${configuration.platform}`);
  }

  try {
    const solution = await generator(configuration);
    return solution;
  } catch (error) {
    console.error('Error generating solution:', error);
    throw new Error(`Failed to generate solution: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Utility functions for all generators
export function generateBasePackageJson(config: BuildConfiguration) {
  return {
    name: config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    version: '1.0.0',
    description: config.description,
    main: 'index.js',
    scripts: {
      start: 'node index.js',
      dev: 'nodemon index.js',
      test: 'jest',
      lint: 'eslint .',
      'lint:fix': 'eslint . --fix',
    },
    keywords: ['chat', 'bot', 'session-management', config.platform],
    author: '',
    license: 'MIT',
    devDependencies: {
      nodemon: '^3.0.1',
      eslint: '^8.45.0',
      jest: '^29.6.1',
      '@types/node': '^20.4.5',
      typescript: '^5.1.6',
    },
  };
}

export function generateReadme(config: BuildConfiguration): string {
  const { projectName, description, platform, priorities, features } = config;
  
  return `# ${projectName}

${description}

## Platform
- **${platform}** - Chat session management system

## Features
${priorities.length > 0 ? `
### Core Priorities
${priorities.map(p => `- ${p.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')}
` : ''}

${features.length > 0 ? `
### Additional Features
${features.map(f => `- ${f.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`).join('\n')}
` : ''}

## Quick Start

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy environment file and configure:
\`\`\`bash
cp .env.example .env
# Edit .env with your configuration
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

## Configuration

See \`.env.example\` for required environment variables.

## Project Structure

\`\`\`
${projectName}/
├── src/
│   ├── handlers/          # Message and event handlers
│   ├── middleware/        # Authentication and validation
│   ├── services/          # Business logic services
│   ├── utils/             # Utility functions
│   └── index.js           # Application entry point
├── tests/                 # Test files
├── docs/                  # Documentation
└── package.json
\`\`\`

## Development

- \`npm run dev\` - Start development server with hot reload
- \`npm test\` - Run test suite
- \`npm run lint\` - Run linter
- \`npm run lint:fix\` - Fix linting issues automatically

## Deployment

[Add deployment instructions specific to your platform]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details.
`;
}

export function generateEnvExample(config: BuildConfiguration): string {
  const { platform, priorities, features } = config;
  
  let envContent = `# ${config.projectName} Environment Configuration\n\n`;
  
  // Platform-specific environment variables
  switch (platform) {
    case 'discord-js':
      envContent += `# Discord Configuration\nDISCORD_TOKEN=your_discord_bot_token\nDISCORD_CLIENT_ID=your_client_id\n\n`;
      break;
    case 'telegram-bot-api':
      envContent += `# Telegram Configuration\nTELEGRAM_TOKEN=your_telegram_bot_token\n\n`;
      break;
    case 'slack-bolt':
      envContent += `# Slack Configuration\nSLACK_BOT_TOKEN=xoxb-your-token\nSLACK_SIGNING_SECRET=your_signing_secret\n\n`;
      break;
    case 'twitter-api':
      envContent += `# Twitter API Configuration\nTWITTER_CONSUMER_KEY=your_consumer_key\nTWITTER_CONSUMER_SECRET=your_consumer_secret\nTWITTER_ACCESS_TOKEN=your_access_token\nTWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret\n\n`;
      break;
    default:
      envContent += `# API Configuration\nAPI_TOKEN=your_api_token\n\n`;
  }
  
  // Database configuration for message persistence
  if (priorities.includes('message-persistence')) {
    envContent += `# Database Configuration\nDATABASE_URL=mongodb://localhost:27017/${config.projectName.toLowerCase()}\n# or for PostgreSQL:\n# DATABASE_URL=postgresql://user:password@localhost:5432/${config.projectName.toLowerCase()}\n\n`;
  }
  
  // Redis for session management and caching
  if (priorities.includes('session-management') || priorities.includes('real-time-sync')) {
    envContent += `# Redis Configuration\nREDIS_URL=redis://localhost:6379\n\n`;
  }
  
  // Rate limiting configuration
  if (priorities.includes('rate-limiting')) {
    envContent += `# Rate Limiting\nRATE_LIMIT_MAX_REQUESTS=100\nRATE_LIMIT_WINDOW_MS=900000\n\n`;
  }
  
  // Analytics and logging
  if (priorities.includes('analytics-logging')) {
    envContent += `# Logging & Analytics\nLOG_LEVEL=info\nANALYTICS_ENDPOINT=https://your-analytics-service.com\n\n`;
  }
  
  // AI integration
  if (features.includes('ai-integration')) {
    envContent += `# AI Integration\nOPENAI_API_KEY=your_openai_api_key\n# or for other AI services:\n# AI_SERVICE_URL=https://your-ai-service.com\n# AI_SERVICE_KEY=your_ai_service_key\n\n`;
  }
  
  // Webhook configuration
  if (features.includes('webhooks')) {
    envContent += `# Webhook Configuration\nWEBHOOK_SECRET=your_webhook_secret\nWEBHOOK_URL=https://your-domain.com/webhook\n\n`;
  }
  
  // General configuration
  envContent += `# General Configuration\nPORT=3000\nNODE_ENV=development\n`;
  
  return envContent;
}

export function generateGitignore(): string {
  return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Temporary files
tmp/
temp/

# Database
*.db
*.sqlite
*.sqlite3

# Session files
sessions/

# Upload directories
uploads/
`;
}

export function generateDockerfile(config: BuildConfiguration): string {
  return `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S ${config.projectName.toLowerCase()} -u 1001

# Change ownership
RUN chown -R ${config.projectName.toLowerCase()}:nodejs /app
USER ${config.projectName.toLowerCase()}

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]
`;
}

export function generateDockerCompose(config: BuildConfiguration): string {
  let services = `version: '3.8'

services:
  ${config.projectName.toLowerCase()}:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:`;

  const dependencies: string[] = [];
  
  if (config.priorities.includes('message-persistence')) {
    dependencies.push('mongodb');
    services += `
      - mongodb`;
  }
  
  if (config.priorities.includes('session-management') || config.priorities.includes('real-time-sync')) {
    dependencies.push('redis');
    services += `
      - redis`;
  }
  
  services += `
    restart: unless-stopped

`;

  // Add database services
  if (config.priorities.includes('message-persistence')) {
    services += `  mongodb:
    image: mongo:7
    environment:
      MONGO_INITDB_DATABASE: ${config.projectName.toLowerCase()}
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    restart: unless-stopped

`;
  }
  
  if (config.priorities.includes('session-management') || config.priorities.includes('real-time-sync')) {
    services += `  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped

`;
  }
  
  // Add volumes
  services += `volumes:`;
  if (config.priorities.includes('message-persistence')) {
    services += `
  mongodb_data:`;
  }
  if (config.priorities.includes('session-management') || config.priorities.includes('real-time-sync')) {
    services += `
  redis_data:`;
  }
  
  return services;
}