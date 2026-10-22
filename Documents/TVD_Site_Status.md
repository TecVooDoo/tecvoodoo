# TecVooDoo Web Infrastructure - Project Status

**Project:** TecVooDoo Website + Supabase Backend + Cloudflare Services
**Developer:** TecVooDoo LLC / Rune (Stephen Brandon)
**Platform:** Web (HTML5/CSS/JavaScript) + Supabase + Cloudflare
**Source:** `E:\TecVooDoo\TecVooDooSite`
**Live URL:** https://tecvoodoo.com
**Document Version:** 15
**Last Updated:** October 22, 2026
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

**Last session (2026-10-22):** Marketing staleness audit for sandbox-39 (the BM marketing pass). Shipped the result LIVE on Rune's go (`14ffbed`):
- BM card now shows Steam capsule art, the Steam short description, "Coming Soon -- Steam", and a Wishlist CTA. Home page has a BM block (Steam's Game Website field lands there).
- DLYH card changed to "3D Version in Development".
- New Hide 'N Reap card.

Audit: `Documents/TVD_Site_MarketingAudit_2026-10-22.md`. Open follow-ups are in Active TODO -> Marketing follow-ups.

**Prior:** 2026-07-18 -- Status-doc hygiene sweep (61 KB -> 23 KB) + new-computer session open. // 2026-07-10 (PM) -- `tecvoodoo-email` Turnstile lockdown (closed the open relay).

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

### Marketing follow-ups (from the 2026-10-22 audit)
- [ ] **HOK card "five legendary rivers"** -- V1 is locked to Acheron + Styx (HOK S32). Rune **deferred** the rewording; more HOK changes are coming, so reword alongside those.
- [ ] **Orphaned `site/games/dlyh/`** -- still deployed (it iframes the frozen `dlyh.pages.dev` 2D build), but nothing links to it since the DLYH card went "3D Version in Development". Rune decides: delete it, or keep it as an unlinked prototype page. This also makes the DLYH half of the Branding nav-reskin item below moot if it is deleted.
- [ ] **`TecVooDooMarketing\TVD_MarketingStrategy.md:199` "port DLYH to itch" plan is stale** -- DLYH3D targets itch directly (landscape PC WebGL), so the plan is no longer a site port. The DAB half still stands (see the itch item in Immediate). The Google Play part of the line was already struck 2026-10-22 (TVDStudio `f69c268`).
- [ ] **Blender hero render (later)** -- a dedicated hero image for the BM/home block, to replace the capsule crop. If it derives from the 46 MB key-art masters, bloodminer-b7 does the export after Rune approves (per `BM_MarketingAssetManifest.md`).
- [ ] **`TVD_AssetInventory.md:44` (bloodminergame.com "not yet pointed anywhere")** -- Rune + sandbox-39 set up the apex/www -> Steam redirect on 2026-10-22, and sandbox-39 is verifying it. Update the inventory line next session, after checking with `curl -sI https://bloodminergame.com`.
- [ ] **Canonical marker stale** -- this doc still says UniversalWorkflow **v1.14**, while Studio Status is aligned to **v2.6**. Read the v1.15+ Revision History rows at the next session open and update the marker. Not done at this close.

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
- [ ] Site lint crumbs (2026-07-10) -- refresh `sitemap.xml` (add privacy + the 2 story pages; update stale Dec-2025 lastmod); ~~recompress `blood-miner-keyart.png` (1.8 MB)~~ (done 2026-10-22: file deleted, replaced by the 151 KB `blood-miner-capsule.jpg`); remove the root `tecvoodoo-logo-small.png` orphan (keep the `images/` copy); games.html "Word games with guillotines" meta/header still undersells the catalog.

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

### 2026-10-22 -- Marketing staleness audit + BM Steam swap + card refresh (shipped live)
- **Driven by cross-session requests from sandbox-39** (BM marketing-continuity pass; Rune AFK, then back). It started as a read-only audit and became an audit doc: `Documents/TVD_Site_MarketingAudit_2026-10-22.md`.
  - BM card fully stale: Jun 2 mobile portrait render, "Google Play", "idle" copy, no CTA.
  - Home page had no BM, even though Steam's Game Website field lands there.
  - `bloodminergame.com` had no DNS records.
  - DLYH card advertised the frozen 2D build.
  - HOK card over-promised five rivers.
  - No image/alt specs exist in any brand or standards doc.
- **Built on stacked local branches**, `marketing/bm-steam-swap` then `marketing/site-cards`:
  - BM card: Main Capsule as a 151 KB JPEG, Steam short description v2, Wishlist CTA with UTM. Home "Coming Soon to Steam" block. Old 1.8 MB keyart deleted.
  - DLYH card moved to Up Next as "3D Version in Development", Play link dropped.
  - New Hide 'N Reap card (`HnR_Living_World` concept art). Rune confirmed it is his own art.
  - Rendered in local Chrome before review.
- **Rune: "push the site cards"** -> fast-forwarded `main` and pushed (`c5637d3..14ffbed`). Pages was live within ~15 s. Live-verified: 7 cards, Wishlist CTA, home block, footer Oct 22.
- **Card-slot fact worth keeping:** `.card-image` is a fixed 200px tall with `object-fit: contain`, so portrait art renders as a narrow strip. Use landscape (~16:9) art for cards.
- **Studio side** (TVDStudio `f69c268`): projects CSV BM row moved to Steam-first; DLYH split into a 2D (Paused) row and a new DLYH3D row; MarketingStrategy's Google Play line struck through.
- **Cloudflare:** Rune signed in mid-session. I wrote the dashboard steps for the bloodminergame.com redirect and Rune did it with sandbox-39. **No Cloudflare changes from this session.**
- **Swept** the 2026-07-10 (AM) entry to the archive (2-entry window).

### 2026-07-18 -- Status-doc hygiene sweep + new-computer session open
- **Session open (new machine, migration in progress):** canonical check -- UniversalWorkflow still **v1.14**, aligned (no delta). Site repo clean + in sync with GitHub (`45ab219` at open); git identity + MCP auth tokens carried over; all Unity trees present. Corrected a stale path -- DLYH source is now `E:\Unity\DontLoseYourHead\`, not the old `E:\Unity\DLYH\`. `git safe.directory` unset but git works on E: (no action unless it errors); 2 stale `_lock.json` files in `.mcp-auth` (only matters if `/mcp` reconnect misbehaves); a `nul` reserved-name file sits in `E:\Unity\` (cosmetic).
- **Swept this doc 61 KB -> 23 KB** per v1.14 Living-Doc Hygiene: added a `**Budget:**` header line; collapsed the Quick Context "Prior session" mega-block (~20 KB that duplicated Recent Session History) to a summary + a 2-entry Prior chain; kept the 2 latest session entries and moved older history (2026-06-26 -> 2026-01-05) + retired Version-History rows (v1-v8) + completed Cloudflare-insight detail to new `TVD_Site_StatusArchive.md`; promoted the orphaned 2026-06-26 brand-reskin narrative (was only in Quick Context) to a proper archived entry. Lossless -- all 15 session entries + 14 version rows verified across both files. Commits `3f89a60` (sweep) + this close; pushed. Docs-only, no site/ change, no Pages deploy impact.

### 2026-07-10 (PM) -- Email Worker lockdown (Turnstile)
- **Finished batch #2:** closed the `tecvoodoo-email` open-relay exposure (the endpoint accepted any POST and sent email from `noreply@tecvoodoo.com`). Chose the **wrangler** path (paired: Rune minted a scoped CF API token; guided click-by-click).
- **Deviation from the turnstile-spin skill (deliberate):** the skill's stock flow gates a *form* via a separate siteverify Worker -- that does NOT close a directly-POSTable endpoint. So verification was added **server-side inside `tecvoodoo-email`** (siteverify before Resend), which is what actually closes the relay. Used the skill only for the widget concept.
- **Widget:** created `TVD Email Worker` (Managed; domains tecvoodoo.com/localhost/127.0.0.1) via the CF API. Sitekey `0x4AAAAAADzh2M6i0_cI0xm0` (public); secret set as Worker secret `TURNSTILE_SECRET_KEY`.
- **Rollout order (no downtime):** shipped the DAB frontend first (widget + `turnstileToken` in the invite POST; old Worker ignored it, so invites kept working), confirmed the Pages deploy of `e1dfc08` was live, THEN deployed the enforcing Worker.
- **Validated:** no-token POST -> HTTP 400; bogus-token -> HTTP 403 (`invalid-input-response`, i.e. the secret is correct, not missing); `RESEND_API_KEY` preserved across the wrangler redeploy; and a **real invite from the live site sent + landed** (Rune confirmed).
- **Version-controlled the Worker** at `workers/tecvoodoo-email/` (`worker.js` + `wrangler.toml` + `README.md`) -- it previously lived only on Cloudflare (the fragility behind the 2026-05-30 Resend leak). Not Pages-deployed; deploy via wrangler.
- **Env notes:** the skill's bash scripts need `jq`/`python3`; this box has neither (python = Store stub) -> drove the CF API with `curl` + `node`. wrangler 4.98 present. CF token handed off via a local file (`~/.cf-turnstile-token`), never in chat; token + secret files deleted at close. (Rune can rotate the token; it never entered the transcript.)
- **Residual (low, noted not fixed):** invite/beta email HTML interpolates user-controlled `sender`/`gameLink` into the body (email-HTML-injection/phishing vector) -- now gated behind Turnstile (real humans only). Add `itch.zone` to the widget only if DAB-on-itch ever needs invites (out of current itch scope).

*Older entries (2026-07-10 AM -> 2026-01-05) are archived in [TVD_Site_StatusArchive.md](TVD_Site_StatusArchive.md).*

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| 15 | 2026-10-22 | Marketing audit + BM Steam swap + DLYH/HNR card refresh, shipped live (`14ffbed`). Added Active TODO -> Marketing follow-ups. Swept the 2026-07-10 (AM) entry to the archive. |
| 14 | 2026-07-18 | Status-doc hygiene sweep (v1.14 Living-Doc Hygiene): the doc had grown to ~60 KB vs its ~15 KB budget. Split older session history (2026-06-09 -> 2026-01-05), retired Version-History rows (v1-v8), and completed Cloudflare-insight detail to new `TVD_Site_StatusArchive.md`; added a `**Budget:**` header line; collapsed the Quick Context mega-lines into a summary + a 2-entry Prior chain; promoted the orphaned 2026-06-26 brand-reskin narrative to a proper session entry. Session-open canonical check: UniversalWorkflow still v1.14 -- aligned. No site/code changes. |
| 13 | 2026-07-10 (PM) | Email Worker lockdown: closed the `tecvoodoo-email` open relay with Cloudflare Turnstile (server-side siteverify inside the Worker + a Managed widget in the DAB invite form). Verified no-token->400 / bogus->403 / real invite sent+landed; `RESEND_API_KEY` preserved. Version-controlled the Worker source at `workers/tecvoodoo-email/`. Finishes batch #2. |
| 12 | 2026-07-10 | Site scope review + hygiene batch #1 + DAB XSS fix. Decided a blanket Fable refactor of site+marketing isn't worth it (markup + one game file + prose). Fixed a stored-XSS sink in DAB (opponent name via `innerHTML` -> DOM/`textContent`). Batch #1: deleted 5.6 MB `dlyh-concept.png` orphan, per-page OG meta on games/books/2 story pages, fixed 2 ASCII em-dashes in about.html, moved public `auth-test.html` to repo `dev/`. Canonical marker v1.13 -> v1.14. Deferred: brand leftovers (#3) + itch port (#4). |
| 11 | 2026-06-26 | Brand reskin Phase 1+2 shipped + live (commit `1cd447d`): brand palette into `style.css`, self-hosted Space Grotesk, TvD lettermark nav (8 pages), logo-with-Hex hero, SVG favicon, OG image + meta on index. Done without Enigma/Buster (webfont licensing unconfirmed). (Row backfilled 2026-07-10 -- the v11 bump had missed the table.) |
| 10 | 2026-06-22 | Brand-guide review + brand-voice copy alignment. Reviewed Danny's `[DRAFT] TVD Brand Guide.pdf`; named the mascot **Hex**, locked 8 keywords (Mischievous/Macabre/Cursed/Handmade/Irreverent/Aberrant/Stitched/Alive), wrote brand writeup + mascot blurb to `TecVooDooMarketing\TVD_BrandGuide_Copy.md` (NEW, disk-only/not git). Site change: hero subtitle (`index.html`) + about opener (`about.html`) moved to "a little cute, a little cursed, and entirely their own". Flagged CMYK-vs-hex palette + Enigma/Buster font licensing back to Danny. No canonical check (copy-only). |
| 9 | 2026-06-09 | itch.io channel logging (no site/code changes): `tecvoodoo.itch.io` studio page live with a Blood Miner free *playtest* build (level-tuning data collection, not full game / not a demo funnel); recorded in marketing tracker + infra memory. Site→itch integration deferred to a dedicated game-migration session. Canonical marker v1.12 -> v1.13 (Tier-2 check extension; no web effect). |

---

**End of Project Status**
