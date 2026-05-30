# TecVooDoo Supabase Backend - Project Instructions

**Project:** TecVooDoo Unified Multiplayer Backend
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Platform:** Supabase (PostgreSQL + Realtime + Auth)
**Project Path:** E:\TecVooDoo\Projects\Other\Supabase
**Document Version:** 1
**Last Updated:** December 26, 2025

---

## IMPORTANT: Supabase Project Details

**Project URL:** `https://eenuxdjmsibcfhzgtslx.supabase.co`
**Dashboard:** `https://supabase.com/dashboard/project/eenuxdjmsibcfhzgtslx`
**Organization:** TecVooDoo

This is a shared backend used by ALL TecVooDoo games. Changes affect multiple projects.

---

## Critical Development Protocols

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

This maintains execution order and history.

### Credential Security

**CRITICAL: Never expose service role key**

| Key | Safe to Share | Usage |
|-----|---------------|-------|
| Anon Key | Yes (publishable) | Client-side code |
| Service Role Key | NO - NEVER | Server-side only |

- Anon key is already in web game code (this is normal)
- Service role key should NEVER be in client code or git repos

---

## Document Management

### Core Document Naming Convention

**Format:** `Supabase_DocumentName_v#_MMDDYYYY.md`

**Rules:**
- All core documents share the SAME version number
- Increment version for ALL documents when ANY document is updated
- If a document has no changes, update the filename only (no content changes needed)
- Move old versions to `Documents/Archives/` folder

**Core Documents:**
- `Supabase_ProjectInstructions_v#_MMDDYYYY.md` - This file
- `Supabase_GDD_v#_MMDDYYYY.md` - Design document
- `Supabase_Architecture_v#_MMDDYYYY.md` - Technical architecture
- `Supabase_DesignDecisions_v#_MMDDYYYY.md` - Decisions and rationale

**Example version bump:**
```
v1 -> v2 (all four files)
Old files moved to Documents/Archives/
```

### When to Update Version

Increment version when:
- Adding new tables or columns
- Changing RLS policies
- Adding/removing auth providers
- Significant architecture changes
- Any change that affects how games connect

Do NOT increment for:
- Minor documentation fixes
- Adding comments to SQL

---

## Supabase Dashboard Operations

### Common Tasks

| Task | Location |
|------|----------|
| View/edit data | Table Editor |
| Run SQL | SQL Editor |
| Manage auth providers | Authentication > Sign In / Providers |
| View users | Authentication > Users |
| Check RLS policies | Authentication > Policies |
| Monitor usage | Project Settings > Usage |
| Get API keys | Project Settings > API |

### SQL Editor Best Practices

1. **Name your queries** - Use the `##_description` format
2. **Test SELECT before UPDATE/DELETE** - Verify what you're changing
3. **Use transactions for multi-step changes** - Wrap in BEGIN/COMMIT
4. **Keep a backup query** - Before major changes, save current state

---

## Integration Guide

### Connecting a New Game

1. **Register game type:**
```sql
INSERT INTO game_types (id, name, description, min_players, max_players, supports_ai)
VALUES ('game-slug', 'Game Name', 'Description', 2, 2, true);
```

2. **Use the Supabase client:**
```javascript
// Web (JavaScript)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Unity (C#) - use supabase-csharp package
var supabase = new Supabase.Client(SUPABASE_URL, SUPABASE_ANON_KEY);
```

3. **Subscribe to realtime updates:**
```javascript
supabase
    .channel(`game-${sessionId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` }, handleUpdate)
    .subscribe();
```

### Game State Storage

Store game-specific state in `game_sessions.state` (JSONB):

```javascript
// Example for Dots and Boxes
{
    "gridSize": 4,
    "lines": { "h_0_0": 1, "v_0_0": 2 },
    "boxes": { "0_0": 1 },
    "color1": "#00f0c0",
    "color2": "#ff3366"
}
```

---

## The Executioner AI

### Reserved Player ID

The Executioner has a fixed UUID:
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

Games can read this to initialize AI behavior.

---

## Testing

### Manual Testing Checklist

- [ ] Can create anonymous player
- [ ] Can sign in with Magic Link
- [ ] Can sign in with Google
- [ ] Can create game session
- [ ] Can join game session via code
- [ ] Realtime updates work between two clients
- [ ] RLS prevents unauthorized updates

### Test URLs

- Magic Link test: Use Supabase Auth UI or custom form
- Google OAuth: Redirect to Supabase auth endpoint
- Realtime: Open game in two browser tabs

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| RLS blocking queries | Check policies match your query pattern |
| Realtime not working | Verify table is in `supabase_realtime` publication |
| Google OAuth error | Check callback URL matches exactly |
| "No rows returned" | RLS might be filtering - check auth state |

### Checking RLS

```sql
-- Temporarily disable RLS to test (NEVER in production)
ALTER TABLE game_sessions DISABLE ROW LEVEL SECURITY;

-- Re-enable immediately after testing
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
```

### Viewing Realtime Publication

```sql
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
```

---

## Related Projects

| Project | Path | Uses Supabase For |
|---------|------|-------------------|
| TecVooDoo Website | E:\TecVooDoo\TecVooDooSite | Hosts Dots & Boxes |
| Dots and Boxes | E:\TecVooDoo\Projects\Games\4 Playtesting\Dots and Boxes | Full integration |
| Don't Lose Your Head | E:\Unity\DontLoseYourHead | Telemetry (separate), Multiplayer (planned) |
| Shrunken Head Toss | E:\Unity\ShrunkenHeadToss | Multiplayer (planned) |

---

## External Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/eenuxdjmsibcfhzgtslx)
- [Supabase Docs](https://supabase.com/docs)
- [Google Cloud Console](https://console.cloud.google.com/) - TecVooDoo project for OAuth
- [Supabase Unity SDK](https://github.com/supabase-community/supabase-csharp)

---

**End of Project Instructions**
