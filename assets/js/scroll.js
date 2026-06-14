/* ============================================================
   Scroll dispatcher — one passive listener, rAF-throttled, shared
   by every scroll-driven effect. Register a callback with onScroll;
   it fires once immediately and then at most once per frame.
   ============================================================ */
const callbacks = [];
let ticking = false;
let bound = false;

function flush() {
  ticking = false;
  for (const fn of callbacks) fn();
}

function schedule() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(flush);
}

export function onScroll(fn) {
  callbacks.push(fn);
  if (!bound) {
    bound = true;
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  fn(); // initial state
}
