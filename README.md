<p align="center"><img src="assets/logo.png" width="96" alt="Outreach2day logo"></p>

# Outreach2day MCP server

Remote MCP server for [Outreach2day](https://outreach2day.com), cold email infrastructure. Your AI assistant checks and buys domains, creates mailboxes with SPF, DKIM and DMARC, runs warm-up, builds campaigns and reads replies. It quotes every order; you approve it and pay on a Stripe-hosted page. The server never charges a card.

- Endpoint: `https://public.outreach2day.com/mcp` (Streamable HTTP)
- Auth: API key in `Authorization: Bearer ot2d_...`. `initialize`, `tools/list` and three public tools (`get_pricing`, `check_domains`, `check_copy`) work without a key.
- Pricing: $2.50 per mailbox a month with warm-up, sending engine and analytics included, minimum 12 mailboxes. Domains: $13 a year for .com, $5 for .info.

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=outreach2day&config=eyJ1cmwiOiJodHRwczovL3B1YmxpYy5vdXRyZWFjaDJkYXkuY29tL21jcCJ9)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=outreach2day&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A//public.outreach2day.com/mcp%22%7D)
[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install_Server-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=outreach2day&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A//public.outreach2day.com/mcp%22%7D&quality=insiders)
[![Claude Code](https://img.shields.io/badge/Claude_Code-claude_mcp_add-D97757?style=flat-square&logo=claude&logoColor=white)](#claude-code)

## Install

One command for Claude Code, Claude Desktop, Cursor, VS Code, Windsurf, Gemini CLI and Codex CLI. It asks for your API key (input hidden), backs up each config file and keeps your other servers:

```sh
curl -fsSL https://outreach2day.com/install | sh
```

Windows (PowerShell):

```powershell
irm https://outreach2day.com/install.ps1 | iex
```

Read the script before running it: `curl -fsSL https://outreach2day.com/install | less`. Options: `--client <ids>`, `--dry-run`, `--uninstall`.

Create an API key at <https://app.outreach2day.com/api-keys>. Keys have `read`, `write` and `billing` scopes; a read-only key cannot create or buy anything.

### Claude Code

```sh
claude mcp add --transport http outreach2day https://public.outreach2day.com/mcp \
  --header "Authorization: Bearer ot2d_..."
```

Or install this repository as a plugin (MCP server plus the skills below). Set `O2D_API_KEY` in your environment first:

```sh
/plugin marketplace add outreach2day/mcp
/plugin install outreach2day@outreach2day
```

### Cursor

Click **Add to Cursor** above, then add the key header in `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "outreach2day": {
      "url": "https://public.outreach2day.com/mcp",
      "headers": { "Authorization": "Bearer ot2d_..." }
    }
  }
}
```

### VS Code

Click **Install in VS Code** above, or add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "outreach2day": {
      "type": "http",
      "url": "https://public.outreach2day.com/mcp",
      "headers": { "Authorization": "Bearer ${input:o2d_key}" }
    }
  },
  "inputs": [
    { "id": "o2d_key", "type": "promptString", "description": "Outreach2day API key (ot2d_...)", "password": true }
  ]
}
```

### Claude Desktop, ChatGPT and other clients

Clients with remote MCP support: add `https://public.outreach2day.com/mcp` with the header above. Clients that only run local servers: use `npx -y mcp-remote https://public.outreach2day.com/mcp --header "Authorization:${O2D_AUTH}"` with `O2D_AUTH="Bearer ot2d_..."`. Step-by-step guides per client: <https://outreach2day.com/mcp>.

## Tools

| Tool | Scope | What it does |
|---|---|---|
| `get_pricing` | public | Mailbox and domain prices |
| `check_domains` | public | Domain availability |
| `check_copy` | public | Spam trigger words in a subject and body |
| `get_account_status` | read | Workspace status, next step, campaigns |
| `get_order` | read | Order status |
| `list_domains` | read | Domains and DNS status |
| `list_mailboxes` | read | Mailboxes |
| `get_warmup_status` | read | Warm-up inbox rate, spam rate per mailbox |
| `list_sequencers` | read | Connected Instantly and Smartlead accounts |
| `preflight_campaign` | read | Checks a campaign before launch |
| `get_campaign_stats` | read | Sent, replies, bounces |
| `list_replies` | read | Replies in a campaign |
| `connect_own_domains` | write | Connect domains you already own |
| `start_warmup` | write | Start warm-up |
| `create_campaign` | write | Create a draft campaign |
| `upsert_campaign_step` | write | Add or edit a sequence step |
| `import_campaign_contacts` | write | Import leads |
| `attach_campaign_mailboxes` | write | Attach warmed mailboxes |
| `pause_campaign` | write | Pause a campaign |
| `launch_campaign` | write | Launch after preflight passes (needs `confirm: true`) |
| `export_mailboxes_to_sequencer` | write | Send mailboxes to Instantly or Smartlead (needs `confirm: true`) |
| `quote_order` | billing | Server-priced quote for domains and mailboxes |
| `create_checkout` | billing | Stripe-hosted payment link for a confirmed quote |

Not exposed: deleting or cancelling anything, credential reveal, card-on-file purchases.

## Example prompts

1. Check if tryacme.com, getacme.co and acmehq.com are free and quote 3 domains with 12 mailboxes.
2. Show my mailboxes with a warm-up inbox rate under 80% this week.
3. Check this cold email for spam words: <text>.
4. Create a draft campaign "Q4 agencies" with 3 steps, 2, 3 and 5 days apart.
5. List replies from the last 24 hours in campaign "Q4 agencies".

## Skills

`skills/` holds three agent skills from <https://outreach2day.com/skills> that work with or without the server:

- `email-dns-audit`: SPF, DKIM, DMARC, MX audit per sending domain with exact record fixes.
- `cold-email-spintax-linter`: finds spintax and merge variable errors before launch.
- `cold-email-capacity-planner`: mailboxes, domains, timeline and cost from a volume target.

## Privacy and support

Privacy policy: <https://outreach2day.com/privacy> (section "AI Assistants, API and MCP"). Terms: <https://outreach2day.com/terms>. Support: support@outreach2day.com or the in-app chat.

Outreach2day is operated by GROCK FOUNDATION PTE. LTD., Singapore.

## License

MIT for the contents of this repository (configs, skills, docs). The Outreach2day service is covered by its terms of service.

## Legacy local server

The `legacy/` folder holds the earlier stdio MCP server (Node, `OUTREACH_API_KEY`). It is superseded by the hosted server at `https://public.outreach2day.com/mcp` and is no longer maintained.
