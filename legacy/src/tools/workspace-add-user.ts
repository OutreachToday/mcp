import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class WorkspaceAddUserTool extends BaseTool {
    name = 'workspace-add-user';
    description = 'Add a user to the workspace';

    schema = z.object({
        workspaceId: z.number().describe('The ID of the workspace'),
        email: z.string().email().describe('The email of the user to add'),
        role: z.string().describe('The role of the user'),
    });

    async execute({ workspaceId, email, role }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post('/workspace/add_user', {
                body: {
                    workspace_id: workspaceId,
                    email,
                    role,
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
