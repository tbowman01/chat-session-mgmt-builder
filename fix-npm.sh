#!/bin/bash

# Fix npm path issue with NVM
echo "🔧 Fixing npm path issue..."

# Source NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the current Node.js version
nvm use system 2>/dev/null || nvm use node

# Check versions
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "npm path: $(which npm)"

echo "✅ npm path fixed! You can now run 'make setup' again."