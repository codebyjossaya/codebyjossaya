// Auto-advance is driven by the active dot's fill animation: when it ends,
// go to the next slide. Hover (or being off screen) pauses the animation.


function load(slide: Element | undefined) {
  slide?.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((img) => {
    img.src = img.dataset.src!;
    img.removeAttribute("data-src");
  });
}

export function initSlideshows() {
  document.querySelectorAll<HTMLElement>("[data-show]:not([data-ready])").forEach((root) => {
    root.dataset.ready = "";
    const slides = [...root.querySelectorAll<HTMLElement>(".slide")];
    const dots = [...root.querySelectorAll<HTMLButtonElement>("[data-dot]")];
    let i = 0;

    const go = (n: number) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        s.classList.toggle("on", k === i);
        s.toggleAttribute("inert", k !== i);
      });
      dots.forEach((d) => d.removeAttribute("aria-current"));
      void root.offsetWidth; // restart the fill animation
      dots[i]?.setAttribute("aria-current", "true");
      load(slides[i]);
      load(slides[(i + 1) % slides.length]);
    };

    dots.forEach((d) => {
      d.addEventListener("click", () => go(Number(d.dataset.dot)));
      d.querySelector(".fill")?.addEventListener("animationend", () => {
        go(i + 1);
      });
    });
    root.querySelector("[data-prev]")?.addEventListener("click", () => go(i - 1));
    root.querySelector("[data-next]")?.addEventListener("click", () => go(i + 1));

    let hovering = false, visible = false;
    const sync = () => root.classList.toggle("paused", hovering || !visible);
    root.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { hovering = true; sync(); } });
    root.addEventListener("pointerleave", () => { hovering = false; sync(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.4 }).observe(root);

    // swipe
    const stage = root.querySelector<HTMLElement>("[data-stage]")!;
    let sx = 0, sy = 0;
    stage.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    stage.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? i + 1 : i - 1);
    });

    sync();
    go(0);
  });
}
