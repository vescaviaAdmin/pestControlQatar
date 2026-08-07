const header = document.querySelector(".site-header");
let lastScrollY = window.scrollY;
let ticking = false;
let keepHeaderVisibleUntil = 0;

function updateHeader() {
  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;
  const pastHeader = currentScrollY > 96;
  const keepHeaderVisible = performance.now() < keepHeaderVisibleUntil;

  header?.classList.toggle("is-scrolled", currentScrollY > 12);
  header?.classList.toggle("is-hidden", !keepHeaderVisible && scrollingDown && pastHeader);

  lastScrollY = Math.max(currentScrollY, 0);
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  },
  { passive: true },
);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    keepHeaderVisibleUntil = performance.now() + 1200;
    header?.classList.remove("is-hidden");

    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(targetTop - headerHeight - 12, 0),
      behavior: "smooth",
    });
  });
});

const serviceCatalog = window.serviceCatalog;
const serviceTabs = document.querySelectorAll("[data-service-tab]");
const servicePanelImage = document.querySelector("#services-panel-image");
const serviceTileRow = document.querySelector(".services-tile-row");

function renderServiceCards(categoryId) {
  if (!serviceCatalog || !servicePanelImage || !serviceTileRow) {
    return;
  }

  const category =
    serviceCatalog.categories.find((item) => item.id === categoryId) ??
    serviceCatalog.categories[0];

  servicePanelImage.src = category.background;
  servicePanelImage.alt = category.backgroundAlt;

  serviceTileRow.innerHTML = category.services
    .map(
      (service) => `
        <a class="service-card" href="service-detail?service=${service.slug}" aria-label="View ${service.title} details">
          <div class="service-card-media">
            <img src="${service.image}" alt="" />
          </div>
          <div class="service-card-body">
            <span class="service-card-kicker">${service.category}</span>
            <h3>${service.title}</h3>
            <p class="service-card-copy">${service.summary}</p>
            <span class="service-card-link">View details</span>
          </div>
        </a>
      `,
    )
    .join("");
}

serviceTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const categoryId = tab.dataset.serviceTab;

    serviceTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    renderServiceCards(categoryId);
  });
});

renderServiceCards("cleaning");

const heroSlides = Array.from(document.querySelectorAll("[data-hero-slide]"));
const heroMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeHeroSlide = 0;
let heroSlideTimer;
let heroSlidesReady = false;

function showHeroSlide(index) {
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
}

function stopHeroSlides() {
  if (heroSlideTimer) {
    window.clearInterval(heroSlideTimer);
    heroSlideTimer = undefined;
  }
}

function startHeroSlides() {
  stopHeroSlides();

  if (
    !heroSlidesReady ||
    heroSlides.length < 2 ||
    heroMotionPreference.matches ||
    document.hidden
  ) {
    return;
  }

  heroSlideTimer = window.setInterval(() => {
    activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
    showHeroSlide(activeHeroSlide);
  }, 5000);
}

function updateHeroMotion() {
  if (heroMotionPreference.matches) {
    activeHeroSlide = 0;
    showHeroSlide(activeHeroSlide);
    stopHeroSlides();
    return;
  }

  startHeroSlides();
}

if (heroSlides.length > 1) {
  const prepareHeroSlides = () => {
    heroSlidesReady = true;
    startHeroSlides();
  };

  if (document.readyState === "complete") {
    prepareHeroSlides();
  } else {
    window.addEventListener("load", prepareHeroSlides, { once: true });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopHeroSlides();
    } else {
      startHeroSlides();
    }
  });

  heroMotionPreference.addEventListener("change", updateHeroMotion);
}
