# How to update everything

**Edit one file — [`resume.yaml`](resume.yaml) — and everything else follows.**
It is the single source of truth for the website, the PDF résumé, and LinkedIn.

```
resume.yaml
   ├─▶ website        (npm run build → dist/index.html, deployed by Vercel)
   ├─▶ PDF résumé     (GitHub Action → resume/resume.pdf)
   └─▶ LinkedIn text  (npm run linkedin → paste-ready blocks)
```

## Everyday flow

1. Edit `resume.yaml` (add a job, tweak a bullet, add a skill…).
2. Commit and push.
3. That's it for the **website** and **PDF** — they rebuild automatically:
   - Vercel runs `npm run build` and redeploys the site.
   - The GitHub Action recompiles `resume/resume.pdf` and commits it back.
4. For **LinkedIn** (no API — manual), run `npm run linkedin`, then paste each
   block into the matching field on your profile. See the printed checklist.

## Commands

| Command | What it does |
|---------|--------------|
| `npm run validate` | Check `resume.yaml` for missing fields / unbalanced `**` |
| `npm run build`    | Validate, then write `dist/index.html` |
| `npm run linkedin` | Print + write `dist/linkedin.txt` (paste sheet) |
| `npm run all`      | Build the site and the LinkedIn sheet |

Preview the site locally: `npm run build && (cd dist && python3 -m http.server 8000)` → http://localhost:8000

Compile the PDF locally (needs [Typst](https://github.com/typst/typst)):
`typst compile --root . resume/resume.typ resume/resume.pdf`

## Writing bullets

In `resume.yaml`, wrap emphasis in **double asterisks**:

```yaml
- "**Reduced ingestion delays by 20%** by building real-time ETL pipelines."
```

- Website → renders `<b>bold</b>`
- PDF → renders **bold**
- LinkedIn → plain text (asterisks stripped, since LinkedIn has no formatting)

## One-time setup (already prepared in this repo)

- **Vercel**: it reads `vercel.json` — build command `npm run build`, output `dist`.
  If your Vercel project predates this, set Framework Preset = *Other* and let
  `vercel.json` drive it, or clear any old build settings in the dashboard.
- **GitHub Action**: `.github/workflows/build-pdf.yml` compiles the PDF on every
  push that touches `resume.yaml` or the template. It needs *Read and write*
  workflow permissions (repo → Settings → Actions → General → Workflow permissions).

## Files

```
resume.yaml               ← THE ONE FILE YOU EDIT
templates/site.html       design shell (CSS + theme toggle); content is injected
scripts/build-site.mjs    resume.yaml → dist/index.html
scripts/linkedin.mjs      resume.yaml → LinkedIn paste blocks
scripts/validate.mjs      sanity-checks resume.yaml
scripts/lib.mjs           shared helpers
resume/resume.typ         Typst template that reads resume.yaml → PDF
.github/workflows/        CI that compiles the PDF
```
