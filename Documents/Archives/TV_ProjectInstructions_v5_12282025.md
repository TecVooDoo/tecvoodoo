# TecVooDoo Website - Project Instructions

**Project:** TecVooDoo Official Website
**Developer:** TecVooDoo LLC
**Designer:** Rune (Stephen Brandon)
**Site URL:** https://tecvoodoo.com
**Project Path:** E:\TecVooDoo\TecVooDooSite
**Document Version:** 5
**Last Updated:** December 28, 2025

---

## Shared Documentation

**This project follows TecVooDoo standards. Review these documents:**

| Document | Location | Purpose |
|----------|----------|---------|
| Core Protocols | `E:\TecVooDoo\Projects\Documents\CORE_DevelopmentProtocols.md` | Universal development rules |
| Web Standards | `E:\TecVooDoo\Projects\Documents\Type\TYPE_Web.md` | Web-specific patterns and deployment |

---

## Project Paths

| Path | Purpose |
|------|---------|
| `E:\TecVooDoo\TecVooDooSite\site` | Website files (deployed to Cloudflare) |
| `E:\TecVooDoo\Projects\Other\TecVooDooWebsite\Documents` | Documentation |
| `E:\TecVooDoo\Projects\Other\Supabase\Documents` | Supabase documentation |

**GitHub Repository:** https://github.com/TecVooDoo/tecvoodoo

---

## Project Documents

| Document | Purpose |
|----------|---------|
| TV_SiteDesign | Visual design and content |
| TV_Architecture | Technical structure |
| TV_DesignDecisions | Decision history |
| TV_ProjectInstructions | Development protocols (this document) |

**Naming Convention:** `TV_DocumentName_v#_MMDDYYYY.md`

All four documents share the same version number. Increment all when any document is updated.

---

## Site Structure

```
TecVooDooSite/
├── .git/                   # Git repository
└── site/                   # Website files (Cloudflare deploys this)
    ├── index.html
    ├── about.html
    ├── games.html
    ├── books.html
    ├── contact.html
    ├── auth-test.html
    ├── encapsulated-fear.html
    ├── genie-in-a-test-tube.html
    ├── css/
    │   └── style.css
    ├── images/
    ├── games/
    │   └── dots-and-boxes/
    ├── _redirects
    ├── robots.txt
    └── sitemap.xml
```

---

## Key URLs

| URL | Purpose |
|-----|---------|
| tecvoodoo.com | Main website |
| www.tecvoodoo.com | Main website (alias) |
| dlyh.tecvoodoo.com | Don't Lose Your Head game |
| dotsandboxes.tecvoodoo.com | Dots and Boxes game |

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
3. Add game image to `site/images/`
4. Update footer timestamp
5. Commit and push
6. Update subdomains in Cloudflare if needed

### Add a New Book/Story

1. Edit `site/books.html`
2. Add new card
3. Add book cover to `site/images/`
4. Add PDF to `site/pdfs/` (if applicable)
5. Update footer timestamp
6. Commit and push

### Update Colors

Edit `site/css/style.css`:
```css
:root {
    --accent-cyan: #00f0c0;
    --accent-red: #ff3366;
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Site not updating after push | Check GitHub push succeeded, check Cloudflare Pages dashboard, clear browser cache |
| Mobile menu not working | Check hamburger icon CSS, verify no JS errors |
| Images not loading | Check file path (case-sensitive on server), verify file exists |
| PDF download failing | Verify PDF exists in `site/pdfs/`, check file size |

---

## External Resources

| Resource | URL |
|----------|-----|
| Cloudflare Pages Dashboard | https://dash.cloudflare.com |
| GitHub Repository | https://github.com/TecVooDoo/tecvoodoo |
| Supabase Dashboard | https://supabase.com/dashboard/project/eenuxdjmsibcfhzgtslx |

---

**End of Project Instructions**

Review CORE_DevelopmentProtocols.md and TYPE_Web.md for full development standards.
