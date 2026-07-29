const header = document.querySelector(".site-header");
let lastScrollY = window.scrollY;
let ticking = false;

function updateHeader() {
  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;
  const pastHeader = currentScrollY > 96;

  header?.classList.toggle("is-scrolled", currentScrollY > 12);
  header?.classList.toggle("is-hidden", scrollingDown && pastHeader);

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
    header?.classList.remove("is-hidden");

    const headerHeight = header?.getBoundingClientRect().height ?? 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(targetTop - headerHeight - 20, 0),
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
        <a href="service-detail.html?service=${service.slug}" aria-label="View ${service.title} details">
          <img src="${service.image}" alt="" />
          <h3>${service.title}</h3>
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
