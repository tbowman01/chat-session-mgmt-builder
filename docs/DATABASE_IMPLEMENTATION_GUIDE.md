# Database Implementation Guide

## Overview

This guide provides implementation specifications for data storage and management in the Chat Session Management Builder application, including client-side storage strategies, platform-specific database schemas, and future server-side database implementation.

## 1. Client-Side Storage Implementation

### 1.1 Local Storage Strategy

**Storage Utilities (src/utils/storage.ts)**
```typescript
interface StorageData {
  version: string;
  timestamp: number;
  wizardState: {
    currentStep: number;
    config: Configuration;
    generatedSolution?: string;
    implementationResult?: string;
  };
  userPreferences: {
    theme: 'light' | 'dark' | 'auto';
    autoSave: boolean;
    notifications: boolean;
    defaultPlatform?: PlatformId;
  };
  history: StateSnapshot[];
  analytics: {
    sessionId: string;
    startTime: number;
    events: AnalyticsEvent[];
  };
}

class StorageManager {
  private readonly STORAGE_KEY = 'chatBuilderV2';
  private readonly VERSION = '2.0.0';

  save(data: Partial<StorageData>): void {
    try {
      const existing = this.load();
      const updated: StorageData = {
        ...existing,
        ...data,
        version: this.VERSION,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  load(): StorageData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return this.getDefaultData();
      
      const data = JSON.parse(stored);
      
      // Handle version migration
      if (data.version !== this.VERSION) {
        return this.migrateData(data);
      }
      
      return data;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return this.getDefaultData();
    }
  }

  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private getDefaultData(): StorageData {
    return {
      version: this.VERSION,
      timestamp: Date.now(),
      wizardState: {
        currentStep: 1,
        config: {
          platform: '',
          priorities: [],
          features: [],
          teamSize: '',
          complexity: ''
        }
      },
      userPreferences: {
        theme: 'auto',
        autoSave: true,
        notifications: true
      },
      history: [],
      analytics: {
        sessionId: this.generateSessionId(),
        startTime: Date.now(),
        events: []
      }
    };
  }

  private migrateData(oldData: any): StorageData {
    // Handle migration from v1.x to v2.0
    const defaultData = this.getDefaultData();
    
    if (oldData.version?.startsWith('1.')) {
      return {
        ...defaultData,
        wizardState: {
          ...defaultData.wizardState,
          currentStep: oldData.step || 1,
          config: oldData.config || defaultData.wizardState.config
        }
      };
    }
    
    return defaultData;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Export data for backup/sharing
  exportData(): string {
    const data = this.load();
    return JSON.stringify(data, null, 2);
  }

  // Import data from backup
  importData(jsonString: string): boolean {
    try {
      const importedData = JSON.parse(jsonString);
      this.save(importedData);
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

export const storageManager = new StorageManager();
```

### 1.2 Analytics Data Collection

**Analytics Service (src/services/analyticsService.ts)**
```typescript
interface AnalyticsEvent {
  id: string;
  type: EventType;
  timestamp: number;
  data: Record<string, any>;
  context: {
    step: number;
    platform?: PlatformId;
    userAgent: string;
    viewport: { width: number; height: number };
  };
}

type EventType = 
  | 'wizard_started'
  | 'step_completed' 
  | 'platform_selected'
  | 'priorities_set'
  | 'features_selected'
  | 'solution_generated'
  | 'solution_downloaded'
  | 'solution_copied'
  | 'auto_setup_started'
  | 'auto_setup_completed'
  | 'error_occurred'
  | 'wizard_abandoned';

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = storageManager.load().analytics.sessionId;
    this.loadEvents();
  }

  track(type: EventType, data: Record<string, any> = {}): void {
    const event: AnalyticsEvent = {
      id: this.generateEventId(),
      type,
      timestamp: Date.now(),
      data,
      context: {
        step: this.getCurrentStep(),
        platform: this.getCurrentPlatform(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    this.events.push(event);
    this.saveEvents();
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getEventsByType(type: EventType): AnalyticsEvent[] {
    return this.events.filter(event => event.type === type);
  }

  clearEvents(): void {
    this.events = [];
    this.saveEvents();
  }

  // Generate analytics summary
  getSummary(): AnalyticsSummary {
    const startEvent = this.events.find(e => e.type === 'wizard_started');
    const completionEvent = this.events.find(e => e.type === 'auto_setup_completed');
    
    return {
      sessionId: this.sessionId,
      startTime: startEvent?.timestamp || Date.now(),
      endTime: completionEvent?.timestamp,
      totalEvents: this.events.length,
      stepsCompleted: this.getEventsByType('step_completed').length,
      platformsExplored: [...new Set(this.events.map(e => e.context.platform).filter(Boolean))],
      timeSpent: completionEvent ? completionEvent.timestamp - (startEvent?.timestamp || 0) : 0,
      completed: !!completionEvent,
      abandoned: this.getEventsByType('wizard_abandoned').length > 0
    };
  }

  private getCurrentStep(): number {
    return storageManager.load().wizardState.currentStep;
  }

  private getCurrentPlatform(): PlatformId | undefined {
    return storageManager.load().wizardState.config.platform || undefined;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  private loadEvents(): void {
    const data = storageManager.load();
    this.events = data.analytics.events || [];
  }

  private saveEvents(): void {
    storageManager.save({
      analytics: {
        sessionId: this.sessionId,
        startTime: storageManager.load().analytics.startTime,
        events: this.events
      }
    });
  }
}

interface AnalyticsSummary {
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalEvents: number;
  stepsCompleted: number;
  platformsExplored: PlatformId[];
  timeSpent: number;
  completed: boolean;
  abandoned: boolean;
}

export const analyticsService = new AnalyticsService();
```

## 2. Platform-Specific Database Schemas

### 2.1 Notion Database Schema Implementation

**Notion Schema Generator (src/utils/generators/notionSchemaGenerator.ts)**
```typescript
import type { Configuration, PlatformCapabilities } from '@shared/types';

interface NotionProperty {
  name: string;
  type: NotionPropertyType;
  config: any;
  required: boolean;
  description: string;
}

type NotionPropertyType = 
  | 'title'
  | 'rich_text' 
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'formula'
  | 'relation'
  | 'rollup'
  | 'created_time'
  | 'created_by'
  | 'last_edited_time'
  | 'last_edited_by';

export class NotionSchemaGenerator {
  generateProperties(config: Configuration): NotionProperty[] {
    const properties: NotionProperty[] = [
      // Core properties
      {
        name: 'Session Title',
        type: 'title',
        config: {},
        required: true,
        description: 'The main title or topic of the chat session'
      },
      {
        name: 'Date Created',
        type: 'created_time',
        config: {},
        required: true,
        description: 'When the session was first created'
      },
      {
        name: 'Last Updated',
        type: 'last_edited_time',
        config: {},
        required: true,
        description: 'When the session was last modified'
      },
      {
        name: 'Platform',
        type: 'select',
        config: {
          options: [
            { name: 'ChatGPT', color: 'green' },
            { name: 'Claude', color: 'blue' },
            { name: 'Gemini', color: 'orange' },
            { name: 'Perplexity', color: 'purple' },
            { name: 'GitHub Copilot', color: 'default' },
            { name: 'Other', color: 'gray' }
          ]
        },
        required: true,
        description: 'Which AI platform was used for this session'
      },
      {
        name: 'Status',
        type: 'select',
        config: {
          options: [
            { name: 'Active', color: 'green' },
            { name: 'On Hold', color: 'yellow' },
            { name: 'Completed', color: 'blue' },
            { name: 'Archived', color: 'gray' }
          ]
        },
        required: true,
        description: 'Current status of the session'
      },
      {
        name: 'Summary',
        type: 'rich_text',
        config: {},
        required: false,
        description: 'Brief summary of the session content'
      },
      {
        name: 'Key Insights',
        type: 'rich_text',
        config: {},
        required: false,
        description: 'Important insights or learnings from the session'
      },
      {
        name: 'Action Items',
        type: 'rich_text',
        config: {},
        required: false,
        description: 'Follow-up tasks or action items'
      },
      {
        name: 'Notes',
        type: 'rich_text',
        config: {},
        required: false,
        description: 'Additional notes or context'
      }
    ];

    // Add organization properties
    if (config.priorities.includes('organization')) {
      properties.push(
        {
          name: 'Primary Topic',
          type: 'select',
          config: {
            options: [
              { name: 'Development', color: 'blue' },
              { name: 'Design', color: 'purple' },
              { name: 'Business', color: 'green' },
              { name: 'Research', color: 'orange' },
              { name: 'Personal', color: 'pink' },
              { name: 'Learning', color: 'yellow' },
              { name: 'Problem Solving', color: 'red' }
            ]
          },
          required: false,
          description: 'Main topic category for this session'
        },
        {
          name: 'Secondary Topics',
          type: 'multi_select',
          config: {
            options: [
              { name: 'Frontend', color: 'blue' },
              { name: 'Backend', color: 'green' },
              { name: 'Database', color: 'orange' },
              { name: 'DevOps', color: 'red' },
              { name: 'Testing', color: 'yellow' },
              { name: 'Documentation', color: 'gray' },
              { name: 'Architecture', color: 'purple' },
              { name: 'Performance', color: 'pink' }
            ]
          },
          required: false,
          description: 'Additional topic tags for better categorization'
        },
        {
          name: 'Category',
          type: 'select',
          config: {
            options: [
              { name: 'Work', color: 'blue' },
              { name: 'Personal', color: 'green' },
              { name: 'Learning', color: 'orange' },
              { name: 'Research', color: 'purple' },
              { name: 'Client Work', color: 'red' }
            ]
          },
          required: false,
          description: 'High-level category classification'
        }
      );
    }

    // Add project management properties
    if (config.features.includes('projects')) {
      properties.push(
        {
          name: 'Project',
          type: 'relation',
          config: {
            database_id: '', // Will be set during actual creation
            type: 'single_property'
          },
          required: false,
          description: 'Related project (links to Projects database)'
        },
        {
          name: 'Project Phase',
          type: 'select',
          config: {
            options: [
              { name: 'Discovery', color: 'orange' },
              { name: 'Planning', color: 'yellow' },
              { name: 'Development', color: 'blue' },
              { name: 'Testing', color: 'purple' },
              { name: 'Deployment', color: 'green' },
              { name: 'Maintenance', color: 'gray' }
            ]
          },
          required: false,
          description: 'Current phase of the related project'
        }
      );
    }

    // Add tagging system properties
    if (config.features.includes('tags')) {
      properties.push(
        {
          name: 'Tags',
          type: 'multi_select',
          config: {
            options: [
              { name: 'Urgent', color: 'red' },
              { name: 'Follow-up', color: 'yellow' },
              { name: 'Idea', color: 'purple' },
              { name: 'Bug Fix', color: 'orange' },
              { name: 'Feature Request', color: 'blue' },
              { name: 'Documentation', color: 'gray' },
              { name: 'Review', color: 'green' },
              { name: 'Question', color: 'pink' }
            ]
          },
          required: false,
          description: 'Flexible tags for organization and filtering'
        },
        {
          name: 'Priority',
          type: 'select',
          config: {
            options: [
              { name: 'Critical', color: 'red' },
              { name: 'High', color: 'orange' },
              { name: 'Medium', color: 'yellow' },
              { name: 'Low', color: 'green' },
              { name: 'Someday', color: 'gray' }
            ]
          },
          required: false,
          description: 'Priority level for follow-up or reference'
        }
      );
    }

    // Add analytics properties
    if (config.priorities.includes('analytics')) {
      properties.push(
        {
          name: 'Duration (minutes)',
          type: 'number',
          config: { format: 'number' },
          required: false,
          description: 'How long the session lasted in minutes'
        },
        {
          name: 'Message Count',
          type: 'number',
          config: { format: 'number' },
          required: false,
          description: 'Total number of messages in the conversation'
        },
        {
          name: 'Satisfaction Rating',
          type: 'select',
          config: {
            options: [
              { name: 'Excellent', color: 'green' },
              { name: 'Good', color: 'blue' },
              { name: 'Average', color: 'yellow' },
              { name: 'Poor', color: 'red' },
              { name: 'Very Poor', color: 'red' }
            ]
          },
          required: false,
          description: 'How satisfied you were with the session results'
        },
        {
          name: 'Value Rating',
          type: 'select',
          config: {
            options: [
              { name: 'Breakthrough', color: 'green' },
              { name: 'Very Helpful', color: 'blue' },
              { name: 'Helpful', color: 'yellow' },
              { name: 'Somewhat Helpful', color: 'orange' },
              { name: 'Not Helpful', color: 'red' }
            ]
          },
          required: false,
          description: 'How valuable this session was for your goals'
        }
      );
    }

    // Add reminder properties
    if (config.features.includes('reminders')) {
      properties.push(
        {
          name: 'Follow-up Date',
          type: 'date',
          config: {},
          required: false,
          description: 'When to revisit or follow up on this session'
        },
        {
          name: 'Reminder Type',
          type: 'select',
          config: {
            options: [
              { name: 'Review', color: 'blue' },
              { name: 'Implement', color: 'green' },
              { name: 'Research Further', color: 'orange' },
              { name: 'Share Results', color: 'purple' },
              { name: 'Test Solution', color: 'yellow' }
            ]
          },
          required: false,
          description: 'Type of follow-up action needed'
        }
      );
    }

    // Add collaboration properties
    if (config.priorities.includes('collaboration')) {
      properties.push(
        {
          name: 'Shared With',
          type: 'multi_select',
          config: {
            options: [
              { name: 'Team', color: 'blue' },
              { name: 'Manager', color: 'green' },
              { name: 'Client', color: 'orange' },
              { name: 'Public', color: 'purple' },
              { name: 'Stakeholders', color: 'red' }
            ]
          },
          required: false,
          description: 'Who has access to or should see this session'
        },
        {
          name: 'Collaboration Status',
          type: 'select',
          config: {
            options: [
              { name: 'Private', color: 'gray' },
              { name: 'Team Review', color: 'yellow' },
              { name: 'Shared', color: 'blue' },
              { name: 'Published', color: 'green' }
            ]
          },
          required: false,
          description: 'Current sharing/collaboration status'
        }
      );
    }

    return properties;
  }

  generateViews(config: Configuration): NotionViewConfig[] {
    const views: NotionViewConfig[] = [
      {
        name: 'All Sessions',
        type: 'table',
        sort: [{ property: 'Date Created', direction: 'descending' }],
        filter: null
      },
      {
        name: 'Recent Sessions',
        type: 'table',
        sort: [{ property: 'Last Updated', direction: 'descending' }],
        filter: {
          property: 'Date Created',
          condition: 'past_week'
        }
      },
      {
        name: 'Active Sessions',
        type: 'table',
        sort: [{ property: 'Date Created', direction: 'descending' }],
        filter: {
          property: 'Status',
          condition: 'equals',
          value: 'Active'
        }
      }
    ];

    if (config.priorities.includes('organization')) {
      views.push(
        {
          name: 'By Topic',
          type: 'table',
          sort: [{ property: 'Primary Topic', direction: 'ascending' }],
          groupBy: 'Primary Topic',
          filter: null
        },
        {
          name: 'By Category',
          type: 'board',
          groupBy: 'Category',
          sort: [{ property: 'Date Created', direction: 'descending' }],
          filter: null
        }
      );
    }

    if (config.features.includes('projects')) {
      views.push({
        name: 'By Project',
        type: 'table',
        groupBy: 'Project',
        sort: [{ property: 'Date Created', direction: 'descending' }],
        filter: null
      });
    }

    if (config.features.includes('timeline')) {
      views.push({
        name: 'Timeline View',
        type: 'timeline',
        sort: [{ property: 'Date Created', direction: 'ascending' }],
        filter: null
      });
    }

    if (config.priorities.includes('analytics')) {
      views.push({
        name: 'High Value Sessions',
        type: 'table',
        sort: [{ property: 'Value Rating', direction: 'descending' }],
        filter: {
          property: 'Value Rating',
          condition: 'equals',
          value: 'Breakthrough'
        }
      });
    }

    return views;
  }
}

interface NotionViewConfig {
  name: string;
  type: 'table' | 'board' | 'timeline' | 'calendar' | 'list' | 'gallery';
  sort: { property: string; direction: 'ascending' | 'descending' }[];
  filter: any;
  groupBy?: string;
}

export const notionSchemaGenerator = new NotionSchemaGenerator();
```

### 2.2 Airtable Schema Implementation

**Airtable Schema Generator (src/utils/generators/airtableSchemaGenerator.ts)**
```typescript
import type { Configuration } from '@shared/types';

interface AirtableField {
  name: string;
  type: AirtableFieldType;
  options?: any;
  description?: string;
}

type AirtableFieldType = 
  | 'singleLineText'
  | 'longText'
  | 'number'
  | 'singleSelect'
  | 'multipleSelects'
  | 'date'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phoneNumber'
  | 'attachment'
  | 'barcode'
  | 'rating'
  | 'richText'
  | 'duration'
  | 'autonumber'
  | 'createdTime'
  | 'modifiedTime'
  | 'createdBy'
  | 'modifiedBy'
  | 'formula'
  | 'rollup'
  | 'count'
  | 'lookup'
  | 'multipleRecordLinks'
  | 'dateTime';

export class AirtableSchemaGenerator {
  generateFields(config: Configuration): AirtableField[] {
    const fields: AirtableField[] = [
      // Core fields
      {
        name: 'Session Title',
        type: 'singleLineText',
        description: 'The main title or topic of the chat session'
      },
      {
        name: 'Date Created',
        type: 'createdTime',
        description: 'When the session was first created'
      },
      {
        name: 'Last Modified',
        type: 'modifiedTime',
        description: 'When the session was last updated'
      },
      {
        name: 'Platform',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'ChatGPT' },
            { name: 'Claude' },
            { name: 'Gemini' },
            { name: 'Perplexity' },
            { name: 'GitHub Copilot' },
            { name: 'Other' }
          ]
        },
        description: 'Which AI platform was used'
      },
      {
        name: 'Status',
        type: 'singleSelect',
        options: {
          choices: [
            { name: 'Active' },
            { name: 'On Hold' },
            { name: 'Completed' },
            { name: 'Archived' }
          ]
        },
        description: 'Current status of the session'
      },
      {
        name: 'Summary',
        type: 'longText',
        description: 'Brief summary of the session content'
      },
      {
        name: 'Key Insights',
        type: 'longText',
        description: 'Important insights or learnings'
      },
      {
        name: 'Action Items',
        type: 'longText',
        description: 'Follow-up tasks or action items'
      },
      {
        name: 'Notes',
        type: 'longText',
        description: 'Additional notes or context'
      }
    ];

    // Add organization fields
    if (config.priorities.includes('organization')) {
      fields.push(
        {
          name: 'Primary Topic',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Development' },
              { name: 'Design' },
              { name: 'Business' },
              { name: 'Research' },
              { name: 'Personal' },
              { name: 'Learning' },
              { name: 'Problem Solving' }
            ]
          },
          description: 'Main topic category'
        },
        {
          name: 'Secondary Topics',
          type: 'multipleSelects',
          options: {
            choices: [
              { name: 'Frontend' },
              { name: 'Backend' },
              { name: 'Database' },
              { name: 'DevOps' },
              { name: 'Testing' },
              { name: 'Documentation' },
              { name: 'Architecture' }
            ]
          },
          description: 'Additional topic tags'
        },
        {
          name: 'Category',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Work' },
              { name: 'Personal' },
              { name: 'Learning' },
              { name: 'Research' },
              { name: 'Client Work' }
            ]
          },
          description: 'High-level category'
        }
      );
    }

    // Add project management fields
    if (config.features.includes('projects')) {
      fields.push(
        {
          name: 'Project',
          type: 'multipleRecordLinks',
          options: {
            linkedTableId: 'tblProjects' // Would be set during creation
          },
          description: 'Related project'
        },
        {
          name: 'Project Phase',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Discovery' },
              { name: 'Planning' },
              { name: 'Development' },
              { name: 'Testing' },
              { name: 'Deployment' },
              { name: 'Maintenance' }
            ]
          },
          description: 'Current project phase'
        }
      );
    }

    // Add tagging fields
    if (config.features.includes('tags')) {
      fields.push(
        {
          name: 'Tags',
          type: 'multipleSelects',
          options: {
            choices: [
              { name: 'Urgent' },
              { name: 'Follow-up' },
              { name: 'Idea' },
              { name: 'Bug Fix' },
              { name: 'Feature Request' },
              { name: 'Documentation' },
              { name: 'Review' },
              { name: 'Question' }
            ]
          },
          description: 'Flexible tags for organization'
        },
        {
          name: 'Priority',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Critical' },
              { name: 'High' },
              { name: 'Medium' },
              { name: 'Low' },
              { name: 'Someday' }
            ]
          },
          description: 'Priority level'
        }
      );
    }

    // Add analytics fields
    if (config.priorities.includes('analytics')) {
      fields.push(
        {
          name: 'Duration (minutes)',
          type: 'number',
          options: {
            precision: 0
          },
          description: 'Session duration in minutes'
        },
        {
          name: 'Message Count',
          type: 'number',
          options: {
            precision: 0
          },
          description: 'Total number of messages'
        },
        {
          name: 'Satisfaction Rating',
          type: 'rating',
          options: {
            icon: 'star',
            max: 5
          },
          description: 'Satisfaction with session results'
        },
        {
          name: 'Value Rating',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Breakthrough' },
              { name: 'Very Helpful' },
              { name: 'Helpful' },
              { name: 'Somewhat Helpful' },
              { name: 'Not Helpful' }
            ]
          },
          description: 'Value assessment'
        }
      );
    }

    // Add reminder fields
    if (config.features.includes('reminders')) {
      fields.push(
        {
          name: 'Follow-up Date',
          type: 'date',
          description: 'When to revisit this session'
        },
        {
          name: 'Reminder Type',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Review' },
              { name: 'Implement' },
              { name: 'Research Further' },
              { name: 'Share Results' },
              { name: 'Test Solution' }
            ]
          },
          description: 'Type of follow-up needed'
        }
      );
    }

    // Add collaboration fields
    if (config.priorities.includes('collaboration')) {
      fields.push(
        {
          name: 'Shared With',
          type: 'multipleSelects',
          options: {
            choices: [
              { name: 'Team' },
              { name: 'Manager' },
              { name: 'Client' },
              { name: 'Public' },
              { name: 'Stakeholders' }
            ]
          },
          description: 'Who has access to this session'
        },
        {
          name: 'Collaboration Status',
          type: 'singleSelect',
          options: {
            choices: [
              { name: 'Private' },
              { name: 'Team Review' },
              { name: 'Shared' },
              { name: 'Published' }
            ]
          },
          description: 'Sharing status'
        }
      );
    }

    return fields;
  }

  generateViews(config: Configuration): AirtableViewConfig[] {
    const views: AirtableViewConfig[] = [
      {
        name: 'All Sessions',
        type: 'grid',
        sorts: [{ field: 'Date Created', direction: 'desc' }]
      },
      {
        name: 'Recent Sessions',
        type: 'grid',
        sorts: [{ field: 'Last Modified', direction: 'desc' }],
        filterByFormula: `IS_AFTER({Date Created}, DATEADD(TODAY(), -7, 'days'))`
      },
      {
        name: 'Active Sessions',
        type: 'grid',
        sorts: [{ field: 'Date Created', direction: 'desc' }],
        filterByFormula: `{Status} = 'Active'`
      }
    ];

    if (config.priorities.includes('organization')) {
      views.push({
        name: 'By Topic',
        type: 'grid',
        groupLevels: [{ field: 'Primary Topic' }],
        sorts: [{ field: 'Date Created', direction: 'desc' }]
      });
    }

    if (config.features.includes('projects')) {
      views.push({
        name: 'By Project',
        type: 'grid',
        groupLevels: [{ field: 'Project' }],
        sorts: [{ field: 'Date Created', direction: 'desc' }]
      });
    }

    if (config.priorities.includes('analytics')) {
      views.push({
        name: 'High Value Sessions',
        type: 'grid',
        sorts: [{ field: 'Satisfaction Rating', direction: 'desc' }],
        filterByFormula: `{Value Rating} = 'Breakthrough'`
      });
    }

    return views;
  }
}

interface AirtableViewConfig {
  name: string;
  type: 'grid' | 'form' | 'calendar' | 'gallery' | 'kanban';
  sorts?: { field: string; direction: 'asc' | 'desc' }[];
  groupLevels?: { field: string }[];
  filterByFormula?: string;
}

export const airtableSchemaGenerator = new AirtableSchemaGenerator();
```

## 3. Future Server-Side Database Implementation

### 3.1 PostgreSQL Schema (Future Enhancement)

**Database Migration (migrations/001_initial_schema.sql)**
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'::jsonb
);

-- Workspaces table
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{}'::jsonb
);

-- Configurations table
CREATE TABLE configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    config_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated solutions table
CREATE TABLE generated_solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    configuration_id UUID REFERENCES configurations(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provisioning jobs table
CREATE TABLE provisioning_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    configuration_id UUID REFERENCES configurations(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    resource_url TEXT,
    resource_id TEXT,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Analytics events table
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_configurations_user_id ON configurations(user_id);
CREATE INDEX idx_configurations_workspace_id ON configurations(workspace_id);
CREATE INDEX idx_solutions_config_id ON generated_solutions(configuration_id);
CREATE INDEX idx_provisioning_status ON provisioning_jobs(status);
CREATE INDEX idx_analytics_user_session ON analytics_events(user_id, session_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configurations_updated_at BEFORE UPDATE ON configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 Database Service Implementation

**Database Service (server/src/services/databaseService.ts)**
```typescript
import { Pool } from 'pg';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';
import type { Configuration, GeneratedSolution, ProvisioningJob, User } from '@shared/types';

class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: config.DATABASE_URL,
      ssl: config.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash, name, preferences)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const result = await this.pool.query(query, [
      userData.email,
      userData.passwordHash,
      userData.name,
      JSON.stringify(userData.preferences || {})
    ]);

    return result.rows[0];
  }

  async saveConfiguration(userId: string, config: Configuration): Promise<string> {
    const query = `
      INSERT INTO configurations (user_id, name, platform, config_data)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const name = `${config.platform} - ${new Date().toISOString().split('T')[0]}`;
    const result = await this.pool.query(query, [
      userId,
      name,
      config.platform,
      JSON.stringify(config)
    ]);

    return result.rows[0].id;
  }

  async saveSolution(configId: string, solution: GeneratedSolution): Promise<string> {
    const query = `
      INSERT INTO generated_solutions (configuration_id, content, metadata)
      VALUES ($1, $2, $3)
      RETURNING id
    `;

    const result = await this.pool.query(query, [
      configId,
      solution.content,
      JSON.stringify(solution.metadata)
    ]);

    return result.rows[0].id;
  }

  async createProvisioningJob(configId: string, platform: string): Promise<ProvisioningJob> {
    const query = `
      INSERT INTO provisioning_jobs (configuration_id, platform)
      VALUES ($1, $2)
      RETURNING *
    `;

    const result = await this.pool.query(query, [configId, platform]);
    return result.rows[0];
  }

  async updateProvisioningJob(jobId: string, updates: Partial<ProvisioningJob>): Promise<void> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE provisioning_jobs 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
    `;

    await this.pool.query(query, [jobId, ...Object.values(updates)]);
  }

  async trackAnalyticsEvent(
    userId: string | null,
    sessionId: string,
    eventType: string,
    eventData: Record<string, any>
  ): Promise<void> {
    const query = `
      INSERT INTO analytics_events (user_id, session_id, event_type, event_data)
      VALUES ($1, $2, $3, $4)
    `;

    await this.pool.query(query, [
      userId,
      sessionId,
      eventType,
      JSON.stringify(eventData)
    ]);
  }

  async getAnalytics(userId: string, timeRange: string): Promise<any> {
    let timeFilter = '';
    switch (timeRange) {
      case '24h':
        timeFilter = "created_at >= NOW() - INTERVAL '24 hours'";
        break;
      case '7d':
        timeFilter = "created_at >= NOW() - INTERVAL '7 days'";
        break;
      case '30d':
        timeFilter = "created_at >= NOW() - INTERVAL '30 days'";
        break;
      default:
        timeFilter = "created_at >= NOW() - INTERVAL '24 hours'";
    }

    const query = `
      SELECT 
        event_type,
        COUNT(*) as event_count,
        DATE_TRUNC('hour', created_at) as hour
      FROM analytics_events 
      WHERE user_id = $1 AND ${timeFilter}
      GROUP BY event_type, DATE_TRUNC('hour', created_at)
      ORDER BY hour DESC
    `;

    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }

  async cleanup(): Promise<void> {
    await this.pool.end();
  }
}

export const databaseService = new DatabaseService();
```

This comprehensive database implementation guide provides the foundation for both client-side storage management and future server-side database implementation. The schemas are designed to support all the features and priorities identified in the system specifications while maintaining flexibility for future enhancements.