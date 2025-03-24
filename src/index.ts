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
import { CheckAvailableDomainsTool } from './tools/check-available-domains.js';
import { SaveDomainsChoiceTool } from './tools/save-domains-choice.js';
import { PurchaseDnsHostingTool } from './tools/purchase-dns-hosting.js';
import { ChangeDomainsRedirectsTool } from './tools/change-domains-redirects.js';
import { SetDomainDnsRecordsTool } from './tools/set-domain-dns-records.js';
import { ReplaceRestrictedDomainsTool } from './tools/replace-restricted-domains.js';
import { SaveMailboxChoiceTool } from './tools/save-mailbox-choice.js';
import { UpdateMailboxesTool } from './tools/update-mailboxes.js';
import { UpgradeSubscriptionTool } from './tools/upgrade-subscription.js';
import { WorkspaceAddUserTool } from './tools/workspace-add-user.js';
import { WorkspaceDeleteUserTool } from './tools/workspace-delete-user.js';
import { WorkspaceUpdateTool } from './tools/workspace-update.js';
import { WorkspaceUsersTool } from './tools/workspace-users.js';
import { WorkspaceCreateTool } from './tools/workspace-create.js';

const server = new McpServer({
    name: 'outreach2day',
    version: '1.0.0',
});

new ProfileTool().register(server);
new CurrentUserDomainsTool().register(server);
new CheckAvailableDomainsTool().register(server);
new SaveDomainsChoiceTool().register(server);
new PurchaseDnsHostingTool().register(server);
new ChangeDomainsRedirectsTool().register(server);
new SetDomainDnsRecordsTool().register(server);
new ReplaceRestrictedDomainsTool().register(server);
new CurrentUserMailboxesTool().register(server);
new SaveMailboxChoiceTool().register(server);
new UpdateMailboxesTool().register(server);
new UpgradeSubscriptionTool().register(server);
new ApiKeysTool().register(server);
new WorkspaceCreditsTool().register(server);
new WorkspaceSubscriptionStatusTool().register(server);
new WorkspaceInvoicesTool().register(server);
new WorkspacePaymentMethodTool().register(server);
new WorkspaceAddUserTool().register(server);
new WorkspaceDeleteUserTool().register(server);
new WorkspaceUpdateTool().register(server);
new WorkspaceUsersTool().register(server);
new WorkspaceCreateTool().register(server);
new HealthTestsTool().register(server);
new DomainsHealthTool().register(server);
new DomainsDnsRecordsTool().register(server);

const transport = new StdioServerTransport();

server.connect(transport);
