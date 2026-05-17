# ComfyUI AI Illustration Outputs

These PNG files are the ComfyUI-generated raster illustrations for the OPC handbook.

## Active Chapter Mapping

- `chapter-01-one-person-era.png` -> `../illustrations/chapter-01-one-person-era.png`
- `chapter-02-mindset.png` -> `../illustrations/chapter-02-mindset.png`
- `chapter-03-niche.png` -> `../illustrations/chapter-03-niche.png`
- `chapter-04-ai-toolbox.png` -> `../illustrations/chapter-04-ai-toolbox.png`
- `chapter-05-content-factory.png` -> `../illustrations/chapter-05-content-factory.png`
- `chapter-06-distribution.png` -> `../illustrations/chapter-06-distribution.png`
- `chapter-07-monetization.png` -> `../illustrations/chapter-07-monetization.png`
- `chapter-08-risk.png` -> `../illustrations/chapter-08-risk.png`
- `chapter-09-health.png` -> `../illustrations/chapter-09-health.png`
- `chapter-10-opc-plus.png` -> `../illustrations/chapter-10-opc-plus.png`

`chapter-09-health-alt.png` is retained as the earlier chapter 9 variant.

## Cover

`cover-no-text.png` is the ComfyUI no-text cover artwork. The production cover with text remains `../cover/front-cover.png`, so KDP and the web edition keep a readable title.

## Build Behavior

`scripts/generate_visuals.mjs` still writes SVG fallbacks, but copies these ComfyUI PNGs into `docs/assets/illustrations/` during `npm run build`.
