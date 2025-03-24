import { z } from 'zod';

import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class SaveDomainsChoiceTool extends BaseTool {
    name = 'save-domains-choice';
    description = 'Save the domains choice';

    schema = z.object({
        domains: z.array(z.string()).describe('The domains to save'),
        workspaceId: z.number().describe('The ID of the workspace'),
        redirectDomain: z.string().describe('The domain to redirect to'),
        contactInfo: z.object({
            first_name: z.string().describe('The first name of the contact'),
            last_name: z.string().describe('The last name of the contact'),
            real_address: z
                .string()
                .describe('The real address of the contact'),
            city: z.string().describe('The city of the contact'),
            state_province: z
                .string()
                .describe('The state province of the contact'),
            postal_code: z.string().describe('The postal code of the contact'),
            country: z.string().describe('The country of the contact'),
            phone: z.string().describe('The phone of the contact'),
            email_address: z
                .string()
                .describe('The email address of the contact'),
            organization_name: z
                .string()
                .describe('The organization name of the contact'),
            job_title: z.string().describe('The job title of the contact'),
        }),
        whoisguard: z.boolean().describe('Whether to enable whois guard'),
    });

    async execute({
        domains,
        workspaceId,
        redirectDomain,
        contactInfo,
        whoisguard,
    }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.post('/save_domains_choice', {
                body: {
                    domains,
                    workspace_id: workspaceId,
                    redirectDomain,
                    contactInfo,
                    whoisguard,
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
