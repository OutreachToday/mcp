# Muse (Meta) Connector Platform

Submit at https://muse.ai/platform → Submit a connector. Sign-in needs a Meta account with a work email. Meta reviews functional, security and legal requirements and runs end-to-end tests, so the reviewer account from the backend's `docs/mcp/REVIEWER.md` is needed.

**Product name** [12]
```
Outreach2day
```

**Short description** [70]
```
Cold email domains, mailboxes and warm-up at $2.50 per mailbox a month
```

**Product description** [435]
```
Outreach2day is cold email infrastructure for agencies and outbound teams. The connector works in the user's Outreach2day workspace: check domain availability, list domains and mailboxes, start warm-up and read inbox rate per mailbox, build draft campaigns with steps and contacts, launch after a preflight check, and read stats and replies. Orders are quoted by the server; the user approves each one and pays on a Stripe-hosted page.
```

**Connector interface:** remote MCP server
```
https://public.outreach2day.com/mcp
```

**Authentication:** OAuth 2.1 (dynamic client registration, PKCE).

**Data handling:** the connector reads and writes only the signed-in user's workspace. Disconnecting the app in Outreach2day ends the grant, and its tokens stop working. Privacy policy section "AI Assistants, API and MCP" covers retention and deletion.

**Category:** Business / Productivity

**Links**
```
https://outreach2day.com/mcp
https://outreach2day.com/privacy
https://outreach2day.com/terms
support@outreach2day.com
```
