import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class WorkspaceUsersTool extends BaseTool {
    name = 'workspace-users';
    description = 'Get the users for a workspace';

    schema = z.object({
        workspaceId: z
            .number()
            .describe('The ID of the workspace to get users for'),
    });

    async execute({ workspaceId }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post('/workspace/get_users', {
                body: {
                    workspace_id: workspaceId,
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
