# Bike Compare · Cadence

A light, responsive bicycle comparison website with a horizontally scrollable, zoomable gear-ratio explorer and customizable specification tables.

## Run locally

No dependency installation or build step is required. Use Python 3 to serve the static files:

```sh
python3 -m http.server 8765 --directory dist
```

Open http://localhost:8765. ES modules require HTTP; opening `dist/index.html` directly using `file://` will not work.

## Checks

With a current Node.js version:

```sh
node test.mjs
node --check dist/app.mjs
```

## Deploy to ordinary hosting

Publish the contents of `dist/` as the document root. The site works on standard static hosts, including Nginx, Apache, GitHub Pages, Netlify and Cloudflare Pages. There is no backend and no Sites account is required. Keep relative asset URLs so project subpaths also work. The host must serve `.mjs` files with a JavaScript MIME type (`text/javascript` or `application/javascript`).

For GitHub Pages, upload `dist/` with a Pages deployment workflow or configure your chosen publishing method; Pages does not automatically serve this folder from the repository root. No deployment workflow is enabled by this repository.

Typography loads from Google Fonts. If unavailable, system fonts are used. All other runtime assets are local. UI choices are stored in this browser's localStorage and are not synchronized across devices.

## Features

- Three initial models: Canyon Endurace CF 6, Endurace AllRoad and Grizl 5.
- All 53 gear combinations on one common linear ratio scale.
- Horizontal drag/scroll, zoom controls, fit-to-width and keyboard-accessible ratio details.
- Independent model selection for the chart and comparison table.
- Essentials, training, adventure and all-specification presets.
- Custom feature selection and a differences-only filter.
- Explicit unknown facts and links to manufacturer specifications.

## Maintain the catalog

Read [AGENTS.md](AGENTS.md) before editing. Model data, comparison features and presets live in `dist/data.mjs`; ratio calculations and formatting live in `dist/engine.mjs`.

See [project context](docs/CONTEXT.md) for design decisions, terminology, source references, known limits and verification history.

## Framework compatibility

The application currently uses vanilla HTML/CSS/JavaScript, not React. The catalog and pure calculation module can be reused in a React application; rendering and event handling would need to be migrated into components.
