import { NotionClient } from './client.js';
import { Config } from '../../types/index.js';
export declare class NotionDatabaseService {
    private client;
    constructor(client?: NotionClient);
    createChatSessionDatabase(parentPageId: string, config: Config): Promise<{
        id: string;
        url: any;
        properties: Record<string, string>;
        views: string[];
    }>;
    private generateDatabaseProperties;
    private getDefaultViews;
    private formatPropertiesResponse;
    createSampleData(databaseId: string, config: Config): Promise<import("@notionhq/client/build/src/api-endpoints.js").PartialPageObjectResponse | null>;
}
export default NotionDatabaseService;
//# sourceMappingURL=database.d.ts.map