# jcamille.dev

Personal site. Astro (static output) served as Cloudflare Workers static assets.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm run preview    # build + wrangler dev (Workers runtime locally)
npm run check      # astro check (types)
```

## Content

Everything on the page comes from `src/content/`:

| file | what |
|---|---|
| `profile.json` | name, "currently" line, about, skills, links, verse, resume path |
| `experience.json` | experience rows |
| `projects.json` | project slides (`featured` puts them in the first dot group) |
| `other.json` | "other stuff i'm up to" rows |
| `friends.json` | friends list + group photo |
| `posts/*.md` | writing; the section and nav item appear only once a post exists |

Images live in `public/img/` as WebP with metadata stripped. `public/_redirects` maps `/resume` to the PDF.

## Code

- `src/pages/index.astro` – layout and markup
- `src/scripts/main.ts` – screen transitions (wheel/trackpad/keys/touch), nav, ⌘K palette, right-click menu
- `src/scripts/grid.ts` – canvas background grid with the cursor lens
- `src/scripts/slideshow.ts` + `src/components/Slideshow.astro` – projects slideshow

## Deploy

Workers Builds deploys `main` to production and uploads a preview version for every other branch
(`<branch>-website.jossayacamille.workers.dev`). Design decisions are recorded in `docs/redesign-spec.md`.
