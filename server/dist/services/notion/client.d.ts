import { Client } from '@notionhq/client';
export declare class NotionClient {
    private client;
    constructor(token?: string);
    testConnection(): Promise<boolean>;
    getPage(pageId: string): Promise<import("@notionhq/client/build/src/api-endpoints").GetPageResponse>;
    createDatabase(parentPageId: string, title: string, properties: any): Promise<import("@notionhq/client/build/src/api-endpoints").CreateDatabaseResponse>;
    updateDatabase(databaseId: string, updates: any): Promise<import("@notionhq/client/build/src/api-endpoints").UpdateDatabaseResponse>;
    getDatabase(databaseId: string): Promise<import("@notionhq/client/build/src/api-endpoints").GetDatabaseResponse>;
    createPage(databaseId: string, properties: any): Promise<import("@notionhq/client/build/src/api-endpoints").CreatePageResponse>;
    queryDatabase(databaseId: string, query?: any): Promise<import("@notionhq/client/build/src/api-endpoints").QueryDatabaseResponse>;
    getClient(): Client;
}
export declare const notionClient: NotionClient;
export default NotionClient;
//# sourceMappingURL=client.d.ts.map