# Cadence: agent guide

## Purpose and structure

This is a buildless, static bicycle comparison site. All code, documentation, comments, and UI copy must be in English. Keep the light theme and responsive layout. No backend, API keys, build step, or framework is needed.

- `dist/index.html`: accessible page structure.
- `dist/styles.css`: light visual design and responsive layouts.
- `dist/data.mjs`: bicycle catalog, feature definitions, and presets. This is the single source of truth.
- `dist/engine.mjs`: pure ratio calculations and value formatting.
- `dist/app.mjs`: selections, chart, zoom, drag, table, and browser-local persistence.
- `test.mjs`: catalog and gearing checks. Run `node test.mjs` from this directory.
- `README.md`: portable local run and hosting instructions.
- `docs/CONTEXT.md`: product decisions, manufacturer sources, calculation semantics, and verification history.

Serve locally with `python3 -m http.server 8765 --directory dist`. Do not open the page using file:// because ES modules require HTTP.

## Add a bicycle

1. Read the exact manufacturer model page for the intended region and generation. Do not infer specs from another model year or similarly named groupset.
2. Verify the complete cassette tooth sequence from the component manufacturer's specification. A range such as 11–39 does not establish the intermediate teeth.
3. Add one object to `bikes` in `dist/data.mjs`, following existing entries. Use a unique, permanent lowercase `id`, a compact `shortName` for chart labels, a distinctive readable hex `color`, a `url` pointing to the source, positive integer `front` and `rear` arrays, and the same units used by the existing catalog. Front and rear tooth arrays must be sorted ascending with no duplicates.
4. Store price in EUR, weight in kg, widths and geometry in mm. Use size M for weight, stack and reach, or clearly label a different reference. Do not copy unverified wheel weights from manufacturer pages.
5. Use `null` for an unknown fact, not `false` or an invented value. `false` means a verified negative. Mount compatibility is not a luggage load rating. Product art is an illustrative silhouette, not a factual product image.
6. Existing model cards, model checkboxes, chart combinations, and table columns are generated from the catalog. Do not add model-specific controls manually. Chart labels use the catalog-backed `shortName`. The chart uses the Grizl lane below the axis and other models above it; preserve a readable greedy label layout as the catalog expands.
7. Ratios and endpoints must be calculated by `engine.mjs`, never typed into the UI. Identical ratios retain all model identities. Do not remove extreme cross-chained combinations: show the existing explanatory caveat instead.
8. Update `checkedOn` and the visible snapshot date only after checking the affected facts. For a mixed-date catalog, introduce per-model `checkedOn` instead of implying all models were refreshed. Keep source links visible.
9. Run the checks and exercise the site in a browser: model selection independently in each section; no models; no features; presets; differences; zoom; fit; horizontal drag and keyboard scrolling; mobile width. Check new models appear for a fresh visitor and existing saved choices remain valid.

## Add a comparison characteristic

Add a field to the bicycle records (null when unknown), then a definition to `features`: `{id,label,group,unit?}`. If it is derived or needs special formatting, extend `value` or `format` in `engine.mjs`. Add its ID to relevant `presets`. The custom checklist and table will pick it up automatically. Use factual characteristics and explain derived values; do not invent performance scores.

## Behavioral constraints

- Ratio = front teeth / rear teeth. 1.00 means one wheel revolution per pedal revolution.
- Preserve a common, linear domain across the entire catalog when models are toggled. Label leaders must terminate at exact ratio positions; label spacing must not distort the scale.
- Zoom preserves the visible midpoint; horizontal scrolling must stay available. Empty selection states must remain useful.
- Chart model selection and comparison model selection are intentionally independent.
- Browser storage is optional and may be unavailable or contain stale data. Validate IDs and handle exceptions.
- Gear ratio is not actual road speed, climbing performance, wheel development, or a recommended shift sequence. Differences in tyre circumference and total mass matter.
- Keep unknown values explicit, source URLs clickable, and checked dates visible. Do not claim live prices.
- Do not add dependencies solely for this small application. Preserve semantic controls, focus styles, accessible chart labels, contrast, and touch scrolling.

## Publication and Git

This repository is a portable copy, independent of Sites. Publish the contents of `dist/` to any static web host; no build is needed. Do not introduce a Sites account, project manifest, credentials, private source remote, or machine-specific paths. Preserve relative asset paths and JavaScript MIME types for `.mjs`. Publishing this repository does not enable GitHub Pages automatically.

Never force-push. Keep credentials out of source, command arguments, and logs. Respect the user's repository-specific Git rules and requested commit author. Before a React migration, preserve the existing data and pure ratio engine and treat rendering as a separate change.
