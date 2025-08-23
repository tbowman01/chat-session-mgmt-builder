import { AirtableClient } from './client.js';
import { Config } from '@/types/index.js';
import { logInfo, logDebug, logWarning } from '@/utils/logger.js';
import { createError } from '@/middleware/errorHandler.js';

/**
 * Airtable base validation and management service
 */
export class AirtableBaseService {
  private client: AirtableClient;
  private readonly REQUIRED_TABLE_NAME = 'Chat Sessions';
  
  constructor(client?: AirtableClient) {
    this.client = client || new AirtableClient();
  }
  
  /**
   * Validate Airtable base and check required table structure
   */
  async validateBase(baseId: string, config?: Config) {
    try {
      logDebug('Validating Airtable base', { baseId });
      
      // First, test connection to the base
      const isConnected = await this.client.testConnection(baseId);
      if (!isConnected) {
        throw createError.forbidden(
          'Unable to connect to Airtable base',
          'Check that the base ID is correct and the integration has access'
        );
      }
      
      // Check if required table exists
      const tableExists = await this.client.tableExists(baseId, this.REQUIRED_TABLE_NAME);
      if (!tableExists) {
        throw createError.badRequest(
          `Table '${this.REQUIRED_TABLE_NAME}' not found in base`,
          `Please create a table named '${this.REQUIRED_TABLE_NAME}' in your Airtable base`
        );
      }
      
      // Get table fields to validate structure
      const fields = await this.client.getTableFields(baseId, this.REQUIRED_TABLE_NAME);
      const requiredFields = this.getRequiredFields();
      const missingFields = this.validateTableStructure(fields, requiredFields);
      
      if (missingFields.length > 0) {
        logWarning('Missing required fields in Airtable table', {
          baseId,
          missingFields,
        });
      }
      
      // Get existing records count
      const records = await this.client.getRecords(baseId, this.REQUIRED_TABLE_NAME, {
        maxRecords: 100,
      });
      
      logInfo('Airtable base validation successful', {
        baseId,
        tableExists: true,
        recordCount: records.length,
        missingFields: missingFields.length,
      });
      
      return {
        valid: true,
        table: this.REQUIRED_TABLE_NAME,
        fields: Array.isArray(fields) ? fields : Object.keys(fields),
        recordCount: records.length,
        missingFields,
        warnings: missingFields.length > 0 ? [
          `Missing recommended fields: ${missingFields.join(', ')}`
        ] : [],
      };
    } catch (error) {
      throw error; // Re-throw to be handled by error middleware
    }
  }
  
  /**
   * Create sample data in the Airtable base
   */
  async createSampleData(baseId: string, config?: Config) {
    try {
      logDebug('Creating sample data in Airtable base', { baseId });
      
      // Validate base first
      const validation = await this.validateBase(baseId, config);
      if (!validation.valid) {
        throw createError.badRequest('Base validation failed', 'Cannot create sample data in invalid base');
      }
      
      // Prepare sample record data
      const sampleData = this.generateSampleRecord(config);
      
      // Create the sample record
      const record = await this.client.createRecord(
        baseId,
        this.REQUIRED_TABLE_NAME,
        sampleData
      );
      
      logInfo('Sample data created in Airtable base', {
        baseId,
        recordId: record.id,
        table: this.REQUIRED_TABLE_NAME,
      });
      
      return {
        recordId: record.id,
        table: this.REQUIRED_TABLE_NAME,
        data: sampleData,
      };
    } catch (error) {
      // If sample data creation fails, log but don't throw a critical error
      if (error instanceof Error && !error.message.includes('validation failed')) {
        logWarning('Failed to create sample data (non-critical)', {
          baseId,
          error: error.message,
        });
        return null;
      }
      throw error;
    }
  }
  
  /**
   * Get information about the Airtable base
   */
  async getBaseInfo(baseId: string) {
    try {
      const base = await this.client.getBase(baseId);
      const validation = await this.validateBase(baseId);
      
      return {
        id: baseId,
        url: `https://airtable.com/${baseId}`,
        tables: base.tables,
        chatSessionsTable: {
          exists: validation.valid,
          fields: validation.fields,
          recordCount: validation.recordCount,
        },
      };
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get required fields for the Chat Sessions table
   */
  private getRequiredFields(): string[] {
    return [
      'Title',
      'Date',
      'Platform',
      'Status',
      'Summary',
      'Rating',
    ];
  }
  
  /**
   * Get optional fields that enhance functionality
   */
  private getOptionalFields(config?: Config): string[] {
    const fields = [
      'Duration',
      'Message Count',
      'Primary Topic',
      'Tags',
      'Priority',
      'Key Insights',
      'Action Items',
      'Follow-up Date',
      'Notes',
    ];
    
    if (config?.features.includes('projects')) {
      fields.push('Project', 'Project Phase');
    }
    
    if (config?.priorities.includes('collaboration')) {
      fields.push('Participants', 'Shared With');
    }
    
    return fields;
  }
  
  /**
   * Validate table structure and return missing required fields
   */
  private validateTableStructure(actualFields: string[] | Record<string, any>, requiredFields: string[]): string[] {
    const fieldsList = Array.isArray(actualFields) ? actualFields : Object.keys(actualFields);
    const missingFields: string[] = [];
    
    for (const requiredField of requiredFields) {
      const fieldExists = fieldsList.some(field => 
        field.toLowerCase() === requiredField.toLowerCase()
      );
      
      if (!fieldExists) {
        missingFields.push(requiredField);
      }
    }
    
    return missingFields;
  }
  
  /**
   * Generate sample record data
   */
  private generateSampleRecord(config?: Config): Record<string, any> {
    const baseData: Record<string, any> = {
      'Title': 'Sample Chat Session - Welcome to Your Chat Manager',
      'Date': new Date().toISOString().split('T')[0],
      'Platform': 'ChatGPT',
      'Status': 'Completed',
      'Summary': 'This is a sample chat session to demonstrate your new chat management system. You can edit or delete this record and start adding your own chat sessions.',
      'Rating': 5,
    };
    
    // Add optional fields based on configuration
    if (config?.priorities.includes('analytics')) {
      baseData['Duration'] = 15;
      baseData['Message Count'] = 8;
    }
    
    if (config?.priorities.includes('organization')) {
      baseData['Primary Topic'] = 'Work';
      baseData['Tags'] = 'Setup, Learning';
    }
    
    if (config?.features.includes('projects')) {
      baseData['Project'] = 'Personal Organization';
    }
    
    return baseData;
  }
  
  /**
   * Update base structure with recommended fields
   */
  async updateBaseStructure(baseId: string, config: Config) {
    // Note: Airtable API doesn't support adding fields programmatically
    // This method would provide instructions for manual setup
    
    const optionalFields = this.getOptionalFields(config);
    const recommendations = [
      'Consider adding these optional fields to enhance your Chat Sessions table:',
      ...optionalFields.map(field => `  • ${field}`),
      '',
      'These fields will help you better organize and analyze your chat sessions.',
    ];
    
    logInfo('Base structure recommendations generated', {
      baseId,
      optionalFieldsCount: optionalFields.length,
    });
    
    return {
      recommendations,
      optionalFields,
    };
  }
}

export default AirtableBaseService;