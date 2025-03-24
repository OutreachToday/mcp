import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class DomainsDnsRecordsTool extends BaseTool {
    name = 'domains-dns-records';
    description = 'Get the DNS records for the domains';

    schema = z.object({
        workspaceId: z.string().describe('The ID of the workspace'),
        domain: z.string().describe('The domain to get the DNS records for'),
    });

    async execute({ workspaceId, domain }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.get(
                `/domains/${domain}/dns_records`,
                {
                    params: {
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
