import { createApp } from './app';
import { createAppConfig } from '@/config/app.config';

const config = createAppConfig();
const app = createApp(config);

const server = app.listen(config.port, () => {
  if (config.environment !== 'test') {
    console.log(`🚀 Chat API server running on port ${config.port}`);
    console.log(`📘 Environment: ${config.environment}`);
    console.log(`🌐 Health check: http://localhost:${config.port}/api/health`);
    console.log(`💬 API docs: http://localhost:${config.port}/api/chats`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  if (config.environment !== 'test') {
    console.log('🔄 SIGTERM received, shutting down gracefully');
  }
  server.close(() => {
    if (config.environment !== 'test') {
      console.log('✅ Server closed');
    }
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  if (config.environment !== 'test') {
    console.log('🔄 SIGINT received, shutting down gracefully');
  }
  server.close(() => {
    if (config.environment !== 'test') {
      console.log('✅ Server closed');
    }
    process.exit(0);
  });
});

export default app;