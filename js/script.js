/**
 * EnergiAVerde — script.js
 * Transición Energética Justa · Bootcamp MinTIC 2025
 * ──────────────────────────────────────────────────
 * ✅ COMPLETADO (Nivel 1):
 *   1. NAV  — link activo + menú hamburger
 *   2. TIPOS — selector interactivo de fuentes renovables
 *
 * 🔲 PENDIENTE Compañero 2 (Nivel 2):
 *   3. initCSVLoader()  — carga drag-and-drop del CSV
 *   4. renderTable()    — tabla filtrable y exportable
 *   5. calcular()       — calculadora de energía renovable
 *
 * 🔲 PENDIENTE Compañero 3 (Nivel 3):
 *   6. updateDashboard() — 4 gráficas con Chart.js
 */

"use strict";

/* ══════════════════════════════════════════════
   ESTADO GLOBAL
   allData  → Compañero 2 lo llena con el CSV
   filtered → Compañero 2 lo usa para los filtros
   charts   → Compañero 3 lo usa para Chart.js
══════════════════════════════════════════════ */
let allData  = [];
let filtered = [];
let charts   = {};

/* ══════════════════════════════════════════════
   COLUMNAS DEL DATASET
   Compañero 2 las usa para construir la tabla
══════════════════════════════════════════════ */
const SHOW_COLS = [
  'Entity', 'Year',
  'wind-generation', 'solar-energy-consumption', 'hydropower-consumption',
  'biofuel-production', 'installed-geothermal-capacity',
  'share-electricity-renewables', 'share-electricity-wind',
  'share-electricity-solar', 'share-electricity-hydro',
  'cumulative-installed-wind-energy-capacity-gigawatts',
  'installed-solar-PV-capacity', 'modern-renewable-energy-consumption'
];

const COL_LABELS = {
  'Entity': 'País / Región',
  'Year': 'Año',
  'wind-generation': 'Eólica (TWh)',
  'solar-energy-consumption': 'Solar (TWh)',
  'hydropower-consumption': 'Hidro (TWh)',
  'biofuel-production': 'Biocomb. (PJ)',
  'installed-geothermal-capacity': 'Geotérmica GW',
  'share-electricity-renewables': '% Renov. total',
  'share-electricity-wind': '% Eólica',
  'share-electricity-solar': '% Solar',
  'share-electricity-hydro': '% Hidro',
  'cumulative-installed-wind-energy-capacity-gigawatts': 'Cap. Eólica acum. GW',
  'installed-solar-PV-capacity': 'Cap. Solar PV GW',
  'modern-renewable-energy-consumption': 'Renov. moderna EJ'
};

/* ══════════════════════════════════════════════
   PORCENTAJES POR AÑO
   Compañero 2 los usa en la calculadora
══════════════════════════════════════════════ */
const RENEWABLES_BY_YEAR = {
  2022: { total: 29.9, hydro: 15.6, wind: 7.2,  solar: 3.3,  bio: 2.4, geo: 0.5 },
  2020: { total: 29.0, hydro: 16.2, wind: 6.5,  solar: 3.1,  bio: 2.2, geo: 0.5 },
  2015: { total: 23.6, hydro: 16.6, wind: 3.7,  solar: 0.9,  bio: 1.9, geo: 0.5 },
  2010: { total: 22.4, hydro: 16.4, wind: 2.0,  solar: 0.06, bio: 1.5, geo: 0.5 },
  2000: { total: 20.8, hydro: 19.1, wind: 0.54, solar: 0.01, bio: 0.7, geo: 0.5 },
};

/* ══════════════════════════════════════════════
   INFO DE CADA FUENTE RENOVABLE
   Usada por el selector interactivo (Nivel 1)
══════════════════════════════════════════════ */
const ENERGY_TYPES = {
  solar: {
    icon: '☀️',
    name: 'Energía Solar',
    desc: 'Los paneles fotovoltaicos convierten la luz solar en electricidad mediante el efecto fotoeléctrico. Es la tecnología renovable de más rápido crecimiento: la capacidad instalada pasó de 1.4 GW en 2000 a más de 1,000 GW en 2022, con una caída de costos superior al 90%. Colombia tiene alta irradiación solar (4.5 kWh/m²/día), especialmente en La Guajira y la Costa Caribe.',
    tags: [
      '<span class="chip amber">1,050+ GW instalados (2022)</span>',
      '<span class="chip">Costo -90% desde 2010</span>',
      '<span class="chip teal">Colombia: potencial enorme en Guajira</span>'
    ]
  },
  wind: {
    icon: '💨',
    name: 'Energía Eólica',
    desc: 'Los aerogeneradores transforman la energía cinética del viento en electricidad. Existen dos modalidades: onshore (en tierra) y offshore (mar adentro). La eólica representa ya el 7.2% de la electricidad mundial. Colombia cuenta con vientos de 9-11 m/s en La Guajira, uno de los mejores recursos eólicos de América Latina.',
    tags: [
      '<span class="chip">900+ GW acumulados (2022)</span>',
      '<span class="chip teal">7.2% del mix eléctrico mundial</span>',
      '<span class="chip amber">Guajira: vientos 9-11 m/s</span>'
    ]
  },
  hydro: {
    icon: '💧',
    name: 'Energía Hidroeléctrica',
    desc: 'La fuente renovable más madura y con mayor capacidad instalada en el mundo. Colombia obtiene más del 67% de su electricidad de centrales hidroeléctricas. El cambio climático y la variabilidad hídrica subrayan la necesidad de diversificar la matriz con otras renovables.',
    tags: [
      '<span class="chip sky">15.6% del mix eléctrico mundial</span>',
      '<span class="chip amber">Colombia: 67%+ de su electricidad</span>',
      '<span class="chip">4,380+ TWh globales (2022)</span>'
    ]
  },
  geo: {
    icon: '🌋',
    name: 'Energía Geotérmica',
    desc: 'Extrae el calor del interior de la Tierra para generar vapor que mueve turbinas. Es una de las pocas renovables que produce energía de base (disponible el 90%+ del tiempo). Colombia tiene potencial geotérmico en zonas volcánicas del macizo colombiano.',
    tags: [
      '<span class="chip">+90% de disponibilidad continua</span>',
      '<span class="chip teal">15 GW instalados globalmente</span>',
      '<span class="chip amber">Cero emisiones de CO₂ en operación</span>'
    ]
  },
  bio: {
    icon: '🌿',
    name: 'Biocombustibles y Bioenergía',
    desc: 'Energía producida a partir de biomasa orgánica: bagazo de caña, residuos agrícolas y biodigestores. Colombia tiene amplia disponibilidad de materia prima. La bioenergía es clave para zonas rurales sin acceso a la red eléctrica nacional.',
    tags: [
      '<span class="chip">2.4% del mix eléctrico mundial</span>',
      '<span class="chip amber">Colombia: bagazo y aceite de palma</span>',
      '<span class="chip teal">Relevante para zonas rurales</span>'
    ]
  }
};

/* ══════════════════════════════════════════════
   1. NAV — LINK ACTIVO + HAMBURGER
══════════════════════════════════════════════ */
function initNav() {
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  // Resalta el link de la sección visible
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));

  // Menú hamburger en móvil
  const ham = document.getElementById('navHamburger');
  const nav = document.getElementById('navLinks');
  if (ham && nav) {
    ham.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
  }
}

/* ══════════════════════════════════════════════
   2. SELECTOR INTERACTIVO DE FUENTES (Nivel 1)
══════════════════════════════════════════════ */
function initEnergySelector() {
  const grid   = document.getElementById('typesGrid');
  const detail = document.getElementById('typeDetail');
  if (!grid || !detail) return;

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.type-btn');
    if (!btn) return;

    // Activar el botón clicado
    grid.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Actualizar el panel de detalle
    const type = btn.dataset.type;
    const info = ENERGY_TYPES[type];
    if (!info) return;

    document.getElementById('detailTitle').textContent = `${info.icon} ${info.name}`;
    document.getElementById('detailDesc').textContent  = info.desc;
    document.getElementById('detailTags').innerHTML    = info.tags.join(' ');

    // Reiniciar la animación CSS
    detail.style.animation = 'none';
    void detail.offsetWidth;
    detail.style.animation = '';
  });
}

/* ══════════════════════════════════════════════
   INIT — punto de entrada
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initEnergySelector();

  // Compañero 2 agrega aquí:
  // initCSVLoader();

  // Compañero 3 agrega aquí:
  // allData = generateInlineDemo();
  // initDashboardEntities();
  // updateDashboard();
});
