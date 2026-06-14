/* ============================================================
   image-slot — progressive enhancement for [data-slot] images.

   The page ships real, crawlable <img> tags (good for SEO + a11y).
   The owner can fill them without touching code by dragging an image
   file onto a slot → it replaces and persists to localStorage, then
   re-hydrates on the next load. Visitors are unaffected.
   (No click-to-browse: clicking a slot never opens a file dialog.)
   ============================================================ */
const STORE_PREFIX = "fmu-img:";
const MAX_BYTES = 3 * 1024 * 1024;                  // refuse to persist >3MB data URLs
const TYPES = /^image\/(png|jpeg|webp|avif|gif)$/;

const key = (id) => STORE_PREFIX + id;

function hydrate(img) {
  const id = img.getAttribute("data-slot");
  if (!id) return;
  let saved = null;
  try { saved = localStorage.getItem(key(id)); } catch (e) { /* private mode */ }
  if (saved) {
    img.src = saved;
    img.classList.remove("is-empty");
  } else {
    img.classList.add("is-empty");
  }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = () => reject(fr.error || new Error("read failed"));
    fr.readAsDataURL(file);
  });
}

async function setImage(img, file) {
  if (!file || !TYPES.test(file.type)) return;
  try {
    const dataUrl = await readFile(file);
    img.src = dataUrl;
    img.classList.remove("is-empty");
    // Persist only if it fits — otherwise keep it for this session only.
    if (dataUrl.length <= MAX_BYTES) {
      try { localStorage.setItem(key(img.getAttribute("data-slot")), dataUrl); }
      catch (e) { console.warn("[image-slot] could not persist (quota?):", e); }
    } else {
      console.warn("[image-slot] image >3MB — shown but not saved. Optimise it for the web.");
    }
  } catch (e) {
    console.warn("[image-slot] failed to load dropped file:", e);
  }
}

function wire(img) {
  let depth = 0;
  img.addEventListener("dragenter", (e) => { e.preventDefault(); depth++; img.classList.add("is-dragover"); });
  img.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  });
  img.addEventListener("dragleave", () => {
    if (--depth <= 0) { depth = 0; img.classList.remove("is-dragover"); }
  });
  img.addEventListener("drop", (e) => {
    e.preventDefault();
    depth = 0;
    img.classList.remove("is-dragover");
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    setImage(img, file);
  });
}

export function initImageSlots() {
  document.querySelectorAll("img[data-slot]").forEach((img) => { hydrate(img); wire(img); });
}
