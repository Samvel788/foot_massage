/* ============================================================
   i18n controller — applies the active language to the DOM and
   wires the language switcher. Data lives in i18n-data.js.
   ============================================================ */
import { I18N, LANGS } from "./i18n-data.js";

const STORAGE_KEY = "fmu-lang";

function initialLang() {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
  return LANGS.includes(saved) ? saved : LANGS[0];
}

function applyLang(l) {
  const dict = I18N[l];
  if (!dict) return;

  try { localStorage.setItem(STORAGE_KEY, l); } catch (e) { /* private mode */ }
  document.documentElement.lang = l;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = dict[el.getAttribute("data-i18n")];
    if (v != null) el.textContent = v;
  });
  // Localise image alt text so it matches the active language.
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const v = dict[el.getAttribute("data-i18n-alt")];
    if (v != null) el.setAttribute("alt", v);
  });
  document.querySelectorAll(".lang").forEach((b) => {
    const active = b.dataset.lang === l;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

export function initI18n() {
  applyLang(initialLang());
  document.querySelectorAll(".lang").forEach((b) => {
    b.addEventListener("click", () => applyLang(b.dataset.lang));
  });
}
