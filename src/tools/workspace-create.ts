import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class WorkspaceCreateTool extends BaseTool {
    name = 'workspace-create';
    description = 'Create a workspace';

    schema = z.object({
        project_name: z.string().describe('The name of the workspace'),
        description: z
            .string()
            .optional()
            .describe('The description of the workspace'),
    });

    async execute({ project_name, description }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post('/workspace/create', {
                body: {
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
