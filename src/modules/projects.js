const accentClasses = {
  terracotta: {
    tag: 'text-terracotta',
    border: 'hover:border-terracotta/60',
    chip: 'text-terracotta border-terracotta/30',
    cta: 'text-terracotta',
  },
  crema: {
    tag: 'text-crema',
    border: 'hover:border-crema/60',
    chip: 'text-crema border-crema/30',
    cta: 'text-crema',
  },
  espresso: {
    tag: 'text-espresso-700',
    border: 'hover:border-espresso-700/60',
    chip: 'text-espresso-700 border-espresso-700/30',
    cta: 'text-espresso-700',
  },
};

function projectCard(project, index) {
  const a = accentClasses[project.accent];
  const reversed = index % 2 === 1;

  const visual = project.imagen
    ? `<img src="${project.imagen}" alt="${project.nombre}" class="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" loading="lazy">`
    : `<div class="w-full h-full flex flex-col items-center justify-center bg-espresso-900 transition-transform duration-700 group-hover:scale-105">
         <span class="font-display italic text-3xl md:text-4xl text-crema">${project.nombre}</span>
       </div>`;

  const linkButton = project.link
    ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer"
         class="group/link inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest ${a.cta} font-bold hover:opacity-70 transition-opacity">
         Abrir herramienta <span aria-hidden="true" class="inline-block transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1">&#8599;</span>
       </a>`
    : '';

  return `
    <article class="group rounded-2xl border border-espresso-800/15 bg-cream-100 p-6 md:p-10 transition-[opacity,transform,border-color,box-shadow] duration-700 [transition-delay:${index * 100}ms] ${a.border} hover:-translate-y-1 hover:shadow-xl" data-reveal>
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}">
        <div class="lg:col-span-3 rounded-xl overflow-hidden aspect-video bg-espresso-900/90">
          ${visual}
        </div>
        <div class="lg:col-span-2 flex flex-col justify-center">
          <span class="font-mono text-[11px] uppercase tracking-[0.2em] ${a.tag} mb-3 block">${project.tagline}</span>
          <h3 class="font-display text-2xl md:text-3xl text-espresso-950 mb-5">${project.nombre}</h3>

          <dl class="space-y-3 mb-6 font-mono text-[11px]">
            <div class="flex gap-3">
              <dt class="uppercase tracking-widest text-espresso-700/50 shrink-0 w-24">Dosis</dt>
              <dd class="text-espresso-800">${project.dosis.join(' · ')}</dd>
            </div>
            <div class="flex gap-3">
              <dt class="uppercase tracking-widest text-espresso-700/50 shrink-0 w-24">Tiempo</dt>
              <dd class="text-espresso-800">${project.tiempo}</dd>
            </div>
            <div class="flex gap-3">
              <dt class="uppercase tracking-widest text-espresso-700/50 shrink-0 w-24">Rendimiento</dt>
              <dd class="text-espresso-800">${project.rendimiento}</dd>
            </div>
          </dl>

          <p class="font-display italic text-espresso-800/80 text-base leading-relaxed mb-8">
            &ldquo;${project.notaDeCata}&rdquo;
          </p>

          ${linkButton}
        </div>
      </div>
    </article>
  `;
}

export function mountProjects(container, projects) {
  container.innerHTML = projects.map((p, i) => projectCard(p, i)).join('');
}
