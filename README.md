# Mini Forge Dev — Website

Static developer website for the **Mini Forge Dev** Google Play developer
account, hosted on GitHub Pages at **https://sephylon09.github.io/**.

Plain HTML + CSS + vanilla JavaScript. No build step, no frameworks,
no external fonts or CDNs.

---

## Project structure

```
/
├── index.html                  Home: hero, values strip, app directory, contact
├── privacy-policy.html         All app privacy policies (hash-switched panels)
├── support.html                All app support FAQs (hash-switched panels)
├── privacy.html                Redirect → privacy-policy.html (keep: old published URL)
├── letterforge-privacy.html    Redirect → privacy-policy.html#letterforge (keep)
├── 404.html                    Custom 404 page
├── google8e191000f52faa2a.html Google Search Console verification (keep)
├── app-ads.txt                 AdMob authorisation (must stay at root)
├── robots.txt                  Crawl rules + sitemap URL
├── sitemap.xml                 Home, privacy-policy, support
├── styles.css                  Design system + all component styles
├── script.js                   Header scroll state, mobile nav, footer year
├── assets/
│   ├── apps-data.js            ★ Single source of truth for app metadata
│   ├── app-renderer.js         Renders app cards, selector tabs, footer app
│   │                           links, counts; drives hash navigation
│   ├── theme.js                Theme toggle behaviour (persistence, meta color)
│   ├── logo.svg                Brand lockup (mark + wordmark)
│   ├── logo-original.svg       Previous logo, preserved for reference
│   ├── favicon.svg             Symbol-only mark on a dark tile
│   ├── app-icons/              Optimized 256×256 WebP app icons (used by the site)
│   └── *_logo.png / .jpeg      Original full-size app logos (source assets only)
└── README.md
```

---

## App metadata (`assets/apps-data.js`)

Every page reads app identity from `window.MFD_APPS`. Each entry:

| Field           | Meaning                                                    |
|-----------------|------------------------------------------------------------|
| `id`            | Kebab-case slug; also the privacy/support hash             |
| `name`          | Display name (must match Google Play listing)              |
| `category`      | Short category label shown on cards                        |
| `kind`          | `game` or `app`                                            |
| `description`   | 1–2 sentence card description                              |
| `logo`          | Original full-size logo (source asset)                     |
| `optimizedLogo` | 256×256 WebP used everywhere on the site                   |
| `status`        | `published` or `coming-soon`                               |
| `playUrl`       | Google Play URL, or `null` until published                 |
| `privacyHash`   | Anchor on privacy-policy.html                              |
| `supportHash`   | Anchor on support.html                                     |
| `packageId`     | Android application id, or `null` until known              |

The renderer builds from this data:

- Home app cards (published / coming-soon groups) and live counts
- Google Play buttons (published apps only, `target="_blank"` +
  `rel="noopener noreferrer"`)
- Privacy and Support app selector tabs
- Footer “Apps” link lists

Long-form policy and FAQ text stays as semantic HTML in
`privacy-policy.html` / `support.html` for SEO, accessibility, and
no-JavaScript readability.

---

## Theme system

- Dark is the default for first-time visitors (OS preference is *not* used).
- A tiny inline script in each page `<head>` applies the saved theme
  before CSS paints, so there is no flash.
- The header toggle stores the choice in `localStorage` under `mfd-theme`
  and updates `<meta name="theme-color">`.
- All colors are semantic custom properties in `styles.css`
  (`--page-bg`, `--surface-1..3`, `--text-primary`, `--accent`, …) with a
  `:root[data-theme="light"]` override block. Style new components with
  tokens only — never hard-coded colors — and they work in both themes.

---

## Adding a new app

1. Drop the full-size logo into `assets/` (source only, not referenced by pages).
2. Create a 256×256 WebP copy in `assets/app-icons/` (Pillow one-liner:
   `python -c "from PIL import Image; Image.open('assets/NEW.png').convert('RGB').resize((256,256), Image.LANCZOS).save('assets/app-icons/NEW.webp','WEBP',quality=88)"` —
   keep `RGBA` if the logo has transparency).
3. Add an entry to `assets/apps-data.js` (home cards, selector tabs, footer
   links, and counts update automatically).
4. Add a policy panel to `privacy-policy.html`: copy an existing
   `<section class="app-policy" id="…" data-app-panel="…">`, keep the
   glance summary + accordion structure, and write accurate content.
5. Add an FAQ panel to `support.html` the same way.
6. Update the `<noscript>` fallback lists in `index.html`.
7. When the app ships: set `status: "published"` and `playUrl` in
   `apps-data.js` — the Play button appears automatically.

### Privacy/support hash convention

Each app is addressable as `privacy-policy.html#<id>` and
`support.html#<id>` (e.g. `#letterforge`). Deeper anchors inside a panel
(e.g. `#lf-advertising`) also work: the renderer activates the right panel
and opens the enclosing accordion. Do not rename existing ids — they are
published in Play Store listings.

---

## Local preview

```powershell
python -m http.server 5500
```

Then open <http://localhost:5500/>. (Or use the VS Code Live Server
extension.) Check:

- `/` `/privacy-policy.html` `/support.html` `/404.html` `/app-ads.txt`
- Hash deep links: `/privacy-policy.html#letterforge`,
  `/support.html#foodfit-scan`
- Redirects: `/privacy.html`, `/letterforge-privacy.html`
- Theme toggle persists across pages and reloads

---

## Deployment

Pushing to `main` publishes automatically via GitHub Pages
(Settings → Pages → Deploy from branch → `main` / root).

Files that must remain at the repository root:

- `app-ads.txt` — AdMob checks `https://sephylon09.github.io/app-ads.txt`
- `robots.txt`, `sitemap.xml`
- `404.html` — served by GitHub Pages for missing URLs
- `google8e191000f52faa2a.html` — Search Console verification
- `privacy.html`, `letterforge-privacy.html` — redirect pages for URLs
  already published in app listings

---

## Contact

Publisher: **Mini Forge Dev** · miniforgedev@gmail.com
