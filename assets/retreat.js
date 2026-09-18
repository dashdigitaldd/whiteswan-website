(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (
    !document.body.classList.contains("editorial") ||
    reduced.matches ||
    !("IntersectionObserver" in window) ||
    !Element.prototype.animate
  )
    return;
  const animations = new Set();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reduced.matches) continue;
        // Remain visible even if animation fails or JS is disabled.
        const animation = entry.target.animate(
          [
            { opacity: 0.35, transform: "translateY(16px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 800, easing: "cubic-bezier(.2,.65,.3,1)", fill: "none" },
        );
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => {});
      }
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(
      ".villa-story .intro,.section-heading,.day-heading,.coastal-guide > div:last-child,.conversation-section > div:first-child,.faq > div:first-child",
    )
    .forEach((el) => observer.observe(el));
  reduced.addEventListener("change", () => {
    if (reduced.matches) {
      observer.disconnect();
      for (const a of animations) a.cancel();
      animations.clear();
    }
  });
})();
