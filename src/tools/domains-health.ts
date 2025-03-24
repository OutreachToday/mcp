import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class DomainsHealthTool extends BaseTool {
    name = 'domains-health';
    description = 'Get the health of the domains';

    schema = z.object({
        workspaceId: z.string().describe('The ID of the workspace'),
    });

    async execute({ workspaceId }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.get(
                '/domains/health',
                {
                    params: {
                        workspaceId,
                    },
            });

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