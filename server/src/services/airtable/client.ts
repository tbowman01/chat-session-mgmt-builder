import Airtable from 'airtable';
import { config } from '@/utils/config.js';
import { logError, logInfo, logDebug } from '@/utils/logger.js';
import { createError } from '@/middleware/errorHandler.js';

/**
 * Airtable API client wrapper
 */
export class AirtableClient {
  private client: Airtable;
  
  constructor(token?: string) {
    if (!token && !config.airtable.token) {
      throw createError.internal(
        'Airtable token not configured',
        'AIRTABLE_TOKEN environment variable is required'
      );
    }
    
    Airtable.configure({
      apiKey: token || config.airtable.token,
    });
    
    this.client = new Airtable();
  }
  
  /**
   * Test connection to Airtable API
   */
  async testConnection(baseId: string): Promise<boolean> {
    try {
      const base = this.client.base(baseId);
      
      // Try to list tables with minimal query
      await base('Chat Sessions').select({
        maxRecords: 1,
      }).firstPage();
      
      logInfo('Airtable connection successful', { baseId });
      return true;
    } catch (error: any) {
      logError(error, { context: 'Airtable connection test', baseId });
      return false;
    }
  }
  
  /**
   * Get base information
   */
  async getBase(baseId: string) {
    try {
      const base = this.client.base(baseId);
      
      // Airtable doesn't have a direct base info API, so we'll try to access a table
      // to validate the base exists and we have access
      const tables = await this.listTables(baseId);
      
      return {
        id: baseId,
        tables,
      };
    } catch (error: any) {
      logError(error, { context: 'Get Airtable base', baseId });
      throw this.handleAirtableError(error, 'Failed to access Airtable base');
    }
  }
  
  /**
   * List tables in a base (simplified approach)
   */
  async listTables(baseId: string): Promise<string[]> {
    try {
      const base = this.client.base(baseId);
      
      // Common table names to check for
      const commonTableNames = ['Chat Sessions', 'Sessions', 'Chats', 'Table 1'];
      const existingTables: string[] = [];
      
      for (const tableName of commonTableNames) {
        try {
          await base(tableName).select({
            maxRecords: 1,
          }).firstPage();
          existingTables.push(tableName);
        } catch (error) {
          // Table doesn't exist or no access, continue
        }
      }
      
      return existingTables;
    } catch (error: any) {
      logError(error, { context: 'List Airtable tables', baseId });
      throw this.handleAirtableError(error, 'Failed to list tables');
    }
  }
  
  /**
   * Check if a specific table exists
   */
  async tableExists(baseId: string, tableName: string): Promise<boolean> {
    try {
      const base = this.client.base(baseId);
      
      await base(tableName).select({
        maxRecords: 1,
      }).firstPage();
      
      return true;
    } catch (error: any) {
      if (error.statusCode === 404 || error.message.includes('NOT_FOUND')) {
        return false;
      }
      throw this.handleAirtableError(error, 'Failed to check table existence');
    }
  }
  
  /**
   * Get table fields/schema
   */
  async getTableFields(baseId: string, tableName: string) {
    try {
      const base = this.client.base(baseId);
      
      // Get a sample record to understand the field structure
      const records = await base(tableName).select({
        maxRecords: 1,
      }).firstPage();
      
      if (records.length === 0) {
        // If no records, we can't determine fields, return empty
        return {};
      }
      
      const sampleRecord = records[0];
      const fields = Object.keys(sampleRecord.fields);
      
      logDebug('Retrieved table fields', { baseId, tableName, fields });
      return fields;
    } catch (error: any) {
      logError(error, { context: 'Get Airtable table fields', baseId, tableName });
      throw this.handleAirtableError(error, 'Failed to get table fields');
    }
  }
  
  /**
   * Create a new record
   */
  async createRecord(baseId: string, tableName: string, fields: Record<string, any>) {
    try {
      const base = this.client.base(baseId);
      
      const records = await base(tableName).create([
        {
          fields,
        },
      ]);
      
      const record = records[0];
      logInfo('Airtable record created successfully', {
        baseId,
        tableName,
        recordId: record.id,
      });
      
      return record;
    } catch (error: any) {
      logError(error, { context: 'Create Airtable record', baseId, tableName, fields });
      throw this.handleAirtableError(error, 'Failed to create record');
    }
  }
  
  /**
   * Get records from table
   */
  async getRecords(baseId: string, tableName: string, options: any = {}) {
    try {
      const base = this.client.base(baseId);
      
      const records = await base(tableName).select({
        maxRecords: options.maxRecords || 100,
        ...options,
      }).firstPage();
      
      return records;
    } catch (error: any) {
      logError(error, { context: 'Get Airtable records', baseId, tableName, options });
      throw this.handleAirtableError(error, 'Failed to retrieve records');
    }
  }
  
  /**
   * Update a record
   */
  async updateRecord(baseId: string, tableName: string, recordId: string, fields: Record<string, any>) {
    try {
      const base = this.client.base(baseId);
      
      const records = await base(tableName).update([
        {
          id: recordId,
          fields,
        },
      ]);
      
      const record = records[0];
      logInfo('Airtable record updated successfully', {
        baseId,
        tableName,
        recordId,
      });
      
      return record;
    } catch (error: any) {
      logError(error, { context: 'Update Airtable record', baseId, tableName, recordId, fields });
      throw this.handleAirtableError(error, 'Failed to update record');
    }
  }
  
  /**
   * Delete a record
   */
  async deleteRecord(baseId: string, tableName: string, recordId: string) {
    try {
      const base = this.client.base(baseId);
      
      const deletedRecords = await base(tableName).destroy([recordId]);
      const deletedRecord = deletedRecords[0];
      
      logInfo('Airtable record deleted successfully', {
        baseId,
        tableName,
        recordId,
      });
      
      return deletedRecord;
    } catch (error: any) {
      logError(error, { context: 'Delete Airtable record', baseId, tableName, recordId });
      throw this.handleAirtableError(error, 'Failed to delete record');
    }
  }
  
  /**
   * Get raw Airtable client for advanced operations
   */
  getClient(): Airtable {
    return this.client;
  }
  
  /**
   * Handle Airtable-specific errors and convert to API errors
   */
  private handleAirtableError(error: any, defaultMessage: string) {
    if (error.statusCode === 401) {
      return createError.unauthorized(
        'Invalid Airtable token',
        'The provided Airtable token is invalid or expired'
      );
    } else if (error.statusCode === 403) {
      return createError.forbidden(
        'Insufficient Airtable permissions',
        'The token does not have permission to access this resource'
      );
    } else if (error.statusCode === 404) {
      return createError.notFound(
        'Airtable resource not found',
        'The requested base, table, or record was not found'
      );
    } else if (error.statusCode === 422) {
      return createError.unprocessableEntity(
        'Invalid Airtable data',
        'The provided data is invalid or does not match the table schema'
      );
    } else if (error.statusCode === 429) {
      return createError.tooManyRequests(
        'Airtable rate limit exceeded',
        'Too many requests to Airtable API. Please retry later'
      );
    } else if (error.message && error.message.includes('NOT_FOUND')) {
      return createError.notFound(
        'Table not found',
        'The specified table does not exist in this base'
      );
    }
    
    return createError.airtableError(defaultMessage, error.message);
  }
}

// Create singleton instance
export const airtableClient = new AirtableClient();
export default AirtableClient;