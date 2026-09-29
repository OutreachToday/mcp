# Outreach2day

The `outreach2day` MCP server works in the user's Outreach2day workspace: domains, mailboxes, warm-up, campaigns and replies.

- Sign-in: the server uses OAuth. If a tool answers with an authentication error, ask the user to run `/mcp auth outreach2day`.
- Start with `get_account_status`. Its `next_action` names the next step.
- Every tool result has `next_step` and `links`. Follow `next_step`, and give the user the links.
- `launch_campaign`, `export_mailboxes_to_sequencer` and `create_checkout` need `confirm: true`. Describe the action to the user and wait for an explicit yes before calling them with it.
- Orders: `quote_order` returns a `human_summary`. Show it to the user as is. After the user agrees, `create_checkout` returns a Stripe payment link; the user pays on that page.
