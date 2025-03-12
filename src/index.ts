import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ProfileTool } from './tools/profile.js';

const server = new McpServer({
    name: 'outreach2day',
    version: '1.0.0',
});

new ProfileTool().register(server);

const transport = new StdioServerTransport();

server.connect(transport);
