import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class ChangeDomainsRedirectsTool extends BaseTool {
    name = 'change-domains-redirects';
    description = 'Change the redirects for a domain';

    schema = z.object({
        domains: z
            .array(z.string())
            .describe('The domains to change redirects for'),
        redirectDomain: z
            .string()
            .describe('The domain to redirect to'),
        workspaceId: z.string().describe('The ID of the workspace'),
    });

    async execute({
        domains,
        redirectDomain,
        workspaceId,
    }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post(
                '/domains_redirects',
                {
                    body: {
                        domains,
                        redirectDomain,
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
