/* Authored photo film. Nothing is fetched until the cover is visible and ready. */
(function () {
  'use strict';
  function createVillaFilm(root, env) {
    const doc = env.document;
    const video = root.querySelector('video');
    const consoleEl = root.querySelector('.film-console');
    const playButton = root.querySelector('[data-film-play]');
    const playLabel = root.querySelector('[data-film-play-label]');
    const chapters = [...root.querySelectorAll('[data-film-chapter]')];
    const photos = [...root.querySelectorAll('[data-film-photo]')];
    const titles = [...root.querySelectorAll('[data-film-title]')];
    const frames = [...root.querySelectorAll('[data-hero-frame]')];
    const number = root.querySelector('[data-film-number]');
    const ring = root.querySelector('.film-scene-ring');
    const feedback = root.querySelector('.film-feedback');
    const poster = root.querySelector('[data-hero-frame="day"] img');
    const reduce = env.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = env.navigator.connection;
    const es = doc.documentElement.lang === 'es';
    const words = es ? {play:'Ver video', pause:'Pausar', replay:'Ver de nuevo', loading:'Cargando video', failed:'El video no está disponible. Puedes ver las fotos.'} : {play:'Play film', pause:'Pause film', replay:'Replay film', loading:'Loading film', failed:'The film is unavailable. You can still view the photos.'};
    const starts = [0, 4.6, 8.8, 13, 17.2];
    let visible = false, suspended = false, wanted = false, mode = 'photos';
    let loaded = false, failed = false, ended = false, touched = false;
    let pending = false, idle = null, seekTo = null;
    let posterReady = poster.complete && poster.naturalWidth > 0;
    const restricted = () => reduce.matches || connection?.saveData || /(^|-)2g$|^3g$/.test(connection?.effectiveType || '');
    const active = () => visible && !doc.hidden && !suspended;

    function update() {
      const time = Number.isFinite(video.currentTime) ? video.currentTime : 0;
      const chapter = starts.reduce((value, start, i) => time >= start ? i : value, 0);
      const duration = Number.isFinite(video.duration) ? video.duration : 21.8;
      const progress = Math.max(0, Math.min(1, (time - starts[chapter]) / ((starts[chapter+1] || duration) - starts[chapter])));
      root.dataset.chapter = String(chapter);
      root.dataset.mode = mode;
      root.dataset.loaded = String(loaded);
      root.dataset.playing = String(mode === 'film' && !video.paused && !video.ended);
      ring.style.strokeDashoffset = String(1-progress);
      number.textContent = String(chapter+1).padStart(2,'0');
      chapters.forEach((button,i) => {
        button.setAttribute('aria-pressed', String(mode === 'film' && chapter === i));
        button.querySelector('i').style.transform = `scaleX(${i < chapter ? 1 : i === chapter ? progress : 0})`;
      });
      titles.forEach((title,i) => { title.dataset.active = String(i === chapter); });
      photos.forEach(button => button.setAttribute('aria-pressed',String(mode === 'photos' && root.dataset.scene === button.dataset.filmPhoto)));
      const label = wanted && mode === 'film' ? words.pause : ended ? words.replay : words.play;
      playLabel.textContent = wanted && !loaded && !failed ? words.loading : label;
      playButton.setAttribute('aria-label', label);
      playButton.setAttribute('aria-busy', String(mode === 'film' && !loaded && !failed));
      frames.forEach(frame => frame.setAttribute('aria-hidden', String(mode === 'film' && loaded || frame.dataset.heroFrame !== root.dataset.scene)));
    }
    function load() {
      if (video.getAttribute('src') || failed) return;
      const mobile = env.matchMedia('(max-width: 700px)').matches;
      video.muted = true;
      video.src = mobile ? video.dataset.mobile : video.dataset.desktop;
      video.load();
    }
    function sync() {
      const shouldPlay = wanted && mode === 'film' && active() && !failed;
      if (!shouldPlay) {
        video.pause();
      } else {
        load();
        if (video.paused && !pending) {
          pending = true;
          Promise.resolve(video.play()).catch(error => {
            if (error.name !== 'AbortError') wanted = false;
          }).finally(() => { pending = false; update(); });
        }
      }
      update();
    }
    function start(at) {
      touched = true;
      if (failed) return;
      mode = 'film'; wanted = true;
      if (at !== undefined || ended) seekTo = at ?? 0;
      ended = false;
      load();
      if (video.readyState >= 1 && seekTo !== null) { video.currentTime = seekTo; seekTo = null; }
      sync();
    }
    function maybeAuto() {
      if (touched || restricted() || !posterReady || !active() || failed || idle !== null) return;
      const run = () => {
        idle = null;
        if (!touched && !restricted() && posterReady && active() && !failed) {
          // Play once. Leaving and returning resumes, ending never loops.
          touched = true; wanted = true; mode = 'film'; sync();
        }
      };
      idle = env.requestIdleCallback ? env.requestIdleCallback(run,{timeout:1800}) : env.setTimeout(run,500);
    }
    playButton.addEventListener('click',() => {
      touched = true;
      if (wanted && mode === 'film') { wanted = false; sync(); } else start();
    });
    chapters.forEach((button,i) => button.addEventListener('click',() => start(starts[i])));
    photos.forEach(button => button.addEventListener('click',() => {
      touched = true; wanted = false; mode = 'photos'; ended = false;
      root.dataset.scene = button.dataset.filmPhoto;
      sync();
    }));
    video.addEventListener('loadedmetadata',() => {
      if (seekTo !== null) { video.currentTime = seekTo; seekTo = null; }
    });
    video.addEventListener('loadeddata',() => { loaded = true; update(); });
    video.addEventListener('timeupdate',update);
    video.addEventListener('play',() => { if (!wanted || !active() || mode !== 'film') video.pause(); update(); });
    video.addEventListener('pause',update);
    video.addEventListener('ended',() => { wanted = false; ended = true; update(); });
    video.addEventListener('error',() => {
      failed = true; wanted = false; mode = 'photos'; root.dataset.scene = 'day';
      video.pause(); playButton.disabled = true; chapters.forEach(button => { button.disabled = true; });
      feedback.textContent = words.failed; feedback.hidden = false; update();
    });
    function preferenceChanged() {
      // Network speed estimates fluctuate. Only a user preference stops an active film.
      if (reduce.matches || connection?.saveData) { wanted = false; touched = true; mode = 'photos'; }
      sync();
    }
    reduce.addEventListener?.('change',preferenceChanged);
    connection?.addEventListener?.('change',preferenceChanged);
    doc.addEventListener('visibilitychange',() => { sync(); maybeAuto(); });
    env.addEventListener('pagehide',() => { suspended = true; sync(); });
    env.addEventListener('pageshow',() => { suspended = false; sync(); maybeAuto(); });
    if (env.IntersectionObserver) {
      new env.IntersectionObserver(entries => {
        visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .2;
        sync(); maybeAuto();
      },{threshold:[0,.2]}).observe(root);
    } // An explicit play still works in older browsers; no unsupported autoplay.
    else visible = true;
    poster.addEventListener('load',() => { posterReady = true; maybeAuto(); },{once:true});
    consoleEl.hidden = false;
    update(); maybeAuto();
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {createVillaFilm};
  else {
    const root = document.querySelector('.villa-film');
    if (root) createVillaFilm(root, window);
  }
})();
