import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class ApiKeysTool extends BaseTool {
    name = 'api-keys';
    description = 'Get the API keys for the current user';

    schema = z.object({});

    async execute() {
        try {
            const { data } = await outreachClient.get('/api-keys');

            return {
                content: [
                    {
                        type: 'text' as const,
                        text: JSON.stringify(data),
                    },
                ],
            };
        } catch (error) {
            console.error('Error executing tool', error);
            throw error;
        }
    }
}
