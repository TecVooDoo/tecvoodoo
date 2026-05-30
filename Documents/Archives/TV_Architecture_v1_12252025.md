# TecVooDoo Website - Architecture Document

**Project:** TecVooDoo Official Website
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Site URL:** https://tecvoodoo.com
**Project Path:** E:\TecVooDoo\TecVooDooSite
**Document Version:** 1
**Last Updated:** December 25, 2025

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v1 | Dec 25, 2025 | Initial document - documenting existing site |

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
| Backend | No dynamic content needed |

---

## Hosting Architecture

### Cloudflare Pages

```
GitHub Repository
       |
       v
Cloudflare Pages (Build)
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
| tecvoodoo.com | Main website | Cloudflare Pages | TecVooDooSite repo |
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

```
TecVooDooSite/
├── site/
│   ├── index.html          # Home page
│   ├── about.html          # About page
│   ├── games.html          # Games listing
│   ├── books.html          # Books listing
│   ├── contact.html        # Contact form
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── images/             # Site images
│   │   ├── games/          # Game screenshots
│   │   └── books/          # Book covers
│   ├── pdfs/               # Book PDFs
│   │   ├── encapsulated-fear.pdf
│   │   └── genie-test-tube.pdf
│   └── _redirects          # Cloudflare Pages redirects
└── Documents/              # This documentation
    ├── TV_SiteDesign_v1_12252025.md
    ├── TV_Architecture_v1_12252025.md
    ├── TV_DesignDecisions_v1_12252025.md
    └── TV_ProjectInstructions_v1_12252025.md
```

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

### Current Workflow

```
1. Edit files locally (E:\TecVooDoo\TecVooDooSite\site\)
2. Test locally (open HTML files in browser)
3. Commit to GitHub
4. Cloudflare Pages auto-deploys
5. Changes live in ~1-2 minutes
```

### Build Settings (Cloudflare Pages)

| Setting | Value |
|---------|-------|
| Build command | (none - static) |
| Build output directory | site |
| Root directory | / |

---

## Security

### Current Measures

- HTTPS enforced via Cloudflare
- No user data storage
- No authentication required
- Static content only

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

### Dependency Considerations

- Google Fonts: Privacy implications, consider self-hosting
- Font Awesome: Large library, could subset
- Both: Require internet for full experience

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
# Clone repository
git clone https://github.com/TecVooDoo/tecvoodoo.git

# Or if already cloned, pull latest
cd E:\TecVooDoo\TecVooDooSite
git pull origin main
```

---

## Future Architecture Considerations

### If Site Grows

| Scenario | Solution |
|----------|----------|
| More pages | Consider static site generator (11ty, Hugo) |
| Dynamic content | Headless CMS (Contentful, Strapi) |
| User accounts | Backend service (Supabase, Firebase) |
| E-commerce | Snipcart, Stripe integration |

### If Traffic Grows

- Current Cloudflare Pages handles scale well
- Consider caching strategies
- Monitor bandwidth usage

---

**End of Architecture Document**
