import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class WorkspaceInvoicesTool extends BaseTool {
    name = 'workspace-invoices';
    description = 'Get the invoices for the workspace';

    schema = z.object({
        workspaceId: z.number().describe('The ID of the workspace'),
        limit: z.number().describe('The limit of invoices to return'),
    });

    async execute({ workspaceId, limit = 100 }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post('/workspace/invoices', {
                body: {
                    workspace_id: workspaceId,
                    limit,
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
