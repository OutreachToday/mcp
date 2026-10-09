# OpenAI review: what goes into the dashboard, not the ZIP

The ZIP carries the listing, the starter prompts, the review test cases, the release notes and the skills. Two things stay out of it:

- **Reviewer access.** The ZIP must not contain credentials or reviewer instructions; the importer rejects `test_credentials` and `reviewer_instructions` ([submission guide](https://developers.openai.com/plugins/deploy/submission#configure-onboarding-review-and-publication)). Enter them in **Metadata & Skills → Review information → Review details**.
- **Annotation justifications.** The package format has no field for them. The [plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines#correct-annotation) now say "Annotation justifications are no longer required. If our automated review flags an annotation issue, you can submit an appeal with clarification or additional information." The [error reference](https://developers.openai.com/plugins/deploy/submission-errors#mcp-and-review-errors) still lists `justification_required`. If the dashboard asks for a justification per tool, paste the texts below; if a tool is held after a scan, use the matching text in **MCPs → Issues → Appeal**.

## Review details: reviewer access

Paste into the Review details form. Replace `<PASTE PASSWORD HERE>` in the form only, never in this file or the repo. The password is in the password manager entry for the reviewer account.

```text
Login URL: https://public.outreach2day.com/oauth/reviewer
Username: review-6c67fdaf8bc1@outreach2day.com
Password: <PASTE PASSWORD HERE>

The account signs in with this username and password only: no MFA, no SMS, no emailed code, no social login. It holds sample data only.

Sign-in and connection:
1. In ChatGPT, connect Outreach2day. ChatGPT opens the Outreach2day sign-in page.
2. Choose "Sign in with a reviewer password" and sign in with the username and password above. (You can also open https://public.outreach2day.com/oauth/reviewer first in the same browser, sign in there, then connect from ChatGPT.)
3. On the connection page, pick the review workspace and choose "Allow access".

The review workspace has sample domains on the reserved .example TLD, 12 mailboxes (most ready to send, three still warming), warm-up history with inbox rates from 62% to 98%, two finished campaigns with stats and replies, and one Instantly connection that is not live.

Outside effects are turned off in this workspace: launch_campaign, start_warmup, connect_own_domains and export_mailboxes_to_sequencer run their checks and then return sandbox: true and say that nothing was sent, started or connected. No email leaves the workspace. The plugin has no purchase, payment or delete tools.

Run the five positive cases in order; case 5 uses the draft campaign from case 4.
Support during the review: support@outreach2day.com
```

Before submitting, check that the password has not expired: reviewer passwords expire 14 days after they are set unless the seed run set a longer period (backend `docs/mcp/REVIEWER.md`). Sign in once in a private window, connect from ChatGPT and run starter prompt 2. After the review, revoke the password as `docs/mcp/REVIEWER.md` describes.

## Demo recording

Required for review ([submission guide](https://developers.openai.com/plugins/deploy/submission#complete-review-information)) and not in the ZIP yet. Record the five positive cases on the review account in ChatGPT, upload the video where reviewers can open it without signing in, and enter the URL in Review details. To ship it in the package instead, add `"demo_recording_url": "https://..."` under `extensions.com.openai.review` in `plugin.json`, bump the version and rebuild.

## Annotation justifications

Values as the server advertises them (backend `src/api/mcp/tools.py`), for the 18 tools listed to ChatGPT. `readOnlyHint` / `destructiveHint` / `openWorldHint`.

### Read-only tools: true / false / false

| Tool | Justification |
|---|---|
| `check_copy` | Read-only: compares the subject and body passed in the call with a fixed spam-word list and returns the matches. It stores nothing and changes nothing. Not open-world: no network call, no workspace data. |
| `get_account_status` | Read-only: reads the signed-in workspace's subscription, domains, mailboxes, warm-up and campaign counts and returns them with a suggested next step. Not open-world: limited to the user's own workspace. |
| `list_domains` | Read-only: lists the workspace's sending domains with status, mailbox count, DNS status and nameservers. Not open-world: limited to the user's own workspace. |
| `list_mailboxes` | Read-only: lists the workspace's mailboxes (address, sender name, status). It never returns credentials. Not open-world: limited to the user's own workspace. |
| `get_warmup_status` | Read-only: reads warm-up progress and inbox rate per mailbox. Not open-world: limited to the user's own workspace. |
| `list_sequencers` | Read-only: lists the sequencer accounts (Instantly, Smartlead) the user connected in the web app, without their API keys. Not open-world: reads the workspace's own records. |
| `preflight_campaign` | Read-only: checks whether a campaign could launch (sequence, contacts, attached mailboxes, warm-up) and returns the blocking checks. It launches nothing. Not open-world: limited to the user's own workspace. |
| `get_campaign_stats` | Read-only: reads sent, reply and bounce counts for one campaign. Not open-world: limited to the user's own workspace. |
| `list_replies` | Read-only: lists recent reply threads (subject, sender, short snippet, intent) for the workspace. It sends nothing. Not open-world: limited to the user's own workspace. |

### Write tools inside the workspace

| Tool | Values | Justification |
|---|---|---|
| `connect_own_domains` | false / false / false | Not read-only: adds domains the user already owns to the workspace and returns the nameservers the user must set at their registrar. Not destructive: additive only; it creates a DNS zone for each new domain on Outreach2day's DNS hosting, changes no existing domain and nothing at the user's registrar (the user changes the nameservers there), and domains already connected are skipped. Not open-world: works on domains the user owns and their own workspace. |
| `create_campaign` | false / false / false | Not read-only: creates a campaign. Not destructive: the campaign is a draft and sends nothing until `launch_campaign`; it overwrites nothing. Not open-world: stays in the user's workspace. |
| `upsert_campaign_step` | false / true / false | Not read-only: adds or edits an email step. Destructive: updating an existing step (by `step_id` or `order`) overwrites its subject, body and delay, and the old copy is not kept. Without either it appends a new step. Not open-world: edits a campaign in the user's workspace; nothing is sent. |
| `import_campaign_contacts` | false / false / false | Not read-only: adds contacts from CSV text to a campaign. Not destructive: additive; nothing is sent to the contacts by importing them. Not open-world: stays in the user's workspace. |
| `attach_campaign_mailboxes` | false / false / false | Not read-only: links ready mailboxes to a campaign as senders. Not destructive: additive and repeatable; nothing is sent until launch. Not open-world: stays in the user's workspace. |
| `pause_campaign` | false / false / false | Not read-only: stops a campaign from sending. Not destructive: pausing deletes nothing and keeps contacts, steps and progress; the user resumes the campaign from its page in the web app. Repeat calls have no extra effect. Not open-world: acts on the user's own campaign. |

### Tools that act outside the workspace

| Tool | Values | Justification |
|---|---|---|
| `start_warmup` | false / false / true | Not read-only: starts warm-up for the given mailboxes. Not destructive: it deletes or overwrites nothing. Open-world: warm-up exchanges low-volume emails between the user's mailboxes and mailboxes outside the workspace in a warm-up network. Retrying with the same mailboxes the same day does not start a second operation. |
| `launch_campaign` | false / true / true | See below. |
| `export_mailboxes_to_sequencer` | false / true / true | Not read-only: sends mailbox login credentials (SMTP/IMAP) to the user's own Instantly or Smartlead account, which the user connected in the web app. Destructive: once credentials are in a third-party account they cannot be recalled by this tool. Open-world: it writes to a third-party service. Safeguards: `confirm` is a required parameter and must be true after the user agrees in the chat to share credentials with that sequencer; the tool refuses otherwise. It never shows credentials in the chat. The review workspace simulates it: nothing leaves. |

### `launch_campaign`

This is the text for the held update ("This tool update needs further review before it can go live"). The annotations are accurate; the appeal asks for the human review, not a change of values.

```text
launch_campaign starts sending a campaign's emails to the contacts the user imported into it, from the user's own mailboxes.

readOnlyHint=false: it starts a sending job.
destructiveHint=true: an email that has been sent cannot be unsent. Pausing (pause_campaign) stops further sends, not the ones already delivered.
openWorldHint=true: the recipients are outside the user's workspace.
idempotentHint=true: each launch carries an idempotency key (passed in, or derived from workspace, campaign, limit and date), so a retry does not start a second launch.

Safeguards, all enforced on the server:
1. confirm is a required parameter. Without confirm=true the call is refused with CONFIRMATION_REQUIRED and nothing is sent; the error tells the model to tell the user which campaign will send, to how many contacts and from which mailboxes, and to get an explicit yes. The tool description and the server instructions say the same.
2. Preflight gate: the launch is refused unless preflight_campaign is green (a sequence with at least one step, contacts, attached mailboxes) and every attached mailbox has finished warm-up and is ready to send. The refusal lists the blocking checks.
3. Scope: it only launches a campaign in the workspace the user picked at OAuth sign-in, from that workspace's own mailboxes, to contacts the user imported. It cannot send to arbitrary addresses outside a campaign and cannot change the copy.
4. Optional limit caps how many contacts this launch enrolls.
5. pause_campaign stops sending at any time.

Review workspace: the reviewer account is a sandbox. launch_campaign runs the confirm, preflight and warm-up checks and then returns sandbox: true, status not_sent, without handing the campaign to the sending engine. The seeded mailboxes have no passwords and the contacts are on example.com, so nothing can be delivered.
```
