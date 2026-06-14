/* ============================================================
   Map — lazy-loads Leaflet from the CDN only when #map nears the
   viewport, keeping it off the critical path. The "build route"
   button works whether or not the map ever renders.
   ============================================================ */
const MAP = { lat: 41.5503, lon: 60.6314, zoom: 14 }; // Urgench
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
const TILES = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

function loadCss(href) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function renderMap(el) {
  if (typeof L === "undefined") return;

  const map = L.map(el, { zoomControl: true, scrollWheelZoom: false, attributionControl: true })
    .setView([MAP.lat, MAP.lon], MAP.zoom);

  L.tileLayer(TILES, {
    maxZoom: 19,
    subdomains: "abcd",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  const pin = L.divIcon({
    className: "fmu-pin",
    html: '<svg width="34" height="46" viewBox="0 0 34 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<path d="M17 0C7.6 0 0 7.6 0 17c0 12 17 29 17 29s17-17 17-29C34 7.6 26.4 0 17 0z" fill="#1e4a2c"/>' +
          '<circle cx="17" cy="17" r="6.4" fill="#fff"/></svg>',
    iconSize: [34, 46],
    iconAnchor: [17, 46]
  });
  L.marker([MAP.lat, MAP.lon], { icon: pin, title: "Foot Massage Urgench" }).addTo(map);
  setTimeout(() => map.invalidateSize(), 250);
}

export function initMap() {
  const el = document.getElementById("map");
  if (!el) return;

  let loaded = false;
  async function load() {
    if (loaded) return;
    loaded = true;
    try {
      await loadCss(LEAFLET_CSS);
      await loadScript(LEAFLET_JS);
      renderMap(el);
    } catch (err) {
      // Network/CDN failure — leave the styled placeholder, don't break the page.
      el.setAttribute("data-map-error", "1");
      console.warn("[map] Leaflet failed to load:", err);
    }
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        load();
      }
    }, { rootMargin: "400px" });
    io.observe(el);
  } else {
    load();
  }

  const route = document.querySelector("[data-route]");
  if (route) {
    route.addEventListener("click", () => {
      window.open("https://www.google.com/maps/dir/?api=1&destination=" + MAP.lat + "," + MAP.lon, "_blank", "noopener");
    });
  }
}
