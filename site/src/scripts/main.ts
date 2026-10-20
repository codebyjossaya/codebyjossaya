const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];

/* ---------- name typing ---------- */
const typed = $("[data-type]");
if (typed) {
  const name = typed.dataset.type!;
  typed.setAttribute("aria-label", name);
  typed.textContent = "";
  let n = 0;
  const step = () => {
    typed.textContent = name.slice(0, ++n);
    if (n < name.length) setTimeout(step, 60);
  };
  setTimeout(step, 250);
}

/* ---------- screens ----------
   The page itself doesn't scroll. Screens are stacked vertically; a wheel
   notch, trackpad swipe, key or touch swipe slides the current one up and out
   while the next rises in, and its content animates in. Tall screens scroll
   inside first. On phones the header is the first screen. */
const baseScreens = $$("[data-screen]");
const side = $(".side")!;
// on phones the header (photo, name, links) is the first screen
const mobile = matchMedia("(max-width: 1023px)");
let screens = baseScreens;
const sections = $$("[data-section]");
const navLinks = new Map($$<HTMLAnchorElement>("[data-nav]").map((a) => [a.dataset.nav!, a]));
const root = document.documentElement;
let active = "";
let cur = 0;

const setActive = (id: string) => {
  if (id === active) return;
  navLinks.get(active)?.classList.remove("active");
  navLinks.get(id)?.classList.add("active");
  active = id;
};

// which section is "current": the last one whose top has passed 35% of the view
const activeIn = (list: HTMLElement[], top: number, atEnd: boolean) => {
  if (!list.length) return "";
  let id = list[0].id;
  for (const s of list) if (s.getBoundingClientRect().top <= top) id = s.id;
  return atEnd ? list.at(-1)!.id : id;
};
const syncActive = () => {
  if (root.classList.contains("wheel")) {
    const sc = screens[cur];
    const list = $$("[data-section]", sc);
    setActive(activeIn(list, innerHeight * 0.35, sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2 && sc.scrollTop > 0));
  } else {
    setActive(activeIn(sections, innerHeight * 0.35, innerHeight + scrollY >= root.scrollHeight - 2));
  }
};

const reveal = (sc: Element) => sc.classList.add("shown");

const place = (n: number, dir: 1 | -1 | 0) => {
  screens.forEach((sc, k) => {
    sc.classList.toggle("cur", k === n);
    sc.classList.toggle("above", k < n);
    sc.classList.toggle("below", k > n);
    sc.toggleAttribute("inert", k !== n);
  });
  const sc = screens[n];
  if (dir === -1) sc.scrollTop = sc.scrollHeight; // coming back up: start at its end
  else if (dir === 1) sc.scrollTop = 0;
  // replay the arrival animation each time a screen turns in
  sc.classList.remove("shown");
  void (sc as HTMLElement).offsetWidth;
  requestAnimationFrame(() => reveal(sc));
};

// a short lock so one notch can't skip two screens; trackpad momentum from the
// same swipe is ignored, but a new swipe can turn again right away
let lockUntil = 0, lastWheel = 0, acc = 0, lastDy = 0, coasting = false, minDy = Infinity, maxDy = 0;
let hist: number[] = [];
const TURN_MS = 450;
const turn = (n: number) => {
  n = Math.max(0, Math.min(screens.length - 1, n));
  if (n === cur) return false;
  const dir = n > cur ? 1 : -1;
  cur = n;
  place(n, dir);
  lockUntil = performance.now() + TURN_MS;
  acc = 0;
  coasting = true;
  minDy = Infinity;
  maxDy = 0;
  hist = [];
  closeMenu();
  syncActive();
  return true;
};

const canScroll = (sc: HTMLElement, dir: number) =>
  dir > 0 ? sc.scrollTop + sc.clientHeight < sc.scrollHeight - 2 : sc.scrollTop > 2;

const onWheel = (e: WheelEvent) => {
  if (!root.classList.contains("wheel") || e.ctrlKey) return;
  if (e.target instanceof Element && e.target.closest("dialog, [data-ctx]")) return;
  e.preventDefault();
  const now = performance.now();
  const gap = now - lastWheel;
  lastWheel = now;
  const raw = Math.abs(e.deltaY);
  // Momentum after a swipe keeps shrinking. A new swipe shows up as a pause,
  // or as deltas climbing again after the momentum has died down.
  if (coasting) {
    maxDy = Math.max(maxDy, raw);
    minDy = Math.min(minDy, raw);
    hist.push(raw);
    if (hist.length > 6) hist.shift();
    const avg = (a: number[]) => a.reduce((x, y) => x + y, 0) / (a.length || 1);
    // only call it a new swipe once the old one has clearly died down AND the
    // recent deltas are clearly climbing (averaged, so jitter doesn't count)
    const decayed = minDy < maxDy * 0.3;
    const climbing = hist.length === 6 && avg(hist.slice(3)) > avg(hist.slice(0, 3)) * 1.8 + 4 && raw >= 12;
    const freshSwipe = gap > 200 || (decayed && climbing);
    const notch = raw >= 50 && Math.abs(raw - lastDy) < 1 && gap > 120;
    if (freshSwipe || notch) coasting = false;
  }
  lastDy = raw;
  if (now < lockUntil || coasting) return;
  const sc = screens[cur];
  const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  if (canScroll(sc, dy)) { sc.scrollTop += dy; acc = 0; return; }
  acc += dy;
  if (Math.abs(acc) > 50) turn(cur + Math.sign(acc));
};

const enableWheel = () => {
  root.classList.add("wheel");
  [side, ...baseScreens].forEach((sc) => { sc.classList.remove("cur", "above", "below", "shown"); sc.removeAttribute("inert"); });
  side.classList.toggle("screen", mobile.matches);
  screens = mobile.matches ? [side, ...baseScreens] : baseScreens;
  const fromHash = location.hash && document.getElementById(location.hash.slice(1));
  cur = fromHash ? Math.max(0, screens.findIndex((s) => s.contains(fromHash))) : 0;
  place(cur, 0);
  syncActive();
};

// touch: swipe up/down past the edge of the current screen turns it
let ty0 = 0, tx0 = 0, edgeDown = false, edgeUp = false;
addEventListener("touchstart", (e) => {
  if (e.touches.length !== 1 || (e.target as Element).closest?.("dialog, [data-ctx]")) return;
  const sc = screens[cur];
  ty0 = e.touches[0].clientY; tx0 = e.touches[0].clientX;
  edgeDown = !canScroll(sc, 1); edgeUp = !canScroll(sc, -1);
}, { passive: true });
addEventListener("touchend", (e) => {
  const t = e.changedTouches[0];
  const dy = ty0 - t.clientY, dx = tx0 - t.clientX;
  if (Math.abs(dy) < 50 || Math.abs(dx) > Math.abs(dy)) return;
  const sc = screens[cur];
  if (dy > 0 && edgeDown && !canScroll(sc, 1)) turn(cur + 1);
  else if (dy < 0 && edgeUp && !canScroll(sc, -1)) turn(cur - 1);
}, { passive: true });

addEventListener("wheel", onWheel, { passive: false });
[side, ...baseScreens].forEach((sc) => sc.addEventListener("scroll", () => { if (sc === screens[cur]) { syncActive(); closeMenu(); } }, { passive: true }));
let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; syncActive(); });
}, { passive: true });

const goTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  history.replaceState(null, "", `#${id}`);
  if (root.classList.contains("wheel")) {
    const n = screens.findIndex((s) => s.contains(el));
    turn(n);
    const sc = screens[n];
    const first = sc.querySelector("[data-section]") === el;
    sc.scrollTo({ top: first ? 0 : el.offsetTop - 96, behavior: "smooth" });
    setActive(id);
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
};
navLinks.forEach((a, id) => a.addEventListener("click", (e) => { e.preventDefault(); goTo(id); }));

const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

// keys: move within a tall screen first, then turn to the next one
const jump = (dir: 1 | -1) => {
  if (performance.now() < lockUntil) return;
  coasting = false;
  const sc = screens[cur];
  if (canScroll(sc, dir)) sc.scrollBy({ top: dir * sc.clientHeight * 0.8, behavior: "smooth" });
  else turn(cur + dir);
};

const applyMode = () => enableWheel();
mobile.addEventListener("change", applyMode);

/* ---------- toast + actions ---------- */
const toast = $("[data-toast]")!;
let toastTimer: number | undefined;
const say = (msg: string) => {
  toast.textContent = msg;
  toast.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("on"), 1600);
};
const copy = async (text: string) => {
  try { await navigator.clipboard.writeText(text); say("copied"); } catch { say(text); }
};
const friendUrls: string[] = JSON.parse($("#friend-urls")?.textContent || "[]");

const run = (cmd: string) => {
  const [kind, ...rest] = cmd.split(":");
  const arg = rest.join(":");
  if (kind === "goto") goTo(arg);
  else if (kind === "copy") copy(arg);
  else if (kind === "open") window.open(arg, "_blank", "noopener");
  else if (kind === "download") { const a = document.createElement("a"); a.href = arg; a.download = ""; a.click(); }
  else if (kind === "friend") window.open(friendUrls[Math.floor(Math.random() * friendUrls.length)], "_blank", "noopener");
  else if (kind === "palette") openPalette();
};

$$<HTMLButtonElement>("[data-copy]").forEach((b) => b.addEventListener("click", () => copy(b.dataset.copy!)));

/* ---------- ⌘K palette ---------- */
const dialog = $<HTMLDialogElement>("[data-palette]")!;
const input = $<HTMLInputElement>("[data-q]", dialog)!;
const items = $$<HTMLLIElement>("[data-run]", dialog);
const empty = $("[data-empty]", dialog)!;
let sel = 0;
const visible = () => items.filter((i) => !i.hidden);
const select = (n: number) => {
  const v = visible();
  if (!v.length) return;
  sel = (n + v.length) % v.length;
  v.forEach((li, k) => li.setAttribute("aria-selected", String(k === sel)));
  v[sel].scrollIntoView({ block: "nearest" });
};
const filter = () => {
  const q = input.value.trim().toLowerCase();
  if (/^sudo\b/.test(q)) {
    items.forEach((i) => (i.hidden = true));
    empty.textContent = "nice try.";
    empty.hidden = false;
    return;
  }
  items.forEach((i) => (i.hidden = !i.dataset.text!.includes(q)));
  empty.textContent = "no matches";
  empty.hidden = visible().length > 0;
  select(0);
};
function openPalette() {
  closeMenu();
  if (dialog.open) return;
  input.value = "";
  filter();
  dialog.showModal();
  input.focus();
}
const choose = (li?: HTMLElement) => {
  if (!li) return;
  dialog.close();
  run(li.dataset.run!);
};
input.addEventListener("input", filter);
input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") { e.preventDefault(); select(sel + 1); }
  else if (e.key === "ArrowUp") { e.preventDefault(); select(sel - 1); }
  else if (e.key === "Enter") { e.preventDefault(); choose(visible()[sel]); }
});
items.forEach((li) => {
  li.addEventListener("click", () => choose(li));
  li.addEventListener("pointermove", () => select(visible().indexOf(li)));
});
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
$$("[data-open-palette]").forEach((b) => b.addEventListener("click", openPalette));

/* ---------- right-click menu ---------- */
const menu = $("[data-ctx]")!;
function closeMenu() { menu.hidden = true; }
const openMenu = (x: number, y: number) => {
  $$<HTMLButtonElement>("[data-sec]", menu).forEach((b) => b.classList.toggle("active", b.dataset.sec === active));
  menu.hidden = false;
  const r = menu.getBoundingClientRect();
  menu.style.left = `${Math.min(x, innerWidth - r.width - 8)}px`;
  menu.style.top = `${Math.min(y, innerHeight - r.height - 8)}px`;
};
addEventListener("contextmenu", (e) => {
  if (e.shiftKey || typing(e.target)) return;
  e.preventDefault();
  openMenu(e.clientX, e.clientY);
});
$$<HTMLButtonElement>("[data-run]", menu).forEach((b) => b.addEventListener("click", () => { closeMenu(); run(b.dataset.run!); }));
addEventListener("pointerdown", (e) => { if (!menu.hidden && !menu.contains(e.target as Node)) closeMenu(); });
addEventListener("scroll", () => { if (!menu.hidden) closeMenu(); }, { passive: true });
applyMode();
addEventListener("resize", closeMenu);

// long-press on touch opens the same menu (outside links/buttons)
let press: number | undefined;
addEventListener("touchstart", (e) => {
  const t = e.target as HTMLElement;
  if (e.touches.length !== 1 || t.closest("a, button, input, [data-stage]")) return;
  const { clientX, clientY } = e.touches[0];
  press = window.setTimeout(() => openMenu(clientX, clientY), 550);
}, { passive: true });
["touchend", "touchmove", "touchcancel"].forEach((ev) => addEventListener(ev, () => clearTimeout(press), { passive: true }));

/* ---------- global keys ---------- */
addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    dialog.open ? dialog.close() : openPalette();
    return;
  }
  if (e.key === "Escape" && !menu.hidden) { closeMenu(); return; }
  if (dialog.open || typing(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
  if (/^[1-9]$/.test(e.key)) {
    const s = sections[Number(e.key) - 1];
    if (s) { e.preventDefault(); goTo(s.id); }
    return;
  }
  if (!root.classList.contains("wheel")) return;
  const down = ["j", "PageDown", "ArrowDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
  const up = ["k", "PageUp", "ArrowUp"].includes(e.key) || (e.key === " " && e.shiftKey);
  if (down || up) { e.preventDefault(); jump(down ? 1 : -1); }
});

// /?k (from the 404 page) opens the palette on arrival
if (new URLSearchParams(location.search).has("k")) {
  history.replaceState(null, "", location.pathname + location.hash);
  openPalette();
}
