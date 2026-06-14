/* ============================================================
   Navigation — header shadow on scroll + mobile bottom-nav
   scroll-spy. Both run inside the shared scroll dispatcher.
   ============================================================ */
import { onScroll } from "./scroll.js";

const SPY_OFFSET = 90;   // px below viewport top that counts as "current"
const TOP_ZONE = 120;    // near the very top → highlight the first link

export function initNav() {
  const header = document.querySelector(".header");
  const mobLinks = Array.from(document.querySelectorAll(".mobnav a"));

  const spyTargets = mobLinks
    .map((a) => {
      const id = a.getAttribute("href");
      const el = id && id !== "#top" ? document.querySelector(id) : document.body;
      return { link: a, el, top: id === "#top" };
    })
    .filter((s) => s.el);

  onScroll(() => {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 12);

    if (!spyTargets.length) return;
    const probe = y + SPY_OFFSET;
    let current = spyTargets[0];
    spyTargets.forEach((s) => {
      if (s.top) return;
      if (s.el.offsetTop <= probe) current = s;
    });
    if (y < TOP_ZONE) current = spyTargets[0];
    mobLinks.forEach((a) => a.classList.toggle("active", a === current.link));
  });
}
