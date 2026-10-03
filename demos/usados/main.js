import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/bricolage-grotesque/latin-600.css';
import '@fontsource/bricolage-grotesque/latin-700.css';
import '@fontsource/bricolage-grotesque/latin-800.css';
import './style.css';
import { inject } from '@vercel/analytics';
import { mountWhatsAppButton, whatsappUrl } from '../../src/modules/whatsapp.js';

const IMG = '/demos/usados/img';

const cars = [
  { id: 'corolla', marca: 'Toyota', modelo: 'Corolla XEI 2.0 CVT', anio: 2021, km: 38000, caja: 'Automática', comb: 'Nafta', precio: 24500, img: 'corolla', badge: 'Único dueño' },
  { id: 'hilux', marca: 'Toyota', modelo: 'Hilux SRV 2.8 4x4', anio: 2019, km: 92000, caja: 'Manual', comb: 'Diésel', precio: 33900, img: 'hilux', badge: null },
  { id: 'golf', marca: 'Volkswagen', modelo: 'Golf 1.4 TSI Highline', anio: 2018, km: 61000, caja: 'Automática', comb: 'Nafta', precio: 19900, img: 'golf', badge: 'Bajó de precio' },
  { id: '3008', marca: 'Peugeot', modelo: '3008 GT Pack 1.6 THP', anio: 2022, km: 24000, caja: 'Automática', comb: 'Nafta', precio: 31500, img: '3008', badge: 'Como nuevo' },
  { id: 'renegade', marca: 'Jeep', modelo: 'Renegade Sport 1.8', anio: 2019, km: 54000, caja: 'Manual', comb: 'Nafta', precio: 17800, img: 'renegade', badge: null },
  { id: 'civic', marca: 'Honda', modelo: 'Civic EX-T 1.5 Turbo', anio: 2020, km: 47000, caja: 'Automática', comb: 'Nafta', precio: 22900, img: 'civic', badge: null },
  { id: 'amarok', marca: 'Volkswagen', modelo: 'Amarok V6 Extreme 4x4', anio: 2020, km: 78000, caja: 'Automática', comb: 'Diésel', precio: 38500, img: 'amarok', badge: 'Equipada off-road' },
  { id: 'fiat500', marca: 'Fiat', modelo: '500 Lounge 1.4', anio: 2016, km: 69000, caja: 'Manual', comb: 'Nafta', precio: 10900, img: 'fiat500', badge: 'Bajó de precio' },
];

const usd = (n) => 'USD ' + Math.round(n).toLocaleString('es-AR');
const kms = (n) => n.toLocaleString('es-AR') + ' km';

/* ---------- Estado (favoritos persistidos) ---------- */

const FAV_KEY = 'garage-sur-favs';
let favs = new Set();
try {
  favs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
} catch {}
const saveFavs = () => {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favs]));
  } catch {}
};

const compare = new Set();
const MAX_COMPARE = 3;
const state = { q: '', max: 40000, caja: 'Todas', soloFavs: false };

/* ---------- Listado ---------- */

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
const count = document.getElementById('count');

function card(c) {
  const fav = favs.has(c.id);
  const cmp = compare.has(c.id);
  return `
    <article class="group bg-white rounded-3xl overflow-hidden shadow-[0_1px_0_rgba(0,0,0,0.06)] ring-1 ring-black/5 transition hover:shadow-xl hover:-translate-y-0.5">
      <div class="relative aspect-[4/3] overflow-hidden bg-[#ece4d4]">
        <img src="${IMG}/${c.img}-sm.webp" srcset="${IMG}/${c.img}-sm.webp 480w, ${IMG}/${c.img}-md.webp 720w, ${IMG}/${c.img}-lg.webp 900w" sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" width="480" height="360" alt="${c.marca} ${c.modelo}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async">
        ${c.badge ? `<span class="absolute top-3 left-3 text-xs font-semibold bg-white/95 text-[#1d1a16] px-3 py-1 rounded-full">${c.badge}</span>` : ''}
        <button type="button" data-fav="${c.id}" aria-pressed="${fav}" aria-label="${fav ? 'Quitar de' : 'Agregar a'} favoritos: ${c.marca} ${c.modelo}"
          class="absolute top-3 right-3 w-10 h-10 grid place-items-center rounded-full bg-white/95 text-lg transition hover:scale-110 ${fav ? 'text-[#c2410c]' : 'text-[#1d1a16]/70'}">${fav ? '♥' : '♡'}</button>
      </div>
      <div class="p-5">
        <p class="text-xs font-semibold uppercase tracking-wider text-[#1d1a16]/70 mb-1">${c.marca}</p>
        <h3 class="font-head text-xl font-bold leading-tight mb-3">${c.modelo}</h3>
        <ul class="flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#1d1a16]/70 mb-5">
          <li>${c.anio}</li><li aria-hidden="true">·</li><li>${kms(c.km)}</li><li aria-hidden="true">·</li><li>${c.caja}</li><li aria-hidden="true">·</li><li>${c.comb}</li>
        </ul>
        <div class="flex items-center justify-between gap-3">
          <p class="font-head text-2xl font-extrabold">${usd(c.precio)}</p>
          <label class="inline-flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <input type="checkbox" data-compare="${c.id}" ${cmp ? 'checked' : ''} class="w-4 h-4 accent-[#c2410c]">
            Comparar
          </label>
        </div>
      </div>
    </article>`;
}

function filtered() {
  const q = state.q.trim().toLowerCase();
  return cars.filter(
    (c) =>
      (!q || `${c.marca} ${c.modelo}`.toLowerCase().includes(q)) &&
      c.precio <= state.max &&
      (state.caja === 'Todas' || c.caja === state.caja) &&
      (!state.soloFavs || favs.has(c.id))
  );
}

function render() {
  const list = filtered();
  grid.innerHTML = list.map(card).join('');
  empty.classList.toggle('hidden', list.length > 0);
  count.textContent = `${list.length} ${list.length === 1 ? 'auto disponible' : 'autos disponibles'}`;
  document.getElementById('fav-count').textContent = favs.size;
  renderCompareBar();
}

/* ---------- Filtros ---------- */

const qInput = document.getElementById('f-q');
const maxInput = document.getElementById('f-max');
const maxLabel = document.getElementById('f-max-label');

qInput.addEventListener('input', () => {
  state.q = qInput.value;
  render();
});

maxInput.addEventListener('input', () => {
  state.max = Number(maxInput.value);
  maxLabel.textContent = state.max >= 40000 ? 'Sin límite' : `Hasta ${usd(state.max)}`;
  render();
});

document.getElementById('f-caja').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-value]');
  if (!btn) return;
  state.caja = btn.dataset.value;
  e.currentTarget.querySelectorAll('button').forEach((b) => {
    const on = b === btn;
    b.setAttribute('aria-pressed', String(on));
    b.classList.toggle('bg-[#1d1a16]', on);
    b.classList.toggle('text-white', on);
  });
  render();
});

const favToggle = document.getElementById('f-favs');
function setSoloFavs(on) {
  state.soloFavs = on;
  favToggle.setAttribute('aria-pressed', String(on));
  favToggle.classList.toggle('bg-[#c2410c]', on);
  favToggle.classList.toggle('text-white', on);
  favToggle.classList.toggle('border-[#c2410c]', on);
  render();
}
favToggle.addEventListener('click', () => setSoloFavs(!state.soloFavs));
document.getElementById('nav-favs').addEventListener('click', () => {
  setSoloFavs(true);
  document.getElementById('autos').scrollIntoView();
});

/* Buscador del hero: aplica los mismos filtros y baja al listado */
document.getElementById('hero-search').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  qInput.value = data.get('q');
  state.q = qInput.value;
  maxInput.value = data.get('max');
  maxInput.dispatchEvent(new Event('input'));
  document.getElementById('autos').scrollIntoView();
});

/* ---------- Favoritos y comparar (delegación) ---------- */

grid.addEventListener('click', (e) => {
  const favBtn = e.target.closest('[data-fav]');
  if (!favBtn) return;
  const id = favBtn.dataset.fav;
  favs.has(id) ? favs.delete(id) : favs.add(id);
  saveFavs();
  render();
});

const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove('opacity-0', 'translate-y-2');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('opacity-0', 'translate-y-2'), 2200);
}

grid.addEventListener('change', (e) => {
  const box = e.target.closest('[data-compare]');
  if (!box) return;
  const id = box.dataset.compare;
  if (box.checked) {
    if (compare.size >= MAX_COMPARE) {
      box.checked = false;
      showToast(`Podés comparar hasta ${MAX_COMPARE} autos`);
      return;
    }
    compare.add(id);
  } else {
    compare.delete(id);
  }
  renderCompareBar();
});

/* ---------- Comparador ---------- */

const bar = document.getElementById('compare-bar');
const dialog = document.getElementById('compare-dialog');

function renderCompareBar() {
  const n = compare.size;
  bar.classList.toggle('translate-y-[150%]', n === 0);
  bar.inert = n === 0;
  waBtn.style.transform = n === 0 ? '' : 'translateY(-5.5rem)';
  document.getElementById('compare-thumbs').innerHTML = [...compare]
    .map((id) => cars.find((c) => c.id === id))
    .map((c) => `<img src="${IMG}/${c.img}-sm.webp" alt="" width="48" height="48" class="w-12 h-12 rounded-xl object-cover ring-2 ring-[#1d1a16]">`)
    .join('');
  document.getElementById('compare-label').textContent = `${n} de ${MAX_COMPARE} seleccionados`;
  document.getElementById('compare-open').disabled = n < 2;
}

function renderCompareTable() {
  const list = [...compare].map((id) => cars.find((c) => c.id === id));
  const minPrice = Math.min(...list.map((c) => c.precio));
  const minKm = Math.min(...list.map((c) => c.km));
  const maxYear = Math.max(...list.map((c) => c.anio));
  const best = (on) => (on ? 'text-[#c2410c] font-bold' : '');
  const tag = (on, txt) => (on ? `<span class="block text-[11px] font-semibold text-[#c2410c]">${txt}</span>` : '');

  const rows = [
    ['Precio', (c) => `<span class="${best(c.precio === minPrice)}">${usd(c.precio)}</span>${tag(c.precio === minPrice, 'Más barato')}`],
    ['Año', (c) => `<span class="${best(c.anio === maxYear)}">${c.anio}</span>${tag(c.anio === maxYear, 'Más nuevo')}`],
    ['Kilómetros', (c) => `<span class="${best(c.km === minKm)}">${kms(c.km)}</span>${tag(c.km === minKm, 'Menos km')}`],
    ['Caja', (c) => c.caja],
    ['Combustible', (c) => c.comb],
  ];

  document.getElementById('compare-table').innerHTML = `
    <thead>
      <tr>
        <th class="w-28"></th>
        ${list.map((c) => `
          <th class="p-2 align-top text-left font-normal">
            <img src="${IMG}/${c.img}-sm.webp" alt="" width="480" height="360" class="w-full aspect-[4/3] object-cover rounded-xl mb-2">
            <span class="block text-xs uppercase tracking-wider text-[#1d1a16]/70">${c.marca}</span>
            <span class="block font-head font-bold leading-tight">${c.modelo}</span>
          </th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(([label, fn]) => `
        <tr class="border-t border-black/10">
          <th scope="row" class="py-3 pr-2 text-left text-sm font-medium text-[#1d1a16]/70">${label}</th>
          ${list.map((c) => `<td class="py-3 px-2 text-sm">${fn(c)}</td>`).join('')}
        </tr>`).join('')}
    </tbody>`;
}

document.getElementById('compare-open').addEventListener('click', () => {
  renderCompareTable();
  dialog.showModal();
});
document.getElementById('compare-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});
document.getElementById('compare-clear').addEventListener('click', () => {
  compare.clear();
  render();
});

/* ---------- Tasá tu usado (wizard) ---------- */

const wizard = document.getElementById('wizard');
const steps = [...wizard.querySelectorAll('[data-step]')];
const progress = document.getElementById('wiz-progress');
const stepLabel = document.getElementById('wiz-step');
let current = 0;

const yearSelect = document.getElementById('t-anio');
const thisYear = new Date().getFullYear();
for (let y = thisYear; y >= thisYear - 20; y--) yearSelect.add(new Option(y, y));
yearSelect.value = thisYear - 5;

const kmInput = document.getElementById('t-km');
const kmLabel = document.getElementById('t-km-label');
kmInput.addEventListener('input', () => (kmLabel.textContent = kms(Number(kmInput.value))));
kmLabel.textContent = kms(Number(kmInput.value));

function showStep(i) {
  current = i;
  steps.forEach((s, idx) => s.classList.toggle('hidden', idx !== i));
  progress.style.width = `${((i + 1) / steps.length) * 100}%`;
  stepLabel.textContent = `Paso ${Math.min(i + 1, 3)} de 3`;
  document.getElementById('wiz-back').classList.toggle('invisible', i === 0 || i === steps.length - 1);
  document.getElementById('wiz-next').classList.toggle('hidden', i >= steps.length - 1);
  document.getElementById('wiz-next').textContent = i === steps.length - 2 ? 'Ver mi tasación' : 'Siguiente';
  document.getElementById('wiz-nav').classList.toggle('hidden', i === steps.length - 1);
}

function stepValid(i) {
  const fields = [...steps[i].querySelectorAll('input, select')];
  return fields.every((f) => f.reportValidity());
}

/* Fórmula de ejemplo: valor base por segmento, depreciación por año y km, ajuste por estado */
function estimate(data) {
  const base = { chico: 20000, sedan: 28000, suv: 34000, pickup: 42000 }[data.get('segmento')];
  const age = thisYear - Number(data.get('anio'));
  const km = Number(kmInput.value);
  const estado = { excelente: 1, bueno: 0.92, regular: 0.8 }[data.get('estado')];
  const value = base * Math.pow(0.92, age) * Math.max(0.6, 1 - km / 500000) * estado;
  return [value * 0.94, value * 1.06];
}

document.getElementById('wiz-next').addEventListener('click', () => {
  if (!stepValid(current)) return;
  if (current === steps.length - 2) {
    const data = new FormData(wizard);
    const [lo, hi] = estimate(data);
    document.getElementById('wiz-result').textContent = `${usd(Math.round(lo / 100) * 100)} – ${usd(Math.round(hi / 100) * 100)}`;
    document.getElementById('wiz-result-text').textContent =
      `${data.get('nombre')}, este es el rango estimado para tu ${data.get('modelo')} ${data.get('anio')}. Un asesor te va a contactar al ${data.get('telefono')} para coordinar la revisión y darte el valor final.`;
  }
  showStep(current + 1);
});
document.getElementById('wiz-back').addEventListener('click', () => showStep(Math.max(0, current - 1)));
document.getElementById('wiz-restart').addEventListener('click', () => {
  wizard.reset();
  yearSelect.value = thisYear - 5;
  kmLabel.textContent = kms(Number(kmInput.value));
  showStep(0);
});
wizard.addEventListener('submit', (e) => e.preventDefault());

/* ---------- Menú mobile ---------- */

const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('hidden') === false;
  menuBtn.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    menu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  })
);

const WA_MSG = 'Hola Matías! Vi la demo de Garage Sur y me interesa una web así para mi agencia.';
const waBtn = mountWhatsAppButton({ message: WA_MSG, label: '¿Querés esta web? Hablá con Matías', shortLabel: 'Quiero esta web' });
document.querySelectorAll('[data-whatsapp]').forEach((a) => (a.href = whatsappUrl(WA_MSG)));

showStep(0);
render();

inject();
