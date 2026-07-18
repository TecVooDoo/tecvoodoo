# TecVooDoo Web Infrastructure - Project Status

**Project:** TecVooDoo Website + Supabase Backend + Cloudflare Services
**Developer:** TecVooDoo LLC / Rune (Stephen Brandon)
**Platform:** Web (HTML5/CSS/JavaScript) + Supabase + Cloudflare
**Source:** `E:\TecVooDoo\TecVooDooSite`
**Live URL:** https://tecvoodoo.com
**Document Version:** 14
**Last Updated:** July 18, 2026
**Budget:** ~15 KB (byte-based). Over budget -> sweep per [UniversalWorkflow](file:///E:/Unity/Sandbox/Documents/Canonical/UniversalWorkflow.md) section Living-Doc Hygiene: replace header fields in place (never append); keep Quick Context's `Prior:` chain to <=2 one-liners; roll old session entries + retired Version-History rows to [TVD_Site_StatusArchive.md](TVD_Site_StatusArchive.md).

---

## Canonical References

This project follows the universal web rules in:

- [TecVooDoo_Web_Standards.md](../../Studio/Canonical/Web/TecVooDoo_Web_Standards.md) (aligned to v1.0 / 2026-05-22)
- [TecVooDoo_Web_Workflow.md](../../Studio/Canonical/Web/TecVooDoo_Web_Workflow.md) (aligned to v1.0 / 2026-05-22)

Cross-domain:

- [UniversalWorkflow.md](file:///E:/Unity/Sandbox/Documents/Canonical/UniversalWorkflow.md) (aligned to v1.14 / 2026-07-10)

Code patterns, bug patterns to avoid, deployment pipeline, OAuth setup details, and ops gotchas all live in the canonical docs. This doc holds project state only.

---

## Quick Context

**What is this?** The TecVooDoo web infrastructure: a static marketing/portal site at `tecvoodoo.com`, the Supabase backend at `api.tecvoodoo.com` (auth + game/beta-reader data), and the Cloudflare services that glue it together (Pages hosting, DNS, an email Worker via Resend). Shared foundation for all TecVooDoo web games + the books-side audience funnel.

**Current Phase:** Live / Maintenance.

**Last session (2026-07-10 PM):** Closed the `tecvoodoo-email` open relay with Cloudflare Turnstile (server-side siteverify inside the Worker + a Managed widget in the DAB invite form); version-controlled the Worker at `workers/tecvoodoo-email/`. Finished security batch #2. Clean tree, nothing mid-flight. Detail in the 2026-07-10 (PM) history entry.

**Prior:** 2026-07-10 (AM) -- site scope review (blanket Fable refactor ruled not worth it) + hygiene batch #1 + DAB stored-XSS fix. // 2026-06-26 -- brand reskin Phase 1+2 shipped + live.

Full recent history is below; older narrative (2026-06-26 and earlier) is in [TVD_Site_StatusArchive.md](TVD_Site_StatusArchive.md).

---

## Active TODO

### Immediate
- [x] (2026-07-18) **Status-doc hygiene sweep** -- DONE (this session). Split older history + retired Version-History rows + completed CF detail to `TVD_Site_StatusArchive.md`; added this `**Budget:**` header line; collapsed the Quick Context mega-lines. Doc cut ~60 KB -> ~23 KB (still ~1.5x the ~15 KB soft target, but the ~20 KB of duplicated Quick Context is gone; the remainder is live reference + the 2 most recent sessions).
- [ ] **itch.io port (batch #4, dedicated session)** -- DLYH + DAB. Real DAB blockers: auth-in-iframe (anonymous-only likely works; OAuth + magic-link break on the itch.zone sandbox origin) + rewrite share/invite links to a canonical `tecvoodoo.com/games/dots-and-boxes/?game=CODE`. **CORS is NOT the blocker** (Worker is `*`; Supabase REST/Auth/Realtime permissive). See [[project-itch-migration-pending]]. NOTE: on the new machine DLYH source is `E:\Unity\DontLoseYourHead\`, not the old `E:\Unity\DLYH\` path some notes still cite.
- [ ] **M3 ElevenLabs scrub -- do from an M3 session** (cross-project push rule): key already rotated + revoked 2026-05-31; M3's `.gitignore` already edited (left UNSTAGED) to drop `.mcp.json` + `.claude/mcp.json`. Remaining: paste new key into the local (now-untracked) files, `git rm --cached .mcp.json .claude/mcp.json`, commit, scrub the key from history (`git filter-repo --path .mcp.json --path .claude/mcp.json --invert-paths`), force-push `origin/master`.
- [ ] Move Supabase migrations into a version-controlled folder (currently SQL Editor only).
- [ ] Newsletter subscription: replace `mailto:updates+subscribe@tecvoodoo.com` placeholders with a Supabase-backed signup.
- Recently completed (detail in history/archive): DAB email-Worker Turnstile lockdown + DAB stored-XSS fix + `auth-test.html` de-deployed (2026-07-10); secret-scanning pre-commit hook + both GitGuardian alerts closed (2026-05-31).

### Cloudflare zone security (tecvoodoo.com -- zone `75d5d0f937fa670879de6906f35277c8`, Pro plan)
- [x] The 4 zone security insights recovered 2026-05-31 (security.txt `7f830bb`, WAF Managed Ruleset, Super Bot Fight Mode = Block definitely-automated, AI Labyrinth reviewed-and-left-off) + DMARC in monitor mode -- **all closed 2026-05-31**. Detail in [TVD_Site_StatusArchive.md](TVD_Site_StatusArchive.md).
- [ ] **Prune stale Microsoft + GoDaddy DNS cruft** -- M365/Lync leftovers (`autodiscover`, `enterpriseenrollment`, `enterpriseregistration` CNAMEs; `_sipfederationtls._tcp` / `_sip._tls` SRV -> *.online.lync.com) + GoDaddy `ns31/ns32.domaincontrol.com` NS records inside the zone. Harmless but confusing. Low priority.

**Authoritative hardening tracker:** `E:\TecVooDoo\TecVooDooMarketing\TVD_AssetInventory.md` -> "Pending Cloudflare hardening" (from the 2026-05-29 post-transfer audit; updated 2026-05-31 with the completions above). **Remaining hardening items NOT yet done** (resume point):
- [ ] Brotli compression (Speed -> Optimization -> Content Optimization)
- [ ] Always Use HTTPS -- verify (SSL/TLS -> Edge Certificates)
- [ ] HTTP/3 / QUIC -- verify (Network)
- [ ] SSL/TLS mode = Full (strict) -- verify (SSL/TLS -> Overview)
- [ ] **Google Workspace DKIM** -- audit found none at `google._domainkey`; only `resend._domainkey` exists. Workspace mail is unsigned -- enable in Workspace Admin -> Gmail -> Authenticate email, publish the selector TXT to CF DNS. Needed before tightening DMARC past `p=none`.
- [ ] Disable Cloudflare Email Routing (false MX conflicts vs Google Workspace)

### Branding (batch #3 -- queued; unblocked by the 2026-07-10 font ruling)
- [ ] Finalize the `style.css` **TYPOGRAPHY SWAP POINT** comment -- Enigma + Buster are **graphics-only** (no webfont license), so the Space Grotesk fallback for `--font-display`/`--font-accent` is **permanent**. Drop the "when webfont licensing clears" framing + the commented `@font-face` stubs so a future agent doesn't treat it as pending.
- [ ] Reskin the **2 game-embed navs** (DAB `games/dots-and-boxes/`, DLYH `games/dlyh/`) to the TvD lettermark -- both still use the old `tecvoodoo-logo-small.png` + text logo that the 8 main pages moved off.
- [ ] **Phase 3:** circuit/grid pattern backgrounds (guide: <=50% opacity behind text) + more Hex placements (404 / empty states). `images/hex.svg` is already in-repo, unreferenced, ready to place.
- [ ] Interior-page OG **images** -- pages currently reuse `og-image.png`; give the story/games pages page-specific share art later.
- [ ] Favicon fallback -- the SVG-only favicon goes faint on white tab strips; add a Shadow-bg `.ico`/PNG + `apple-touch-icon` (needs an off-box rasterizer; this box has none).
- [ ] Site lint crumbs (2026-07-10) -- refresh `sitemap.xml` (add privacy + the 2 story pages; update stale Dec-2025 lastmod); recompress `blood-miner-keyart.png` (1.8 MB); remove the root `tecvoodoo-logo-small.png` orphan (keep the `images/` copy); games.html "Word games with guillotines" meta/header still undersells the catalog.

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
  - DLYH (Unity project, separate doc tree under `E:\Unity\DontLoseYourHead\`; the iframe wrapper page is owned here)

---

## Recent Session History

### 2026-07-10 (PM) -- Email Worker lockdown (Turnstile)
- **Finished batch #2:** closed the `tecvoodoo-email` open-relay exposure (the endpoint accepted any POST and sent email from `noreply@tecvoodoo.com`). Chose the **wrangler** path (paired: Rune minted a scoped CF API token; guided click-by-click).
- **Deviation from the turnstile-spin skill (deliberate):** the skill's stock flow gates a *form* via a separate siteverify Worker -- that does NOT close a directly-POSTable endpoint. So verification was added **server-side inside `tecvoodoo-email`** (siteverify before Resend), which is what actually closes the relay. Used the skill only for the widget concept.
- **Widget:** created `TVD Email Worker` (Managed; domains tecvoodoo.com/localhost/127.0.0.1) via the CF API. Sitekey `0x4AAAAAADzh2M6i0_cI0xm0` (public); secret set as Worker secret `TURNSTILE_SECRET_KEY`.
- **Rollout order (no downtime):** shipped the DAB frontend first (widget + `turnstileToken` in the invite POST; old Worker ignored it, so invites kept working), confirmed the Pages deploy of `e1dfc08` was live, THEN deployed the enforcing Worker.
- **Validated:** no-token POST -> HTTP 400; bogus-token -> HTTP 403 (`invalid-input-response`, i.e. the secret is correct, not missing); `RESEND_API_KEY` preserved across the wrangler redeploy; and a **real invite from the live site sent + landed** (Rune confirmed).
- **Version-controlled the Worker** at `workers/tecvoodoo-email/` (`worker.js` + `wrangler.toml` + `README.md`) -- it previously lived only on Cloudflare (the fragility behind the 2026-05-30 Resend leak). Not Pages-deployed; deploy via wrangler.
- **Env notes:** the skill's bash scripts need `jq`/`python3`; this box has neither (python = Store stub) -> drove the CF API with `curl` + `node`. wrangler 4.98 present. CF token handed off via a local file (`~/.cf-turnstile-token`), never in chat; token + secret files deleted at close. (Rune can rotate the token; it never entered the transcript.)
- **Residual (low, noted not fixed):** invite/beta email HTML interpolates user-controlled `sender`/`gameLink` into the body (email-HTML-injection/phishing vector) -- now gated behind Turnstile (real humans only). Add `itch.zone` to the widget only if DAB-on-itch ever needs invites (out of current itch scope).

### 2026-07-10 -- Site scope review + hygiene batch #1 + DAB XSS fix
- **Triggered by:** Rune weighing whether to switch this project to **Fable** for a deep refactor (as done on some Unity projects) "in case it finds something we missed." Agreed to scope first before spending tokens.
- **Verdict: a blanket Fable deep-refactor of site + marketing is NOT worth it.** The site is ~11/12 static markup + one coherent 2963-line game file (`site/games/dots-and-boxes/index.html`); marketing is prose. Nothing architecturally rotten. The only real code/risk surface is the DAB game -> a targeted review beats a whole-session refactor.
- **DAB scope findings:** (1) **stored XSS** -- an opponent's `display_name` (attacker-controlled via anon `players` insert) was rendered via `innerHTML` in `loadMyGames()`, in the tecvoodoo.com origin where the Supabase session token lives = possible account takeover. **FIXED** this session (My Games row rebuilt with DOM APIs + `textContent`; Resume/Remove via `addEventListener` closures, not string-built `onclick`). (2) **email Worker is an open, unauthenticated relay** (`Access-Control-Allow-Origin: *`, no origin/auth/rate-limit) -- NOT fixed; real fix = Turnstile, entangled with the itch origin (see Immediate). (3) no server-side move validation (client-trusted `state`/`score`; RLS can't judge move legality) -- acceptable for casual play, noted. (4) inline Supabase key is the **publishable** key -- public by design, not a leak. (5) minor: vestigial `#difficulty-options` dead code (AI always 'normal'); matchmaking races; "Play Random Person" drops to a disguised AI after 5s.
- **itch-port recon (DAB):** **CORS is NOT the blocker** the notes feared -- the email Worker is `*`-open and Supabase REST/Auth/Realtime are permissive by default, so data/realtime/email likely work from the itch origin unchanged. Real blockers: (a) OAuth + magic-link redirect to `window.location.href` = the sandboxed `itch.zone` URL -> needs allowlisting in Supabase Auth + must survive iframe storage partitioning (usually breaks); **anonymous auth is the only method likely to work in-iframe.** (b) share-link/email-invite build `window.location.origin+pathname` = the ephemeral itch iframe URL, not a shareable game link -> invite/multiplayer-by-link broken on itch unless rewritten to a canonical `tecvoodoo.com/...?game=CODE`. Recommended itch scope: ship DAB as local + vs-AI + anonymous-online; keep full OAuth+invite multiplayer on tecvoodoo.com. Corrects the [[project-itch-migration-pending]] "CORS is the wrinkle" framing.
- **Hygiene batch #1 shipped (`site/`):** deleted `images/dlyh-concept.png` (5.6 MB orphan, biggest file on the site); added per-page OG/Twitter meta to `games.html`, `books.html`, `encapsulated-fear.html`, `genie-in-a-test-tube.html` (was index-only; all reuse `og-image.png` for now, story pages use `og:type=article`); fixed 2 non-ASCII em-dashes in `about.html` (-> `&mdash;`); moved `auth-test.html` (public dev harness, self-contained) out of `site/` to repo `dev/` so Pages no longer serves it.
- **Brand leftovers reviewed (batch #3, deferred):** Rune ruled **Enigma + Buster are NOT usable as webfonts -- only where already baked into graphics we have** (logos/lettermarks/Hex art). So the `style.css` TYPOGRAPHY SWAP POINT is now a **permanent** fallback (Space Grotesk stays for display/accent); the "license-pending" comment should be finalized. This **unblocks Phase 3** (patterns + Hex; `images/hex.svg` is already in-repo, unused, ready to place). Also: the 2 game embeds (DAB, DLYH) were never reskinned -- still old `tecvoodoo-logo-small.png` + text nav, not the TvD lettermark. All queued in Active TODO -> Branding.
- **Lint pass (delegated agent):** clean basics (no broken links, all `<img>` have `alt`, `lang`/`title` present). Remaining crumbs queued under Branding: stale/incomplete `sitemap.xml`; `blood-miner-keyart.png` 1.8 MB; root `tecvoodoo-logo-small.png` orphan; ~180-line Supabase auth block copy-pasted across 6 pages (shared `js/auth.js` candidate someday).
- **Canonical check:** UniversalWorkflow v1.13 -> v1.14 (new **Living-Doc Hygiene** section: replace-don't-append, byte budgets, `**Budget:**` header line, steps 6b/6c). Web-applicable part = doc hygiene; the rest (6b C# rule-audits, 5a MCP brief v3.0, CodingStandards v2.0 SOLID) is Unity-specific. Marker bumped to v1.14. This doc is now ~48 KB vs the ~15 KB Status budget -> a hygiene sweep is queued in Immediate.

*Older entries (2026-06-26 -> 2026-01-05) are archived in [TVD_Site_StatusArchive.md](TVD_Site_StatusArchive.md).*

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 14 | 2026-07-18 | Status-doc hygiene sweep (v1.14 Living-Doc Hygiene): the doc had grown to ~60 KB vs its ~15 KB budget. Split older session history (2026-06-09 -> 2026-01-05), retired Version-History rows (v1-v8), and completed Cloudflare-insight detail to new `TVD_Site_StatusArchive.md`; added a `**Budget:**` header line; collapsed the Quick Context mega-lines into a summary + a 2-entry Prior chain; promoted the orphaned 2026-06-26 brand-reskin narrative to a proper session entry. Session-open canonical check: UniversalWorkflow still v1.14 -- aligned. No site/code changes. |
| 13 | 2026-07-10 (PM) | Email Worker lockdown: closed the `tecvoodoo-email` open relay with Cloudflare Turnstile (server-side siteverify inside the Worker + a Managed widget in the DAB invite form). Verified no-token->400 / bogus->403 / real invite sent+landed; `RESEND_API_KEY` preserved. Version-controlled the Worker source at `workers/tecvoodoo-email/`. Finishes batch #2. |
| 12 | 2026-07-10 | Site scope review + hygiene batch #1 + DAB XSS fix. Decided a blanket Fable refactor of site+marketing isn't worth it (markup + one game file + prose). Fixed a stored-XSS sink in DAB (opponent name via `innerHTML` -> DOM/`textContent`). Batch #1: deleted 5.6 MB `dlyh-concept.png` orphan, per-page OG meta on games/books/2 story pages, fixed 2 ASCII em-dashes in about.html, moved public `auth-test.html` to repo `dev/`. Canonical marker v1.13 -> v1.14. Deferred: brand leftovers (#3) + itch port (#4). |
| 11 | 2026-06-26 | Brand reskin Phase 1+2 shipped + live (commit `1cd447d`): brand palette into `style.css`, self-hosted Space Grotesk, TvD lettermark nav (8 pages), logo-with-Hex hero, SVG favicon, OG image + meta on index. Done without Enigma/Buster (webfont licensing unconfirmed). (Row backfilled 2026-07-10 -- the v11 bump had missed the table.) |
| 10 | 2026-06-22 | Brand-guide review + brand-voice copy alignment. Reviewed Danny's `[DRAFT] TVD Brand Guide.pdf`; named the mascot **Hex**, locked 8 keywords (Mischievous/Macabre/Cursed/Handmade/Irreverent/Aberrant/Stitched/Alive), wrote brand writeup + mascot blurb to `TecVooDooMarketing\TVD_BrandGuide_Copy.md` (NEW, disk-only/not git). Site change: hero subtitle (`index.html`) + about opener (`about.html`) moved to "a little cute, a little cursed, and entirely their own". Flagged CMYK-vs-hex palette + Enigma/Buster font licensing back to Danny. No canonical check (copy-only). |
| 9 | 2026-06-09 | itch.io channel logging (no site/code changes): `tecvoodoo.itch.io` studio page live with a Blood Miner free *playtest* build (level-tuning data collection, not full game / not a demo funnel); recorded in marketing tracker + infra memory. Site→itch integration deferred to a dedicated game-migration session. Canonical marker v1.12 -> v1.13 (Tier-2 check extension; no web effect). |

---

**End of Project Status**
