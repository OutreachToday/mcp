import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class WorkspacePaymentMethodTool extends BaseTool {
    name = 'workspace-payment-method';
    description = 'Get the payment method for the workspace';

    schema = z.object({
        workspaceId: z.string().describe('The ID of the workspace'),
    });

    async execute({ workspaceId }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post(
                '/workspace/payment_method',
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
