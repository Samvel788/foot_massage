/* ============================================================
   Scroll reveal — adds .in when an element scrolls into view.
   Uses IntersectionObserver (no scroll handler); degrades to
   "show everything" where it's unsupported.
   ============================================================ */
export function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      obs.unobserve(entry.target); // reveal once, then stop watching
    });
  }, { rootMargin: "0px 0px -10% 0px" });

  els.forEach((el) => io.observe(el));
}
