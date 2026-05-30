# TecVooDoo Website - Design Decisions

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
| v1 | Dec 25, 2025 | Initial document - documenting existing decisions |
| v2 | Dec 26, 2025 | Games page redesign, image lightbox, mobile lessons learned |

---

## Purpose

This document tracks design decisions, rationale, and lessons learned for the TecVooDoo website.

---

## Core Design Decisions

### Technology Choice

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Static vs Dynamic | Static HTML/CSS | Simple, fast, no backend needed |
| Framework | None (vanilla) | Overkill for 5-page site |
| Hosting | Cloudflare Pages | Free, fast, easy GitHub integration |
| CSS approach | Custom with variables | Full control over design |

### Visual Design

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Color scheme | Dark with cyan/red accents | Tech aesthetic, matches "TecVooDoo" brand |
| Typography | Orbitron + Rajdhani | Futuristic headings, readable body |
| Layout | Card-based | Clean, scannable, works on mobile |
| Effects | Subtle glow/hover | Premium feel without overdoing it |

---

## Branding Decisions

### Name and Tagline

| Element | Choice | Rationale |
|---------|--------|-----------|
| Company name | TecVooDoo | Portmanteau of Tech + Voodoo |
| Tagline | "Where Tech Meets Voodoo" | Explains the name, sets tone |
| Primary accent | Cyan (#00f0c0) | Tech/digital feel |
| Secondary accent | Red (#ff3366) | Voodoo/magic feel |

### Logo Considerations

**Current:** Text-based logo using Orbitron font

**Future considerations:**
- Custom logomark combining tech + voodoo imagery
- Animated version for site header
- Favicon optimization

---

## Content Strategy Decisions

### Games Page

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Show in-development games | Yes, with badge | Builds anticipation |
| Subdomain for each game | Yes | Clean URLs, separate deployments |
| Include screenshots | Yes | Visual appeal, shows quality |
| Three sections | Now Playtesting / Coming Soon / Up Next | Clear status visibility |
| Gameplay vs Concept images | Gameplay for playable, Concept for upcoming | Shows progress |
| Click-to-enlarge images | Yes, via lightbox | Concept art has small text |

### Books Page

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Free PDF downloads | Yes (short stories) | Builds audience, showcases writing |
| Show "on hold" projects | Yes | Transparency with readers |
| Separate short stories from series | Yes | Clear categorization |

### About Page

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Personal vs Corporate tone | Personal | One-person operation, authenticity |
| Show all skills | Yes | Games, books, web - full picture |
| Include creator name (Rune) | Yes | Personal brand building |

---

## Contact System Decisions

### Form Implementation

| Option | Considered | Decision | Reason |
|--------|------------|----------|--------|
| Mailto link | Yes | CHOSEN | Simple, no backend |
| Formspree | Yes | Rejected | Third-party dependency |
| Custom backend | Yes | Rejected | Overkill for volume |
| No form | Yes | Rejected | Need contact option |

### Newsletter/Updates

| Option | Considered | Decision | Reason |
|--------|------------|----------|--------|
| Email-based subscribe | Yes | CHOSEN | Simple, manual management |
| Mailchimp | Yes | Rejected | Monthly cost, low volume |
| Buttondown | Yes | Future option | Good for growth |
| No newsletter | Yes | Rejected | Want to build audience |

---

## Mobile Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Responsive approach | Mobile-first CSS | Better mobile experience |
| Navigation | Hamburger on mobile | Standard pattern |
| Touch targets | Min 44px | Accessibility |
| Card stacking | Single column | Readable on small screens |

---

## Performance Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Images | Minimal, optimized | Fast loading |
| External fonts | Google Fonts CDN | Easy, cached across sites |
| CSS file | Single file | Fewer requests |
| JavaScript | None required | Maximum simplicity |

---

## Hosting Decisions

### Why Cloudflare Pages

| Factor | Cloudflare Pages | GitHub Pages | Netlify |
|--------|-----------------|--------------|---------|
| Free tier | Generous | Generous | Limited |
| CDN | Global | Limited | Good |
| Custom domain | Yes | Yes | Yes |
| Build speed | Fast | Slow | Medium |
| Already using Cloudflare | Yes | N/A | N/A |

**Decision:** Cloudflare Pages - already using Cloudflare for DNS, seamless integration.

---

## Subdomain Strategy

### Game Hosting

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| /games/dlyh/ | Single deployment | Larger bundle | Rejected |
| dlyh.tecvoodoo.com | Separate, clean | Multiple deploys | CHOSEN |
| games.tecvoodoo.com/dlyh/ | Organized | Extra routing | Rejected |

**Decision:** Separate subdomains for each game. Clean URLs, independent deployments, easier to manage.

---

## What We're NOT Doing

| Feature | Why Not |
|---------|---------|
| Blog | Low priority, time investment |
| Forums/Community | Need audience first |
| E-commerce | No products to sell (yet) |
| User accounts | No need currently |
| Comments | Moderation overhead |
| Dark/Light toggle | Dark is brand identity |

---

## Open Questions

| Question | Status | Notes |
|----------|--------|-------|
| Add analytics? | OPEN | Privacy vs insights trade-off |
| Self-host fonts? | OPEN | Performance vs convenience |
| Add blog later? | OPEN | When/if writing cadence increases |
| Game page redesign? | OPEN | When more games are playable |
| SEO improvements? | OPEN | Depends on traffic goals |

---

## Lessons Learned

### From Building the Site

| Lesson | Application |
|--------|-------------|
| Static is sufficient | Avoided unnecessary complexity |
| CSS variables are great | Easy theming and consistency |
| Cloudflare Pages works well | Simple, reliable hosting |
| Keep it simple | 5 pages is enough for now |

### From Maintaining the Site

| Lesson | Application |
|--------|-------------|
| Update games list regularly | Keep content fresh |
| Check external links | PDFs, subdomains |
| Mobile testing matters | Most traffic is mobile |

### From Image Lightbox Implementation (Dec 2025)

| Lesson | Application |
|--------|-------------|
| Hover effects don't work on mobile | Use click/tap instead |
| CSS position:fixed is unreliable on iOS | Create elements dynamically with JS |
| Hidden elements can affect mobile layout | Don't keep modals in DOM when hidden |
| Browser DevTools != real devices | Always test on actual phone |
| Viewport units behave differently on mobile | Use percentages when possible |

**What Failed:**
- CSS-only hover zoom (no hover on touch)
- Static lightbox div with visibility:hidden (rendered at bottom on iOS)
- position:fixed with various CSS tricks (still broke on mobile)

**What Worked:**
- Dynamically creating lightbox element on click
- Removing element from DOM on close
- Inline styles to avoid CSS cascade issues
- No hidden elements that could interfere with scroll

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Original | Static HTML/CSS | Simplicity |
| Original | Dark theme | Brand identity |
| Original | Cloudflare Pages hosting | Free, fast, integrated |
| Original | Subdomain per game | Clean separation |
| Original | Mailto for contact | No backend needed |
| Dec 25, 2025 | Document existing decisions | Project standardization |
| Dec 26, 2025 | Games page three-section layout | Clear status visibility |
| Dec 26, 2025 | Dynamic JS lightbox over CSS | Mobile compatibility |
| Dec 26, 2025 | Mobile-first requirement added | Multiple iOS issues encountered |

---

## Future Considerations

### If Traffic Grows

- Add privacy-focused analytics (Plausible, Fathom)
- Consider CDN for PDFs
- Monitor performance metrics

### If Content Grows

- Consider static site generator (11ty)
- Blog section if writing increases
- Portfolio section for game screenshots

### If Revenue Grows

- E-commerce for merchandise
- Paid game hosting considerations
- Newsletter service upgrade

---

## Red Flags / Watch Items

| Flag | Severity | Notes |
|------|----------|-------|
| No analytics | LOW | Flying blind on traffic |
| External font dependency | LOW | Google Fonts could fail |
| Manual newsletter | LOW | Doesn't scale |
| No backup documented | MEDIUM | Document backup process |

---

**End of Design Decisions Document**
