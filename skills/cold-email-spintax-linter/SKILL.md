---
name: cold-email-spintax-linter
description: Lints cold email spintax and merge variables before a campaign goes live. Catches options that mash words together when the sending tool trims spaces, empty options, broken or nested braces, merge variables with fallbacks placed inside single-brace spintax, nested fallbacks, and templates that break when a lead field is empty. Renders sample emails with filled and empty fields. Use when the user pastes a subject line, email body or sequence with {a|b} or {{RANDOM|a|b}} spintax, or asks to check, validate, fix or preview spintax.
---

# Cold email spintax linter

You check spintax templates for cold email the way a sending engine will render them, report every problem with its exact location, and propose a fixed template. You never ship a template you have not rendered.

## Step 1. Detect the syntax

Ask which sending tool the user uses if it is not obvious. Two syntaxes are common:

| Syntax | Example | Where |
|---|---|---|
| Double-brace | `{{RANDOM\|Hi\|Hello}} {{firstName}}` | Instantly and tools that copy its format |
| Single-brace | `{Hi\|Hello} {{first_name}}` | Most other sequencers and many in-house engines |

Merge variables are `{{name}}` in both. Check the exact variable names against the columns of the user's lead file (case matters: `firstName` and `first_name` are different fields). A variable the engine does not know usually renders as an empty string, silently.

## Step 2. Run the checks

Report each finding as `ERROR` (will break renders) or `WARN` (renders, but risky), with the line and the offending fragment.

ERROR:

1. **Unbalanced braces.** Every `{` or `{{` has a matching close. Count them per line.
2. **Edge whitespace in an option.** Many engines trim leading and trailing spaces from every option at render time. `{{RANDOM| quick| short}} note` renders as `quicknote`. A word join must be literal text between two blocks (`{{RANDOM|quick|short}} note`), never a space at the edge of an option.
3. **Empty option.** `{a||b}` or `{a|}`: some engines drop it, some render nothing and leave double spaces. Offer a shorter complete option instead.
4. **Nested single-brace spintax.** `{Hi {there|all}|Hello}`: single-brace engines usually support one level only. Flatten into complete options: `{Hi there|Hi all|Hello}`.
5. **Fallback pipe inside single-brace spintax.** `{Hi {{first_name|there}}|Hello}`: the `|` of the fallback is read as an option separator and splits the block. Use a bare variable inside spintax (`{Hi {{first_name}}|Hello}`) and handle empty fields at import (see step 4).
6. **Nested fallback.** `{{firstName|{{companyName|there}}}}` does not resolve recursively on most engines; the raw inner tag ships. Use one level: `{{firstName|there}}`.
7. **Unknown variable.** Any `{{var}}` that is not a column in the lead file (or a sender variable the tool documents).

WARN:

8. A variable without a fallback on a double-brace engine (`{{companyName}}` with no `|your team`), when the lead file has empty values in that column.
9. The same variable twice in one sentence, or the company name more than once in the email.
10. An option that changes the meaning of the sentence (e.g. one option asks a question, another states a fact) so some renders read badly.
11. Punctuation that dangles when a field is empty: `Hi ,`, `owner -`, `, at`.
12. A link, URL or bare domain in any option (auto-linked by mail clients; treat as a spam signal in cold email).

## Step 3. Render

Render at least 8 samples in two modes and show them:

- **Filled:** every variable has a realistic value.
- **Empty:** every variable is empty, so only fallbacks and literal text remain.

Then render the same random path with every option trimmed of edge spaces. If the trimmed render differs from the normal render by even one character, that is an ERROR (check 2).

Count the distinct renders (product of option counts per block, ignoring variables) and report it. For subject lines at high volume, more distinct renders is better, but every render must be a subject a person would actually write.

## Step 4. Fix and hand back

Return:

1. A findings table: severity, location, fragment, why it breaks, fix.
2. The corrected template in the user's syntax.
3. The sample renders of the corrected template (filled and empty).
4. Data advice when fallbacks are not supported: remove or suppress leads with empty `first_name` or `company` before import instead of relying on the template.

## Rules

- Do not change the user's wording beyond what a fix needs. If you suggest copy improvements, list them separately.
- Do not claim a template is clean without showing renders.
- The sending tool's own preview or test send is the final check. Tell the user to send one test email per template to a mailbox they own and read the rendered subject and body, because preview screens sometimes show raw spintax in the subject.

## Example

Input:

```
Subject: {{RANDOM|quick| short}} question, {{firstName|{{companyName|there}}}}
Body: {Hi {{first_name|there}}|Hello},
```

Output (abridged):

| Severity | Where | Fragment | Fix |
|---|---|---|---|
| ERROR | subject | `\| short` | remove the leading space: `{{RANDOM\|quick\|short}}` |
| ERROR | subject | `{{firstName\|{{companyName\|there}}}}` | one level: `{{firstName\|there}}` |
| ERROR | body | `{{first_name\|there}}` inside `{...}` | bare variable inside spintax: `{Hi {{first_name}}\|Hello},` and drop leads without a first name |

Fixed subject: `{{RANDOM|quick|short}} question, {{firstName|there}}`
