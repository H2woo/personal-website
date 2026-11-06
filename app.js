const body = document.body;
const nav = document.querySelector("#site-nav");
const menuToggle = document.querySelector(".menu-toggle");
const cursorDot = document.querySelector(".cursor--dot");
const cursorRing = document.querySelector(".cursor--ring");
const heroSmiley = document.querySelector("#hero-smiley");
const pixelField = document.querySelector("#pixel-field");
const projectModal = document.querySelector("#project-modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const modalTags = document.querySelector("#modal-tags");
const modalVisual = document.querySelector("#modal-visual");
const modalClose = document.querySelector(".modal-close");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

const projects = {
  echo: {
    className: "echo",
    title: "ECHO ATLAS",
    description:
      "一个把环境声音转换成动态星图的生成式体验。观众的声音会成为坐标、色彩与运动轨迹，最终汇成一张只属于当下的数字地图。",
    tags: ["ART DIRECTION", "CREATIVE CODE", "WEBGL", "SOUND"],
  },
  soft: {
    className: "soft",
    title: "SOFT ERROR",
    description:
      "为独立创意团队设计的品牌与数字体验。用偶尔出错、偶尔笨拙的视觉语言，讨论技术时代里那些柔软而真实的人性。",
    tags: ["VISUAL IDENTITY", "UI DESIGN", "MOTION", "ART DIRECTION"],
  },
  after: {
    className: "after",
    title: "AFTERGLOW LAB",
    description:
      "面向 AI 创作工作流的实验性产品原型。复杂任务被组织成可感知、可调整的视觉过程，让等待和生成也成为一种体验。",
    tags: ["PRODUCT DESIGN", "AI PROTOTYPE", "UX", "DESIGN SYSTEM"],
  },
};

function setupCursor() {
  if (!finePointer || prefersReducedMotion) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  body.classList.add("cursor-ready");

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }

  animateRing();

  document.querySelectorAll("a, button, [data-tilt]").forEach((element) => {
    element.addEventListener("pointerenter", () => body.classList.add("cursor-hover"));
    element.addEventListener("pointerleave", () => body.classList.remove("cursor-hover"));
  });
}

function setupNavigation() {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("is-locked", isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      body.classList.remove("is-locked");
    });
  });
}

function setupReveals() {
  const elements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  elements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    observer.observe(element);
  });
}

function setupTilt() {
  if (!finePointer || prefersReducedMotion) return;

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1100px) rotateX(${y * -2.1}deg) rotateY(${x * 2.1}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "perspective(1100px) rotateX(0) rotateY(0)";
    });
  });
}

function setupHeroParallax() {
  if (!finePointer || prefersReducedMotion || !heroSmiley) return;

  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    heroSmiley.style.translate = `${x * 20}px ${y * 16}px`;
  });
}

function setupPlayground() {
  if (!pixelField) return;

  const columns = window.matchMedia("(max-width: 680px)").matches ? 8 : 10;
  const rows = columns;
  const pixels = [];
  pixelField.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  for (let i = 0; i < columns * rows; i += 1) {
    const pixel = document.createElement("span");
    pixel.className = "pixel";
    pixel.dataset.index = String(i);
    pixelField.insertBefore(pixel, pixelField.querySelector(".field-hint"));
    pixels.push(pixel);
  }

  if (!finePointer || prefersReducedMotion) {
    const smileyPattern = new Set([
      2, 3, 4, 5, 6, 7,
      10, 11, 14, 15,
      20, 22, 23, 24, 25, 27,
      30, 31, 32, 33, 34, 35, 36, 37,
      40, 41, 46, 47,
      50, 51, 52, 53, 54, 55, 56, 57,
      60, 61, 66, 67,
      71, 74, 75,
      82, 88,
    ]);
    pixels.forEach((pixel, index) => {
      if (smileyPattern.has(index)) pixel.classList.add("is-lit");
    });
    return;
  }

  let currentX = -100;
  let currentY = -100;

  pixelField.addEventListener("pointermove", (event) => {
    const rect = pixelField.getBoundingClientRect();
    currentX = ((event.clientX - rect.left) / rect.width) * columns;
    currentY = ((event.clientY - rect.top) / rect.height) * rows;

    pixels.forEach((pixel, index) => {
      const x = index % columns;
      const y = Math.floor(index / columns);
      const distance = Math.hypot(x - currentX, y - currentY);
      pixel.classList.toggle("is-lit", distance < 1.65);
      pixel.classList.toggle("is-near", distance >= 1.65 && distance < 3.05);
    });
  });

  pixelField.addEventListener("pointerleave", () => {
    pixels.forEach((pixel) => pixel.classList.remove("is-lit", "is-near"));
  });
}

function openProject(id) {
  const project = projects[id];
  if (!project) return;

  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalTags.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");
  modalVisual.className = `modal-visual ${project.className}`;
  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  body.classList.add("is-locked");
  modalClose.focus();
}

function closeProject() {
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  body.classList.remove("is-locked");
}

function setupProjectModal() {
  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => openProject(button.dataset.project));
  });

  modalClose.addEventListener("click", closeProject);
  projectModal.addEventListener("click", (event) => {
    if (event.target === projectModal || event.target === modalVisual) closeProject();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && projectModal.classList.contains("is-open")) closeProject();
  });
}

function updateClock() {
  const clock = document.querySelector("#local-time");
  if (!clock) return;

  const formatter = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  clock.textContent = `${formatter.format(new Date())} CST`;
}

setupCursor();
setupNavigation();
setupReveals();
setupTilt();
setupHeroParallax();
setupPlayground();
setupProjectModal();
updateClock();
setInterval(updateClock, 1000);
