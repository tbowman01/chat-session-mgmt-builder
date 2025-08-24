#!/bin/bash
# Setup Node.js 22 LTS for Chat Session Management Builder

echo "🔧 Setting up Node.js 22 LTS..."

# Load NVM if available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Check current Node version
echo "📋 Current Node.js version: $(node --version)"

# Install and use Node.js 22 LTS
echo "⬇️  Installing Node.js 22 LTS..."
nvm install 22 --lts
nvm use 22
nvm alias default 22

echo "✅ Node.js setup complete!"
echo "📋 New Node.js version: $(node --version)"
echo "📋 npm version: $(npm --version)"

echo ""
echo "🎯 To apply in your current shell, run:"
echo "source ~/.bashrc"
echo ""
echo "🚀 Then try 'make install' again!"