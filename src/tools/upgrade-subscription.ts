import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class UpgradeSubscriptionTool extends BaseTool {
    name = 'upgrade-subscription';
    description = 'Upgrade the subscription';

    schema = z.object({
        newMaxMailboxes: z.number().describe('The new max mailboxes'),
        workspaceId: z.number().describe('The ID of the workspace'),
    });

    async execute({
        newMaxMailboxes,
        workspaceId,
    }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post(
                '/upgrade_subscription',
                {
                    body: {
                        new_max_mailboxes: newMaxMailboxes,
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
