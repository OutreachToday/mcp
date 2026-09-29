# ChatGPT and Codex Plugins Directory

Submit at https://platform.openai.com/plugins. One listing covers ChatGPT and Codex.

On ChatGPT the server hides `quote_order` and `create_checkout` (tool profile `openai`), so this listing has 21 tools and orders are placed in the Outreach2day web app. The copy below leaves out ordering.

**Name** [12]
```
Outreach2day
```

**Short description, ≤80** [59]
```
Manage cold email domains, mailboxes, warm-up and campaigns
```

**Description, ≤500** [366]
```
Connect ChatGPT to your Outreach2day workspace. Check domain availability, list domains and mailboxes, start warm-up and read inbox rate per mailbox, build draft campaigns with steps and contacts, launch after a preflight check, read stats and replies, and sync mailboxes to Instantly and Smartlead. The app has no delete tools and does not return mailbox passwords.
```

**Category:** Business / Productivity

**MCP server URL**
```
https://public.outreach2day.com/mcp
```

**Authentication:** OAuth. ChatGPT registers itself (CIMD or dynamic client registration). The consent page grants `read` and `write`.

**Domain verification:** the token from the portal goes into the `OPENAI_APPS_CHALLENGE` env var of the public API; the server returns it at `https://public.outreach2day.com/.well-known/openai-apps-challenge`.

**Website / privacy / terms / support**
```
https://outreach2day.com/mcp
https://outreach2day.com/privacy
https://outreach2day.com/terms
support@outreach2day.com
```

**Tools in this profile (21):** get_pricing, check_domains, check_copy, get_account_status, get_order, list_domains, list_mailboxes, get_warmup_status, list_sequencers, preflight_campaign, get_campaign_stats, list_replies, connect_own_domains, start_warmup, create_campaign, upsert_campaign_step, import_campaign_contacts, attach_campaign_mailboxes, pause_campaign, launch_campaign, export_mailboxes_to_sequencer.

**Starter prompts**
```
Check if tryacme.com, getacme.co and acmehq.com are available.
```
```
Show my mailboxes with a warm-up inbox rate under 80% this week.
```
```
Create a draft campaign "Q4 agencies" with 3 steps 2, 3 and 5 days apart.
```

## Test cases: 5 positive

| # | Prompt | Tools | Expected result |
|---|---|---|---|
| 1 | Is tryacme.com available? And getacme.co? | check_domains | Status per domain; available names listed; next step points to the web app for ordering |
| 2 | How much do 12 mailboxes cost a month? | get_pricing | $2.50 per mailbox, $30 for 12; domains $13 a year for .com and $5 for .info |
| 3 | Check this cold email for spam words: "Subject: Free money guaranteed ..." | check_copy | Matched trigger words and a suggestion to reword them |
| 4 | Show my mailboxes with a warm-up inbox rate under 80% | get_warmup_status | Matching mailboxes with inbox rate; nothing is changed |
| 5 | Create a draft campaign "Q4 agencies" with 3 steps 2, 3 and 5 days apart | create_campaign, upsert_campaign_step ×3 | Draft campaign with 3 steps and a link to it in the app; nothing is sent |

## Test cases: 3 negative

| # | Prompt | Expected behaviour |
|---|---|---|
| 1 | Buy 5 domains for me now with my saved card | No ordering tool in this profile. ChatGPT says orders are placed in the Outreach2day web app and gives the link |
| 2 | Delete all my mailboxes | No delete tool. ChatGPT says it can't delete mailboxes and points to the app or support |
| 3 | Launch campaign "Q4 agencies" right now (mailboxes still warming) | launch_campaign asks for confirmation and refuses while preflight is not ready; ChatGPT reports the blocking checks |

**Screenshots:** none. The plugin has no UI.
