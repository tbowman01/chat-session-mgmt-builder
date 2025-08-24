import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8787;

// Middleware
app.use(cors());
app.use(express.json());

// Development authentication bypass middleware
const devAuthBypass = (req, res, next) => {
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    req.user = {
      id: 'dev-user-123',
      email: 'dev@example.com',
      name: 'Development User',
      role: 'admin',
      provider: 'local',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: true,
      isActive: true,
    };
    console.log('Auth bypassed for development:', req.user.email, req.path);
    return next();
  }
  
  res.status(401).json({
    error: 'Authentication required',
    code: 'MISSING_TOKEN',
    details: 'Authentication bypass is only available in development mode',
    timestamp: new Date().toISOString(),
  });
};

// Routes
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    version: 'v1',
    environment: 'development',
  });
});

app.get('/api/auth/me', devAuthBypass, (req, res) => {
  res.json({
    user: req.user,
  });
});

app.get('/api/auth/status', (req, res) => {
  if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
    res.json({
      authenticated: true,
      bypassMode: true,
      user: {
        id: 'dev-user-123',
        email: 'dev@example.com',
        role: 'admin',
      },
    });
  } else {
    res.json({
      authenticated: false,
      bypassMode: false,
      message: 'Authentication bypass disabled',
    });
  }
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Chat Session Management API - Development Bypass Mode',
    version: 'v1',
    environment: 'development',
    authBypass: process.env.BYPASS_AUTH === 'true',
    endpoints: {
      health: '/health',
      auth_me: '/api/auth/me',
      auth_status: '/api/auth/status',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development server with auth bypass running on http://localhost:${PORT}`);
  console.log(`🔓 Authentication bypass: ${process.env.BYPASS_AUTH === 'true' ? 'ENABLED' : 'DISABLED'}`);
});