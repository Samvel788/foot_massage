/* ============================================================
   Video modal — opens on the hero play button, with focus trap
   and focus restore. If the <video> has no real source yet, the
   play button is hidden (no empty placeholder popup).
   ============================================================ */
export function initModal() {
  const modal = document.querySelector(".modal");
  const playBtn = document.querySelector(".play-btn");
  if (!modal || !playBtn) return;

  const video = modal.querySelector("video");
  const closeBtn = modal.querySelector(".modal__close");
  let lastFocused = null;

  // No real video yet → hide the play button instead of opening an empty
  // popup. It reappears once the <video> gets a src or a <source> child.
  const hasVideo = !!(video && (video.getAttribute("src") || video.querySelector("source")));
  if (!hasVideo) {
    playBtn.hidden = true;
    return;
  }

  function open() {
    lastFocused = document.activeElement;
    modal.classList.add("open");
    if (closeBtn) closeBtn.focus();
    if (video && video.src) video.play().catch(() => {});
  }

  function close() {
    modal.classList.remove("open");
    if (video) video.pause();
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  playBtn.addEventListener("click", open);
  if (closeBtn) closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") { close(); return; }
    if (e.key === "Tab") {
      // Only the close button is focusable inside — keep focus on it.
      e.preventDefault();
      if (closeBtn) closeBtn.focus();
    }
  });
}
