import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class WorkspaceUpdateTool extends BaseTool {
    name = 'workspace-update';
    description = 'Update a workspace';

    schema = z.object({
        workspaceId: z.number().describe('The ID of the workspace to update'),
        project_name: z.string().describe('The name of the workspace'),
        description: z
            .string()
            .optional()
            .describe('The description of the workspace'),
    });

    async execute({
        workspaceId,
        project_name,
        description,
    }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post('/workspace/update', {
                body: {
                    workspace_id: workspaceId,
                    project_name,
                    description,
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
