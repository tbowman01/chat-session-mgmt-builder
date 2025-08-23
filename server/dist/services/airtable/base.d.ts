import { AirtableClient } from './client.js';
import { Config } from '../../types/index.js';
export declare class AirtableBaseService {
    private client;
    private readonly REQUIRED_TABLE_NAME;
    constructor(client?: AirtableClient);
    validateBase(baseId: string, config?: Config): Promise<{
        valid: boolean;
        table: string;
        fields: any[];
        recordCount: number;
        missingFields: string[];
        warnings: string[];
    }>;
    createSampleData(baseId: string, config?: Config): Promise<{
        recordId: string;
        table: string;
        data: Record<string, any>;
    } | null>;
    getBaseInfo(baseId: string): Promise<{
        id: string;
        url: string;
        tables: string[];
        chatSessionsTable: {
            exists: boolean;
            fields: any[];
            recordCount: number;
        };
    }>;
    private getRequiredFields;
    private getOptionalFields;
    private validateTableStructure;
    private generateSampleRecord;
    updateBaseStructure(baseId: string, config: Config): Promise<{
        recommendations: string[];
        optionalFields: string[];
    }>;
}
export default AirtableBaseService;
//# sourceMappingURL=base.d.ts.map