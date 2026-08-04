const params = new URLSearchParams(window.location.search);
const requestedSlug = params.get("service");
const catalog = window.serviceCatalog;
const service =
  catalog?.allServices.find((item) => item.slug === requestedSlug) ??
  catalog?.allServices[0];

function renderList(container, items) {
  if (!container || !Array.isArray(items) || items.length === 0) {
    return;
  }

  container.replaceChildren(
    ...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }),
  );
}

function renderFacts(container, facts) {
  if (!container || !Array.isArray(facts) || facts.length === 0) {
    return;
  }

  container.replaceChildren(
    ...facts.map((fact) => {
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

if (service) {
  document.title = `${service.title} | Qatar Pest Control`;

  const title = document.querySelector("#detail-title");
  const category = document.querySelector("#detail-category");
  const summary = document.querySelector("#detail-summary");
  const image = document.querySelector("#detail-image");
  const badges = document.querySelector("#detail-badges");
  const facts = document.querySelector("#detail-facts");
  const includes = document.querySelector("#detail-includes");
  const steps = document.querySelector("#detail-steps");
  const spotlightKicker = document.querySelector("#detail-spotlight-kicker");
  const spotlightTitle = document.querySelector("#detail-spotlight-title");
  const spotlightCopy = document.querySelector("#detail-spotlight-copy");

  if (title) {
    title.textContent = service.title;
  }

  if (category) {
    category.textContent = service.category;
  }

  if (summary) {
    summary.textContent = service.summary;
  }

  if (image) {
    image.src = service.image;
    image.alt = service.title;
  }

  renderList(badges, service.badges);
  renderFacts(facts, service.facts);
  renderList(includes, service.includes);
  renderList(steps, service.steps);

  if (service.spotlight) {
    if (spotlightKicker) {
      spotlightKicker.textContent = service.spotlight.kicker;
    }

    if (spotlightTitle) {
      spotlightTitle.textContent = service.spotlight.title;
    }

    if (spotlightCopy) {
      spotlightCopy.textContent = service.spotlight.copy;
    }
  }
}
