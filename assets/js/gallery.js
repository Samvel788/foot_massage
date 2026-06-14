/* ============================================================
   Gallery slider — horizontal scenes with prev/next, generated
   dots, and touch swipe.
   ============================================================ */
const SWIPE_THRESHOLD = 50; // px

export function initGallery() {
  const track = document.querySelector(".g-track");
  if (!track) return;

  const scenes = track.children.length;
  const prev = document.querySelector(".g-arrow.prev");
  const next = document.querySelector(".g-arrow.next");
  const dotsWrap = document.querySelector(".g-dots");
  let idx = 0;

  for (let i = 0; i < scenes; i++) {
    const dot = document.createElement("button");
    dot.className = "g-dot" + (i === 0 ? " active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", "Слайд " + (i + 1));
    dot.addEventListener("click", () => go(i));
    dotsWrap.appendChild(dot);
  }
  const dots = dotsWrap.children;

  function go(n) {
    idx = Math.max(0, Math.min(scenes - 1, n));
    track.style.transform = "translateX(" + (-idx * 100) + "%)";
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === idx);
      dots[i].setAttribute("aria-current", i === idx ? "true" : "false");
    }
    if (prev) prev.disabled = idx === 0;
    if (next) next.disabled = idx === scenes - 1;
  }

  if (prev) prev.addEventListener("click", () => go(idx - 1));
  if (next) next.addEventListener("click", () => go(idx + 1));
  go(0);

  /* touch swipe */
  let startX = null;
  const viewport = document.querySelector(".g-viewport");
  viewport.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener("touchend", (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(idx + (dx < 0 ? 1 : -1));
    startX = null;
  });
}
