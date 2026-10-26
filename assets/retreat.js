(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!document.body.classList.contains('editorial') || reduced.matches ||
      navigator.connection?.saveData || !('IntersectionObserver' in window) ||
      !Element.prototype.animate) return;

  const animations = new Set();
  const ease = 'cubic-bezier(.16,1,.3,1)';
  function animate(el, keyframes, options) {
    if (!el || reduced.matches || document.hidden) return;
    const animation = el.animate(keyframes, {easing: ease, fill: 'backwards', ...options});
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation)).catch(() => {});
    return animation;
  }
  function settle() {
    for (const animation of animations) animation.cancel();
    animations.clear();
  }

  const residence = document.body.classList.contains('residence-home');
  if (residence && !location.hash) {
    // One opening sequence: the two words settle, the signature follows,
    // and the photographic aperture opens. All content is visible without JS.
    document.querySelectorAll('.residence-word').forEach((word, index) => {
      animate(word, [
        {opacity: .15, transform: 'translateY(.18em)', clipPath: 'inset(0 0 40% 0)'},
        {opacity: 1, transform: 'translateY(0)', clipPath: 'inset(0 0 0 0)'},
      ], {duration: 1000, delay: index * 110});
    });
    animate(document.querySelector('.residence-signature'), [
      {clipPath: 'inset(-50% 100% -90% -15%)', opacity: .4},
      {clipPath: 'inset(-50% -15% -90% -15%)', opacity: 1},
    ], {duration: 1150, delay: 180});
    animate(document.querySelector('.cinematic-cover'), [
      {clipPath: 'inset(1.5% 4% 0 4%)'},
      {clipPath: 'inset(0 0 0 0)'},
    ], {duration: 1400});
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reduced.matches || document.hidden) continue;
      if (residence) {
        // Paired photos appear as a composition, not a page full of flying cards.
        const photos = entry.target.matches('.villa-diptych')
          ? entry.target.querySelectorAll('a')
          : [entry.target.querySelector('.final-photo')];
        photos.forEach((photo, index) => animate(photo, [
          {clipPath: 'inset(8% 0 0 0)', transform: 'translateY(20px)'},
          {clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)'},
        ], {duration: 1050, delay: index * 140}));
      } else {
        animate(entry.target, [
          {opacity: .35, transform: 'translateY(16px)'},
          {opacity: 1, transform: 'translateY(0)'},
        ], {duration: 800});
      }
    }
  }, {threshold: .12});
  const targets = residence
    ? '.villa-diptych,.final-invitation'
    : '.villa-story .intro,.section-heading,.day-heading,.coastal-guide > div:last-child,.conversation-section > div:first-child,.faq > div:first-child';
  document.querySelectorAll(targets).forEach(el => observer.observe(el));
  reduced.addEventListener('change', () => {
    if (reduced.matches) { observer.disconnect(); settle(); }
  });
  navigator.connection?.addEventListener('change', () => {
    if (navigator.connection.saveData) { observer.disconnect(); settle(); }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) settle(); });
  window.addEventListener('pagehide', settle);
})();
