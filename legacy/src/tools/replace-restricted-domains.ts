import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class ReplaceRestrictedDomainsTool extends BaseTool {
    name = 'replace-restricted-domains';
    description = 'Replace the restricted domains with the new domains';

    schema = z.object({
        domains: z
            .array(
                z.object({
                    old_domain: z.string(),
                    new_domain: z.string(),
                })
            )
            .describe('The domains to replace'),

        workspaceId: z.number().describe('The ID of the workspace'),
    });

    async execute({ domains, workspaceId }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post(
                '/replace_restricted_domains',
                {
                    body: {
                        domains,
                        workspaceId,
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
