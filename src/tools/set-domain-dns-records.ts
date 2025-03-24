import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class SetDomainDnsRecordsTool extends BaseTool {
    name = 'set-domain-dns-records';
    description = 'Set the DNS records for a domain';

    schema = z.object({
        domain: z.string().describe('The domain to set the DNS records for'),
        workspaceId: z.string().describe('The ID of the workspace'),
        records: z
            .array(
                z.object({
                    Address: z.string(),
                    AssociatedAppTitle: z.string(),
                    FriendlyName: z.string(),
                    HostId: z.string(),
                    IsActive: z.string(),
                    IsDDNSEnabled: z.string(),
                    MXPref: z.string(),
                    Name: z.string(),
                    TTL: z.string(),
                    Type: z.string(),
                    id: z.number().optional(),
                })
            )
            .describe('The DNS records to set'),
    });

    async execute({
        domain,
        workspaceId,
        records,
    }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post(
                `/domains/${domain}/dns_record`,
                {
                    body: {
                        domain,
                        records,
                    },
                    params: {
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
