// Fixed full-screen grid. Near the pointer the lines bow outward (lens) and
// brighten to tinted white. Redrawn only while something is animating.

const CELL = 48;
const RADIUS = 150;
const WARP = 6; // px of displacement at the lens center
const BASE = "rgba(255,255,255,0.045)";
const GLOW = [243, 234, 255]; // #f3eaff
const GLOW_ALPHA = 0.24;
const STEP = 6; // sampling step for bent lines
const ACCENT = [194, 122, 255]; // #c27aff
const RIPPLE_MS = 900; // how long a click wave takes to cross the screen
const RIPPLE_WARP = 15; // px of displacement at the trough and at the crest
const BAND = 80; // half-width of one lobe, in px
const LOBE = 1 / 0.4289; // normalises u*exp(-u^2) so its peak is 1
const MAX_RIPPLES = 3;

const canvas = document.getElementById("grid") as HTMLCanvasElement | null;
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)");

  let w = 0, h = 0, dpr = 1;
  // pointer target and spring-lagged lens position
  let tx = -1e4, ty = -1e4, lx = -1e4, ly = -1e4;
  let amp = 0, ampTarget = 0; // warp amount 0..1
  let glow = 0, glowTarget = 0; // glow visibility 0..1
  let raf = 0;
  // click waves: each one is a purple crest travelling out from where it started
  type Ripple = { x: number; y: number; t0: number };
  let ripples: Ripple[] = [];
  let now = 0; // frame time, shared by warp() and draw()
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const span = () => Math.hypot(w, h); // distance a wave covers in RIPPLE_MS
  const crest = (rp: Ripple) => {
    const p = Math.min(1, (now - rp.t0) / RIPPLE_MS);
    return { p, r: p * span(), life: (1 - p) * (1 - p) };
  };

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };

  // displacement of point (x, y): the lens pushes it away from the cursor, and
  // each live click wave pushes it outward as the crest passes through
  const warp = (x: number, y: number): [number, number] => {
    let ox = x, oy = y;
    const dx = x - lx, dy = y - ly;
    const r = Math.hypot(dx, dy);
    if (r > 0 && r < RADIUS) {
      const t = 1 - (r / RADIUS) ** 2;
      const d = WARP * amp * t * t;
      ox += (dx / r) * d; oy += (dy / r) * d;
    }
    if (!reduced.matches) {
      for (const rp of ripples) {
        const ex = x - rp.x, ey = y - rp.y;
        const er = Math.hypot(ex, ey);
        if (er === 0) continue;
        const { r: cr, life } = crest(rp);
        const u = (er - cr) / BAND;
        if (u < -2.5 || u > 2.5) continue;
        // one full wave: the leading edge (u > 0) pulls in, the trailing edge
        // (u < 0) lifts out, so a point dips and then rises as the wave passes
        const d = RIPPLE_WARP * life * LOBE * -u * Math.exp(-u * u);
        ox += (ex / er) * d; oy += (ey / er) * d;
      }
    }
    return [ox, oy];
  };

  const linePaths = (bentOnly: boolean) => {
    ctx.beginPath();
    const near = (v: number, c: number) => Math.abs(v - c) < RADIUS + WARP;
    const waving = ripples.length > 0;
    for (let x = 0.5; x <= w; x += CELL) {
      const bend = waving || (amp > 0.001 && near(x, lx));
      if (bentOnly && !near(x, lx)) continue;
      if (!bend) { ctx.moveTo(x, 0); ctx.lineTo(x, h); continue; }
      ctx.moveTo(x, 0);
      for (let y = 0; y <= h; y += STEP) { const [px, py] = warp(x, y); ctx.lineTo(px, py); }
      ctx.lineTo(x, h);
    }
    for (let y = 0.5; y <= h; y += CELL) {
      const bend = waving || (amp > 0.001 && near(y, ly));
      if (bentOnly && !near(y, ly)) continue;
      if (!bend) { ctx.moveTo(0, y); ctx.lineTo(w, y); continue; }
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += STEP) { const [px, py] = warp(x, y); ctx.lineTo(px, py); }
      ctx.lineTo(w, y);
    }
  };

  const draw = () => {
    now = performance.now();
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1;
    ctx.strokeStyle = BASE;
    linePaths(false);
    ctx.stroke();
    if (glow > 0.005) {
      const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, RADIUS);
      const [r, gg, b] = GLOW;
      g.addColorStop(0, `rgba(${r},${gg},${b},${GLOW_ALPHA * glow})`);
      g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
      ctx.strokeStyle = g;
      linePaths(true);
      ctx.stroke();
    }
    // the crest itself: a purple ring of light riding over the whole grid
    const [ar, ag, ab] = ACCENT;
    for (const rp of ripples) {
      const { r, life } = crest(rp);
      const g = ctx.createRadialGradient(rp.x, rp.y, Math.max(0, r - 1.6 * BAND), rp.x, rp.y, r + BAND);
      g.addColorStop(0, `rgba(${ar},${ag},${ab},0)`);
      g.addColorStop(0.45, `rgba(${ar},${ag},${ab},${0.55 * life})`);
      g.addColorStop(0.72, `rgba(${ar},${ag},${ab},${0.3 * life})`);
      g.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
      ctx.strokeStyle = g;
      linePaths(false);
      ctx.stroke();
    }
  };

  const tick = () => {
    raf = 0;
    ripples = ripples.filter((rp) => performance.now() - rp.t0 < RIPPLE_MS);
    if (lx < -1e3) { lx = tx; ly = ty; }
    lx += (tx - lx) * 0.18;
    ly += (ty - ly) * 0.18;
    amp += (ampTarget - amp) * 0.12;
    glow += (glowTarget - glow) * 0.15;
    draw();
    const settled = !ripples.length &&
      Math.abs(tx - lx) < 0.1 && Math.abs(ty - ly) < 0.1 &&
      Math.abs(ampTarget - amp) < 0.002 && Math.abs(glowTarget - glow) < 0.002;
    if (!settled) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

  // The lens stays bent while the cursor is over the page; it only follows with
  // a slight spring lag. Not gated on reduced motion: it is small and pointer-driven.
  addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || !finePointer.matches) return;
    tx = e.clientX; ty = e.clientY;
    glowTarget = 1;
    ampTarget = 1;
    kick();
  }, { passive: true });

  document.documentElement.addEventListener("pointerleave", () => {
    glowTarget = 0; ampTarget = 0; kick();
  });

  // clicking the page itself (not a control) drops a wave at the pointer
  const CONTROLS = "a, button, input, textarea, select, label, dialog, [role=option], [data-ctx], [data-stage], [tabindex]:not(.screen)";
  addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    if (e.target instanceof Element && e.target.closest(CONTROLS)) return;
    if (getSelection()?.toString()) return; // dismissing a selection isn't a click on the grid
    ripples.push({ x: e.clientX, y: e.clientY, t0: performance.now() });
    if (ripples.length > MAX_RIPPLES) ripples.shift();
    kick();
  }, { passive: true });

  addEventListener("resize", resize);
  resize();
}
