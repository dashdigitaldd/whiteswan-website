/* The horizon is the photo clock. Pausing preserves its place, including offscreen. */
(() => {
  const cover = document.querySelector('.cinematic-cover');
  if (!cover) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const controls = cover.querySelector('.hero-scene-controls');
  const buttons = [...cover.querySelectorAll('[data-hero-scene]')];
  const frames = [...cover.querySelectorAll('[data-hero-frame]')];
  const toggle = cover.querySelector('[data-hero-motion]');
  const traveller = cover.querySelector('.horizon-traveller');
  const night = cover.querySelector('.hero-night img');
  const es = document.documentElement.lang === 'es';
  const hold = 16000;
  let ready = false, playing = !reduced.matches && !connection?.saveData;
  let visible = false, suspended = false, timer, started = null, remaining = hold, orbit;

  function pauseClock() {
    clearTimeout(timer);
    if (started !== null) remaining = Math.max(0, remaining - (performance.now() - started));
    started = null;
    orbit?.pause();
  }
  function drawOrbit(scene) {
    orbit?.cancel();
    // A quadratic arc matching the visible SVG path. No per-frame JS or layout reads.
    const positions = Array.from({length: 33}, (_, index) => {
      const t = scene === 'night' ? 1 - index / 32 : index / 32;
      return {transform: `translate(${12 + 156 * t}px, ${44 - 132 * t * (1 - t)}px)`};
    });
    traveller?.setAttribute('transform', scene === 'night' ? 'translate(168 44)' : 'translate(12 44)');
    if (!traveller?.animate || reduced.matches || connection?.saveData) { orbit = null; return; }
    orbit = traveller.animate(positions, {duration: hold, easing: 'linear', fill: 'both'});
    orbit.pause();
    orbit.currentTime = 0;
  }
  function choose(scene) {
    pauseClock();
    remaining = hold;
    cover.dataset.scene = scene;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.heroScene === scene)));
    frames.forEach(frame => frame.setAttribute('aria-hidden', String(frame.dataset.heroFrame !== scene)));
    drawOrbit(scene);
  }
  function sync() {
    pauseClock();
    const running = ready && playing && visible && !suspended && !document.hidden && !reduced.matches && !connection?.saveData;
    cover.dataset.running = String(running);
    cover.dataset.playing = String(playing);
    toggle.hidden = reduced.matches || Boolean(connection?.saveData);
    const label = es
      ? (playing ? 'Pausar animación de fotos' : 'Reproducir animación de fotos')
      : (playing ? 'Pause photo animation' : 'Play photo animation');
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    if (running) {
      orbit?.play();
      started = performance.now();
      timer = setTimeout(() => {
        choose(cover.dataset.scene === 'day' ? 'night' : 'day');
        sync();
      }, remaining);
    }
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    playing = false;
    choose(button.dataset.heroScene);
    sync();
  }));
  toggle.addEventListener('click', () => { playing = !playing; sync(); });
  controls.addEventListener('focusin', event => {
    if (!event.target.matches(':focus-visible')) return;
    if (event.relatedTarget && controls.contains(event.relatedTarget)) return;
    playing = false;
    sync();
  });
  function preferenceChanged() {
    if (reduced.matches || connection?.saveData) playing = false;
    choose(cover.dataset.scene);
    sync();
  }
  reduced.addEventListener('change', preferenceChanged);
  connection?.addEventListener('change', preferenceChanged);
  document.addEventListener('visibilitychange', sync);
  // bfcache restores the same paused scene; returning never forces a new photo.
  window.addEventListener('pagehide', () => { suspended = true; sync(); });
  window.addEventListener('pageshow', () => { suspended = false; sync(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= 0.15;
      sync();
    }, {threshold: [0, 0.15]}).observe(cover);
  } else visible = true;
  // Failure leaves the daylight photograph and gallery link available.
  Promise.all([...cover.querySelectorAll('img')].map(img => img.decode())).then(() => {
    ready = true;
    cover.dataset.ready = 'true';
    controls.hidden = false;
    choose(cover.dataset.scene);
    sync();
  }).catch(() => { night.closest('.hero-frame').hidden = true; });
})();
