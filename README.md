<p align="center"><img src="assets/logo.png" width="96" alt="Outreach2day logo"></p>

# Outreach2day MCP server

Remote MCP server for [Outreach2day](https://outreach2day.com), cold email infrastructure. Your AI assistant checks and buys domains, creates mailboxes with SPF, DKIM and DMARC, runs warm-up, builds campaigns and reads replies. It quotes every order; you approve it and pay on a Stripe-hosted page.

- Endpoint: `https://public.outreach2day.com/mcp` (Streamable HTTP)
- Auth: OAuth 2.1. Add the URL to your assistant and sign in with your Outreach2day account in the browser. An API key is only for CI and headless setups (see API key below)
- Pricing: $2.50 per mailbox a month with warm-up, sending engine and analytics included, minimum 12 mailboxes. Domains: $13 a year for .com, $5 for .info

[![Add to Claude](https://img.shields.io/badge/Claude-Add_connector-D97757?style=flat-square&logo=claude&logoColor=white)](https://claude.ai/customize/connectors?modal=add-custom-connector&connectorName=Outreach2day&connectorUrl=https%3A%2F%2Fpublic.outreach2day.com%2Fmcp)
[![Add to Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=outreach2day&config=eyJ1cmwiOiJodHRwczovL3B1YmxpYy5vdXRyZWFjaDJkYXkuY29tL21jcCJ9)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Server-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=outreach2day&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A//public.outreach2day.com/mcp%22%7D)
[![Install in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Install_Server-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect/mcp/install?name=outreach2day&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A//public.outreach2day.com/mcp%22%7D&quality=insiders)
[![Claude Code](https://img.shields.io/badge/Claude_Code-claude_mcp_add-D97757?style=flat-square&logo=claude&logoColor=white)](#claude-code)
[![Grok Build](https://img.shields.io/badge/Grok_Build-grok_mcp_add-000000?style=flat-square)](#grok-build)

## Connect

Server URL: `https://public.outreach2day.com/mcp`

Add the URL to your AI assistant, then sign in with your Outreach2day account on the page the assistant opens. Turn on Prepare orders on that page to let the assistant quote orders. Claude, Cursor and VS Code also install from the buttons above.

### Claude (claude.ai, Claude Desktop and mobile)

Click **Add to Claude** above, or open Customize, Connectors, click + and choose Add custom connector. Paste `https://public.outreach2day.com/mcp`, click Add, then Connect. Claude opens the Outreach2day sign-in page. On Team and Enterprise an Owner adds the connector first under Organization settings, Connectors; members then click Connect.

### ChatGPT

Settings, Security and login: turn on Developer mode. Go to chatgpt.com/plugins, click +, name the app Outreach2day, enter `https://public.outreach2day.com/mcp` under Connection and create it. In a new chat, add Outreach2day from the tools menu; ChatGPT opens the Outreach2day sign-in page on the first tool call. In ChatGPT the app works with an existing account; orders are placed in the web app at https://app.outreach2day.com.

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

Click **Install in VS Code** above, or add the server to `.mcp.json` at the workspace root or to `~/.copilot/mcp-config.json` for every workspace:

```json
{
  "mcpServers": {
    "outreach2day": { "type": "http", "url": "https://public.outreach2day.com/mcp" }
  }
}
```

Start the server (MCP: List Servers); VS Code asks you to sign in.

### Windsurf (Devin Desktop)

Cascade reads `~/.config/devin/mcp_config.json` (Windows: `%APPDATA%\devin\mcp_config.json`; older Windsurf builds: `~/.codeium/windsurf/mcp_config.json`):

```json
{
  "mcpServers": {
    "outreach2day": { "serverUrl": "https://public.outreach2day.com/mcp" }
  }
}
```

Refresh the MCP servers in Cascade and sign in when asked.

In Devin CLI: `devin mcp add -s user outreach2day https://public.outreach2day.com/mcp`, then `devin mcp login outreach2day`.

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

### Install script

Optional. Adds the server URL to Claude Code, Cursor, VS Code, Windsurf, Gemini CLI and Codex CLI on this computer, backs up each config file and keeps your other servers. Claude and ChatGPT use the steps above. At the end it prints the sign-in step for each client.

```sh
curl -fsSL https://outreach2day.com/install | sh
```

Windows (PowerShell):

```powershell
irm https://outreach2day.com/install.ps1 | iex
```

Read the script before running it: `curl -fsSL https://outreach2day.com/install | less`. Options: `--client <ids>`, `--use-key`, `--dry-run`, `--uninstall`.

### API key for CI and headless setups

For clients without MCP OAuth, headless machines and CI. Create a key at <https://app.outreach2day.com/api-keys>. Keys have `read`, `write` and `billing` scopes; a read-only key cannot create or buy anything.

Keep the key in the `OUTREACH2DAY_API_KEY` environment variable and reference the variable in the client config:

- Installer: `--use-key` asks for the key (input hidden); `--key ot2d_...` or `O2D_API_KEY=ot2d_...` pass it without a prompt. It saves the key to `~/.config/outreach2day/env` (mode 0600, loaded from your shell profile; Windows: a user environment variable) and writes only the variable name into each config
- Claude Code: `claude mcp add --transport http -s user outreach2day https://public.outreach2day.com/mcp --header 'Authorization: Bearer ${OUTREACH2DAY_API_KEY}'`
- Cursor, VS Code, Windsurf: `"headers": { "Authorization": "Bearer ${env:OUTREACH2DAY_API_KEY}" }`
- Gemini CLI: `"headers": { "Authorization": "Bearer ${OUTREACH2DAY_API_KEY}" }`
- Codex CLI: `codex mcp add outreach2day --url https://public.outreach2day.com/mcp --bearer-token-env-var OUTREACH2DAY_API_KEY`
- Grok Build: `grok mcp add --transport http outreach2day https://public.outreach2day.com/mcp --header 'Authorization: Bearer ${OUTREACH2DAY_API_KEY}'`
- xAI API: `"authorization": "Bearer <key>"` in the `mcp` tool (below)
- Claude and ChatGPT: sign in with the steps above

Step-by-step guides per client: <https://outreach2day.com/mcp>.

#### xAI API (Responses API)

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

- `email-dns-audit`: SPF, DKIM, DMARC, MX audit per sending domain with exact record fixes
- `cold-email-spintax-linter`: finds spintax and merge variable errors before launch
- `cold-email-capacity-planner`: mailboxes, domains, timeline and cost from a volume target

## Privacy and support

Privacy policy: <https://outreach2day.com/privacy> (section "AI Assistants, API and MCP"). Terms: <https://outreach2day.com/terms>. Support: support@outreach2day.com or the in-app chat.

Outreach2day is operated by GROCK FOUNDATION PTE. LTD., Singapore.

## License

MIT for the contents of this repository (configs, skills, docs). The Outreach2day service is covered by its terms of service.

## Legacy local server

The earlier stdio server (Node, API key) is kept at the `legacy-stdio` tag and is no longer maintained. Use the hosted server above.
