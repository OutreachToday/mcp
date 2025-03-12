import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WeatherTool } from './tools/weather.js';

const server = new McpServer({
    name: 'weather',
    version: '1.0.0',
});

new WeatherTool().register(server);

const transport = new StdioServerTransport();

server.connect(transport);
