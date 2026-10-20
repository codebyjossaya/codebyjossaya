# jcamille.dev redesign — spec & handoff

Status (2026-10-20): design approved in Figma, **nothing implemented yet**. Next step is building it and opening a PR (do not push to `main` directly).

- Figma file: https://www.figma.com/design/fnMYLGNtbgFmtH8ocoA9uU (team plan `team::1690746272362403981`)
  - Page **Site**: `Desktop — 1440` (2:2), `Mobile — 390` (3:2), `⌘K command palette` (3:217), `Right-click menu` (3:261), `404` (3:302), `Name typing` (5:92), `Scroll snap` diagram (21:10), `Spec` panel (22:4)
  - Page **Dashboard**: 14 screens, `Dashboard — <name>` (posts, post editor, profile, contact, experience, projects, friends, resume, sections & layout, appearance, commands & menus, seo & sharing, footer & 404, deploys)
- Owner: Jossaya Camille (jossayacamille@gmail.com), 2nd-year Computer Engineering at UF.

## Hard requirements from the owner

- Black/near-black theme, developer feel, but **not boring** (apatel.co and brittanychiang.com are references; both are "too plain").
- Must not look AI-generated or vibe-coded. Rejected so far: Space Grotesk / Geist Mono, a dot before the "currently" line, card boxes around experience/projects, invented bio copy, decorative nav lines and `·` separators, deep purple. Also avoid: gradients, glassmorphism, glows, emoji bullets, "Hi 👋" heroes, two-CTA heroes, 3-card grids, gradient text, filler words ("passionate", "crafting", "seamless"), particle/blob/matrix backgrounds.
- Owner dislikes "performative" extras — keep flair restrained.
- Fast load, responsive (desktop + mobile), modern browsers only (no IE / old Safari).
- Keep the current photo and current favicon. Remove the old hero background image and the old gradient.
- Dark mode only.
- `prefers-reduced-motion`: keep fades, drop movement/gliding. Do **not** disable all animation (owner's machine has it on).

## Visual system

| Token | Value |
|---|---|
| background | `#0b0b0d` |
| surface | `#141418` (dashboard `#121215`) |
| lines | `#25252b` |
| text | `#e8e8ec` |
| muted | `#8b8b95` |
| dim | `#5c5c66` |
| accent | `#c27aff` (Tailwind v4 purple-400, same as current site) — final |

- Fonts (final): **IBM Plex Mono** for name, nav, labels, meta, tags; **Inter** for body. Self-host, subset, `font-display: swap`.
- Accent use is sparing: links, section labels (`01 / about`), active states, cursor block.
- Background: full-viewport grid, 48px cells, white lines ~4.5% opacity, `position: fixed` (does not scroll, always fills the screen). Lines within ~150px of the cursor brighten to **tinted white `#f3eaff`** (~24% opacity), radial falloff. Desktop/pointer only; fades out when cursor leaves.

## Layout (single page)

Desktop: split layout like brittanychiang.com. Left column (~440px) is sticky; right column (~648px) scrolls.

Left (sticky):
1. Circular photo (120px desktop / 88px mobile), cropped centered on the face. Source: `public/5581743_7783294_84_62569047.JPG` (serve ~15KB WebP).
2. Name "Jossaya Camille" in Plex Mono Bold with a purple blinking block cursor. On load the name **types in** (~60ms/char), cursor keeps blinking.
3. "Software Engineer Intern @ AD Vantage" (no dot/icon before it).
4. No short bio line under the name (owner rejected it).
5. Nav: `01 about`, `02 contact`, `03 experience`, `04 projects`, `05 friends` (+ `06 writing` only when a post exists). Number + label only, active = brighter text.
6. Screen counter `01 / 04` under nav (scroll-snap position).
7. Socials: github, linkedin, devpost, `resume.pdf ↓` (accent).
8. Hint chip: `⌘K  jump anywhere, right-click for more`.

Right (sections, in this order): about, contact, experience, projects, friends, (writing — hidden until first post), footer.

Mobile: sticky top bar (`~/jossaya` + `menu ⌘` button), header (photo, name, currently, socials), then sections stacked. Experience rows stack date above content.

### Sections content

**about**
> I'm Jossaya, a second-year computer engineering student at UF. For the last few years, I have been exploring my passion for applied machine learning and computer vision through research experience, coursework, and personal projects.
>
> I'm also drawn to software engineering, full-stack web development, and embedded systems.

(The LinkedIn "always down to connect…" line was intentionally dropped.) Stack tags as plain mono text, no pills: python, pytorch, opencv, typescript, react, postgres, c/c++, vhdl.

**contact** — rows with hairline dividers, label column + value: email `jossayacamille@gmail.com` (plain text, with copy button), github.com/codebyjossaya, linkedin.com/in/jossayacamille, devpost (URL to confirm with owner), resume.pdf (download).

**experience** — no cards; rows with bottom divider, date column left (mono), role `@ org` (org accent + ↗ on hover), one short summary, `#tags`. From resume (`~/Downloads/main.tex`):
1. Sep 2026 — now · Software Engineer Intern @ AD Vantage — coach search: UI, Postgres, REST.
2. Jan — May 2026 · Software Research Assistant @ UF Nelms Institute (PI Swarup Bhunia) — NIR spectroscopy, 2,400 samples, SVM/RF dual-head, 88.4% acc, sub-0.15mm MAE.
3. Aug — Dec 2025 · Robotics Software Contributor @ UF Machine Intelligence Lab — MiDaS / DepthAnythingV2 / DepthPro on Jetson Nano, SubjuGator AUV.
4. May 2024 — May 2025 · Software Research Assistant @ FAU BSIA Lab (PI Behnaz Ghoraani) — monocular 3D pose gait analysis, research grant.

**projects** — ONE scroll-snap screen containing a slideshow. One image per project. Slide = large image (rounded 6px, `03 / 05` counter badge top-right) + title ↗ + year + context line (accent mono) + one-line description + `#tags`.
- Nav below slide: `←` button, dots, `→` button. **No project titles in the nav.** Dots: featured group, small gap, "more" group. Active dot is a wider pill that fills with purple as a timer.
- Auto-advance every 6s, pause on hover, loop. Click dot/arrow jumps and resets timer. Crossfade transition. Reduced motion: crossfade stays, auto-advance paused. Mobile: swipe.
- Featured (order): SignSpeak (Hacklytics 2026; PyTorch CNN on HiPerGator, TF.js, Nuxt, Gemini — **needs screenshot**), Monocular gait analysis (FAU BSIA, `3DHPE_GaitAnalysis` repo; image maybe `public/hpe/`), Solar Cybersedan (FAU AEV club; tags **#javascript** — NOT C++; image `public/alset/alset-1.jpg`; links: FAU article + `YamanDevelopment/AEV-Software`).
- More (placeholders, confirm with owner): VaultTune, Marston. Owner has more projects "in the works".
- Lazy-load non-current slide images; AVIF/WebP.

**friends** — intro line "people i build with, learn from, and bother." Then one row per friend: name, one-liner (taken from the friend's own site), url ↗. Order doesn't matter (shuffle allowed). Thandi was intentionally removed.
| name | url | one-liner |
|---|---|---|
| Amarnath Patel | https://apatel.co | physics (optics & lasers) and math at UCF |
| Zachary Lopez | https://zachl.tech | computer engineer & software developer |
| Makai Pindell | https://makaip.com | ML enthusiast and software developer |
| Alex Castronovo | https://alexcastronovo.com | programmer, neuroscience researcher, satellite subsystem lead |

Below the friends list: a **photo slideshow** of 8 group photos (rounded 6px, full column width, `1 / 8` counter badge, dim mono caption under the image, same ← dots → nav and 6s auto-advance as the projects slideshow). Order: FIU arch sculpture at night; prom selfie; research symposium; FAU graduation; restaurant selfie; HiPerGator server room; marsh boardwalk; Salt Company Gainesville wall. Only the symposium photo has a caption so far: "April 2025 - Research presentation at FAU Wilkes Honors College Symposium" — owner will write the rest (do not invent captions). Photos were shared in chat, not yet in the repo; ask the owner for the files.

Dashboard friends screen: "upload photos" button, thumbnail strip (drag to reorder, + add), and a selected-photo editor with caption, alt text, replace, adjust crop, remove. Project slides also get an optional caption + alt text field. Everything with an image must be captionable and replaceable by the owner.

**writing** — hidden (section, nav, menus) until at least one post is published.

**footer** — "made with ❤️ by Jossaya Camille" + "view source on github" + last deployed date.

## Interaction

- **Scroll snap**: `scroll-snap-type: y proximity` on the right column; sections grouped into screens: (1) about + contact, (2) experience (taller than viewport — free scroll inside), (3) projects, (4) friends + footer. Content fades up ~8px, staggered, once per screen. `j`/`k`, PgUp/PgDn, arrows jump screens. Off on mobile (fades kept).
- **⌘K palette**: centered panel, `>` prompt, results with verb column (go to / open / copy / download / visit) and shortcut hints; includes "visit a random friend's site" and a hidden `sudo` easter egg ("nice try.").
- **Right-click menu**: custom context menu (sections 01–06, copy email, view source, open ⌘K); active section highlighted. Shift+right-click opens the native menu. Long-press on mobile.
- **404**: terminal style — `$ cd /this-page`, red `cd: no such file or directory`, big `404` with cursor block, "you wandered off. try ⌘K, or cd ~ to go home."
- Hover: subtle color change, no scale/bounce.

## Dashboard (`/admin`)

Goal: "everything on the site as editable as possible." Screens (see Figma Dashboard page):
- content: posts (list), post editor (markdown + live preview, slug/tags/date/cover, autosave, preview/schedule/publish), profile (photo + crop, name, tab title, currently line, typing toggle, about markdown, stack tags), contact (links + per-link visibility in sidebar/contact/⌘K/right-click, email copy toggle), experience (drag reorder, role/company/dates/link/summary/tags/visible), projects (featured vs more groups, drag between, slide number, image upload + desktop/mobile crop focus, featured toggle, auto-advance toggle), friends (name/site/one-liner, fetch description from site, weekly broken-link check, intro line), resume (upload, filename, link label, version history/restore, optional build from main.tex).
- site: sections (order, visibility, labels, numbers, auto-hide when empty, "starts a new screen" for scroll snap, layout/sidebar width), appearance (accent presets + custom, background, fonts, grid toggle/opacity, cursor glow, blinking cursor, fade-ins), commands & menus (table of commands, shortcuts, ⌘K/right-click visibility), seo & sharing (title, description, OG image auto/upload, favicon, Cloudflare Web Analytics), footer & 404 text, deploys (history, status, rollback).
- Layout itself is not editable beyond order/visibility/sidebar width (keeps the design from drifting).

## Architecture (recommended, not yet confirmed in code)

- Current repo: React Router 7 on Cloudflare Workers (`wrangler.jsonc`, `workers/app.ts`, `app/routes/home.tsx`), Tailwind v4. Owner gave full discretion to change stack.
- Recommended: **Astro** static output on Cloudflare Workers, small vanilla/TS islands for ⌘K, context menu, typing, grid glow, slideshow, scroll-snap sync. Deploys automatically from `main`; work goes through a PR.
- Content as files in the repo (JSON/Markdown). Dashboard at `/admin` behind **Cloudflare Access** (owner's email only); publish = commit via GitHub API → auto-deploy. (Alternative considered: D1 database; rejected as more complex.)
- Analytics: Cloudflare Web Analytics (cookieless).
- OG image auto-generated from name + currently line.

## Open items

- SignSpeak and Marston images; confirm the "more" projects list.
- Devpost URL.
- Writing post titles in Figma are placeholders.
