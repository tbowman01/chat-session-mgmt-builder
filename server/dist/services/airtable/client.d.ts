import Airtable from 'airtable';
export declare class AirtableClient {
    private client;
    constructor(token?: string);
    testConnection(baseId: string): Promise<boolean>;
    getBase(baseId: string): Promise<{
        id: string;
        tables: string[];
    }>;
    listTables(baseId: string): Promise<string[]>;
    tableExists(baseId: string, tableName: string): Promise<boolean>;
    getTableFields(baseId: string, tableName: string): Promise<{}>;
    createRecord(baseId: string, tableName: string, fields: Record<string, any>): Promise<import("airtable/lib/record")<import("airtable/lib/field_set").FieldSet>>;
    getRecords(baseId: string, tableName: string, options?: any): Promise<import("airtable/lib/records").Records<import("airtable/lib/field_set").FieldSet>>;
    updateRecord(baseId: string, tableName: string, recordId: string, fields: Record<string, any>): Promise<import("airtable/lib/record")<import("airtable/lib/field_set").FieldSet>>;
    deleteRecord(baseId: string, tableName: string, recordId: string): Promise<import("airtable/lib/record")<import("airtable/lib/field_set").FieldSet>>;
    getClient(): Airtable;
    private handleAirtableError;
}
export declare const airtableClient: AirtableClient;
export default AirtableClient;
//# sourceMappingURL=client.d.ts.map