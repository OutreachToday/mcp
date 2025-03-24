import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class WorkspaceSubscriptionStatusTool extends BaseTool {
    name = 'workspace-subscription-status';
    description = 'Get the subscription status for the workspace';

    schema = z.object({
        workspaceId: z.string().describe('The ID of the workspace'),
    });

    async execute({ workspaceId }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post(
                '/workspace/subscription_status',
                {
                    body: {
                        workspace_id: workspaceId,
                    },
                }
            );

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
