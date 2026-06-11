const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    for (const link of navLinks) {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      link.toggleAttribute("aria-current", active);
    }
  },
  { rootMargin: "-20% 0px -70% 0px", threshold: [0.15, 0.35, 0.55] }
);

for (const section of sections) observer.observe(section);

for (const button of document.querySelectorAll("[data-copy]")) {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copy);
    if (!target) return;
    await navigator.clipboard.writeText(target.textContent.trim());
    button.textContent = "已複製";
    setTimeout(() => {
      button.textContent = "複製";
    }, 1400);
  });
}
