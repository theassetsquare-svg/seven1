---
name: seo-audit
description: Audit the site for general SEO issues that affect Google ranking — title, meta description, headings, canonical, robots, sitemap, Open Graph, Twitter Cards, JSON-LD structured data, alt text, internal linking. Use when user asks for SEO check, ranking improvement, "구글 SEO", "검색 최적화", or before deploying a site.
---

# SEO Audit (Google focus)

Run a full SEO audit on the site. Check each item below, report what is missing or weak, and offer concrete fixes.

## Required checks

### 1. `<head>` essentials
- `<title>` — 30~60 chars, contains primary keyword, unique per page
- `<meta name="description">` — 70~160 chars, action-oriented
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<meta charset="UTF-8">`
- `<html lang="...">` set correctly (e.g. `lang="ko"` for Korean sites)
- `<link rel="canonical" href="...">` to avoid duplicate content
- Favicon + apple-touch-icon

### 2. Crawlability
- `robots.txt` exists at root, allows crawlers, references sitemap
- `sitemap.xml` exists, lists all public URLs with `<lastmod>`
- No `<meta name="robots" content="noindex">` on pages that should rank
- Clean URL structure (no `?id=123` for content pages)

### 3. Open Graph + Twitter Cards (social previews → traffic)
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://.../og.png">  <!-- 1200x630 -->
<meta property="og:url" content="https://...">
<meta property="og:type" content="website">
<meta property="og:locale" content="ko_KR">
<meta name="twitter:card" content="summary_large_image">
```

### 4. Structured data (JSON-LD)
At minimum, add `Organization` or `WebSite` schema. For content sites add `Article`, for products `Product`, for FAQ pages `FAQPage`. Place inside `<script type="application/ld+json">`.

### 5. Headings & content
- One `<h1>` per page, contains primary keyword
- Logical `<h2>`/`<h3>` hierarchy (no skipping levels)
- All `<img>` have descriptive `alt` attributes
- Internal links use descriptive anchor text (not "click here")

### 6. Performance signals (also in `web-vitals` skill)
- Images use `loading="lazy"` below the fold
- Modern formats (WebP/AVIF) with `<picture>` fallback
- `<link rel="preconnect">` for critical third-party origins

## How to run

1. Read `index.html` and any other HTML/template files in the repo.
2. Check for `robots.txt` and `sitemap.xml` at the project root or `public/`.
3. For each missing or weak item, output a checklist with:
   - ❌ what's missing
   - ✅ exact code/file to add
4. Ask before making large content changes (titles, descriptions) — those are editorial decisions.

## Output format

```
## SEO Audit Result

### ✅ Pass
- ...

### ⚠️ Issues
1. [HIGH] No meta description → add: <meta name="description" content="...">
2. [MED] Missing canonical → add: <link rel="canonical" href="...">

### 📝 Suggested next steps
- ...
```
