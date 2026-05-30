# TecVooDoo Supabase Backend - Design Decisions

**Project:** TecVooDoo Unified Multiplayer Backend
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Document Version:** 6
**Last Updated:** January 4, 2026

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v1 | Dec 26, 2025 | Initial document |
| v2 | Dec 26, 2025 | Added Facebook OAuth, Anonymous auth decisions and lessons learned |
| v3 | Dec 27, 2025 | Added OAuth token handling lesson (Lesson 7) |
| v4 | Dec 28, 2025 | Added auth UI blocking lesson (Lesson 8) |
| v5 | Jan 4, 2026 | Custom domain implementation complete (DEC-013), Facebook OAuth now Live |
| v6 | Jan 4, 2026 | Added beta_readers table decision (DEC-014) |

---

## Purpose

This document tracks all significant design decisions made during development, including rationale, alternatives considered, and lessons learned.

---

## Decision Log

### DEC-001: Unified Backend vs Per-Game Solutions

**Date:** December 26, 2025
**Status:** Implemented

**Decision:** Use a single Supabase project for all TecVooDoo games rather than separate backends per game.

**Rationale:**
- Single player identity across all games
- Reduced maintenance overhead
- Shared auth infrastructure
- Easier to add new games
- Stays within free tier longer

**Alternatives Considered:**
1. **Per-game Supabase projects** - More isolation but fragmented player identity
2. **Per-game auth (Google per game)** - Too much overhead for small games
3. **Custom backend** - Overkill for current scale

**Outcome:** Unified approach allows all three games to share the same player accounts and auth system.

---

### DEC-002: Supabase vs Alternatives

**Date:** December 26, 2025
**Status:** Implemented

**Decision:** Use Supabase as the backend platform.

**Rationale:**
- Already integrated with Dots & Boxes
- PostgreSQL is robust and familiar
- Built-in Realtime via WebSockets
- Built-in Auth with multiple providers
- Generous free tier
- Good Unity SDK available

**Alternatives Considered:**
1. **Firebase** - Good but more vendor lock-in, Firestore less flexible than PostgreSQL
2. **Cloudflare Workers + D1** - Already using for telemetry, but no built-in auth/realtime
3. **PlayFab** - Overkill, expensive, Unity-focused
4. **Custom Node.js + PostgreSQL** - More control but more maintenance

**Outcome:** Supabase provides the best balance of features and simplicity.

---

### DEC-003: Authentication Strategy

**Date:** December 26, 2025
**Status:** Implemented

**Decision:** Support anonymous play plus optional accounts with Magic Link + Google OAuth + Facebook OAuth.

**Rationale:**
- Anonymous allows quick play without friction
- Magic Link is simple (no passwords)
- Google is familiar to most users
- Facebook adds another popular option
- Accounts enable cross-device play and history

**Configuration:**
- Anonymous play: Enabled
- Magic Link: Enabled
- Google OAuth: Enabled (Live)
- Facebook OAuth: Enabled (Live - App Review completed Dec 28, 2025)

**Outcome:** Players can choose their preferred authentication level. All four methods tested and working.

---

### DEC-004: The Executioner as Unified AI

**Date:** December 26, 2025
**Status:** Implemented (Dots and Boxes)

**Decision:** Create a single AI identity ("The Executioner") that plays across all games rather than game-specific AIs.

**Rationale:**
- Consistent brand/personality across TecVooDoo games
- Existing DLYH AI infrastructure can be expanded
- Players develop relationship with recurring opponent
- Reduces AI development effort per game

**Implementation:**
- Single player record with fixed UUID
- `ai_config` JSONB stores shared personality traits
- Game-specific strategy modules
- Rubber-banding difficulty system shared across games

**Outcome:** Implemented for Dots and Boxes (Dec 28, 2025). Ported from DLYH Unity to JavaScript.

---

### DEC-005: Game State in JSONB Column

**Date:** December 26, 2025
**Status:** Implemented

**Decision:** Store game-specific state in a JSONB column rather than game-specific tables.

**Rationale:**
- Flexible schema per game
- No table proliferation
- Easy to add new games without migrations
- JSONB supports indexing if needed later

**Trade-offs:**
- Less type safety than dedicated columns
- Queries into state are less efficient
- No foreign key constraints within state

**Mitigation:**
- Games validate their own state structure
- Critical fields (status, current_turn) are in dedicated columns
- JSONB only for game-specific data

**Outcome:** Works well for turn-based games with moderate state size.

---

### DEC-006: 6-Character Game Codes

**Date:** December 26, 2025
**Status:** Implemented

**Decision:** Use 6-character alphanumeric codes for game session IDs.

**Rationale:**
- Easy to share verbally or via text
- ~2 billion combinations (sufficient)
- Removed ambiguous characters (0/O, 1/I/L)

**Character Set:** `ABCDEFGHJKMNPQRSTUVWXYZ23456789`

**Alternatives Considered:**
1. **UUIDs** - Too long to share
2. **4 characters** - Only ~1 million combinations
3. **Words** - Harder to implement, localization issues

**Outcome:** Players find codes easy to share and enter.

---

### DEC-007: Row Level Security Approach

**Date:** December 26, 2025
**Status:** Implemented

**Decision:** Use permissive RLS policies that allow anonymous access for game data.

**Rationale:**
- Games need to work without mandatory login
- Game codes provide sufficient access control
- No sensitive data in game tables
- Simpler client code

**Policies Applied:**
- SELECT: Open (anyone can read)
- INSERT: Open (anyone can create games/players)
- UPDATE: Restricted to participants (via player_id check)
- DELETE: Not allowed via client

**Trade-offs:**
- Less strict than typical app security
- Relies on obscurity of game codes
- Acceptable for non-competitive casual games

**Outcome:** Balances security with usability for casual gaming.

---

### DEC-008: Google Cloud Organization Setup

**Date:** December 26, 2025
**Status:** Implemented

**Decision:** Create Google Cloud project under tecvoodoo.com organization.

**Challenge:** Initial permission issues prevented project creation.

**Solution:**
1. Added Project Creator role to user at organization level
2. Created TecVooDoo project under tecvoodoo.com org
3. Configured OAuth consent screen as External
4. Created Web Application OAuth credentials

**Lesson Learned:** Google Workspace Super Admin doesn't automatically grant GCP permissions. IAM roles must be explicitly assigned at the organization level.

**Outcome:** OAuth credentials successfully created and integrated with Supabase.

---

### DEC-009: Realtime Publication Strategy

**Date:** December 26, 2025
**Status:** Implemented

**Decision:** Enable Realtime only for game-related tables, not all tables.

**Tables with Realtime:**
- `game_sessions` - Live game state
- `session_players` - Player join/leave

**Tables without Realtime:**
- `players` - Rarely changes, not time-sensitive
- `game_types` - Static data
- `games` (legacy) - Uses existing implementation
- `beta_readers` - No realtime needed

**Rationale:**
- Reduces unnecessary WebSocket traffic
- Only broadcast what clients actually need
- Can add more tables later if needed

**Outcome:** Efficient realtime updates for active games.

---

### DEC-010: Facebook OAuth Implementation

**Date:** December 26, 2025
**Status:** COMPLETE (Live as of December 28, 2025)

**Decision:** Add Facebook as third OAuth provider.

**Rationale:**
- Large user base
- Common in casual games
- User requested

**Implementation:**
- Created Meta Developer app "TecVooDoo"
- App ID: 1952579931987351
- App Status: **Live** (App Review completed Dec 28, 2025)
- Enabled "Allow users without email" in Supabase for Facebook edge cases

**Requirements Completed:**
- [x] App icon (1024x1024)
- [x] Privacy policy URL (tecvoodoo.com/privacy.html)
- [x] User data deletion instructions
- [x] Category selection (Games)
- [x] Facebook Login App Review

**Outcome:** Facebook OAuth fully operational for all users.

---

### DEC-011: Anonymous Authentication

**Date:** December 26, 2025
**Status:** Implemented

**Decision:** Enable anonymous sign-in for guest play.

**Rationale:**
- Reduces friction for casual players
- No account creation barrier
- Can upgrade to full account later

**Configuration:**
- Enabled in Supabase Auth settings
- Creates temporary session
- Limited to single device

**Outcome:** Players can start games immediately without signup.

---

## Pending Decisions

### DEC-012: Legacy games Table Migration

**Status:** Pending

**Question:** Should existing Dots & Boxes data be migrated to the new unified schema?

**Options:**
1. **Migrate** - Move data to game_sessions, deprecate games table
2. **Parallel** - Keep both, new games use new schema
3. **Leave as-is** - games table continues for D&B only

**Considerations:**
- Migration risks breaking existing saved games
- Parallel adds complexity
- Leave as-is creates inconsistency

**Decision:** TBD - Will revisit after other games are integrated.

---

### DEC-013: Supabase Custom Domain

**Status:** COMPLETE (January 4, 2026)

**Problem:** The default Supabase URL (`eenuxdjmsibcfhzgtslx.supabase.co`) looks unprofessional and suspicious to users during OAuth flows. When signing in with Google or Facebook, users see this cryptic domain in the consent screen instead of a recognizable TecVooDoo domain.

**Solution:** `api.tecvoodoo.com` custom domain

**Pro Tier:** Upgraded January 1, 2026 ($25/month)

**Implementation Completed (January 4, 2026):**
1. [x] **Supabase Dashboard:** Added custom domain `api.tecvoodoo.com`
2. [x] **Cloudflare DNS:** Added CNAME record `api` -> `eenuxdjmsibcfhzgtslx.supabase.co` (DNS only, no proxy)
3. [x] **Cloudflare DNS:** Added TXT record for ACME challenge verification
4. [x] **Google Cloud Console:** Updated redirect URI to `https://api.tecvoodoo.com/auth/v1/callback`
5. [x] **Meta Developer Console:** Updated redirect URI and app domains to use `api.tecvoodoo.com`
6. [x] **Client Code:** Updated `SUPABASE_URL` in all 7 website files
7. [x] **Test:** Verified all OAuth flows work with new domain (January 4, 2026)

**Files Updated:**
- `site/games/dots-and-boxes/index.html`
- `site/auth-test.html`
- `site/index.html`
- `site/books.html`
- `site/about.html`
- `site/games.html`
- `site/contact.html`

**Benefits:**
- Professional appearance in OAuth consent screens
- Users see `api.tecvoodoo.com` instead of cryptic Supabase URL
- Builds trust during authentication flow
- Consistent branding across all auth touchpoints

**Decision:** Custom domain fully configured and active.

---

### DEC-014: Beta Reader Signup System

**Status:** COMPLETE (January 4, 2026)

**Problem:** Need a way to collect beta reader signups for The M Particle Series (Murder, Malady and Monsters) from the website.

**Solution:** Use Supabase `beta_readers` table + Cloudflare Worker email notification

**Implementation:**
1. Created `beta_readers` table with email, name (optional), book_title, created_at
2. Added RLS: public insert, authenticated-only read
3. Added unique index on (email, book_title) to prevent duplicates
4. Updated Cloudflare Worker to handle `type: 'beta-reader'` requests
5. Worker sends notification email to stephenmbrandon@tecvoodoo.com
6. Created murder-malady-monsters.html with first 3 chapters preview
7. Added beta reader signup button at end of preview

**Rationale:**
- Leverages existing Supabase infrastructure
- No new services needed
- Email notification uses existing Cloudflare Worker
- Duplicate prevention built-in

**Outcome:** Users can sign up as beta readers from tecvoodoo.com/books. Author receives email notification with signup details.

---

## Lessons Learned

### Lesson 1: Permission Propagation Takes Time

When adding IAM roles in Google Cloud, changes may take several minutes to propagate. The console shows "Policy updated. It may take a few minutes for these changes to become active."

**Impact:** Retry operations after a brief wait if permission errors persist.

---

### Lesson 2: Supabase Tier Selection

**Free Tier (used Dec 26, 2025 - Jan 1, 2026):**
For indie game scale, the free tier provided ample resources:
- 500MB database (plenty for game state)
- 2GB bandwidth (sufficient for turn-based games)
- 50K MAUs (more than enough to start)

**Pro Tier (upgraded January 1, 2026 - $25/month):**
Upgraded primarily for custom domain feature:
- Custom domain support (main reason for upgrade)
- 8GB database, 50GB bandwidth
- More concurrent connections
- Better support

**Impact:** Custom domain allows professional OAuth consent screens instead of cryptic `eenuxdjmsibcfhzgtslx.supabase.co` URL.

---

### Lesson 3: RLS Policies Need Testing

Row Level Security can silently filter results. If queries return empty when they shouldn't:
1. Check if RLS is enabled
2. Verify the policy conditions
3. Test with service role key to bypass RLS

**Impact:** Always test RLS policies from client perspective.

---

### Lesson 4: OAuth Redirect URL Whitespace Matters

Google OAuth returned a 500 error with "invalid character ' ' in host name" due to a trailing space in the redirect URL configuration.

**Impact:** Always trim/verify redirect URLs. Copy-paste can introduce hidden whitespace.

---

### Lesson 5: Facebook OAuth Requires Domain Configuration

Facebook OAuth fails with "Can't load URL" error if app domains are not configured. The Supabase callback domain must be in the Facebook app's "App Domains" list.

**Configuration needed:**
- App Domains: `api.tecvoodoo.com`
- Valid OAuth Redirect URIs: `https://api.tecvoodoo.com/auth/v1/callback`

**Impact:** Configure both App Domains AND redirect URIs in Facebook app settings.

---

### Lesson 6: Facebook Development Mode Limits

Facebook apps in Development mode only allow administrators/developers/testers to authenticate. The "Invalid Scopes: email" error can appear for non-authorized users.

**Solutions:**
1. Add users as testers in App Roles (for testing)
2. Complete app requirements and go Live (for production)

**Impact:** Plan for Facebook app review process if targeting public users.

**Update (Dec 28, 2025):** App Review completed, Facebook OAuth now Live for all users.

---

### Lesson 7: OAuth Token Handling on Redirect

**Date:** December 27, 2025

After OAuth redirect, Supabase may not automatically process the tokens in the URL hash. The `onAuthStateChange` listener fires, but `getSession()` can return stale cached data, causing the UI to show "signed out" even though tokens are present.

**Symptoms:**
- Sign in works first time after page load
- Sign out works
- Sign back in redirects with tokens in URL (`#access_token=...`)
- UI shows signed out state despite tokens in URL
- Hard refresh or browser restart fixes it

**Root Cause:**
- `getSession()` returns cached session data, not fresh server state
- `onAuthStateChange` callbacks may fire before session is fully established
- URL hash tokens aren't always processed automatically by the Supabase client

**Solution:**
Process OAuth tokens manually FIRST, before any other auth initialization:

```javascript
async function initAuth() {
    // FIRST: Check if there are OAuth tokens in the URL hash
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken) {
            const { data, error } = await supabaseClient.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || ''
            });

            if (!error && data?.user) {
                window.history.replaceState(null, '', window.location.pathname);
                // Update UI directly from result
                updateAuthUI(data.user);
                return; // Auth handled, skip rest
            }
        }
    }

    // Continue with normal auth check using getUser() instead of getSession()
    const { data: { user } } = await supabaseClient.auth.getUser();
    // ...
}
```

**Key Points:**
1. Extract tokens from URL hash BEFORE setting up `onAuthStateChange` listeners
2. Use `setSession()` to establish the session explicitly
3. Update UI directly from the `setSession()` result, don't wait for callbacks
4. Use `getUser()` instead of `getSession()` for fresh server state
5. Configure client with explicit auth options:
   ```javascript
   supabaseClient = window.supabase.createClient(URL, KEY, {
       auth: {
           detectSessionInUrl: true,
           flowType: 'implicit',
           autoRefreshToken: true,
           persistSession: true
       }
   });
   ```

**Impact:** Always process OAuth redirect tokens manually at the start of initialization for reliable sign-in after redirect.

---

### Lesson 8: Don't Block Auth UI on Database Queries

**Date:** December 28, 2025

When a page needs to create or look up records in the database after auth (e.g., `ensurePlayerRecord()` to create a player record), do NOT await these queries in the `onAuthStateChange` handler. Database queries can hang due to network issues, RLS policies, or other factors, blocking the entire auth flow.

**Symptoms:**
- User signs in on one page, navigates to another page
- Second page shows "Sign In" button even though user is authenticated
- Console shows auth event fired but UI never updates
- Hard refresh or signing in again on that page works

**Root Cause:**
- `onAuthStateChange` handler used `await ensurePlayerRecord()`
- The database query hung (never resolved or rejected)
- `updateAuthUI()` was never called because it came after the await
- UI remained in "signed out" state despite valid session

**Bad Pattern:**
```javascript
supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
        currentUser = session.user;
        await ensurePlayerRecord();  // BLOCKS if this hangs
        updateAuthUI();              // Never reached
    }
});
```

**Solution:**
Update the UI IMMEDIATELY when auth state changes, then run database operations in the background:

```javascript
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        currentUser = session.user;
        updateAuthUI();  // Update UI FIRST

        // Run database ops in background (don't await)
        ensurePlayerRecord().then(id => {
            currentPlayerId = id;
            loadMyGames();
        }).catch(err => {
            console.error('Player record failed:', err);
            loadMyGames(); // Still load games even if record fails
        });
    }
});
```

**Key Points:**
1. Never use `async` on `onAuthStateChange` callback when you have blocking operations
2. Update UI immediately from session data - don't wait for database
3. Use `.then()/.catch()` for background operations instead of `await`
4. Always have error handling that still completes the flow
5. The UI should reflect auth state independently of database state

**Impact:** Auth UI must respond instantly to auth events. Database operations are secondary and should never block the user experience.

---

**End of Design Decisions Document**
