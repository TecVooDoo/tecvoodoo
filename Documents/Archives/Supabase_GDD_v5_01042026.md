# TecVooDoo Supabase Backend - Design Document

**Version:** 5
**Date Created:** 12/26/2025
**Last Updated:** 01/04/2026
**Developer:** TecVooDoo LLC
**Purpose:** Unified multiplayer backend for all TecVooDoo games

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v1 | Dec 26, 2025 | Initial document |
| v2 | Dec 26, 2025 | Updated auth options (Facebook, Anonymous now implemented) |
| v3 | Dec 27, 2025 | Version bump (OAuth token handling lesson in DesignDecisions) |
| v4 | Dec 28, 2025 | Version bump (Auth UI blocking lesson in DesignDecisions) |
| v5 | Jan 4, 2026 | Custom domain (api.tecvoodoo.com), Pro tier, Facebook OAuth Live, Executioner AI implemented |

---

## High Concept

A centralized backend service that provides authentication, matchmaking, and real-time game state synchronization for all TecVooDoo games. Players can use a single identity across all games, play against friends online, or challenge The Executioner AI.

**Key Features:**
- Single sign-on across all TecVooDoo games
- Play vs friends (online, real-time or async)
- Play vs AI (The Executioner)
- Cross-platform support (Web, Unity/PC, Unity/Mobile)
- Professional branding with custom domain (api.tecvoodoo.com)

---

## Supported Games

### Currently Integrated

| Game | Platform | Player Count | AI Support |
|------|----------|--------------|------------|
| Dots and Boxes | Web (HTML5) | 2 | Yes (implemented Dec 28, 2025) |
| Don't Lose Your Head | Unity (WebGL/PC/Mobile) | 2 | Yes (existing) |
| Shrunken Head Toss | Unity (WebGL/PC/Mobile) | 2 | Planned |

### Future Games

Any new TecVooDoo game can integrate with this backend by:
1. Adding a row to `game_types` table
2. Implementing the session/player API
3. Storing game-specific state in the `state` JSONB column

---

## Player Experience

### Authentication Options

1. **Anonymous/Guest Play**
   - No account required
   - Can play local games or vs AI
   - Limited to single device (no cross-device resume)
   - Status: **Implemented**

2. **Magic Link (Email)**
   - Enter email, receive login link
   - No password to remember
   - Cross-device game history
   - Status: **Implemented**

3. **Google Sign-In**
   - One-click authentication
   - Uses existing Google account
   - Cross-device game history
   - OAuth consent screen shows "tecvoodoo.com"
   - Status: **Implemented**

4. **Facebook Sign-In**
   - One-click authentication
   - Uses existing Facebook account
   - Cross-device game history
   - Status: **Implemented** (Live - App Review completed Dec 28, 2025)

### Game Flow

```
1. Player opens game
        |
        v
2. Choose: [Play vs Friend] or [Play vs AI] or [Find Match]
        |
        +---> [Play vs AI]
        |           |
        |           v
        |     Select difficulty (Easy/Normal/Hard)
        |           |
        |           v
        |     Game starts immediately
        |
        +---> [Find Match]
        |           |
        |           v
        |     Queue for 5 seconds
        |           |
        |     +-----+-----+
        |     |           |
        |     v           v
        |   Match       No match
        |   found       (phantom AI)
        |     |           |
        |     v           v
        |   Play vs   Play vs AI
        |   human     (player doesn't know)
        |
        +---> [Play vs Friend]
                    |
                    v
            [Create Game] or [Join Game]
                    |
        +-----------+-----------+
        |                       |
        v                       v
   Create Game             Join Game
   Get 6-char code         Enter code
   Share with friend       or click link
        |                       |
        v                       v
   Wait for opponent       Join session
        |                       |
        +----------+------------+
                   |
                   v
            Game starts when both ready
                   |
                   v
            Real-time turns via Supabase
                   |
                   v
            Game ends, results saved
```

---

## The Executioner AI

### Concept

A unified AI opponent with a consistent personality across all TecVooDoo games. The Executioner adapts its strategy to each game while maintaining core characteristics:

- Dark, theatrical personality
- Adjusts difficulty based on player performance (rubber-banding)
- Simulated "think time" for human-like feel (0.8-2.5 seconds)
- Never truly random, never perfect

### Skill System

| Difficulty | Skill Range | Behavior |
|------------|-------------|----------|
| Easy | 0.25 - 0.45 | Makes obvious mistakes, slower to optimize |
| Normal | 0.45 - 0.70 | Balanced challenge, occasional mistakes |
| Hard | 0.70 - 0.95 | Near-optimal play, rarely makes errors |

**Note:** Player difficulty selection is INVERTED for AI - selecting "Easy" makes the AI play on Hard internally, and vice versa. This creates the expected experience where "Easy" mode means an easy game for the player.

### Rubber-Banding

The AI adjusts its effective skill based on player performance:
- Player on winning streak -> AI skill increases slightly
- Player struggling -> AI skill decreases slightly
- Prevents frustration while maintaining challenge

### Game-Specific Strategies

| Game | AI Strategy Module | Status |
|------|-------------------|--------|
| Dots and Boxes | Line placement, chain detection, sacrifice plays | Implemented |
| DLYH | Letter frequency, pattern matching, word guessing | Existing |
| Shrunken Head Toss | Trajectory calculation, zone targeting | Planned |

### Phantom AI (Matchmaking Fallback)

When matchmaking times out (5 seconds), the system creates a "phantom" opponent:
- Uses random name and color
- Player doesn't know they're playing AI
- AI plays at Normal difficulty
- Provides seamless experience when no human match available

---

## Session Management

### Game Codes

- 6-character alphanumeric codes
- Characters: A-Z (no I, O) + 2-9 (no 0, 1)
- ~2 billion combinations
- Easy to read/type, unambiguous

### Session States

| Status | Description |
|--------|-------------|
| waiting | Created, waiting for opponent |
| active | Both players joined, game in progress |
| completed | Game finished normally |
| abandoned | Game cancelled or timed out |

### Session Lifecycle

```
[waiting] ---(player 2 joins)---> [active]
[active] ---(game ends)---> [completed]
[waiting/active] ---(timeout/cancel)---> [abandoned]
```

---

## Real-Time Synchronization

### Update Flow

```
Player A makes move
        |
        v
Update game_sessions.state in Supabase
        |
        v
Supabase Realtime broadcasts change
        |
        v
Player B receives update via WebSocket
        |
        v
Player B's UI updates
```

### Latency Considerations

- Turn-based games: Latency is acceptable (async-friendly)
- Real-time games (SHT): May need client-side prediction
- All state changes go through server (authoritative)

---

## Data Persistence

### What's Stored

| Data | Persistence |
|------|-------------|
| Player profiles | Permanent (until account deleted) |
| Game sessions | Permanent (for history/stats) |
| Game state | Until game completes |
| Auth tokens | Session-based (Supabase managed) |

### What's NOT Stored

- Passwords (Magic Link = passwordless)
- Sensitive personal data beyond email
- Chat messages (not implemented)

---

## Security Considerations

### Row Level Security

All tables have RLS enabled:
- Players can only update their own profiles
- Anyone can read game data (needed for joining)
- Game updates restricted to participants

### API Keys

| Key Type | Usage | Exposure |
|----------|-------|----------|
| Anon Key | Client-side (publishable) | Public |
| Service Role Key | Server-side only | Never expose |

### No Sensitive Data

- Game codes are short-lived and random
- No payment data stored
- Email only used for auth, not marketing

---

## Scalability

### Pro Tier Capacity (Current)

Current Pro tier supports:
- 8GB database
- 50GB bandwidth
- 100K monthly auth users
- Custom domain (api.tecvoodoo.com)

### Upgrade Path

If limits are reached:
- Team plan: $599/month
- Enterprise: Custom pricing
- Self-hosted option available

---

## Auth Test Page

A test page exists at `https://tecvoodoo.com/auth-test.html` for verifying authentication:

- Tests all four auth methods (Magic Link, Google, Facebook, Anonymous)
- Shows user ID, email, provider, and creation date
- Source: `E:\TecVooDoo\TecVooDooSite\site\auth-test.html`

---

## Future Enhancements

### Completed

- [x] Facebook authentication (Live Dec 28, 2025)
- [x] Anonymous authentication
- [x] The Executioner AI (Dots and Boxes)
- [x] Matchmaking with phantom AI fallback
- [x] Custom domain (api.tecvoodoo.com)
- [x] Email invites via Cloudflare Worker

### Planned

- [ ] Player statistics and history
- [ ] Leaderboards per game
- [ ] Friend lists
- [ ] Rematch functionality

### Possible

- [ ] Tournaments
- [ ] Achievements
- [ ] Player avatars
- [ ] Spectator mode
- [ ] Discord OAuth integration

---

**End of Design Document**
