import type { Metadata } from "next";

const navItems = ["Why us", "Why us", "Why us"];
const serviceAreas = [
  "Doha",
  "Al Wakrah",
  "Al Khor",
  "Al Rayyan",
  "Al Rayyan",
  "Al Shahaniya",
  "Mesaieed",
];

const photos = [
  {
    src: "/figma-assets/image-5.png",
    alt: "Pest control technician treating a window area from a ladder",
    tileClass: "photo-tile photo-tile-large",
    imageClass: "photo-image image-5",
  },
  {
    src: "/figma-assets/image-7.png",
    alt: "Floor treatment equipment used for professional pest control",
    tileClass: "photo-tile photo-tile-small",
    imageClass: "photo-image image-7",
  },
  {
    src: "/figma-assets/image-6.png",
    alt: "Technician cleaning and treating a mattress surface",
    tileClass: "photo-tile photo-tile-medium",
    imageClass: "photo-image image-6",
  },
  {
    src: "/figma-assets/image-4.png",
    alt: "Outdoor pest control spraying service on a garden wall",
    tileClass: "photo-tile photo-tile-tall",
    imageClass: "photo-image image-4",
  },
];

export const metadata: Metadata = {
  title: "Qatar Pest Control",
  description:
    "Safe, effective, and professional pest management services across Qatar.",
};

function Button({
  children,
  variant = "primary",
  size = "hero",
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "hero" | "nav";
}) {
  return (
    <a className={`cta-button cta-${variant} cta-${size}`} href="#contact">
      {children}
    </a>
  );
}

function PhotoTile({
  src,
  alt,
  tileClass,
  imageClass,
}: {
  src: string;
  alt: string;
  tileClass: string;
  imageClass: string;
}) {
  return (
    <figure className={tileClass}>
      <img className={imageClass} src={src} alt={alt} />
    </figure>
  );
}

function ServiceChip({ label }: { label: string }) {
  return <li className="service-chip">{label}</li>;
}

export default function Home() {
  return (
    <main className="qatar-page">
      <div className="figma-frame">
        <header className="site-header" aria-label="Main navigation">
          <a className="brand-mark" href="/" aria-label="Qatar Pest Control">
            <img src="/figma-assets/logo.png" alt="Qatar Pest Control logo" />
          </a>

          <nav className="nav-links" aria-label="Primary">
            {navItems.map((item, index) => (
              <a href="#why-us" key={`${item}-${index}`}>
                {item}
              </a>
            ))}
          </nav>

          <Button size="nav">Get in touch</Button>
        </header>

        <section className="hero-copy" aria-labelledby="hero-heading">
          <div className="headline-block">
            <h1 id="hero-heading">
              Qatar&rsquo;s Trusted Pest Control Experts
            </h1>
            <p>
              Delivering safe, effective, and professional pest management
              services across Qatar, backed by 7+ years of industry expertise.
            </p>
          </div>

          <div className="hero-actions">
            <Button>Get in touch</Button>
            <Button variant="outline">Get in touch</Button>
          </div>
        </section>

        <section className="photo-mosaic" aria-label="Pest control services">
          <div className="photo-column">
            <PhotoTile {...photos[0]} />
            <PhotoTile {...photos[1]} />
          </div>
          <div className="photo-column">
            <PhotoTile {...photos[2]} />
            <PhotoTile {...photos[3]} />
          </div>
        </section>

        <section className="service-areas" aria-labelledby="areas-heading">
          <h2 id="areas-heading">Providing top class services in:</h2>
          <ul>
            {serviceAreas.map((area, index) => (
              <ServiceChip label={area} key={`${area}-${index}`} />
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
