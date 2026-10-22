# tecvoodoo.com -- Marketing Staleness Audit (2026-10-22)

**Requested by:** sandbox-39 (marketing-continuity pass, Rune AFK). **Mode:** read-only. Nothing pushed, nothing deployed.
**Baseline:** `TecVooDooSite` `main` @ `c5637d3`, clean and in sync with origin. `games.html` was last changed 2026-07-10 (`30ee3b3`; the footer also reads "Updated: Jul 10, 2026"). Cloudflare bot-challenges curl, so the live HTML could not be diffed directly. The live `blood-miner-keyart.png` is byte-identical to the repo copy, so **live = `main`**.

---

## TL;DR -- priority order

1. **Blood Miner is stale everywhere, and Steam now sends traffic to the site.** Steam's "Game Website" field points to `https://tecvoodoo.com`, i.e. the **home page**. The home page has **zero** Blood Miner presence. On games.html, the BM card still shows the Jun 2 portrait key art, the "Coming Soon - Google Play" status, idle/mobile copy, and no CTA.
2. **bloodminergame.com does not resolve.** The domain has Cloudflare nameservers but no apex or `www` record, so the canonical BM URL is dead.
3. **The DLYH card advertises a frozen build.** It says "Now Playtesting / Playable / Play Now", but the 2D build (`dlyh.pages.dev`) has been frozen since 2026-05-14, with "no users, no maintenance." DLYH3D (the redo) is in development and targets itch.
4. **The HOK card over-promises scope.** It says "fish the five legendary rivers of Hades", but V1 was locked to **Acheron + Styx** at Session 32 (2026-04-28).
5. **No image or alt-text spec exists anywhere.** The swap has to follow existing site conventions (listed in section 4).

---

## 1. Images -- what is used vs. what exists

| Surface | Image used | Date | Dims / size | Newer or official available? | Verdict |
|---|---|---|---|---|---|
| games.html: **Blood Miner** | `images/blood-miner-keyart.png` (= `BM/Documents/Marketing/SetShots/BM_KeyArt_Portrait_1080x1920_v2.png`) | 2026-06-02 art, committed 06-08 | 1080x1920 portrait, **1.8 MB** | **YES.** `Steam_Upload/` holds the approved set: `Capsules/` (Jun 30; Main 1232x706, Header 920x430, Vertical 748x896, Library 600x900, Small 462x174, Hero 3840x1240), `Logotype/` (Jun 30, 4-8k masters), `Key_Art/` (Jun 30, 46 MB masters, gore + non-gore), `Screenshots/BM_Steam_SS_AllAges_01..05` (Oct 12, 1920x1080, gore off). `SetShots/` and `Archive_S299/` are superseded. | **STALE -- replace** |
| games.html: **Don't Lose Your Head** | `images/dlyh-gameplay-v2.png` (= `C:\Unity\DontLoseYourHead\...` / `E:\Unity\DontLoseYourHead\Documents\Marketing\Screenshots\DLYH_01.png`) | 2026-06-08 | 1653x889, 357 KB | No newer 2D art. DLYH3D has no marketing art yet. | Image OK for the 2D build. **The card's framing is the problem** (section 2). |
| games.html: **Dots n Boxes** | `images/dots-boxes-gameplay.png` | 2025-12-26 | 600x600 square, 56 KB | No Marketing folder for DAB. Nothing newer. | OK. Oldest asset on the site, and square while the other cards are ~16:9. Low priority. |
| games.html: **GRIMMORPG** | `images/grimmorpg-gameplay.png` (= `GRIMMORPG_01.png`) | 2026-06-08 | 1206x682, 603 KB | Same batch: `GRIMMORPG_02..05` (Jun 8). Nothing newer. | OK |
| games.html: **Hooked on Kharon** | `images/hok-gameplay.png` (= `HOK_02.png`) | 2026-06-08 | 872x491, 127 KB | Same batch: `HOK_01, 03..06`. Nothing newer. | OK (smallest card image; `HOK_04` at 308 KB may be sharper) |
| games.html: **FearSteez** | `images/fearsteez-gameplay.png` (= `FearSteez_01.png`) | 2026-06-08 | 1171x629, 732 KB | Only one shot exists | OK |
| Home page (`index.html`) | No game art. Hero = `tvd-wordmark.svg`. Three "What We Do" cards (Games / Books / About). | -- | -- | -- | **Gap:** no BM feature block, even though this is Steam's landing page |
| `og-image.png` (index + all interior pages) | Generic TecVooDoo logo on dark | 2026-06-26 | 1200x630, 69 KB | Brand-current (reskin Phase 1+2). | OK as the studio default. Interior-page OG art is already an open TODO in `TVD_Site_Status.md`. The games page and a future BM section would benefit from BM share art (Main/Header capsule). |

`E:\TecVooDoo\TecVooDooMarketing\` holds `BloodMinerGameMarketing\`, `Avatars\`, and the brand package. None of it is newer game art than the per-project folders above.

---

## 2. Card copy and status vs. current Status docs

| Card | Site says | Current truth (source) | Mismatch |
|---|---|---|---|
| **Blood Miner** | Section subtitle "Our first commercial release - launching soon." Copy: "...premium idle/incremental factory... one-thumb portrait loop... No ads, no timers, no IAP grind". Status: **"Coming Soon - Google Play"**. No button. | **Steam-first.** Coming Soon page PUBLIC since 2026-10-18 (app **4864740**, demo app 5434610). Identity is a "Chaotic Active Clicker". `BM_Steam_Page_Setup.md` warns that "idle" framing is a refund/review risk. Platform: PC (Steam) per `BM_SellSheet.md`. | **Every element is stale:** platform, genre framing ("idle"), "portrait/one-thumb" (mobile), and no Wishlist CTA. Copy should become the Steam short description v2 (below). Status: "Coming Soon - Steam". CTA: "Wishlist on Steam". |
| **Don't Lose Your Head** | "Now Playtesting -- help us test and refine these games." Status "Playable". "Play Now" opens `games/dlyh/`, which iframes `https://dlyh.pages.dev`. | `E:\Unity\DontLoseYourHead\Documents\DLYH_Status.md`: the 2D build is **frozen as of 2026-05-14**, and the playtest URL is "live but inactive (no users, no maintenance, no upcoming deploys)." DLYH3D redo is in Phase 2 and targets an **itch.io landscape PC WebGL demo**. | "Help us test and refine" is false. Rune decides between (a) relabeling it "Original 2D prototype -- a 3D remake is in development" and keeping Play Now, or (b) moving it to Up Next as "In Development" and dropping the embed. |
| **Dots n Boxes** | Playable, async multiplayer via codes | `DAB_Status.md` (v2, May 22): Live web game at that URL | Matches. ("Now Playtesting" vs. CSV "Live" is a small labelling nit.) |
| **GRIMMORPG** | Beatrice, Victorian house, grimoire, MMORPG summoning demons, "tenth circle of hell" | `GRIMMORPG_Status.md` (S24, 09-27): GDD v0.5 "9 Circles structure", P&C horror in an inherited Victorian house | Matches |
| **Hooked on Kharon** | "...fish the **five** legendary rivers of Hades." | `HOK_Status.md`: **V1 = Acheron + Styx** (locked S32, 2026-04-28). The other three rivers are v2 expansion content. | **Over-promise.** Suggest "...and fish the rivers of the Underworld, starting with the Acheron and the Styx." |
| **FearSteez** | Rhythm beat-em-up, Atlanta, mic cord | `FS_Status.md` (S34): 2.5D beat 'em up with RPG elements | Matches |

**Page-level staleness on games.html:**
- The meta description and page header say "Word games with guillotines. Shrunken heads on spikes...", which undersells the catalog. This is already logged in `TVD_Site_Status.md` lint crumbs. "Shrunken heads on spikes" refers to Shrunken Head Toss (Planning, local tree lost) and appears nowhere else on the site.
- The footer says "Updated: Jul 10, 2026".
- **Dash style:** card copy uses a spaced hyphen ` - `. BM brand voice (per bloodminer-b7) is **no em dashes, public copy uses ` -- `**. The BM swap should use ` -- `. Whether to normalize the other cards is Rune's call; I left them alone.

**BM copy to use** (`BM_Steam_Page_Setup.md` section C2, the LIVE v2 short description, 273 chars):

> Cute animals. Sharp tools. You are the Ghoul, and the shaft never stops filling. Chop what drops, keep ten rows of glass pipe flowing, unleash the organ-eating dragon, then ascend into faster, nastier runs. An active clicker with a body count. No ads. No timers. One price.

**CTA:** "Wishlist on Steam" -> `https://store.steampowered.com/app/4864740/`. Optional UTM: `?utm_source=tecvoodoo&utm_medium=site&utm_campaign=games` to match BM's in-game UTM practice (S303). **Do not link** `demo.bloodminergame.com` or the itch build as current; both are still on old art.

---

## 3. Fleet titles missing or listed wrongly

Roster: `Studio\Inventory\TecVooDoo_Projects.csv`. The site needn't list everything; these are flags only.

**Game titles in Development with no site presence:**

| Title | CSV status | Art on disk | Note |
|---|---|---|---|
| Hide 'N Reap | Development | 3 concept PNGs in `Documents/` (`Hide_n_Reap_Concept`, `HnR_Living_World`, `HnR_Supernatural_World`) | Strongest candidate for an "Up Next" card |
| A Quokka Story | Development | ~25 images (`ArtPackage/`, Spine/2D briefs) | Candidate. Art may be reference rather than in-game. |
| Necro Ricochet | Development (migrated 09-28) | none | Needs art first |
| Space Sucks! | Development | 1 reference image | Needs art first |
| Shift Happens: Nurse Edition | Development (migrated 09-15) | layout PNG only | Needs art first |
| Witch Way to Mirebell | Incubator | -- | Too early |

Tooling, framework and package rows (Sandbox, AudioProject, SetDesign, VNPC, UnrealToUnity, UPM packages) are correctly absent.

**Roster rows that are themselves stale** (CSV fixes are for the Studio session, not the site):
- **Blood Miner:** "Mobile portrait blood-mining game", Live URL N/A. Should be PC/Steam with the store URL.
- **Don't Lose Your Head:** "Playtesting", path `C:\Unity\...`. The active project is DLYH3D at `E:\Unity\DontLoseYourHead` (repo `DLYH3D`), and the 2D tree is frozen.
- **M3 Book 1:** "Manuscript with editor; cover design starting". The cover was delivered 2026-09-10 per memory. This is a books-page issue, outside this audit's scope.
- `TecVooDooMarketing\TVD_MarketingStrategy.md:199` still describes the itch BM build as a mobile-era playtest with "full game stays $3.99 premium on Google Play". This is stale strategy text.

---

## 4. Image specs the swap should follow

**None defined.** `TVD_BrandGuide_Copy.md` covers palette and typography copy only. `TVD_MarketingStrategy.md` has no image sizes, formats or alt rules. `Studio\Canonical\Web\TecVooDoo_Web_Standards.md` has no image or alt-text section. That gap is worth a line in Web Standards later.

**Conventions in effect on the site (follow these):**
- OG/Twitter: 1200x630 PNG, absolute `https://tecvoodoo.com/images/...` URL, `og:image:width/height` declared.
- Card images: landscape, about 16:9 (871-1653 px wide), PNG, `images/<slug>-<kind>.png`. Alt pattern: `"<Title> Gameplay"` (BM uses `"Blood Miner Key Art"`).
- Weight: `TVD_Site_Status.md` already flags the 1.8 MB BM key art for recompression. Keep the new BM card image at or below ~300 KB (downscale the 1232x706 Main Capsule, or an AllAges shot, to ~960 px wide).
- ASCII-only source (em dashes were scrubbed in hygiene batch #1). Use ` -- ` in BM copy.
- For a general audience, use **AllAges** (gore-off) screenshots and the **non-gore** key art only.

**Recommended BM card image:** `Capsules/Main_Capsule.png` (1232x706). It is landscape, matches the other cards' ratio, carries the logotype, has full rights, and contains no AI art. AllAges_01..05 can go into a home-page feature block or a lightbox gallery.

---

## 5. bloodminergame.com -- what it serves now

- **Apex `bloodminergame.com`: does not resolve.** Nameservers are `shane` / `vivienne.ns.cloudflare.com`, but no A/AAAA/CNAME record exists. curl reports "Could not resolve host."
- **`www.bloodminergame.com`:** NXDOMAIN.
- **`demo.bloodminergame.com`:** HTTP 200, `<title>Blood Miner</title>`. This is the WebGL demo, still on old (v0.6.0-era) art per bloodminer-b7.
- `TVD_AssetInventory.md:44` still reads "Not yet pointed anywhere -- placeholder for BM site/landing."

**Recommendation (Rune decides; this is DNS, outward-facing):** add a proxied apex + `www` record with a Cloudflare Redirect Rule to the Steam page, or to a future `tecvoodoo.com` BM section. Until that exists, nothing public should print `bloodminergame.com` as the BM URL.

---

## 6. BM swap -- PREPARED on local branch `marketing/bm-steam-swap` (not pushed)

Built after `BM_MarketingAssetManifest.md` (S312) landed. Rendered locally in Chrome and checked visually on both pages.

1. **games.html BM card:**
   - Image `images/blood-miner-capsule.jpg`: `Capsules/Main_Capsule.png` (clean art, logo baked in) re-encoded to JPEG q85, 1232x706, **151 KB** (was 1.8 MB).
   - Steam short description v2 verbatim.
   - Status "Coming Soon -- Steam".
   - "Wishlist on Steam" button -> `store.steampowered.com/app/4864740/?utm_source=tecvoodoo&utm_medium=games_page&utm_campaign=coming_soon`.
   - Subtitle "Our first commercial release -- now on Steam as Coming Soon."
2. **index.html:** a "Coming Soon to Steam" block above "What We Do": the same capsule, the tagline, and a Wishlist CTA with `utm_medium=home_page`. It reuses the existing `.card` markup, with zero CSS changes.
3. **Deleted** `images/blood-miner-keyart.png`; nothing else referenced it.

**Deviation from the manifest's portrait suggestion:** the manifest proposed Library/Vertical capsule for "today's portrait slot". The site has no portrait slot, though. `.card-image` is a fixed 200px tall with `object-fit: contain`, so a 2:3 image renders as a ~133px-wide strip with dead space on both sides, which is what the old key art did. The landscape Main Capsule fills the slot and is also clean art from the approved set. No screenshots were used, so the gore vs. all-ages question doesn't arise in this branch. No master export was needed.

**Not in the swap (needs Rune's ruling):** the DLYH card framing, the HOK "five rivers" line, bloodminergame.com DNS, normalizing the other cards' ` - ` dashes, the games.html meta description, and the footer date.

**To ship:** Rune reviews the branch, then `git checkout main && git merge --ff-only marketing/bm-steam-swap && git push`. Pushing `main` deploys live.
