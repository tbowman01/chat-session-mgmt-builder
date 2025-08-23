import { NotionClient } from './client.js';
import { Config } from '@/types/index.js';
import { logInfo, logDebug } from '@/utils/logger.js';

/**
 * Notion database creation and management service
 */
export class NotionDatabaseService {
  private client: NotionClient;
  
  constructor(client?: NotionClient) {
    this.client = client || new NotionClient();
  }
  
  /**
   * Create a complete chat session management database
   */
  async createChatSessionDatabase(parentPageId: string, config: Config) {
    try {
      // Validate parent page exists and is accessible
      await this.client.getPage(parentPageId);
      
      const databaseTitle = 'Chat Session Management';
      const properties = this.generateDatabaseProperties(config);
      
      logDebug('Creating Notion database', { 
        parentPageId, 
        title: databaseTitle, 
        config 
      });
      
      // Create the database
      const database = await this.client.createDatabase(
        parentPageId,
        databaseTitle,
        properties
      );
      
      // Create default views (this would require additional API calls in a full implementation)
      const views = this.getDefaultViews(config);
      
      const databaseUrl = (database as any).url || `https://www.notion.so/${database.id.replace(/-/g, '')}`;
      
      logInfo('Chat session database created successfully', {
        databaseId: database.id,
        url: databaseUrl,
        propertiesCount: Object.keys(properties).length,
      });
      
      return {
        id: database.id,
        url: databaseUrl,
        properties: this.formatPropertiesResponse(properties),
        views: views.map(v => v.name),
      };
    } catch (error) {
      throw error; // Re-throw to be handled by error middleware
    }
  }
  
  /**
   * Generate database properties based on user configuration
   */
  private generateDatabaseProperties(config: Config): Record<string, any> {
    const properties: Record<string, any> = {
      // Core properties (always included)
      'Title': {
        type: 'title',
        title: {},
      },
      'Platform': {
        type: 'select',
        select: {
          options: [
            { name: 'ChatGPT', color: 'green' },
            { name: 'Claude', color: 'blue' },
            { name: 'Gemini', color: 'orange' },
            { name: 'Perplexity', color: 'purple' },
            { name: 'Other', color: 'gray' },
          ],
        },
      },
      'Status': {
        type: 'select',
        select: {
          options: [
            { name: 'Active', color: 'green' },
            { name: 'Completed', color: 'blue' },
            { name: 'Paused', color: 'yellow' },
            { name: 'Archived', color: 'gray' },
          ],
        },
      },
      'Created': {
        type: 'created_time',
        created_time: {},
      },
      'Updated': {
        type: 'last_edited_time',
        last_edited_time: {},
      },
      'Summary': {
        type: 'rich_text',
        rich_text: {},
      },
      'Key Insights': {
        type: 'rich_text',
        rich_text: {},
      },
      'Action Items': {
        type: 'rich_text',
        rich_text: {},
      },
      'Follow-up Date': {
        type: 'date',
        date: {},
      },
      'Notes': {
        type: 'rich_text',
        rich_text: {},
      },
    };
    
    // Add organization-focused properties
    if (config.priorities.includes('organization')) {
      properties['Primary Topic'] = {
        type: 'select',
        select: {
          options: [
            { name: 'Work', color: 'blue' },
            { name: 'Personal', color: 'green' },
            { name: 'Learning', color: 'orange' },
            { name: 'Research', color: 'purple' },
            { name: 'Creative', color: 'pink' },
            { name: 'Technical', color: 'red' },
          ],
        },
      };
      
      properties['Secondary Topics'] = {
        type: 'multi_select',
        multi_select: {
          options: [
            { name: 'Problem Solving', color: 'blue' },
            { name: 'Brainstorming', color: 'green' },
            { name: 'Analysis', color: 'orange' },
            { name: 'Planning', color: 'purple' },
            { name: 'Debugging', color: 'red' },
            { name: 'Writing', color: 'pink' },
            { name: 'Code Review', color: 'yellow' },
          ],
        },
      };
      
      properties['Category'] = {
        type: 'select',
        select: {
          options: [
            { name: 'Quick Question', color: 'gray' },
            { name: 'Deep Discussion', color: 'blue' },
            { name: 'Tutorial/Learning', color: 'green' },
            { name: 'Troubleshooting', color: 'red' },
            { name: 'Creative Session', color: 'purple' },
          ],
        },
      };
    }
    
    // Add project management features
    if (config.features.includes('projects')) {
      // Note: Relations would require an existing database
      // For now, we'll use a select field
      properties['Project'] = {
        type: 'select',
        select: {
          options: [
            { name: 'Personal Projects', color: 'blue' },
            { name: 'Work Projects', color: 'green' },
            { name: 'Learning Projects', color: 'orange' },
            { name: 'Side Projects', color: 'purple' },
          ],
        },
      };
      
      properties['Project Phase'] = {
        type: 'select',
        select: {
          options: [
            { name: 'Planning', color: 'gray' },
            { name: 'Development', color: 'blue' },
            { name: 'Testing', color: 'orange' },
            { name: 'Review', color: 'yellow' },
            { name: 'Complete', color: 'green' },
          ],
        },
      };
    }
    
    // Add tags and priority features
    if (config.features.includes('tags')) {
      properties['Tags'] = {
        type: 'multi_select',
        multi_select: {
          options: [
            { name: 'Important', color: 'red' },
            { name: 'Quick Win', color: 'green' },
            { name: 'Learning', color: 'blue' },
            { name: 'Reference', color: 'purple' },
            { name: 'Follow-up', color: 'orange' },
            { name: 'Inspiration', color: 'pink' },
          ],
        },
      };
      
      properties['Priority'] = {
        type: 'select',
        select: {
          options: [
            { name: 'High', color: 'red' },
            { name: 'Medium', color: 'yellow' },
            { name: 'Low', color: 'gray' },
            { name: 'Someday', color: 'blue' },
          ],
        },
      };
    }
    
    // Add analytics properties
    if (config.priorities.includes('analytics')) {
      properties['Duration'] = {
        type: 'number',
        number: {
          format: 'number',
        },
      };
      
      properties['Message Count'] = {
        type: 'number',
        number: {
          format: 'number',
        },
      };
      
      properties['Satisfaction'] = {
        type: 'select',
        select: {
          options: [
            { name: 'Very Satisfied', color: 'green' },
            { name: 'Satisfied', color: 'blue' },
            { name: 'Neutral', color: 'gray' },
            { name: 'Unsatisfied', color: 'orange' },
            { name: 'Very Unsatisfied', color: 'red' },
          ],
        },
      };
      
      properties['Value Rating'] = {
        type: 'select',
        select: {
          options: [
            { name: '5 - Extremely Valuable', color: 'green' },
            { name: '4 - Very Valuable', color: 'blue' },
            { name: '3 - Moderately Valuable', color: 'yellow' },
            { name: '2 - Slightly Valuable', color: 'orange' },
            { name: '1 - Not Valuable', color: 'red' },
          ],
        },
      };
    }
    
    // Add automation features
    if (config.features.includes('reminders')) {
      properties['Reminder Date'] = {
        type: 'date',
        date: {},
      };
      
      properties['Review Status'] = {
        type: 'checkbox',
        checkbox: {},
      };
    }
    
    return properties;
  }
  
  /**
   * Get default database views based on configuration
   */
  private getDefaultViews(config: Config) {
    const views: Array<{ name: string; type: string; filter?: string }> = [
      { name: 'All Sessions', type: 'table' },
      { name: 'Recent', type: 'table', filter: 'last_edited_time' },
      { name: 'Active', type: 'table', filter: 'status' },
    ];
    
    if (config.priorities.includes('organization')) {
      views.push({ name: 'By Topic', type: 'table' });
    }
    
    if (config.features.includes('projects')) {
      views.push({ name: 'By Project', type: 'table' });
    }
    
    if (config.features.includes('dashboard')) {
      views.push({ name: 'Dashboard', type: 'board' });
    }
    
    return views;
  }
  
  /**
   * Format properties for API response
   */
  private formatPropertiesResponse(properties: Record<string, any>): Record<string, string> {
    const formatted: Record<string, string> = {};
    
    for (const [name, config] of Object.entries(properties)) {
      formatted[name] = config.type;
    }
    
    return formatted;
  }
  
  /**
   * Create sample data in the database
   */
  async createSampleData(databaseId: string, config: Config) {
    try {
      const sampleProperties: any = {
        'Title': {
          type: 'title',
          title: [
            {
              type: 'text',
              text: { content: 'Sample Chat Session - Getting Started' },
            },
          ],
        },
        'Platform': {
          type: 'select',
          select: { name: 'ChatGPT' },
        },
        'Status': {
          type: 'select',
          select: { name: 'Completed' },
        },
        'Summary': {
          type: 'rich_text',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Initial setup and configuration discussion for the chat session management system.' },
            },
          ],
        },
        'Key Insights': {
          type: 'rich_text',
          rich_text: [
            {
              type: 'text',
              text: { content: 'Learned about best practices for organizing chat sessions and implementing effective tracking systems.' },
            },
          ],
        },
      };
      
      // Add conditional properties based on config
      if (config.priorities.includes('organization')) {
        sampleProperties['Primary Topic'] = {
          type: 'select',
          select: { name: 'Work' },
        };
        sampleProperties['Category'] = {
          type: 'select',
          select: { name: 'Tutorial/Learning' },
        };
      }
      
      if (config.features.includes('tags')) {
        sampleProperties['Tags'] = {
          type: 'multi_select',
          multi_select: [
            { name: 'Important' },
            { name: 'Learning' },
          ],
        };
        sampleProperties['Priority'] = {
          type: 'select',
          select: { name: 'High' },
        };
      }
      
      if (config.priorities.includes('analytics')) {
        sampleProperties['Duration'] = {
          type: 'number',
          number: 25,
        };
        sampleProperties['Message Count'] = {
          type: 'number',
          number: 12,
        };
        sampleProperties['Satisfaction'] = {
          type: 'select',
          select: { name: 'Very Satisfied' },
        };
      }
      
      const page = await this.client.createPage(databaseId, sampleProperties);
      
      logInfo('Sample data created in Notion database', {
        databaseId,
        pageId: page.id,
      });
      
      return page;
    } catch (error) {
      // Log but don't throw - sample data creation is optional
      logInfo('Failed to create sample data (non-critical)', { databaseId, error });
      return null;
    }
  }
}

export default NotionDatabaseService;