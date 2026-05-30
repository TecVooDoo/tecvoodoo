# TecVooDoo Website - Site Design Document

**Project:** TecVooDoo Official Website
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Site URL:** https://tecvoodoo.com
**Project Path:** E:\TecVooDoo\TecVooDooSite
**Document Version:** 5
**Last Updated:** December 28, 2025

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v1 | Dec 25, 2025 | Initial document - documenting existing site |
| v2 | Dec 26, 2025 | Version bump (no content changes) |
| v3 | Dec 26, 2025 | Version bump for deployment docs fix (no content changes) |
| v4 | Dec 27, 2025 | Version bump for unified structure (no content changes) |
| v5 | Dec 28, 2025 | Version bump for auth UI blocking fix documentation |

---

## Site Overview

The TecVooDoo website serves as the official online presence for TecVooDoo LLC, showcasing games and books created by the company. It is a static HTML/CSS site with a dark, tech-focused aesthetic.

**Tagline:** "Where Tech Meets Voodoo"

**Purpose:**
- Showcase playable games
- Present published books and stories
- Provide contact information
- Build audience through newsletter subscription

---

## Site Structure

### Pages

| Page | URL Path | Purpose |
|------|----------|---------|
| Home | `/index.html` | Landing page with hero and navigation cards |
| Games | `/games.html` | List of games with play links |
| Books | `/books.html` | List of books and stories with read links |
| About | `/about.html` | Company/creator information |
| Contact | `/contact.html` | Contact form and subscription |

### Navigation Flow

```
Home (index.html)
├── Games (games.html)
│   ├── DLYH (external: dlyh.tecvoodoo.com)
│   ├── Dots and Boxes (external: dotsandboxes.tecvoodoo.com)
│   └── Shrunken Head Toss (coming soon)
├── Books (books.html)
│   ├── Encapsulated Fear (PDF)
│   ├── Genie in a Test Tube (PDF)
│   └── M Particle Series (on hold)
├── About (about.html)
└── Contact (contact.html)
    ├── Contact Form (mailto:)
    └── Subscribe (email-based)
```

---

## Visual Design

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Background | #0a0a0a | Page background |
| Card Background | #1a1a1a | Content cards |
| Accent Cyan | #00f0c0 | Primary accent, links, highlights |
| Accent Red | #ff3366 | Secondary accent, CTAs |
| Text Primary | #ffffff | Main text |
| Text Secondary | #888888 | Muted text |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Headings | Orbitron | 2.5rem (h1), 2rem (h2) | 700 |
| Body | Rajdhani | 1rem | 400 |
| Navigation | Orbitron | 0.9rem | 600 |

### Design Elements

- **Cards:** Rounded corners (15px), subtle glow on hover
- **Buttons:** Gradient backgrounds, glow effects
- **Icons:** Font Awesome 6.4.0
- **Transitions:** 0.3s ease for all interactive elements
- **Glow Effects:** Box-shadow with accent colors

---

## Page Designs

### Home Page (index.html)

**Hero Section:**
- Full-width background
- Company name: "TecVooDoo"
- Tagline: "Where Tech Meets Voodoo"
- Subtle animated gradient background

**Card Grid:**
- Three main navigation cards
- Games card (gamepad icon)
- Books card (book icon)
- About card (user icon)
- Hover effect: scale up, glow

**Footer:**
- Copyright notice
- Contact link

### Games Page (games.html)

**Header:**
- Page title with game controller icon
- Breadcrumb back to home

**Game Cards:**
| Game | Status | Link Type |
|------|--------|-----------|
| Don't Lose Your Head | Playable | External subdomain |
| Dots and Boxes | Playable | External subdomain |
| Shrunken Head Toss | In Development | Coming Soon badge |

**Card Layout:**
- Game image/placeholder
- Title
- Brief description
- Play button or status badge

### Books Page (books.html)

**Header:**
- Page title with book icon
- Breadcrumb back to home

**Content Sections:**

*Short Stories:*
| Story | Status | Format |
|-------|--------|--------|
| Encapsulated Fear | Published | PDF |
| Genie in a Test Tube | Published | PDF |

*Series:*
| Series | Status | Notes |
|--------|--------|-------|
| M Particle Series | On Hold | Sci-fi novel series |

### About Page (about.html)

**Content:**
- Creator introduction (Rune)
- One-person operation explanation
- Skills: game development, writing, web development
- Philosophy: quality over quantity

### Contact Page (contact.html)

**Contact Form:**
- Name field
- Email field
- Message field
- Submit button (mailto: based)

**Subscribe Section:**
- Email input
- Subscribe button
- Uses email-based subscription system

---

## Responsive Design

### Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Desktop | > 768px | Full navigation, multi-column cards |
| Tablet | 768px | Stacked cards, full nav |
| Mobile | < 768px | Hamburger menu, single column |

### Mobile Adaptations

- Hamburger menu icon replaces text navigation
- Cards stack vertically
- Touch-friendly button sizes (min 44px)
- Simplified footer

---

## Current Content Inventory

### Games

| Game | Subdomain | Status | Technology |
|------|-----------|--------|------------|
| Don't Lose Your Head (DLYH) | dlyh.tecvoodoo.com | Playable | Unity WebGL |
| Dots and Boxes | dotsandboxes.tecvoodoo.com | Playable | HTML5/JS |
| Shrunken Head Toss | TBD | In Development | Unity |

### Books

| Title | Type | Status | Format |
|-------|------|--------|--------|
| Encapsulated Fear | Short Story | Published | PDF |
| Genie in a Test Tube | Short Story | Published | PDF |
| M Particle Series | Novel Series | On Hold | N/A |

---

## Future Content Plans

### Games Pipeline

From Game_Dev_Tracker:
- Hooked on Charon: Reeling in the Underworld (Planning)
- FearSteez (Planning)
- AuntT Digital Board Game (Planning)
- Various concepts in development

### Books Pipeline

- M Particle Series continuation (when resumed)
- Additional short stories (TBD)

---

## SEO Considerations

### Current Implementation

- Semantic HTML5 structure
- Meta descriptions on each page
- Alt text for images
- Mobile-responsive (Google mobile-first)

### Future Improvements

- Open Graph tags for social sharing
- Structured data markup
- Sitemap.xml
- Performance optimization

---

## Analytics

**Current:** None implemented

**Planned:**
- Consider privacy-focused analytics (Plausible, Fathom)
- Track page views and game plays
- Newsletter subscription tracking

---

**End of Site Design Document**
