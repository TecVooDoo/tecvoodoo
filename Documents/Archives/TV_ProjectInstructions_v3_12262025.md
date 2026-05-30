# TecVooDoo Website - Project Instructions

**Project:** TecVooDoo Official Website
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Site URL:** https://tecvoodoo.com
**Project Path:** E:\TecVooDoo\TecVooDooSite
**Document Version:** 3
**Last Updated:** December 27, 2025

---

## Version History

| Version | Date | Summary |
|---------|------|---------|
| v1 | Dec 25, 2025 | Initial document |
| v2 | Dec 26, 2025 | Added mobile-first development requirements |
| v3 | Dec 26, 2025 | Fixed deployment workflow - clarified local vs repo structure |

---

## IMPORTANT: Project Path

**The website files are located at:** `E:\TecVooDoo\TecVooDooSite\site`

**Documentation is at:** `E:\TecVooDoo\Projects\Other\TecVooDooWebsite\Documents`

**GitHub Repository:** https://github.com/TecVooDoo/tecvoodoo

**Supabase documentation:** `E:\TecVooDoo\Projects\Other\Supabase\Documents`

**Git Remote:** `https://TecVooDoo@github.com/TecVooDoo/tecvoodoo.git`

**Dots and Boxes Game:** HTML at `site\games\dots-and-boxes\`, documentation at `E:\TecVooDoo\Projects\Games\4 Playtesting\Dots and Boxes\Documents\`

---

## CRITICAL: Local vs Repository Structure

**Local folder and GitHub repo have DIFFERENT structures:**

| Location | Structure | Example |
|----------|-----------|---------|
| Local | `site/index.html` | Files inside `site/` folder |
| GitHub Repo | `index.html` | Files at ROOT level |

**When deploying:**
- You edit files in `E:\TecVooDoo\TecVooDooSite\site\`
- Those files exist at the ROOT of the GitHub repo
- The `site/` folder itself is NOT in the repo
- The `Documents/` folder is NOT in the repo

See TV_Architecture for detailed file structure diagrams.

---

## Project Overview

The TecVooDoo website is a static HTML/CSS site showcasing games and books. It uses a dark tech aesthetic with cyan and red accents.

### Key URLs

| URL | Purpose |
|-----|---------|
| tecvoodoo.com | Main website |
| dlyh.tecvoodoo.com | Don't Lose Your Head game |
| dotsandboxes.tecvoodoo.com | Dots and Boxes game |

---

## Development Protocols

### Mobile-First Development

**CRITICAL: Always Consider Mobile**

All changes and recommendations MUST account for mobile devices:

1. **Test on actual mobile devices** - not just browser DevTools
2. **Touch interactions differ from mouse** - no hover states on mobile
3. **Position:fixed can be problematic on iOS** - test thoroughly
4. **Viewport units (vh/vw) behave differently** - use percentages when possible
5. **Create elements dynamically** for overlays/modals - avoids rendering issues
6. **Test scrolling behavior** - especially after adding overlays

**Mobile Gotchas Learned:**
- iOS Safari has quirks with `position: fixed` - use `transform: translateZ(0)` or create elements dynamically
- Hidden elements with `visibility: hidden` can still affect layout on some mobile browsers
- Always test both portrait and landscape orientations
- Touch targets should be at least 44x44px

### File Encoding

**CRITICAL: ASCII Only**

- All HTML, CSS, and text files MUST use ASCII encoding
- Avoid special characters, smart quotes, em-dashes
- Use standard apostrophes (') not curly quotes
- Use regular hyphens (-) not em-dashes

### Core Document Management

**Format:** `TV_DocumentName_v#_MMDDYYYY.md`

**Rules:**
- All four core documents share the SAME version number
- Increment version for ALL documents when ANY document is updated
- If a document has no changes, update the filename only (no content changes needed)
- Move old versions to `Documents/Archives/` folder

**Core Documents:**
- `TV_SiteDesign_v#_MMDDYYYY.md` - Visual design and content
- `TV_Architecture_v#_MMDDYYYY.md` - Technical structure
- `TV_DesignDecisions_v#_MMDDYYYY.md` - Decision history
- `TV_ProjectInstructions_v#_MMDDYYYY.md` - This document

**Example version bump:**
```
v1 -> v2 (all four files)
Old files moved to Documents/Archives/
New files created with updated version and date
```

**When to bump version:**
- Any significant content change to any core document
- At session end if documents were modified
- When lessons learned or decisions are added

---

## Code Style

### HTML

```html
<!-- Use semantic HTML5 -->
<header>, <nav>, <main>, <section>, <footer>

<!-- Consistent indentation (4 spaces) -->
<div class="card">
    <h3>Title</h3>
    <p>Content</p>
</div>

<!-- Meaningful class names -->
<div class="game-card">
<button class="btn btn-primary">
```

### CSS

```css
/* Use CSS variables for theming */
:root {
    --accent-cyan: #00f0c0;
    --accent-red: #ff3366;
}

/* BEM-like naming */
.card {}
.card-title {}
.card-description {}

/* Group related properties */
.element {
    /* Positioning */
    position: relative;

    /* Box model */
    margin: 1rem;
    padding: 1rem;

    /* Visual */
    background: var(--bg-card);
    border-radius: 15px;

    /* Typography */
    font-family: var(--font-body);

    /* Effects */
    transition: all 0.3s ease;
}
```

---

## Local Development

### Setup

1. Files are at: `E:\TecVooDoo\TecVooDooSite\site\`
2. Open HTML files directly in browser, OR
3. Use local server:

```bash
cd E:\TecVooDoo\TecVooDooSite\site
python -m http.server 8000
# Visit http://localhost:8000
```

### Testing Checklist

Before deploying, verify:
- [ ] All pages load correctly
- [ ] Links work (internal and external)
- [ ] **Mobile responsive (test on ACTUAL device, not just DevTools)**
- [ ] **Interactive features work on mobile (tap, scroll, overlays)**
- [ ] Images display properly
- [ ] PDFs accessible
- [ ] No console errors

---

## Deployment Process

### Current Workflow

```
1. Edit files in E:\TecVooDoo\TecVooDooSite\site\
2. Test locally in browser
3. Stage and commit files (they go to repo root)
4. Push to GitHub
5. Cloudflare Pages auto-deploys
6. Verify live site in 1-2 minutes
```

### Git Commands

**IMPORTANT:** The git repo is initialized in `TecVooDooSite/` but the repo structure mirrors the `site/` folder contents at root level.

```bash
cd E:\TecVooDoo\TecVooDooSite

# Check what's changed
git status

# For files that exist in BOTH site/ and repo root:
# The repo tracks root-level files, so you may need to copy from site/ first
# Example: After editing site/index.html, copy to root then commit

# Add specific file
git add index.html

# Or add all tracked changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to deploy
git push origin main
```

### Why This Structure?

The local `site/` folder is your working directory. The GitHub repo has files at root because:
- Cloudflare Pages deploys from root (no build step)
- Keeps repo clean without nested folders
- Historical setup that works

**If confused:** Check `git status` to see what the repo actually tracks.

---

## File Structure Reference

### Local Structure
```
TecVooDooSite/
├── site/                   # Your working directory
│   ├── index.html
│   ├── about.html
│   ├── games.html
│   ├── books.html
│   ├── contact.html
│   ├── auth-test.html
│   ├── css/
│   │   └── style.css
│   ├── images/
│   ├── pdfs/
│   ├── games/
│   │   └── dots-and-boxes/
│   └── _redirects
├── Documents/              # NOT in repo
│   ├── TV_*.md
│   └── Archives/
└── .git/                   # Git tracks root-level files
```

### What Gets Deployed
- Everything at repo root level
- NOT the `Documents/` folder
- NOT the `site/` folder name itself (just its contents)

---

## Common Tasks

### Add a New Game

1. Edit `site/games.html`
2. Add new card in the games grid:

```html
<div class="game-card">
    <img src="images/games/new-game.png" alt="New Game">
    <h3>Game Name</h3>
    <p>Game description</p>
    <a href="https://newgame.tecvoodoo.com" class="btn btn-primary">Play Now</a>
</div>
```

3. Add game image to `site/images/games/`
4. Copy updated files to repo root if needed
5. Commit and push
6. Update subdomains in Cloudflare if needed

### Add a New Book/Story

1. Edit `site/books.html`
2. Add new card:

```html
<div class="book-card">
    <img src="images/books/new-book.png" alt="New Book">
    <h3>Book Title</h3>
    <p>Book description</p>
    <a href="pdfs/new-book.pdf" class="btn btn-primary">Read Now</a>
</div>
```

3. Add book cover to `site/images/books/`
4. Add PDF to `site/pdfs/`
5. Copy updated files to repo root if needed
6. Commit and push

### Update Colors

Edit `site/css/style.css`:

```css
:root {
    --accent-cyan: #00f0c0;  /* Change these values */
    --accent-red: #ff3366;
}
```

---

## Troubleshooting

### Site Not Updating After Push

1. Check GitHub - did push succeed?
2. Check Cloudflare Pages dashboard for build status
3. Clear browser cache (Ctrl+Shift+R)
4. Wait 2-3 minutes for CDN propagation

### Git Says "Nothing to Commit" But Files Changed

Your local `site/` files may not be synced with the repo root:
1. Check if files exist at both `site/filename` AND repo root `filename`
2. Copy changed files from `site/` to repo root
3. Then `git add` and commit

### Mobile Menu Not Working

- Check that hamburger icon CSS is correct
- Verify no JavaScript errors in console
- Test in Chrome DevTools mobile view

### Images Not Loading

- Check file path (case-sensitive on server)
- Verify image exists in `images/` folder
- Check file extension matches

### PDF Download Failing

- Verify PDF exists in `pdfs/` folder
- Check file size (large files may timeout)
- Test direct link: `tecvoodoo.com/pdfs/filename.pdf`

---

## External Dependencies

### Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Rajdhani:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Font Awesome

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

**Note:** If these CDNs are down, fonts/icons will fall back to system defaults.

---

## Cloudflare Pages Settings

| Setting | Value |
|---------|-------|
| Production branch | main |
| Build command | (none) |
| Build output directory | / (root) |
| Root directory | / |

---

## Quick Reference

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Background | #0a0a0a | Page background |
| Card BG | #1a1a1a | Card backgrounds |
| Cyan | #00f0c0 | Primary accent |
| Red | #ff3366 | Secondary accent |
| Text | #ffffff | Main text |
| Muted | #888888 | Secondary text |

### Font Stack

| Usage | Font | Fallback |
|-------|------|----------|
| Headings | Orbitron | monospace |
| Body | Rajdhani | sans-serif |

---

## Contact Information

**Repository:** GitHub (TecVooDoo organization)

**Hosting Dashboard:** Cloudflare Pages

**DNS:** Cloudflare DNS

---

## Related Documents

| Document | Purpose |
|----------|---------|
| TV_SiteDesign | Visual design, page layouts, content |
| TV_Architecture | Technical structure, hosting, file organization |
| TV_DesignDecisions | Why we made certain choices |
| TV_ProjectInstructions | This document - how to work on the site |

---

**End of Project Instructions**
