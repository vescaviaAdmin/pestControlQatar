const params = new URLSearchParams(window.location.search);
const requestedSlug = params.get("service");
const catalog = window.serviceCatalog;
const allServices = Array.isArray(catalog?.allServices) ? catalog.allServices : [];
const service = allServices.find((item) => item.slug === requestedSlug);
const category = catalog?.categories?.find(
  (item) => item.id === service?.categoryId,
);

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element && typeof value === "string") {
    element.textContent = value;
  }

  return element;
}

function renderList(container, items) {
  if (!container) {
    return;
  }

  const safeItems = Array.isArray(items) ? items.filter(Boolean) : [];
  container.hidden = safeItems.length === 0;
  container.replaceChildren(
    ...safeItems.map((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      return listItem;
    }),
  );
}

function renderFacts(container, facts) {
  if (!container) {
    return;
  }

  const safeFacts = Array.isArray(facts)
    ? facts.filter((fact) => fact?.value && fact?.label)
    : [];

  container.hidden = safeFacts.length === 0;
  container.replaceChildren(
    ...safeFacts.map((fact) => {
      const item = document.createElement("div");
      const value = document.createElement("dt");
      const label = document.createElement("dd");

      value.textContent = fact.value;
      label.textContent = fact.label;
      item.append(value, label);

      return item;
    }),
  );
}

function serviceDetailValue(key) {
  return (
    service?.[key] ??
    category?.detailDefaults?.[key] ??
    catalog?.detailDefaults?.[key]
  );
}

function serviceSpotlight() {
  return {
    ...(catalog?.detailDefaults?.spotlight ?? {}),
    ...(category?.detailDefaults?.spotlight ?? {}),
    ...(service?.spotlight ?? {}),
  };
}

function quoteMailto(title) {
  const subject = encodeURIComponent(`${title} quote request`);
  return `mailto:contact@alsafahygiene.com?subject=${subject}`;
}

function createRelatedCard(item) {
  const link = document.createElement("a");
  const media = document.createElement("span");
  const image = document.createElement("img");
  const body = document.createElement("span");
  const categoryLabel = document.createElement("span");
  const title = document.createElement("strong");
  const summary = document.createElement("span");
  const action = document.createElement("span");

  link.className = "detail-related-card";
  link.href = `service-detail?service=${encodeURIComponent(item.slug)}`;
  link.setAttribute("aria-label", `View ${item.title} service details`);

  media.className = "detail-related-media";
  image.src = item.detailImage ?? item.image;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  media.append(image);

  body.className = "detail-related-card-body";
  categoryLabel.className = "detail-related-category";
  categoryLabel.textContent = item.category;
  title.textContent = item.title;
  summary.className = "detail-related-summary";
  summary.textContent = item.summary;
  action.className = "detail-related-action";
  action.innerHTML = 'View service <span aria-hidden="true">→</span>';

  body.append(categoryLabel, title, summary, action);
  link.append(media, body);

  return link;
}

function renderRelatedServices() {
  const section = document.querySelector("#detail-related-section");
  const container = document.querySelector("#detail-related-services");

  if (!section || !container || !service) {
    return;
  }

  const sameCategory = allServices.filter(
    (item) => item.categoryId === service.categoryId && item.slug !== service.slug,
  );
  const otherServices = allServices.filter(
    (item) => item.categoryId !== service.categoryId && item.slug !== service.slug,
  );
  const related = [...sameCategory, ...otherServices].slice(0, 3);

  if (related.length === 0) {
    section.hidden = true;
    return;
  }

  container.replaceChildren(...related.map(createRelatedCard));
  section.hidden = false;
}

function renderNotFound() {
  document.title = "Service Not Found | Al Safa Hygiene";

  const description = document.querySelector("#detail-meta-description");
  const robots = document.querySelector("#detail-meta-robots");
  const page = document.querySelector(".service-detail-page");

  description?.setAttribute(
    "content",
    "The requested Al Safa Hygiene service could not be found.",
  );
  robots?.setAttribute("content", "noindex, nofollow");

  if (!page) {
    return;
  }

  const section = document.createElement("section");
  const eyebrow = document.createElement("p");
  const title = document.createElement("h1");
  const copy = document.createElement("p");
  const actions = document.createElement("div");
  const servicesLink = document.createElement("a");
  const homeLink = document.createElement("a");

  page.classList.add("is-not-found");
  section.className = "detail-not-found";
  eyebrow.textContent = "Service not found";
  title.textContent = "We could not find that service.";
  copy.textContent =
    "The link may be outdated. Explore our current cleaning, floor-care, and pest-control services.";
  actions.className = "detail-not-found-actions";

  servicesLink.className = "button button-primary";
  servicesLink.href = "index.html#services";
  servicesLink.textContent = "View all services";

  homeLink.className = "button button-outline";
  homeLink.href = "index.html";
  homeLink.textContent = "Back to home";

  actions.append(servicesLink, homeLink);
  section.append(eyebrow, title, copy, actions);
  page.replaceChildren(section);
}

if (!requestedSlug || !service || !category) {
  renderNotFound();
} else {
  const badges = serviceDetailValue("badges");
  const facts = serviceDetailValue("facts");
  const steps = serviceDetailValue("steps");
  const spotlight = serviceSpotlight();
  const ctaLabel = serviceDetailValue("ctaLabel") ?? "Request a quote";
  const quoteHref = quoteMailto(service.title);
  const categoryUrl = `index.html?category=${encodeURIComponent(
    category.id,
  )}#services`;

  document.title = `${service.title} | Al Safa Hygiene`;
  document
    .querySelector("#detail-meta-description")
    ?.setAttribute("content", service.summary);
  document
    .querySelector("#detail-meta-robots")
    ?.setAttribute("content", "index, follow");

  setText("#detail-title", service.title);
  setText("#detail-category", service.category);
  setText("#detail-summary", service.summary);
  setText("#detail-breadcrumb-current", service.title);
  setText("#detail-spotlight-kicker", spotlight.kicker);
  setText("#detail-spotlight-title", spotlight.title);
  setText("#detail-spotlight-copy", spotlight.copy);
  setText("#detail-primary-cta", ctaLabel);
  setText("#detail-secondary-cta", ctaLabel);
  setText("#detail-cta-title", `Ready to book ${service.title}?`);

  const backLink = document.querySelector(".detail-back-link");
  const breadcrumbServices = document.querySelector(
    ".detail-breadcrumb a:nth-of-type(2)",
  );
  const image = document.querySelector("#detail-image");
  const primaryCta = document.querySelector("#detail-primary-cta");
  const secondaryCta = document.querySelector("#detail-secondary-cta");
  const mobileCta = document.querySelector("#detail-mobile-cta");

  backLink?.setAttribute("href", categoryUrl);
  breadcrumbServices?.setAttribute("href", categoryUrl);
  primaryCta?.setAttribute("href", quoteHref);
  secondaryCta?.setAttribute("href", quoteHref);
  mobileCta?.setAttribute("href", quoteHref);

  if (image) {
    image.src = service.detailImage ?? service.image ?? category.background;
    image.alt = "";
  }

  renderList(document.querySelector("#detail-badges"), badges);
  renderFacts(document.querySelector("#detail-facts"), facts);
  renderList(document.querySelector("#detail-includes"), service.includes);
  renderList(document.querySelector("#detail-steps"), steps);
  renderRelatedServices();
}

