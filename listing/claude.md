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

**Description, ≤2000** [1171]
```
Outreach2day is cold email infrastructure for agencies and outbound teams. This connector lets Claude work in your Outreach2day workspace.

What it does:
- Domains: check availability, list your domains with their status, mailbox count and nameserver status, and connect domains you already own.
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

**URL slug** (permanent once published)
```
outreach2day
```

**Icon:** `assets/logo.png` (512×512)

**Server URL**
```
https://public.outreach2day.com/mcp
```

**Authentication:** OAuth with dynamic client registration (CIMD also supported).

**Primary use cases**
```
Check domain availability and quote domains and mailboxes; start and monitor mailbox warm-up; build, preflight, launch and pause cold email campaigns; read campaign stats and replies; export mailboxes to Instantly or Smartlead.
```

**What users need before connecting**
```
An Outreach2day account (sign-up with Google, Microsoft or an emailed link at app.outreach2day.com). Buying domains and mailboxes needs a card on the Stripe payment page; reading an existing workspace needs nothing else.
```

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

**Company:** GROCK FOUNDATION PTE. LTD., https://outreach2day.com. Primary contact for review updates: the owner's name and email (fill in; support@outreach2day.com as fallback).

**Data handling**
- Underlying API: our own (Outreach2day public API; the MCP server runs on the same backend).
- Personal health data: no.
- Sponsored content: no.

**Test & launch: reviewer access** (needs the reviewer workspace seeded and `MCP_REVIEWER_LOGIN_ENABLED` on; steps in the backend repo, `docs/mcp/REVIEWER.md`)
```
Login URL: https://public.outreach2day.com/oauth/reviewer
Username: <reviewer email set at seed time>
Password: <password set at seed time>

The account holds sample data only and signs in with this username and password (no MFA, no emailed code, no social login).

1. In the browser you use for Claude, open https://public.outreach2day.com/oauth/reviewer and sign in with the username and password above.
2. In Claude, add the connector https://public.outreach2day.com/mcp. Claude opens the Outreach2day connection page, already signed in. If it asks for Google, Microsoft or email instead, repeat step 1 in that browser and connect again.
3. On the connection page, pick the review workspace and choose "Allow access".

What to try:
- "What's the state of my workspace?" (get_account_status)
- "List my domains" and "List my mailboxes" (list_domains, list_mailboxes)
- "Show mailboxes with a warm-up inbox rate under 80%" (get_warmup_status)
- "Check this cold email for spam words: ..." (check_copy)
- "Is tryacme-review.com available?" (check_domains)
- "Add a step to the draft campaign and run preflight" (upsert_campaign_step, preflight_campaign)
- "Launch the campaign" (launch_campaign): Claude asks for confirmation; the result says nothing was sent.
- "Quote 2 domains and 12 mailboxes" (quote_order): the result says ordering is turned off in this review workspace.

Sending, payments, warm-up providers, sequencer exports and domain connection are turned off in this workspace; those tools return a result that says nothing was sent, charged or connected.
```

**Tested:** every tool through MCP Inspector or as a custom connector in Claude (confirm in the portal after running them).

**Compliance notes**
- Financial transactions: the connector does not move money. `quote_order` prices an order and `create_checkout` returns a Stripe-hosted payment page; the user pays on that page. Both need the user's explicit confirmation (`confirm: true`).
- Conversation data: tools receive only their own arguments; the server does not request chat history, memory or files.
- Public documentation: https://outreach2day.com/mcp

**Tool annotations** (checked in `backend/src/api/mcp/tools.py`): all 23 tools carry `title`, `readOnlyHint` and `destructiveHint`. Read-only: 12. Write, not destructive: 8. Destructive: `upsert_campaign_step`, `launch_campaign`, `export_mailboxes_to_sequencer`.

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
