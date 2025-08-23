import { BuildConfiguration, GeneratedSolution, GeneratedFile } from '@/types';
import { generateBasePackageJson, generateReadme, generateEnvExample, generateGitignore, generateDockerfile } from './index';

export async function generateTelegramBot(config: BuildConfiguration): Promise<GeneratedSolution> {
  const files: GeneratedFile[] = [];
  
  // Package.json
  const packageJson = {
    ...generateBasePackageJson(config),
    dependencies: {
      'node-telegram-bot-api': '^0.63.0',
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
  const indexJs = `const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
${config.priorities.includes('message-persistence') ? "const mongoose = require('mongoose');" : ''}
${config.priorities.includes('session-management') ? "const redis = require('redis');" : ''}
${config.features.includes('ai-integration') ? "const { OpenAI } = require('openai');" : ''}

dotenv.config();

// Initialize Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

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
  messageId: Number,
  chatId: Number,
  userId: Number,
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
});

const Message = mongoose.model('Message', messageSchema);
` : ''}

${config.features.includes('ai-integration') ? `
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
` : ''}

// Bot commands
bot.onText(/\\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = \`
Welcome to ${config.projectName}!

Available commands:
/start - Show this welcome message
/help - Get help
${config.features.includes('context-awareness') ? '/context - Show conversation context' : ''}
${config.features.includes('custom-commands') ? '/custom - Run custom command' : ''}
${config.features.includes('ai-integration') ? '/ask - Ask AI a question' : ''}

Type any message to interact with the bot!
  \`;
  
  await bot.sendMessage(chatId, welcomeMessage);
  
  ${config.priorities.includes('session-management') ? `
  // Initialize user session
  const sessionId = \`telegram-\${msg.from.id}\`;
  await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify({
    userId: msg.from.id,
    chatId: chatId,
    username: msg.from.username,
    startedAt: Date.now(),
  }));
  ` : ''}
});

bot.onText(/\\/help/, async (msg) => {
  const chatId = msg.chat.id;
  const helpText = \`
${config.projectName} Help

This bot helps you manage chat sessions with the following features:
${config.priorities.map(p => \`• \${p.replace('-', ' ').replace(/\\b\\w/g, l => l.toUpperCase())}\`).join('\\n')}

For more information, contact the administrator.
  \`;
  
  await bot.sendMessage(chatId, helpText);
});

${config.features.includes('context-awareness') ? `
bot.onText(/\\/context/, async (msg) => {
  const chatId = msg.chat.id;
  const sessionId = \`telegram-\${msg.from.id}\`;
  
  try {
    ${config.priorities.includes('session-management') ? `
    const sessionData = await redisClient.get(\`session:\${sessionId}\`);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      await bot.sendMessage(chatId, \`Session started: \${new Date(session.startedAt).toLocaleString()}\`);
    }
    ` : ''}
    
    ${config.priorities.includes('message-persistence') ? `
    const recentMessages = await Message.find({ 
      chatId: chatId 
    }).sort({ timestamp: -1 }).limit(5);
    
    if (recentMessages.length > 0) {
      const context = recentMessages.reverse().map(m => 
        \`\${m.username || 'User'}: \${m.text}\`
      ).join('\\n');
      await bot.sendMessage(chatId, \`Recent context:\\n\\n\${context}\`);
    } else {
      await bot.sendMessage(chatId, 'No recent context found.');
    }
    ` : 'await bot.sendMessage(chatId, "Context tracking not enabled.");'}
  } catch (error) {
    console.error('Error getting context:', error);
    await bot.sendMessage(chatId, 'Error retrieving context.');
  }
});
` : ''}

${config.features.includes('ai-integration') ? `
bot.onText(/\\/ask (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const question = match[1];
  
  try {
    await bot.sendMessage(chatId, 'Thinking...', { reply_to_message_id: msg.message_id });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant integrated into a Telegram bot." },
        { role: "user", content: question }
      ],
      max_tokens: 500
    });
    
    const answer = completion.choices[0].message.content;
    await bot.sendMessage(chatId, answer, { 
      parse_mode: 'Markdown',
      reply_to_message_id: msg.message_id 
    });
    
  } catch (error) {
    console.error('AI Error:', error);
    await bot.sendMessage(chatId, 'Sorry, I encountered an error processing your request.');
  }
});
` : ''}

// Handle all text messages
bot.on('message', async (msg) => {
  // Skip if it's a command (starts with /)
  if (msg.text && msg.text.startsWith('/')) return;
  
  const chatId = msg.chat.id;
  const sessionId = \`telegram-\${msg.from.id}\`;
  
  try {
    ${config.priorities.includes('message-persistence') ? `
    // Save message to database
    const newMessage = new Message({
      messageId: msg.message_id,
      chatId: chatId,
      userId: msg.from.id,
      username: msg.from.username || msg.from.first_name,
      text: msg.text,
      sessionId: sessionId,
    });
    
    await newMessage.save();
    ` : ''}
    
    ${config.priorities.includes('session-management') ? `
    // Update session
    const sessionData = await redisClient.get(\`session:\${sessionId}\`);
    if (sessionData) {
      const session = JSON.parse(sessionData);
      session.lastActivity = Date.now();
      session.messageCount = (session.messageCount || 0) + 1;
      await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(session));
    }
    ` : ''}
    
    // Simple echo response (customize as needed)
    if (msg.text) {
      await bot.sendMessage(chatId, \`You said: "\${msg.text}"\`);
    }
    
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

${config.features.includes('file-attachments') ? `
// Handle file uploads
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const photo = msg.photo[msg.photo.length - 1]; // Get highest resolution
  
  try {
    const fileInfo = await bot.getFile(photo.file_id);
    const fileUrl = \`https://api.telegram.org/file/bot\${process.env.TELEGRAM_TOKEN}/\${fileInfo.file_path}\`;
    
    await bot.sendMessage(chatId, \`Photo received! File URL: \${fileUrl}\`);
    
    // Here you could download and process the file
    // const response = await fetch(fileUrl);
    // const buffer = await response.buffer();
    // ... process the file
    
  } catch (error) {
    console.error('Error handling photo:', error);
    await bot.sendMessage(chatId, 'Error processing your photo.');
  }
});

bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  const document = msg.document;
  
  try {
    const fileInfo = await bot.getFile(document.file_id);
    const fileUrl = \`https://api.telegram.org/file/bot\${process.env.TELEGRAM_TOKEN}/\${fileInfo.file_path}\`;
    
    await bot.sendMessage(chatId, \`Document received: \${document.file_name}\\nSize: \${document.file_size} bytes\`);
    
  } catch (error) {
    console.error('Error handling document:', error);
    await bot.sendMessage(chatId, 'Error processing your document.');
  }
});
` : ''}

// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

console.log('Telegram bot started successfully!');`;

  files.push(
    { path: 'package.json', content: JSON.stringify(packageJson, null, 2), type: 'config', description: 'Package configuration with dependencies' },
    { path: 'index.js', content: indexJs, type: 'source', description: 'Main Telegram bot application' },
    { path: 'README.md', content: generateReadme(config), type: 'documentation', description: 'Project documentation' },
    { path: '.env.example', content: generateEnvExample(config), type: 'config', description: 'Environment variables template' },
    { path: '.gitignore', content: generateGitignore(), type: 'config', description: 'Git ignore rules' },
  );

  // Add custom commands file
  if (config.features.includes('custom-commands')) {
    const customCommandsJs = `// Custom command handlers for Telegram bot
const customCommands = {
  // Example custom command
  '/status': async (bot, msg) => {
    const chatId = msg.chat.id;
    const uptime = process.uptime();
    const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8);
    
    await bot.sendMessage(chatId, \`
🤖 Bot Status:
Uptime: \${uptimeString}
Memory Usage: \${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
Node.js: \${process.version}
    \`);
  },
  
  '/weather': async (bot, msg) => {
    const chatId = msg.chat.id;
    // Integrate with weather API
    await bot.sendMessage(chatId, 'Weather feature not implemented yet. Add your weather API integration here!');
  },
  
  // Add your custom commands here
};

module.exports = customCommands;`;

    files.push({
      path: 'src/customCommands.js',
      content: customCommandsJs,
      type: 'source',
      description: 'Custom command definitions'
    });
  }

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
      '2. Run "npm install" to install dependencies',
      '3. Create a Telegram bot by messaging @BotFather on Telegram',
      '4. Copy the bot token from @BotFather',
      '5. Copy .env.example to .env and add your bot token',
      '6. Run "npm run dev" to start development server',
      '7. Start a chat with your bot on Telegram',
      '8. Send /start to begin interacting with your bot'
    ],
    estimatedTime: '1-3 hours',
    complexity: 'basic',
  };
}