import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/sora/latin-600.css';
import '@fontsource/sora/latin-700.css';
import './style.css';
import { mountWhatsAppButton, whatsappUrl } from '../../src/modules/whatsapp.js';

const IMG = '/demos/concesionaria/img';

const models = [
  { id: 'terra', nombre: 'Orbe Terra', tipo: 'SUV', motor: 'Híbrido', dato: '1.100 km autonomía', plazas: 7, precio: 41900, img: `${IMG}/terra`, tag: 'Más vendido' },
  { id: 'aura', nombre: 'Orbe Aura', tipo: 'SUV', motor: 'Eléctrico', dato: '480 km autonomía', plazas: 5, precio: 36500, img: `${IMG}/aura`, tag: 'Nuevo' },
  { id: 'veloz', nombre: 'Orbe Veloz GT', tipo: 'Sedán', motor: 'Híbrido', dato: '5,2 L / 100 km', plazas: 5, precio: 32900, img: `${IMG}/veloz`, tag: null },
  { id: 'cumbre', nombre: 'Orbe Cumbre', tipo: 'SUV', motor: 'Nafta', dato: '2.0 Turbo · 4x4', plazas: 7, precio: 38900, img: `${IMG}/cumbre`, tag: null },
  { id: 'linea', nombre: 'Orbe Línea', tipo: 'Sedán', motor: 'Nafta', dato: '1.5 Turbo · CVT', plazas: 5, precio: 23900, img: `${IMG}/sedan`, tag: null },
  { id: 'city', nombre: 'Orbe City', tipo: 'Hatchback', motor: 'Eléctrico', dato: '320 km autonomía', plazas: 5, precio: 21500, img: `${IMG}/city`, tag: 'Ideal ciudad' },
];

const TNA = 0.099;
const usd = (n) => 'USD ' + Math.round(n).toLocaleString('es-AR');

function monthlyPayment(capital, months) {
  const r = TNA / 12;
  return (capital * r) / (1 - Math.pow(1 + r, -months));
}

/* ---------- Catálogo con filtros ---------- */

const grid = document.getElementById('grid');
const empty = document.getElementById('empty');
const filters = { tipo: 'Todos', motor: 'Todos', orden: 'relevancia' };

function card(m) {
  const desde = monthlyPayment(m.precio * 0.7, 60);
  return `
    <article class="group flex flex-col rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 transition duration-300 hover:border-emerald-400/50 hover:-translate-y-1">
      <div class="relative aspect-[16/10] overflow-hidden bg-neutral-800">
        <img src="${m.img}-sm.webp" srcset="${m.img}-sm.webp 480w, ${m.img}-md.webp 720w, ${m.img}-lg.webp 960w" sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" width="480" height="300" alt="${m.nombre}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async">
        ${m.tag ? `<span class="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider bg-emerald-400 text-neutral-950 px-2.5 py-1 rounded-full">${m.tag}</span>` : ''}
        <span class="absolute top-3 right-3 text-[11px] font-medium bg-neutral-950/70 backdrop-blur px-2.5 py-1 rounded-full">${m.motor}</span>
      </div>
      <div class="flex flex-col flex-1 p-5">
        <div class="flex items-baseline justify-between gap-3 mb-1">
          <h3 class="font-head text-xl font-semibold">${m.nombre}</h3>
          <span class="text-xs text-neutral-400">${m.tipo}</span>
        </div>
        <p class="text-sm text-neutral-400 mb-5">${m.dato} · ${m.plazas} plazas</p>
        <div class="mt-auto flex items-end justify-between gap-3">
          <div>
            <p class="font-head text-2xl font-semibold">${usd(m.precio)}</p>
            <p class="text-xs text-emerald-400">o desde ${usd(desde)}/mes</p>
          </div>
          <button type="button" data-cotizar="${m.id}" class="text-sm font-semibold bg-white text-neutral-950 px-4 py-2 rounded-full transition-colors hover:bg-emerald-400">Cotizar</button>
        </div>
      </div>
    </article>`;
}

function renderGrid() {
  let list = models.filter(
    (m) => (filters.tipo === 'Todos' || m.tipo === filters.tipo) && (filters.motor === 'Todos' || m.motor === filters.motor)
  );
  if (filters.orden === 'menor') list = [...list].sort((a, b) => a.precio - b.precio);
  if (filters.orden === 'mayor') list = [...list].sort((a, b) => b.precio - a.precio);

  grid.innerHTML = list.map(card).join('');
  empty.classList.toggle('hidden', list.length > 0);
  document.getElementById('count').textContent = `${list.length} ${list.length === 1 ? 'modelo' : 'modelos'}`;
}

document.querySelectorAll('[data-filter]').forEach((group) => {
  group.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-value]');
    if (!btn) return;
    filters[group.dataset.filter] = btn.dataset.value;
    group.querySelectorAll('button').forEach((b) => {
      const active = b === btn;
      b.setAttribute('aria-pressed', String(active));
      b.classList.toggle('bg-white', active);
      b.classList.toggle('text-neutral-950', active);
      b.classList.toggle('border-white', active);
    });
    renderGrid();
  });
});

document.getElementById('orden').addEventListener('change', (e) => {
  filters.orden = e.target.value;
  renderGrid();
});

/* ---------- Simulador de financiación ---------- */

const simModel = document.getElementById('sim-modelo');
const simAnticipo = document.getElementById('sim-anticipo');
const simPlazo = document.getElementById('sim-plazo');

simModel.innerHTML = models.map((m) => `<option value="${m.id}">${m.nombre} — ${usd(m.precio)}</option>`).join('');

function renderSim() {
  const m = models.find((x) => x.id === simModel.value);
  const pct = Number(simAnticipo.value);
  const months = Number(simPlazo.querySelector('[aria-pressed="true"]').dataset.value);
  const anticipo = m.precio * (pct / 100);
  const capital = m.precio - anticipo;

  document.getElementById('sim-anticipo-label').textContent = `${pct}% · ${usd(anticipo)}`;
  document.getElementById('sim-cuota').textContent = usd(monthlyPayment(capital, months));
  document.getElementById('sim-detalle').textContent = `${months} cuotas fijas · financiás ${usd(capital)} · TNA ${(TNA * 100).toFixed(1)}%`;
  const simImg = document.getElementById('sim-img');
  simImg.srcset = `${m.img}-sm.webp 480w, ${m.img}-md.webp 720w, ${m.img}-lg.webp 960w`;
  simImg.src = `${m.img}-sm.webp`;
}

simModel.addEventListener('change', renderSim);
simAnticipo.addEventListener('input', renderSim);
simPlazo.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-value]');
  if (!btn) return;
  simPlazo.querySelectorAll('button').forEach((b) => {
    const active = b === btn;
    b.setAttribute('aria-pressed', String(active));
    b.classList.toggle('bg-emerald-400', active);
    b.classList.toggle('text-neutral-950', active);
    b.classList.toggle('border-emerald-400', active);
  });
  renderSim();
});

/* ---------- Test drive ---------- */

const form = document.getElementById('form-test');
const formModel = document.getElementById('td-modelo');
formModel.innerHTML = models.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join('');

const fecha = document.getElementById('td-fecha');
const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
fecha.min = tomorrow;
fecha.value = tomorrow;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const m = models.find((x) => x.id === data.get('modelo'));
  const dia = new Date(data.get('fecha') + 'T12:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });

  document.getElementById('td-ok-texto').textContent =
    `${data.get('nombre')}, te esperamos el ${dia} para manejar el ${m.nombre}. Un asesor te va a escribir al ${data.get('telefono')} para confirmar el horario.`;
  form.classList.add('hidden');
  document.getElementById('td-ok').classList.replace('hidden', 'flex');
});

document.getElementById('td-reset').addEventListener('click', () => {
  form.reset();
  fecha.value = tomorrow;
  document.getElementById('td-ok').classList.replace('flex', 'hidden');
  form.classList.remove('hidden');
});

/* ---------- "Cotizar" desde una card ---------- */

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-cotizar]');
  if (!btn) return;
  simModel.value = btn.dataset.cotizar;
  formModel.value = btn.dataset.cotizar;
  renderSim();
  document.getElementById('financiacion').scrollIntoView();
});

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

const WA_MSG = 'Hola Matías! Vi la demo de Orbe Motors y me interesa una web así para mi concesionaria.';
mountWhatsAppButton({ message: WA_MSG, label: '¿Querés esta web? Hablá con Matías', shortLabel: 'Quiero esta web' });
document.querySelectorAll('[data-whatsapp]').forEach((a) => (a.href = whatsappUrl(WA_MSG)));

renderGrid();
renderSim();
