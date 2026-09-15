(() => {
  "use strict";
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  const closeMenu = () => {
    if (!menu) return;
    menu.hidden = true;
    menuButton?.setAttribute("aria-expanded", "false");
  };
  menuButton?.addEventListener("click", () => {
    menu.hidden = !menu.hidden;
    menuButton.setAttribute("aria-expanded", String(!menu.hidden));
  });
  menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu && !menu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
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
  function show(next) {
    if (!visible.length) return;
    index = (next + visible.length) % visible.length;
    const a = visible[index];
    img.src = a.href;
    img.alt = a.dataset.caption;
    viewer.querySelector(".viewer-caption p").textContent = a.dataset.caption;
    viewer.querySelector(".viewer-caption span").textContent = `${index + 1} / ${visible.length}`;
  }
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
