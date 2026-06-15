# Mini Forge Dev — Website

Static developer website for the Mini Forge Dev Google Play developer account,
hosted on GitHub Pages.

---

## File structure

```
/
├── index.html                  Homepage
├── privacy.html                AnimePulse privacy policy
├── support.html                AnimePulse support FAQ
├── 404.html                    Custom 404 error page
├── app-ads.txt                 AdMob publisher authorisation (must stay at root)
├── robots.txt                  Search-engine crawl instructions
├── sitemap.xml                 Sitemap for search engines
├── styles.css                  All CSS
├── script.js                   Minimal JavaScript (year, nav, header scroll)
├── assets/
│   ├── logo.svg                Full wordmark logo
│   ├── favicon.svg             Icon-only favicon
│   └── animepulse-placeholder.svg  AnimePulse app preview illustration
└── README.md                   This file
```

---

## 1. Preview locally with VS Code Live Server

1. Install the **Live Server** extension in VS Code.
2. Open the `sephylon09.github.io` folder in VS Code.
3. Right-click `index.html` and choose **Open with Live Server**.
4. The site opens at `http://127.0.0.1:5500/`.

Alternatively, if Python is installed:

```powershell
python -m http.server 5500
```

Then visit `http://localhost:5500/`.

Test these URLs:

- `http://localhost:5500/`
- `http://localhost:5500/privacy.html`
- `http://localhost:5500/support.html`
- `http://localhost:5500/app-ads.txt`
- `http://localhost:5500/404.html`

---

## 2. Replace the GitHub username

Search for `YOUR_USERNAME` in these files and replace with your real GitHub username:

| File            | What to change                               |
|-----------------|----------------------------------------------|
| `index.html`    | `canonical` and `og:url` meta tags           |
| `privacy.html`  | `canonical` and `og:url` meta tags           |
| `support.html`  | `canonical` and `og:url` meta tags           |
| `robots.txt`    | `Sitemap:` URL                               |
| `sitemap.xml`   | All `<loc>` URLs                             |

Example: replace `https://YOUR_USERNAME.github.io/` with `https://sephylon09.github.io/`.

---

## 3. Update the support email

The email `miniforgedev@gmail.com` appears in:

- `index.html` — contact section and footer
- `privacy.html` — contact section and footer
- `support.html` — sidebar contact card and footer
- `404.html` — (footer not present; no change needed)

Search for `miniforgedev@gmail.com` across all HTML files to update it.

---

## 4. Add the AnimePulse Play Store link

When AnimePulse is live on Google Play:

1. Open `index.html`.
2. Find the comment that reads:
   ```html
   <!-- TODO: Replace the href value below with the real Google Play URL -->
   ```
3. Replace the `href="#apps"` with the real URL, for example:
   ```html
   href="https://play.google.com/store/apps/details?id=com.miniforgedev.animepulse"
   ```
4. Change `class="btn btn-disabled"` to `class="btn btn-primary"`.
5. Remove `aria-disabled="true"` and `tabindex="-1"`.

---

## 5. Update the privacy policy date

Open `privacy.html` and find:

```html
<p class="page-meta">Last updated: 15 June 2026</p>
```

Replace the date whenever the policy content changes.

---

## 6. Verify app-ads.txt

The current `app-ads.txt` contains:

```
google.com, pub-6675028272966387, DIRECT, f08c47fec0942fa0
```

Before publishing, confirm this line matches the exact personalised line shown
in your AdMob account under **Apps > App-ads.txt**. Copy it directly from AdMob
to avoid typos.

The file must:
- Be plain text with no HTML
- Contain no comments
- End with a newline
- Be accessible at `https://YOUR_USERNAME.github.io/app-ads.txt`

---

## 7. Publish with GitHub Pages

```powershell
git status
git add .
git commit -m "Create Mini Forge Dev website"
git push origin main
```

Then in the GitHub repository:

1. Go to **Settings > Pages**.
2. Under **Source**, select **Deploy from a branch**.
3. Choose `main` branch and `/ (root)` folder.
4. Click **Save**.

GitHub Pages will publish the site at `https://YOUR_USERNAME.github.io/` within
a few minutes.

---

## 8. Use a custom domain later

1. Buy a domain (e.g. `miniforgedev.com`).
2. Add a `CNAME` file in the repository root containing your domain:
   ```
   miniforgedev.com
   ```
3. In your domain registrar's DNS settings, add a CNAME record pointing to
   `YOUR_USERNAME.github.io`.
4. In **Settings > Pages**, enter your custom domain.
5. Enable **Enforce HTTPS** once the certificate is issued.
6. Update all `YOUR_USERNAME.github.io` references to your new domain.

---

## 9. Files that must remain at the website root

These files must be directly accessible at the root URL — do not move them into
a subdirectory:

- `app-ads.txt` — must be at `/app-ads.txt`
- `robots.txt` — must be at `/robots.txt`
- `sitemap.xml` — must be at `/sitemap.xml`
- `404.html` — GitHub Pages serves this automatically for missing pages

---

## 10. Test mobile responsiveness

In Chrome or Edge DevTools (F12):

1. Click the **Toggle device toolbar** icon (Ctrl+Shift+M).
2. Test at these widths:
   - 360 px (common Android)
   - 390 px (common Android)
   - 768 px (tablet)
   - 1024 px (laptop)
   - 1440 px (wide desktop)

Check for:
- No horizontal scrollbar
- Navigation collapses to a hamburger menu below 768 px
- Hero section stacks vertically on mobile
- App card stacks vertically on mobile
- Email address wraps without overflow
- Buttons remain full-width and tappable on small screens

---

## 11. Validate HTML

Paste each page into the W3C HTML validator:

https://validator.w3.org/#validate_by_input

Or use the URL form once the site is live:

https://validator.w3.org/

---

## 12. Commit and push changes

```powershell
git status
git add .
git commit -m "Create Mini Forge Dev website"
git push origin main
```

To push a single file update:

```powershell
git add privacy.html
git commit -m "Update privacy policy date"
git push origin main
```

---

## Contact

Developer email: miniforgedev@gmail.com
