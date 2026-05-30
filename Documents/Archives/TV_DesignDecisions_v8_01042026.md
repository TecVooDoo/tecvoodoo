# TecVooDoo Website - Design Decisions

**Project:** TecVooDoo Official Website
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Site URL:** https://tecvoodoo.com
**Project Path:** E:\TecVooDoo\TecVooDooSite
**Document Version:** 8
**Last Updated:** January 4, 2026

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v1 | Dec 25, 2025 | Initial document - documenting existing decisions |
| v2 | Dec 26, 2025 | Games page redesign, image lightbox, mobile lessons learned |
| v3 | Dec 26, 2025 | Added deployment structure clarification decision |
| v4 | Dec 27, 2025 | Unified local/repo structure, recreated Cloudflare Pages project |
| v5 | Dec 28, 2025 | Added auth UI lesson: don't block on database queries |
| v6 | Dec 28, 2025 | Added shared email infrastructure decision |
| v7 | Jan 4, 2026 | Updated Supabase URL to custom domain (api.tecvoodoo.com) |
| v8 | Jan 4, 2026 | Added beta reader system, M3 preview page funnel design |

---

## Purpose

This document tracks design decisions, rationale, and lessons learned for the TecVooDoo website.

---

## Core Design Decisions

### Technology Choice

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Static vs Dynamic | Static HTML/CSS | Simple, fast, no backend needed |
| Framework | None (vanilla) | Overkill for 5-page site |
| Hosting | Cloudflare Pages | Free, fast, easy GitHub integration |
| CSS approach | Custom with variables | Full control over design |

### Visual Design

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Color scheme | Dark with cyan/red accents | Tech aesthetic, matches "TecVooDoo" brand |
| Typography | Orbitron + Rajdhani | Futuristic headings, readable body |
| Layout | Card-based | Clean, scannable, works on mobile |
| Effects | Subtle glow/hover | Premium feel without overdoing it |

---

## Branding Decisions

### Name and Tagline

| Element | Choice | Rationale |
|---------|--------|-----------|
| Company name | TecVooDoo | Portmanteau of Tech + Voodoo |
| Tagline | "Where Tech Meets Voodoo" | Explains the name, sets tone |
| Primary accent | Cyan (#00f0c0) | Tech/digital feel |
| Secondary accent | Red (#ff3366) | Voodoo/magic feel |

### Logo Considerations

**Current:** Text-based logo using Orbitron font

**Future considerations:**
- Custom logomark combining tech + voodoo imagery
- Animated version for site header
- Favicon optimization

---

## Content Strategy Decisions

### Games Page

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Show in-development games | Yes, with badge | Builds anticipation |
| Subdomain for each game | Yes | Clean URLs, separate deployments |
| Include screenshots | Yes | Visual appeal, shows quality |
| Three sections | Now Playtesting / Coming Soon / Up Next | Clear status visibility |
| Gameplay vs Concept images | Gameplay for playable, Concept for upcoming | Shows progress |
| Click-to-enlarge images | Yes, via lightbox | Concept art has small text |

### Books Page

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Free HTML stories | Yes (short stories) | Builds audience, showcases writing |
| Show "querying" status | Yes | Transparency with readers |
| Separate short stories from novels | Yes | Clear categorization |
| Beta reader signup | Yes (via dedicated preview page) | Build early reader base |
| First 3 chapters preview | Yes | Funnel to beta reader signup |

### About Page

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Personal vs Corporate tone | Personal | One-person operation, authenticity |
| Show all skills | Yes | Games, books, web - full picture |
| Include creator name (Rune) | Yes | Personal brand building |

---

## Beta Reader System Decisions (Jan 4, 2026)

### Architecture Decision

| Option | Considered | Decision | Reason |
|--------|------------|----------|--------|
| Email-only signup | Yes | REJECTED | No database, hard to manage |
| Third-party service (BookFunnel, etc.) | Yes | REJECTED | Extra cost, external dependency |
| Supabase + Cloudflare Worker | Yes | CHOSEN | Reuses existing infrastructure |

**Decision:** Use Supabase for storage and Cloudflare Worker for notifications.

### Implementation Details

**Database:**
- Table: `beta_readers` in shared Supabase project
- Columns: id, email, name (optional), book_title, created_at
- Unique constraint on (email, book_title) to prevent duplicates
- RLS: Public INSERT, Authenticated SELECT

**Notifications:**
- Cloudflare Worker: `tecvoodoo-email.runeduvall.workers.dev`
- New `type: 'beta-reader'` routing added
- Sends notification to `stephenmbrandon@tecvoodoo.com`
- Manual Google Drive folder creation (intentional - maintains control)

### Funnel Design Decision

| Option | Considered | Decision | Reason |
|--------|------------|----------|--------|
| Button on book card only | Yes | REJECTED | No hook, no investment |
| Separate landing page | Yes | REJECTED | Extra navigation step |
| Preview chapters + signup at end | Yes | CHOSEN | Reader gets hooked, then signs up |

**Decision:** Preview first 3 chapters, then offer beta reader signup at the end.

**Rationale:**
- Readers invest time reading the preview
- By the end of chapter 3, they want more
- Higher quality signups (people who actually want to read)
- Lower friction than external services

### Beta Reader Button Style

| Style | Considered | Decision | Reason |
|-------|------------|----------|--------|
| Cyan (primary) | Yes | REJECTED | Blends with Read Now buttons |
| Red (accent) | Yes | CHOSEN | Stands out, matches "voodoo" theme |
| Outline | Yes | REJECTED | Not prominent enough |

**CSS Class:** `.btn-beta` - Red background, white text

---

## Murder, Malady and Monsters Preview Page (Jan 4, 2026)

### Page Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Header style | Title + subtitle + author | Clear book identification |
| Preview note | Cyan-bordered box | Sets expectations about partial content |
| Chapter headers | Centered, cyan text | Visual breaks between chapters |
| Body text | 1.1rem, 1.9 line-height | Comfortable reading |
| Paragraph indentation | 1.5em text-indent | Traditional book formatting |
| Dialogue formatting | Em dashes | Matches manuscript style |
| Beta signup placement | After chapter 3 | Reader is hooked, natural pause point |

### Content Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Number of chapters | First 3 | Enough to hook, not too much |
| Include spoilers | NO | Key plot twists reserved for full book |
| Book description | Focus on atmosphere | Don't reveal Jet killed his father |

**Key Principle:** Website preview should intrigue without spoiling. The reveal about Jet's actions should surprise the reader in the actual book.

### Why Not Use PDF

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| PDF download | Familiar format | Download friction, tracking harder | REJECTED |
| HTML page | Inline reading, easy tracking | More work to format | CHOSEN |

**Decision:** HTML page for preview, consistent with short stories format.

---

## Contact System Decisions

### Form Implementation

| Option | Considered | Decision | Reason |
|--------|------------|----------|--------|
| Mailto link | Yes | CHOSEN | Simple, no backend |
| Formspree | Yes | Rejected | Third-party dependency |
| Custom backend | Yes | Rejected | Overkill for volume |
| No form | Yes | Rejected | Need contact option |

### Newsletter/Updates

| Option | Considered | Decision | Reason |
|--------|------------|----------|--------|
| Email-based subscribe | Yes | CHOSEN | Simple, manual management |
| Mailchimp | Yes | Rejected | Monthly cost, low volume |
| Buttondown | Yes | Future option | Good for growth |
| No newsletter | Yes | Rejected | Want to build audience |

---

## Shared Game Infrastructure Decisions (Dec 28, 2025)

### Shared Authentication for All Games

| Option | Considered | Decision | Reason |
|--------|------------|----------|--------|
| Separate auth per game | Yes | REJECTED | Redundant, confusing for users |
| Shared Supabase project | Yes | CHOSEN | Single sign-in works across all games |

**Decision:** All TecVooDoo games use the same Supabase project for authentication.

**Implementation:**
- Supabase Project: `api.tecvoodoo.com` (custom domain - configured Jan 4, 2026)
- Legacy URL: `eenuxdjmsibcfhzgtslx.supabase.co` (still works)
- Google OAuth: Live
- Facebook OAuth: Live (App Review completed Dec 28, 2025)
- Magic Link: Live
- Anonymous/Guest: Live
- Discord: Planned for future

**Benefits:**
- Single sign-in works across all TecVooDoo games
- Cross-game leaderboards possible
- Consistent user experience
- Easier to add new games

### Shared Email System for All Games

| Option | Considered | Decision | Reason |
|--------|------------|----------|--------|
| mailto: links | Yes | REJECTED | Unreliable, dependent on user's email client |
| Separate Worker per game | Yes | REJECTED | Redundant, harder to maintain |
| Shared Cloudflare Worker + Resend | Yes | CHOSEN | Reliable, reusable across all games |

**Decision:** All TecVooDoo games use a single shared Cloudflare Worker for email invites.

**Implementation:**
- Cloudflare Worker: `tecvoodoo-email.runeduvall.workers.dev`
- Email service: Resend (domain verified: tecvoodoo.com)
- From address: `noreply@tecvoodoo.com`
- Worker accepts `gameName` parameter for multi-game support
- Worker accepts `type` parameter for different email types (game-invite, beta-reader)
- API key stored as Cloudflare secret (not in client code)

**Benefits:**
- Reliable server-side email delivery
- Professional HTML emails with branding
- Single codebase for all games
- Easy to add new games (just pass gameName parameter)
- Works across all devices and browsers

**Current Usage:**
- Dots and Boxes: Email invites for online games
- TecVooDoo Website: Beta reader signup notifications
- DLYH: Planned for multiplayer invites
- Future games: Will use same infrastructure

---

## Mobile Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Responsive approach | Mobile-first CSS | Better mobile experience |
| Navigation | Hamburger on mobile | Standard pattern |
| Touch targets | Min 44px | Accessibility |
| Card stacking | Single column | Readable on small screens |

---

## Performance Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Images | Minimal, optimized | Fast loading |
| External fonts | Google Fonts CDN | Easy, cached across sites |
| CSS file | Single file | Fewer requests |
| JavaScript | Minimal, only where needed | Maximum simplicity |

---

## Hosting Decisions

### Why Cloudflare Pages

| Factor | Cloudflare Pages | GitHub Pages | Netlify |
|--------|-----------------|--------------|---------|
| Free tier | Generous | Generous | Limited |
| CDN | Global | Limited | Good |
| Custom domain | Yes | Yes | Yes |
| Build speed | Fast | Slow | Medium |
| Already using Cloudflare | Yes | N/A | N/A |

**Decision:** Cloudflare Pages - already using Cloudflare for DNS, seamless integration.

---

## Subdomain Strategy

### Game Hosting

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| /games/dlyh/ | Single deployment | Larger bundle | Rejected |
| dlyh.tecvoodoo.com | Separate, clean | Multiple deploys | CHOSEN |
| games.tecvoodoo.com/dlyh/ | Organized | Extra routing | Rejected |

**Decision:** Separate subdomains for each game. Clean URLs, independent deployments, easier to manage.

---

## Deployment Structure Decision (Dec 27, 2025 - SUPERSEDED)

### The Original Problem (v3)

Local folder structure (`site/` subfolder) didn't match GitHub repo structure (files at root). This caused confusion when pushing changes.

### v3 Solution (Dec 26, 2025) - Now Superseded

- Document the difference clearly
- Keep working but confusing setup

### v4 Solution (Dec 27, 2025) - CURRENT

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| Keep documenting mismatch | No changes | Still confusing | Rejected |
| Unify structure (site/ folder) | Simple, consistent | Required Cloudflare reconfigure | CHOSEN |

### Resolution

1. Removed duplicate `.git` folder from `site/` subfolder
2. Updated main git repo to track `site/` folder
3. Deleted old Cloudflare Pages project (had wrong repo name anyway)
4. Created new Cloudflare Pages project with build output directory: `site`
5. Re-added custom domains

**Result:** Local structure and repo structure are now identical. Edit in `site/`, commit, push, deployed. No more confusion.

---

## What We're NOT Doing

| Feature | Why Not |
|---------|---------|
| Blog | Low priority, time investment |
| Forums/Community | Need audience first |
| E-commerce | No products to sell (yet) |
| User accounts on main site | Using Supabase for games only |
| Comments | Moderation overhead |
| Dark/Light toggle | Dark is brand identity |

---

## Open Questions

| Question | Status | Notes |
|----------|--------|-------|
| Add analytics? | OPEN | Privacy vs insights trade-off |
| Self-host fonts? | OPEN | Performance vs convenience |
| Add blog later? | OPEN | When/if writing cadence increases |
| Game page redesign? | OPEN | When more games are playable |
| SEO improvements? | OPEN | Depends on traffic goals |

---

## Lessons Learned

### From Building the Site

| Lesson | Application |
|--------|-------------|
| Static is sufficient | Avoided unnecessary complexity |
| CSS variables are great | Easy theming and consistency |
| Cloudflare Pages works well | Simple, reliable hosting |
| Keep it simple | 5 pages is enough for now |

### From Maintaining the Site

| Lesson | Application |
|--------|-------------|
| Update games list regularly | Keep content fresh |
| Check external links | PDFs, subdomains |
| Mobile testing matters | Most traffic is mobile |

### From Image Lightbox Implementation (Dec 2025)

| Lesson | Application |
|--------|-------------|
| Hover effects don't work on mobile | Use click/tap instead |
| CSS position:fixed is unreliable on iOS | Create elements dynamically with JS |
| Hidden elements can affect mobile layout | Don't keep modals in DOM when hidden |
| Browser DevTools != real devices | Always test on actual phone |
| Viewport units behave differently on mobile | Use percentages when possible |

**What Failed:**
- CSS-only hover zoom (no hover on touch)
- Static lightbox div with visibility:hidden (rendered at bottom on iOS)
- position:fixed with various CSS tricks (still broke on mobile)

**What Worked:**
- Dynamically creating lightbox element on click
- Removing element from DOM on close
- Inline styles to avoid CSS cascade issues
- No hidden elements that could interfere with scroll

### From Deployment Structure Unification (Dec 27, 2025)

| Lesson | Application |
|--------|-------------|
| Duplicate git repos cause confusion | Had `.git` in both root and site/ |
| Cloudflare can deploy from subfolder | Use build output directory setting |
| Recreating Pages project is easy | Don't be afraid to delete and recreate |
| Renamed repos don't update in Cloudflare | Recreate project to fix display name |
| Unified structure > documented complexity | Worth the reconfiguration effort |

**What Was Fixed:**
- Duplicate `.git` folders causing sync issues
- "tecvoodoo-comingsoon" display name in Cloudflare
- Confusion about which folder to edit
- Confusion about copying files between locations

### From Auth UI Blocking Issue (Dec 28, 2025)

| Lesson | Application |
|--------|-------------|
| Never await database queries in onAuthStateChange | Blocks UI updates if query hangs |
| Update auth UI immediately on state change | User sees correct state right away |
| Run database operations in background | Use .then()/.catch() instead of await |
| Auth state is known before database operations | Don't conflate the two |

**The Problem:**
Pages with Supabase auth (like Dots and Boxes) showed "Sign In" button even when user was authenticated, if they navigated from another page.

**Root Cause:**
The `onAuthStateChange` handler was using `await ensurePlayerRecord()` to create/fetch the player record in the database. If this query hung (due to RLS policies, network issues, etc.), the `updateAuthUI()` call that followed never executed.

**What Failed:**
```javascript
// BAD - blocks if ensurePlayerRecord hangs
supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
        currentUser = session.user;
        await ensurePlayerRecord();  // Hangs here
        updateAuthUI();              // Never reached
    }
});
```

**What Worked:**
```javascript
// GOOD - UI updates immediately, database ops in background
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        currentUser = session.user;
        updateAuthUI();  // UI updates FIRST

        ensurePlayerRecord().then(id => {
            currentPlayerId = id;
            loadMyGames();
        }).catch(err => {
            console.error('ensurePlayerRecord failed:', err);
            loadMyGames();  // Still works even if record fails
        });
    }
});
```

**Key Principle:** Auth UI updates should NEVER wait on database operations. The authentication state is known immediately from Supabase Auth - display it right away. Database operations are secondary and can run asynchronously.

### From Email Invite Implementation (Dec 28, 2025)

| Lesson | Application |
|--------|-------------|
| mailto: links are unreliable | Depend on user's email client being configured |
| Server-side email is more reliable | Use API-based email services |
| Shared infrastructure is better | One Worker for all games |
| Store secrets properly | Use Cloudflare secrets, not client code |

**The Problem:**
Email invites sent via mailto: links were not arriving for recipients.

**Root Cause:**
mailto: links rely on the user's email client being properly configured. Many users don't have a default email client set, use webmail, or have email clients that silently fail.

**What Failed:**
```javascript
// BAD - relies on user's email client
window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
```

**What Worked:**
```javascript
// GOOD - server-side email via API
const response = await fetch('https://tecvoodoo-email.runeduvall.workers.dev', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        to: email,
        playerName: playerName,
        gameCode: gameCode,
        gameLink: gameLink,
        gameName: 'Dots and Boxes'  // Optional, for multi-game support
    })
});
```

**Key Principle:** For critical communications like game invites, use server-side email APIs. The extra infrastructure (Cloudflare Worker + Resend) is worth the reliable delivery.

### From Beta Reader System Implementation (Jan 4, 2026)

| Lesson | Application |
|--------|-------------|
| Reuse existing infrastructure | Supabase + Cloudflare Worker already in place |
| Unique constraints prevent duplicates | Use DB-level constraint, not app logic |
| Error code 23505 = duplicate | Handle gracefully with user-friendly message |
| Funnel design works | Preview chapters hooks readers before asking for signup |

**What Worked:**
- Using same Supabase project for both games and website
- Extending Cloudflare Worker with `type` parameter routing
- Unique index on (email, book_title) for duplicate prevention
- Preview page as funnel to beta reader signup

**Key Principle:** Invest the reader's time (reading 3 chapters) before asking for the commitment (signup). Quality over quantity in beta reader signups.

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Original | Static HTML/CSS | Simplicity |
| Original | Dark theme | Brand identity |
| Original | Cloudflare Pages hosting | Free, fast, integrated |
| Original | Subdomain per game | Clean separation |
| Original | Mailto for contact | No backend needed |
| Dec 25, 2025 | Document existing decisions | Project standardization |
| Dec 26, 2025 | Games page three-section layout | Clear status visibility |
| Dec 26, 2025 | Dynamic JS lightbox over CSS | Mobile compatibility |
| Dec 26, 2025 | Mobile-first requirement added | Multiple iOS issues encountered |
| Dec 26, 2025 | Document local vs repo structure | Clarify deployment workflow |
| Dec 27, 2025 | Unify local and repo structure | Eliminate confusion permanently |
| Dec 27, 2025 | Recreate Cloudflare Pages project | Fix repo name display, clean setup |
| Dec 28, 2025 | Non-blocking auth UI pattern | Auth UI should never wait on database |
| Dec 28, 2025 | Shared auth infrastructure | Single Supabase project for all games |
| Dec 28, 2025 | Shared email infrastructure | Reliable invites, reusable across games |
| Dec 28, 2025 | Facebook OAuth goes live | App Review completed |
| Jan 4, 2026 | Supabase custom domain | Professional OAuth consent screens |
| Jan 4, 2026 | Beta reader system | Build early reader base for M3 |
| Jan 4, 2026 | M3 preview page funnel | Hook readers with 3 chapters, then signup |
| Jan 4, 2026 | Red button style for beta | Stands out from primary cyan buttons |

---

## Future Considerations

### If Traffic Grows

- Add privacy-focused analytics (Plausible, Fathom)
- Consider CDN for PDFs
- Monitor performance metrics

### If Content Grows

- Consider static site generator (11ty)
- Blog section if writing increases
- Portfolio section for game screenshots

### If Revenue Grows

- E-commerce for merchandise
- Paid game hosting considerations
- Newsletter service upgrade

### For Beta Reader System

- Automated email responses to signups
- Dashboard for viewing/managing beta readers
- Integration with Google Drive API for automatic folder creation (maybe)
- Collect additional info (reading preferences, turnaround time)

---

## Red Flags / Watch Items

| Flag | Severity | Notes |
|------|----------|-------|
| No analytics | LOW | Flying blind on traffic |
| External font dependency | LOW | Google Fonts could fail |
| Manual newsletter | LOW | Doesn't scale |
| No backup documented | MEDIUM | Document backup process |
| Manual beta reader management | LOW | Manual Google Drive folder creation is intentional for now |

---

**End of Design Decisions Document**
