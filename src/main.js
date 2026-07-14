import './style.css';
import { initNav } from './modules/nav.js';
import { initScrollReveal } from './modules/scroll-reveal.js';
import { initExtractionMeter } from './modules/extraction-meter.js';
import { mountProjects } from './modules/projects.js';
import { projects } from './data/projects.js';

const projectsContainer = document.getElementById('extracciones-list');
if (projectsContainer) {
  mountProjects(projectsContainer, projects);
}

initNav();
initScrollReveal();
initExtractionMeter();
