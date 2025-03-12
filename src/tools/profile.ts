import { z } from 'zod';
import { BaseTool } from '../utils/base-tool.js';
import { outreachClient } from '../utils/http-client.js';

export class ProfileTool extends BaseTool {
    name = 'profile';
    description = 'Get the profile for a given email address';

    schema = z.object({
        email: z.string().email().describe('Email address'),
    });

    async execute({ email }: z.infer<typeof this.schema>) {
        try {
            const { data } = await outreachClient.get('/profile', {
                headers: {
                    'x-user-email': email,
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
