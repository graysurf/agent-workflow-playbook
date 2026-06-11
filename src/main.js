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

const zoomableImages = [...document.querySelectorAll("img")].filter(
  (image) => !image.closest("a, button")
);

const lightbox = document.createElement("div");
lightbox.className = "image-lightbox";
lightbox.hidden = true;
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "圖片預覽");
lightbox.innerHTML = `
  <div class="image-lightbox-backdrop" data-lightbox-close></div>
  <div class="image-lightbox-frame">
    <button class="image-lightbox-close" type="button" data-lightbox-close aria-label="關閉圖片預覽">關閉</button>
    <img class="image-lightbox-image" alt="" />
    <p class="image-lightbox-caption"></p>
  </div>
`;
document.body.append(lightbox);

const lightboxImage = lightbox.querySelector(".image-lightbox-image");
const lightboxCaption = lightbox.querySelector(".image-lightbox-caption");
const lightboxClose = lightbox.querySelector(".image-lightbox-close");
let activeImageTrigger = null;

function openLightbox(trigger, image) {
  activeImageTrigger = trigger;
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = image.alt;
  lightbox.hidden = false;
  document.body.classList.add("has-lightbox");
  lightboxClose.focus();
}

function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  lightboxImage.alt = "";
  lightboxCaption.textContent = "";
  document.body.classList.remove("has-lightbox");
  activeImageTrigger?.focus();
  activeImageTrigger = null;
}

for (const image of zoomableImages) {
  const trigger = document.createElement("button");
  trigger.className = "image-zoom-trigger";
  trigger.type = "button";
  trigger.setAttribute("aria-label", `放大圖片：${image.alt || "教材圖片"}`);
  trigger.title = "放大圖片";
  image.replaceWith(trigger);
  trigger.append(image);
  trigger.addEventListener("click", () => openLightbox(trigger, image));
}

for (const control of lightbox.querySelectorAll("[data-lightbox-close]")) {
  control.addEventListener("click", closeLightbox);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeLightbox();
});

for (const demo of document.querySelectorAll(".cli-demo")) {
  const tabs = [...demo.querySelectorAll("[data-demo-tab]")];
  const panels = [...demo.querySelectorAll(".demo-panel")];

  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      const activeId = tab.dataset.demoTab;

      for (const item of tabs) {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      }

      for (const panel of panels) {
        const active = panel.id === activeId;
        panel.classList.toggle("is-active", active);
        panel.toggleAttribute("hidden", !active);
      }
    });
  }
}
