import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class PurchaseDnsHostingTool extends BaseTool {
    name = 'purchase-dns-hosting';
    description = 'Purchase DNS hosting';

    schema = z.object({
        domains: z
            .array(z.string())
            .describe('The domains to purchase DNS hosting for'),
        numYears: z
            .number()
            .describe('The number of years to purchase DNS hosting for'),
        workspaceId: z
            .string()
            .describe('The ID of the workspace to purchase DNS hosting for'),
        redirectDomain: z.string().describe('The domain to redirect to'),
    });

    async execute({
        domains,
        numYears,
        workspaceId,
        redirectDomain,
    }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post(
                '/purchase_dns_hosting',
                {
                    body: {
                        domains,
                        num_years: numYears,
                        workspace_id: workspaceId,
                        redirectDomain,
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
