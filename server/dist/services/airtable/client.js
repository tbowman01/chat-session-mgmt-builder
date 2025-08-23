import Airtable from 'airtable';
import { config } from '../../utils/config.js';
import { logError, logInfo, logDebug } from '../../utils/logger.js';
import { createError } from '../../middleware/errorHandler.js';
export class AirtableClient {
    client;
    constructor(token) {
        if (!token && !config.airtable.token) {
            throw createError.internal('Airtable token not configured', 'AIRTABLE_TOKEN environment variable is required');
        }
        Airtable.configure({
            apiKey: token || config.airtable.token,
        });
        this.client = new Airtable();
    }
    async testConnection(baseId) {
        try {
            const base = this.client.base(baseId);
            await base('Chat Sessions').select({
                maxRecords: 1,
            }).firstPage();
            logInfo('Airtable connection successful', { baseId });
            return true;
        }
        catch (error) {
            logError(error, { context: 'Airtable connection test', baseId });
            return false;
        }
    }
    async getBase(baseId) {
        try {
            const base = this.client.base(baseId);
            const tables = await this.listTables(baseId);
            return {
                id: baseId,
                tables,
            };
        }
        catch (error) {
            logError(error, { context: 'Get Airtable base', baseId });
            throw this.handleAirtableError(error, 'Failed to access Airtable base');
        }
    }
    async listTables(baseId) {
        try {
            const base = this.client.base(baseId);
            const commonTableNames = ['Chat Sessions', 'Sessions', 'Chats', 'Table 1'];
            const existingTables = [];
            for (const tableName of commonTableNames) {
                try {
                    await base(tableName).select({
                        maxRecords: 1,
                    }).firstPage();
                    existingTables.push(tableName);
                }
                catch (error) {
                }
            }
            return existingTables;
        }
        catch (error) {
            logError(error, { context: 'List Airtable tables', baseId });
            throw this.handleAirtableError(error, 'Failed to list tables');
        }
    }
    async tableExists(baseId, tableName) {
        try {
            const base = this.client.base(baseId);
            await base(tableName).select({
                maxRecords: 1,
            }).firstPage();
            return true;
        }
        catch (error) {
            if (error.statusCode === 404 || error.message.includes('NOT_FOUND')) {
                return false;
            }
            throw this.handleAirtableError(error, 'Failed to check table existence');
        }
    }
    async getTableFields(baseId, tableName) {
        try {
            const base = this.client.base(baseId);
            const records = await base(tableName).select({
                maxRecords: 1,
            }).firstPage();
            if (records.length === 0) {
                return {};
            }
            const sampleRecord = records[0];
            const fields = Object.keys(sampleRecord.fields);
            logDebug('Retrieved table fields', { baseId, tableName, fields });
            return fields;
        }
        catch (error) {
            logError(error, { context: 'Get Airtable table fields', baseId, tableName });
            throw this.handleAirtableError(error, 'Failed to get table fields');
        }
    }
    async createRecord(baseId, tableName, fields) {
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
        }
        catch (error) {
            logError(error, { context: 'Create Airtable record', baseId, tableName, fields });
            throw this.handleAirtableError(error, 'Failed to create record');
        }
    }
    async getRecords(baseId, tableName, options = {}) {
        try {
            const base = this.client.base(baseId);
            const records = await base(tableName).select({
                maxRecords: options.maxRecords || 100,
                ...options,
            }).firstPage();
            return records;
        }
        catch (error) {
            logError(error, { context: 'Get Airtable records', baseId, tableName, options });
            throw this.handleAirtableError(error, 'Failed to retrieve records');
        }
    }
    async updateRecord(baseId, tableName, recordId, fields) {
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
        }
        catch (error) {
            logError(error, { context: 'Update Airtable record', baseId, tableName, recordId, fields });
            throw this.handleAirtableError(error, 'Failed to update record');
        }
    }
    async deleteRecord(baseId, tableName, recordId) {
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
        }
        catch (error) {
            logError(error, { context: 'Delete Airtable record', baseId, tableName, recordId });
            throw this.handleAirtableError(error, 'Failed to delete record');
        }
    }
    getClient() {
        return this.client;
    }
    handleAirtableError(error, defaultMessage) {
        if (error.statusCode === 401) {
            return createError.unauthorized('Invalid Airtable token', 'The provided Airtable token is invalid or expired');
        }
        else if (error.statusCode === 403) {
            return createError.forbidden('Insufficient Airtable permissions', 'The token does not have permission to access this resource');
        }
        else if (error.statusCode === 404) {
            return createError.notFound('Airtable resource not found', 'The requested base, table, or record was not found');
        }
        else if (error.statusCode === 422) {
            return createError.unprocessableEntity('Invalid Airtable data', 'The provided data is invalid or does not match the table schema');
        }
        else if (error.statusCode === 429) {
            return createError.tooManyRequests('Airtable rate limit exceeded', 'Too many requests to Airtable API. Please retry later');
        }
        else if (error.message && error.message.includes('NOT_FOUND')) {
            return createError.notFound('Table not found', 'The specified table does not exist in this base');
        }
        return createError.airtableError(defaultMessage, error.message);
    }
}
export const airtableClient = new AirtableClient();
export default AirtableClient;
//# sourceMappingURL=client.js.map