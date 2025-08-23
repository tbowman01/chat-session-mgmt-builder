#!/bin/bash

# GitHub Repository Labels Setup Script
# This script creates standardized labels for the chat-session-mgmt-builder repository

REPO="tbowman01/chat-session-mgmt-builder"

echo "🏷️  Setting up repository labels for $REPO..."

# Function to create or update a label
create_label() {
  local name="$1"
  local color="$2" 
  local description="$3"
  
  echo "Creating label: $name"
  gh api repos/$REPO/labels --method POST \
    --field name="$name" \
    --field color="$color" \
    --field description="$description" \
    2>/dev/null || \
  gh api repos/$REPO/labels/$name --method PATCH \
    --field color="$color" \
    --field description="$description" \
    2>/dev/null
}

# Priority Labels
create_label "priority:critical" "d73a4a" "Critical priority - immediate attention required"
create_label "priority:high" "ff6b6b" "High priority - should be addressed soon"
create_label "priority:medium" "fbca04" "Medium priority - normal timeline"
create_label "priority:low" "0e8a16" "Low priority - can wait"

# Type Labels
create_label "type:bug" "d73a4a" "Something isn't working"
create_label "type:enhancement" "a2eeef" "New feature or improvement"
create_label "type:documentation" "0075ca" "Documentation improvements"
create_label "type:testing" "f9d0c4" "Testing related changes"
create_label "type:maintenance" "c5def5" "Code maintenance and refactoring"

# Platform Labels
create_label "platform:discord" "7289da" "Discord bot platform"
create_label "platform:telegram" "0088cc" "Telegram bot platform"
create_label "platform:whatsapp" "25d366" "WhatsApp integration platform"
create_label "platform:slack" "4a154b" "Slack workspace platform"
create_label "platform:twitter" "1da1f2" "Twitter bot platform"
create_label "platform:webchat" "ff6b35" "Web chat widget platform"
create_label "platform:cli" "586069" "Command-line interface platform"

# Component Labels
create_label "component:frontend" "e1f5fe" "Frontend React application"
create_label "component:backend" "f3e5f5" "Backend Node.js server"
create_label "component:generator" "fff3e0" "Code generation system"
create_label "component:deployment" "e8f5e8" "Docker and deployment configs"
create_label "component:ci-cd" "f1f8ff" "CI/CD workflows and automation"

# Status Labels
create_label "status:needs-triage" "fbca04" "Needs initial review and categorization"
create_label "status:in-progress" "0052cc" "Currently being worked on"
create_label "status:needs-review" "006b75" "Ready for code review"
create_label "status:blocked" "b60205" "Blocked by external dependencies"
create_label "status:ready-to-merge" "0e8a16" "Approved and ready for merge"
create_label "status:wont-fix" "ffffff" "Will not be fixed or implemented"
create_label "status:duplicate" "cfd3d7" "Duplicate of another issue"
create_label "status:completed" "0e8a16" "Successfully completed"
create_label "status:released" "0e8a16" "Included in a release"

# Size Labels (for PRs)
create_label "size:small" "c2e0c6" "Small changes (< 50 lines)"
create_label "size:medium" "fef2c0" "Medium changes (50-200 lines)"
create_label "size:large" "f9d0c4" "Large changes (200-500 lines)"
create_label "size:extra-large" "d73a4a" "Extra large changes (> 500 lines)"

# Complexity Labels
create_label "complexity:low" "c2e0c6" "Low complexity - straightforward implementation"
create_label "complexity:medium" "fef2c0" "Medium complexity - some design needed"
create_label "complexity:high" "f9d0c4" "High complexity - significant effort required"

# Special Labels
create_label "good-first-issue" "7057ff" "Good for newcomers"
create_label "help-wanted" "008672" "Extra attention is needed"
create_label "question" "d876e3" "Further information is requested"
create_label "wontfix" "ffffff" "This will not be worked on"
create_label "invalid" "e4e669" "This doesn't seem right"
create_label "automated" "0366d6" "Created by automation"
create_label "metrics" "0366d6" "Repository metrics and analytics"
create_label "security" "d73a4a" "Security related"
create_label "performance" "f9d0c4" "Performance improvements"

# Language Labels
create_label "language:typescript" "007acc" "TypeScript code"
create_label "language:javascript" "f7df1e" "JavaScript code"

# GitHub App Integration Labels
create_label "github-app" "0366d6" "GitHub App integration related"
create_label "webhook" "0366d6" "Webhook configuration"
create_label "oauth" "0366d6" "OAuth authentication"

echo "✅ Repository labels setup complete!"
echo "📝 You can view all labels at: https://github.com/$REPO/labels"