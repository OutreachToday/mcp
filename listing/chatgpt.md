# ChatGPT and Codex Plugins Directory

Submit at https://platform.openai.com/plugins. One listing covers ChatGPT and Codex.

The listing is no longer typed into forms: it ships in the plugin ZIP. Source and build steps: [`openai-plugin/`](../openai-plugin/README.md). Build with `python3 scripts/build_openai_plugin.py` and upload `dist/outreach2day-openai-<version>.zip`.

| What | Where |
|---|---|
| Name, subtitle, description, category, capabilities, links, starter prompts, icon | `openai-plugin/plugin.json`, `extensions.com.openai.interface` |
| 5 positive and 3 negative test cases, commerce, release notes | `openai-plugin/plugin.json`, `extensions.com.openai.review` and `publication` |
| MCP server | `openai-plugin/mcp.json` |
| Skills | `skills/` (the capacity planner without our prices, see the README) |
| Reviewer access, demo recording, annotation justifications | `openai-plugin/review-details.md`, entered in the dashboard |

On ChatGPT the server lists 18 tools (tool profile `openai`, backend `src/api/mcp/profiles.py`). It hides `quote_order`, `create_checkout`, `get_pricing`, `get_order`, `check_domains` and `suggest_domains`, and its texts mention no buying or prices. The listing copy follows that: orders are placed in the Outreach2day web app.

**Tools in this profile (18):** check_copy, get_account_status, list_domains, list_mailboxes, get_warmup_status, list_sequencers, preflight_campaign, get_campaign_stats, list_replies, connect_own_domains, start_warmup, create_campaign, upsert_campaign_step, import_campaign_contacts, attach_campaign_mailboxes, pause_campaign, launch_campaign, export_mailboxes_to_sequencer.

**Starter prompts.** The first one is pre-filled after install and most users send it, so it works on an account with no domains or mailboxes (check_copy with the copy inline). Changing prompts or their order needs a new package version and review.

**Authentication:** OAuth. ChatGPT registers itself (CIMD or dynamic client registration). The consent page grants `read` and `write`.

**Domain verification:** the token from the portal goes into the `OPENAI_APPS_CHALLENGE` env var of the public API; the server returns it at `https://public.outreach2day.com/.well-known/openai-apps-challenge`.

**Screenshots:** none. The server returns no UI, and the portal allows screenshots only with UI.
