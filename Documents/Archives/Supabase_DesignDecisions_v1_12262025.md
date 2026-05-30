# TecVooDoo Supabase Backend - Design Decisions

**Project:** TecVooDoo Unified Multiplayer Backend
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Document Version:** 1
**Last Updated:** December 26, 2025

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

**Decision:** Support both anonymous play and optional accounts with Magic Link + Google OAuth.

**Rationale:**
- Anonymous allows quick play without friction
- Magic Link is simple (no passwords)
- Google is familiar to most users
- Accounts enable cross-device play and history

**Configuration:**
- Anonymous play: Supported for local/AI games
- Magic Link: Enabled
- Google OAuth: Enabled
- Facebook: Planned for future

**Outcome:** Players can choose their preferred authentication level.

---

### DEC-004: The Executioner as Unified AI

**Date:** December 26, 2025
**Status:** Designed (Implementation Pending)

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

**Outcome:** Design approved, implementation to follow per-game.

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

**Rationale:**
- Reduces unnecessary WebSocket traffic
- Only broadcast what clients actually need
- Can add more tables later if needed

**Outcome:** Efficient realtime updates for active games.

---

## Pending Decisions

### DEC-010: Legacy games Table Migration

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

### DEC-011: Facebook Authentication

**Status:** Planned

**Question:** Should Facebook OAuth be added?

**Rationale for yes:**
- User requested as future option
- Large user base
- Common in casual games

**Concerns:**
- Facebook developer approval process
- Privacy policy requirements
- Maintenance overhead

**Decision:** Will implement after Google+Magic Link are proven stable.

---

## Lessons Learned

### Lesson 1: Permission Propagation Takes Time

When adding IAM roles in Google Cloud, changes may take several minutes to propagate. The console shows "Policy updated. It may take a few minutes for these changes to become active."

**Impact:** Retry operations after a brief wait if permission errors persist.

---

### Lesson 2: Supabase Free Tier is Generous

For indie game scale, the free tier provides ample resources:
- 500MB database (plenty for game state)
- 2GB bandwidth (sufficient for turn-based games)
- 50K MAUs (more than enough to start)

**Impact:** No immediate need to plan for paid tier.

---

### Lesson 3: RLS Policies Need Testing

Row Level Security can silently filter results. If queries return empty when they shouldn't:
1. Check if RLS is enabled
2. Verify the policy conditions
3. Test with service role key to bypass RLS

**Impact:** Always test RLS policies from client perspective.

---

**End of Design Decisions Document**
