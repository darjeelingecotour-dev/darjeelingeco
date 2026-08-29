# 🏔️ SarkarTravels

> **Travel the Northeast. Honor the Land.**
>
> Curated Darjeeling, Sikkim, Assam and Himalayan journeys that support local communities and conservation.

A static travel website built with [Eleventy](https://www.11ty.dev/) and [Tailwind CSS](https://tailwindcss.com/), deployable on GitHub Pages.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm v9+

### Install Dependencies
```bash
npm ci
```

### Development Server
```bash
npm run dev
```
This starts:
- Eleventy dev server with live reload on `http://localhost:8080`
- Tailwind CSS watcher for instant style updates

### Production Build
```bash
npm run build
```
Outputs optimized static files to `_site/` directory.

### Clean Build
```bash
npm run clean
npm run build
```

---

## 📁 Project Structure

```
sarkartravel/
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── .eleventy.js                   # Eleventy configuration
├── tailwind.config.js             # Tailwind CSS theme & plugins
├── postcss.config.js              # PostCSS pipeline
├── package.json                   # Dependencies & scripts
├── src/
│   ├── index.njk                  # Home page
│   ├── tours.njk                  # Tour catalogue
│   ├── contact.njk                # Contact page
│   ├── _includes/
│   │   ├── layouts/               # Page layouts (base, home, tour)
│   │   └── components/            # Reusable UI components
│   ├── _data/                     # YAML data files
│   │   ├── site.yml               # Global site config
│   │   ├── tours.yml              # Tour catalogue data
│   │   ├── testimonials.yml       # Traveler reviews
│   │   ├── partners.yml           # Partner organizations
│   │   └── ecolodges.yml          # Eco-lodge showcase
│   ├── tours/                     # 12 individual tour pages (Markdown)
│   └── assets/
│       ├── css/styles.css         # Tailwind source CSS
│       ├── js/main.js             # Client-side JavaScript
│       └── images/                # Tour & site images
└── _site/                         # Built output (gitignored)
```

---

## 🌿 Features

- **12 Curated Tour Itineraries** — Darjeeling, Sikkim, Assam, Purulia & more
- **Eco-Impact Dashboard** — Animated counters for trees planted, CO₂ offset
- **Carbon Calculator** — Client-side footprint estimator
- **Client-side Search** — Fuse.js powered tour filtering
- **Testimonial Carousel** — Auto-playing traveler reviews
- **Eco-Lodge Showcase** — Horizontal scroll gallery
- **Responsive Design** — Mobile-first, works on all devices
- **Static Forms** — Netlify Forms / Formspree compatible
- **SEO Optimized** — Meta tags, Open Graph, semantic HTML

---

## 🚢 Deployment

### GitHub Pages (Automatic)
Push to `main` branch — the GitHub Actions workflow will build and deploy automatically.

> **Note:** In your repo settings, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

### Manual / Other Hosts
```bash
npm run build
# Upload contents of _site/ to any static host
```

---

## 📄 License

© 2026 SarkarTravels. All rights reserved.
