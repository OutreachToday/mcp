import axios from 'axios';

const OUTREACH_API_KEY = process.env.OUTREACH_API_KEY || 'test';

if (!OUTREACH_API_KEY) {
    throw new Error('OUTREACH_API_KEY environment variable is not set');
}

const OUTREACH_API_URL =
    process.env.OUTREACH_API_URL || 'http://localhost:7777';

if (!OUTREACH_API_URL) {
    throw new Error('OUTREACH_API_URL environment variable is not set');
}

export const outreachClient = axios.create({
    baseURL: `${OUTREACH_API_URL}/mcp_proxy`,
    headers: {
        'x-api-key': OUTREACH_API_KEY,
        'Content-Type': 'application/json',
    },
});
