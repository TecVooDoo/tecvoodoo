# TecVooDoo Supabase Backend - Project Instructions

**Project:** TecVooDoo Unified Multiplayer Backend
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Platform:** Supabase (PostgreSQL + Realtime + Auth)
**Project Path:** E:\TecVooDoo\Projects\Other\Supabase
**Document Version:** 3
**Last Updated:** December 27, 2025

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v1 | Dec 26, 2025 | Initial document |
| v2 | Dec 26, 2025 | Added Facebook OAuth setup, auth testing details |
| v3 | Dec 27, 2025 | Version bump (OAuth token handling lesson in DesignDecisions) |

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
| Configure URLs | Authentication > URL Configuration |

### SQL Editor Best Practices

1. **Name your queries** - Use the `##_description` format
2. **Test SELECT before UPDATE/DELETE** - Verify what you're changing
3. **Use transactions for multi-step changes** - Wrap in BEGIN/COMMIT
4. **Keep a backup query** - Before major changes, save current state

---

## Authentication Setup

### Current Providers

| Provider | Status | Dashboard Location |
|----------|--------|-------------------|
| Email (Magic Link) | Enabled | Authentication > Providers > Email |
| Google | Enabled | Authentication > Providers > Google |
| Facebook | Enabled | Authentication > Providers > Facebook |
| Anonymous | Enabled | Authentication > Settings |

### Google OAuth Setup

**Google Cloud Console:** https://console.cloud.google.com/
**Project:** TecVooDoo (under tecvoodoo.com organization)

1. APIs & Services > Credentials
2. OAuth 2.0 Client ID (Web application)
3. Authorized redirect URI: `https://eenuxdjmsibcfhzgtslx.supabase.co/auth/v1/callback`

### Facebook OAuth Setup

**Meta Developer Console:** https://developers.facebook.com/apps/1952579931987351/

1. App Settings > Basic:
   - App Domains: `tecvoodoo.com`
   - Contact email: Required

2. Use Cases > Facebook Login > Settings:
   - Valid OAuth Redirect URIs: `https://eenuxdjmsibcfhzgtslx.supabase.co/auth/v1/callback`

3. Use Cases > Facebook Login > Permissions:
   - `email` - Ready for testing
   - `public_profile` - Ready for testing

4. App Roles > Roles:
   - Add testers here for development mode testing

**To Go Live (Public Users):**
- Add App icon (1024x1024)
- Add Privacy Policy URL
- Configure User Data Deletion
- Select Category
- Submit for Login Review

### URL Configuration (Supabase)

**Location:** Authentication > URL Configuration

| Setting | Current Value |
|---------|---------------|
| Site URL | https://tecvoodoo.com |
| Redirect URLs | https://tecvoodoo.com/* |
| | https://dlyh.tecvoodoo.com/* |
| | https://dotsandboxes.tecvoodoo.com/* |

**Important:** No trailing spaces! Whitespace in URLs causes OAuth failures.

---

## Testing Authentication

### Auth Test Page

**URL:** https://tecvoodoo.com/auth-test.html
**Source:** `E:\TecVooDoo\TecVooDooSite\site\auth-test.html`

Tests all four authentication methods and displays:
- User ID
- Email
- Provider
- Creation timestamp

### Manual Testing Checklist

- [x] Can sign in with Magic Link (email)
- [x] Can sign in with Google
- [x] Can sign in with Facebook (admin only in dev mode)
- [x] Can sign in anonymously (guest)
- [ ] Can create game session
- [ ] Can join game session via code
- [ ] Realtime updates work between two clients
- [ ] RLS prevents unauthorized updates

### Test URLs

- Auth test page: https://tecvoodoo.com/auth-test.html
- Dots and Boxes: https://dotsandboxes.tecvoodoo.com
- DLYH: https://dlyh.tecvoodoo.com

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
const sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Unity (C#) - use supabase-csharp package
var supabase = new Supabase.Client(SUPABASE_URL, SUPABASE_ANON_KEY);
```

**Note:** Avoid naming the variable `supabase` in JavaScript as it conflicts with the global `window.supabase` object. Use `sbClient` or similar.

3. **Subscribe to realtime updates:**
```javascript
sbClient
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

## Troubleshooting

### Common Issues

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
| TecVooDoo Website | E:\TecVooDoo\TecVooDooSite (docs: E:\TecVooDoo\Projects\Other\TecVooDooWebsite\Documents) | Auth test page, hosts Dots & Boxes |
| Dots and Boxes | (in website) site\games\dots-and-boxes | Full integration |
| Don't Lose Your Head | E:\Unity\DontLoseYourHead | Multiplayer (planned) |
| Shrunken Head Toss | E:\Unity\ShrunkenHeadToss | Multiplayer (planned) |

---

## IMPORTANT: Website Footer Timestamp

**When making any changes that affect the live website (including auth-related changes), update the footer timestamp on all affected HTML pages.**

The TecVooDoo website footer includes:
```html
<span class="footer-updated">Updated: Dec 27, 2025</span>
```

See TV_ProjectInstructions for the full list of files and format details.

---

## External Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/eenuxdjmsibcfhzgtslx)
- [Supabase Docs](https://supabase.com/docs)
- [Google Cloud Console](https://console.cloud.google.com/) - TecVooDoo project for OAuth
- [Meta Developer Console](https://developers.facebook.com/apps/1952579931987351/) - Facebook OAuth
- [Supabase Unity SDK](https://github.com/supabase-community/supabase-csharp)

---

**End of Project Instructions**
