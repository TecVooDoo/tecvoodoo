# TecVooDoo Website - Architecture Document

**Project:** TecVooDoo Official Website
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Site URL:** https://tecvoodoo.com
**Project Path:** E:\TecVooDoo\TecVooDooSite
**Document Version:** 7
**Last Updated:** January 4, 2026

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v1 | Dec 25, 2025 | Initial document - documenting existing site |
| v2 | Dec 26, 2025 | Version bump (no content changes) |
| v3 | Dec 26, 2025 | Fixed deployment documentation - clarified local vs repo structure |
| v4 | Dec 27, 2025 | Simplified structure - local and repo now match (site/ folder) |
| v5 | Dec 28, 2025 | Version bump for auth UI blocking fix documentation |
| v6 | Dec 28, 2025 | Added Cloudflare Worker + Resend email infrastructure |
| v7 | Jan 4, 2026 | Updated Supabase URL to custom domain (api.tecvoodoo.com) |

---

## Technology Stack

### Current Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Markup | HTML5 | Semantic structure |
| Styling | CSS3 | Custom properties (variables) |
| Fonts | Google Fonts | Orbitron, Rajdhani |
| Icons | Font Awesome 6.4.0 | CDN hosted |
| Hosting | Cloudflare Pages | Static site hosting |
| Domain | tecvoodoo.com | Cloudflare DNS |
| Repository | GitHub | https://github.com/TecVooDoo/tecvoodoo |

### What We're NOT Using

| Technology | Reason |
|------------|--------|
| JavaScript frameworks | Overkill for static content |
| CSS frameworks | Custom design preferred |
| CMS | Static site is simpler |
| Backend | No dynamic content needed (except Supabase for games) |

---

## Hosting Architecture

### Cloudflare Pages

```
GitHub Repository (site/ folder)
       |
       v
Cloudflare Pages (build output: site/)
       |
       v
Cloudflare CDN (Global Distribution)
       |
       v
tecvoodoo.com
```

### Subdomains

| Subdomain | Purpose | Hosting | Source |
|-----------|---------|---------|--------|
| tecvoodoo.com | Main website | Cloudflare Pages | TecVooDoo/tecvoodoo repo (site/) |
| www.tecvoodoo.com | Main website (alias) | Cloudflare Pages | Same as above |
| dlyh.tecvoodoo.com | DLYH game | Cloudflare Pages (Unity WebGL) | Separate project |
| dotsandboxes.tecvoodoo.com | Dots and Boxes | Cloudflare Pages | Part of main site |

**Note:** Dots and Boxes game HTML is at `E:\TecVooDoo\TecVooDooSite\site\games\dots-and-boxes\`. Documentation for the game is maintained separately at `E:\TecVooDoo\Projects\Games\4 Playtesting\Dots and Boxes\Documents\`

### Redirects

The `_redirects` file handles URL routing:

```
# Current redirects
/home    /index.html    301
```

---

## File Structure

### Unified Structure (Local = Repository)

As of v4, the local folder structure and GitHub repo structure are now **identical**. All website files live in the `site/` folder, and Cloudflare deploys directly from that folder.

**Local and Repository Structure:**
```
TecVooDooSite/
├── .git/                   # Git repository
├── site/                   # Website files (deployed to Cloudflare)
│   ├── index.html
│   ├── about.html
│   ├── games.html
│   ├── books.html
│   ├── contact.html
│   ├── auth-test.html      # Supabase auth testing
│   ├── privacy.html        # Privacy policy (Facebook OAuth requirement)
│   ├── encapsulated-fear.html
│   ├── genie-in-a-test-tube.html
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── dlyh-concept.png
│   │   ├── dlyh-gameplay.png
│   │   ├── dots-boxes-gameplay.png
│   │   └── ...
│   ├── games/
│   │   └── dots-and-boxes/
│   │       └── index.html
│   ├── _redirects
│   ├── robots.txt
│   ├── sitemap.xml
│   └── tecvoodoo-logo-small.png
└── (Documents/ - stored separately, not in repo)
```

**Documentation Location:** `E:\TecVooDoo\Projects\Other\TecVooDooWebsite\Documents\`

---

## CSS Architecture

### CSS Variables (Custom Properties)

```css
:root {
    /* Colors */
    --bg-dark: #0a0a0a;
    --bg-card: #1a1a1a;
    --accent-cyan: #00f0c0;
    --accent-red: #ff3366;
    --text-primary: #ffffff;
    --text-muted: #888888;

    /* Typography */
    --font-heading: 'Orbitron', monospace;
    --font-body: 'Rajdhani', sans-serif;

    /* Spacing */
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;

    /* Effects */
    --border-radius: 15px;
    --transition-speed: 0.3s;
}
```

### CSS Organization

| Section | Purpose |
|---------|---------|
| Reset/Base | Normalize defaults |
| Typography | Font definitions |
| Layout | Grid, flexbox containers |
| Components | Cards, buttons, forms |
| Navigation | Header, mobile menu |
| Pages | Page-specific styles |
| Responsive | Media queries |

---

## Component Patterns

### Card Component

```html
<div class="card">
    <div class="card-icon">
        <i class="fas fa-gamepad"></i>
    </div>
    <h3 class="card-title">Games</h3>
    <p class="card-description">Play our games</p>
    <a href="games.html" class="card-link">Explore</a>
</div>
```

### Button Component

```html
<a href="#" class="btn btn-primary">Play Now</a>
<a href="#" class="btn btn-secondary">Learn More</a>
```

### Form Component

```html
<form class="contact-form">
    <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
    </div>
    <button type="submit" class="btn btn-primary">Send</button>
</form>
```

---

## Contact System

### Current Implementation

**Contact Form:**
- Uses `mailto:` link for form submission
- Simple, no backend required
- User's email client opens with pre-filled message

**Subscribe:**
- Email-based subscription system
- Send email to: updates+subscribe@tecvoodoo.com
- Manual list management

### Limitations

- No form validation beyond HTML5
- No spam protection
- No confirmation emails
- Manual subscriber management

### Future Considerations

| Option | Pros | Cons |
|--------|------|------|
| Formspree | Free tier, easy | Third-party dependency |
| Netlify Forms | If migrating | Platform lock-in |
| Custom backend | Full control | Complexity, cost |
| Buttondown | Newsletter focused | Monthly cost |

---

## Shared Game Infrastructure

All TecVooDoo games use shared infrastructure for authentication and email invites. This ensures consistency across games and reduces setup time for new games.

### Authentication (Supabase)

All games use TecVooDoo's Supabase project for authentication:

| Provider | Status | Notes |
|----------|--------|-------|
| Google OAuth | Live | Most common, trusted |
| Facebook OAuth | Live | Good for social/gaming audience |
| Magic Link | Live | Passwordless email sign-in |
| Anonymous | Live | Guest mode for quick play |
| Discord | Planned | Future addition |

**Supabase Project:** `api.tecvoodoo.com` (custom domain)
**Legacy URL:** `eenuxdjmsibcfhzgtslx.supabase.co` (still works)

### Email Invites (Cloudflare Worker + Resend)

All TecVooDoo games use a shared Cloudflare Worker + Resend API for email invites. This is a reusable system that any game on the website can leverage.

### Email Architecture

```
Game Client                    Cloudflare Worker              Resend API
+--------+                     +----------------+             +---------+
| Send   | --POST JSON-------> | tecvoodoo-     | --API-----> | Send    |
| Invite |                     | email Worker   |             | Email   |
+--------+                     +----------------+             +---------+
                                      |
                                      v
                               +-------------+
                               | RESEND_API_ |
                               | KEY (secret)|
                               +-------------+
```

### Worker Details

| Property | Value |
|----------|-------|
| URL | `https://tecvoodoo-email.runeduvall.workers.dev` |
| Method | POST |
| From Address | `TecVooDoo Games <noreply@tecvoodoo.com>` |

### Request Format

```javascript
{
    to: "email@example.com",
    playerName: "Stephen",      // Sender's name
    gameCode: "ABC123",         // Game-specific code
    gameLink: "https://...",    // Full game URL
    gameName: "Dots and Boxes"  // Optional, defaults to "Dots and Boxes"
}
```

### Currently Using

| Game | Uses Email Invites |
|------|-------------------|
| Dots and Boxes | Yes |
| Don't Lose Your Head | Planned |
| Shrunken Head Toss | Planned |

---

## Performance

### Current Optimizations

- Static HTML (no server processing)
- CDN distribution via Cloudflare
- Minimal JavaScript
- CSS in single file

### Metrics to Monitor

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |

### Optimization Opportunities

- Image optimization (WebP format)
- Font subsetting (only used characters)
- Critical CSS inlining
- Lazy loading for images

---

## Deployment Process

### Current Workflow (Simplified in v4)

```
1. Edit files in E:\TecVooDoo\TecVooDooSite\site\
2. Test locally (open HTML files in browser)
3. git add, commit, and push
4. Cloudflare Pages auto-deploys from site/ folder
5. Changes live in ~1-2 minutes
```

### Build Settings (Cloudflare Pages)

| Setting | Value |
|---------|-------|
| Build command | (none - static) |
| Build output directory | site |
| Root directory | / |
| Production branch | main |

**Note:** Cloudflare deploys from the `site/` folder in the repository.

---

## Security

### Current Measures

- HTTPS enforced via Cloudflare
- No user data storage (except via Supabase for games)
- Static content only
- Supabase RLS for game data

### Cloudflare Features

- DDoS protection
- SSL/TLS encryption
- Bot protection
- Rate limiting (if needed)

---

## Third-Party Dependencies

### External Resources

| Resource | URL | Purpose |
|----------|-----|---------|
| Google Fonts | fonts.googleapis.com | Orbitron, Rajdhani |
| Font Awesome | cdnjs.cloudflare.com | Icons |
| Supabase | api.tecvoodoo.com | Game auth and multiplayer |
| Cloudflare Worker | tecvoodoo-email.runeduvall.workers.dev | Game email invites |
| Resend | api.resend.com | Email delivery (via Worker) |

### Dependency Considerations

- Google Fonts: Privacy implications, consider self-hosting
- Font Awesome: Large library, could subset
- Supabase: Required for multiplayer games
- Cloudflare Worker + Resend: Required for email invites (API key stored as Cloudflare secret)
- Both fonts: Require internet for full experience

---

## Browser Support

### Target Browsers

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest 2 | Full |
| Firefox | Latest 2 | Full |
| Safari | Latest 2 | Full |
| Edge | Latest 2 | Full |
| Mobile Safari | Latest | Full |
| Chrome Android | Latest | Full |

### CSS Features Used

| Feature | Support | Fallback |
|---------|---------|----------|
| CSS Variables | 95%+ | None needed |
| Flexbox | 98%+ | None needed |
| Grid | 95%+ | Flexbox fallback |
| Transforms | 97%+ | None needed |

---

## Development Environment

### Local Development

```
Project Path: E:\TecVooDoo\TecVooDooSite
Site Files: E:\TecVooDoo\TecVooDooSite\site\

# Open in browser
Open site/index.html directly in browser

# Or use local server
python -m http.server 8000 --directory site
# Then visit http://localhost:8000
```

### Tools

| Tool | Purpose |
|------|---------|
| VS Code | Code editing |
| Chrome DevTools | Debugging, testing |
| Git | Version control |
| GitHub | Repository hosting |

### Repository

**GitHub:** https://github.com/TecVooDoo/tecvoodoo

```bash
cd E:\TecVooDoo\TecVooDooSite
git status
git add site/<filename>
git commit -m "Description"
git push origin main
```

---

## Future Architecture Considerations

### If Site Grows

| Scenario | Solution |
|----------|----------|
| More pages | Consider static site generator (11ty, Hugo) |
| Dynamic content | Headless CMS (Contentful, Strapi) |
| User accounts | Already using Supabase |
| E-commerce | Snipcart, Stripe integration |

### If Traffic Grows

- Current Cloudflare Pages handles scale well
- Consider caching strategies
- Monitor bandwidth usage

---

**End of Architecture Document**
