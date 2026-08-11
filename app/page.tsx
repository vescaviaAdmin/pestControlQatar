import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const highlights = [
  "Rapid response",
  "Careful, approved methods",
  "Homes & businesses",
];

const metrics = [
  { value: "7+", label: "Years expertise" },
  { value: "1000+", label: "Jobs completed" },
  { value: "4.8", label: "Average rating" },
  { value: "24/7", label: "Booking support" },
];

export const metadata: Metadata = {
  title: "Professional Pest Control & Cleaning Services in Qatar | Al Safa Hygiene",
  description:
    "Professional pest control, deep cleaning, upholstery, and floor-care services for homes and businesses across Qatar.",
};

function SiteHeader() {
  return (
    <header className="marketing-header" aria-label="Main navigation">
      <div className="header-shell">
        <Link className="brand" href="/" aria-label="Al Safa Hygiene home">
          <Image
            src="/alsafa_logo_cutout.png"
            alt="Al Safa Hygiene"
            width={118}
            height={66}
            unoptimized
          />
        </Link>

        <nav className="marketing-nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#why-us">Why us</a>
          <Link href="/services/villa-cleaning">Villa cleaning</Link>
        </nav>

        <a className="header-call" href="tel:+97477881230">
          Call +974 7788 1230
        </a>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <main className="marketing-page">
      <section className="home-hero" id="why-us" aria-labelledby="hero-title">
        <Image
          className="home-hero-image"
          src="/hero-floor-care.jpg"
          alt="Professional floor cleaning equipment in a bright home"
          fill
          sizes="100vw"
          priority
          unoptimized
        />
        <div className="home-hero-shade" aria-hidden="true" />

        <SiteHeader />

        <div className="home-hero-shell">
          <div className="home-hero-copy">
            <p className="availability-pill">
              <span aria-hidden="true" />
              Same-day and 24/7 booking support
            </p>

            <h1 id="hero-title">
              Professional Pest Control
              <span>&amp; Cleaning Services in Qatar</span>
            </h1>

            <p className="hero-intro">
              One trusted team for pest treatments, deep cleaning, upholstery,
              and floor care across villas, apartments, offices, and commercial
              spaces.
            </p>

            <ul className="feature-pills" aria-label="Service highlights">
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <div className="hero-buttons">
              <a className="action-button action-primary" href="tel:+97477881230">
                Call for inspection
              </a>
              <Link className="action-button action-secondary" href="/services/villa-cleaning">
                Explore services
              </Link>
            </div>

            <dl className="hero-metrics" aria-label="Company highlights">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.value}</dt>
                  <dd>{metric.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="property-card" id="services" aria-label="Complete property care">
            <p>Complete property care</p>
            <h2>One team. Every essential service.</h2>
            <ul>
              <li>Pest control and prevention</li>
              <li>Deep and specialised cleaning</li>
              <li>Floor and upholstery care</li>
            </ul>
            <Link href="/services/villa-cleaning">
              View villa cleaning <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}
