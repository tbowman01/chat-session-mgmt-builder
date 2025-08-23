import { NotionClient } from './client.js';
import { logInfo, logDebug } from '../../utils/logger.js';
export class NotionDatabaseService {
    client;
    constructor(client) {
        this.client = client || new NotionClient();
    }
    async createChatSessionDatabase(parentPageId, config) {
        try {
            await this.client.getPage(parentPageId);
            const databaseTitle = 'Chat Session Management';
            const properties = this.generateDatabaseProperties(config);
            logDebug('Creating Notion database', {
                parentPageId,
                title: databaseTitle,
                config
            });
            const database = await this.client.createDatabase(parentPageId, databaseTitle, properties);
            const views = this.getDefaultViews(config);
            const databaseUrl = database.url || `https://www.notion.so/${database.id.replace(/-/g, '')}`;
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
        }
        catch (error) {
            throw error;
        }
    }
    generateDatabaseProperties(config) {
        const properties = {
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
        if (config.features.includes('projects')) {
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
    getDefaultViews(config) {
        const views = [
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
    formatPropertiesResponse(properties) {
        const formatted = {};
        for (const [name, config] of Object.entries(properties)) {
            formatted[name] = config.type;
        }
        return formatted;
    }
    async createSampleData(databaseId, config) {
        try {
            const sampleProperties = {
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
        }
        catch (error) {
            logInfo('Failed to create sample data (non-critical)', { databaseId, error });
            return null;
        }
    }
}
export default NotionDatabaseService;
//# sourceMappingURL=database.js.map