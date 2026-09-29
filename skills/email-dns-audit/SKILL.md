---
name: email-dns-audit
description: Audits the email DNS of cold email sending domains - SPF, DKIM, DMARC, MX and the custom tracking domain - and returns a pass/fail table per domain with exact record fixes. Counts SPF DNS lookups, checks DKIM key length per sending service, checks DMARC policy, reporting and alignment with the From domain, and compares the setup with the public Google and Yahoo sender requirements. Use when the user shares domains or DNS records, asks why mail goes to spam or fails authentication, sets up new sending domains, or asks to check SPF, DKIM or DMARC.
---

# Email DNS audit for sending domains

You audit the DNS of each sending domain the way a receiving mail server reads it, and return one table per domain with the exact record to add or change. You never guess a record: you read it (or ask the user to paste it) before judging it.

## Step 1. Collect the records

For each domain, get these records. If you cannot run commands, ask the user to run them and paste the output.

```
dig +short TXT example.com                      # SPF lives here (v=spf1 ...)
dig +short TXT _dmarc.example.com               # DMARC
dig +short TXT <selector>._domainkey.example.com  # DKIM, one per selector
dig +short MX example.com
dig +short CNAME track.example.com              # custom tracking domain, if used
```

Without dig, use DNS over HTTPS:

```
curl -s -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=_dmarc.example.com&type=TXT'
```

Also ask: which services send mail as this domain (mailbox provider, sequencer, CRM, helpdesk, newsletter tool), and which DKIM selectors they use. Common selectors: `google`, `selector1`/`selector2` (Microsoft 365), `default`, `k1`, `s1`, `s2`, `dkim`, `mail`. The selector is in the `DKIM-Signature: ... s=` header of a sent message.

## Step 2. Check SPF

1. Exactly one TXT record starting with `v=spf1`. Two SPF records = permerror = SPF fails.
2. Every service that sends as the domain is covered by an `include:`, `ip4:` or `ip6:`.
3. At most 10 DNS lookups in total. Count `include`, `a`, `mx`, `ptr`, `exists`, `redirect`, and the lookups inside each include, recursively. Over 10 = permerror.
4. Ends with `~all` (softfail) or `-all` (fail). `?all` or `+all` = no protection; `+all` lets anyone send as you.
5. No `ptr` mechanism (deprecated, slow).
6. Record under 255 characters per string; longer records are split into quoted strings.

## Step 3. Check DKIM

1. A key exists for each sending service's selector.
2. Key length 2048 bits where the provider supports it (1024 still passes, but is weaker). A `p=` value of roughly 390+ base64 characters is 2048-bit.
3. `p=` is not empty (empty = revoked key).
4. The domain in the signature (`d=`) matches the From domain or its parent, so DMARC can align.

## Step 4. Check DMARC

1. Exactly one TXT record at `_dmarc.<domain>` starting with `v=DMARC1`.
2. Policy `p=`: `none` is fine for the first weeks while you read reports; move to `quarantine`, then `reject`, once all legitimate senders pass. For cold sending domains, `p=none` or `p=quarantine` is common; what matters most is that the record exists and aligns.
3. `rua=mailto:` set, so you receive aggregate reports.
4. Alignment: SPF passes with the envelope (Return-Path) domain, DKIM with `d=`. At least one of them must match the From domain (relaxed alignment = same organizational domain; strict `aspf=s`/`adkim=s` = exact match). No alignment = DMARC fail even when SPF and DKIM pass.

## Step 5. Check MX and tracking

1. MX records exist, so the domain can receive replies and bounces. A domain with no MX looks disposable.
2. If the sequencer uses open or click tracking, the tracking host is a CNAME on your own domain, not the tool's shared domain. Better for cold email: tracking off, no links.
3. The domain has a working website or a redirect to the main site (optional, but a dead domain looks worse).

## Step 6. Compare with public sender requirements

Google and Yahoo require bulk senders to have SPF and DKIM, a DMARC record (at least `p=none`) aligned with the From domain, one-click unsubscribe for marketing mail, and a spam complaint rate below 0.3% (target below 0.1%). Say which of these the domain meets.

## Output format

One table per domain:

| Check | Status | Found | Fix |
|---|---|---|---|
| SPF single record | PASS / FAIL / WARN | the record | exact new record |

Then a list of the exact DNS records to publish (type, host, value), in the order to apply them, and what to re-check after the change (DNS can take up to the record's TTL to update).

## Rules

- Quote records exactly as returned. Do not invent selectors or includes.
- If a check needs information you do not have (for example, which tools send mail), mark it `UNKNOWN` and say what to ask.
- DNS that passes does not mean mail lands in the inbox. Authentication is required, not sufficient. Point the user to an inbox placement test for that.

## Example

Input: `example.com`, sends from Google Workspace and a sequencer. TXT shows `v=spf1 include:_spf.google.com ~all` and `v=spf1 include:sendgrid.net ~all`. No `_dmarc` record.

Output (abridged):

| Check | Status | Found | Fix |
|---|---|---|---|
| SPF single record | FAIL | 2 v=spf1 records | merge: `v=spf1 include:_spf.google.com include:sendgrid.net ~all` |
| DMARC record | FAIL | none | `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:dmarc@example.com` |
| DKIM google | PASS | 2048-bit key | none |
