import axios from 'axios';

const OUTREACH_API_KEY = process.env.OUTREACH_API_KEY;

if (!OUTREACH_API_KEY) {
    throw new Error('OUTREACH_API_KEY environment variable is not set');
}

const OUTREACH_API_URL = 'https://backend.outreach2day.com';

export const outreachClient = axios.create({
    baseURL: `${OUTREACH_API_URL}/mcp_proxy`,
    headers: {
        'x-api-key': OUTREACH_API_KEY,
        'Content-Type': 'application/json',
    },
});
