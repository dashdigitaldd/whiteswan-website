// Progressive enhancement: every answer and house instruction exists in the HTML.
(() => {
  const library = document.querySelector('.faq-library');
  let resetFaq = () => {};
  if (library) {
    const search = library.querySelector('#faq-search');
    const clear = library.querySelector('[data-faq-clear]');
    const buttons = [...library.querySelectorAll('[data-faq-filter]')];
    const items = [...library.querySelectorAll('[data-faq-item]')];
    const es = document.documentElement.lang === 'es';
    let category = 'all';
    const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const apply = () => {
      const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
      let count = 0;
      items.forEach(item => {
        const text = normalize(item.textContent);
        item.hidden = !(category === 'all' || item.dataset.faqCategory === category) || !words.every(word => text.includes(word));
        if (!item.hidden) count++;
      });
      library.querySelectorAll('[data-faq-group]').forEach(group => { group.hidden = ![...group.querySelectorAll('[data-faq-item]')].some(item => !item.hidden); });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.faqFilter === category)));
      clear.hidden = !search.value;
      library.querySelector('.faq-empty').hidden = count !== 0;
      library.querySelector('.faq-count').textContent = es ? `${count} ${count === 1 ? 'respuesta' : 'respuestas'}` : `${count} ${count === 1 ? 'answer' : 'answers'}`;
    };
    buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.faqFilter; apply(); }));
    search.addEventListener('input', apply);
    clear.addEventListener('click', () => { search.value = ''; apply(); search.focus(); });
    search.addEventListener('keydown', event => { if (event.key === 'Escape') { search.value = ''; apply(); } });
    resetFaq = () => { category = 'all'; search.value = ''; apply(); };
    library.querySelector('.faq-controls').hidden = false;
    apply();
  }
  const openLinkedAnswer = () => {
    let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const detail = document.getElementById(id);
    if (detail?.tagName !== 'DETAILS') return;
    if (detail.matches('[data-faq-item]')) resetFaq();
    detail.open = true;
    requestAnimationFrame(() => detail.scrollIntoView({block:'start', behavior:'instant'}));
  };
  window.addEventListener('hashchange', openLinkedAnswer);
  openLinkedAnswer();

  const links = [...document.querySelectorAll('.journey-nav a,.handbook-index nav a')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if (!sections.length) return;
  let scheduled = false;
  const update = () => {
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= 180) current = section;
    links.forEach(link => {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  };
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }, {passive:true});
  update();
})();
