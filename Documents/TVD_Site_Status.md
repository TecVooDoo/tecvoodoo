# TecVooDoo Web Infrastructure - Project Status

**Project:** TecVooDoo Website + Supabase Backend + Cloudflare Services
**Developer:** TecVooDoo LLC / Rune (Stephen Brandon)
**Platform:** Web (HTML5/CSS/JavaScript) + Supabase + Cloudflare
**Source:** `E:\TecVooDoo\TecVooDooSite`
**Live URL:** https://tecvoodoo.com
**Document Version:** 5
**Last Updated:** May 30, 2026

---

## Canonical References

This project follows the universal web rules in:

- [TecVooDoo_Web_Standards.md](../../Studio/Canonical/Web/TecVooDoo_Web_Standards.md) (aligned to v1.0 / 2026-05-22)
- [TecVooDoo_Web_Workflow.md](../../Studio/Canonical/Web/TecVooDoo_Web_Workflow.md) (aligned to v1.0 / 2026-05-22)

Cross-domain:

- [UniversalWorkflow.md](file:///E:/Unity/Sandbox/Documents/Canonical/UniversalWorkflow.md) (aligned to v1.5 / 2026-05-22)

Code patterns, bug patterns to avoid, deployment pipeline, OAuth setup details, and ops gotchas all live in the canonical docs. This doc holds project state only.

---

## Quick Context

**What is this?** The TecVooDoo web infrastructure: a static marketing/portal site at `tecvoodoo.com`, the Supabase backend at `api.tecvoodoo.com` (auth + game/beta-reader data), and the Cloudflare services that glue it all together (Pages hosting, DNS, an email Worker via Resend). This is the shared foundation for all TecVooDoo web games and the books-side audience funnel.

**Current Phase:** Live / Maintenance

**Last Session (2026-05-30, PM):** Resend API key leak remediation. GitGuardian flagged a live Resend API key committed during the AM reorg -- the doc migration swept in `Documents/Archives/ResendAPI.txt` (a plaintext credentials file) in commit `816306b`. Revoked + rotated the key (new key deployed to the email Worker secret `RESEND_API_KEY`, redeploy verified by a real 200 send through the Dots and Boxes invite), then purged the file from all git history (`filter-branch`) and force-pushed `main` (`50a5eb9` -> `64f151c`); `origin/main` verified clean of the file and key string. Confirmed beta-reader signups are fully retired -- the DAB "Email a friend" invite is now the ONLY consumer of the Resend Worker. The contact form uses `mailto:` and never touched Resend. No site code changes. Caveat: GitHub may keep the old commit reachable by direct SHA in cache until its own GC; inert since the key is revoked. Follow-ups on Active TODO.

**Prior session (2026-05-30, AM):** TVD studio reorg + doc-system buildout. No site code changes. Triggered by a cold-start failure earlier the same day: Rune opened a fresh chat to continue Cloudflare work, and the new agent couldn't recover state from memory alone — Status doc wasn't doing its job. Outcome: (1) Flat TVD studio structure replacing the nested `Projects\` collar; site repo at `TecVooDooSite\` now a subfolder of the studio root, with workspace-level `.claude\` + `.mcp.json` at `E:\TecVooDoo\`. (2) Repo gained `CLAUDE.md` at root + `Documents\` (this Status doc, renamed from `TecVooDoo_Web_Status.md`) + `Documents\Archives\` (49 archived TV_*/Supabase_* design docs flattened from the old nested location). (3) Canonical layer relocated to `Studio\Canonical\Web\`, gained 4 new Tier 2 PerProject_* docs (DocSystem spec, StatusTemplate, Adoption Prompt, MCP Brief). (4) Studio orientation doc at `Studio\INDEX.md`. (5) Cloudflare work that triggered this session was NOT done — still on the Active TODO list as it was at start.

**Pre-session backstory (2026-05-22):** Post-crash recovery (C: drive crashed earlier that day) and large documentation cleanup. Restored MCP server connectivity (Cloudflare 503 incident plus zombie mcp-remote process cleanup), fixed `safe.directory` git config that was lost with the C: drive, refreshed all production footers, and built out the new `Canonical/Web/` doc layer to dedupe rules triplicated across `TecVooDoo_AI_Rules.md`, this Status doc, and DAB_Status.md.

---

## Active TODO

### Immediate
- [ ] Add secret-scanning (`gitleaks`) + a `*API*.txt` / `*.key` / `.env` ignore rule to `.githooks/pre-commit` -- would have caught the `ResendAPI.txt` leak before it pushed
- [ ] Resolve the GitGuardian Resend alert in the dashboard (now that the key is revoked)
- [ ] Rotate + scrub the older **ElevenLabs API key** flagged in `TecVooDoo/M3AnimatedSeries` (GitGuardian alert 2026-05-11, still open)
- [ ] Move Supabase migrations into a version-controlled folder (currently SQL Editor only)
- [ ] Newsletter subscription: replace `mailto:updates+subscribe@tecvoodoo.com` placeholders with a Supabase-backed signup

### Soon
- [ ] Add analytics (Plausible or Fathom)
- [ ] Discord OAuth provider
- [ ] Player statistics and history pages

### Future
- [ ] Leaderboards per game
- [ ] Friend lists
- [ ] Tournaments
- [ ] Player avatars

---

## What Works (Completed Features)

**Website:**
- Static HTML/CSS at `site/` (dark tech aesthetic, mobile-responsive)
- Pages: index, games, books, about, contact, privacy
- Per-title book pages: encapsulated-fear, genie-in-a-test-tube
- Beta reader signup system (used by M3 / "Murder, Malady and Monsters" via a modal on each book page)
- Dynamic image lightbox (iOS-compatible)
- DLYH iframe wrapper (`games/dlyh/index.html`) provides unified auth around the Unity build

**Supabase Backend:**
- Custom domain `api.tecvoodoo.com`
- Auth providers: Google OAuth, Facebook OAuth, Magic Link, Anonymous
- Tables (all RLS-enabled): `players`, `game_types`, `game_sessions`, `session_players`, `matchmaking_queue`, `beta_readers`, plus legacy `games` (pending migration off)
- Reserved player ID for The Executioner AI: `00000000-0000-0000-0000-000000000001`
- Realtime WebSocket sync on game sessions

**Cloudflare Services:**
- Pages hosting with auto-deploy from `main`
- DNS management for `tecvoodoo.com` + subdomains
- Email Worker at `tecvoodoo-email.runeduvall.workers.dev` (Resend-backed, supports game-invite and beta-reader notification payloads)
- SSL/HTTPS via Universal SSL

---

## What Doesn't Work / Known Issues

- **No analytics.** Flying blind on traffic. Plausible or Fathom is in Soon list.
- **Newsletter subscription is `mailto:`-based.** Placeholder until a real signup flow lands. Footer Subscribe buttons across all pages currently open the user's mail client.
- **Manual beta reader management.** Signup persists to Supabase; the follow-up (Drive folder, ARC distribution) is manual. Acceptable for current scale.
- **Legacy `games` table.** Still in use for DAB; migration to the unified `game_sessions` + `session_players` shape is pending.
- **No version-controlled migration history.** Supabase migrations live only in the SQL Editor. Listed in Immediate.

---

## Architecture

### Technology Stack

| Layer | Technology | Details |
|-------|------------|---------|
| Hosting | Cloudflare Pages | Auto-deploy from `site/` on push to `main` |
| DNS | Cloudflare | `tecvoodoo.com` and subdomains |
| Backend | Supabase Pro ($25/mo) | Custom domain `api.tecvoodoo.com` |
| Email | Cloudflare Worker + Resend | `tecvoodoo-email.runeduvall.workers.dev` |
| Auth | Supabase Auth | Google, Facebook, Magic Link, Anonymous |
| Database | PostgreSQL 17 (Supabase) | RLS enabled on every table |
| Realtime | Supabase Realtime | WebSocket for game state |

Infra IDs, OAuth setup, and Worker payload shapes live in [TecVooDoo_Web_Workflow.md](../../Studio/Canonical/Web/TecVooDoo_Web_Workflow.md).

### File Structure

```
E:\TecVooDoo\TecVooDooSite\
  .git/                                # GitHub: TecVooDoo/tecvoodoo
  .gitignore
  .githooks/pre-commit                 # Auto-update footer dates on commit
  CLAUDE.md                            # Agent orientation for the site repo (added 2026-05-30)
  Documents/                           # Per-project doc folder (added 2026-05-30)
    TVD_Site_Status.md                 # This doc
    Archives/                          # 49 historical TV_*/Supabase_* design docs (v1-v8, Dec 2025 - Jan 2026)
  site/                                # Cloudflare Pages serves this directory
    index.html
    about.html, books.html, contact.html, games.html, privacy.html
    encapsulated-fear.html
    genie-in-a-test-tube.html
    auth-test.html                     # internal auth testing page (no footer)
    css/style.css
    images/
    games/
      dlyh/index.html                  # iframe wrapper around Unity DLYH build
      dots-and-boxes/index.html        # DAB game (see DAB_Status.md)
    _redirects                         # routing / subdomain handling
    robots.txt
    sitemap.xml
```

**Workspace config** (`.claude\`, `.mcp.json`) lives at the studio root `E:\TecVooDoo\`, not in this repo. The MCP topology (Supabase + 8 Cloudflare servers + Discord) is studio-wide. See [PerProject_MCP_Brief.md](../../Studio/Canonical/Web/PerProject_MCP_Brief.md).

### External Dashboards

| Service | URL |
|---------|-----|
| Cloudflare (Pages + Workers + DNS) | https://dash.cloudflare.com |
| Supabase Dashboard | https://supabase.com/dashboard/project/eenuxdjmsibcfhzgtslx |
| Google Cloud Console (OAuth) | https://console.cloud.google.com/ |
| Meta Developer Console (FB OAuth) | https://developers.facebook.com/apps/1952579931987351/ |
| Resend (email) | https://resend.com/emails |
| GitHub Repo | https://github.com/TecVooDoo/tecvoodoo |

---

## Beta Reader System

A book-side audience funnel. Used by Murder, Malady and Monsters (M3) for ARC distribution.

### Flow

```
User reads book page (e.g., encapsulated-fear.html)
  -> Clicks "Sign Up as Beta Reader" (modal opens)
    -> Submits name + email
      -> Insert into Supabase beta_readers table
        -> Cloudflare Worker sends notification email via Resend
          -> Author manually sets up Drive folder + adds reader
```

### Schema

```sql
CREATE TABLE beta_readers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL,
    name text,
    book_title text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX beta_readers_email_book_unique
    ON beta_readers (email, book_title);
```

Duplicate signups (same email + same book) surface as PostgreSQL error 23505; the client handles this with a "you're already signed up" message.

---

## Cross-Project Reference

- **All TecVooDoo projects:** `E:\TecVooDoo\Studio\Inventory\TecVooDoo_Projects.csv`
- **Related Status docs:**
  - [DAB_Status.md](../../../Games/4%20Playtesting/Dots%20and%20Boxes/Documents/DAB_Status.md) -- Dots and Boxes game (uses this infrastructure)
  - DLYH (Unity project, separate doc tree under `E:\Unity\DLYH\`; the iframe wrapper page is owned here)

---

## Recent Session History

### 2026-05-30 (PM) -- Resend API key leak remediation
- **Triggered by:** a GitGuardian email ("[TecVooDoo/tecvoodoo] Resend API Key exposed on GitHub", pushed 2026-05-30 13:00:54 UTC). The AM reorg's doc migration had committed `Documents/Archives/ResendAPI.txt` -- a one-line plaintext file holding the live Resend key `re_STPmUe7R...` -- in commit `816306b`.
- **Diagnosis:** the key was tracked in exactly one commit; no other credential files or secrets in the repo. The contact form (`contact.html`) is `mailto:`-based and never used Resend. Beta-reader signups (the original Resend justification) are fully retired -- grep finds no `beta_readers` UI anywhere in `site/`. The **only** live consumer of the Worker is the Dots and Boxes "Email a friend" invite ([games/dots-and-boxes/index.html:2764](../site/games/dots-and-boxes/index.html#L2764)).
- **Remediation:** (1) created a new Resend key + revoked the old `re_STPmUe7R...`; (2) rotated the Cloudflare Worker secret `RESEND_API_KEY` and redeployed (`tecvoodoo-email`, script version `e1315631`); (3) verified via Workers observability -- a real DAB invite produced `POST / -> 200`; (4) purged `ResendAPI.txt` from all history with `git filter-branch`, force-pushed `main` (`50a5eb9` -> `64f151c`), pruned local orphans; (5) confirmed `origin/main` carries zero references to the file or key string.
- **Caveat:** GitHub may still serve the old commit `816306b` by direct SHA from cache until its own GC runs; the key is revoked so that copy is inert. Full eviction would need a GitHub Support GC request -- not worth it.
- **Permissions note:** the force-push was soft-blocked by the auto-mode classifier (history rewrite is destructive); cleared by explicit user authorization. An agent cannot edit its own `.claude/settings.local.json` to grant force-push -- that is a hard self-modification block, so the allowlist edit is always a user action.
- **Outstanding (on Active TODO):** add `gitleaks` + secret-file ignores to the pre-commit hook; resolve the GitGuardian alert; rotate + scrub the older ElevenLabs key in `M3AnimatedSeries`.

### 2026-05-30 (AM) -- TVD studio reorg + doc-system buildout
- **Triggered by:** a cold-start agent failure earlier the same day — Rune opened a fresh chat to continue Cloudflare work; the agent couldn't recover where the prior session left off from memory alone. Diagnosed as a Status doc + studio structure problem, not an agent problem.
- **NO site code changes.** This was entirely a docs + filesystem reorg session.
- **Studio reorg:** flattened `E:\TecVooDoo\` from a nested `Projects\Documents\`, `Projects\Games\`, `Projects\Writing\`, `Projects\Other\TecVooDooWebsite\` structure into top-level `Studio\`, `Games\`, `Writing\`, `Retired\`, with the site repo `TecVooDooSite\` as a co-equal subfolder. `E:\Personal\` was carved out for non-TVD personal content. HumiliNation snapshot deleted entirely (423 MB recovered; GitHub mirror is authoritative). Synthosapians + The Nexus Party consolidated under `Retired\Synthosapians_NexusParty\`.
- **Site repo gained:** `CLAUDE.md` at root (agent orientation), `Documents\TVD_Site_Status.md` (renamed from `TecVooDoo_Web_Status.md` at the old `Projects\Other\TecVooDooWebsite\Documents\` location), `Documents\Archives\` with 49 flattened archived design docs (27 TV_* + 22 Supabase_*). Two commits on `main`: `816306b` Migrate web docs into repo, `cebfc09` Add CLAUDE.md for agent orientation. Pushed to `origin/main`.
- **Canonical layer:** relocated from `Projects\Documents\Canonical\` to `Studio\Canonical\` (was a Phase 4 atomic move with backup zip). Canonical references in this Status doc, `DAB_Status.md`, `TVD_MarketingStrategy.md`, and `Studio\TVD_AI_Rules.md` all rewritten in the same batch. Added 4 Tier 2 docs to `Studio\Canonical\Web\`: `PerProject_DocSystem.md` (spec), `PerProject_StatusTemplate.md` (skeleton), `PerProject_Adoption_Prompt.md` (retrofit walkthrough), `PerProject_MCP_Brief.md` (per-project MCP quick-ref).
- **Studio orientation:** new `Studio\INDEX.md` for cold-start agents landing studio-wide. `TecVooDoo_Projects.csv` bulk-updated to reflect post-reorg paths.
- **Permissions:** `E:\TecVooDoo\.claude\settings.local.json` expanded from 6 to 90 allowlist entries (WebSearch, dev-domain WebFetch, read-only MCP tools across Supabase / Cloudflare / Discord, git push/pull/gh CLI). Standing authorization to push `main` without per-push confirmation. Reload VSCode workspace for the settings to take effect.
- **Memory:** 4 new memory entries (`reference_unity_workspaces`, `reference_windows_reserved_name_files`, `feedback_push_to_main_authorized`, `feedback_doc_system_purpose`); 8 existing entries updated with new paths.
- **Google Drive coverage:** now sync covers the entire `E:\TecVooDoo\` root (was only `Projects\` pre-reorg).
- **What did NOT happen:** the Cloudflare work that originally triggered the fresh chat. Still on Active TODO. Reorg plan archived at `E:\TecVooDoo\Studio\Archives\TVD_StudioReorgPlan.md` for forensic reference.

### 2026-05-22 -- Post-crash recovery + canonical doc cleanup
- C: drive crashed earlier in the day; Claude memory and global git config were wiped. Project files on E: were intact.
- Cloudflare had an active API/Dashboard 503 incident at the same time -- separate from the local crash, but compounded the troubleshooting: MCP OAuth flows for the 7 Cloudflare servers all failed silently because OAuth callbacks couldn't land.
- Restored: `git config --global --add safe.directory E:/TecVooDoo/TecVooDooSite` (fixes "dubious ownership" on E: drive after C: reset).
- Killed 7 zombie `mcp-remote` node.exe processes from a pre-crash VS Code session that were holding OAuth callback ports; deleted stale `_lock.json` entries in `C:\Users\steph\.mcp-auth\`; verified all MCP servers (Supabase + all 7 Cloudflare) reconnect successfully.
- Refreshed footers on 9 production HTML files (8 in Status doc's list + `privacy.html` which had been missed). Stale dates from Dec 27, 2025 to Jan 16, 2026 + `(c) 2025` -> `May 22, 2026` + `(c) 2026`. Will be automated going forward via a pre-commit hook in the repo.
- Built out `E:\TecVooDoo\Projects\Documents\Canonical\Web\` with `INDEX.md`, `TecVooDoo_Web_Standards.md`, and `TecVooDoo_Web_Workflow.md`. Extracted code patterns, deploy pipeline, ops gotchas from this Status doc + DAB_Status.md + the legacy `TecVooDoo_AI_Rules.md`. Corrected the `sbClient` recommendation to `supabaseClient` to match deployed production code; principle (avoid `window.supabase` shadow) unchanged.
- This doc slimmed to project state only; rules/patterns/lessons all moved to canonical. Bumped to v3.

### 2026-02-12 -- Repo hygiene
- Removed `tmpclaude/` junk directory from the repo (`fc435a4`).
- Added `.gitignore` to keep similar accidental artifacts out of future commits.
- Removed the standalone Murder, Malady and Monsters chapter preview page and beta reader page (`5cdd10b`) -- the beta reader signup remained on the book detail pages.

### 2026-01-25 -- DLYH iframe top offset
- Fixed iframe top offset 60px -> 72px in `games/dlyh/index.html` to give the Unity build more vertical space and reduce UI overlap on mobile (`14b2a16`).

### 2026-01-16 -- DLYH iframe wrapper page
- Added `games/dlyh/index.html` as an iframe wrapper around the DLYH Unity build (`7c11128`). Provides unified TecVooDoo auth UI around the Unity game while the Unity project itself runs in the embedded frame.

### 2026-01-05 -- Status doc consolidation (v1)
- Consolidated 4 prior documents (`TV_Architecture` v8, `TV_DesignDecisions` v8, `TV_ProjectInstructions` v8, `TV_SiteDesign` v8) plus the Supabase set (`Supabase_*` v6) into this single Status doc. Archives preserved under `Archives/`.

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 5 | 2026-05-30 | Resend API key leak remediation: revoked + rotated the key, purged `ResendAPI.txt` from git history (force-push `64f151c`), verified `origin/main` clean. Prevention TODOs added (gitleaks pre-commit, ElevenLabs/M3AnimatedSeries follow-up). No site code changes. |
| 4 | 2026-05-30 | TVD studio reorg + doc-system buildout. Doc moved into repo (renamed from TecVooDoo_Web_Status.md), canonical paths rewritten, CLAUDE.md + Studio\INDEX.md + 4 Canonical Tier 2 PerProject_* docs added. No site code changes. |
| 3 | 2026-05-22 | Post-crash session: rules/patterns/lessons extracted to new `Canonical/Web/` layer; this doc slimmed to state-only. Footers updated across 9 production HTML files. Recent Session History expanded to cover the gap since v2. |
| 2 | 2026-01-25 | Fixed DLYH iframe height offset (top: 60px -> 72px) |
| 1 | 2026-01-05 | Initial consolidated document (replaces TV v8 + Supabase v6) |

---

**End of Project Status**
