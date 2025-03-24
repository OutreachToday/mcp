import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class SaveMailboxChoiceTool extends BaseTool {
    name = 'save-mailbox-choice';
    description = 'Save the mailbox choice';

    schema = z.object({
        mailboxes: z
            .array(
                z.object({
                    address: z.string().email(),
                    firstName: z.string(),
                    lastName: z.string(),
                })
            )
            .describe('The mailboxes to save'),
        workspaceId: z.string().describe('The ID of the workspace'),
    });

    async execute({ mailboxes, workspaceId }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post('/save_mailbox_choice', {
                body: {
                    mailboxes,
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
