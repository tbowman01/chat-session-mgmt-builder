# API Documentation

## 📋 Overview

The Chat Session Management Builder provides a comprehensive REST API for building, configuring, and generating chat session management systems across multiple platforms.

**Base URL**: `https://tbowman01.github.io/chat-session-mgmt-builder/api`  
**API Version**: v1  
**Authentication**: GitHub OAuth 2.0  
**Content Type**: `application/json`  

## 🔐 Authentication

### OAuth 2.0 Flow

The API uses GitHub OAuth 2.0 for authentication:

1. **Authorization Request**
```
GET https://github.com/login/oauth/authorize
  ?client_id={GITHUB_CLIENT_ID}
  &redirect_uri={REDIRECT_URI}
  &scope=user:email
  &state={RANDOM_STATE}
```

2. **Token Exchange**
```javascript
// Frontend handles token exchange
const response = await fetch('https://github.com/login/oauth/access_token', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: authorizationCode,
  }),
});
```

3. **API Authentication**
```javascript
// Include token in requests
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

## 🏗️ Core Data Models

### BuildConfiguration

```typescript
interface BuildConfiguration {
  platform: Platform;
  priorities: Priority[];
  features: Feature[];
  teamSize: TeamSize;
  complexity: Complexity;
  projectName: string;
  description: string;
}

type Platform = 
  | 'discord-js'
  | 'telegram-bot-api'
  | 'whatsapp-web'
  | 'slack-bolt'
  | 'twitter-api'
  | 'web-chat'
  | 'cli-interface';

type Priority = 
  | 'message-persistence'
  | 'session-management'
  | 'user-authentication'
  | 'real-time-sync'
  | 'error-handling'
  | 'scalability';

type Feature = 
  | 'conversation-branching'
  | 'context-awareness'
  | 'multi-language'
  | 'file-attachments'
  | 'custom-commands'
  | 'webhooks'
  | 'ai-integration'
  | 'backup-restore';

type TeamSize = 'solo' | 'small' | 'medium' | 'large' | 'enterprise';
type Complexity = 'basic' | 'intermediate' | 'advanced' | 'expert';
```

### GeneratedSolution

```typescript
interface GeneratedSolution {
  id: string;
  configuration: BuildConfiguration;
  files: GeneratedFile[];
  metadata: SolutionMetadata;
  createdAt: string;
  updatedAt: string;
}

interface GeneratedFile {
  path: string;
  content: string;
  type: 'source' | 'config' | 'documentation' | 'test' | 'docker';
  description: string;
  language?: string;
  size: number;
}

interface SolutionMetadata {
  totalFiles: number;
  totalLines: number;
  estimatedSetupTime: string;
  platforms: string[];
  dependencies: Record<string, string>;
  scripts: Record<string, string>;
}
```

## 🛣️ API Endpoints

### Health Check

#### GET /health

Check API health and status.

**Request:**
```http
GET /api/v1/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-23T20:00:00.000Z",
  "uptime": 3600,
  "version": "2.0.0",
  "environment": "production"
}
```

### Configuration Management

#### POST /api/v1/build/validate

Validate build configuration before generation.

**Request:**
```http
POST /api/v1/build/validate
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "platform": "discord-js",
  "priorities": ["message-persistence", "session-management"],
  "features": ["custom-commands", "ai-integration"],
  "teamSize": "small",
  "complexity": "intermediate",
  "projectName": "My Discord Bot",
  "description": "A Discord bot for community management"
}
```

**Response:**
```json
{
  "valid": true,
  "warnings": [],
  "suggestions": [
    "Consider adding 'error-handling' priority for production use",
    "The 'webhooks' feature works well with Discord bots"
  ],
  "estimatedTime": "2-4 hours",
  "requiredDependencies": [
    "discord.js@^14.13.0",
    "dotenv@^16.3.1"
  ]
}
```

**Validation Errors:**
```json
{
  "valid": false,
  "errors": [
    {
      "field": "priorities",
      "message": "At least 2 priorities are required",
      "code": "MIN_PRIORITIES"
    },
    {
      "field": "projectName", 
      "message": "Project name cannot be empty",
      "code": "REQUIRED_FIELD"
    }
  ]
}
```

#### POST /api/v1/build/save

Save build configuration for later use.

**Request:**
```http
POST /api/v1/build/save
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "configuration": {
    "platform": "telegram-bot-api",
    "priorities": ["message-persistence", "user-authentication"],
    "features": ["file-attachments", "multi-language"],
    "teamSize": "solo",
    "complexity": "basic",
    "projectName": "Telegram Assistant",
    "description": "Personal assistant bot for Telegram"
  },
  "name": "telegram-assistant-v1"
}
```

**Response:**
```json
{
  "id": "config_1234567890",
  "name": "telegram-assistant-v1",
  "savedAt": "2025-08-23T20:00:00.000Z",
  "url": "/api/v1/build/configurations/config_1234567890"
}
```

#### GET /api/v1/build/configurations

List saved configurations for authenticated user.

**Request:**
```http
GET /api/v1/build/configurations
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "configurations": [
    {
      "id": "config_1234567890",
      "name": "telegram-assistant-v1",
      "platform": "telegram-bot-api",
      "savedAt": "2025-08-23T20:00:00.000Z",
      "lastUsed": "2025-08-23T20:15:00.000Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### Solution Generation

#### POST /api/v1/generate

Generate complete solution from build configuration.

**Request:**
```http
POST /api/v1/generate
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "configuration": {
    "platform": "discord-js",
    "priorities": ["message-persistence", "session-management", "error-handling"],
    "features": ["custom-commands", "ai-integration"],
    "teamSize": "small",
    "complexity": "intermediate",
    "projectName": "Community Bot",
    "description": "Discord bot for community management with AI features"
  },
  "options": {
    "includeTests": true,
    "includeDocker": true,
    "includeDocs": true,
    "format": "zip"
  }
}
```

**Response:**
```json
{
  "id": "solution_abcdef123456",
  "status": "completed",
  "configuration": {
    "platform": "discord-js",
    "priorities": ["message-persistence", "session-management", "error-handling"],
    "features": ["custom-commands", "ai-integration"],
    "teamSize": "small",
    "complexity": "intermediate",
    "projectName": "Community Bot",
    "description": "Discord bot for community management with AI features"
  },
  "files": [
    {
      "path": "package.json",
      "content": "{\n  \"name\": \"community-bot\",\n  \"version\": \"1.0.0\",\n  ...",
      "type": "config",
      "description": "Package configuration with Discord.js dependencies",
      "language": "json",
      "size": 1024
    },
    {
      "path": "index.js",
      "content": "const { Client, GatewayIntentBits } = require('discord.js');...",
      "type": "source", 
      "description": "Main Discord bot application",
      "language": "javascript",
      "size": 4096
    }
  ],
  "metadata": {
    "totalFiles": 12,
    "totalLines": 845,
    "estimatedSetupTime": "2-4 hours",
    "platforms": ["discord-js"],
    "dependencies": {
      "discord.js": "^14.13.0",
      "dotenv": "^16.3.1",
      "@discordjs/rest": "^2.0.1"
    },
    "scripts": {
      "start": "node index.js",
      "dev": "nodemon index.js",
      "test": "jest"
    }
  },
  "createdAt": "2025-08-23T20:00:00.000Z",
  "downloadUrl": "/api/v1/generate/solution_abcdef123456/download"
}
```

**Generation In Progress:**
```json
{
  "id": "solution_abcdef123456",
  "status": "generating",
  "progress": 75,
  "stage": "Creating documentation files",
  "estimatedTimeRemaining": "30 seconds"
}
```

**Generation Errors:**
```json
{
  "error": "GENERATION_FAILED",
  "message": "Failed to generate solution",
  "details": {
    "stage": "file_generation",
    "cause": "Template compilation error in discord.js generator",
    "suggestion": "Try with a simpler feature set or different complexity level"
  }
}
```

#### GET /api/v1/generate/{id}

Get generated solution by ID.

**Request:**
```http
GET /api/v1/generate/solution_abcdef123456
Authorization: Bearer {access_token}
```

**Response:** Same as POST /api/v1/generate success response.

#### GET /api/v1/generate/{id}/download

Download generated solution as ZIP file.

**Request:**
```http
GET /api/v1/generate/solution_abcdef123456/download
Authorization: Bearer {access_token}
```

**Response:**
```http
Content-Type: application/zip
Content-Disposition: attachment; filename="community-bot.zip"
Content-Length: 51200

[Binary ZIP file content]
```

### Integration Services

#### POST /api/v1/integrations/notion/database

Create Notion database for chat session management.

**Request:**
```http
POST /api/v1/integrations/notion/database
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "title": "Chat Sessions Database",
  "configuration": {
    "platform": "discord-js",
    "features": ["message-persistence", "session-management"]
  },
  "schema": {
    "sessionId": "title",
    "userId": "rich_text",
    "platform": "select",
    "messages": "rich_text",
    "createdAt": "created_time",
    "updatedAt": "last_edited_time"
  }
}
```

**Response:**
```json
{
  "id": "database_notion_12345",
  "notionId": "1234567890abcdef",
  "title": "Chat Sessions Database", 
  "url": "https://notion.so/1234567890abcdef",
  "createdAt": "2025-08-23T20:00:00.000Z",
  "schema": {
    "sessionId": {
      "id": "title",
      "type": "title"
    },
    "userId": {
      "id": "userId", 
      "type": "rich_text"
    }
  }
}
```

#### GET /api/v1/integrations/notion/databases

List user's Notion databases.

**Request:**
```http
GET /api/v1/integrations/notion/databases
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "databases": [
    {
      "id": "1234567890abcdef",
      "title": "Chat Sessions Database",
      "url": "https://notion.so/1234567890abcdef", 
      "createdTime": "2025-08-23T20:00:00.000Z",
      "lastEditedTime": "2025-08-23T20:15:00.000Z"
    }
  ],
  "total": 1
}
```

#### POST /api/v1/integrations/airtable/base

Create Airtable base for chat session management.

**Request:**
```http
POST /api/v1/integrations/airtable/base
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "name": "Chat Sessions Base",
  "configuration": {
    "platform": "telegram-bot-api", 
    "features": ["user-authentication", "message-persistence"]
  },
  "tables": [
    {
      "name": "Sessions",
      "fields": [
        {"name": "Session ID", "type": "singleLineText"},
        {"name": "User ID", "type": "singleLineText"},
        {"name": "Platform", "type": "singleSelect"},
        {"name": "Created", "type": "dateTime"}
      ]
    }
  ]
}
```

**Response:**
```json
{
  "id": "base_airtable_67890",
  "airtableId": "appABCDEF123456", 
  "name": "Chat Sessions Base",
  "url": "https://airtable.com/appABCDEF123456",
  "createdAt": "2025-08-23T20:00:00.000Z",
  "tables": [
    {
      "id": "tblXYZ789",
      "name": "Sessions",
      "fields": [
        {
          "id": "fldSessionId",
          "name": "Session ID",
          "type": "singleLineText"
        }
      ]
    }
  ]
}
```

### Platform Information

#### GET /api/v1/platforms

Get information about supported platforms.

**Request:**
```http
GET /api/v1/platforms
```

**Response:**
```json
{
  "platforms": [
    {
      "id": "discord-js",
      "name": "Discord.js",
      "displayName": "Discord Bot",
      "icon": "🤖",
      "description": "Create Discord bots with slash commands, threads, and webhooks",
      "requirements": [
        "Node.js 16+",
        "Discord Bot Token",
        "Discord Server Admin Access"
      ],
      "estimatedTime": "2-4 hours",
      "complexity": "intermediate",
      "supportedFeatures": [
        "conversation-branching",
        "context-awareness", 
        "custom-commands",
        "webhooks",
        "ai-integration"
      ],
      "defaultPriorities": [
        "user-authentication",
        "real-time-sync",
        "error-handling"
      ]
    }
  ],
  "total": 7
}
```

#### GET /api/v1/platforms/{id}

Get detailed information about a specific platform.

**Request:**
```http
GET /api/v1/platforms/discord-js
```

**Response:**
```json
{
  "id": "discord-js",
  "name": "Discord.js",
  "displayName": "Discord Bot", 
  "icon": "🤖",
  "description": "Create Discord bots with slash commands, threads, and webhooks",
  "requirements": [
    "Node.js 16+",
    "Discord Bot Token", 
    "Discord Server Admin Access"
  ],
  "estimatedTime": "2-4 hours",
  "complexity": "intermediate",
  "supportedFeatures": [
    "conversation-branching",
    "context-awareness",
    "custom-commands", 
    "webhooks",
    "ai-integration"
  ],
  "defaultPriorities": [
    "user-authentication",
    "real-time-sync", 
    "error-handling"
  ],
  "documentation": {
    "gettingStarted": "https://discord.js.org/#/docs/discord.js/stable/general/welcome",
    "apiReference": "https://discord.js.org/#/docs/discord.js/stable/general/welcome",
    "examples": [
      {
        "title": "Basic Bot Setup",
        "url": "https://github.com/discordjs/discord.js/tree/main/apps/guide"
      }
    ]
  },
  "sampleProjects": [
    {
      "title": "Music Bot",
      "description": "Discord bot for playing music in voice channels",
      "features": ["custom-commands", "ai-integration"],
      "complexity": "advanced"
    }
  ]
}
```

## 📊 Response Formats

### Success Response

```json
{
  "data": {
    // Response data
  },
  "meta": {
    "timestamp": "2025-08-23T20:00:00.000Z",
    "requestId": "req_1234567890",
    "version": "2.0.0"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field": "platform",
      "reason": "Invalid platform specified"
    },
    "suggestion": "Use one of: discord-js, telegram-bot-api, whatsapp-web, slack-bolt, twitter-api, web-chat, cli-interface"
  },
  "meta": {
    "timestamp": "2025-08-23T20:00:00.000Z",
    "requestId": "req_1234567890"
  }
}
```

### Pagination

```json
{
  "data": [
    // Array of items
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 40,
    "hasNext": true,
    "hasPrev": true,
    "nextOffset": 60,
    "prevOffset": 20
  }
}
```

## ⚠️ Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTHENTICATION_REQUIRED` | 401 | Missing or invalid authentication token |
| `AUTHORIZATION_FAILED` | 403 | Insufficient permissions for requested resource |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource does not exist |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests from client |
| `GENERATION_FAILED` | 422 | Solution generation failed |
| `EXTERNAL_SERVICE_ERROR` | 502 | External API (Notion/Airtable) unavailable |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

## 🚦 Rate Limiting

Rate limits are applied per authenticated user:

- **General API**: 100 requests per 15 minutes
- **Generation**: 10 generations per hour
- **Integration APIs**: 50 requests per 15 minutes

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1692825600
X-RateLimit-Retry-After: 900
```

## 📝 Request/Response Examples

### Complete Discord Bot Generation

**Request:**
```bash
curl -X POST "https://tbowman01.github.io/chat-session-mgmt-builder/api/v1/generate" \
  -H "Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "configuration": {
      "platform": "discord-js",
      "priorities": ["message-persistence", "session-management", "error-handling"],
      "features": ["custom-commands", "ai-integration", "webhooks"],
      "teamSize": "small",
      "complexity": "intermediate",
      "projectName": "Community Management Bot",
      "description": "Discord bot for managing community with AI-powered moderation"
    },
    "options": {
      "includeTests": true,
      "includeDocker": true,
      "includeDocs": true
    }
  }'
```

**Response:**
```json
{
  "id": "solution_discord_community_bot",
  "status": "completed",
  "files": [
    {
      "path": "package.json",
      "type": "config",
      "size": 2048,
      "content": "{\n  \"name\": \"community-management-bot\",\n  \"version\": \"1.0.0\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"start\": \"node index.js\",\n    \"dev\": \"nodemon index.js\",\n    \"test\": \"jest\"\n  },\n  \"dependencies\": {\n    \"discord.js\": \"^14.13.0\",\n    \"dotenv\": \"^16.3.1\",\n    \"@discordjs/rest\": \"^2.0.1\",\n    \"discord-api-types\": \"^0.37.50\"\n  }\n}"
    }
  ],
  "metadata": {
    "totalFiles": 15,
    "totalLines": 1247,
    "estimatedSetupTime": "3-5 hours",
    "dependencies": {
      "discord.js": "^14.13.0",
      "dotenv": "^16.3.1"
    }
  },
  "downloadUrl": "/api/v1/generate/solution_discord_community_bot/download"
}
```

## 🔧 SDK & Client Libraries

### JavaScript/TypeScript Client

```typescript
import { ChatBuilderAPI } from '@chat-builder/api-client';

const api = new ChatBuilderAPI({
  baseURL: 'https://tbowman01.github.io/chat-session-mgmt-builder/api',
  accessToken: 'your_github_token'
});

// Generate solution
const solution = await api.generate({
  platform: 'discord-js',
  priorities: ['message-persistence', 'session-management'],
  features: ['custom-commands'],
  teamSize: 'small',
  complexity: 'intermediate',
  projectName: 'My Bot',
  description: 'Discord bot for community'
});

// Download solution
const zipFile = await api.download(solution.id);
```

### Python Client

```python
from chat_builder_api import ChatBuilderAPI

api = ChatBuilderAPI(
    base_url='https://tbowman01.github.io/chat-session-mgmt-builder/api',
    access_token='your_github_token'
)

# Generate solution
solution = api.generate({
    'platform': 'telegram-bot-api',
    'priorities': ['message-persistence', 'user-authentication'],
    'features': ['file-attachments'],
    'teamSize': 'solo',
    'complexity': 'basic',
    'projectName': 'Telegram Assistant',
    'description': 'Personal assistant bot'
})

# Download solution
api.download(solution['id'], 'telegram-bot.zip')
```

## 🧪 Testing

### API Testing with Postman

Import the Postman collection:

```json
{
  "info": {
    "name": "Chat Session Management Builder API",
    "version": "2.0.0"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{github_token}}"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://tbowman01.github.io/chat-session-mgmt-builder/api/v1"
    }
  ]
}
```

### API Testing with curl

```bash
# Test health endpoint
curl -X GET "https://tbowman01.github.io/chat-session-mgmt-builder/api/v1/health"

# Test authenticated endpoint
curl -X GET "https://tbowman01.github.io/chat-session-mgmt-builder/api/v1/platforms" \
  -H "Authorization: Bearer your_github_token"

# Test generation
curl -X POST "https://tbowman01.github.io/chat-session-mgmt-builder/api/v1/generate" \
  -H "Authorization: Bearer your_github_token" \
  -H "Content-Type: application/json" \
  -d @test-config.json
```

---

This API documentation provides comprehensive information for integrating with the Chat Session Management Builder. For additional support, examples, or questions, please refer to the GitHub repository or create an issue.