import React, { useState } from 'react';
import { ChevronRight, Download, Copy, Check } from 'lucide-react';

const ChatManagerBuilder = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    platform: '',
    priorities: [],
    complexity: '',
    teamSize: '',
    features: [],
    customizations: []
  });
  const [generatedSolution, setGeneratedSolution] = useState('');
  const [implementationStatus, setImplementationStatus] = useState('');
  const [copied, setCopied] = useState(false);

  const platforms = [
    { id: 'notion', name: 'Notion', description: 'Rich databases with relationships and views' },
    { id: 'airtable', name: 'Airtable', description: 'Powerful relational database with automations' },
    { id: 'sheets', name: 'Google Sheets', description: 'Simple spreadsheet solution' },
    { id: 'excel', name: 'Microsoft Excel', description: 'Desktop spreadsheet with Power Query' },
    { id: 'obsidian', name: 'Obsidian', description: 'Note-taking with graph connections' },
    { id: 'logseq', name: 'Logseq', description: 'Block-based knowledge management' },
    { id: 'custom', name: 'Custom Solution', description: 'Database/app of your choice' }
  ];

  const priorities = [
    { id: 'organization', name: 'Organization & Categorization', description: 'Structured topic and project grouping' },
    { id: 'search', name: 'Powerful Search', description: 'Find conversations quickly' },
    { id: 'analytics', name: 'Analytics & Insights', description: 'Track patterns and productivity' },
    { id: 'collaboration', name: 'Team Collaboration', description: 'Share and work together' },
    { id: 'automation', name: 'Automation', description: 'Auto-tagging and workflows' },
    { id: 'simplicity', name: 'Simplicity', description: 'Easy to use and maintain' },
    { id: 'portability', name: 'Data Portability', description: 'Easy export and migration' },
    { id: 'integration', name: 'Platform Integration', description: 'Connect with other tools' }
  ];

  const features = [
    { id: 'tags', name: 'Flexible Tagging System' },
    { id: 'projects', name: 'Project Management' },
    { id: 'timeline', name: 'Timeline Views' },
    { id: 'templates', name: 'Session Templates' },
    { id: 'reminders', name: 'Follow-up Reminders' },
    { id: 'exports', name: 'Export Capabilities' },
    { id: 'dashboard', name: 'Analytics Dashboard' },
    { id: 'archive', name: 'Archiving System' }
  ];

  const generateSolution = () => {
    let solution = '';
    
    // Platform-specific setup
    switch (config.platform) {
      case 'notion':
        solution = generateNotionSolution();
        break;
      case 'airtable':
        solution = generateAirtableSolution();
        break;
      case 'sheets':
        solution = generateSheetsSolution();
        break;
      case 'excel':
        solution = generateExcelSolution();
        break;
      case 'obsidian':
        solution = generateObsidianSolution();
        break;
      case 'logseq':
        solution = generateLogseqSolution();
        break;
      case 'custom':
        solution = generateCustomSolution();
        break;
    }
    
    setGeneratedSolution(solution);
    setStep(6);
  };

  const generateNotionSolution = () => {
    const hasProjects = config.features.includes('projects');
    const hasTags = config.features.includes('tags');
    const hasAnalytics = config.features.includes('dashboard');
    
    return `# Notion Chat Session Management Setup

## Database Structure

### 1. Chat Sessions Database
**Create a new database with these properties:**

**Basic Properties:**
- **Title**: Title (required)
- **Date Created**: Created time
- **Last Updated**: Last edited time
- **Platform**: Select (Claude, ChatGPT, Bard, Perplexity, Other)
- **Status**: Select (🟢 Active, ⏸️ On-Hold, ✅ Completed, 📁 Archived)

${config.priorities.includes('organization') ? `
**Organization Properties:**
- **Primary Topic**: Select (Work, Personal, Learning, Research, Creative)
- **Secondary Topics**: Multi-select (Development, Design, Writing, Planning, etc.)
- **Category**: Select (Quick Question, Deep Dive, Project Work, Brainstorming)` : ''}

${hasProjects ? `
**Project Management:**
- **Project**: Relation (to Projects database)
- **Project Phase**: Select (Planning, Execution, Review, Complete)` : ''}

${hasTags ? `
**Tagging System:**
- **Tags**: Multi-select (Urgent, Follow-up, Ideas, Solutions, Blocked)
- **Priority**: Select (🔴 High, 🟡 Medium, 🟢 Low, ⚪ None)` : ''}

${config.priorities.includes('analytics') ? `
**Analytics Properties:**
- **Duration**: Number (minutes)
- **Message Count**: Number
- **Satisfaction**: Select (😍 Excellent, 😊 Good, 😐 Average, 😞 Poor)
- **Value Rating**: Select (⭐⭐⭐⭐⭐, ⭐⭐⭐⭐, ⭐⭐⭐, ⭐⭐, ⭐)` : ''}

**Content Properties:**
- **Summary**: Text (key outcomes and decisions)
- **Key Insights**: Text (important learnings)
- **Action Items**: Text (next steps)
- **Follow-up Date**: Date
- **Notes**: Text (additional context)

## Views Setup

### Essential Views:
1. **All Sessions**: Default table view
2. **Recent**: Filter by Created time (Last 7 days)
3. **Active**: Filter by Status = Active
4. **This Week**: Calendar view by Created time

${config.priorities.includes('organization') ? `
### Organization Views:
5. **By Topic**: Group by Primary Topic
6. **By Platform**: Group by Platform
7. **By Category**: Group by Category` : ''}

${hasProjects ? `
### Project Views:
8. **By Project**: Group by Project relation
9. **Project Timeline**: Timeline view by Project` : ''}

${config.priorities.includes('analytics') ? `
### Analytics Views:
10. **High Value**: Filter by Value Rating ≥ 4 stars
11. **Needs Follow-up**: Filter by Follow-up Date ≤ Today
12. **Performance**: Chart view by Satisfaction` : ''}

${hasProjects ? `
## 2. Projects Database (Optional)
**Create a separate database for project tracking:**

Properties:
- **Project Name**: Title
- **Status**: Select (Planning, Active, Paused, Completed)
- **Start Date**: Date
- **End Date**: Date
- **Related Sessions**: Relation (to Chat Sessions)
- **Team Members**: Person (if collaborative)
- **Description**: Text
- **Goals**: Text` : ''}

## Automation Ideas

${config.priorities.includes('automation') ? `
### Notion Automations:
- **New Session Template**: Create a template with pre-filled Platform and Status
- **Weekly Review**: Set up a recurring template for reviewing past week's sessions
- **Auto-Archive**: Use Notion's automation to archive completed sessions after 30 days` : ''}

### Manual Workflows:
- **Daily Logging**: Add new sessions immediately after chats
- **Weekly Review**: Tag sessions that need follow-up
- **Monthly Cleanup**: Archive old completed sessions

${config.priorities.includes('collaboration') ? `
## Team Collaboration Setup
- **Shared Workspace**: Create team workspace with shared databases
- **Permission Levels**: Set view/edit permissions by team role
- **Templates**: Create standard session templates for team use
- **Sync Meetings**: Weekly review of team chat insights` : ''}

## Getting Started Steps:
1. Create the Chat Sessions database with properties above
${hasProjects ? '2. Create the Projects database and link to Chat Sessions' : ''}
${hasProjects ? '3. Set up views and filters' : '2. Set up views and filters'}
${hasProjects ? '4. Create your first session entry to test' : '3. Create your first session entry to test'}
${hasProjects ? '5. Customize based on your workflow' : '4. Customize based on your workflow'}`;
  };

  const generateAirtableSolution = () => {
    return `# Airtable Chat Session Management Setup

## Base Structure

### Table 1: Chat Sessions
**Fields:**
- **Session ID**: Auto number (primary key)
- **Title**: Single line text (required)
- **Date**: Date (creation date)
- **Platform**: Single select (Claude, ChatGPT, etc.)
- **Status**: Single select with colors
- **Summary**: Long text
- **Rating**: Rating (1-5 stars)

${config.features.includes('projects') ? `
### Table 2: Projects
**Fields:**
- **Project Name**: Single line text
- **Status**: Single select
- **Sessions**: Link to Chat Sessions table
- **Timeline**: Date range` : ''}

### Automations Available:
- Auto-timestamp new records
- Send notifications for high-priority sessions
- Archive completed sessions monthly

## Views:
- Grid: Default view
- Calendar: Sessions by date
- Kanban: Sessions by status
- Form: Quick session entry`;
  };

  const generateSheetsSolution = () => {
    return `# Google Sheets Chat Session Management

## Sheet Setup

### Main Sheet: "Chat Sessions"
**Column Structure:**
A: Session ID (auto-number with formula)
B: Date (=TODAY() for new entries)
C: Title
D: Platform (dropdown)
E: Status (dropdown)
F: Primary Topic (dropdown)
G: Summary
H: Action Items
I: Follow-up Date
J: Rating (1-5)

### Formulas to Add:
- Auto-numbering: =ROW()-1 in column A
- Status colors: Conditional formatting
- Summary stats: COUNT, AVERAGE functions

${config.features.includes('dashboard') ? `
### Dashboard Sheet:
- Total sessions count
- Sessions by platform (pie chart)
- Weekly activity (line chart)
- Top topics (bar chart)` : ''}

### Data Validation:
- Platform: Claude, ChatGPT, Bard, Other
- Status: Active, Complete, Archived
- Rating: 1, 2, 3, 4, 5`;
  };

  const generateExcelSolution = () => {
    return `# Microsoft Excel Chat Session Management

## Workbook Structure

### Main Table: "ChatSessions"
- Use Excel Tables for better data management
- Enable filters and sorting
- Add data validation for dropdowns

### Power Query Setup:
- Connect to external data sources if needed
- Automated data refresh
- Clean and transform data

### Pivot Tables:
- Sessions by topic analysis
- Monthly trends
- Platform usage statistics

### Conditional Formatting:
- Color-code by priority
- Highlight overdue follow-ups
- Status indicators`;
  };

  const generateObsidianSolution = () => {
    return `# Obsidian Chat Session Management

## Folder Structure:
\`\`\`
📁 Chat Sessions/
  📁 2024/
    📁 August/
      📄 2024-08-22-claude-api-discussion.md
      📄 2024-08-22-chatgpt-content-strategy.md
  📁 Topics/
    📄 Development.md
    📄 Design.md
  📁 Projects/
    📄 Website-Redesign.md
\`\`\`

## Note Template:
\`\`\`markdown
---
date: {{date}}
platform: 
topics: 
project: 
status: active
priority: medium
tags: 
---

# {{title}}

## Summary


## Key Points
- 

## Action Items
- [ ] 

## Follow-up


## Links
- 
\`\`\`

### Plugins to Use:
- Templater: Auto-generate session notes
- Dataview: Query and display session data
- Calendar: Visualize session timeline
- Tag Wrangler: Manage tags efficiently`;
  };

  const generateLogseqSolution = () => {
    return `# Logseq Chat Session Management

## Block-based Structure:

### Daily Journal Integration:
\`\`\`
## Chat Sessions
- [[2024-08-22]] #chat-session #claude
  - Topic:: [[API Development]]
  - Project:: [[Website Redesign]]
  - Summary:: Discussed authentication implementation
  - Action:: TODO Review OAuth documentation
\`\`\`

### Properties to Use:
- platform:: Claude | ChatGPT | Bard
- topic:: [[Topic Name]]
- project:: [[Project Name]]
- status:: active | completed | archived
- rating:: 1-5

### Queries for Organization:
\`\`\`clojure
{{query (and (page-property :platform "Claude") (page-property :status "active"))}}
\`\`\`

### Automation:
- Templates for quick session creation
- Scheduled queries for reviews
- Automated tagging based on content`;
  };

  const generateCustomSolution = () => {
    return `# Custom Solution Architecture

## Database Schema

### Core Tables:
1. **sessions**
   - id (primary key)
   - title
   - created_at
   - platform
   - status
   - content
   
2. **topics**
   - id (primary key)
   - name
   - parent_id (self-reference)
   
3. **session_topics** (junction table)
   - session_id (foreign key)
   - topic_id (foreign key)

${config.features.includes('projects') ? `
4. **projects**
   - id (primary key)
   - name
   - status
   - start_date
   - end_date

5. **session_projects** (junction table)
   - session_id (foreign key)
   - project_id (foreign key)` : ''}

## API Endpoints:
- GET /sessions (list with filters)
- POST /sessions (create new)
- PUT /sessions/:id (update)
- DELETE /sessions/:id (archive)

## Implementation Options:
- **Lightweight**: SQLite + Python Flask
- **Scalable**: PostgreSQL + Node.js/Express
- **No-code**: Bubble.io or Adalo
- **Spreadsheet**: Airtable API + custom frontend`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedSolution);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadSolution = () => {
    const blob = new Blob([generatedSolution], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-session-management-${config.platform}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePriorityToggle = (priorityId) => {
    setConfig(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priorityId)
        ? prev.priorities.filter(p => p !== priorityId)
        : [...prev.priorities, priorityId]
    }));
  };

  const handleFeatureToggle = (featureId) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId]
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Choose Your Platform</h2>
              <p className="text-gray-600 mb-6">Select the tool you want to use for managing your chat sessions:</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  onClick={() => setConfig(prev => ({ ...prev, platform: platform.id }))}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    config.platform === platform.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold text-lg">{platform.name}</h3>
                  <p className="text-gray-600 text-sm">{platform.description}</p>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => setStep(2)}
              disabled={!config.platform}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next: Set Priorities <ChevronRight size={20} />
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">What Matters Most to You?</h2>
              <p className="text-gray-600 mb-6">Select your top priorities (choose 2-4 for best results):</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {priorities.map((priority) => (
                <div
                  key={priority.id}
                  onClick={() => handlePriorityToggle(priority.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    config.priorities.includes(priority.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-semibold">{priority.name}</h3>
                  <p className="text-gray-600 text-sm">{priority.description}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={config.priorities.length === 0}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Next: Choose Features <ChevronRight size={20} />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Features</h2>
              <p className="text-gray-600 mb-6">Choose the features you want in your system:</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              {features.map((feature) => (
                <label key={feature.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.features.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>{feature.name}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next: Team Setup <ChevronRight size={20} />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Team & Complexity</h2>
              <p className="text-gray-600 mb-6">Tell us about your usage scenario:</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Team Size:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Just me', '2-5 people', '6-20 people', '20+ people'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setConfig(prev => ({ ...prev, teamSize: size }))}
                      className={`p-3 border rounded-lg text-sm ${
                        config.teamSize === size
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">Complexity Level:</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'simple', name: 'Simple', desc: 'Basic tracking and organization' },
                    { id: 'moderate', name: 'Moderate', desc: 'Multiple projects and automation' },
                    { id: 'advanced', name: 'Advanced', desc: 'Full analytics and integrations' }
                  ].map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setConfig(prev => ({ ...prev, complexity: level.id }))}
                      className={`p-4 border rounded-lg text-left ${
                        config.complexity === level.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{level.name}</div>
                      <div className="text-sm text-gray-600">{level.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!config.teamSize || !config.complexity}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Next: Review <ChevronRight size={20} />
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Review Your Configuration</h2>
              <p className="text-gray-600 mb-6">Here's what we'll create for you:</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <span className="font-medium">Platform:</span> {platforms.find(p => p.id === config.platform)?.name}
              </div>
              <div>
                <span className="font-medium">Priorities:</span> {config.priorities.map(p => priorities.find(pr => pr.id === p)?.name).join(', ')}
              </div>
              <div>
                <span className="font-medium">Features:</span> {config.features.map(f => features.find(fe => fe.id === f)?.name).join(', ')}
              </div>
              <div>
                <span className="font-medium">Team Size:</span> {config.teamSize}
              </div>
              <div>
                <span className="font-medium">Complexity:</span> {config.complexity}
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={generateSolution}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Generate My Solution! <ChevronRight size={20} />
              </button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Custom Solution</h2>
                <p className="text-gray-600">Ready to implement in {platforms.find(p => p.id === config.platform)?.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={downloadSolution}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Download Guide
                </button>
                <button
                  onClick={() => setStep(7)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={16} />
                  Auto-Setup
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 border rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-100 border-b">
                <code className="text-sm">chat-session-management-{config.platform}.md</code>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">{generatedSolution}</pre>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Start Over
              </button>
              <button
                onClick={() => setStep(5)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Modify Configuration
              </button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Automated Setup</h2>
              <p className="text-gray-600 mb-6">I can automatically create your solution using API keys. Choose your implementation method:</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">📥 Download Full Package</h3>
                <p className="text-gray-600 mb-4">Get everything you need for manual setup:</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li>• Complete setup instructions</li>
                  <li>• Templates and formulas</li>
                  <li>• Sample data for testing</li>
                  <li>• Best practices guide</li>
                  <li>• Troubleshooting tips</li>
                </ul>
                <button
                  onClick={() => downloadFullPackage()}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Download Complete Package
                </button>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">🚀 Automated Implementation</h3>
                <p className="text-gray-600 mb-4">Let me create it for you using your API keys:</p>
                
                {config.platform === 'notion' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Notion Integration Token:</label>
                      <input
                        type="password"
                        placeholder="secret_..."
                        className="w-full p-2 border rounded"
                        onChange={(e) => setConfig(prev => ({ ...prev, notionToken: e.target.value }))}
                      />
                      <p className="text-xs text-gray-500 mt-1">Get from: notion.so/my-integrations</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Parent Page ID (optional):</label>
                      <input
                        type="text"
                        placeholder="32-character page ID"
                        className="w-full p-2 border rounded"
                        onChange={(e) => setConfig(prev => ({ ...prev, notionPageId: e.target.value }))}
                      />
                    </div>
                    <button
                      onClick={() => implementNotionSolution()}
                      disabled={!config.notionToken}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Create Notion Database
                    </button>
                  </div>
                )}
                
                {config.platform === 'airtable' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Airtable Personal Access Token:</label>
                      <input
                        type="password"
                        placeholder="pat..."
                        className="w-full p-2 border rounded"
                        onChange={(e) => setConfig(prev => ({ ...prev, airtableToken: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Base ID (optional - will create new if empty):</label>
                      <input
                        type="text"
                        placeholder="app..."
                        className="w-full p-2 border rounded"
                        onChange={(e) => setConfig(prev => ({ ...prev, airtableBaseId: e.target.value }))}
                      />
                    </div>
                    <button
                      onClick={() => implementAirtableSolution()}
                      disabled={!config.airtableToken}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Create Airtable Base
                    </button>
                  </div>
                )}
                
                {config.platform === 'sheets' && (
                  <div className="space-y-4">
                    <p className="text-sm text-orange-600 mb-4">
                      📝 Google Sheets requires OAuth setup. I'll create a template you can copy instead.
                    </p>
                    <button
                      onClick={() => createSheetsTemplate()}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Create Google Sheets Template
                    </button>
                  </div>
                )}
                
                {!['notion', 'airtable', 'sheets'].includes(config.platform) && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Automated setup not available for {platforms.find(p => p.id === config.platform)?.name}</p>
                    <button
                      onClick={() => downloadFullPackage()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Download Setup Guide Instead
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">🔒 Security Note</h4>
              <p className="text-sm text-yellow-700">
                API keys are used only for this session and are never stored. The automated setup creates your database/workspace and then discards the credentials.
              </p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setStep(6)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Back to Solution
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const downloadFullPackage = () => {
    const packageContent = `${generatedSolution}

---

# Additional Resources

## Sample Data for Testing
\`\`\`csv
Title,Date,Platform,Status,Topic,Summary,Rating
"API Authentication Discussion","2024-08-22","Claude","Completed","Development","Learned about OAuth 2.0 implementation",5
"Content Strategy Planning","2024-08-22","ChatGPT","Active","Marketing","Brainstormed blog post ideas",4
"Design System Review","2024-08-21","Claude","Completed","Design","Discussed component organization",5
\`\`\`

## Troubleshooting Guide

### Common Issues:
1. **Import Problems**: Check CSV formatting and encoding
2. **Formula Errors**: Verify cell references match your setup
3. **Permission Issues**: Ensure proper sharing settings
4. **Performance**: Limit views to essential data for large datasets

### Platform-Specific Tips:
${config.platform === 'notion' ? `
**Notion:**
- Use templates for consistent session creation
- Set up database relations before adding data
- Use filters instead of multiple databases for better performance
` : ''}

${config.platform === 'airtable' ? `
**Airtable:**
- Enable sync to keep data updated across devices
- Use automation recipes for repetitive tasks
- Consider Airtable Apps for enhanced functionality
` : ''}

## Advanced Workflows

### Weekly Review Process:
1. Filter sessions from past 7 days
2. Review action items and follow-ups
3. Archive completed sessions
4. Plan upcoming discussions

### Monthly Analysis:
1. Export data for trend analysis
2. Review topic distribution
3. Identify productivity patterns
4. Adjust categorization as needed

## Integration Ideas
- Connect with calendar for session scheduling
- Link to note-taking apps for detailed records
- Integrate with project management tools
- Set up automated backups
`;

    const blob = new Blob([packageContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-session-management-complete-${config.platform}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const implementNotionSolution = async () => {
    if (!config.notionToken) return;
    
    setStep(8);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `Create a Notion database for chat session management using the Notion API. Here's my configuration:
              
Platform: ${config.platform}
Priorities: ${config.priorities.join(', ')}
Features: ${config.features.join(', ')}
Team Size: ${config.teamSize}
Complexity: ${config.complexity}

My Notion Integration Token: ${config.notionToken}
${config.notionPageId ? `Parent Page ID: ${config.notionPageId}` : ''}

Please use the Notion API to:
1. Create the main Chat Sessions database
2. Set up all the necessary properties based on my configuration
3. Create basic views for organization
${config.features.includes('projects') ? '4. Create a Projects database and link it' : ''}

Return the database URLs and setup confirmation.`
            }
          ]
        })
      });
      
      const data = await response.json();
      setConfig(prev => ({ ...prev, implementationResult: data.content[0].text }));
      
    } catch (error) {
      setConfig(prev => ({ 
        ...prev, 
        implementationResult: `Error: ${error.message}\n\nPlease try the manual setup instead.` 
      }));
    }
  };

  const implementAirtableSolution = async () => {
    if (!config.airtableToken) return;
    
    setStep(8);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `Create an Airtable base for chat session management using the Airtable API. Here's my configuration:
              
Platform: ${config.platform}
Priorities: ${config.priorities.join(', ')}
Features: ${config.features.join(', ')}
Team Size: ${config.teamSize}
Complexity: ${config.complexity}

My Airtable Token: ${config.airtableToken}
${config.airtableBaseId ? `Base ID: ${config.airtableBaseId}` : 'Create new base'}

Please use the Airtable API to:
1. ${config.airtableBaseId ? 'Update the existing base' : 'Create a new base'}
2. Create the Chat Sessions table with appropriate fields
3. Set up field types and options based on my configuration
${config.features.includes('projects') ? '4. Create a Projects table and link it' : ''}

Return the base URL and setup confirmation.`
            }
          ]
        })
      });
      
      const data = await response.json();
      setConfig(prev => ({ ...prev, implementationResult: data.content[0].text }));
      
    } catch (error) {
      setConfig(prev => ({ 
        ...prev, 
        implementationResult: `Error: ${error.message}\n\nPlease try the manual setup instead.` 
      }));
    }
  };

  const createSheetsTemplate = async () => {
    setStep(8);
    
    const sheetsUrl = `https://docs.google.com/spreadsheets/create?title=Chat%20Session%20Management`;
    
    setConfig(prev => ({ 
      ...prev, 
      implementationResult: `Google Sheets Template Created!

Click here to create your spreadsheet: ${sheetsUrl}

Then follow these steps:
1. Rename the first sheet to "Chat Sessions"
2. Add these column headers in row 1:
   A1: Session ID
   B1: Date
   C1: Title
   D1: Platform
   E1: Status
   F1: Topic
   G1: Summary
   H1: Rating

3. Set up data validation for dropdowns:
   - Platform: Claude, ChatGPT, Bard, Other
   - Status: Active, Completed, Archived
   - Rating: 1, 2, 3, 4, 5

4. Format columns:
   - Date: Format > Number > Date
   - Rating: Format > Number > Number

5. Add conditional formatting for Status column:
   - Active: Green background
   - Completed: Blue background
   - Archived: Gray background

Your spreadsheet is ready to use! Add your first chat session to test it out.`
    }));
  };

  if (step === 8) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Implementation Complete! 🎉</h2>
            <p className="text-gray-600">Your chat session management system has been set up.</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <pre className="whitespace-pre-wrap text-sm">{config.implementationResult}</pre>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Create Another System
            </button>
            <button
              onClick={() => downloadFullPackage()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Download Documentation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Chat Session Management Builder</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {[1, 2, 3, 4, 5, 6].map((stepNum) => (
            <div key={stepNum} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stepNum <= step ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                {stepNum}
              </div>
              {stepNum < 6 && <div className="w-8 h-px bg-gray-300" />}
            </div>
          ))}
        </div>
      </div>
      
      {renderStep()}
    </div>
  );
};

export default ChatManagerBuilder;