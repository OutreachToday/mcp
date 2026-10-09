# OpenAI plugin package (ChatGPT and Codex)

Source of the ZIP uploaded at https://platform.openai.com/plugins. It uses the portable Agent Plugins layout from [Package your plugin](https://developers.openai.com/plugins/build/plugins): root `plugin.json` with the OpenAI listing under `extensions.com.openai`, root `mcp.json`, `skills/` and `assets/`.

| File | What it holds |
|---|---|
| `plugin.json` | Identity, listing (name, subtitle, description, category, capabilities, links, starter prompts, icons, brand color), five positive and three negative review cases, commerce declaration, release notes |
| `mcp.json` | The remote MCP server, `https://public.outreach2day.com/mcp` over Streamable HTTP. OAuth is discovered from the server; the package carries no auth settings |
| `review-details.md` | Not in the ZIP. Reviewer access text with a password placeholder, the demo recording note and per-tool annotation justifications for the dashboard |

The build adds the repo's `skills/` and `assets/logo.png`. The capacity planner skill gets two edits in the package: the server hides prices from OpenAI clients, so the packaged skill works from the user's own prices (`SKILL_PATCHES` in the build script; the build fails if the skill text it replaces changes).

## Build

```sh
python3 scripts/build_openai_plugin.py                       # dist/openai-plugin/ and dist/outreach2day-openai-<version>.zip
python3 scripts/build_openai_plugin.py --zip-out path/to.zip  # also copy the ZIP there
python3 scripts/build_openai_plugin.py --check-only           # checks only
```

The script checks the limits from [Plugin submission errors](https://developers.openai.com/plugins/deploy/submission-errors): name and version format, 30-character display name and subtitle, at most 3 starter prompts of 128 characters without @mentions, a supported category, HTTPS listing URLs, brand color contrast, square PNG icons, exactly 5 positive and 3 negative cases with their required fields, tool names that the server lists to OpenAI clients, no `test_credentials`, `reviewer_instructions`, `apps`, `hooks` or screenshots, skill front matter, and no secrets. OpenAI has no public validator CLI; the portal validates on upload.

Local install check with Codex CLI 0.162 or newer: add a marketplace whose entry points at `dist/openai-plugin`, then `codex plugin add outreach2day@<marketplace>`, `codex mcp list` (shows the server, "Not logged in" until OAuth) and the three skills as `outreach2day:<skill>`.

## Upload

1. https://platform.openai.com/plugins, open the Outreach2day draft.
2. **Upload plugin to make changes** (on a new plugin: **Upload new or existing plugin**, pick the developer identity, **Upload plugin**), choose the ZIP.
3. **Metadata & Skills**: wait for the checks and skill scans (up to 2 hours), fix findings with a new ZIP and a higher `version`.
4. **Review information → Review details**: paste the reviewer access text from `review-details.md`, enter the password there, add the demo recording URL, **Save details**.
5. **Submit for review** and complete the attestations.

Each new upload needs a new `version` in `plugin.json`. The package `name` must stay `outreach2day`; an update with another name is refused (`plugin_name_mismatch`). Changes to the MCP server's tools do not need a new ZIP: deploy, then **MCPs → Rescan**.
