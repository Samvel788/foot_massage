/* ============================================================
   Foot Massage Urgench — entry point.
   Loaded as <script type="module">, so it runs after the DOM is
   parsed. Each feature is a self-contained module.
   ============================================================ */
import { initI18n } from "./i18n.js";
import { initImageSlots } from "./image-slot.js";
import { initNav } from "./nav.js";
import { initReveal } from "./reveal.js";
import { initGallery } from "./gallery.js";
import { initModal } from "./modal.js";
import { initMap } from "./map.js";

initImageSlots(); // hydrate saved images first
initI18n();       // sets text + localized alt
initNav();
initReveal();
initGallery();
initModal();
initMap();
