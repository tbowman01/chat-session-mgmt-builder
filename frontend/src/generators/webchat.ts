import { BuildConfiguration, GeneratedSolution, GeneratedFile } from '@/types';
import { generateBasePackageJson, generateReadme, generateEnvExample, generateGitignore, generateDockerfile } from './index';

export async function generateWebChat(config: BuildConfiguration): Promise<GeneratedSolution> {
  const files: GeneratedFile[] = [];
  
  // Package.json
  const packageJson = {
    ...generateBasePackageJson(config),
    dependencies: {
      express: '^4.18.2',
      'socket.io': '^4.7.2',
      cors: '^2.8.5',
      helmet: '^7.0.0',
      dotenv: '^16.3.1',
      uuid: '^9.0.0',
      ...(config.priorities.includes('message-persistence') && {
        mongoose: '^7.4.1',
      }),
      ...(config.priorities.includes('session-management') && {
        redis: '^4.6.7',
      }),
      ...(config.priorities.includes('user-authentication') && {
        jsonwebtoken: '^9.0.1',
        bcryptjs: '^2.4.3',
      }),
      ...(config.features.includes('ai-integration') && {
        openai: '^3.3.0',
      }),
      ...(config.features.includes('file-attachments') && {
        multer: '^1.4.5-lts.1',
      }),
    },
  };

  // Main server.js
  const serverJs = `const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
${config.priorities.includes('message-persistence') ? "const mongoose = require('mongoose');" : ''}
${config.priorities.includes('session-management') ? "const redis = require('redis');" : ''}
${config.priorities.includes('user-authentication') ? "const jwt = require('jsonwebtoken');" : ''}
${config.priorities.includes('user-authentication') ? "const bcrypt = require('bcryptjs');" : ''}
${config.features.includes('ai-integration') ? "const { OpenAI } = require('openai');" : ''}
${config.features.includes('file-attachments') ? "const multer = require('multer');" : ''}

dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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
  messageId: { type: String, unique: true },
  sessionId: String,
  userId: String,
  username: String,
  content: String,
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  timestamp: { type: Date, default: Date.now },
  roomId: String,
  isSystem: { type: Boolean, default: false },
});

const Message = mongoose.model('Message', messageSchema);

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true },
  userId: String,
  username: String,
  roomId: String,
  startTime: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  metadata: Object,
});

const Session = mongoose.model('Session', sessionSchema);
` : ''}

${config.priorities.includes('user-authentication') ? `
const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  passwordHash: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model('User', userSchema);
` : ''}

${config.features.includes('ai-integration') ? `
// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
` : ''}

${config.features.includes('file-attachments') ? `
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add file type validation if needed
    cb(null, true);
  }
});
` : ''}

// In-memory storage for demo (use Redis/Database in production)
const activeSessions = new Map();
const activeRooms = new Map();

// Rate limiting
const rateLimitMap = new Map();
const RATE_LIMIT = 10; // messages per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(sessionId) {
  const now = Date.now();
  const userLimit = rateLimitMap.get(sessionId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + RATE_LIMIT_WINDOW;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  rateLimitMap.set(sessionId, userLimit);
  return true;
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.on('join-chat', async (data) => {
    try {
      const { username, roomId = 'general' } = data;
      const sessionId = uuidv4();
      
      // Store session info
      const sessionData = {
        sessionId,
        userId: socket.id,
        username,
        roomId,
        joinTime: new Date(),
      };
      
      activeSessions.set(socket.id, sessionData);
      socket.join(roomId);
      
      ${config.priorities.includes('session-management') ? `
      // Store in Redis
      await redisClient.setEx(\`session:\${sessionId}\`, 3600, JSON.stringify(sessionData));
      ` : ''}
      
      ${config.priorities.includes('message-persistence') ? `
      // Save session to database
      const session = new Session(sessionData);
      await session.save();
      ` : ''}
      
      // Notify room
      socket.to(roomId).emit('user-joined', {
        username,
        message: \`\${username} joined the chat\`,
        timestamp: new Date(),
      });
      
      // Send session info back to client
      socket.emit('session-created', { sessionId, roomId });
      
      console.log(\`User \${username} joined room \${roomId}\`);
      
    } catch (error) {
      console.error('Error joining chat:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });
  
  socket.on('send-message', async (data) => {
    try {
      const session = activeSessions.get(socket.id);
      if (!session) {
        socket.emit('error', { message: 'No active session' });
        return;
      }
      
      const { content, type = 'text' } = data;
      
      // Rate limiting
      if (!checkRateLimit(session.sessionId)) {
        socket.emit('error', { message: 'Rate limit exceeded. Please slow down.' });
        return;
      }
      
      const messageData = {
        messageId: uuidv4(),
        sessionId: session.sessionId,
        userId: session.userId,
        username: session.username,
        content,
        type,
        timestamp: new Date(),
        roomId: session.roomId,
      };
      
      ${config.priorities.includes('message-persistence') ? `
      // Save message to database
      const message = new Message(messageData);
      await message.save();
      ` : ''}
      
      // Broadcast message to room
      io.to(session.roomId).emit('new-message', messageData);
      
      ${config.features.includes('ai-integration') ? `
      // AI auto-response (if enabled for the room)
      if (content.toLowerCase().includes('bot') || content.startsWith('/ai')) {
        const aiResponse = await generateAIResponse(content, session.username);
        if (aiResponse) {
          const botMessage = {
            messageId: uuidv4(),
            sessionId: 'bot-session',
            userId: 'bot',
            username: 'ChatBot',
            content: aiResponse,
            type: 'text',
            timestamp: new Date(),
            roomId: session.roomId,
            isSystem: true,
          };
          
          io.to(session.roomId).emit('new-message', botMessage);
          
          ${config.priorities.includes('message-persistence') ? `
          const botMessageDoc = new Message(botMessage);
          await botMessageDoc.save();
          ` : ''}
        }
      }
      ` : ''}
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });
  
  ${config.features.includes('conversation-branching') ? `
  socket.on('create-thread', async (data) => {
    try {
      const session = activeSessions.get(socket.id);
      if (!session) return;
      
      const { parentMessageId, threadName } = data;
      const threadId = \`thread-\${uuidv4()}\`;
      
      socket.join(threadId);
      
      const threadData = {
        threadId,
        parentMessageId,
        threadName: threadName || 'New Thread',
        createdBy: session.username,
        roomId: session.roomId,
        createdAt: new Date(),
      };
      
      socket.emit('thread-created', threadData);
      socket.to(session.roomId).emit('thread-available', threadData);
      
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  });
  ` : ''}
  
  socket.on('typing-start', () => {
    const session = activeSessions.get(socket.id);
    if (session) {
      socket.to(session.roomId).emit('user-typing', {
        username: session.username,
        isTyping: true,
      });
    }
  });
  
  socket.on('typing-stop', () => {
    const session = activeSessions.get(socket.id);
    if (session) {
      socket.to(session.roomId).emit('user-typing', {
        username: session.username,
        isTyping: false,
      });
    }
  });
  
  socket.on('disconnect', async () => {
    try {
      const session = activeSessions.get(socket.id);
      if (session) {
        // Notify room
        socket.to(session.roomId).emit('user-left', {
          username: session.username,
          message: \`\${session.username} left the chat\`,
          timestamp: new Date(),
        });
        
        ${config.priorities.includes('session-management') ? `
        // Update session status
        await redisClient.del(\`session:\${session.sessionId}\`);
        ` : ''}
        
        ${config.priorities.includes('message-persistence') ? `
        // Update session in database
        await Session.findOneAndUpdate(
          { sessionId: session.sessionId },
          { isActive: false, lastActivity: new Date() }
        );
        ` : ''}
        
        activeSessions.delete(socket.id);
      }
      
      console.log('Client disconnected:', socket.id);
      
    } catch (error) {
      console.error('Error handling disconnect:', error);
    }
  });
});

${config.features.includes('ai-integration') ? `
// AI Response Generator
async function generateAIResponse(message, username) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful chat assistant. Keep responses concise and friendly. You're integrated into a web chat application called ${config.projectName}." 
        },
        { role: "user", content: \`\${username} said: \${message}\` }
      ],
      max_tokens: 150
    });
    
    return completion.choices[0].message.content;
    
  } catch (error) {
    console.error('AI Error:', error);
    return null;
  }
}
` : ''}

// REST API Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

${config.priorities.includes('message-persistence') ? `
// Get chat history
app.get('/api/messages/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    
    const messages = await Message.find({ roomId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    res.json({ messages: messages.reverse() });
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
` : ''}

${config.features.includes('file-attachments') ? `
// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = \`/uploads/\${req.file.filename}\`;
    
    res.json({
      success: true,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));
` : ''}

${config.priorities.includes('error-handling') ? `
// Analytics endpoint
app.get('/api/analytics', async (req, res) => {
  try {
    const stats = {
      activeSessions: activeSessions.size,
      totalRooms: activeRooms.size,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };
    
    ${config.priorities.includes('message-persistence') ? `
    const totalMessages = await Message.countDocuments();
    const totalUsers = await Session.distinct('username').then(users => users.length);
    
    stats.totalMessages = totalMessages;
    stats.totalUsers = totalUsers;
    ` : ''}
    
    res.json(stats);
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});
` : ''}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date(),
    uptime: process.uptime() 
  });
});

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(\`Web chat server running on port \${PORT}\`);
  console.log(\`Visit http://localhost:\${PORT} to test the chat\`);
});`;

  files.push(
    { path: 'package.json', content: JSON.stringify(packageJson, null, 2), type: 'config', description: 'Package configuration with dependencies' },
    { path: 'server.js', content: serverJs, type: 'source', description: 'Main web chat server application' },
    { path: 'README.md', content: generateReadme(config), type: 'documentation', description: 'Project documentation' },
    { path: '.env.example', content: generateEnvExample(config), type: 'config', description: 'Environment variables template' },
    { path: '.gitignore', content: generateGitignore(), type: 'config', description: 'Git ignore rules' },
  );

  // Add client-side HTML/CSS/JS
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.projectName} - Web Chat</title>
    <script src="/socket.io/socket.io.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; height: 100vh; display: flex; flex-direction: column; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { padding: 20px; background: #007bff; color: white; text-align: center; }
        .chat-container { flex: 1; display: flex; flex-direction: column; }
        .messages { flex: 1; padding: 20px; overflow-y: auto; max-height: 400px; }
        .message { margin-bottom: 15px; padding: 10px; border-radius: 8px; }
        .message.own { background: #007bff; color: white; margin-left: 50px; }
        .message.other { background: #e9ecef; margin-right: 50px; }
        .message.system { background: #ffc107; text-align: center; margin: 10px 0; font-style: italic; }
        .message-info { font-size: 12px; opacity: 0.7; margin-bottom: 5px; }
        .input-container { padding: 20px; border-top: 1px solid #dee2e6; display: flex; gap: 10px; }
        .message-input { flex: 1; padding: 12px; border: 1px solid #dee2e6; border-radius: 25px; outline: none; }
        .send-button { padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 25px; cursor: pointer; }
        .send-button:hover { background: #0056b3; }
        .typing-indicator { padding: 10px 20px; font-style: italic; color: #666; font-size: 14px; }
        .join-form { padding: 40px; text-align: center; }
        .join-input { padding: 12px; margin: 10px; border: 1px solid #dee2e6; border-radius: 5px; width: 200px; }
        .join-button { padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${config.projectName}</h1>
            <p>Real-time Web Chat Application</p>
        </div>
        
        <div id="joinForm" class="join-form">
            <h2>Join the Chat</h2>
            <input type="text" id="usernameInput" class="join-input" placeholder="Enter your username" maxlength="20">
            <input type="text" id="roomInput" class="join-input" placeholder="Room (optional)" maxlength="20">
            <button id="joinButton" class="join-button">Join Chat</button>
        </div>
        
        <div id="chatContainer" class="chat-container hidden">
            <div id="messages" class="messages"></div>
            <div id="typingIndicator" class="typing-indicator"></div>
            <div class="input-container">
                <input type="text" id="messageInput" class="message-input" placeholder="Type your message..." maxlength="500">
                <button id="sendButton" class="send-button">Send</button>
            </div>
        </div>
    </div>

    <script src="client.js"></script>
</body>
</html>`;

  const clientJs = `// Client-side Socket.IO chat application
let socket;
let currentSession = null;
let typingTimer;

// DOM elements
const joinForm = document.getElementById('joinForm');
const chatContainer = document.getElementById('chatContainer');
const usernameInput = document.getElementById('usernameInput');
const roomInput = document.getElementById('roomInput');
const joinButton = document.getElementById('joinButton');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    joinButton.addEventListener('click', joinChat);
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        } else {
            handleTyping();
        }
    });
    
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinChat();
    });
    
    roomInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinChat();
    });
}

function joinChat() {
    const username = usernameInput.value.trim();
    const room = roomInput.value.trim() || 'general';
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    // Initialize socket connection
    socket = io();
    
    // Setup socket event listeners
    socket.on('session-created', (data) => {
        currentSession = data;
        joinForm.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        messageInput.focus();
        
        addSystemMessage(\`Welcome to \${room} room!\`);
    });
    
    socket.on('new-message', (message) => {
        addMessage(message);
    });
    
    socket.on('user-joined', (data) => {
        addSystemMessage(data.message);
    });
    
    socket.on('user-left', (data) => {
        addSystemMessage(data.message);
    });
    
    socket.on('user-typing', (data) => {
        if (data.isTyping) {
            typingIndicator.textContent = \`\${data.username} is typing...\`;
        } else {
            typingIndicator.textContent = '';
        }
    });
    
    socket.on('error', (error) => {
        alert(\`Error: \${error.message}\`);
    });
    
    socket.on('disconnect', () => {
        addSystemMessage('Disconnected from server');
    });
    
    // Join the chat
    socket.emit('join-chat', { username, roomId: room });
}

function sendMessage() {
    const content = messageInput.value.trim();
    if (!content || !socket) return;
    
    socket.emit('send-message', { content });
    messageInput.value = '';
    socket.emit('typing-stop');
}

function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    const isOwnMessage = message.userId === socket.id;
    messageElement.classList.add(isOwnMessage ? 'own' : 'other');
    
    if (message.isSystem) {
        messageElement.classList.add('system');
    }
    
    const timeString = new Date(message.timestamp).toLocaleTimeString();
    
    messageElement.innerHTML = \`
        <div class="message-info">\${message.username} - \${timeString}</div>
        <div>\${escapeHtml(message.content)}</div>
    \`;
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function addSystemMessage(text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'system');
    messageElement.textContent = text;
    
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleTyping() {
    if (!socket) return;
    
    socket.emit('typing-start');
    
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        socket.emit('typing-stop');
    }, 1000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}`;

  files.push(
    { path: 'public/index.html', content: indexHtml, type: 'source', description: 'Client-side HTML interface' },
    { path: 'public/client.js', content: clientJs, type: 'source', description: 'Client-side JavaScript application' }
  );

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
      '4. Create uploads directory: mkdir uploads',
      '5. Run "npm run dev" to start development server',
      '6. Open browser to http://localhost:3000',
      '7. Enter a username and optional room name',
      '8. Start chatting with multiple browser tabs to test',
      '9. Customize the interface and add features as needed'
    ],
    estimatedTime: '4-8 hours',
    complexity: 'expert',
  };
}