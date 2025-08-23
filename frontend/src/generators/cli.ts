import { BuildConfiguration, GeneratedSolution, GeneratedFile } from '@/types';
import { generateBasePackageJson, generateReadme, generateEnvExample, generateGitignore, generateDockerfile } from './index';

export async function generateCLI(config: BuildConfiguration): Promise<GeneratedSolution> {
  const files: GeneratedFile[] = [];
  
  // Package.json
  const packageJson = {
    ...generateBasePackageJson(config),
    bin: {
      [config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')]: './bin/cli.js'
    },
    dependencies: {
      commander: '^11.0.0',
      inquirer: '^9.2.8',
      chalk: '^5.3.0',
      'cli-table3': '^0.6.3',
      'ora': '^6.3.1',
      dotenv: '^16.3.1',
      ...(config.priorities.includes('message-persistence') && {
        'better-sqlite3': '^8.14.2',
      }),
      ...(config.features.includes('ai-integration') && {
        openai: '^3.3.0',
      }),
      ...(config.features.includes('backup-restore') && {
        'node-tar': '^6.1.15',
      }),
    },
  };

  // Main CLI entry point
  const cliJs = `#!/usr/bin/env node

const { Command } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const dotenv = require('dotenv');
const ChatManager = require('../src/chatManager');
const SessionManager = require('../src/sessionManager');
const { version } = require('../package.json');

dotenv.config();

const program = new Command();

program
  .name('${config.projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}')
  .description('${config.description}')
  .version(version);

// Initialize managers
const chatManager = new ChatManager();
const sessionManager = new SessionManager();

// Main interactive mode
program
  .command('start')
  .description('Start interactive chat session manager')
  .option('-u, --user <username>', 'Set username')
  .option('-s, --session <sessionId>', 'Resume existing session')
  .action(async (options) => {
    console.log(chalk.blue.bold(\`Welcome to \${chalk.cyan('${config.projectName}')}\`));
    console.log(chalk.gray('Type "help" for commands or "exit" to quit\\n'));
    
    let username = options.user;
    let sessionId = options.session;
    
    if (!username) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: 'Enter your username:',
          validate: (input) => input.length > 0 || 'Username is required'
        }
      ]);
      username = answers.username;
    }
    
    if (!sessionId) {
      sessionId = await sessionManager.createSession(username);
    }
    
    console.log(chalk.green(\`Session started: \${sessionId}\`));
    console.log(chalk.gray(\`User: \${username}\\n\`));
    
    await startInteractiveSession(username, sessionId);
  });

// List sessions
program
  .command('sessions')
  .description('List all chat sessions')
  .option('-a, --active', 'Show only active sessions')
  .action(async (options) => {
    const spinner = ora('Loading sessions...').start();
    
    try {
      const sessions = await sessionManager.listSessions(options.active);
      spinner.stop();
      
      if (sessions.length === 0) {
        console.log(chalk.yellow('No sessions found'));
        return;
      }
      
      console.log(chalk.blue.bold('Chat Sessions:'));
      sessions.forEach(session => {
        const status = session.isActive ? chalk.green('Active') : chalk.red('Inactive');
        const duration = new Date(Date.now() - new Date(session.startTime)).toISOString().substr(11, 8);
        console.log(\`\${chalk.cyan(session.sessionId)} - \${session.username} [\${status}] (\${duration})\`);
      });
      
    } catch (error) {
      spinner.fail('Error loading sessions');
      console.error(chalk.red(error.message));
    }
  });

// Show session details
program
  .command('session <sessionId>')
  .description('Show detailed session information')
  .action(async (sessionId) => {
    const spinner = ora('Loading session details...').start();
    
    try {
      const session = await sessionManager.getSession(sessionId);
      const messages = await chatManager.getSessionMessages(sessionId);
      spinner.stop();
      
      if (!session) {
        console.log(chalk.red('Session not found'));
        return;
      }
      
      console.log(chalk.blue.bold('Session Details:'));
      console.log(\`ID: \${chalk.cyan(session.sessionId)}\`);
      console.log(\`User: \${chalk.green(session.username)}\`);
      console.log(\`Status: \${session.isActive ? chalk.green('Active') : chalk.red('Inactive')}\`);
      console.log(\`Started: \${new Date(session.startTime).toLocaleString()}\`);
      console.log(\`Messages: \${messages.length}\\n\`);
      
      if (messages.length > 0) {
        console.log(chalk.blue.bold('Recent Messages:'));
        messages.slice(-10).forEach(msg => {
          const time = new Date(msg.timestamp).toLocaleTimeString();
          console.log(\`[\${chalk.gray(time)}] \${chalk.cyan(msg.username)}: \${msg.content}\`);
        });
      }
      
    } catch (error) {
      spinner.fail('Error loading session');
      console.error(chalk.red(error.message));
    }
  });

${config.features.includes('backup-restore') ? `
// Backup command
program
  .command('backup <outputPath>')
  .description('Backup chat data')
  .option('-s, --session <sessionId>', 'Backup specific session')
  .action(async (outputPath, options) => {
    const spinner = ora('Creating backup...').start();
    
    try {
      await chatManager.createBackup(outputPath, options.session);
      spinner.succeed(\`Backup created: \${outputPath}\`);
    } catch (error) {
      spinner.fail('Backup failed');
      console.error(chalk.red(error.message));
    }
  });

// Restore command
program
  .command('restore <backupPath>')
  .description('Restore chat data from backup')
  .option('-c, --confirm', 'Skip confirmation prompt')
  .action(async (backupPath, options) => {
    if (!options.confirm) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'This will overwrite existing data. Continue?',
          default: false
        }
      ]);
      
      if (!answers.proceed) {
        console.log('Restore cancelled');
        return;
      }
    }
    
    const spinner = ora('Restoring backup...').start();
    
    try {
      await chatManager.restoreBackup(backupPath);
      spinner.succeed('Backup restored successfully');
    } catch (error) {
      spinner.fail('Restore failed');
      console.error(chalk.red(error.message));
    }
  });
` : ''}

${config.priorities.includes('analytics-logging') ? `
// Analytics command
program
  .command('stats')
  .description('Show chat statistics')
  .option('-s, --session <sessionId>', 'Stats for specific session')
  .action(async (options) => {
    const spinner = ora('Calculating statistics...').start();
    
    try {
      const stats = await chatManager.getStatistics(options.session);
      spinner.stop();
      
      console.log(chalk.blue.bold('Chat Statistics:'));
      console.log(\`Total Sessions: \${chalk.cyan(stats.totalSessions)}\`);
      console.log(\`Active Sessions: \${chalk.green(stats.activeSessions)}\`);
      console.log(\`Total Messages: \${chalk.cyan(stats.totalMessages)}\`);
      console.log(\`Unique Users: \${chalk.cyan(stats.uniqueUsers)}\`);
      
      if (stats.topUsers?.length > 0) {
        console.log('\\n' + chalk.blue.bold('Most Active Users:'));
        stats.topUsers.forEach((user, index) => {
          console.log(\`\${index + 1}. \${chalk.cyan(user.username)} - \${user.messageCount} messages\`);
        });
      }
      
    } catch (error) {
      spinner.fail('Error calculating statistics');
      console.error(chalk.red(error.message));
    }
  });
` : ''}

// Help command
program
  .command('help-commands')
  .description('Show interactive mode commands')
  .action(() => {
    console.log(chalk.blue.bold('Interactive Mode Commands:'));
    console.log('  help                 - Show this help');
    console.log('  exit, quit           - Exit the application');
    console.log('  clear                - Clear screen');
    console.log('  whoami               - Show current user');
    console.log('  sessions             - List active sessions');
    console.log('  switch <sessionId>   - Switch to another session');
    ${config.features.includes('context-awareness') ? "console.log('  context              - Show conversation context');" : ''}
    ${config.features.includes('custom-commands') ? "console.log('  /command [args]      - Run custom commands');" : ''}
    ${config.features.includes('ai-integration') ? "console.log('  /ai <question>       - Ask AI assistant');" : ''}
    console.log('  history              - Show message history');
  });

async function startInteractiveSession(username, sessionId) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green(\`[\${username}] > \`)
  });
  
  let currentSession = sessionId;
  
  rl.prompt();
  
  rl.on('line', async (input) => {
    const command = input.trim();
    
    if (!command) {
      rl.prompt();
      return;
    }
    
    try {
      await handleCommand(command, username, currentSession, rl);
    } catch (error) {
      console.log(chalk.red(\`Error: \${error.message}\`));
    }
    
    rl.prompt();
  });
  
  rl.on('close', () => {
    console.log(chalk.yellow('\\nGoodbye!'));
    process.exit(0);
  });
}

async function handleCommand(command, username, sessionId, rl) {
  const args = command.split(' ');
  const cmd = args[0].toLowerCase();
  
  switch (cmd) {
    case 'help':
      console.log(chalk.blue.bold('Available Commands:'));
      console.log('  help, exit, clear, whoami, sessions, switch, history');
      ${config.features.includes('context-awareness') ? "console.log('  context - Show conversation context');" : ''}
      ${config.features.includes('custom-commands') ? "console.log('  /command - Run custom commands');" : ''}
      ${config.features.includes('ai-integration') ? "console.log('  /ai - Ask AI assistant');" : ''}
      break;
      
    case 'exit':
    case 'quit':
      rl.close();
      break;
      
    case 'clear':
      console.clear();
      break;
      
    case 'whoami':
      console.log(\`Current user: \${chalk.cyan(username)}\`);
      console.log(\`Session ID: \${chalk.gray(sessionId)}\`);
      break;
      
    case 'sessions':
      const sessions = await sessionManager.listSessions(true);
      console.log(chalk.blue.bold('Active Sessions:'));
      sessions.forEach(s => {
        const current = s.sessionId === sessionId ? chalk.green(' (current)') : '';
        console.log(\`  \${chalk.cyan(s.sessionId)} - \${s.username}\${current}\`);
      });
      break;
      
    case 'history':
      const messages = await chatManager.getSessionMessages(sessionId, 20);
      console.log(chalk.blue.bold('Message History:'));
      messages.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString();
        console.log(\`[\${chalk.gray(time)}] \${chalk.cyan(msg.username)}: \${msg.content}\`);
      });
      break;
      
    ${config.features.includes('context-awareness') ? `
    case 'context':
      const context = await chatManager.getConversationContext(sessionId);
      console.log(chalk.blue.bold('Conversation Context:'));
      if (context.length > 0) {
        context.forEach(item => {
          console.log(\`  \${chalk.cyan(item.type)}: \${item.content}\`);
        });
      } else {
        console.log(chalk.gray('  No context available'));
      }
      break;
    ` : ''}
      
    ${config.features.includes('ai-integration') ? `
    default:
      if (command.startsWith('/ai ')) {
        const question = command.slice(4);
        const spinner = ora('AI is thinking...').start();
        
        try {
          const response = await chatManager.askAI(question, username);
          spinner.stop();
          console.log(chalk.magenta(\`AI: \${response}\`));
          
          // Save AI interaction
          await chatManager.saveMessage(sessionId, 'AI', response, 'ai');
          
        } catch (error) {
          spinner.fail('AI request failed');
          console.log(chalk.red(\`AI Error: \${error.message}\`));
        }
      } else {
        // Regular message
        await chatManager.saveMessage(sessionId, username, command);
        console.log(chalk.green('Message saved'));
      }
      break;
    ` : `
    default:
      // Regular message
      await chatManager.saveMessage(sessionId, username, command);
      console.log(chalk.green('Message saved'));
      break;
    `}
  }
}

program.parse();`;

  files.push(
    { path: 'package.json', content: JSON.stringify(packageJson, null, 2), type: 'config', description: 'Package configuration with CLI binary' },
    { path: 'bin/cli.js', content: cliJs, type: 'script', description: 'Main CLI application entry point' },
    { path: 'README.md', content: generateReadme(config), type: 'documentation', description: 'Project documentation' },
    { path: '.env.example', content: generateEnvExample(config), type: 'config', description: 'Environment variables template' },
    { path: '.gitignore', content: generateGitignore(), type: 'config', description: 'Git ignore rules' },
  );

  // Chat Manager
  const chatManagerJs = `const path = require('path');
${config.priorities.includes('message-persistence') ? "const Database = require('./database');" : ''}
${config.features.includes('ai-integration') ? "const { OpenAI } = require('openai');" : ''}
${config.features.includes('backup-restore') ? "const tar = require('node-tar');" : ''}
${config.features.includes('backup-restore') ? "const fs = require('fs').promises;" : ''}

class ChatManager {
  constructor() {
    ${config.priorities.includes('message-persistence') ? "this.db = new Database();" : "this.messages = new Map(); // In-memory storage"}
    ${config.features.includes('ai-integration') ? `
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    ` : ''}
  }
  
  async saveMessage(sessionId, username, content, type = 'text') {
    const message = {
      id: Date.now().toString(),
      sessionId,
      username,
      content,
      type,
      timestamp: new Date().toISOString(),
    };
    
    ${config.priorities.includes('message-persistence') ? `
    await this.db.saveMessage(message);
    ` : `
    if (!this.messages.has(sessionId)) {
      this.messages.set(sessionId, []);
    }
    this.messages.get(sessionId).push(message);
    `}
    
    return message;
  }
  
  async getSessionMessages(sessionId, limit = 100) {
    ${config.priorities.includes('message-persistence') ? `
    return await this.db.getMessages(sessionId, limit);
    ` : `
    const messages = this.messages.get(sessionId) || [];
    return messages.slice(-limit);
    `}
  }
  
  ${config.features.includes('context-awareness') ? `
  async getConversationContext(sessionId) {
    const messages = await this.getSessionMessages(sessionId, 10);
    const context = [];
    
    // Analyze message patterns
    const userMessages = messages.filter(m => m.type === 'text');
    if (userMessages.length > 0) {
      context.push({
        type: 'recent_activity',
        content: \`\${userMessages.length} messages in conversation\`
      });
    }
    
    // Find questions
    const questions = messages.filter(m => m.content.includes('?'));
    if (questions.length > 0) {
      context.push({
        type: 'questions',
        content: \`\${questions.length} questions asked\`
      });
    }
    
    return context;
  }
  ` : ''}
  
  ${config.features.includes('ai-integration') ? `
  async askAI(question, username) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: "system", 
            content: "You are a helpful assistant integrated into a CLI chat application called ${config.projectName}. Keep responses concise and helpful." 
          },
          { role: "user", content: \`\${username} asks: \${question}\` }
        ],
        max_tokens: 200
      });
      
      return completion.choices[0].message.content;
      
    } catch (error) {
      throw new Error(\`AI request failed: \${error.message}\`);
    }
  }
  ` : ''}
  
  ${config.priorities.includes('analytics-logging') ? `
  async getStatistics(sessionId = null) {
    ${config.priorities.includes('message-persistence') ? `
    return await this.db.getStatistics(sessionId);
    ` : `
    const allMessages = Array.from(this.messages.values()).flat();
    const sessions = Array.from(this.messages.keys());
    
    const stats = {
      totalSessions: sessions.length,
      activeSessions: sessions.length, // All are active in memory
      totalMessages: allMessages.length,
      uniqueUsers: [...new Set(allMessages.map(m => m.username))].length,
    };
    
    if (sessionId) {
      const sessionMessages = this.messages.get(sessionId) || [];
      stats.sessionMessages = sessionMessages.length;
    }
    
    return stats;
    `}
  }
  ` : ''}
  
  ${config.features.includes('backup-restore') ? `
  async createBackup(outputPath, sessionId = null) {
    ${config.priorities.includes('message-persistence') ? `
    const data = await this.db.exportData(sessionId);
    ` : `
    const data = sessionId 
      ? { [sessionId]: this.messages.get(sessionId) || [] }
      : Object.fromEntries(this.messages);
    `}
    
    const backupData = {
      timestamp: new Date().toISOString(),
      version: require('../package.json').version,
      data: data
    };
    
    await fs.writeFile(outputPath, JSON.stringify(backupData, null, 2));
  }
  
  async restoreBackup(backupPath) {
    const backupContent = await fs.readFile(backupPath, 'utf8');
    const backup = JSON.parse(backupContent);
    
    ${config.priorities.includes('message-persistence') ? `
    await this.db.importData(backup.data);
    ` : `
    this.messages.clear();
    for (const [sessionId, messages] of Object.entries(backup.data)) {
      this.messages.set(sessionId, messages);
    }
    `}
  }
  ` : ''}
}

module.exports = ChatManager;`;

  // Session Manager
  const sessionManagerJs = `${config.priorities.includes('message-persistence') ? "const Database = require('./database');" : ''}

class SessionManager {
  constructor() {
    ${config.priorities.includes('message-persistence') ? "this.db = new Database();" : "this.sessions = new Map();"}
  }
  
  async createSession(username) {
    const sessionId = \`session-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
    const session = {
      sessionId,
      username,
      startTime: new Date().toISOString(),
      isActive: true,
      messageCount: 0,
    };
    
    ${config.priorities.includes('message-persistence') ? `
    await this.db.saveSession(session);
    ` : `
    this.sessions.set(sessionId, session);
    `}
    
    return sessionId;
  }
  
  async getSession(sessionId) {
    ${config.priorities.includes('message-persistence') ? `
    return await this.db.getSession(sessionId);
    ` : `
    return this.sessions.get(sessionId);
    `}
  }
  
  async listSessions(activeOnly = false) {
    ${config.priorities.includes('message-persistence') ? `
    return await this.db.listSessions(activeOnly);
    ` : `
    const sessions = Array.from(this.sessions.values());
    return activeOnly ? sessions.filter(s => s.isActive) : sessions;
    `}
  }
  
  async updateSession(sessionId, updates) {
    ${config.priorities.includes('message-persistence') ? `
    await this.db.updateSession(sessionId, updates);
    ` : `
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
    }
    `}
  }
  
  async endSession(sessionId) {
    await this.updateSession(sessionId, { 
      isActive: false, 
      endTime: new Date().toISOString() 
    });
  }
}

module.exports = SessionManager;`;

  files.push(
    { path: 'src/chatManager.js', content: chatManagerJs, type: 'source', description: 'Chat management functionality' },
    { path: 'src/sessionManager.js', content: sessionManagerJs, type: 'source', description: 'Session management functionality' }
  );

  // Database module (if persistence enabled)
  if (config.priorities.includes('message-persistence')) {
    const databaseJs = `const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
  constructor() {
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'chat.db');
    this.db = new Database(dbPath);
    this.init();
  }
  
  init() {
    // Create tables
    this.db.exec(\`
      CREATE TABLE IF NOT EXISTS sessions (
        sessionId TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT,
        isActive INTEGER DEFAULT 1,
        messageCount INTEGER DEFAULT 0,
        metadata TEXT
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        sessionId TEXT NOT NULL,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'text',
        timestamp TEXT NOT NULL,
        FOREIGN KEY (sessionId) REFERENCES sessions (sessionId)
      );
      
      CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(sessionId);
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
    \`);
  }
  
  async saveSession(session) {
    const stmt = this.db.prepare(\`
      INSERT OR REPLACE INTO sessions 
      (sessionId, username, startTime, isActive, messageCount, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    \`);
    
    stmt.run(
      session.sessionId,
      session.username,
      session.startTime,
      session.isActive ? 1 : 0,
      session.messageCount || 0,
      JSON.stringify(session.metadata || {})
    );
  }
  
  async getSession(sessionId) {
    const stmt = this.db.prepare('SELECT * FROM sessions WHERE sessionId = ?');
    const row = stmt.get(sessionId);
    
    if (row) {
      return {
        ...row,
        isActive: Boolean(row.isActive),
        metadata: JSON.parse(row.metadata || '{}')
      };
    }
    
    return null;
  }
  
  async listSessions(activeOnly = false) {
    const sql = activeOnly 
      ? 'SELECT * FROM sessions WHERE isActive = 1 ORDER BY startTime DESC'
      : 'SELECT * FROM sessions ORDER BY startTime DESC';
      
    const stmt = this.db.prepare(sql);
    const rows = stmt.all();
    
    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
      metadata: JSON.parse(row.metadata || '{}')
    }));
  }
  
  async updateSession(sessionId, updates) {
    const session = await this.getSession(sessionId);
    if (!session) return;
    
    const updated = { ...session, ...updates };
    await this.saveSession(updated);
  }
  
  async saveMessage(message) {
    const stmt = this.db.prepare(\`
      INSERT INTO messages (id, sessionId, username, content, type, timestamp)
      VALUES (?, ?, ?, ?, ?, ?)
    \`);
    
    stmt.run(
      message.id,
      message.sessionId,
      message.username,
      message.content,
      message.type,
      message.timestamp
    );
    
    // Update session message count
    const updateStmt = this.db.prepare(\`
      UPDATE sessions 
      SET messageCount = messageCount + 1 
      WHERE sessionId = ?
    \`);
    updateStmt.run(message.sessionId);
  }
  
  async getMessages(sessionId, limit = 100) {
    const stmt = this.db.prepare(\`
      SELECT * FROM messages 
      WHERE sessionId = ? 
      ORDER BY timestamp DESC 
      LIMIT ?
    \`);
    
    return stmt.all(sessionId, limit).reverse();
  }
  
  async getStatistics(sessionId = null) {
    if (sessionId) {
      const session = await this.getSession(sessionId);
      const messages = await this.getMessages(sessionId);
      
      return {
        sessionId,
        messageCount: messages.length,
        username: session?.username,
        startTime: session?.startTime,
        isActive: session?.isActive
      };
    }
    
    const stats = {
      totalSessions: this.db.prepare('SELECT COUNT(*) as count FROM sessions').get().count,
      activeSessions: this.db.prepare('SELECT COUNT(*) as count FROM sessions WHERE isActive = 1').get().count,
      totalMessages: this.db.prepare('SELECT COUNT(*) as count FROM messages').get().count,
      uniqueUsers: this.db.prepare('SELECT COUNT(DISTINCT username) as count FROM sessions').get().count,
    };
    
    // Top users by message count
    const topUsers = this.db.prepare(\`
      SELECT username, COUNT(*) as messageCount 
      FROM messages 
      GROUP BY username 
      ORDER BY messageCount DESC 
      LIMIT 5
    \`).all();
    
    stats.topUsers = topUsers;
    
    return stats;
  }
  
  async exportData(sessionId = null) {
    if (sessionId) {
      const session = await this.getSession(sessionId);
      const messages = await this.getMessages(sessionId);
      return { [sessionId]: { session, messages } };
    }
    
    const sessions = await this.listSessions();
    const data = {};
    
    for (const session of sessions) {
      const messages = await this.getMessages(session.sessionId);
      data[session.sessionId] = { session, messages };
    }
    
    return data;
  }
  
  async importData(data) {
    // Clear existing data
    this.db.exec('DELETE FROM messages; DELETE FROM sessions;');
    
    for (const [sessionId, sessionData] of Object.entries(data)) {
      await this.saveSession(sessionData.session);
      
      if (sessionData.messages) {
        for (const message of sessionData.messages) {
          await this.saveMessage(message);
        }
      }
    }
  }
}

module.exports = DatabaseManager;`;

    files.push({
      path: 'src/database.js',
      content: databaseJs,
      type: 'source',
      description: 'SQLite database management'
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
      '3. Copy .env.example to .env and configure as needed',
      '4. Run "npm link" to install CLI globally (optional)',
      '5. Run the CLI with: npx . start (or your-cli-name start if linked)',
      '6. Follow the interactive prompts to start chatting',
      '7. Use "help" command to see available options',
      '8. Use "sessions" to manage multiple chat sessions',
      '9. Type "exit" to quit the application'
    ],
    estimatedTime: '1-2 hours',
    complexity: 'basic',
  };
}