# TecVooDoo Site — Agent Orientation

**Project:** TecVooDoo studio marketing/portal site at `tecvoodoo.com`.
**Owner:** Rune Duvall (TecVooDoo LLC, sole operator).
**Repo location:** `E:\TecVooDoo\TecVooDooSite\` (this folder).
**Live URL:** https://tecvoodoo.com

## Read these first (in order)

1. **`Documents\TVD_Site_Status.md`** — current state, active TODO, recent session log. Always start here.
2. **`..\Studio\Canonical\Web\INDEX.md`** — Tier-1 canonical for all TVD web work (Standards + Workflow + cross-references). The Status doc carries an Alignment marker; compare against current canonical Revision History before assuming patterns match.
3. **`..\Studio\Canonical\UniversalWorkflow.md`** (via Unity Sandbox path — see Canonical INDEX cross-reference for the actual file: `E:\Unity\Sandbox\Documents\Canonical\UniversalWorkflow.md`) — session bookends, ASCII rule, communication style.

## What this repo is

- **Hand-edited static HTML.** No build tooling. No bundlers. No frameworks. The `site\` folder is what Cloudflare Pages serves verbatim.
- **Pages:** `site\index.html`, `about.html`, `books.html`, `contact.html`, `games.html`, `privacy.html`, plus per-title pages (`encapsulated-fear.html`, `genie-in-a-test-tube.html`) and per-game folders under `site\games\` (`dlyh\`, `dots-and-boxes\`).
- **Backend:** Supabase at `api.tecvoodoo.com` (custom domain) for auth + data (beta reader signups, game data). NOT in this repo.
- **Email:** Cloudflare Worker + Resend pipeline. Worker is at `tecvoodoo-email.runeduvall.workers.dev`. Configured separately, not in this repo.
- **Domains on Cloudflare Registrar** as of 2026-05-29 (tecvoodoo.com, bloodminergame.com, runeduvall.com, stephenmichaelbrandon.com).

## How to deploy

Push to `main` on GitHub (`github.com/TecVooDoo/tecvoodoo.git`). Cloudflare Pages auto-deploys from `main` in ~1-2 min.

A pre-commit hook at `.githooks/pre-commit` updates the footer-date span (`<span class="footer-updated">Updated: ...</span>`) on every production HTML file. Hook is activated via `git config core.hooksPath .githooks` (already set on the working copy).

## Critical conventions (these survive without you remembering them — but here for orientation)

- **ASCII-only in source.** No smart quotes, em-dashes, or unicode. HTML entities like `&copy;` are fine.
- **`supabaseClient` is the Supabase JS variable name.** NEVER `supabase` (shadows the global SDK namespace from the CDN script).
- **Process OAuth hash tokens manually** at init — the SDK doesn't always pick them up across redirect flows. See Standards § OAuth Token Handling.
- **`.maybeSingle()` over `.single()`** when row existence is conditional.
- **Update UI before database ops in auth flows.** Never `await` database operations inside `onAuthStateChange`.
- **Dynamic modals** — create on demand, remove on dismiss. iOS Safari quirks with `position: fixed` on hidden elements.
- **Test on real mobile devices.** DevTools emulation misses iOS-specific issues.

All the above is canonical — `..\Studio\Canonical\Web\TecVooDoo_Web_Standards.md` is authoritative.

## Workspace context

This repo is opened as a subfolder of the wider TVD workspace at `E:\TecVooDoo\`. The Claude/MCP configuration (`.claude\`, `.mcp.json`) lives at the workspace root, not in this repo. Open VSCode at `E:\TecVooDoo\` for studio-wide scope; this repo is the `TecVooDooSite\` subfolder from there.

To do site-specific git work from the studio-scope workspace:
```
git -C TecVooDooSite status
git -C TecVooDooSite add ...
git -C TecVooDooSite commit -m "..."
git -C TecVooDooSite push
```

Or open VSCode at this repo directly for a focused site-only session (no MCP, no studio-wide memory).

## What lives where (key paths)

| Path | Purpose |
|---|---|
| `site\` | All production HTML/CSS/JS — what Cloudflare Pages serves |
| `site\css\style.css` | Theme + responsive styles |
| `site\images\` | Site assets |
| `site\games\` | Per-game subdirs (`dlyh\` iframe wrapper, `dots-and-boxes\` native game) |
| `site\_redirects` | Cloudflare Pages routing |
| `Documents\TVD_Site_Status.md` | Current project state, active work, session log |
| `Documents\Archives\` | Historical TV_* and Supabase_* design docs (v1-v8, Dec 2025 - Jan 2026) — reference only, not active |
| `.githooks\pre-commit` | Footer-date auto-update hook |
| `.gitignore` | Excludes `tmpclaude-*`, `.claude/`, `.mcp.json` |

## When in doubt

- Project-specific question → `Documents\TVD_Site_Status.md`
- Code pattern / convention question → `..\Studio\Canonical\Web\TecVooDoo_Web_Standards.md`
- Deploy / infrastructure question → `..\Studio\Canonical\Web\TecVooDoo_Web_Workflow.md`
- Studio-wide context → `..\Studio\INDEX.md` (orientation), `..\Studio\Inventory\TecVooDoo_Projects.csv` (portfolio)
- Marketing direction → `..\TecVooDooMarketing\TVD_MarketingStrategy.md`

## What this CLAUDE.md does NOT cover

- Beta reader system implementation details — see Status doc
- DLYH iframe wrapper specifics — see Status doc
- Dots and Boxes architecture — see `..\Games\4 Playtesting\Dots and Boxes\Documents\DAB_Status.md`
- C# / Unity work — out of scope for this repo. Unity work lives at `E:\Unity\`
- Books / writing — separate projects under `..\Writing\` (each book has its own Documents folder)

---

*v1.0 · 2026-05-30 · Created as part of TVD studio reorg Phase 8.*
