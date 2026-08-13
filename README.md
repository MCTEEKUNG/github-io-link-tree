# Heatwave AI Research Link Tree

Static GitHub Pages site for the `DeepSeek_Heatwave` research project.

Live site: <https://mcteekung.github.io/github-io-link-tree/>

Poster QR code: [`assets/qr-research-hub.svg`](assets/qr-research-hub.svg) · [`assets/qr-research-hub.png`](assets/qr-research-hub.png)

## Purpose

This page is a curated research hub for committee members, advisors, and readers who want a clear path through the project. The first three entry points are:

- Original research references with direct links to the publisher or official source
- The HeatMAP App on Vercel: <https://heat-map-frontend.vercel.app/map>
- The LINE Official Account QR card in [`assets/line-oa-qr.svg`](assets/line-oa-qr.svg) and [`assets/line-oa-qr.png`](assets/line-oa-qr.png)

The deeper research story remains:

`Problem → Method → Evidence → Product → Documents`

The operational forecast page remains in the source repository at [`DeepSeek_Heatwave/docs/index.html`](https://github.com/MCTEEKUNG/DeepSeek_Heatwave/blob/main/docs/index.html).

## Local preview

Run a static HTTP server from this directory:

```powershell
python -m http.server 8765
```

Then open <http://localhost:8765/>.

## Deployment

GitHub Pages is configured to publish the `main` branch from the repository root. The site has no build step and intentionally does not run model inference or fetch forecast data into the research page.

## Content policy

The curated `assets/` and `documents/` files are selected from the source project. Raw climate data, model artifacts, credentials, logs, temporary files, archives, and internal QA material are not included.

The page distinguishes the current production model (`logistic_balanced_cal`) from research candidates that have not passed the model-promotion gate. Forecasts are probabilities for weekly heatwave events, not official warnings.
