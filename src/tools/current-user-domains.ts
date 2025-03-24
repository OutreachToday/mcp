import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class CurrentUserDomainsTool extends BaseTool {
    name = 'current-user-domains';
    description = 'Get the domains for the current user';

    schema = z.object({
        workspaceId: z.string().describe('The ID of the workspace'),
    });

    async execute({ workspaceId }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.get('/current_user_domains', {
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
