<p align="center"><img src="assets/logo.png" width="96" alt="Outreach2day logo"></p>

# Outreach2day MCP server

Remote MCP server for [Outreach2day](https://outreach2day.com), cold email infrastructure. Your AI assistant checks and buys domains, creates mailboxes with SPF, DKIM and DMARC, runs warm-up, builds campaigns and reads replies. It quotes every order; you approve it and pay on a Stripe-hosted page. The server never charges a card.

- Endpoint: `https://public.outreach2day.com/mcp` (Streamable HTTP)
- Auth: OAuth 2.1. Add the URL to your client, and the client opens an Outreach2day sign-in page on first use. No API key needed. Clients without OAuth, scripts and CI can send an API key instead: `Authorization: Bearer ot2d_...`.
- Pricing: $2.50 per mailbox a month with warm-up, sending engine and analytics included, minimum 12 mailboxes. Domains: $13 a year for .com, $5 for .info.

[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=outreach2day&config=eyJ1cmwiOiJodHRwczovL3B1YmxpYy5vdXRyZWFjaDJkYXkuY29tL21jcCJ9)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=outreach2day&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A//public.outreach2day.com/mcp%22%7D)
[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install_Server-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=outreach2day&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A//public.outreach2day.com/mcp%22%7D&quality=insiders)
[![Claude Code](https://img.shields.io/badge/Claude_Code-claude_mcp_add-D97757?style=flat-square&logo=claude&logoColor=white)](#claude-code)
[![Grok Build](https://img.shields.io/badge/Grok_Build-grok_mcp_add-000000?style=flat-square)](#grok-build)

## Install

Add the server, then sign in from your client. One command for Claude Code, Claude Desktop, Cursor, VS Code, Windsurf, Gemini CLI and Codex CLI. It adds the server URL to each client it finds, backs up each config file and keeps your other servers. It asks for no key:

```sh
curl -fsSL https://outreach2day.com/install | sh
```

Windows (PowerShell):

```powershell
irm https://outreach2day.com/install.ps1 | iex
```

Or with Node.js 18+: `npx -y outreach2day-mcp`. Read the script before running it: `curl -fsSL https://outreach2day.com/install | less`. Options: `--client <ids>`, `--use-key`, `--dry-run`, `--uninstall`.

At the end it prints the sign-in step for each client. The first sign-in opens a browser page where you log in to Outreach2day and approve access (`read`, `write`, `billing`).

### Claude Code

```sh
claude mcp add --transport http -s user outreach2day https://public.outreach2day.com/mcp
```

Then in Claude Code run `/mcp`, pick `outreach2day`, choose Authenticate. Or run `claude mcp login outreach2day`.

As a plugin (MCP server plus the skills below):

```sh
/plugin marketplace add OutreachToday/mcp
/plugin install outreach2day@outreach2day
```

Then sign in the same way, from `/mcp`.

### Cursor

Click **Add to Cursor** above, or add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "outreach2day": { "url": "https://public.outreach2day.com/mcp" }
  }
}
```

Cursor shows the server as needing sign-in; sign in from Cursor Settings, MCP.

### VS Code

Click **Install in VS Code** above, or add to your `mcp.json`:

```json
{
  "servers": {
    "outreach2day": { "type": "http", "url": "https://public.outreach2day.com/mcp" }
  }
}
```

Start the server (MCP: List Servers); VS Code asks you to sign in.

### Windsurf

`~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "outreach2day": { "serverUrl": "https://public.outreach2day.com/mcp" }
  }
}
```

Refresh the MCP servers in Cascade and sign in when asked.

### Gemini CLI

As an extension (the MCP server, `GEMINI.md` context and the skills below):

```sh
gemini extensions install https://github.com/OutreachToday/mcp
```

Then run `/mcp auth outreach2day` in Gemini CLI. The manifest is `gemini-extension.json` in this repo.

Or add the server by hand to `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "outreach2day": { "httpUrl": "https://public.outreach2day.com/mcp" }
  }
}
```

Then run `/mcp auth outreach2day` in Gemini CLI.

### Codex CLI

```sh
codex mcp add outreach2day --url https://public.outreach2day.com/mcp
codex mcp login outreach2day
```

### Grok Build

```sh
grok mcp add --transport http outreach2day https://public.outreach2day.com/mcp
```

Then in a `grok` session open `/mcps`, select `outreach2day` and press `i` to sign in. Grok Build also opens the sign-in page on first use and keeps the token in `~/.grok/mcp_credentials.json`.

As a plugin (MCP server plus the skills below):

```sh
grok plugin install OutreachToday/mcp
```

Grok Build reads the `.claude-plugin/` manifest in this repo, so no separate manifest is needed. It also loads servers from `~/.claude.json`, `.cursor/mcp.json` and `.mcp.json`, so a server you added for Claude Code or Cursor shows up in Grok Build too.

### grok.com

Open [grok.com/connectors](https://grok.com/connectors), click New Connector, then Custom. Enter a name and the Server URL `https://public.outreach2day.com/mcp`, then sign in in the pop-up window. On Grok Business and Enterprise an admin adds the connector first: console.x.ai, Grok Business, Connectors, Add Connector, Other.

### xAI API

A remote MCP tool in the Responses API. xAI sends `authorization` as the whole Authorization header, so keep the `Bearer` prefix:

```sh
curl https://api.x.ai/v1/responses \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-4.7",
    "input": "Which of my mailboxes are ready to send?",
    "tools": [{
      "type": "mcp",
      "server_label": "outreach2day",
      "server_url": "https://public.outreach2day.com/mcp",
      "authorization": "Bearer '"$OUTREACH2DAY_API_KEY"'"
    }]
  }'
```

### Claude Desktop and claude.ai

Customize, Connectors, Add custom connector, URL `https://public.outreach2day.com/mcp`. Claude opens the sign-in page when you connect.

### API key instead of sign-in

For clients without MCP OAuth, headless machines and CI. Create a key at <https://app.outreach2day.com/api-keys>. Keys have `read`, `write` and `billing` scopes; a read-only key cannot create or buy anything.

Keep the key in an environment variable, `OUTREACH2DAY_API_KEY`, and let the client config name the variable, not the key:

- Installer: `--use-key` asks for the key (input hidden); `--key ot2d_...` or `O2D_API_KEY=ot2d_...` pass it without a prompt. It saves the key to `~/.config/outreach2day/env` (mode 0600, loaded from your shell profile; Windows: a user environment variable) and writes only the variable name into each config.
- Claude Code: `claude mcp add --transport http -s user outreach2day https://public.outreach2day.com/mcp --header 'Authorization: Bearer ${OUTREACH2DAY_API_KEY}'`
- Cursor, VS Code, Windsurf: `"headers": { "Authorization": "Bearer ${env:OUTREACH2DAY_API_KEY}" }`
- Gemini CLI: `"headers": { "Authorization": "Bearer ${OUTREACH2DAY_API_KEY}" }`
- Codex CLI: `codex mcp add outreach2day --url https://public.outreach2day.com/mcp --bearer-token-env-var OUTREACH2DAY_API_KEY`
- Grok Build: `grok mcp add --transport http outreach2day https://public.outreach2day.com/mcp --header 'Authorization: Bearer ${OUTREACH2DAY_API_KEY}'`
- xAI API: `"authorization": "Bearer <key>"` in the `mcp` tool (above)
- Claude Desktop and claude.ai: no key; use the connector above.

Step-by-step guides per client: <https://outreach2day.com/mcp>.

## Tools

Every tool needs a signed-in session or a key; `any` means any scope.

| Tool | Scope | What it does |
|---|---|---|
| `get_pricing` | any | Mailbox and domain prices |
| `check_domains` | any | Domain availability |
| `check_copy` | any | Spam trigger words in a subject and body |
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

The `legacy/` folder holds the earlier stdio MCP server (Node, `OUTREACH_API_KEY`), which took an API key. It is superseded by the hosted server at `https://public.outreach2day.com/mcp` and is no longer maintained.
