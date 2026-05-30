# TecVooDoo Supabase Backend - Architecture Document

**Version:** 4
**Date Created:** 12/26/2025
**Last Updated:** 12/28/2025
**Developer:** TecVooDoo LLC
**Platform:** Supabase (PostgreSQL + Realtime + Auth)
**Project Name:** dots-and-boxes (handles all TecVooDoo games)

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v1 | Dec 26, 2025 | Initial document |
| v2 | Dec 26, 2025 | Added Facebook OAuth, Anonymous auth, URL Configuration |
| v3 | Dec 27, 2025 | Version bump (OAuth token handling lesson in DesignDecisions) |
| v4 | Dec 28, 2025 | Version bump (Auth UI blocking lesson in DesignDecisions) |

---

## Technology Stack

### Supabase Services

| Service | Purpose |
|---------|---------|
| PostgreSQL Database | Game state, player data, sessions |
| Realtime | Live game updates via WebSocket subscriptions |
| Auth | Magic Link + Google OAuth + Facebook OAuth + Anonymous |
| Row Level Security | Data access control |

### Project Details

| Property | Value |
|----------|-------|
| Project URL | https://eenuxdjmsibcfhzgtslx.supabase.co |
| Project ID | eenuxdjmsibcfhzgtslx |
| Region | AWS us-east-2 |
| Plan | Free (Nano) |

### External Integrations

| Service | Purpose |
|---------|---------|
| Google Cloud (TecVooDoo project) | OAuth credentials for Google Sign-In |
| Meta Developer Console | OAuth credentials for Facebook Sign-In |
| Cloudflare Pages | Hosts web games that connect to Supabase |

---

## System Overview

```
+------------------+     +------------------+     +------------------+
|  Dots & Boxes    |     |      DLYH        |     | Shrunken Head    |
|   (Web/HTML5)    |     |     (Unity)      |     |  Toss (Unity)    |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         +------------------------+------------------------+
                                  |
                    +-------------v-------------+
                    |        Supabase           |
                    |   eenuxdjmsibcfhzgtslx    |
                    +-------------+-------------+
                                  |
         +------------------------+------------------------+
         |                        |                        |
+--------v--------+    +----------v----------+    +--------v--------+
|   PostgreSQL    |    |      Realtime       |    |      Auth       |
|   (Database)    |    |    (WebSockets)     |    | (Magic Link +   |
|                 |    |                     |    | Google + FB +   |
|                 |    |                     |    |   Anonymous)    |
+-----------------+    +---------------------+    +-----------------+
```

---

## Database Schema

### Tables Overview

| Table | Purpose | RLS |
|-------|---------|-----|
| players | User profiles (human + AI) | Enabled |
| game_types | Registry of available games | Enabled |
| game_sessions | Active/completed game instances | Enabled |
| session_players | Links players to sessions | Enabled |
| games | Legacy Dots & Boxes table | Enabled |

### players Table

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| id | UUID | gen_random_uuid() | Primary key |
| display_name | TEXT | 'Player' | Shown in games |
| email | TEXT | NULL | For authenticated users |
| auth_id | UUID | NULL | Links to Supabase Auth |
| is_ai | BOOLEAN | FALSE | TRUE for AI players |
| ai_config | JSONB | NULL | AI personality/settings |
| created_at | TIMESTAMPTZ | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOW() | Auto-updated on change |

**Special Records:**
- The Executioner AI: `id = 00000000-0000-0000-0000-000000000001`

### game_types Table

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| id | TEXT | - | Primary key (slug) |
| name | TEXT | - | Display name |
| description | TEXT | NULL | Game description |
| min_players | INT | 2 | Minimum players |
| max_players | INT | 2 | Maximum players |
| supports_ai | BOOLEAN | TRUE | Can play vs AI |
| created_at | TIMESTAMPTZ | NOW() | Creation timestamp |

**Registered Games:**
- `dots-and-boxes` - Dots and Boxes
- `dlyh` - Don't Lose Your Head
- `shrunken-head-toss` - Shrunken Head Toss

### game_sessions Table

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| id | TEXT | - | Primary key (6-char code) |
| game_type | TEXT | - | FK to game_types |
| state | JSONB | {} | Game-specific state |
| status | TEXT | 'waiting' | waiting/active/completed/abandoned |
| is_vs_ai | BOOLEAN | FALSE | Playing against AI |
| ai_difficulty | TEXT | 'normal' | easy/normal/hard |
| current_turn | INT | 1 | Current player's turn |
| winner_player_number | INT | NULL | Winner (1 or 2) |
| created_by | UUID | NULL | FK to players |
| created_at | TIMESTAMPTZ | NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOW() | Auto-updated on change |

### session_players Table

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| session_id | TEXT | - | FK to game_sessions (PK) |
| player_id | UUID | - | FK to players (PK) |
| player_number | INT | - | 1 or 2 (unique per session) |
| color | TEXT | NULL | Player's chosen color |
| score | INT | 0 | Current score |
| joined_at | TIMESTAMPTZ | NOW() | When player joined |

### games Table (Legacy)

Original Dots & Boxes table - still in use for backward compatibility.

| Column | Type | Default | Purpose |
|--------|------|---------|---------|
| id | TEXT | - | Primary key (6-char code) |
| board_state | JSONB | {} | Grid, lines, boxes, colors |
| player1 | TEXT | - | Player 1 name |
| player2 | TEXT | NULL | Player 2 name |
| current_turn | INT2 | 1 | Current turn |
| score1 | INT2 | 0 | Player 1 score |
| score2 | INT2 | 0 | Player 2 score |
| created_at | TIMESTAMPTZ | NOW() | Creation timestamp |

---

## Authentication

### Providers Enabled

| Provider | Status | Notes |
|----------|--------|-------|
| Email (Magic Link) | Enabled | No password required |
| Google OAuth | Enabled | Via TecVooDoo GCP project |
| Facebook OAuth | Enabled | Via TecVooDoo Meta app |
| Anonymous | Enabled | Guest play without account |

### Google OAuth Details

| Property | Value |
|----------|-------|
| GCP Project | TecVooDoo (ID: tecvoodoo) |
| Client ID | 141325162522-1nro3r6bbpujbehhbskak1oqjbbiadih.apps.googleusercontent.com |
| Authorized Origins | https://eenuxdjmsibcfhzgtslx.supabase.co |
| Callback URL | https://eenuxdjmsibcfhzgtslx.supabase.co/auth/v1/callback |

### Facebook OAuth Details

| Property | Value |
|----------|-------|
| Meta App Name | TecVooDoo |
| App ID | 1952579931987351 |
| App Status | Development (Admin testing only) |
| App Domains | tecvoodoo.com |
| Callback URL | https://eenuxdjmsibcfhzgtslx.supabase.co/auth/v1/callback |
| Permissions | email, public_profile |

**Note:** Facebook app is in Development mode. To allow public users, must complete:
- App icon (1024x1024)
- Privacy policy URL
- User data deletion instructions
- Category selection
- Submit for Login Review

### URL Configuration (Supabase)

| Setting | Value |
|---------|-------|
| Site URL | https://tecvoodoo.com |
| Redirect URLs | https://tecvoodoo.com/* |
| | https://dlyh.tecvoodoo.com/* |
| | https://dotsandboxes.tecvoodoo.com/* |

### Auth Settings

| Setting | Value |
|---------|-------|
| Allow new signups | Yes |
| Confirm email | Yes |
| Allow anonymous sign-ins | Yes |
| Allow users without email (Facebook) | Yes |

---

## Row Level Security Policies

### players Table

| Policy | Action | Rule |
|--------|--------|------|
| Players are viewable by everyone | SELECT | true |
| Users can update own profile | UPDATE | auth.uid() = auth_id |
| Anyone can create a player | INSERT | true |

### game_types Table

| Policy | Action | Rule |
|--------|--------|------|
| Game types are viewable by everyone | SELECT | true |

### game_sessions Table

| Policy | Action | Rule |
|--------|--------|------|
| Game sessions are viewable by everyone | SELECT | true |
| Anyone can create game sessions | INSERT | true |
| Players can update their game sessions | UPDATE | Player is in session OR is creator |

### session_players Table

| Policy | Action | Rule |
|--------|--------|------|
| Session players are viewable by everyone | SELECT | true |
| Anyone can join games | INSERT | true |
| Players can update own session data | UPDATE | player_id matches auth |

### games Table (Legacy)

| Policy | Action | Rule |
|--------|--------|------|
| Games are viewable by everyone | SELECT | true |
| Anyone can create games | INSERT | true |
| Anyone can update games | UPDATE | true |

---

## Realtime Subscriptions

Enabled for:
- `game_sessions` - Live game state updates
- `session_players` - Player join/leave events

### Subscription Pattern

```javascript
supabaseClient
    .channel(`game-${gameCode}`)
    .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${gameCode}` },
        (payload) => { /* handle update */ }
    )
    .subscribe();
```

---

## Performance & Indexes

| Index | Table | Columns |
|-------|-------|---------|
| idx_game_sessions_status | game_sessions | status |
| idx_game_sessions_game_type | game_sessions | game_type |
| idx_game_sessions_created_by | game_sessions | created_by |
| idx_session_players_player_id | session_players | player_id |

---

## Triggers

### updated_at Auto-Update

Applied to:
- `players`
- `game_sessions`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
```

---

## Free Tier Limits

| Resource | Limit | Current Usage |
|----------|-------|---------------|
| Database Size | 500 MB | Minimal |
| Bandwidth | 2 GB/month | Minimal |
| Auth MAUs | 50,000 | Minimal |
| Realtime Connections | Included | Minimal |
| Edge Function Invocations | 500,000/month | 0 |

---

## SQL Migration Files

Stored in Supabase SQL Editor as saved queries:
- `01_create_tables` - Creates all tables and The Executioner
- `02_rls_policies` - Enables RLS and creates all policies

---

**End of Architecture Document**
