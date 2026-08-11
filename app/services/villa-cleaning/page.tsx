import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const cleaningHighlights = [
  "Room-by-room care",
  "Flexible scheduling",
  "Final quality check",
];

export const metadata: Metadata = {
  title: "Villa Cleaning in Qatar | Al Safa Hygiene",
  description:
    "Complete villa cleaning for majlis rooms, kitchens, bathrooms, bedrooms, and daily living areas across Qatar.",
};

function SiteHeader() {
  return (
    <header className="marketing-header detail-header" aria-label="Main navigation">
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
          <Link href="/#services">Services</Link>
          <Link href="/#why-us">Why us</Link>
          <Link aria-current="page" href="/services/villa-cleaning">
            Villa cleaning
          </Link>
        </nav>

        <a className="header-call" href="tel:+97477881230">
          Call +974 7788 1230
        </a>
      </div>
    </header>
  );
}

export default function VillaCleaningPage() {
  return (
    <main className="marketing-page villa-page">
      <section className="villa-hero" aria-labelledby="villa-title">
        <SiteHeader />

        <div className="villa-orbit villa-orbit-top" aria-hidden="true" />
        <div className="villa-orbit villa-orbit-bottom" aria-hidden="true" />

        <div className="villa-shell">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/#services">Services</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Villa Cleaning</span>
          </nav>

          <div className="villa-grid">
            <div className="villa-copy">
              <Link className="back-pill" href="/#services">
                <span aria-hidden="true">←</span> All services
              </Link>

              <p className="section-kicker">Cleaning services</p>
              <h1 id="villa-title">Villa Cleaning</h1>
              <p className="villa-intro">
                Complete interior cleaning for villas, majlis rooms, kitchens,
                bathrooms, and daily living areas.
              </p>

              <ul className="feature-pills villa-pills" aria-label="Villa cleaning highlights">
                {cleaningHighlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>

              <div className="hero-buttons villa-buttons">
                <a
                  className="action-button action-primary"
                  href="mailto:contact@alsafahygiene.com?subject=Villa%20cleaning%20quote"
                >
                  Request a cleaning quote
                </a>
                <a className="action-button action-secondary" href="tel:+97477881230">
                  Call +974 7788 1230
                </a>
              </div>
            </div>

            <figure className="villa-photo">
              <Image
                src="/villa-cleaning-pexels.jpg"
                alt="Two professional cleaners vacuuming and mopping a modern villa living room"
                width={1600}
                height={2400}
                sizes="(max-width: 940px) calc(100vw - 48px), 54vw"
                priority
                unoptimized
              />
              <figcaption className="villa-photo-card">
                <p>Careful property cleaning</p>
                <strong>
                  A cleaner, more comfortable space with a clear plan from start
                  to finish.
                </strong>
                <span>
                  Suitable for villas, apartments, majlis rooms, and regularly
                  maintained living spaces.
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    </main>
  );
}
