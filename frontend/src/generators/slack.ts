import { BuildConfiguration, GeneratedSolution, GeneratedFile } from '@/types';
import { generateBasePackageJson, generateReadme, generateEnvExample, generateGitignore, generateDockerfile } from './index';

export async function generateSlackApp(config: BuildConfiguration): Promise<GeneratedSolution> {
  const files: GeneratedFile[] = [];
  
  // Package.json
  const packageJson = {
    ...generateBasePackageJson(config),
    dependencies: {
      '@slack/bolt': '^3.14.0',
      dotenv: '^16.3.1',
      ...(config.priorities.includes('message-persistence') && {
        mongoose: '^7.4.1',
      }),
      ...(config.priorities.includes('session-management') && {
        redis: '^4.6.7',
      }),
      ...(config.features.includes('ai-integration') && {
        openai: '^3.3.0',
      }),
    },
  };

  // Main index.js
  const indexJs = `const { App } = require('@slack/bolt');
const dotenv = require('dotenv');
${config.priorities.includes('message-persistence') ? "const mongoose = require('mongoose');" : ''}
${config.priorities.includes('session-management') ? "const redis = require('redis');" : ''}
${config.features.includes('ai-integration') ? "const { OpenAI } = require('openai');" : ''}

dotenv.config();

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

${config.priorities.includes('session-management') ? `
// Initialize Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();
` : ''}

${config.priorities.includes('message-persistence') ? `
// Initialize MongoDB
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/${config.projectName.toLowerCase()}');

const messageSchema = new mongoose.Schema({
  messageTs: String,
  channelId: String,
  userId: String,
  userName: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  teamId: String,
  sessionId: String,
  threadTs: String,
});

const Message = mongoose.model('Message', messageSchema);
` : ''}

${config.features.includes('ai-integration') ? `
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
` : ''}

// Command handlers
app.command('/hello', async ({ command, ack, respond }) => {
  await ack();
  
  await respond({
    text: \`Hello <@\${command.user_id}>! Welcome to ${config.projectName}.\`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: \`Hello <@\${command.user_id}>! Welcome to *${config.projectName}*.\`
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Available commands:\\n• \`/hello\` - Show this greeting\\n• \`/help\` - Get help${config.features.includes('context-awareness') ? '\\n• \`/context\` - Show conversation context' : ''}${config.features.includes('ai-integration') ? '\\n• \`/ask [question]\` - Ask AI a question' : ''}'
        }
      }
    ]
  });
  
  ${config.priorities.includes('session-management') ? `
  // Create or update user session
  const sessionId = \`slack-\${command.team_id}-\${command.user_id}\`;
  await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify({
    userId: command.user_id,
    teamId: command.team_id,
    channelId: command.channel_id,
    lastCommand: 'hello',
    timestamp: Date.now(),
  }));
  ` : ''}
});

app.command('/help', async ({ command, ack, respond }) => {
  await ack();
  
  await respond({
    text: 'Help for ${config.projectName}',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '${config.projectName} Help'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'This Slack app provides chat session management with the following features:'
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: \`\${config.priorities.map(p => \`• *\${p.replace('-', ' ').replace(/\\\\b\\\\w/g, l => l.toUpperCase())}*\`).join('\\\\n')}\`
        }
      },
      ${config.features.length > 0 ? `
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: \`Additional features:\\\\n\${config.features.map(f => \`• \${f.replace('-', ' ').replace(/\\\\b\\\\w/g, l => l.toUpperCase())}\`).join('\\\\n')}\`
        }
      },
      ` : ''}
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'For support, contact your system administrator.'
          }
        ]
      }
    ]
  });
});

${config.features.includes('context-awareness') ? `
app.command('/context', async ({ command, ack, respond }) => {
  await ack();
  
  try {
    const sessionId = \`slack-\${command.team_id}-\${command.user_id}\`;
    
    ${config.priorities.includes('message-persistence') ? `
    const recentMessages = await Message.find({
      channelId: command.channel_id,
      teamId: command.team_id
    }).sort({ timestamp: -1 }).limit(5);
    
    if (recentMessages.length > 0) {
      const context = recentMessages.reverse().map(m => 
        \`<@\${m.userId}>: \${m.text}\`
      ).join('\\n');
      
      await respond({
        text: 'Recent conversation context',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Recent Context:*\\n\`\`\`\\n' + context + '\\n\`\`\`'
            }
          }
        ]
      });
    } else {
      await respond('No recent context found in this channel.');
    }
    ` : 'await respond("Message persistence not enabled for context.");'}
    
  } catch (error) {
    console.error('Error getting context:', error);
    await respond('Error retrieving context.');
  }
});
` : ''}

${config.features.includes('ai-integration') ? `
app.command('/ask', async ({ command, ack, respond }) => {
  await ack();
  
  const question = command.text.trim();
  if (!question) {
    await respond('Please provide a question. Example: \`/ask What is the weather like?\`');
    return;
  }
  
  try {
    await respond({
      text: 'Thinking...',
      response_type: 'ephemeral'
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant integrated into a Slack bot. Keep responses professional and concise." },
        { role: "user", content: question }
      ],
      max_tokens: 500
    });
    
    const answer = completion.choices[0].message.content;
    
    await respond({
      text: \`AI Response to: "\${question}"\`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: \`*Question:* \${question}\\n\\n*AI Response:*\\n\${answer}\`
          }
        }
      ]
    });
    
  } catch (error) {
    console.error('AI Error:', error);
    await respond('Sorry, I encountered an error processing your request.');
  }
});
` : ''}

// Message handling
app.message(async ({ message, say }) => {
  // Skip bot messages and threaded replies (unless specifically handling threads)
  if (message.subtype || message.bot_id) return;
  
  const sessionId = \`slack-\${message.team}-\${message.user}\`;
  
  try {
    ${config.priorities.includes('message-persistence') ? `
    // Save message to database
    const newMessage = new Message({
      messageTs: message.ts,
      channelId: message.channel,
      userId: message.user,
      text: message.text,
      teamId: message.team,
      sessionId: sessionId,
      threadTs: message.thread_ts,
    });
    
    await newMessage.save();
    ` : ''}
    
    ${config.priorities.includes('session-management') ? `
    // Update session
    const sessionData = await redisClient.get(\`session:\${sessionId}\`);
    const session = sessionData ? JSON.parse(sessionData) : {
      userId: message.user,
      teamId: message.team,
      startedAt: Date.now(),
    };
    
    session.lastActivity = Date.now();
    session.lastChannelId = message.channel;
    session.messageCount = (session.messageCount || 0) + 1;
    await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(session));
    ` : ''}
    
    // Simple response logic (customize as needed)
    if (message.text && message.text.toLowerCase().includes('hello')) {
      await say(\`Hello <@\${message.user}>! Use \`/hello\` for more options.\`);
    }
    
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

${config.features.includes('conversation-branching') ? `
// Handle thread messages
app.message(async ({ message, say }) => {
  if (message.thread_ts && !message.bot_id) {
    try {
      // This is a thread reply
      await say({
        text: \`Thread reply received: "\${message.text}"\`,
        thread_ts: message.thread_ts
      });
      
      ${config.priorities.includes('message-persistence') ? `
      // Update message with thread info
      await Message.findOneAndUpdate(
        { messageTs: message.ts },
        { threadTs: message.thread_ts }
      );
      ` : ''}
      
    } catch (error) {
      console.error('Error handling thread message:', error);
    }
  }
});
` : ''}

${config.features.includes('webhooks') ? `
// Webhook endpoint for external integrations
app.event('app_mention', async ({ event, say }) => {
  try {
    await say({
      text: \`Thanks for mentioning me, <@\${event.user}>!\`,
      channel: event.channel
    });
    
    // Process external webhook data if needed
    // This could trigger based on external events
    
  } catch (error) {
    console.error('Error handling mention:', error);
  }
});
` : ''}

${config.features.includes('file-attachments') ? `
// Handle file uploads
app.event('file_shared', async ({ event, client }) => {
  try {
    const fileInfo = await client.files.info({
      file: event.file_id
    });
    
    console.log('File shared:', fileInfo.file);
    
    // Process the file as needed
    // You could download, analyze, or store file metadata
    
  } catch (error) {
    console.error('Error handling file:', error);
  }
});
` : ''}

${config.priorities.includes('user-authentication') ? `
// User authentication and authorization
app.use(async ({ next, context }) => {
  // Add user validation logic here
  const userId = context.userId;
  const teamId = context.teamId;
  
  // Example: Check if user has permission
  // const hasPermission = await checkUserPermission(userId, teamId);
  // if (!hasPermission) {
  //   return; // Block the request
  // }
  
  await next();
});
` : ''}

// Error handling
app.error((error) => {
  console.error('Slack app error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Start the app
(async () => {
  try {
    await app.start();
    console.log('⚡️ Slack app started successfully!');
  } catch (error) {
    console.error('Error starting Slack app:', error);
    process.exit(1);
  }
})();`;

  files.push(
    { path: 'package.json', content: JSON.stringify(packageJson, null, 2), type: 'config', description: 'Package configuration with dependencies' },
    { path: 'index.js', content: indexJs, type: 'source', description: 'Main Slack app application' },
    { path: 'README.md', content: generateReadme(config), type: 'documentation', description: 'Project documentation' },
    { path: '.env.example', content: generateEnvExample(config), type: 'config', description: 'Environment variables template' },
    { path: '.gitignore', content: generateGitignore(), type: 'config', description: 'Git ignore rules' },
  );

  // Add Slack app manifest
  const appManifest = `{
  "display_information": {
    "name": "${config.projectName}",
    "description": "${config.description}",
    "background_color": "#2c2d30"
  },
  "features": {
    "app_home": {
      "home_tab_enabled": true,
      "messages_tab_enabled": false,
      "messages_tab_read_only_enabled": false
    },
    "bot_user": {
      "display_name": "${config.projectName}",
      "always_online": true
    },
    "slash_commands": [
      {
        "command": "/hello",
        "description": "Get a greeting from the bot",
        "should_escape": false
      },
      {
        "command": "/help",
        "description": "Get help and information",
        "should_escape": false
      }
      ${config.features.includes('context-awareness') ? `,
      {
        "command": "/context",
        "description": "Show conversation context",
        "should_escape": false
      }` : ''}
      ${config.features.includes('ai-integration') ? `,
      {
        "command": "/ask",
        "description": "Ask AI a question",
        "usage_hint": "[your question]",
        "should_escape": false
      }` : ''}
    ]
  },
  "oauth_config": {
    "scopes": {
      "bot": [
        "app_mentions:read",
        "channels:history",
        "chat:write",
        "commands",
        "groups:history",
        "im:history",
        "mpim:history"
        ${config.features.includes('file-attachments') ? ',"files:read"' : ''}
        ${config.priorities.includes('user-authentication') ? ',"users:read"' : ''}
      ]
    }
  },
  "settings": {
    "event_subscriptions": {
      "bot_events": [
        "app_mention",
        "message.channels",
        "message.groups",
        "message.im",
        "message.mpim"
        ${config.features.includes('file-attachments') ? ',"file_shared"' : ''}
      ]
    },
    "interactivity": {
      "is_enabled": true
    },
    "org_deploy_enabled": false,
    "socket_mode_enabled": true,
    "token_rotation_enabled": false
  }
}`;

  files.push({
    path: 'slack-app-manifest.json',
    content: appManifest,
    type: 'config',
    description: 'Slack app manifest for easy setup'
  });

  // Add Docker support
  files.push({
    path: 'Dockerfile',
    content: generateDockerfile(config),
    type: 'config',
    description: 'Docker container configuration'
  });

  return {
    platform: config.platform,
    files,
    packageJson,
    readme: generateReadme(config),
    setupInstructions: [
      '1. Install Node.js 18+ and npm',
      '2. Create a Slack app at https://api.slack.com/apps',
      '3. Use the slack-app-manifest.json file to configure your app',
      '4. Install the app to your workspace',
      '5. Copy the Bot User OAuth Token and Signing Secret',
      '6. Generate an App-Level Token with connections:write scope',
      '7. Copy .env.example to .env and fill in your tokens',
      '8. Run "npm install" to install dependencies',
      '9. Run "npm run dev" to start the app',
      '10. Test with /hello command in your Slack workspace'
    ],
    estimatedTime: '4-6 hours',
    complexity: 'advanced',
  };
}