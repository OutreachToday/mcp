import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ProfileTool } from './tools/profile.js';
import { ApiKeysTool } from './tools/api-keys.js';
import { WorkspaceCreditsTool } from './tools/workspace-credits.js';
import { WorkspaceInvoicesTool } from './tools/workspace-invoices.js';
import { WorkspaceSubscriptionStatusTool } from './tools/workspace-subscription-status.js';
import { WorkspacePaymentMethodTool } from './tools/workspace-payment-method.js';
import { CurrentUserMailboxesTool } from './tools/current-user-mailboxes.js';
import { CurrentUserDomainsTool } from './tools/current-user-domains.js';
import { HealthTestsTool } from './tools/health-tests.js';
import { DomainsHealthTool } from './tools/domains-health.js';
import { DomainsDnsRecordsTool } from './tools/domains-dns-records.js';

const server = new McpServer({
    name: 'outreach2day',
    version: '1.0.0',
});

new ProfileTool().register(server);
new ApiKeysTool().register(server);
new WorkspaceCreditsTool().register(server);
new WorkspaceSubscriptionStatusTool().register(server);
new WorkspaceInvoicesTool().register(server);
new WorkspacePaymentMethodTool().register(server);
new CurrentUserMailboxesTool().register(server);
new CurrentUserDomainsTool().register(server);
new HealthTestsTool().register(server);
new DomainsHealthTool().register(server);
new DomainsDnsRecordsTool().register(server);

export function startServer() {
    const transport = new StdioServerTransport();
    server.connect(transport);
}

startServer();
