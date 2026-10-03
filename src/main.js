import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/geist/latin-400.css';
import '@fontsource/geist/latin-500.css';
import '@fontsource/geist/latin-600.css';
import '@fontsource/geist-mono/latin-400.css';
import '@fontsource/geist-mono/latin-500.css';
import './style.css';
import { initNav } from './modules/nav.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { mountProjects } from './modules/projects.js';
import { projects } from './data/projects.js';

const projectsContainer = document.getElementById('proyectos-list');
if (projectsContainer) {
  mountProjects(projectsContainer, projects);
}

const projectsCount = document.getElementById('proyectos-count');
if (projectsCount) projectsCount.textContent = `(${String(projects.length).padStart(2, '0')})`;

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

initNav();
initScrollReveal();
