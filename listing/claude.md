# Claude Connectors Directory

Submit at https://claude.ai/directory/manage → Submit new → MCP connector. Then submit the plugin bundle from this repo in the same portal and pair the two listings.

**Name** [12]
```
Outreach2day
```

**One-liner, ≤200** [153]
```
Check domains, set up cold email mailboxes with warm-up, build campaigns and read replies in your Outreach2day workspace. You approve and pay each order.
```

**Description, ≤2000** [1154]
```
Outreach2day is cold email infrastructure for agencies and outbound teams. This connector lets Claude work in your Outreach2day workspace.

What it does:
- Domains: check availability, list your domains with their SPF, DKIM and DMARC status, and connect domains you already own.
- Mailboxes and warm-up: list mailboxes, start warm-up, and read inbox rate and spam rate per mailbox.
- Orders: quote domains and mailboxes at server-side prices. You approve each order and pay through Stripe checkout; Claude only creates the checkout link.
- Campaigns: create draft campaigns, write sequence steps, import contacts, attach warmed mailboxes, run a preflight check, launch after you confirm, pause, and read stats and replies.
- Copy: check a subject line and body for spam trigger words.
- Integrations: sync mailboxes to Instantly and Smartlead.

Pricing: $2.50 per mailbox a month, minimum 12 mailboxes, warm-up included.

The connector has no delete or cancel tools and does not return mailbox passwords. Tool results contain data from your own workspaces only.

All tools need an Outreach2day account. Claude asks you to sign in with OAuth on first use.
```

**Categories:** Sales (primary), Marketing

**Server URL**
```
https://public.outreach2day.com/mcp
```

**Authentication:** OAuth with dynamic client registration (CIMD also supported).

**Reads or writes:** both. Write tools that send email or credentials (`launch_campaign`, `export_mailboxes_to_sequencer`) and `create_checkout` need `confirm: true` after the user agrees.

**Starter prompts**
```
Check if tryacme.com, getacme.co and acmehq.com are available and quote 3 domains with 12 mailboxes.
```
```
Show my mailboxes with a warm-up inbox rate under 80% this week.
```
```
Create a draft campaign "Q4 agencies" with 3 steps 2, 3 and 5 days apart, then export my warmed mailboxes to Instantly.
```

**Company:** GROCK FOUNDATION PTE. LTD., outreach2day.com, support@outreach2day.com

**Docs / privacy / terms / support**
```
https://outreach2day.com/mcp
https://outreach2day.com/privacy
https://outreach2day.com/terms
support@outreach2day.com
```

## Plugin bundle (same portal)

**Repository**
```
https://github.com/OutreachToday/mcp
```

**Description** [131]
```
Outreach2day MCP server for cold email domains, mailboxes, warm-up and campaigns, plus skills for DNS audits, spintax and capacity.
```

**Skills included:** `email-dns-audit`, `cold-email-spintax-linter`, `cold-email-capacity-planner`.
