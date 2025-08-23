import { BuildConfiguration, GeneratedSolution, GeneratedFile } from '@/types';
import { generateBasePackageJson, generateReadme, generateEnvExample, generateGitignore, generateDockerfile } from './index';

export async function generateDiscordBot(config: BuildConfiguration): Promise<GeneratedSolution> {
  const files: GeneratedFile[] = [];
  
  // Package.json
  const packageJson = {
    ...generateBasePackageJson(config),
    dependencies: {
      'discord.js': '^14.13.0',
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
  const indexJs = `const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
${config.priorities.includes('message-persistence') ? "const mongoose = require('mongoose');" : ''}
${config.priorities.includes('session-management') ? "const redis = require('redis');" : ''}
${config.features.includes('ai-integration') ? "const { OpenAI } = require('openai');" : ''}

dotenv.config();

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    ${config.features.includes('context-awareness') ? 'GatewayIntentBits.GuildMembers,' : ''}
  ],
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
  guildId: String,
  channelId: String,
  userId: String,
  content: String,
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

// Commands
const commands = [
  {
    name: 'hello',
    description: 'Replies with a greeting',
  },
  ${config.features.includes('conversation-branching') ? `
  {
    name: 'thread',
    description: 'Create a new conversation thread',
  },
  ` : ''}
  ${config.features.includes('context-awareness') ? `
  {
    name: 'context',
    description: 'Show conversation context',
  },
  ` : ''}
];

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands },
    );
    
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// Event handlers
client.once('ready', () => {
  console.log(\`Ready! Logged in as \${client.user.tag}\`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    switch (commandName) {
      case 'hello':
        await interaction.reply('Hello! I\\'m your chat session manager.');
        break;
        
      ${config.features.includes('conversation-branching') ? `
      case 'thread':
        const thread = await interaction.channel.threads.create({
          name: \`Thread-\${Date.now()}\`,
          autoArchiveDuration: 60,
          reason: 'New conversation thread',
        });
        await interaction.reply(\`Created new thread: <#\${thread.id}>\`);
        break;
      ` : ''}
      
      ${config.features.includes('context-awareness') ? `
      case 'context':
        // Get recent messages for context
        const messages = await interaction.channel.messages.fetch({ limit: 5 });
        const context = messages.map(m => \`\${m.author.username}: \${m.content}\`).join('\\n');
        await interaction.reply(\`Recent context:\\n\\\`\\\`\\\`\\n\${context}\\n\\\`\\\`\\\`\`);
        break;
      ` : ''}
      
      default:
        await interaction.reply('Unknown command');
    }

    ${config.priorities.includes('session-management') ? `
    // Store session data
    const sessionId = \`\${interaction.guildId}-\${interaction.user.id}\`;
    await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify({
      userId: interaction.user.id,
      guildId: interaction.guildId,
      lastCommand: commandName,
      timestamp: Date.now(),
    }));
    ` : ''}

  } catch (error) {
    console.error('Error handling interaction:', error);
    await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
  }
});

${config.priorities.includes('message-persistence') ? `
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    // Save message to database
    const newMessage = new Message({
      messageId: message.id,
      guildId: message.guild?.id,
      channelId: message.channel.id,
      userId: message.author.id,
      content: message.content,
      sessionId: \`\${message.guild?.id}-\${message.author.id}\`,
    });
    
    await newMessage.save();
  } catch (error) {
    console.error('Error saving message:', error);
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

// Start the bot
client.login(process.env.DISCORD_TOKEN);`;

  files.push(
    { path: 'package.json', content: JSON.stringify(packageJson, null, 2), type: 'config', description: 'Package configuration with dependencies' },
    { path: 'index.js', content: indexJs, type: 'source', description: 'Main Discord bot application' },
    { path: 'README.md', content: generateReadme(config), type: 'documentation', description: 'Project documentation' },
    { path: '.env.example', content: generateEnvExample(config), type: 'config', description: 'Environment variables template' },
    { path: '.gitignore', content: generateGitignore(), type: 'config', description: 'Git ignore rules' },
  );

  // Add additional files based on features
  if (config.features.includes('custom-commands')) {
    const commandsJs = `// Custom command handlers
const customCommands = {
  // Add your custom commands here
  ping: {
    name: 'ping',
    description: 'Check bot latency',
    execute: async (interaction) => {
      const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
      const latency = sent.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply(\`Pong! Latency is \${latency}ms.\`);
    },
  },
};

module.exports = customCommands;`;

    files.push({
      path: 'src/commands.js',
      content: commandsJs,
      type: 'source',
      description: 'Custom command definitions'
    });
  }

  if (config.features.includes('webhooks')) {
    const webhookJs = `const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Webhook verification middleware
const verifyWebhook = (req, res, next) => {
  const signature = req.headers['x-webhook-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== \`sha256=\${expectedSignature}\`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Webhook endpoint
app.post('/webhook', verifyWebhook, (req, res) => {
  const { type, data } = req.body;
  
  // Process webhook data
  console.log('Received webhook:', type, data);
  
  // Send to Discord channel if needed
  // client.channels.cache.get(CHANNEL_ID).send(\`Webhook received: \${type}\`);
  
  res.json({ success: true });
});

const PORT = process.env.WEBHOOK_PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Webhook server running on port \${PORT}\`);
});

module.exports = app;`;

    files.push({
      path: 'src/webhook.js',
      content: webhookJs,
      type: 'source',
      description: 'Webhook server for external integrations'
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
      '3. Copy .env.example to .env and fill in your Discord bot token',
      '4. Create a Discord application at https://discord.com/developers/applications',
      '5. Create a bot and copy the token to your .env file',
      '6. Invite the bot to your server with appropriate permissions',
      '7. Run "npm run dev" to start development server',
      '8. Use slash commands in your Discord server to test the bot'
    ],
    estimatedTime: '2-4 hours',
    complexity: 'intermediate',
  };
}