import { BuildConfiguration, GeneratedSolution, GeneratedFile } from '@/types';
import { generateBasePackageJson, generateReadme, generateEnvExample, generateGitignore, generateDockerfile } from './index';

export async function generateTwitterBot(config: BuildConfiguration): Promise<GeneratedSolution> {
  const files: GeneratedFile[] = [];
  
  // Package.json
  const packageJson = {
    ...generateBasePackageJson(config),
    dependencies: {
      'twitter-api-v2': '^1.15.1',
      dotenv: '^16.3.1',
      'node-cron': '^3.0.2',
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
  const indexJs = `const { TwitterApi } = require('twitter-api-v2');
const dotenv = require('dotenv');
const cron = require('node-cron');
${config.priorities.includes('message-persistence') ? "const mongoose = require('mongoose');" : ''}
${config.priorities.includes('session-management') ? "const redis = require('redis');" : ''}
${config.features.includes('ai-integration') ? "const { OpenAI } = require('openai');" : ''}

dotenv.config();

// Initialize Twitter client
const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY,
  appSecret: process.env.TWITTER_CONSUMER_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Get read-write access
const rwClient = client.readWrite;

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

const tweetSchema = new mongoose.Schema({
  tweetId: String,
  userId: String,
  username: String,
  text: String,
  timestamp: { type: Date, default: Date.now },
  isRetweet: Boolean,
  replyToId: String,
  sessionId: String,
  sentiment: String,
  processed: { type: Boolean, default: false },
});

const Tweet = mongoose.model('Tweet', tweetSchema);
` : ''}

${config.features.includes('ai-integration') ? `
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
` : ''}

// Rate limiting tracker
const rateLimitTracker = {
  tweets: { count: 0, resetTime: Date.now() + 900000 }, // 15 minutes
  mentions: { count: 0, resetTime: Date.now() + 900000 },
};

function checkRateLimit(type, limit) {
  const tracker = rateLimitTracker[type];
  if (Date.now() > tracker.resetTime) {
    tracker.count = 0;
    tracker.resetTime = Date.now() + 900000;
  }
  
  if (tracker.count >= limit) {
    console.log(\`Rate limit reached for \${type}. Waiting...\`);
    return false;
  }
  
  tracker.count++;
  return true;
}

// Bot functionality
class TwitterBot {
  constructor() {
    this.lastMentionId = null;
    this.initialize();
  }
  
  async initialize() {
    console.log('Initializing Twitter Bot...');
    
    try {
      // Verify credentials
      const user = await rwClient.currentUser();
      console.log(\`Logged in as: @\${user.username} (\${user.name})\`);
      
      ${config.priorities.includes('rate-limiting') ? `
      // Set up rate limiting
      this.setupRateLimiting();
      ` : ''}
      
      // Start monitoring
      this.startMonitoring();
      
    } catch (error) {
      console.error('Failed to initialize:', error);
    }
  }
  
  async startMonitoring() {
    console.log('Starting mention monitoring...');
    
    // Monitor mentions every 60 seconds
    setInterval(async () => {
      await this.checkMentions();
    }, 60000);
    
    // Initial check
    await this.checkMentions();
  }
  
  async checkMentions() {
    if (!checkRateLimit('mentions', 75)) return;
    
    try {
      const mentions = await rwClient.v2.userMentionTimeline(
        (await rwClient.currentUser()).id,
        {
          max_results: 10,
          'tweet.fields': ['author_id', 'created_at', 'conversation_id'],
          'user.fields': ['username'],
          expansions: ['author_id'],
          since_id: this.lastMentionId
        }
      );
      
      if (mentions.data?.length) {
        for (const tweet of mentions.data) {
          await this.processMention(tweet, mentions.includes?.users);
        }
        
        this.lastMentionId = mentions.data[0].id;
      }
      
    } catch (error) {
      console.error('Error checking mentions:', error);
    }
  }
  
  async processMention(tweet, users) {
    const author = users?.find(u => u.id === tweet.author_id);
    const sessionId = \`twitter-\${tweet.author_id}\`;
    
    console.log(\`Processing mention from @\${author?.username}: \${tweet.text}\`);
    
    try {
      ${config.priorities.includes('message-persistence') ? `
      // Save tweet to database
      const newTweet = new Tweet({
        tweetId: tweet.id,
        userId: tweet.author_id,
        username: author?.username,
        text: tweet.text,
        replyToId: tweet.conversation_id,
        sessionId: sessionId,
      });
      
      await newTweet.save();
      ` : ''}
      
      ${config.priorities.includes('session-management') ? `
      // Update or create session
      const sessionData = await redisClient.get(\`session:\${sessionId}\`);
      const session = sessionData ? JSON.parse(sessionData) : {
        userId: tweet.author_id,
        username: author?.username,
        startedAt: Date.now(),
      };
      
      session.lastActivity = Date.now();
      session.mentionCount = (session.mentionCount || 0) + 1;
      await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(session));
      ` : ''}
      
      // Generate response
      let response = await this.generateResponse(tweet, author);
      
      ${config.features.includes('ai-integration') ? `
      // Use AI to generate smart response
      if (response.includes('[AI_RESPONSE]')) {
        response = await this.getAIResponse(tweet.text, author?.username);
      }
      ` : ''}
      
      // Reply to the mention
      if (response && checkRateLimit('tweets', 300)) {
        await rwClient.v2.reply(response, tweet.id);
        console.log(\`Replied to @\${author?.username}\`);
      }
      
    } catch (error) {
      console.error('Error processing mention:', error);
    }
  }
  
  async generateResponse(tweet, author) {
    const text = tweet.text.toLowerCase();
    
    // Simple response logic (customize as needed)
    if (text.includes('hello') || text.includes('hi')) {
      return \`Hello @\${author?.username}! Thanks for reaching out to ${config.projectName}.\`;
    }
    
    if (text.includes('help')) {
      return \`Hi @\${author?.username}! I'm ${config.projectName}, a chat session management bot. How can I assist you?\`;
    }
    
    if (text.includes('status')) {
      const uptime = Math.floor(process.uptime() / 3600);
      return \`Hi @\${author?.username}! Bot status: Running for \${uptime} hours. All systems operational!\`;
    }
    
    ${config.features.includes('custom-commands') ? `
    // Custom commands
    if (text.includes('!stats')) {
      return await this.getStats(author?.username);
    }
    ` : ''}
    
    ${config.features.includes('ai-integration') ? `
    // Default to AI response
    return '[AI_RESPONSE]';
    ` : `
    // Default response
    return \`Thanks for your message, @\${author?.username}! I'm ${config.projectName}.\`;
    `}
  }
  
  ${config.features.includes('ai-integration') ? `
  async getAIResponse(text, username) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are ${config.projectName}, a helpful Twitter bot. Keep responses under 280 characters and friendly. Always include the username in your response." 
          },
          { role: "user", content: \`@\${username} said: \${text}\` }
        ],
        max_tokens: 60
      });
      
      return completion.choices[0].message.content;
      
    } catch (error) {
      console.error('AI Error:', error);
      return \`Thanks for your message, @\${username}! I'm having trouble processing that right now.\`;
    }
  }
  ` : ''}
  
  ${config.features.includes('custom-commands') ? `
  async getStats(username) {
    try {
      ${config.priorities.includes('message-persistence') ? `
      const totalTweets = await Tweet.countDocuments();
      const userTweets = await Tweet.countDocuments({ username: username });
      return \`Hi @\${username}! Stats: \${totalTweets} total interactions, \${userTweets} from you.\`;
      ` : `
      return \`Hi @\${username}! Stats feature requires message persistence to be enabled.\`;
      `}
    } catch (error) {
      return \`Hi @\${username}! Error retrieving stats.\`;
    }
  }
  ` : ''}
  
  ${config.priorities.includes('analytics-logging') ? `
  async logAnalytics(event, data) {
    try {
      const analyticsData = {
        event,
        data,
        timestamp: new Date(),
        botId: '${config.projectName.toLowerCase()}',
      };
      
      // Log to console (in production, send to analytics service)
      console.log('Analytics:', JSON.stringify(analyticsData));
      
      // Store in Redis for temporary analytics
      await redisClient.lPush('analytics', JSON.stringify(analyticsData));
      await redisClient.lTrim('analytics', 0, 999); // Keep last 1000 events
      
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
  ` : ''}
  
  ${config.priorities.includes('rate-limiting') ? `
  setupRateLimiting() {
    // Monitor rate limit status
    setInterval(async () => {
      try {
        const limits = await rwClient.v1.rateLimitStatus();
        console.log('Rate limit status:', {
          mentions: limits.resources.statuses['/statuses/mentions_timeline'],
          tweets: limits.resources.statuses['/statuses/update'],
        });
      } catch (error) {
        console.error('Rate limit check error:', error);
      }
    }, 300000); // Check every 5 minutes
  }
  ` : ''}
}

${config.features.includes('webhooks') ? `
// Webhook server for external triggers
const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook/tweet', async (req, res) => {
  try {
    const { message, hashtags } = req.body;
    
    if (message && checkRateLimit('tweets', 300)) {
      let tweetText = message;
      if (hashtags && hashtags.length > 0) {
        tweetText += ' ' + hashtags.map(tag => \`#\${tag}\`).join(' ');
      }
      
      await rwClient.v2.tweet(tweetText);
      res.json({ success: true, message: 'Tweet posted' });
    } else {
      res.status(429).json({ error: 'Rate limit reached' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Failed to post tweet' });
  }
});

const PORT = process.env.WEBHOOK_PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Webhook server running on port \${PORT}\`);
});
` : ''}

// Scheduled tasks
${config.features.includes('custom-commands') ? `
// Daily status tweet (customize timing)
cron.schedule('0 9 * * *', async () => {
  if (checkRateLimit('tweets', 300)) {
    const uptime = Math.floor(process.uptime() / 86400);
    await rwClient.v2.tweet(\`Good morning! ${config.projectName} has been running for \${uptime} days. Have a great day! #bot #automation\`);
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
const bot = new TwitterBot();

console.log('Twitter bot started! Monitoring mentions...');`;

  files.push(
    { path: 'package.json', content: JSON.stringify(packageJson, null, 2), type: 'config', description: 'Package configuration with dependencies' },
    { path: 'index.js', content: indexJs, type: 'source', description: 'Main Twitter bot application' },
    { path: 'README.md', content: generateReadme(config), type: 'documentation', description: 'Project documentation' },
    { path: '.env.example', content: generateEnvExample(config), type: 'config', description: 'Environment variables template' },
    { path: '.gitignore', content: generateGitignore(), type: 'config', description: 'Git ignore rules' },
  );

  // Add analytics helper
  if (config.priorities.includes('analytics-logging')) {
    const analyticsJs = `// Twitter bot analytics utilities
class TwitterAnalytics {
  constructor(redisClient) {
    this.redis = redisClient;
  }
  
  async trackMention(userId, tweetId) {
    const key = \`analytics:mentions:\${new Date().toISOString().split('T')[0]}\`;
    await this.redis.incr(key);
    await this.redis.expire(key, 2592000); // 30 days
  }
  
  async trackResponse(userId, tweetId) {
    const key = \`analytics:responses:\${new Date().toISOString().split('T')[0]}\`;
    await this.redis.incr(key);
    await this.redis.expire(key, 2592000);
  }
  
  async getDailyStats(date = new Date()) {
    const dateStr = date.toISOString().split('T')[0];
    const mentions = await this.redis.get(\`analytics:mentions:\${dateStr}\`) || 0;
    const responses = await this.redis.get(\`analytics:responses:\${dateStr}\`) || 0;
    
    return {
      date: dateStr,
      mentions: parseInt(mentions),
      responses: parseInt(responses),
      responseRate: mentions > 0 ? (responses / mentions * 100).toFixed(2) : 0
    };
  }
  
  async getWeeklyStats() {
    const stats = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      stats.push(await this.getDailyStats(date));
    }
    return stats.reverse();
  }
}

module.exports = TwitterAnalytics;`;

    files.push({
      path: 'src/analytics.js',
      content: analyticsJs,
      type: 'source',
      description: 'Analytics tracking utilities'
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
      '2. Create a Twitter Developer account at https://developer.twitter.com',
      '3. Create a new app and generate API keys',
      '4. Enable read and write permissions for your app',
      '5. Copy .env.example to .env and fill in your Twitter API credentials',
      '6. Run "npm install" to install dependencies',
      '7. Run "npm run dev" to start the bot',
      '8. Mention your bot on Twitter to test functionality',
      '9. Monitor the console for bot activity and responses'
    ],
    estimatedTime: '2-4 hours',
    complexity: 'intermediate',
  };
}