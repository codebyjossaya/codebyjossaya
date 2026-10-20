// Fixed full-screen grid. Near the pointer the lines bow outward (lens) and
// brighten to tinted white. Redrawn only while something is animating.

const CELL = 48;
const RADIUS = 150;
const WARP = 6; // px of displacement at the lens center
const BASE = "rgba(255,255,255,0.045)";
const GLOW = [243, 234, 255]; // #f3eaff
const GLOW_ALPHA = 0.24;
const STEP = 6; // sampling step for bent lines

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

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };

  // displacement of point (x, y) away from the lens center
  const warp = (x: number, y: number): [number, number] => {
    const dx = x - lx, dy = y - ly;
    const r = Math.hypot(dx, dy);
    if (r >= RADIUS || r === 0) return [x, y];
    const t = 1 - (r / RADIUS) ** 2;
    const d = WARP * amp * t * t;
    return [x + (dx / r) * d, y + (dy / r) * d];
  };

  const linePaths = (bentOnly: boolean) => {
    ctx.beginPath();
    const near = (v: number, c: number) => Math.abs(v - c) < RADIUS + WARP;
    for (let x = 0.5; x <= w; x += CELL) {
      const bend = amp > 0.001 && near(x, lx);
      if (bentOnly && !near(x, lx)) continue;
      if (!bend) { ctx.moveTo(x, 0); ctx.lineTo(x, h); continue; }
      ctx.moveTo(x, 0);
      for (let y = 0; y <= h; y += STEP) { const [px, py] = warp(x, y); ctx.lineTo(px, py); }
      ctx.lineTo(x, h);
    }
    for (let y = 0.5; y <= h; y += CELL) {
      const bend = amp > 0.001 && near(y, ly);
      if (bentOnly && !near(y, ly)) continue;
      if (!bend) { ctx.moveTo(0, y); ctx.lineTo(w, y); continue; }
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += STEP) { const [px, py] = warp(x, y); ctx.lineTo(px, py); }
      ctx.lineTo(w, y);
    }
  };

  const draw = () => {
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
  };

  const tick = () => {
    raf = 0;
    if (lx < -1e3) { lx = tx; ly = ty; }
    lx += (tx - lx) * 0.18;
    ly += (ty - ly) * 0.18;
    amp += (ampTarget - amp) * 0.12;
    glow += (glowTarget - glow) * 0.15;
    draw();
    const settled =
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

  addEventListener("resize", resize);
  resize();
}
