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
const serviceTabs = Array.from(document.querySelectorAll("[data-service-tab]"));
const servicePanel = document.querySelector("#services-panel");
const servicePanelImage = document.querySelector("#services-panel-image");
const serviceCategoryEyebrow = document.querySelector("#services-category-eyebrow");
const serviceCategoryTitle = document.querySelector("#services-category-title");
const serviceCategoryDescription = document.querySelector("#services-category-description");
const serviceTileRow = document.querySelector(".services-tile-row");
const serviceTabsScroller = document.querySelector(".services-tabs");

function centerServiceTab(tab, behavior = "smooth") {
  if (!tab || !serviceTabsScroller) {
    return;
  }

  serviceTabsScroller.style.setProperty(
    "--service-tabs-edge-pad",
    `${Math.max(6, (serviceTabsScroller.clientWidth - tab.offsetWidth) / 2)}px`,
  );

  const tabCenter = tab.offsetLeft + tab.offsetWidth / 2;
  const scrollerCenter = serviceTabsScroller.clientWidth / 2;
  const maxScroll = serviceTabsScroller.scrollWidth - serviceTabsScroller.clientWidth;
  const left = Math.max(0, Math.min(tabCenter - scrollerCenter, maxScroll));

  serviceTabsScroller.scrollTo({ left, behavior });
}

function renderServiceCards(categoryId) {
  if (!serviceCatalog || !servicePanelImage || !serviceTileRow) {
    return;
  }

  const category =
    serviceCatalog.categories.find((item) => item.id === categoryId) ??
    serviceCatalog.categories[0];

  servicePanelImage.src = category.background;
  servicePanelImage.alt = category.backgroundAlt;
  servicePanel?.setAttribute("aria-labelledby", `service-tab-${category.id}`);
  serviceTileRow.setAttribute("aria-label", category.label);

  if (serviceCategoryEyebrow) {
    serviceCategoryEyebrow.textContent = category.eyebrow;
  }

  if (serviceCategoryTitle) {
    serviceCategoryTitle.textContent = category.label;
  }

  if (serviceCategoryDescription) {
    serviceCategoryDescription.textContent = category.description;
  }

  serviceTileRow.innerHTML = category.services
    .map(
      (service, index) => `
        <a class="service-card" href="service-detail?service=${service.slug}" aria-label="View ${service.title} details">
          <div class="service-card-media">
            <img src="${service.image}" alt="" loading="lazy" decoding="async" />
            <span class="service-card-number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
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

function activateServiceTab(tab, moveFocus = false) {
  const categoryId = tab?.dataset.serviceTab;

  if (!tab || !categoryId) {
    return;
  }

  serviceTabs.forEach((item) => {
    const isActive = item === tab;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-selected", String(isActive));
    item.tabIndex = isActive ? 0 : -1;
  });

  renderServiceCards(categoryId);
  centerServiceTab(tab);

  if (moveFocus) {
    tab.focus();
  }
}

serviceTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    activateServiceTab(tab);
  });

  tab.addEventListener("keydown", (event) => {
    let nextIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % serviceTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + serviceTabs.length) % serviceTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = serviceTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    activateServiceTab(serviceTabs[nextIndex], true);
  });
});

const requestedServiceCategory = new URLSearchParams(window.location.search).get(
  "category",
);
const initialServiceTab =
  serviceTabs.find((tab) => tab.dataset.serviceTab === requestedServiceCategory) ??
  serviceTabs.find((tab) => tab.classList.contains("is-active")) ??
  serviceTabs[0];

activateServiceTab(initialServiceTab);
window.addEventListener("resize", () => {
  centerServiceTab(serviceTabs.find((tab) => tab.classList.contains("is-active")) ?? serviceTabs[0], "auto");
});

const cityCardRow = document.querySelector(".city-card-row");
const cityScrollQuery = window.matchMedia("(max-width: 760px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let cityScrollInterval;
let cityScrollEndTimer;
let cityResizeTimer;
let cityScrollDistance = 0;
let cityScrollLoopStart = 0;
let cityScrollPaused = false;

function getCityScrollStep() {
  const card = cityCardRow?.querySelector(".city-card");
  const styles = cityCardRow ? window.getComputedStyle(cityCardRow) : undefined;
  const gap = styles ? Number.parseFloat(styles.columnGap || styles.gap || "0") : 0;

  return card ? card.getBoundingClientRect().width + gap : 0;
}

function getCenteredCityScrollLeft(card) {
  if (!cityCardRow || !card) {
    return 0;
  }

  const rowBounds = cityCardRow.getBoundingClientRect();
  const cardBounds = card.getBoundingClientRect();

  return (
    cityCardRow.scrollLeft +
    cardBounds.left +
    cardBounds.width / 2 -
    (rowBounds.left + cityCardRow.clientWidth / 2)
  );
}

function jumpCityScrollTo(left) {
  if (!cityCardRow) {
    return;
  }

  const previousScrollBehavior = cityCardRow.style.scrollBehavior;
  cityCardRow.style.scrollBehavior = "auto";
  cityCardRow.scrollLeft = left;
  void cityCardRow.offsetWidth;
  cityCardRow.style.scrollBehavior = previousScrollBehavior;
}

function stopCityAutoScroll() {
  window.clearInterval(cityScrollInterval);
  cityScrollInterval = undefined;
}

function startCityAutoScroll() {
  stopCityAutoScroll();

  if (
    !cityCardRow?.classList.contains("is-auto-scroll") ||
    reducedMotionQuery.matches ||
    document.hidden
  ) {
    return;
  }

  cityScrollInterval = window.setInterval(stepCityAutoScroll, 5000);
}

function setCityAutoScroll(enabled) {
  if (!cityCardRow) {
    return;
  }

  cityCardRow.querySelectorAll("[data-city-clone]").forEach((clone) => clone.remove());
  cityCardRow.classList.toggle("is-auto-scroll", enabled);
  cityScrollDistance = 0;
  cityScrollLoopStart = 0;
  window.clearTimeout(cityScrollEndTimer);
  stopCityAutoScroll();

  if (!enabled) {
    jumpCityScrollTo(0);
    return;
  }

  const originalCards = Array.from(cityCardRow.children);
  const leadingClones = document.createDocumentFragment();
  const trailingClones = document.createDocumentFragment();

  originalCards.forEach((card) => {
    const leadingClone = card.cloneNode(true);
    const trailingClone = card.cloneNode(true);

    leadingClone.setAttribute("aria-hidden", "true");
    leadingClone.setAttribute("data-city-clone", "leading");
    trailingClone.setAttribute("aria-hidden", "true");
    trailingClone.setAttribute("data-city-clone", "trailing");

    leadingClones.append(leadingClone);
    trailingClones.append(trailingClone);
  });

  cityCardRow.prepend(leadingClones);
  cityCardRow.append(trailingClones);

  const firstOriginal = originalCards[0];
  const firstTrailingClone = cityCardRow.querySelector(
    '[data-city-clone="trailing"]',
  );
  cityScrollDistance =
    firstOriginal && firstTrailingClone
      ? firstTrailingClone.offsetLeft - firstOriginal.offsetLeft
      : 0;
  cityScrollLoopStart = getCenteredCityScrollLeft(firstOriginal);
  jumpCityScrollTo(cityScrollLoopStart);

  if (reducedMotionQuery.matches) {
    return;
  }

  startCityAutoScroll();
}

function stepCityAutoScroll() {
  if (!cityCardRow || cityScrollPaused || !cityScrollDistance) {
    return;
  }

  const step = getCityScrollStep();

  if (!step) {
    return;
  }

  const nextLeft = cityCardRow.scrollLeft + step;

  cityCardRow.scrollTo({
    left: nextLeft,
    behavior: "smooth",
  });

  window.setTimeout(() => {
    if (!cityCardRow || cityScrollPaused) {
      return;
    }

    normalizeCityScrollPosition();
  }, 700);
}

function normalizeCityScrollPosition() {
  if (!cityCardRow || !cityScrollDistance) {
    return;
  }

  const loopEnd = cityScrollLoopStart + cityScrollDistance;

  if (cityCardRow.scrollLeft >= loopEnd - 1) {
    jumpCityScrollTo(cityCardRow.scrollLeft - cityScrollDistance);
  } else if (cityCardRow.scrollLeft < cityScrollLoopStart - 1) {
    jumpCityScrollTo(cityCardRow.scrollLeft + cityScrollDistance);
  }
}

function updateCityAutoScroll() {
  setCityAutoScroll(cityScrollQuery.matches);
}

function scheduleCityScrollNormalization() {
  window.clearTimeout(cityScrollEndTimer);
  cityScrollEndTimer = window.setTimeout(normalizeCityScrollPosition, 180);
}

function resumeCityAutoScroll() {
  cityScrollPaused = false;
  scheduleCityScrollNormalization();
  startCityAutoScroll();
}

cityCardRow?.addEventListener("pointerdown", () => {
  cityScrollPaused = true;
  stopCityAutoScroll();
});

cityCardRow?.addEventListener("pointerup", resumeCityAutoScroll);
cityCardRow?.addEventListener("pointercancel", resumeCityAutoScroll);
cityCardRow?.addEventListener("pointerleave", resumeCityAutoScroll);
cityCardRow?.addEventListener("scroll", scheduleCityScrollNormalization, {
  passive: true,
});
cityCardRow?.addEventListener("scrollend", normalizeCityScrollPosition);

cityScrollQuery.addEventListener("change", updateCityAutoScroll);
reducedMotionQuery.addEventListener("change", updateCityAutoScroll);
window.addEventListener("resize", () => {
  window.clearTimeout(cityResizeTimer);
  cityResizeTimer = window.setTimeout(updateCityAutoScroll, 180);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopCityAutoScroll();
  } else {
    startCityAutoScroll();
  }
});
updateCityAutoScroll();

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
