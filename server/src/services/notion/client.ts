import { Client } from '@notionhq/client';
import { config } from '@/utils/config.js';
import { logError, logInfo } from '@/utils/logger.js';
import { createError } from '@/middleware/errorHandler.js';

/**
 * Notion API client wrapper
 */
export class NotionClient {
  private client: Client;
  
  constructor(token?: string) {
    if (!token && !config.notion.token) {
      throw createError.internal(
        'Notion token not configured',
        'NOTION_TOKEN environment variable is required'
      );
    }
    
    this.client = new Client({
      auth: token || config.notion.token,
      notionVersion: '2022-06-28', // Latest stable version
    });
  }
  
  /**
   * Test connection to Notion API
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test the connection by listing users (minimal API call)
      await this.client.users.list({ page_size: 1 });
      logInfo('Notion connection successful');
      return true;
    } catch (error: any) {
      logError(error, { context: 'Notion connection test' });
      return false;
    }
  }
  
  /**
   * Get page information
   */
  async getPage(pageId: string) {
    try {
      const page = await this.client.pages.retrieve({ page_id: pageId });
      return page;
    } catch (error: any) {
      if (error.code === 'object_not_found') {
        throw createError.notFound(
          'Notion page not found',
          'The specified page does not exist or the integration does not have access to it'
        );
      } else if (error.code === 'unauthorized') {
        throw createError.forbidden(
          'Notion integration not authorized',
          'The integration does not have permission to access this page'
        );
      }
      
      logError(error, { context: 'Get Notion page', pageId });
      throw createError.notionError(
        'Failed to retrieve Notion page',
        error.message
      );
    }
  }
  
  /**
   * Create a new database
   */
  async createDatabase(parentPageId: string, title: string, properties: any) {
    try {
      const database = await this.client.databases.create({
        parent: {
          type: 'page_id',
          page_id: parentPageId,
        },
        title: [
          {
            type: 'text',
            text: { content: title },
          },
        ],
        properties,
      });
      
      logInfo('Notion database created successfully', { 
        databaseId: database.id, 
        title,
        parentPageId 
      });
      
      return database;
    } catch (error: any) {
      if (error.code === 'object_not_found') {
        throw createError.notFound(
          'Parent page not found',
          'The specified parent page does not exist or the integration does not have access to it'
        );
      } else if (error.code === 'validation_error') {
        throw createError.badRequest(
          'Invalid database configuration',
          'The database properties or structure is invalid'
        );
      } else if (error.code === 'unauthorized') {
        throw createError.forbidden(
          'Insufficient permissions',
          'The integration needs to be added to the parent page with appropriate permissions'
        );
      }
      
      logError(error, { 
        context: 'Create Notion database', 
        parentPageId, 
        title, 
        properties 
      });
      
      throw createError.notionError(
        'Failed to create Notion database',
        error.message
      );
    }
  }
  
  /**
   * Update database properties
   */
  async updateDatabase(databaseId: string, updates: any) {
    try {
      const database = await this.client.databases.update({
        database_id: databaseId,
        ...updates,
      });
      
      logInfo('Notion database updated successfully', { databaseId });
      return database;
    } catch (error: any) {
      logError(error, { context: 'Update Notion database', databaseId, updates });
      throw createError.notionError(
        'Failed to update Notion database',
        error.message
      );
    }
  }
  
  /**
   * Get database information
   */
  async getDatabase(databaseId: string) {
    try {
      const database = await this.client.databases.retrieve({
        database_id: databaseId,
      });
      return database;
    } catch (error: any) {
      if (error.code === 'object_not_found') {
        throw createError.notFound(
          'Database not found',
          'The specified database does not exist or the integration does not have access to it'
        );
      }
      
      logError(error, { context: 'Get Notion database', databaseId });
      throw createError.notionError(
        'Failed to retrieve Notion database',
        error.message
      );
    }
  }
  
  /**
   * Create a new page in database
   */
  async createPage(databaseId: string, properties: any) {
    try {
      const page = await this.client.pages.create({
        parent: {
          type: 'database_id',
          database_id: databaseId,
        },
        properties,
      });
      
      logInfo('Notion page created successfully', { pageId: page.id, databaseId });
      return page;
    } catch (error: any) {
      logError(error, { context: 'Create Notion page', databaseId, properties });
      throw createError.notionError(
        'Failed to create Notion page',
        error.message
      );
    }
  }
  
  /**
   * Query database
   */
  async queryDatabase(databaseId: string, query: any = {}) {
    try {
      const response = await this.client.databases.query({
        database_id: databaseId,
        ...query,
      });
      return response;
    } catch (error: any) {
      logError(error, { context: 'Query Notion database', databaseId, query });
      throw createError.notionError(
        'Failed to query Notion database',
        error.message
      );
    }
  }
  
  /**
   * Get raw Notion client for advanced operations
   */
  getClient(): Client {
    return this.client;
  }
}

// Create singleton instance
export const notionClient = new NotionClient();
export default NotionClient;