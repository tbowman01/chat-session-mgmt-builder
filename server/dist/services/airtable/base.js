import { AirtableClient } from './client.js';
import { logInfo, logDebug, logWarning } from '../../utils/logger.js';
import { createError } from '../../middleware/errorHandler.js';
export class AirtableBaseService {
    client;
    REQUIRED_TABLE_NAME = 'Chat Sessions';
    constructor(client) {
        this.client = client || new AirtableClient();
    }
    async validateBase(baseId, config) {
        try {
            logDebug('Validating Airtable base', { baseId });
            const isConnected = await this.client.testConnection(baseId);
            if (!isConnected) {
                throw createError.forbidden('Unable to connect to Airtable base', 'Check that the base ID is correct and the integration has access');
            }
            const tableExists = await this.client.tableExists(baseId, this.REQUIRED_TABLE_NAME);
            if (!tableExists) {
                throw createError.badRequest(`Table '${this.REQUIRED_TABLE_NAME}' not found in base`, `Please create a table named '${this.REQUIRED_TABLE_NAME}' in your Airtable base`);
            }
            const fields = await this.client.getTableFields(baseId, this.REQUIRED_TABLE_NAME);
            const requiredFields = this.getRequiredFields();
            const missingFields = this.validateTableStructure(fields, requiredFields);
            if (missingFields.length > 0) {
                logWarning('Missing required fields in Airtable table', {
                    baseId,
                    missingFields,
                });
            }
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
        }
        catch (error) {
            throw error;
        }
    }
    async createSampleData(baseId, config) {
        try {
            logDebug('Creating sample data in Airtable base', { baseId });
            const validation = await this.validateBase(baseId, config);
            if (!validation.valid) {
                throw createError.badRequest('Base validation failed', 'Cannot create sample data in invalid base');
            }
            const sampleData = this.generateSampleRecord(config);
            const record = await this.client.createRecord(baseId, this.REQUIRED_TABLE_NAME, sampleData);
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
        }
        catch (error) {
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
    async getBaseInfo(baseId) {
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
        }
        catch (error) {
            throw error;
        }
    }
    getRequiredFields() {
        return [
            'Title',
            'Date',
            'Platform',
            'Status',
            'Summary',
            'Rating',
        ];
    }
    getOptionalFields(config) {
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
    validateTableStructure(actualFields, requiredFields) {
        const fieldsList = Array.isArray(actualFields) ? actualFields : Object.keys(actualFields);
        const missingFields = [];
        for (const requiredField of requiredFields) {
            const fieldExists = fieldsList.some(field => field.toLowerCase() === requiredField.toLowerCase());
            if (!fieldExists) {
                missingFields.push(requiredField);
            }
        }
        return missingFields;
    }
    generateSampleRecord(config) {
        const baseData = {
            'Title': 'Sample Chat Session - Welcome to Your Chat Manager',
            'Date': new Date().toISOString().split('T')[0],
            'Platform': 'ChatGPT',
            'Status': 'Completed',
            'Summary': 'This is a sample chat session to demonstrate your new chat management system. You can edit or delete this record and start adding your own chat sessions.',
            'Rating': 5,
        };
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
    async updateBaseStructure(baseId, config) {
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
//# sourceMappingURL=base.js.map