const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const desktop = matchMedia("(min-width: 1024px)");
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

/* ---------- fade-ins, once per screen ---------- */
const screens = $$("[data-screen]");
const fadeObs = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("shown"); fadeObs.unobserve(e.target); }
}, { threshold: 0.12 });
screens.forEach((s) => fadeObs.observe(s));

/* ---------- active section ---------- */
const sections = $$("[data-section]");
const navLinks = new Map($$<HTMLAnchorElement>("[data-nav]").map((a) => [a.dataset.nav!, a]));
let active = "";
const updateActive = () => {
  const line = innerHeight * 0.35;
  let current = sections[0]?.id ?? "";
  for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
  // at the very bottom, the last section wins
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) current = sections.at(-1)!.id;
  if (current === active) return;
  navLinks.get(active)?.classList.remove("active");
  navLinks.get(current)?.classList.add("active");
  active = current;
};
let ticking = false;
addEventListener("scroll", () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { ticking = false; updateActive(); });
}, { passive: true });
updateActive();

const behavior = (): ScrollBehavior => (reduced.matches ? "auto" : "smooth");
const goTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  // jump to the screen when the section starts one, so snap lines up
  const screen = el.closest("[data-screen]") as HTMLElement | null;
  const target = screen && screen.querySelector("[data-section]") === el ? screen : el;
  target.scrollIntoView({ behavior: behavior(), block: "start" });
  history.replaceState(null, "", `#${id}`);
};
navLinks.forEach((a, id) => a.addEventListener("click", (e) => { e.preventDefault(); goTo(id); }));

/* ---------- keyboard screen jumps (desktop, snap on) ---------- */
const typing = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

const jump = (dir: 1 | -1) => {
  const tops = screens.map((s) => s.getBoundingClientRect().top + scrollY);
  const y = scrollY;
  const idx = tops.findLastIndex((t) => t <= y + 4);
  const cur = screens[Math.max(idx, 0)];
  if (dir === 1) {
    const bottom = cur.getBoundingClientRect().bottom;
    // tall screens (experience, friends) scroll freely inside before moving on
    if (bottom > innerHeight + 8) {
      const next = tops[idx + 1];
      const by = Math.min(innerHeight * 0.85, bottom - innerHeight);
      return scrollTo({ top: next !== undefined && y + by >= next - 8 ? next : y + by, behavior: behavior() });
    }
    if (tops[idx + 1] !== undefined) scrollTo({ top: tops[idx + 1], behavior: behavior() });
  } else {
    const top = tops[Math.max(idx, 0)];
    if (y > top + 8) return scrollTo({ top: Math.max(top, y - innerHeight * 0.85), behavior: behavior() });
    if (idx > 0) scrollTo({ top: tops[idx - 1], behavior: behavior() });
  }
};

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
  if (!desktop.matches) return;
  const down = ["j", "PageDown", "ArrowDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
  const up = ["k", "PageUp", "ArrowUp"].includes(e.key) || (e.key === " " && e.shiftKey);
  if (down || up) { e.preventDefault(); jump(down ? 1 : -1); }
});

// /?k (from the 404 page) opens the palette on arrival
if (new URLSearchParams(location.search).has("k")) {
  history.replaceState(null, "", location.pathname + location.hash);
  openPalette();
}
