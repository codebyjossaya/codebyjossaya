# jcamille.dev redesign — spec & handoff

Status (2026-10-20): design approved in Figma, **nothing implemented yet**. Next step is building it and opening a PR (do not push to `main` directly).

- Figma file: https://www.figma.com/design/fnMYLGNtbgFmtH8ocoA9uU (team plan `team::1690746272362403981`)
  - Page **Site**: `Desktop — 1440` (2:2), `Mobile — 390` (3:2), `⌘K command palette` (3:217), `Right-click menu` (3:261), `404` (3:302), `Name typing` (5:92), `Scroll snap` diagram (47:25; regenerate from Desktop whenever sections change), `Nav crossfade` (44:2), `Spec` panel (22:4)
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
- Accent use is sparing: links, section labels (`about`), active states, cursor block.
- Background: full-viewport grid, 48px cells, white lines ~4.5% opacity, `position: fixed` (does not scroll, always fills the screen). Near the cursor (radius ~150px) the grid acts like a **lens**: lines bow outward up to **6px** at the center (falloff `(1-(r/R)^2)^2`) and brighten to **tinted white `#f3eaff`** (~24% opacity). The warp follows the cursor with a slight spring lag and eases back flat when the cursor stops (glow stays). Render on a `<canvas>` redrawn only while the pointer moves. Desktop/pointer only; fades out when cursor leaves. Dashboard appearance: "glow + warp near cursor" switch + warp strength slider. Figma: `Grid warp + glow` frame (48:2).

## Layout (single page)

Desktop: split layout like brittanychiang.com. Left column (~440px) is sticky; right column (~648px) scrolls.

Left (sticky):
1. Circular photo (120px desktop / 88px mobile), cropped centered on the face. Source: `public/5581743_7783294_84_62569047.JPG` (serve ~15KB WebP).
2. Name "Jossaya Camille" in Plex Mono Bold with a purple blinking block cursor. On load the name **types in** (~60ms/char), cursor keeps blinking.
3. "Software Engineer Intern @ AD Vantage" (no dot/icon before it).
4. No short bio line under the name (owner rejected it).
5. Nav: `about`, `experience`, `projects`, `other stuff`, `friends` (+ `writing` only when a post exists). **No section numbers anywhere** (owner: "we can count"). Active = brighter text plus a 1px, 40px line to its left (only the active item has a line). On section change the old label fades out and its line shrinks to 0 while the new label fades in and its line grows to 40px (250ms ease-out); jumps (e.g. about → friends) crossfade directly, labels in between never light up.
6. (No screen counter.)
7. Contact lives here, not in a section of its own: a row of monochrome brand icons (github, linkedin, devpost — simple-icons, except LinkedIn's mark which the package dropped, so it is inlined in `index.astro`), grey, turning purple on hover. Below them a hairline divider, then the email `jossayacamille@gmail.com` (click to copy) and `resume.pdf ↓` (accent).
8. Above the ⌘K hint (mobile: bottom of header): Psalm 150:6, **ESV**, full verse in muted italic Inter 13px — "Let everything that has breath praise the LORD! Praise the LORD!" — with `psalm 150:6` in dim Plex Mono 11px below. Editable in the dashboard profile screen.
9. Hint chip: `⌘K  jump anywhere, right-click for more`.

Right (sections, in this order): about (prose + email + skills), experience, projects, other stuff i'm up to, friends, (writing — hidden until first post), footer.

Mobile: sticky top bar (`~/jossaya` + `menu ⌘` button), header (photo, name, currently, socials), then sections stacked. Experience rows stack date above content.

### Sections content

**about** — prose, then the email `jossayacamille@gmail.com` on its own line (muted mono 13px, click to copy, purple on hover), then the skills grid. There is **no contact section**: the links and resume live in the left column (see Left 7), and in ⌘K / the right-click menu.
> I'm Jossaya, a second-year computer engineering student at UF. For the last few years, I have been exploring my passion for applied machine learning and computer vision through research experience, coursework, and personal projects.
>
> I'm also drawn to software engineering, full-stack web development, and embedded systems.

(The LinkedIn "always down to connect…" line was intentionally dropped.) Skills: a grid of monochrome brand icons (simple-icons, rendered at build time, no runtime JS) with the name in small mono underneath, like the old site's skills grid; grey, turning purple (accent) on hover. List: Python, TypeScript, JavaScript, React, Node.js, Electron, C, C++, PyTorch, OpenCV, Postgres, Firebase, Docker, Cloudflare, Git, GitHub, Linux, EndeavourOS, Neovim (VS Code dropped: no icon in simple-icons).

**contact** — no section. Links: github.com/codebyjossaya, linkedin.com/in/jossayacamille, devpost.com/jossaya; email `jossayacamille@gmail.com`; resume.pdf (download). `jcamille.dev/resume` redirects (302, via `public/_redirects`) to the PDF so it opens in the browser.

**experience** — no cards; rows with bottom divider, date column left (mono), role `@ org` (org accent + ↗ on hover), one short summary, `#tags`. From resume (`~/Downloads/main.tex`):
1. Sep 2026 — now · Software Engineer Intern @ AD Vantage — coach search: UI, Postgres, REST.
2. Jan — May 2026 · Software Research Assistant @ UF Nelms Institute (PI Swarup Bhunia) — NIR spectroscopy, 2,400 samples, SVM/RF dual-head, 88.4% acc, sub-0.15mm MAE.
3. Aug — Dec 2025 · Robotics Software Contributor @ UF Machine Intelligence Lab — MiDaS / DepthAnythingV2 / DepthPro on Jetson Nano, SubjuGator AUV.
4. May 2024 — May 2025 · Software Research Assistant @ FAU BSIA Lab (PI Behnaz Ghoraani) — monocular 3D pose gait analysis, research grant.

**projects** — ONE scroll-snap screen containing a slideshow. One image per project. Slide = large image (rounded 6px, `05` counter badge top-right) + title ↗ + year + context line (accent mono) + one-line description + `#tags`.
- Nav below the slide, centred: a bigger `←` button (36px, 1px border, 20px glyph), dots, the same `→`. **No project titles in the nav.** Dots are plain 8px circles — dim grey for the rest, white for the one in view, no timer fill or pill (owner: the fill animation wasn't intuitive). Featured group, small gap, "more" group.
- Auto-advance every 6s on a JS timer, pause on hover or when the screen isn't in view, loop. Click dot/arrow jumps and resets the timer. Crossfade transition. Reduced motion: crossfade stays, auto-advance paused. Mobile: swipe.
- Featured (order): SignSpeak (Hacklytics 2026; PyTorch CNN on HiPerGator, TF.js, Nuxt, Gemini — **needs screenshot**), Monocular 3D Human Pose Estimation for Gait Analysis (FAU BSIA, `3DHPE_GaitAnalysis` repo; image maybe `public/hpe/`), Solar Cybersedan (FAU AEV club; tags **#javascript** — NOT C++; image `public/alset/alset-1.jpg`; links: FAU article + `YamanDevelopment/AEV-Software`).
- More (placeholders, confirm with owner): VaultTune, Marston. Owner has more projects "in the works".
- Lazy-load non-current slide images; AVIF/WebP.

**other stuff i'm up to** (section label `other stuff i'm up to`) — same row layout as experience but lighter: no dividers, no tags, no ↗, role in softer text (`#c9c9cf`), org muted, one short line. Placed directly below projects. One-liners confirmed by owner. Rows ordered oldest start date first.
1. Aug 2025 — now · Tech Coordinator @ DSI — Work with the eboard and other coordinators to maintain DSI's online presence.
2. Aug 2026 — now · Student Leader @ Salt Company GNV — Co-lead a weekly connection group as part of our weekly ministry.
3. Sep 2026 — now · Firmware Team @ Florida Rocket Lab — Write firmware for the lab's rocket avionics.
4. Oct 2026 — now · Stardust ↗ (https://github.com/jeebuscrossaint/stardust, live: stardust.jcamille.dev) — ML-accelerated asteroid precovery tool that refines asteroid orbits with past sightings and displays them in an asteroid tracker UI
5. Oct 2026 — now · Reconix ↗ (https://makaip.com/reconix) — Human-in-the-loop AI-powered pen testing browser.

**friends** — intro line "people i build with, learn from, and bother." Then one row per friend: name, one-liner (taken from the friend's own site), url ↗. Fixed order: Zachary Lopez, Makai Pindell, Amarnath Patel, Eoghan McIvor, Alex Castronovo. Thandi was intentionally removed.
| name | url | one-liner |
|---|---|---|
| Amarnath Patel | https://apatel.co | physics (optics & lasers) and math at UCF |
| Zachary Lopez | https://zachl.tech | computer engineer & software developer |
| Makai Pindell | https://makaip.com | ML enthusiast and software developer |
| Alex Castronovo | https://alexcastronovo.com | programmer, neuroscience researcher, satellite subsystem lead |
| Eoghan McIvor | https://eoghan.codes | full stack engineer into robotics and embedded systems software |

Below the friends list: **one** group photo — a restaurant-table selfie with friends (owner has their permission). **No caption.** Rounded 6px, full column width. No slideshow. All site images are re-encoded to WebP with EXIF/GPS stripped.

Dashboard friends screen: a single "group photo" field (replace, adjust crop, alt text). No captions on any photos.

**writing** — hidden (section, nav, menus) until at least one post is published.

**footer** — "made with ❤️ by Jossaya Camille" + "view source on github" + last deployed date.

## Interaction

- **Screen transitions (all devices)**: the page itself doesn't scroll. Sections are grouped into 5 screens: (1) about (prose, email, skills), (2) experience, (3) projects slideshow, (4) other stuff i'm up to, (5) friends + photo + footer. A wheel notch / trackpad swipe / `j` `k` / arrows / PgUp/PgDn slides the current screen up and out while the next rises in from below — flat vertical motion like a painted wheel seen face-on (no tilt, no 3D depth), ~0.62s ease-out; input re-enables ~0.45s after a turn starts, one screen per gesture, trackpad momentum from the same swipe is ignored but a new swipe turns immediately. Each screen's content animates in every time it arrives. Tall screens scroll inside first, then turn. Phones/tablets use the same screen transitions: the header (photo, name, links, verse) is the first screen, and a vertical swipe past the edge of the current screen turns it (tall screens scroll inside first).
- **Reduced motion**: the owner's machine has it on and wants animations anyway, so the grid warp, screen transitions, fades and slideshow autoplay are NOT disabled by `prefers-reduced-motion`.
- **⌘K palette**: centered panel, `>` prompt, results with verb column (go to / open / copy / download / visit) and shortcut hints; includes "visit a random friend's site" and a hidden `sudo` easter egg ("nice try.").
- **Right-click menu**: custom context menu (section names, copy email, view source, open ⌘K); active section highlighted. Shift+right-click opens the native menu. Long-press on mobile.
- **404**: terminal style — `$ cd /this-page`, red `cd: no such file or directory`, big `404` with cursor block, "you wandered off. try ⌘K, or cd ~ to go home."
- Hover: subtle color change, no scale/bounce.

## Dashboard (`/admin`)

Goal: "everything on the site as editable as possible." Screens (see Figma Dashboard page):
- content: posts (list), post editor (markdown + live preview, slug/tags/date/cover, autosave, preview/schedule/publish), profile (photo + crop, name, tab title, currently line, typing toggle, about markdown, stack tags), contact (links + per-link visibility in sidebar/⌘K/right-click, email copy toggle; edits the icon row, email and resume link in the left column), experience (drag reorder, role/company/dates/link/summary/tags/visible), projects (featured vs more groups, drag between, slide number, image upload + desktop/mobile crop focus, featured toggle, auto-advance toggle), friends (name/site/one-liner, fetch description from site, weekly broken-link check, intro line), resume (upload, filename, link label, version history/restore, optional build from main.tex).
- site: sections (order, visibility, labels, auto-hide when empty, "starts a new screen" for scroll snap, layout/sidebar width), appearance (accent presets + custom, background, fonts, grid toggle/opacity, cursor glow, blinking cursor, fade-ins), commands & menus (table of commands, shortcuts, ⌘K/right-click visibility), seo & sharing (title, description, OG image auto/upload, favicon, Cloudflare Web Analytics), footer & 404 text, deploys (history, status, rollback).
- Layout itself is not editable beyond order/visibility/sidebar width (keeps the design from drifting).

## Architecture (recommended, not yet confirmed in code)

- Current repo: React Router 7 on Cloudflare Workers (`wrangler.jsonc`, `workers/app.ts`, `app/routes/home.tsx`), Tailwind v4. Owner gave full discretion to change stack.
- Recommended: **Astro** static output on Cloudflare Workers, small vanilla/TS islands for ⌘K, context menu, typing, grid glow, slideshow, scroll-snap sync. Deploys automatically from `main`; work goes through a PR.
- Content as files in the repo (JSON/Markdown). Dashboard at `/admin` behind **Cloudflare Access** (owner's email only); publish = commit via GitHub API → auto-deploy. (Alternative considered: D1 database; rejected as more complex.)
- Analytics: Cloudflare Web Analytics (cookieless).
- OG image auto-generated from name + currently line.

## Open items

- SignSpeak and Marston images; confirm the "more" projects list.
- Writing post titles in Figma are placeholders.
