# Chat Session Management Builder - Data Model Specification

## Overview

This document defines the complete data model architecture for the Chat Session Management Builder application, including TypeScript interfaces, database schemas, and data relationships.

## Core Data Types

### 1. Platform Types

```typescript
type PlatformId = 
  | 'notion' 
  | 'airtable' 
  | 'sheets' 
  | 'excel' 
  | 'obsidian' 
  | 'logseq' 
  | 'custom';

interface Platform {
  id: PlatformId;
  name: string;
  description: string;
  capabilities: {
    automation: boolean;
    api: boolean;
    collaboration: boolean;
    customFields: boolean;
    relations: boolean;
    views: boolean;
    formulas: boolean;
  };
  pricing: {
    free: boolean;
    paid: string[];
  };
}
```

### 2. Priority Types

```typescript
type PriorityId = 
  | 'organization'
  | 'search'
  | 'analytics'
  | 'collaboration'
  | 'automation'
  | 'simplicity'
  | 'portability'
  | 'integration';

interface Priority {
  id: PriorityId;
  name: string;
  description: string;
  icon?: string;
  weight: number; // 1-10 importance scale
  platformCompatibility: PlatformId[];
}
```

### 3. Feature Types

```typescript
type FeatureId = 
  | 'tags'
  | 'projects'
  | 'timeline'
  | 'templates'
  | 'reminders'
  | 'exports'
  | 'dashboard'
  | 'archive';

interface Feature {
  id: FeatureId;
  name: string;
  description: string;
  requiredComplexity: ComplexityId;
  dependencies?: FeatureId[];
  platformSupport: {
    [key in PlatformId]: boolean;
  };
}
```

### 4. Complexity Types

```typescript
type ComplexityId = 'simple' | 'moderate' | 'advanced';

interface ComplexityLevel {
  id: ComplexityId;
  name: string;
  description: string;
  maxFeatures: number;
  setupTime: string; // e.g., "30 minutes", "2 hours"
  maintenanceEffort: 'low' | 'medium' | 'high';
}
```

### 5. Team Size Types

```typescript
type TeamSizeOption = 
  | ''
  | 'Just me'
  | '2-5 people'
  | '6-20 people'
  | '20+ people';

interface TeamSize {
  value: TeamSizeOption;
  minUsers: number;
  maxUsers: number;
  recommendedPlatforms: PlatformId[];
  collaborationFeatures: string[];
}
```

## Application State Models

### 1. Configuration Model

```typescript
interface Config {
  platform: PlatformId | '';
  priorities: PriorityId[];
  complexity: ComplexityId | '';
  teamSize: TeamSizeOption;
  features: FeatureId[];
  customizations?: CustomizationOptions;
}

interface CustomizationOptions {
  colorScheme?: string;
  namingConvention?: string;
  timezone?: string;
  language?: string;
  dateFormat?: string;
  customFields?: CustomField[];
}

interface CustomField {
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox';
  required: boolean;
  defaultValue?: any;
  options?: string[]; // for select/multiselect
}
```

### 2. Application State

```typescript
interface AppState {
  step: number; // 1-8
  config: Config;
  generatedSolution: string;
  implementationResult: string;
  copied: boolean;
  history: StateHistory[];
  errors: AppError[];
}

interface StateHistory {
  timestamp: number;
  step: number;
  config: Config;
  action: string;
}

interface AppError {
  timestamp: number;
  code: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  context?: any;
}
```

## Database Schemas

### 1. Chat Session Schema

```typescript
interface ChatSession {
  id: string;
  title: string;
  dateCreated: Date;
  lastUpdated: Date;
  platform: string;
  status: SessionStatus;
  priority?: Priority;
  duration?: number; // minutes
  messageCount?: number;
  topics?: Topic[];
  projects?: Project[];
  tags?: Tag[];
  summary?: string;
  keyInsights?: string;
  actionItems?: ActionItem[];
  followUpDate?: Date;
  notes?: string;
  rating?: number; // 1-5
  satisfaction?: SatisfactionLevel;
  attachments?: Attachment[];
  metadata?: SessionMetadata;
}

type SessionStatus = 
  | 'active'
  | 'on-hold'
  | 'completed'
  | 'archived';

type SatisfactionLevel = 
  | 'excellent'
  | 'good'
  | 'average'
  | 'poor';

interface SessionMetadata {
  createdBy?: string;
  modifiedBy?: string;
  version?: number;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
}
```

### 2. Topic Schema

```typescript
interface Topic {
  id: string;
  name: string;
  parentId?: string; // for hierarchical topics
  description?: string;
  color?: string;
  icon?: string;
  keywords?: string[];
  sessionCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface TopicHierarchy {
  id: string;
  name: string;
  level: number;
  path: string; // e.g., "Work/Development/Frontend"
  children?: TopicHierarchy[];
}
```

### 3. Project Schema

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  teamMembers?: TeamMember[];
  goals?: string[];
  milestones?: Milestone[];
  relatedSessions?: string[]; // session IDs
  budget?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  metadata?: ProjectMetadata;
}

type ProjectStatus = 
  | 'planning'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role: string;
  permissions: Permission[];
}

interface Milestone {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  completedDate?: Date;
  description?: string;
}

interface ProjectMetadata {
  client?: string;
  department?: string;
  costCenter?: string;
  customFields?: { [key: string]: any };
}
```

### 4. Tag Schema

```typescript
interface Tag {
  id: string;
  name: string;
  category?: TagCategory;
  color?: string;
  icon?: string;
  usageCount: number;
  createdAt: Date;
  lastUsed?: Date;
  synonyms?: string[];
  description?: string;
}

type TagCategory = 
  | 'personal'
  | 'work'
  | 'learning'
  | 'research'
  | 'urgent'
  | 'followup'
  | 'idea'
  | 'custom';
```

### 5. Action Item Schema

```typescript
interface ActionItem {
  id: string;
  title: string;
  description?: string;
  status: ActionItemStatus;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: Date;
  completedDate?: Date;
  sessionId: string;
  projectId?: string;
  tags?: string[];
  checklist?: ChecklistItem[];
  dependencies?: string[]; // other action item IDs
}

type ActionItemStatus = 
  | 'pending'
  | 'in-progress'
  | 'blocked'
  | 'completed'
  | 'cancelled';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedDate?: Date;
  completedBy?: string;
}
```

### 6. Attachment Schema

```typescript
interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number; // bytes
  url?: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
  uploadedBy?: string;
  description?: string;
  tags?: string[];
  metadata?: {
    width?: number;
    height?: number;
    duration?: number; // for videos/audio
    pageCount?: number; // for PDFs
  };
}
```

## Relationship Models

### 1. Many-to-Many Relationships

```typescript
interface SessionTopic {
  sessionId: string;
  topicId: string;
  relevance: number; // 0-1 score
  isPrimary: boolean;
}

interface SessionProject {
  sessionId: string;
  projectId: string;
  contribution: string; // description of how session contributes
  phase?: string; // project phase during session
}

interface SessionTag {
  sessionId: string;
  tagId: string;
  addedAt: Date;
  addedBy?: string;
}

interface ProjectTopic {
  projectId: string;
  topicId: string;
  relevance: number;
}
```

## Platform-Specific Schemas

### 1. Notion Database Schema

```typescript
interface NotionDatabase {
  id: string;
  title: string;
  parentPageId: string;
  properties: NotionProperty[];
  views: NotionView[];
  permissions: NotionPermission[];
  createdTime: Date;
  lastEditedTime: Date;
}

interface NotionProperty {
  name: string;
  type: NotionPropertyType;
  configuration?: any; // type-specific config
  id: string;
}

type NotionPropertyType = 
  | 'title'
  | 'text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone'
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by';

interface NotionView {
  id: string;
  name: string;
  type: 'table' | 'board' | 'timeline' | 'calendar' | 'list' | 'gallery';
  filter?: NotionFilter;
  sort?: NotionSort[];
  groupBy?: string;
}
```

### 2. Airtable Base Schema

```typescript
interface AirtableBase {
  id: string;
  name: string;
  tables: AirtableTable[];
  collaborators: AirtableCollaborator[];
  workspaceId: string;
}

interface AirtableTable {
  id: string;
  name: string;
  fields: AirtableField[];
  views: AirtableView[];
  records?: AirtableRecord[];
}

interface AirtableField {
  id: string;
  name: string;
  type: AirtableFieldType;
  options?: any; // type-specific options
}

type AirtableFieldType = 
  | 'singleLineText'
  | 'longText'
  | 'number'
  | 'singleSelect'
  | 'multipleSelects'
  | 'date'
  | 'checkbox'
  | 'rating'
  | 'url'
  | 'email'
  | 'phone'
  | 'formula'
  | 'lookup'
  | 'rollup'
  | 'multipleRecordLinks'
  | 'attachment';
```

## Storage Models

### 1. Local Storage Schema

```typescript
interface LocalStorageData {
  version: string;
  lastSaved: Date;
  config: Config;
  step: number;
  solutions: GeneratedSolution[];
  preferences: UserPreferences;
}

interface GeneratedSolution {
  id: string;
  config: Config;
  content: string;
  generatedAt: Date;
  platform: PlatformId;
  exported: boolean;
}

interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  autoSave?: boolean;
  notifications?: boolean;
  defaultPlatform?: PlatformId;
  recentConfigs?: Config[];
}
```

### 2. Session Storage Schema

```typescript
interface SessionStorageData {
  currentSession: {
    id: string;
    startedAt: Date;
    lastActivity: Date;
    steps: StepHistory[];
  };
  tempData: {
    clipboard?: string;
    unsavedChanges?: boolean;
    lastError?: AppError;
  };
}

interface StepHistory {
  step: number;
  timestamp: Date;
  duration: number; // milliseconds
  config: Partial<Config>;
  completed: boolean;
}
```

## Analytics Models

```typescript
interface AnalyticsEvent {
  eventId: string;
  eventType: EventType;
  timestamp: Date;
  userId?: string;
  sessionId: string;
  properties: EventProperties;
  context: EventContext;
}

type EventType = 
  | 'page_view'
  | 'step_completed'
  | 'solution_generated'
  | 'solution_downloaded'
  | 'solution_copied'
  | 'auto_setup_initiated'
  | 'auto_setup_completed'
  | 'error_occurred';

interface EventProperties {
  step?: number;
  platform?: PlatformId;
  features?: FeatureId[];
  priorities?: PriorityId[];
  teamSize?: TeamSizeOption;
  complexity?: ComplexityId;
  errorCode?: string;
  duration?: number;
}

interface EventContext {
  userAgent: string;
  referrer?: string;
  viewport?: { width: number; height: number };
  screen?: { width: number; height: number };
  locale?: string;
  timezone?: string;
}
```

## Validation Rules

### 1. Configuration Validation

```typescript
interface ValidationRule {
  field: string;
  rules: Rule[];
}

interface Rule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

const configValidationRules: ValidationRule[] = [
  {
    field: 'platform',
    rules: [
      { type: 'required', message: 'Platform selection is required' }
    ]
  },
  {
    field: 'priorities',
    rules: [
      { type: 'min', value: 1, message: 'Select at least one priority' },
      { type: 'max', value: 4, message: 'Select up to 4 priorities for best results' }
    ]
  },
  {
    field: 'teamSize',
    rules: [
      { type: 'required', message: 'Team size selection is required' }
    ]
  },
  {
    field: 'complexity',
    rules: [
      { type: 'required', message: 'Complexity level is required' }
    ]
  }
];
```

## Migration Schemas

```typescript
interface DataMigration {
  version: string;
  fromVersion: string;
  toVersion: string;
  migrations: MigrationStep[];
  rollback?: MigrationStep[];
}

interface MigrationStep {
  id: string;
  description: string;
  transform: (data: any) => any;
  validate: (data: any) => boolean;
}
```

## Export/Import Formats

### 1. JSON Export Format

```typescript
interface ExportData {
  version: string;
  exportDate: Date;
  platform: PlatformId;
  sessions: ChatSession[];
  topics: Topic[];
  projects: Project[];
  tags: Tag[];
  metadata: {
    totalSessions: number;
    dateRange: { start: Date; end: Date };
    exportedBy?: string;
  };
}
```

### 2. CSV Export Format

```csv
Session ID,Title,Date Created,Platform,Status,Priority,Topics,Projects,Tags,Summary,Rating
```

## Security Models

```typescript
interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
  granted: boolean;
  conditions?: PermissionCondition[];
}

interface PermissionCondition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

interface SecurityContext {
  userId?: string;
  roles: string[];
  permissions: Permission[];
  ipAddress?: string;
  sessionToken?: string;
  expiresAt?: Date;
}
```

## Performance Optimization Models

```typescript
interface CacheEntry {
  key: string;
  value: any;
  expiresAt: Date;
  size: number; // bytes
  hits: number;
  lastAccessed: Date;
}

interface IndexDefinition {
  name: string;
  fields: string[];
  unique: boolean;
  sparse: boolean;
  partialFilter?: any;
}
```

This comprehensive data model specification provides the foundation for building a robust, scalable, and maintainable chat session management system.