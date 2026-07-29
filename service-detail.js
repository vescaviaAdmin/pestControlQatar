const params = new URLSearchParams(window.location.search);
const requestedSlug = params.get("service");
const catalog = window.serviceCatalog;
const service =
  catalog?.allServices.find((item) => item.slug === requestedSlug) ??
  catalog?.allServices[0];

if (service) {
  document.title = `${service.title} | Qatar Pest Control`;

  const title = document.querySelector("#detail-title");
  const category = document.querySelector("#detail-category");
  const summary = document.querySelector("#detail-summary");
  const image = document.querySelector("#detail-image");
  const includes = document.querySelector("#detail-includes");

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

  if (includes) {
    includes.innerHTML = service.includes.map((item) => `<li>${item}</li>`).join("");
  }
}
