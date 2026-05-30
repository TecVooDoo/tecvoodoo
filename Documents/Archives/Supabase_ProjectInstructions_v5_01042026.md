# TecVooDoo Supabase Backend - Project Instructions

**Project:** TecVooDoo Unified Multiplayer Backend
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Platform:** Supabase (PostgreSQL + Realtime + Auth)
**Project Path:** E:\TecVooDoo\Projects\Other\Supabase
**Document Version:** 5
**Last Updated:** January 4, 2026

---

## Shared Documentation

**This project follows TecVooDoo standards. Review these documents:**

| Document | Location | Purpose |
|----------|----------|---------|
| Core Protocols | `E:\TecVooDoo\Projects\Documents\CORE_DevelopmentProtocols.md` | Universal development rules |
| Web Standards | `E:\TecVooDoo\Projects\Documents\Type\TYPE_Web.md` | Web-specific patterns (includes Supabase) |

---

## Supabase Project Details

**Project URL:** `https://api.tecvoodoo.com` (custom domain - configured January 4, 2026)
**Legacy URL:** `https://eenuxdjmsibcfhzgtslx.supabase.co` (still works as fallback)
**Dashboard:** `https://supabase.com/dashboard/project/eenuxdjmsibcfhzgtslx`
**Organization:** TecVooDoo
**Project Name:** TecVooDoo-Games
**Plan:** Pro ($25/month - upgraded January 1, 2026)

This is a shared backend used by ALL TecVooDoo games. Changes affect multiple projects.

---

## Project Documents

| Document | Purpose |
|----------|---------|
| Supabase_GDD | Design document |
| Supabase_Architecture | Technical architecture |
| Supabase_DesignDecisions | Decisions and rationale |
| Supabase_ProjectInstructions | Development protocols (this document) |

**Naming Convention:** `Supabase_DocumentName_v#_MMDDYYYY.md`

All four documents share the same version number. Increment all when any document is updated.

---

## Critical Protocols

### Schema Changes Require Caution

**CRITICAL: Database changes are permanent**

- ALWAYS backup data before schema changes
- Test migrations on a development branch if possible
- Changes to tables can break existing games
- RLS policy changes affect all connected clients immediately

### SQL Query Naming Convention

**Format:** `##_description`

Save all SQL queries in Supabase SQL Editor with numbered prefixes:
- `01_create_tables` - Initial table creation
- `02_rls_policies` - Row Level Security policies
- `03_add_feature_x` - Future migrations

---

## Dashboard Operations

| Task | Location |
|------|----------|
| View/edit data | Table Editor |
| Run SQL | SQL Editor |
| Manage auth providers | Authentication > Sign In / Providers |
| View users | Authentication > Users |
| Check RLS policies | Authentication > Policies |
| Monitor usage | Project Settings > Usage |
| Get API keys | Project Settings > API |
| Configure URLs | Authentication > URL Configuration |
| Custom domain | Project Settings > General > Custom Domains |

---

## Authentication Setup

### Current Providers

| Provider | Status | Notes |
|----------|--------|-------|
| Email (Magic Link) | Live | Authentication > Providers > Email |
| Google | Live | Authentication > Providers > Google |
| Facebook | Live | App Review completed Dec 28, 2025 |
| Anonymous | Live | Authentication > Settings |

### OAuth Configuration

**Google Cloud Console:** https://console.cloud.google.com/
- Project: TecVooDoo
- Authorized JavaScript origins: `https://api.tecvoodoo.com`
- Redirect URI: `https://api.tecvoodoo.com/auth/v1/callback`

**Meta Developer Console:** https://developers.facebook.com/apps/1952579931987351/
- App domains: `api.tecvoodoo.com`
- Valid OAuth Redirect URIs: `https://api.tecvoodoo.com/auth/v1/callback`

### URL Configuration (Supabase)

**Location:** Authentication > URL Configuration

| Setting | Value |
|---------|-------|
| Site URL | https://tecvoodoo.com |
| Redirect URLs | https://tecvoodoo.com/* |
| | https://dlyh.tecvoodoo.com/* |
| | https://dotsandboxes.tecvoodoo.com/* |

**Important:** No trailing spaces! Whitespace in URLs causes OAuth failures.

---

## The Executioner AI

### Reserved Player ID

```
00000000-0000-0000-0000-000000000001
```

Use this ID when creating AI game sessions:
```sql
INSERT INTO session_players (session_id, player_id, player_number)
VALUES ('ABC123', '00000000-0000-0000-0000-000000000001', 2);
```

### AI Configuration

The `ai_config` JSONB column stores AI settings:
```json
{
    "personality": "executioner",
    "default_difficulty": "normal",
    "skill_range": [0.25, 0.95]
}
```

---

## Integration Guide

### Connecting a New Game

1. Register game type:
```sql
INSERT INTO game_types (id, name, description, min_players, max_players, supports_ai)
VALUES ('game-slug', 'Game Name', 'Description', 2, 2, true);
```

2. Use the Supabase client (see TYPE_Web.md for patterns)

3. Subscribe to realtime updates:
```javascript
sbClient
    .channel(`game-${sessionId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` }, handleUpdate)
    .subscribe();
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| RLS blocking queries | Check policies match your query pattern |
| Realtime not working | Verify table is in `supabase_realtime` publication |
| Google OAuth error | Check callback URL matches exactly, no trailing spaces |
| Facebook "Can't load URL" | Add domain to App Domains in Meta console |
| Facebook "Invalid Scopes" | Add user as tester, or complete app review |
| "No rows returned" | RLS might be filtering - check auth state |
| JS error "supabase already declared" | Rename variable to `sbClient` |

### Checking RLS

```sql
-- View realtime publication tables
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

---

## Related Projects

| Project | Uses Supabase For |
|---------|-------------------|
| TecVooDoo Website | Auth test page |
| Dots and Boxes | Full integration (auth, multiplayer, realtime) |
| Don't Lose Your Head | Multiplayer (planned) |
| Shrunken Head Toss | Multiplayer (planned) |

---

## External Resources

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard/project/eenuxdjmsibcfhzgtslx |
| Supabase Docs | https://supabase.com/docs |
| Google Cloud Console | https://console.cloud.google.com/ |
| Meta Developer Console | https://developers.facebook.com/apps/1952579931987351/ |
| Supabase Unity SDK | https://github.com/supabase-community/supabase-csharp |

---

**End of Project Instructions**

Review CORE_DevelopmentProtocols.md and TYPE_Web.md for full development standards.
