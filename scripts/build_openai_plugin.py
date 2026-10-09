#!/usr/bin/env python3
"""Build and check the OpenAI plugin package (ChatGPT and Codex Plugins Directory).

Sources:
  openai-plugin/plugin.json   Agent Plugins manifest with extensions.com.openai
  openai-plugin/mcp.json      remote MCP server (Streamable HTTP)
  skills/                     the same skills as the Claude and Cursor plugins
  assets/logo.png             listing icon and composer icon

Output:
  dist/openai-plugin/                     the package folder
  dist/outreach2day-openai-<version>.zip  the ZIP to upload at platform.openai.com/plugins

Usage:
  python3 scripts/build_openai_plugin.py [--zip-out PATH] [--check-only]

The checks follow the package and final-submission rules in
https://developers.openai.com/plugins/deploy/submission and
https://developers.openai.com/plugins/deploy/submission-errors.
Standard library only.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import struct
import sys
import unicodedata
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "openai-plugin"
DIST = ROOT / "dist"
PKG = DIST / "openai-plugin"

PLUGIN_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
MCP_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json"
MCP_URL = "https://public.outreach2day.com/mcp"

CATEGORIES = {
    "Productivity", "Creativity", "Developer Tools", "Business & Operations", "Data & Analytics",
    "Communication", "Education & Research", "Security", "Finance", "Healthcare", "Travel",
    "Entertainment", "Other",
}
PLUGIN_ROOT_KEYS = {"$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"}
OPENAI_KEYS = {"interface", "onboardingSkill", "review", "publication", "id"}
INTERFACE_KEYS = {
    "displayName", "shortDescription", "longDescription", "developerName", "category", "capabilities",
    "websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL", "defaultPrompt", "brandColor",
    "brandColorDark", "composerIcon", "composerIconDark", "logo", "logoDark", "screenshots",
}
REVIEW_KEYS = {"test_cases", "demo_recording_url", "commerce", "commerce_description"}
CASE_KEYS = {"description", "prompt", "tools_triggered", "expected_behavior", "file_attachment_urls", "expected_output_url"}
FORBIDDEN_KEYS = {"test_credentials", "reviewer_instructions", "apps", "hooks"}

# Tools the server lists for OpenAI clients (profile "openai", backend src/api/mcp/profiles.py).
OPENAI_PROFILE_TOOLS = {
    "check_copy", "get_account_status", "list_domains", "list_mailboxes", "get_warmup_status",
    "list_sequencers", "preflight_campaign", "get_campaign_stats", "list_replies", "connect_own_domains",
    "start_warmup", "create_campaign", "upsert_campaign_step", "import_campaign_contacts",
    "attach_campaign_mailboxes", "pause_campaign", "launch_campaign", "export_mailboxes_to_sequencer",
}

# The server hides prices and ordering from OpenAI clients, so the packaged
# capacity planner works from the user's own prices. Each anchor must match the
# canonical skill exactly; the build fails when the skill text changes.
SKILL_PATCHES = {
    "cold-email-capacity-planner": [
        (
            "Ask for the user's vendor prices. If they have none, use Outreach2day list prices as an example and say so:\n"
            "\n"
            "- Mailbox: $2.50 per mailbox per month, warm-up and sending included.\n"
            "- Domain: about $13 a year for .com, about $5 a year for .info.\n",
            "Ask for the user's vendor prices: the price per mailbox per month and the price per domain per year. "
            "If they have none, leave the cost table out, give the plan and the timeline, and say that the cost is "
            "mailboxes_total x the monthly mailbox price plus domains x the yearly domain price.\n",
        ),
        (
            "- Cost at $2.50 per mailbox: $345 a month. 28 .com domains at $13: $364 a year.\n",
            "- Cost: 138 x the monthly mailbox price, plus 28 x the yearly domain price.\n",
        ),
    ],
}

SECRET_PATTERNS = [
    re.compile(r"(?i)password\s*[:=]\s*\S{6,}"),
    re.compile(r"\bsk-[A-Za-z0-9]{16,}"),
    re.compile(r"\bo2d_[A-Za-z0-9]{16,}"),
    re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
]

errors: list[str] = []


def err(msg: str) -> None:
    errors.append(msg)


def text_ok(value: object, field: str, limit: int, single_line: bool = True) -> None:
    if not isinstance(value, str) or not value.strip():
        err(f"{field}: required, non-empty string")
        return
    if len(value) > limit:
        err(f"{field}: {len(value)} characters, limit {limit}")
    for ch in value:
        if ch == "\n" and not single_line:
            continue
        if unicodedata.category(ch) in {"Cc", "Cf", "Zl", "Zp"}:
            err(f"{field}: unsupported character U+{ord(ch):04X}")
            break


def https_ok(value: object, field: str, limit: int = 1024) -> None:
    if not isinstance(value, str) or not re.match(r"^https://[^/@\s]+(/\S*)?$", value) or len(value) > limit:
        err(f"{field}: must be an HTTPS URL without credentials, at most {limit} characters")


def contrast(hex_a: str, hex_b: str) -> float:
    def lum(h: str) -> float:
        def chan(c: float) -> float:
            return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        r, g, b = (int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
        return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)
    hi, lo = sorted((lum(hex_a), lum(hex_b)), reverse=True)
    return (hi + 0.05) / (lo + 0.05)


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as fh:
        head = fh.read(24)
    if head[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")
    return struct.unpack(">II", head[16:24])


def check_asset(rel: object, field: str, base: Path) -> None:
    if not isinstance(rel, str) or not rel.startswith("./") or ".." in rel.split("/"):
        err(f"{field}: must be a ./-prefixed path inside the plugin")
        return
    path = base / rel[2:]
    if not path.is_file():
        err(f"{field}: {rel} is missing")
        return
    if path.stat().st_size > 5 * 1024 * 1024:
        err(f"{field}: larger than 5 MiB")
    try:
        w, h = png_size(path)
    except ValueError:
        err(f"{field}: only PNG is checked here; {rel} is not a PNG")
        return
    if w != h or w < 48 or w > 4096:
        err(f"{field}: {w}x{h}; must be square, 48 to 4096 px")


def check_manifest(manifest: dict, base: Path) -> None:
    extra = set(manifest) - PLUGIN_ROOT_KEYS
    if extra:
        err(f"plugin.json: keys not in the Agent Plugins schema: {sorted(extra)}")
    if manifest.get("$schema") != PLUGIN_SCHEMA:
        err("plugin.json: $schema must be " + PLUGIN_SCHEMA)
    name = manifest.get("name", "")
    if not re.fullmatch(r"[a-z0-9]+(-[a-z0-9]+)*", name or "") or len(name) > 64:
        err("name: lowercase letters, digits and single hyphens, at most 64 characters")
    if not re.fullmatch(r"\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?", manifest.get("version", "")):
        err("version: semantic version required")
    text_ok(manifest.get("description"), "description", 1024, single_line=False)
    author = manifest.get("author") or {}
    text_ok(author.get("name"), "author.name", 120)
    if "url" in author:
        https_ok(author["url"], "author.url", 2048)
    if "homepage" in manifest:
        https_ok(manifest["homepage"], "homepage", 2048)

    openai = (manifest.get("extensions") or {}).get("com.openai")
    if not isinstance(openai, dict):
        err("extensions.com.openai: required object")
        return
    for key in FORBIDDEN_KEYS & set(openai):
        err(f"extensions.com.openai.{key}: not allowed in a directory submission ZIP")
    extra = set(openai) - OPENAI_KEYS
    if extra:
        err(f"extensions.com.openai: unknown keys {sorted(extra)}")

    ui = openai.get("interface") or {}
    extra = set(ui) - INTERFACE_KEYS
    if extra:
        err(f"interface: unknown keys {sorted(extra)}")
    text_ok(ui.get("displayName"), "interface.displayName", 30)
    text_ok(ui.get("shortDescription"), "interface.shortDescription", 30)
    text_ok(ui.get("longDescription"), "interface.longDescription", 4000, single_line=False)
    text_ok(ui.get("developerName"), "interface.developerName", 80)
    if ui.get("category") not in CATEGORIES:
        err(f"interface.category: must be one of {sorted(CATEGORIES)}")
    caps = ui.get("capabilities", [])
    if not isinstance(caps, list) or len(caps) > 20:
        err("interface.capabilities: list of at most 20")
    for n, cap in enumerate(caps):
        text_ok(cap, f"interface.capabilities[{n}]", 120)
    for field in ("websiteURL", "supportURL", "privacyPolicyURL", "termsOfServiceURL"):
        https_ok(ui.get(field), f"interface.{field}")
    prompts = ui.get("defaultPrompt", [])
    prompts = [prompts] if isinstance(prompts, str) else prompts
    if len(prompts) > 3:
        err("interface.defaultPrompt: at most 3")
    seen = set()
    for n, prompt in enumerate(prompts):
        text_ok(prompt, f"interface.defaultPrompt[{n}]", 128)
        key = " ".join(unicodedata.normalize("NFKC", prompt).split()).casefold()
        if key in seen:
            err(f"interface.defaultPrompt[{n}]: duplicate")
        seen.add(key)
        if "@" in prompt:
            err(f"interface.defaultPrompt[{n}]: no @mentions")
    if "brandColor" in ui and contrast(ui["brandColor"], "#FFFFFF") < 2:
        err("interface.brandColor: needs 2:1 contrast against white")
    if "brandColorDark" in ui and contrast(ui["brandColorDark"], "#212121") < 2:
        err("interface.brandColorDark: needs 2:1 contrast against #212121")
    for field in ("brandColor", "brandColorDark"):
        if field in ui and not re.fullmatch(r"#[0-9A-Fa-f]{6}", ui[field]):
            err(f"interface.{field}: six-digit hex color")
    for field in ("logo", "composerIcon", "logoDark", "composerIconDark"):
        if field in ui or field in ("logo", "composerIcon"):
            check_asset(ui.get(field), f"interface.{field}", base)
    if ui.get("screenshots"):
        err("interface.screenshots: allowed only when the MCP server returns UI; this server has none")

    review = openai.get("review") or {}
    extra = set(review) - REVIEW_KEYS
    if extra:
        err(f"review: unknown keys {sorted(extra)}")
    cases = review.get("test_cases") or {}
    positive, negative = cases.get("positive", []), cases.get("negative", [])
    if len(positive) != 5 or len(negative) != 3:
        err(f"review.test_cases: need exactly 5 positive and 3 negative, have {len(positive)} and {len(negative)}")
    for kind, items in (("positive", positive), ("negative", negative)):
        for n, case in enumerate(items):
            where = f"review.test_cases.{kind}[{n}]"
            extra = set(case) - CASE_KEYS
            if extra:
                err(f"{where}: unknown keys {sorted(extra)}")
            text_ok(case.get("description"), f"{where}.description", 4000, single_line=False)
            text_ok(case.get("prompt"), f"{where}.prompt", 4000, single_line=False)
            if kind == "positive":
                text_ok(case.get("tools_triggered"), f"{where}.tools_triggered", 4000)
                text_ok(case.get("expected_behavior"), f"{where}.expected_behavior", 4000, single_line=False)
                tools = {t.strip() for t in str(case.get("tools_triggered", "")).split(",")}
                unknown = tools - OPENAI_PROFILE_TOOLS
                if unknown:
                    err(f"{where}.tools_triggered: not listed for OpenAI clients: {sorted(unknown)}")
    if "demo_recording_url" in review:
        https_ok(review["demo_recording_url"], "review.demo_recording_url", 2048)
    if not isinstance(review.get("commerce", False), bool):
        err("review.commerce: boolean")
    publication = openai.get("publication") or {}
    if "countries" in publication and not all(re.fullmatch(r"[A-Z]{2}", c) for c in publication["countries"]):
        err("publication.countries: uppercase country codes")


def check_mcp(config: dict) -> None:
    if config.get("$schema") != MCP_SCHEMA:
        err("mcp.json: $schema must be " + MCP_SCHEMA)
    if set(config) - {"$schema", "mcpServers"}:
        err("mcp.json: only $schema and mcpServers")
    servers = config.get("mcpServers") or {}
    if len(servers) != 1:
        err("mcp.json: exactly one MCP server (review test cases are plugin-level)")
    for name, server in servers.items():
        if set(server) - {"type", "url", "headers"}:
            err(f"mcp.json {name}: only type, url, headers")
        if server.get("type") != "streamable-http" or server.get("url") != MCP_URL:
            err(f"mcp.json {name}: must be streamable-http at {MCP_URL}")
        if server.get("headers"):
            err(f"mcp.json {name}: no headers; the server uses OAuth")


def parse_frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---", 4)
    if end < 0:
        return {}
    out = {}
    for line in text[4:end].splitlines():
        if ":" in line and not line.startswith((" ", "\t")):
            key, _, value = line.partition(":")
            out[key.strip()] = value.strip().strip('"').strip("'")
    return out


def check_skills(base: Path, plugin_name: str) -> list[str]:
    names = []
    for skill_dir in sorted((base / "skills").iterdir()):
        if not skill_dir.is_dir():
            err(f"skills/{skill_dir.name}: files directly under skills/ are ignored")
            continue
        if skill_dir.name.startswith("."):
            err(f"skills/{skill_dir.name}: hidden directory")
        manifest = skill_dir / "SKILL.md"
        if not manifest.is_file():
            err(f"skills/{skill_dir.name}: SKILL.md missing")
            continue
        text = manifest.read_text(encoding="utf-8")
        meta = parse_frontmatter(text)
        name, desc = meta.get("name", ""), meta.get("description", "")
        if not name or not desc:
            err(f"skills/{skill_dir.name}: front matter needs name and description")
        if len(desc) > 1024:
            err(f"skills/{skill_dir.name}: description over 1024 characters")
        if len(f"{plugin_name}:{name}") > 64:
            err(f"skills/{skill_dir.name}: plugin:skill identity over 64 characters")
        if re.search(r"\bClaude\b", text):
            err(f"skills/{skill_dir.name}: refers to Claude; use provider-neutral wording")
        if re.search(r"\$\d", text):
            err(f"skills/{skill_dir.name}: mentions prices; the OpenAI profile hides pricing")
        names.append(name)
    if len(set(names)) != len(names):
        err("skills: duplicate skill names")
    return names


def scan_secrets(base: Path) -> None:
    for path in base.rglob("*"):
        if path.is_file() and path.suffix in {".json", ".md", ".yaml", ".yml", ".txt"}:
            text = path.read_text(encoding="utf-8")
            for pattern in SECRET_PATTERNS:
                if pattern.search(text):
                    err(f"{path.relative_to(base)}: looks like a secret ({pattern.pattern})")


def stage() -> None:
    if PKG.exists():
        shutil.rmtree(PKG)
    (PKG / "assets").mkdir(parents=True)
    shutil.copy2(SRC / "plugin.json", PKG / "plugin.json")
    shutil.copy2(SRC / "mcp.json", PKG / "mcp.json")
    shutil.copy2(ROOT / "assets" / "logo.png", PKG / "assets" / "logo.png")
    shutil.copytree(ROOT / "skills", PKG / "skills", ignore=shutil.ignore_patterns(".*"))
    for skill, patches in SKILL_PATCHES.items():
        path = PKG / "skills" / skill / "SKILL.md"
        text = path.read_text(encoding="utf-8")
        for old, new in patches:
            if text.count(old) != 1:
                sys.exit(f"build: anchor not found once in skills/{skill}/SKILL.md; update SKILL_PATCHES:\n{old}")
            text = text.replace(old, new)
        path.write_text(text, encoding="utf-8")


def write_zip(version: str, extra_out: Path | None) -> Path:
    out = DIST / f"outreach2day-openai-{version}.zip"
    files = sorted(p for p in PKG.rglob("*") if p.is_file())
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for path in files:
            info = zipfile.ZipInfo(path.relative_to(PKG).as_posix(), date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o644 << 16
            zf.writestr(info, path.read_bytes())
    if extra_out:
        extra_out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(out, extra_out)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--zip-out", type=Path, help="also copy the ZIP here")
    parser.add_argument("--check-only", action="store_true", help="stage and check, write no ZIP")
    args = parser.parse_args()

    stage()
    manifest = json.loads((PKG / "plugin.json").read_text(encoding="utf-8"))
    check_manifest(manifest, PKG)
    check_mcp(json.loads((PKG / "mcp.json").read_text(encoding="utf-8")))
    skills = check_skills(PKG, manifest.get("name", ""))
    scan_secrets(PKG)
    if errors:
        print("FAILED", *errors, sep="\n  - ")
        return 1
    print(f"ok: {manifest['name']} {manifest['version']}, skills: {', '.join(skills)}")
    if not args.check_only:
        out = write_zip(manifest["version"], args.zip_out)
        print(f"zip: {out}" + (f"\ncopy: {args.zip_out}" if args.zip_out else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
