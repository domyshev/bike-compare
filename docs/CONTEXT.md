# Project context and handoff

## User goal

Help a first-time road/gravel bike buyer compare gearing and useful specifications. The original discussion compared endurance training, road riding, easy dirt roads, hills and riding with bags. The user wanted a real website, a light palette, horizontal scrolling and zooming, checkbox model selection, a customizable specification comparison, and agent instructions for expanding the catalog.

The working name is Cadence. The repository name is bike-compare. It is a standalone static application, with no framework or account requirement. An earlier copy was published using Sites; that service's source identity, credentials and Git history are intentionally not part of this portable repository.

## Initial catalog snapshot

Facts were checked against the Spanish-market pages on 19 October 2026. These are dated values, not live pricing or inventory. The exact sources are retained in each model's `url` field.

| Model | Price EUR | Weight size M | Front teeth | Rear teeth | Stock / maximum tyre width |
| --- | ---: | ---: | --- | --- | --- |
| Endurace CF 6 | 1699 | 8.88 kg | 34, 50 | 11,13,15,17,19,21,23,25,28,32,36 | 32 / 38 mm |
| Endurace AllRoad | 1099 | 10.76 kg | 34, 50 | 11,13,15,17,20,23,26,30,34,39 | 35 / 40 mm |
| Grizl 5 | 1299 | 11.33 kg | 40 | 11,13,15,17,20,23,26,30,36,43,50 | 45 / 54 mm |

All three have hydraulic disc brakes and mechanical shifting. CF 6 has a carbon frame; AllRoad and Grizl have aluminium frames and carbon forks. AllRoad and Grizl have rear rack compatibility. An unverified mounting or component fact must remain null rather than being turned into a negative.

### Manufacturer model sources

- CF 6: https://www.canyon.com/en-es/road-bikes/endurance-bikes/endurace/cf/endurace-cf-6/4426.html
- AllRoad: https://www.canyon.com/en-es/road-bikes/endurance-bikes/endurace/allroad/endurace-allroad/4477.html
- Grizl 5: https://www.canyon.com/en-es/gravel-bikes/adventure/grizl/al/grizl-5/4443.html

### Cassette tooth sequences

- Shimano CS-RS400-11 (CF 6): https://productinfo.shimano.com/pdfs/product/thisyear/2025-2026_Specifications_v034_en.pdf
- Shimano CS-LG300-10, 11–39 (AllRoad): https://productinfo.shimano.com/pdfs/product/thisyear/2026-2027_Specifications_v023_en.pdf
- Shimano CS-LG400-11, 11–50 (Grizl): https://si.shimano.com/en/pdfs/sm/SHIMANO_CUES_WOP/SHIMANO_CUES_WOP_v01_ENG.pdf

Manufacturer PDF paths containing `thisyear` may eventually change contents. Recheck exact model and generation before refreshing data.

## Gearing semantics

Ratio = front teeth / rear teeth. A ratio of 1.00 means one rear-wheel revolution per pedal revolution. Lower numbers mean lower gearing. Do not present ratios as measured effort or actual speed.

- CF 6 endpoints: 34/36 = 0.9444 and 50/11 = 4.5455.
- AllRoad endpoints: 34/39 = 0.8718 and 50/11 = 4.5455.
- Grizl endpoints: 40/50 = 0.8000 and 40/11 = 3.6364.
- AllRoad's lowest ratio is approximately 7.7% lower than CF 6's; Grizl's is approximately 8.2% lower than AllRoad's.
- CF 6's and AllRoad's highest ratios are 25% higher than Grizl's. This does not imply 25% higher attainable road speed.
- Comparisons of ratios do not account for tyre circumference, total weight, aerodynamic drag or rider power.
- Two front chainrings provide overlapping ranges, not 20 or 22 evenly ordered, unique steps. Sorted combinations are not a practical shifting sequence.
- Extreme cross-chained combinations are shown for completeness; the chart explains this caveat.

There are 53 combinations and 41 distinct mathematical ratios in the initial catalog. Equal values can belong to multiple models. Marker position uses the exact ratio, while visible labels round to two decimals; nearby values can therefore display the same rounded number. Selecting a label shows three decimals and its tooth combination.

## Implementation decisions

- Source and deployable assets are the same files in `dist/`.
- The chart and table have independent model selections.
- A common catalog-wide linear domain prevents scale changes when toggling a model.
- Collision-avoiding labels use multiple vertical levels and leaders to the exact shared axis.
- Zoom preserves the visible midpoint; Fit all adapts to the viewport.
- Coincident ratios share a pie marker so model identity is retained.
- localStorage is optional and exceptions are handled. Saved IDs are filtered against the current catalog.
- Presets are conveniences; users can choose individual features and hide rows with identical values.
- Artwork is an illustrative bicycle silhouette, not a product photograph. The colors identify models, not available paint colors.
- Unknown catalog values render as “Not verified.”

## Verification history

The initial site passed catalog checks, JavaScript syntax checks, and a Chromium browser smoke test covering 53 chart labels, independent model filters, empty model selections, zoom, ratio inspection, specification presets, differences filtering and mobile page overflow. Desktop and mobile layouts were visually inspected. The checks in `test.mjs` are portable and use Node's built-in assertions.

Before changing the UI, exercise zoom and Fit all at narrow widths, horizontal drag, native touch scrolling, keyboard activation of chart labels, empty feature selection, and persistence after reload. Do not claim these browser checks have been repeated on another computer merely because the catalog checks pass.

## Known limits and future work

- Plain JavaScript currently interpolates trusted in-repository catalog strings into HTML. Escape or sanitize values before accepting untrusted external catalog input.
- The Grizl model uses labels below the common axis, while other models use labels above. Generalize the lane assignment if the catalog becomes crowded.
- Some model facts have not been verified and are deliberately left null.
- The visible snapshot date appears in several places. If models are updated on different dates, add per-model dates instead of claiming a single fresh catalog snapshot.
- Model descriptions and preset names are editorial, not measured performance scores.
- A React migration is possible but has not been implemented and is not required for ordinary static hosting.
