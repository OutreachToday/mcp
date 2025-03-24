import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class CheckAvailableDomainsTool extends BaseTool {
    name = 'check-available-domains';
    description = 'Check if a domain is available';

    schema = z.object({
        domains: z.array(z.string()).describe('The domains to check'),
    });

    async execute({ domains }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post('/check_domains', {
                body: {
                    domains,
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
