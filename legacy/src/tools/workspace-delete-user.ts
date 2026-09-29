import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class WorkspaceDeleteUserTool extends BaseTool {
    name = 'workspace-delete-user';
    description = 'Delete a user from the workspace';

    schema = z.object({
        workspaceId: z.number().describe('The ID of the workspace'),
        userId: z.number().describe('The ID of the user to delete'),
    });

    async execute({ workspaceId, userId }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post(
                '/workspace/delete_user',
                {
                    body: {
                        workspace_id: workspaceId,
                        user_id: userId,
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
