import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class UpdateMailboxesTool extends BaseTool {
    name = 'update-mailboxes';
    description = 'Update the mailboxes';

    schema = z.object({
        mailboxes: z.array(z.string()).describe('The mailboxes to update'),
        firstName: z.string().describe('The first name of the mailbox'),
        lastName: z.string().describe('The last name of the mailbox'),
        signature: z
            .string()
            .optional()
            .describe('The signature of the mailbox'),
        forwardTo: z
            .string()
            .optional()
            .describe('The forward to of the mailbox'),
        workspaceId: z.number().optional().describe('The workspace id'),
    });

    async execute({
        mailboxes,
        firstName,
        lastName,
        signature,
        forwardTo,
        workspaceId,
    }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post('/update_mailboxes', {
                body: {
                    mailboxes,
                    firstName,
                    lastName,
                    signature,
                    forwardTo,
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
