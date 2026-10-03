function projectRow(project, index) {
  const number = String(index + 1).padStart(2, '0');

  const visual = project.imagen
    ? `<img src="${project.imagen}-sm.webp" srcset="${project.imagen}-sm.webp 640w, ${project.imagen}-md.webp 900w, ${project.imagen}-lg.webp 1280w" sizes="(min-width: 768px) 640px, 100vw" width="640" height="400" alt="Captura de ${project.nombre}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" decoding="async">`
    : `<div class="w-full h-full flex items-center justify-center bg-ink transition-transform duration-700 group-hover:scale-[1.03]">
         <span class="font-display italic text-4xl md:text-5xl text-paper-100">${project.nombre}</span>
       </div>`;

  const meta = [project.rol, project.anio].filter(Boolean).join(' · ');

  const linkButton = project.link
    ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer"
         class="group/link inline-flex items-center gap-2 min-h-[44px] text-sm font-medium text-ink underline underline-offset-4 decoration-ink/40 transition-colors hover:text-accent hover:decoration-accent">
         Ver proyecto <span aria-hidden="true" class="inline-block transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">&#8599;</span>
       </a>`
    : `<span class="text-sm text-ink-500">Proyecto privado de cliente</span>`;

  return `
    <article class="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 border-t border-ink/15" style="transition-delay: ${index * 80}ms" data-reveal>
      <div class="md:col-span-1 font-mono text-xs text-ink-500 pt-1">${number}</div>
      <div class="md:col-span-4 flex flex-col">
        <h3 class="font-display text-4xl md:text-5xl leading-none mb-3">${project.nombre}</h3>
        <p class="text-ink-700 mb-1">${project.tipo}</p>
        <p class="font-mono text-xs text-ink-500 mb-6">${meta}</p>
        <p class="text-ink-700 leading-relaxed mb-6">${project.descripcion}</p>
        <ul class="flex flex-wrap gap-2 mb-8" aria-label="Tecnologías">
          ${project.stack.map((t) => `<li class="font-mono text-[11px] px-2.5 py-1 rounded-full border border-ink/15 text-ink-700">${t}</li>`).join('')}
        </ul>
        <div class="mt-auto">${linkButton}</div>
      </div>
      <div class="md:col-span-7 rounded-lg overflow-hidden aspect-[16/10] bg-paper-200">
        ${visual}
      </div>
    </article>
  `;
}

export function mountProjects(container, projects) {
  container.innerHTML = projects.map((p, i) => projectRow(p, i)).join('');
}
