import { BuildConfiguration, GeneratedSolution, GeneratedFile } from '@/types';
import { generateBasePackageJson, generateReadme, generateEnvExample, generateGitignore, generateDockerfile } from './index';

export async function generateWhatsAppBot(config: BuildConfiguration): Promise<GeneratedSolution> {
  const files: GeneratedFile[] = [];
  
  // Package.json
  const packageJson = {
    ...generateBasePackageJson(config),
    dependencies: {
      'whatsapp-web.js': '^1.22.2',
      'qrcode-terminal': '^0.12.0',
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
  const indexJs = `const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const dotenv = require('dotenv');
${config.priorities.includes('message-persistence') ? "const mongoose = require('mongoose');" : ''}
${config.priorities.includes('session-management') ? "const redis = require('redis');" : ''}
${config.features.includes('ai-integration') ? "const { OpenAI } = require('openai');" : ''}

dotenv.config();

// Initialize WhatsApp client with local authentication
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "${config.projectName.toLowerCase()}",
    dataPath: './sessions'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ]
  }
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
  messageId: String,
  from: String,
  to: String,
  body: String,
  timestamp: { type: Date, default: Date.now },
  isGroup: Boolean,
  groupName: String,
  sessionId: String,
  hasMedia: Boolean,
  mediaType: String,
});

const Message = mongoose.model('Message', messageSchema);
` : ''}

${config.features.includes('ai-integration') ? `
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
` : ''}

// Event handlers
client.on('qr', (qr) => {
  console.log('Scan the QR code below to login:');
  qrcode.generate(qr, { small: true });
  console.log('Or use your phone to scan the QR code in the terminal above.');
});

client.on('authenticated', () => {
  console.log('WhatsApp authenticated successfully!');
});

client.on('auth_failure', (msg) => {
  console.error('Authentication failed:', msg);
});

client.on('ready', () => {
  console.log('WhatsApp client is ready!');
  console.log('Bot is now active and listening for messages.');
});

client.on('disconnected', (reason) => {
  console.log('WhatsApp client disconnected:', reason);
});

// Message handling
client.on('message_create', async (message) => {
  // Skip messages sent by this bot
  if (message.fromMe) return;
  
  const contact = await message.getContact();
  const chat = await message.getChat();
  const sessionId = \`whatsapp-\${contact.number}\`;
  
  try {
    ${config.priorities.includes('message-persistence') ? `
    // Save message to database
    const newMessage = new Message({
      messageId: message.id._serialized,
      from: contact.number,
      to: message.to,
      body: message.body,
      isGroup: chat.isGroup,
      groupName: chat.isGroup ? chat.name : null,
      sessionId: sessionId,
      hasMedia: message.hasMedia,
      mediaType: message.hasMedia ? message.type : null,
    });
    
    await newMessage.save();
    ` : ''}
    
    ${config.priorities.includes('session-management') ? `
    // Update session
    const sessionData = await redisClient.get(\`session:\${sessionId}\`);
    const session = sessionData ? JSON.parse(sessionData) : {
      contactNumber: contact.number,
      contactName: contact.pushname || contact.name,
      startedAt: Date.now(),
    };
    
    session.lastActivity = Date.now();
    session.messageCount = (session.messageCount || 0) + 1;
    await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(session));
    ` : ''}
    
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

client.on('message', async (message) => {
  const contact = await message.getContact();
  const chat = await message.getChat();
  
  // Command handling
  const command = message.body.toLowerCase().trim();
  
  switch (command) {
    case '!help':
      await message.reply(\`
Welcome to ${config.projectName}!

Available commands:
!help - Show this help message
!status - Show bot status
${config.features.includes('context-awareness') ? '!context - Show conversation context' : ''}
${config.features.includes('ai-integration') ? '!ask [question] - Ask AI a question' : ''}
${config.features.includes('backup-restore') ? '!backup - Backup your conversation data' : ''}

Just send a regular message to chat with the bot!
      \`);
      break;
      
    case '!status':
      const uptime = process.uptime();
      const uptimeString = new Date(uptime * 1000).toISOString().substr(11, 8);
      await message.reply(\`
🤖 Bot Status:
Uptime: \${uptimeString}
Contact: \${contact.pushname || contact.name}
Chat Type: \${chat.isGroup ? 'Group' : 'Individual'}
      \`);
      break;
      
    ${config.features.includes('context-awareness') ? `
    case '!context':
      try {
        const sessionId = \`whatsapp-\${contact.number}\`;
        ${config.priorities.includes('message-persistence') ? `
        const recentMessages = await Message.find({
          $or: [
            { from: contact.number },
            { to: contact.number }
          ]
        }).sort({ timestamp: -1 }).limit(5);
        
        if (recentMessages.length > 0) {
          const context = recentMessages.reverse().map(m => 
            \`\${m.from === contact.number ? 'You' : 'Bot'}: \${m.body}\`
          ).join('\\n');
          await message.reply(\`Recent context:\\n\\n\${context}\`);
        } else {
          await message.reply('No recent context found.');
        }
        ` : 'await message.reply("Message persistence not enabled for context.");'}
      } catch (error) {
        console.error('Error getting context:', error);
        await message.reply('Error retrieving context.');
      }
      break;
    ` : ''}
    
    ${config.features.includes('ai-integration') ? `
    default:
      if (command.startsWith('!ask ')) {
        const question = message.body.slice(5);
        try {
          await chat.sendStateTyping();
          
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant integrated into a WhatsApp bot. Keep responses concise." },
              { role: "user", content: question }
            ],
            max_tokens: 300
          });
          
          const answer = completion.choices[0].message.content;
          await message.reply(answer);
          
        } catch (error) {
          console.error('AI Error:', error);
          await message.reply('Sorry, I encountered an error processing your request.');
        }
      } else if (!command.startsWith('!')) {
        // Handle regular messages
        await message.reply(\`Thanks for your message: "\${message.body}"\`);
      }
      break;
    ` : `
    default:
      if (!command.startsWith('!')) {
        // Handle regular messages
        await message.reply(\`Thanks for your message: "\${message.body}"\`);
      }
      break;
    `}
  }
});

${config.features.includes('file-attachments') ? `
// Handle media messages
client.on('message', async (message) => {
  if (message.hasMedia) {
    try {
      const media = await message.downloadMedia();
      
      if (media) {
        console.log(\`Received media: \${media.mimetype}, size: \${media.data.length}\`);
        
        // Here you can process the media file
        // For example, save it to disk or upload to cloud storage
        
        await message.reply(\`Received your \${media.mimetype} file! File size: \${Math.round(media.data.length / 1024)}KB\`);
      }
    } catch (error) {
      console.error('Error handling media:', error);
      await message.reply('Sorry, I had trouble processing your media file.');
    }
  }
});
` : ''}

${config.features.includes('backup-restore') ? `
// Backup functionality
client.on('message', async (message) => {
  if (message.body.toLowerCase() === '!backup') {
    const contact = await message.getContact();
    const sessionId = \`whatsapp-\${contact.number}\`;
    
    try {
      ${config.priorities.includes('message-persistence') ? `
      const messages = await Message.find({
        $or: [
          { from: contact.number },
          { to: contact.number }
        ]
      }).sort({ timestamp: 1 });
      
      const backup = {
        contact: {
          number: contact.number,
          name: contact.pushname || contact.name,
        },
        messages: messages,
        backupDate: new Date(),
      };
      
      // In a real implementation, you'd save this to a file or cloud storage
      await message.reply(\`Backup created with \${messages.length} messages from your conversation history.\`);
      ` : 'await message.reply("Message persistence not enabled for backups.");'}
      
    } catch (error) {
      console.error('Backup error:', error);
      await message.reply('Error creating backup.');
    }
  }
});
` : ''}

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down WhatsApp bot...');
  await client.destroy();
  process.exit(0);
});

// Start the client
client.initialize();`;

  files.push(
    { path: 'package.json', content: JSON.stringify(packageJson, null, 2), type: 'config', description: 'Package configuration with dependencies' },
    { path: 'index.js', content: indexJs, type: 'source', description: 'Main WhatsApp bot application' },
    { path: 'README.md', content: generateReadme(config), type: 'documentation', description: 'Project documentation' },
    { path: '.env.example', content: generateEnvExample(config), type: 'config', description: 'Environment variables template' },
    { path: '.gitignore', content: generateGitignore(), type: 'config', description: 'Git ignore rules' },
  );

  // Add session helper
  files.push({
    path: 'src/sessionManager.js',
    content: `// WhatsApp session management utilities
class SessionManager {
  constructor(redisClient) {
    this.redis = redisClient;
  }
  
  async createSession(contactNumber, data) {
    const sessionId = \`whatsapp-\${contactNumber}\`;
    await this.redis.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify({
      ...data,
      createdAt: Date.now(),
      lastActivity: Date.now(),
    }));
    return sessionId;
  }
  
  async getSession(contactNumber) {
    const sessionId = \`whatsapp-\${contactNumber}\`;
    const data = await this.redis.get(\`session:\${sessionId}\`);
    return data ? JSON.parse(data) : null;
  }
  
  async updateSession(contactNumber, updates) {
    const session = await this.getSession(contactNumber);
    if (session) {
      const updated = { ...session, ...updates, lastActivity: Date.now() };
      await this.createSession(contactNumber, updated);
    }
  }
  
  async deleteSession(contactNumber) {
    const sessionId = \`whatsapp-\${contactNumber}\`;
    await this.redis.del(\`session:\${sessionId}\`);
  }
}

module.exports = SessionManager;`,
    type: 'source',
    description: 'Session management utilities'
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
      '2. Run "npm install" to install dependencies',
      '3. Copy .env.example to .env (no API keys needed for WhatsApp Web)',
      '4. Run "npm run dev" to start the bot',
      '5. Scan the QR code with your WhatsApp mobile app',
      '6. Go to WhatsApp > Settings > Linked Devices > Link a Device',
      '7. Scan the QR code displayed in your terminal',
      '8. Once connected, send "!help" to any WhatsApp contact to test'
    ],
    estimatedTime: '3-5 hours',
    complexity: 'advanced',
  };
}