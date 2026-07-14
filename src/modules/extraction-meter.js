const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SHOT_SECONDS = 27;
const RESET_DELAY_MS = 2600;

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  return `0:${s.toString().padStart(2, '0')}`;
}

export function initExtractionMeter() {
  const button = document.getElementById('extraction-meter');
  const ring = document.getElementById('extraction-ring');
  const time = document.getElementById('extraction-time');
  if (!button || !ring || !time) return;

  ring.style.strokeDasharray = `${CIRCUMFERENCE}`;

  let state = 'idle';
  let startedAt = 0;
  let rafId = null;
  let resetTimeoutId = null;

  function setIdle() {
    state = 'idle';
    ring.style.strokeDashoffset = `${CIRCUMFERENCE}`;
    ring.classList.remove('extraction-ring--done');
    time.textContent = '▶';
    button.setAttribute('aria-label', `Iniciar timer de extracción de ${SHOT_SECONDS} segundos`);
  }

  function finish() {
    state = 'done';
    ring.style.strokeDashoffset = '0';
    ring.classList.add('extraction-ring--done');
    time.textContent = '✓';
    button.setAttribute('aria-label', 'Extracción lista. Click para reiniciar');
    resetTimeoutId = setTimeout(setIdle, RESET_DELAY_MS);
  }

  function tick(now) {
    const elapsed = (now - startedAt) / 1000;
    const progress = Math.min(elapsed / SHOT_SECONDS, 1);

    ring.style.strokeDashoffset = `${CIRCUMFERENCE * (1 - progress)}`;
    time.textContent = formatTime(elapsed);

    if (progress >= 1) {
      finish();
      return;
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    state = 'running';
    startedAt = performance.now();
    button.setAttribute('aria-label', 'Detener timer de extracción');
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    cancelAnimationFrame(rafId);
    clearTimeout(resetTimeoutId);
    setIdle();
  }

  button.addEventListener('click', () => {
    if (state === 'idle') {
      start();
    } else {
      stop();
    }
  });

  setIdle();
}
