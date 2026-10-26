(() => {
  "use strict";
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  const menuLanguage = document.documentElement.lang === "es";
  const menuBackground = new Map();
  const closeMenu = () => {
    if (!menu) return;
    menu.hidden = true;
    delete document.documentElement.dataset.publicMenu;
    menuBackground.forEach((wasInert, element) => { element.inert = wasInert; });
    menuBackground.clear();
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", menuLanguage ? "Abrir menú" : "Open menu");
  };
  menuButton?.addEventListener("click", () => {
    if (!menu) return;
    if (!menu.hidden) { closeMenu(); return; }
    menu.hidden = false;
    document.documentElement.dataset.publicMenu = "open";
    document.querySelectorAll("main, .site-footer, .mobile-bar, .concierge-launcher").forEach(element => {
      menuBackground.set(element, element.inert);
      element.inert = true;
    });
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", menuLanguage ? "Cerrar menú" : "Close menu");
    menu.querySelector("a")?.focus();
  });
  menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (!menu || menu.hidden) return;
    if (e.key === "Escape" && menu && !menu.hidden) {
      closeMenu();
      menuButton.focus();
    }
    if (e.key === "Tab") {
      const stops = [menuButton, ...menu.querySelectorAll("a[href]")];
      const current = stops.indexOf(document.activeElement);
      // Keep the open menu's keyboard order independent of the header layout.
      e.preventDefault();
      const next = current < 0 ? 0 : (current + (e.shiftKey ? -1 : 1) + stops.length) % stops.length;
      stops[next].focus();
    }
  });
  document.addEventListener("click", event => {
    if (menu && !menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.matchMedia("(min-width: 1151px)").addEventListener("change", event => { if (event.matches) closeMenu(); });
  const dayTabs = [...document.querySelectorAll("[data-day-tab]")];
  function chooseDay(tab, focus = false) {
    dayTabs.forEach((button) => {
      const selected = button === tab;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      document.getElementById(button.getAttribute("aria-controls")).hidden = !selected;
    });
    if (focus) tab.focus();
  }
  dayTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => chooseDay(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % dayTabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + dayTabs.length) % dayTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = dayTabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        chooseDay(dayTabs[next], true);
      }
    });
  });
  const spaces = document.querySelector(".space-grid");
  const spaceNavigation = document.querySelector(".space-navigation");
  if (spaces && spaceNavigation && "IntersectionObserver" in window) {
    const cards = [...spaces.querySelectorAll(".space-card")];
    const previous = spaceNavigation.querySelector("[data-space-prev]");
    const next = spaceNavigation.querySelector("[data-space-next]");
    const counter = spaceNavigation.querySelector("[data-space-count]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visibility = new Map();
    let active = 0;
    const update = index => {
      active = index;
      counter.textContent = String(index + 1);
      previous.disabled = index === 0;
      next.disabled = index === cards.length - 1;
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visibility.set(entry.target, entry.intersectionRatio));
      const best = cards.reduce((chosen, card) => (visibility.get(card) || 0) > (visibility.get(chosen) || 0) ? card : chosen, cards[0]);
      if (visibility.get(best) > .5) update(cards.indexOf(best));
    }, { root: spaces, threshold: [0, .25, .5, .75, 1] });
    cards.forEach(card => observer.observe(card));
    const move = direction => {
      const target = Math.max(0, Math.min(cards.length - 1, active + direction));
      spaces.scrollTo({ left: cards[target].offsetLeft, behavior: reduced.matches ? "instant" : "smooth" });
    };
    previous.addEventListener("click", () => move(-1));
    next.addEventListener("click", () => move(1));
    spaceNavigation.hidden = false;
  }
  const viewer = document.querySelector(".photo-viewer");
  if (!viewer) return;
  const es = document.documentElement.lang === "es";
  const filters = [...document.querySelectorAll("[data-photo-filter]")];
  const figures = [...document.querySelectorAll("[data-photo-category]")];
  const all = [...document.querySelectorAll("[data-photo-open]")];
  let visible = all,
    index = 0,
    startX = null;
  function filter(category) {
    if (!filters.some((b) => b.dataset.photoFilter === category)) category = "all";
    filters.forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.photoFilter === category)),
    );
    figures.forEach((f) => {
      f.hidden = category !== "all" && f.dataset.photoCategory !== category;
    });
    document.querySelector(".photo-tour-grid").dataset.galleryLayout = category;
    visible = all.filter((a) => !a.closest("figure").hidden);
    document.querySelector(".photo-results").textContent =
      `${visible.length} ${es ? "fotos" : "photos"}`;
  }
  filters.forEach((b) =>
    b.addEventListener("click", () => {
      filter(b.dataset.photoFilter);
      history.replaceState(null, "", "#" + b.dataset.photoFilter);
    }),
  );
  filter(location.hash.slice(1) || "all");
  window.addEventListener("hashchange", () => filter(location.hash.slice(1)));
  const img = viewer.querySelector(".viewer-stage img");
  const feedback = viewer.querySelector(".viewer-feedback");
  const retry = viewer.querySelector("[data-photo-retry]");
  let request = 0;
  function show(next) {
    if (!visible.length) return;
    index = (next + visible.length) % visible.length;
    const a = visible[index];
    const version = ++request;
    img.style.visibility = "hidden";
    img.setAttribute("aria-busy", "true");
    feedback.hidden = false;
    retry.hidden = true;
    feedback.querySelector("p").textContent = es ? "Preparando tu vista…" : "Bringing your view into focus…";
    // Load separately so a slow previous request cannot replace the selected view.
    const preload = new Image();
    preload.onload = () => {
      if (version !== request) return;
      img.src = a.href;
      img.style.visibility = "visible";
      img.setAttribute("aria-busy", "false");
      feedback.hidden = true;
    };
    preload.onerror = () => {
      if (version !== request) return;
      img.setAttribute("aria-busy", "false");
      feedback.querySelector("p").textContent = es ? "Esta foto no se pudo cargar. Intenta de nuevo o explora la siguiente." : "This photo couldn’t load. Try again or explore the next one.";
      retry.hidden = false;
    };
    preload.src = a.href;
    img.alt = a.dataset.caption;
    viewer.querySelector(".viewer-caption p").textContent = a.dataset.caption;
    viewer.querySelector(".viewer-caption span").textContent = `${index + 1} / ${visible.length}`;
  }
  retry.addEventListener("click", () => {
    show(index);
    // Keep keyboard navigation in the dialog when the retry button disappears.
    viewer.querySelector("[data-photo-next]").focus();
  });
  viewer.addEventListener("close", () => { request++; });
  all.forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      show(visible.indexOf(a));
      viewer.showModal();
    }),
  );
  viewer.querySelector("[data-viewer-close]").addEventListener("click", () => viewer.close());
  viewer.querySelector("[data-photo-prev]").addEventListener("click", () => show(index - 1));
  viewer.querySelector("[data-photo-next]").addEventListener("click", () => show(index + 1));
  viewer.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      show(index + (e.key === "ArrowRight" ? 1 : -1));
    }
  });
  img.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches.length === 1 ? e.touches[0].clientX : null;
    },
    { passive: true },
  );
  img.addEventListener(
    "touchend",
    (e) => {
      if (startX !== null) {
        const delta = e.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 60) show(index + (delta < 0 ? 1 : -1));
      }
      startX = null;
    },
    { passive: true },
  );
})();
