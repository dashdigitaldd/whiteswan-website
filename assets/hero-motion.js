/* Two real photographs, a gentle dissolve, and a static-first fallback. */
(() => {
  const cover = document.querySelector('.cinematic-cover');
  if (!cover) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const controls = cover.querySelector('.hero-scene-controls');
  const buttons = [...cover.querySelectorAll('[data-hero-scene]')];
  const frames = [...cover.querySelectorAll('[data-hero-frame]')];
  const toggle = cover.querySelector('[data-hero-motion]');
  const night = cover.querySelector('.hero-night img');
  const es = document.documentElement.lang === 'es';
  const hold = 14000; // Includes the 3.2-second dissolve, followed by a quiet hold.
  let ready = false, playing = !reduced.matches && !connection?.saveData;
  let visible = false, timer;

  function choose(scene) {
    cover.dataset.scene = scene;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.heroScene === scene)));
    frames.forEach(frame => frame.setAttribute('aria-hidden', String(frame.dataset.heroFrame !== scene)));
  }
  function sync() {
    clearTimeout(timer);
    const running = ready && playing && visible && !document.hidden && !reduced.matches && !connection?.saveData;
    cover.dataset.running = String(running);
    cover.dataset.playing = String(playing);
    // Reduced-motion visitors can choose either photograph, without autoplay.
    toggle.hidden = reduced.matches || Boolean(connection?.saveData);
    const label = es
      ? (playing ? 'Pausar animación de fotos' : 'Reproducir animación de fotos')
      : (playing ? 'Pause photo animation' : 'Play photo animation');
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    if (running) timer = setTimeout(() => {
      choose(cover.dataset.scene === 'day' ? 'night' : 'day');
      sync();
    }, hold);
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
  reduced.addEventListener('change', () => {
    if (reduced.matches) playing = false;
    sync();
  });
  connection?.addEventListener('change', () => {
    if (connection.saveData) playing = false;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sync();
    }, { threshold: 0.15 }).observe(cover);
  } else visible = true;
  // Both images must decode before controls or animation appear; otherwise keep daylight.
  Promise.all([...cover.querySelectorAll('img')].map(img => img.decode())).then(() => {
    ready = true;
    cover.dataset.ready = 'true';
    controls.hidden = false;
    sync();
  }).catch(() => { night.closest('.hero-frame').hidden = true; });
})();
