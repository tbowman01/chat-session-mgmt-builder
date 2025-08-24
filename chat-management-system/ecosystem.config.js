// PM2 Ecosystem Configuration for Production Deployment
module.exports = {
  apps: [
    {
      name: 'chat-management-system',
      script: './dist/server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        CORS_ORIGIN: 'false', // Configure for your domain
        CORS_CREDENTIALS: 'false',
        RATE_LIMIT_WINDOW_MS: '60000',
        RATE_LIMIT_MAX: '100',
        MAX_CHAT_SESSIONS: '10000'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      max_memory_restart: '300M',
      node_args: '--max-old-space-size=300'
    }
  ]
};