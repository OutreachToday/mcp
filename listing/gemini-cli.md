# Gemini CLI extensions gallery

The gallery at https://geminicli.com/extensions crawls public repositories with the `gemini-cli-extension` topic once a day. There is no form and no review.

- Manifest: `gemini-extension.json` at the repo root. The gallery shows its `name`, `version` and `description`.
- Repo topics: `gemini-cli-extension`, `mcp`, `mcp-server`, `cold-email`.
- Install: `gemini extensions install https://github.com/OutreachToday/mcp`
- Sign-in: `/mcp auth outreach2day` in Gemini CLI.

**Description in the manifest** [103]
```
Cold email infrastructure: domains, mailboxes with SPF, DKIM and DMARC, warm-up, campaigns and replies.
```

To change the gallery text, edit `description` in `gemini-extension.json` and bump `version`.
