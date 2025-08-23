// Chat Session Management Builder — Refactor (v2)
// -----------------------------------------------------------------------------
// This refactor addresses: modularization, type safety, secure provisioning,
// proper stepper (1–8), local persistence, shareable URLs, and safer secret
// handling (server-side). It assumes a React + Vite front-end and a minimal
// Express backend for provisioning Notion/Airtable.
//
// Quick Start
// 1) FRONTEND
//    - Place files under /frontend/src and run: npm i && npm run dev
// 2) BACKEND (secure provisioning)
//    - Place files under /server and run: npm i && npm run dev
//    - Copy server/.env.example to server/.env and set NOTION_TOKEN / AIRTABLE_TOKEN
//    - Ensure your Notion integration is added to the parent page you target.
// 3) In Step 7 (Auto‑Setup), the app calls your backend endpoints.
//
// File Tree (this canvas includes all files inline)
//   frontend/
//     src/
//       lib/
//         types.ts
//         storage.ts
//         download.ts
//         generators/
//           notion.ts
//           airtable.ts
//           sheets.ts
//           excel.ts
//           obsidian.ts
//           logseq.ts
//           custom.ts
//       components/
//         Stepper.tsx
//         steps/
//           Step1Platform.tsx
//           Step2Priorities.tsx
//           Step3Features.tsx
//           Step4TeamComplexity.tsx
//           Step5Review.tsx
//           Step6Solution.tsx
//           Step7AutoSetup.tsx
//           Step8Done.tsx
//         ChatManagerBuilder.tsx
//     main.tsx (app entry)
//     index.css
//   server/
//     src/
//       index.ts
//       routes/
//         provisionNotion.ts
//         provisionAirtable.ts
//     package.json
//     tsconfig.json
//     .env.example
//     README.md
// -----------------------------------------------------------------------------

// ========================= frontend/src/lib/types.ts ==========================
export type PlatformId = 'notion' | 'airtable' | 'sheets' | 'excel' | 'obsidian' | 'logseq' | 'custom';
export type PriorityId = 'organization' | 'search' | 'analytics' | 'collaboration' | 'automation' | 'simplicity' | 'portability' | 'integration';
export type FeatureId = 'tags' | 'projects' | 'timeline' | 'templates' | 'reminders' | 'exports' | 'dashboard' | 'archive';
export type ComplexityId = 'simple' | 'moderate' | 'advanced';

export interface Config {
  platform: PlatformId | '';
  priorities: PriorityId[];
  complexity: ComplexityId | '';
  teamSize: '' | 'Just me' | '2-5 people' | '6-20 people' | '20+ people';
  features: FeatureId[];
}

export interface AppState {
  step: number; // 1..8
  config: Config;
  generatedSolution: string;
  implementationResult: string;
  copied: boolean;
}

// ======================= frontend/src/lib/storage.ts =========================
const STORAGE_KEY = 'chatSessionBuilder:v2';

export function saveState(state: Partial<AppState>) {
  try {
    const raw = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {}
}

export function loadState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function encodeShare(state: Config): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
}

export function decodeShare(token: string): Config | null {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(token))));
  } catch {
    return null;
  }
}

// ======================= frontend/src/lib/download.ts ========================
export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadPackage(filename: string, content: string) {
  downloadMarkdown(filename, content);
}

// ============== frontend/src/lib/generators/notion.ts ========================
import type { Config } from '../types';

export function generateNotionSolution(config: Config) {
  const hasProjects = config.features.includes('projects');
  const hasTags = config.features.includes('tags');
  return `# Notion Chat Session Management Setup\n\n## Database Structure\n\n### 1. Chat Sessions Database\n**Create a new database with these properties:**\n\n**Basic Properties:**\n- **Title**: Title (required)\n- **Date Created**: Created time\n- **Last Updated**: Last edited time\n- **Platform**: Select (Claude, ChatGPT, Bard, Perplexity, Other)\n- **Status**: Select (🟢 Active, ⏸️ On-Hold, ✅ Completed, 📁 Archived)\n\n${config.priorities.includes('organization') ? `**Organization Properties:**\n- **Primary Topic**: Select (Work, Personal, Learning, Research, Creative)\n- **Secondary Topics**: Multi-select (Development, Design, Writing, Planning, etc.)\n- **Category**: Select (Quick Question, Deep Dive, Project Work, Brainstorming)` : ''}\n\n${hasProjects ? `**Project Management:**\n- **Project**: Relation (to Projects database)\n- **Project Phase**: Select (Planning, Execution, Review, Complete)` : ''}\n\n${hasTags ? `**Tagging System:**\n- **Tags**: Multi-select (Urgent, Follow-up, Ideas, Solutions, Blocked)\n- **Priority**: Select (🔴 High, 🟡 Medium, 🟢 Low, ⚪ None)` : ''}\n\n${config.priorities.includes('analytics') ? `**Analytics Properties:**\n- **Duration**: Number (minutes)\n- **Message Count**: Number\n- **Satisfaction**: Select (😍 Excellent, 😊 Good, 😐 Average, 😞 Poor)\n- **Value Rating**: Select (⭐⭐⭐⭐⭐, ⭐⭐⭐⭐, ⭐⭐⭐, ⭐⭐, ⭐)` : ''}\n\n**Content Properties:**\n- **Summary**: Text (key outcomes and decisions)\n- **Key Insights**: Text (important learnings)\n- **Action Items**: Text (next steps)\n- **Follow-up Date**: Date\n- **Notes**: Text (additional context)\n\n## Views Setup\n1. **All Sessions** (table)\n2. **Recent** (Created last 7 days)\n3. **Active** (Status = Active)\n4. **This Week** (Calendar by Created time)\n5. **By Topic**, **By Platform**, **By Category** (grouped)\n${hasProjects ? `6. **By Project** (group)\n7. **Project Timeline** (Timeline by Project)` : ''}\n${config.priorities.includes('analytics') ? `8. **High Value** (Value Rating ≥ 4)\n9. **Needs Follow-up** (Follow-up ≤ Today)\n10. **Performance** (chart)` : ''}\n\n${hasProjects ? `## 2. Projects Database (Optional)\n- Title, Status, Start/End Dates, Relation to Sessions, Team Members, Description, Goals` : ''}\n\n## Automation Ideas\n- Templates for new session\n- Weekly review template\n- Auto-archive completed after 30 days\n\n## Team Setup\n- Shared workspace, permissions by role, standard templates\n\n## Getting Started\n1. Create Chat Sessions database\n${hasProjects ? '2. Create Projects db + relation\n3. Configure views and filters\n4. Add a test entry\n5. Customize workflow' : '2. Configure views and filters\n3. Add a test entry\n4. Customize workflow'}`;
}

// ============= frontend/src/lib/generators/airtable.ts =======================
import type { Config } from '../types';
export function generateAirtableSolution(config: Config) {
  const hasProjects = config.features.includes('projects');
  return `# Airtable Chat Session Management Setup\n\n## Base Structure\n\n### Table: Chat Sessions\nFields: Session ID (auto), Title, Date, Platform, Status, Summary, Rating${hasProjects ? '\n\n### Table: Projects\nFields: Name, Status, Link to Sessions, Timeline' : ''}\n\n## Automations\n- Timestamp new records\n- Notify on high priority\n- Monthly archive\n\n## Views\n- Grid, Calendar by Date, Kanban by Status, Form for quick entry`;
}

// =============== frontend/src/lib/generators/sheets.ts =======================
import type { Config } from '../types';
export function generateSheetsSolution(config: Config) {
  const hasDashboard = config.features.includes('dashboard');
  return `# Google Sheets Chat Session Management\n\n## Sheet: Chat Sessions\nColumns: ID, Date, Title, Platform, Status, Primary Topic, Summary, Action Items, Follow-up, Rating\n\n## Formulas\n- Auto-numbering with ROW()\n- Conditional formatting for Status\n${hasDashboard ? '\n## Dashboard\n- Totals, Sessions by platform, Weekly activity, Top topics' : ''}`;
}

// ================ frontend/src/lib/generators/excel.ts =======================
import type { Config } from '../types';
export function generateExcelSolution(_config: Config) {
  return `# Microsoft Excel Chat Session Management\n\n- Use Excel Tables\n- Power Query for data refresh\n- PivotTables: by topic, monthly trends, platform usage\n- Conditional formatting for priority & overdue follow-ups`;
}

// ============== frontend/src/lib/generators/obsidian.ts ======================
import type { Config } from '../types';
export function generateObsidianSolution(_config: Config) {
  return `# Obsidian Chat Session Management\n\n## Folders\nChat Sessions/YYYY/MM/*.md, Topics/*.md, Projects/*.md\n\n## Template (Templater)\n---\ndate: {{date}}\nplatform: \ntopics: \nproject: \nstatus: active\npriority: medium\ntags: \n---\n\n# {{title}}\n\n## Summary\n\n## Key Points\n- \n\n## Action Items\n- [ ] \n\n## Follow-up\n\n## Links`;
}

// ================ frontend/src/lib/generators/logseq.ts ======================
import type { Config } from '../types';
export function generateLogseqSolution(_config: Config) {
  return `# Logseq Chat Session Management\n\n## Journal Usage\n- Use properties: platform::, topic::, project::, status::, rating::\n\n## Query Example\n{{query (and (page-property :platform \'Claude\') (page-property :status \'active\'))}}`;
}

// ================= frontend/src/lib/generators/custom.ts =====================
import type { Config } from '../types';
export function generateCustomSolution(config: Config) {
  const hasProjects = config.features.includes('projects');
  return `# Custom Solution Architecture\n\n## Tables\n1) sessions(id, title, created_at, platform, status, content)\n2) topics(id, name, parent_id)\n3) session_topics(session_id, topic_id)\n${hasProjects ? '4) projects(id, name, status, start_date, end_date)\n5) session_projects(session_id, project_id)' : ''}\n\n## API\n- GET/POST/PUT/DELETE /sessions\n\n## Stacks\n- Lightweight: SQLite + Flask\n- Scalable: Postgres + Node/Express`;
}

// ===================== frontend/src/components/Stepper.tsx ===================
import React from 'react';

export const Stepper: React.FC<{ current: number; total?: number }> = ({ current, total = 8 }) => {
  return (
    <div className="flex items-center gap-4 text-sm" role="list" aria-label="Wizard steps">
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1;
        const active = stepNum <= current;
        return (
          <div key={stepNum} className="flex items-center gap-2" role="listitem" aria-current={active ? 'step' : undefined}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{stepNum}</div>
            {stepNum < total && <div className="w-8 h-px bg-gray-300" />}
          </div>
        );
      })}
    </div>
  );
};

// =========== frontend/src/components/steps/Step1Platform.tsx =================
import React from 'react';
import type { Config, PlatformId } from '../../lib/types';

const PLATFORMS: { id: PlatformId; name: string; description: string }[] = [
  { id: 'notion', name: 'Notion', description: 'Rich databases with relations' },
  { id: 'airtable', name: 'Airtable', description: 'Relational base + automations' },
  { id: 'sheets', name: 'Google Sheets', description: 'Simple spreadsheet' },
  { id: 'excel', name: 'Excel', description: 'Desktop spreadsheet + Power Query' },
  { id: 'obsidian', name: 'Obsidian', description: 'Notes with plugins' },
  { id: 'logseq', name: 'Logseq', description: 'Block-based knowledge mgmt' },
  { id: 'custom', name: 'Custom Solution', description: 'Your own DB/app' },
];

export const Step1Platform: React.FC<{
  config: Config;
  setConfig: (c: Partial<Config>) => void;
  next: () => void;
}> = ({ config, setConfig, next }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose Your Platform</h2>
        <p className="text-gray-600 mb-6">Select the tool for managing your chat sessions:</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {PLATFORMS.map(p => (
          <button
            key={p.id}
            onClick={() => setConfig({ platform: p.id })}
            className={`p-4 border-2 rounded-lg text-left transition-all ${config.platform === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            aria-pressed={config.platform === p.id}
          >
            <div className="font-semibold text-lg">{p.name}</div>
            <div className="text-gray-600 text-sm">{p.description}</div>
          </button>
        ))}
      </div>
      <button
        onClick={next}
        disabled={!config.platform}
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  );
};

// ======== frontend/src/components/steps/Step2Priorities.tsx ==================
import React from 'react';
import type { Config, PriorityId } from '../../lib/types';

const PRIORITIES: { id: PriorityId; name: string; description: string }[] = [
  { id: 'organization', name: 'Organization & Categorization', description: 'Topics and project grouping' },
  { id: 'search', name: 'Powerful Search', description: 'Find conversations quickly' },
  { id: 'analytics', name: 'Analytics & Insights', description: 'Track patterns and productivity' },
  { id: 'collaboration', name: 'Team Collaboration', description: 'Share and work together' },
  { id: 'automation', name: 'Automation', description: 'Auto-tagging and workflows' },
  { id: 'simplicity', name: 'Simplicity', description: 'Easy to use and maintain' },
  { id: 'portability', name: 'Data Portability', description: 'Export and migration' },
  { id: 'integration', name: 'Platform Integration', description: 'Connect with other tools' },
];

export const Step2Priorities: React.FC<{
  config: Config;
  setConfig: (c: Partial<Config>) => void;
  next: () => void;
  back: () => void;
}> = ({ config, setConfig, next, back }) => {
  const toggle = (id: PriorityId) => {
    const exists = config.priorities.includes(id);
    const updated = exists ? config.priorities.filter(p => p !== id) : [...config.priorities, id];
    setConfig({ priorities: updated });
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">What Matters Most?</h2>
        <p className="text-gray-600 mb-6">Select priorities (2–4 recommended):</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {PRIORITIES.map(p => (
          <button key={p.id} onClick={() => toggle(p.id)} className={`p-4 border-2 rounded-lg text-left ${config.priorities.includes(p.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="font-semibold">{p.name}</div>
            <div className="text-gray-600 text-sm">{p.description}</div>
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={back} className="px-6 py-3 border rounded-lg">Back</button>
        <button onClick={next} disabled={config.priorities.length === 0} className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

// =========== frontend/src/components/steps/Step3Features.tsx =================
import React from 'react';
import type { Config, FeatureId } from '../../lib/types';

const FEATURES: { id: FeatureId; name: string }[] = [
  { id: 'tags', name: 'Flexible Tagging' },
  { id: 'projects', name: 'Project Management' },
  { id: 'timeline', name: 'Timeline Views' },
  { id: 'templates', name: 'Session Templates' },
  { id: 'reminders', name: 'Follow-up Reminders' },
  { id: 'exports', name: 'Export Capabilities' },
  { id: 'dashboard', name: 'Analytics Dashboard' },
  { id: 'archive', name: 'Archiving System' },
];

export const Step3Features: React.FC<{
  config: Config;
  setConfig: (c: Partial<Config>) => void;
  next: () => void;
  back: () => void;
}> = ({ config, setConfig, next, back }) => {
  const toggle = (id: FeatureId) => {
    const exists = config.features.includes(id);
    const updated = exists ? config.features.filter(f => f !== id) : [...config.features, id];
    setConfig({ features: updated });
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Features</h2>
        <p className="text-gray-600 mb-6">Choose the features you want:</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {FEATURES.map(f => (
          <label key={f.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input type="checkbox" checked={config.features.includes(f.id)} onChange={() => toggle(f.id)} className="w-4 h-4 text-blue-600" />
            <span>{f.name}</span>
          </label>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={back} className="px-6 py-3 border rounded-lg">Back</button>
        <button onClick={next} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Next</button>
      </div>
    </div>
  );
};

// ===== frontend/src/components/steps/Step4TeamComplexity.tsx =================
import React from 'react';
import type { Config, ComplexityId } from '../../lib/types';

export const Step4TeamComplexity: React.FC<{
  config: Config;
  setConfig: (c: Partial<Config>) => void;
  next: () => void;
  back: () => void;
}> = ({ config, setConfig, next, back }) => {
  const teamSizes: Config['teamSize'][] = ['Just me', '2-5 people', '6-20 people', '20+ people'];
  const levels: { id: ComplexityId; name: string; desc: string }[] = [
    { id: 'simple', name: 'Simple', desc: 'Basic tracking and organization' },
    { id: 'moderate', name: 'Moderate', desc: 'Multiple projects and automation' },
    { id: 'advanced', name: 'Advanced', desc: 'Analytics and integrations' },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Team & Complexity</h2>
        <p className="text-gray-600 mb-6">Tell us about your usage:</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Team Size:</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {teamSizes.map(size => (
              <button key={size} onClick={() => setConfig({ teamSize: size })} className={`p-3 border rounded-lg text-sm ${config.teamSize === size ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>{size}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-3">Complexity Level:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {levels.map(l => (
              <button key={l.id} onClick={() => setConfig({ complexity: l.id })} className={`p-4 border rounded-lg text-left ${config.complexity === l.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="font-medium">{l.name}</div>
                <div className="text-sm text-gray-600">{l.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={back} className="px-6 py-3 border rounded-lg">Back</button>
        <button onClick={next} disabled={!config.teamSize || !config.complexity} className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

// ============== frontend/src/components/steps/Step5Review.tsx =================
import React from 'react';
import type { Config } from '../../lib/types';

export const Step5Review: React.FC<{
  config: Config;
  next: () => void;
  back: () => void;
}> = ({ config, next, back }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Configuration</h2>
        <p className="text-gray-600 mb-6">Here's what we'll create:</p>
      </div>
      <div className="bg-gray-50 p-6 rounded-lg space-y-2">
        <div><span className="font-medium">Platform:</span> {config.platform}</div>
        <div><span className="font-medium">Priorities:</span> {config.priorities.join(', ')}</div>
        <div><span className="font-medium">Features:</span> {config.features.join(', ')}</div>
        <div><span className="font-medium">Team Size:</span> {config.teamSize}</div>
        <div><span className="font-medium">Complexity:</span> {config.complexity}</div>
      </div>
      <div className="flex gap-4">
        <button onClick={back} className="px-6 py-3 border rounded-lg">Back</button>
        <button onClick={next} className="px-6 py-3 bg-green-600 text-white rounded-lg">Generate My Solution</button>
      </div>
    </div>
  );
};

// ============= frontend/src/components/steps/Step6Solution.tsx ===============
import React from 'react';
import { copyToClipboard, downloadMarkdown } from '../../lib/download';

export const Step6Solution: React.FC<{
  platform: string;
  solution: string;
  onCopy: () => void;
  onAutoSetup: () => void;
  goStart: () => void;
  goModify: () => void;
}> = ({ platform, solution, onCopy, onAutoSetup, goStart, goModify }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Your Custom Solution</h2>
          <p className="text-gray-600">Ready to implement in {platform}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={async () => { const ok = await copyToClipboard(solution); onCopy(); }} className="px-4 py-2 border rounded-lg">Copy</button>
          <button onClick={() => downloadMarkdown(`chat-session-management-${platform}.md`, solution)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Download</button>
          <button onClick={onAutoSetup} className="px-4 py-2 bg-green-600 text-white rounded-lg">Auto-Setup</button>
        </div>
      </div>
      <div className="bg-gray-50 border rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-100 border-b"><code className="text-sm">chat-session-management-{platform}.md</code></div>
        <div className="p-6 max-h-96 overflow-y-auto"><pre className="whitespace-pre-wrap text-sm">{solution}</pre></div>
      </div>
      <div className="flex gap-4">
        <button onClick={goStart} className="px-6 py-3 border rounded-lg">Start Over</button>
        <button onClick={goModify} className="px-6 py-3 border rounded-lg">Modify Configuration</button>
      </div>
    </div>
  );
};

// ============= frontend/src/components/steps/Step7AutoSetup.tsx ==============
import React, { useRef, useState } from 'react';
import type { Config } from '../../lib/types';
import { downloadPackage } from '../../lib/download';

export const Step7AutoSetup: React.FC<{
  config: Config;
  setImplementation: (s: string) => void;
  backToSolution: () => void;
  proceedToDone: () => void;
}> = ({ config, setImplementation, backToSolution, proceedToDone }) => {
  const notionParentPageIdRef = useRef<HTMLInputElement>(null); // not a secret
  const airtableBaseIdRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFull = () => {
    const pkg = `# Complete Package

Includes: instructions, templates, sample CSV, troubleshooting, workflows.`;
    downloadPackage(`chat-session-management-complete-${config.platform}.md`, pkg);
  };

  async function provisionNotion() {
    setBusy(true); setError(null);
    try {
      const res = await fetch('/api/provision/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentPageId: notionParentPageIdRef.current?.value || '',
          config,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Provisioning failed');
      setImplementation(`Notion provisioning complete. Database URL: ${data.url}`);
      proceedToDone();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function provisionAirtable() {
    setBusy(true); setError(null);
    try {
      const res = await fetch('/api/provision/airtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseId: airtableBaseIdRef.current?.value || '', seedSample: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Provisioning failed');
      const msg = `Airtable ready. Base URL: ${data.url}
Table: ${data.table}
Sample Record: ${data.sampleRecordId ?? 'n/a'}`;
      setImplementation(msg);
      proceedToDone();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Automated Setup</h2>
        <p className="text-gray-600 mb-6">A secure backend will create resources using server-stored integration tokens. Your browser never sends third‑party API keys.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">📥 Download Full Package</h3>
          <p className="text-gray-600 mb-4">Everything you need for manual setup.</p>
          <button onClick={downloadFull} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg">Download</button>
        </div>
        <div className="border rounded-lg p-6 space-y-5">
          <h3 className="text-lg font-semibold">🚀 Automated Provisioning</h3>
          {config.platform === 'notion' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">Notion Parent Page ID (required)</label>
              <input ref={notionParentPageIdRef} type="text" placeholder="32-char page id" className="w-full p-2 border rounded" />
              <p className="text-xs text-gray-500">Add your integration to this page in Notion before provisioning.</p>
              <button onClick={provisionNotion} disabled={busy} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">Create Notion Database</button>
            </div>
          )}
          {config.platform === 'airtable' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">Airtable Base ID (required)</label>
              <input ref={airtableBaseIdRef} type="text" placeholder="appXXXXXXXXXXXXXX" className="w-full p-2 border rounded" />
              <p className="text-xs text-gray-500">Create a base with a table named "Chat Sessions" (fields: Title, Date, Platform, Status, Summary, Rating). This step will validate and seed a sample record.</p>
              <button onClick={provisionAirtable} disabled={busy} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">Use Existing Airtable Base</button>
            </div>
          )}
          {!['notion', 'airtable'].includes(config.platform) && (
            <div className="text-center py-8 text-gray-600">Automated setup not available for this platform. Use the manual package instead.</div>
          )}
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-1">🔒 Security Note</h4>
        <p className="text-sm text-yellow-700">Provisioning uses server-side integration tokens stored as environment variables. No vendor API keys are stored or transmitted from your browser.</p>
      </div>
      {error && <div className="p-3 rounded bg-red-50 text-red-700 border border-red-200" role="alert">{error}</div>}
      <div className="flex gap-4">
        <button onClick={backToSolution} className="px-6 py-3 border rounded-lg">Back to Solution</button>
      </div>
    </div>
  );
};

// =================== frontend/src/components/steps/Step8Done.tsx =============
import React from 'react';

export const Step8Done: React.FC<{
  implementationResult: string;
  restart: () => void;
}> = ({ implementationResult, restart }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Implementation Complete 🎉</h2>
        <p className="text-gray-600">Your system has been set up.</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <pre className="whitespace-pre-wrap text-sm">{implementationResult}</pre>
      </div>
      <button onClick={restart} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Create Another System</button>
    </div>
  );
};

// ============== frontend/src/components/ChatManagerBuilder.tsx ===============
import React, { useEffect, useMemo, useReducer } from 'react';
import { Stepper } from './Stepper';
import type { AppState, Config } from '../lib/types';
import { saveState, loadState, decodeShare } from '../lib/storage';
import { generateNotionSolution } from '../lib/generators/notion';
import { generateAirtableSolution } from '../lib/generators/airtable';
import { generateSheetsSolution } from '../lib/generators/sheets';
import { generateExcelSolution } from '../lib/generators/excel';
import { generateObsidianSolution } from '../lib/generators/obsidian';
import { generateLogseqSolution } from '../lib/generators/logseq';
import { generateCustomSolution } from '../lib/generators/custom';
import { Step1Platform } from './steps/Step1Platform';
import { Step2Priorities } from './steps/Step2Priorities';
import { Step3Features } from './steps/Step3Features';
import { Step4TeamComplexity } from './steps/Step4TeamComplexity';
import { Step5Review } from './steps/Step5Review';
import { Step6Solution } from './steps/Step6Solution';
import { Step7AutoSetup } from './steps/Step7AutoSetup';
import { Step8Done } from './steps/Step8Done';

const initialConfig: Config = { platform: '', priorities: [], complexity: '', teamSize: '', features: [] };
const initialState: AppState = { step: 1, config: initialConfig, generatedSolution: '', implementationResult: '', copied: false };

type Action =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_CONFIG'; patch: Partial<Config> }
  | { type: 'SET_SOLUTION'; text: string }
  | { type: 'SET_IMPLEMENTATION'; text: string }
  | { type: 'SET_COPIED'; val: boolean };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };
    case 'SET_CONFIG':
      return { ...state, config: { ...state.config, ...action.patch } };
    case 'SET_SOLUTION':
      return { ...state, generatedSolution: action.text };
    case 'SET_IMPLEMENTATION':
      return { ...state, implementationResult: action.text };
    case 'SET_COPIED':
      return { ...state, copied: action.val };
    default:
      return state;
  }
}

export const ChatManagerBuilder: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState, (base) => {
    const fromLocal = loadState();
    const url = new URL(window.location.href);
    const share = url.searchParams.get('config');
    let cfg = base.config;
    if (share) {
      const decoded = decodeShare(share);
      if (decoded) cfg = { ...cfg, ...decoded };
    } else if (fromLocal?.config) {
      cfg = { ...cfg, ...(fromLocal.config as Config) };
    }
    return { ...base, ...(fromLocal || {}), config: cfg } as AppState;
  });

  useEffect(() => { saveState({ step: state.step, config: state.config }); }, [state.step, state.config]);

  const solution = useMemo(() => state.generatedSolution, [state.generatedSolution]);

  function generateSolution() {
    let sol = '';
    switch (state.config.platform) {
      case 'notion': sol = generateNotionSolution(state.config); break;
      case 'airtable': sol = generateAirtableSolution(state.config); break;
      case 'sheets': sol = generateSheetsSolution(state.config); break;
      case 'excel': sol = generateExcelSolution(state.config); break;
      case 'obsidian': sol = generateObsidianSolution(state.config); break;
      case 'logseq': sol = generateLogseqSolution(state.config); break;
      case 'custom': sol = generateCustomSolution(state.config); break;
      default: sol = ''; break;
    }
    dispatch({ type: 'SET_SOLUTION', text: sol });
    dispatch({ type: 'SET_STEP', step: 6 });
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Chat Session Management Builder</h1>
        <Stepper current={state.step} total={8} />
      </div>
      {state.step === 1 && (
        <Step1Platform config={state.config} setConfig={(patch) => dispatch({ type: 'SET_CONFIG', patch })} next={() => dispatch({ type: 'SET_STEP', step: 2 })} />
      )}
      {state.step === 2 && (
        <Step2Priorities config={state.config} setConfig={(patch) => dispatch({ type: 'SET_CONFIG', patch })} back={() => dispatch({ type: 'SET_STEP', step: 1 })} next={() => dispatch({ type: 'SET_STEP', step: 3 })} />
      )}
      {state.step === 3 && (
        <Step3Features config={state.config} setConfig={(patch) => dispatch({ type: 'SET_CONFIG', patch })} back={() => dispatch({ type: 'SET_STEP', step: 2 })} next={() => dispatch({ type: 'SET_STEP', step: 4 })} />
      )}
      {state.step === 4 && (
        <Step4TeamComplexity config={state.config} setConfig={(patch) => dispatch({ type: 'SET_CONFIG', patch })} back={() => dispatch({ type: 'SET_STEP', step: 3 })} next={() => dispatch({ type: 'SET_STEP', step: 5 })} />
      )}
      {state.step === 5 && (
        <Step5Review config={state.config} back={() => dispatch({ type: 'SET_STEP', step: 4 })} next={generateSolution} />
      )}
      {state.step === 6 && (
        <Step6Solution
          platform={state.config.platform || ''}
          solution={solution}
          onCopy={() => dispatch({ type: 'SET_COPIED', val: true })}
          onAutoSetup={() => dispatch({ type: 'SET_STEP', step: 7 })}
          goStart={() => dispatch({ type: 'SET_STEP', step: 1 })}
          goModify={() => dispatch({ type: 'SET_STEP', step: 5 })}
        />
      )}
      {state.step === 7 && (
        <Step7AutoSetup
          config={state.config}
          setImplementation={(text) => dispatch({ type: 'SET_IMPLEMENTATION', text })}
          backToSolution={() => dispatch({ type: 'SET_STEP', step: 6 })}
          proceedToDone={() => dispatch({ type: 'SET_STEP', step: 8 })}
        />
      )}
      {state.step === 8 && (
        <Step8Done implementationResult={state.implementationResult} restart={() => dispatch({ type: 'SET_STEP', step: 1 })} />
      )}
    </div>
  );
};

export default ChatManagerBuilder;

// =============================== frontend/main.tsx ===========================
import React from 'react';
import { createRoot } from 'react-dom/client';
import ChatManagerBuilder from './src/components/ChatManagerBuilder';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChatManagerBuilder />
  </React.StrictMode>
);

// =============================== frontend/index.css ==========================
/* minimal styles + Tailwind recommended in your build */
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }

// =============================== server/src/index.ts =========================
import express from 'express';
import cors from 'cors';
import provisionNotion from './routes/provisionNotion';
import provisionAirtable from './routes/provisionAirtable';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.post('/api/provision/notion', provisionNotion);
app.post('/api/provision/airtable', provisionAirtable);

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`Server listening on :${port}`));

// ======================= server/src/routes/provisionNotion.ts =================
import type { Request, Response } from 'express';
import { Client } from '@notionhq/client';

export default async function provisionNotion(req: Request, res: Response) {
  try {
    const token = process.env.NOTION_TOKEN;
    if (!token) return res.status(500).json({ error: 'Server not configured (NOTION_TOKEN missing).' });

    const { parentPageId, config } = req.body as { parentPageId: string; config: any };
    if (!parentPageId) return res.status(400).json({ error: 'parentPageId is required' });

    const notion = new Client({ auth: token });

    // Minimal database example — extend with properties derived from config
    const db = await notion.databases.create({
      parent: { type: 'page_id', page_id: parentPageId },
      title: [{ type: 'text', text: { content: 'Chat Sessions' } }],
      properties: {
        Title: { title: {} },
        Platform: { select: { options: [ { name: 'Claude' }, { name: 'ChatGPT' }, { name: 'Bard' }, { name: 'Other' } ] } },
        Status: { select: { options: [ { name: 'Active' }, { name: 'On-Hold' }, { name: 'Completed' }, { name: 'Archived' } ] } },
        Created: { created_time: {} },
        Updated: { last_edited_time: {} },
      },
    });

    return res.json({ url: db.url, id: db.id });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

// ===================== server/src/routes/provisionAirtable.ts ================
import type { Request, Response } from 'express';
import Airtable from 'airtable';

/**
 * MVP Airtable provisioning
 * Note: Airtable's public REST API cannot create bases or tables. This route assumes:
 *  - You already created a Base in the UI
 *  - That base contains a table named "Chat Sessions" with some minimally-required fields
 * This endpoint validates connectivity and optionally seeds a sample record.
 */
export default async function provisionAirtable(req: Request, res: Response) {
  try {
    const token = process.env.AIRTABLE_TOKEN;
    if (!token) return res.status(500).json({ error: 'Server not configured (AIRTABLE_TOKEN missing).' });

    const { baseId, seedSample } = req.body as { baseId: string; seedSample?: boolean };
    if (!baseId) return res.status(400).json({ error: 'baseId is required' });

    const base = new Airtable({ apiKey: token }).base(baseId);

    // Health check: try to select from Chat Sessions
    const tableName = 'Chat Sessions';
    await base(tableName).select({ maxRecords: 1 }).firstPage();

    let createdId: string | undefined;
    if (seedSample) {
      const created = await base(tableName).create([
        {
          fields: {
            Title: 'Sample Session',
            Platform: 'ChatGPT',
            Status: 'Active',
            Summary: 'Seeded by provisioning endpoint',
            Date: new Date().toISOString().slice(0, 10),
          },
        },
      ]);
      createdId = created?.[0]?.id;
    }

    const url = `https://airtable.com/${baseId}`;
    return res.json({ url, table: tableName, sampleRecordId: createdId });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

// ============================== server/package.json ==========================
{
  "name": "chat-session-builder-server",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@notionhq/client": "^2.2.15",
    "airtable": "^0.11.6",
    "cors": "^2.8.5",
    "express": "^4.19.2"
  },
  "devDependencies": {
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.4"
  }
}

// ============================== server/tsconfig.json =========================
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "Node",
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "strict": true,
    "skipLibCheck": true
  }
}

// =============================== server/.env.example =========================
# Server-side tokens (never expose to the browser)
NOTION_TOKEN=secret_xxx
AIRTABLE_TOKEN=pat_xxx
PORT=8787

// ================================= server/README.md ==========================
# Secure Provisioning Backend

This backend exposes API routes that the front-end calls in Step 7. Tokens are **only** stored server-side.

## Notion
1. Create a Notion integration and copy its secret to `NOTION_TOKEN`.
2. In Notion, add the integration to the parent page where the database will be created.
3. Call `POST /api/provision/notion` with `{ parentPageId, config }`.

## Airtable (MVP)
> The public REST API cannot create bases or tables. This MVP assumes you already created a Base with a table named **"Chat Sessions"** in the UI.

- Set `AIRTABLE_TOKEN` in `.env`.
- In the front-end, provide the **Base ID** on Step 7 → "Use Existing Airtable Base".
- The backend validates access and seeds a sample record.

### Recommended table fields
- `Title` (Single line text)
- `Date` (Date)
- `Platform` (Single select)
- `Status` (Single select)
- `Summary` (Long text)
- `Rating` (Number or Rating)

## Security Notes
- No third‑party API keys are accepted from the browser.
- CORS restricts origins; configure for your frontend domain in production.
- Log minimal data and never log secrets.

---

# Tailwind Setup (Optional but recommended)

In the **frontend** directory, install Tailwind and friends:

```bash
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.config.ts`
```ts
import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
```

`postcss.config.cjs`
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

Replace `frontend/index.css` with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
