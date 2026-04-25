"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Infographic data ──────────────────────────────────────────────────────────
const INFOGRAPHICS = [
  {
    id: 1,
    src: "/infographics/179afaea829cad65c89fd12e63770c65f72bcfc7.gif",
    title: "Insight 01",
    label: "Data Visualization",
  },
  {
    id: 2,
    src: "/infographics/1ae8687b7412b37e0a18a0e8ae14df8e97935ab6.gif",
    title: "Insight 02",
    label: "Motion Graphics",
  },
  {
    id: 3,
    src: "/infographics/6836b21bf378463c19dde54a62947f3be9335f7f.gif",
    title: "Insight 03",
    label: "Animated Story",
  },
  {
    id: 4,
    src: "/infographics/9dcf7467d4670625224dfa3d76e5336a2a19668e.gif",
    title: "Insight 04",
    label: "Process Flow",
  },
  {
    id: 5,
    src: "/infographics/9e4c1460b151ea1d907d3804289cc8fbaefd1e8e.gif",
    title: "Insight 05",
    label: "Statistical Chart",
  },
  {
    id: 6,
    src: "/infographics/a4c2c86ae6d8c622b3d8cab76014ba10b42d3231.gif",
    title: "Insight 06",
    label: "Visual Narrative",
  },
  {
    id: 7,
    src: "/infographics/d6e53e0d96c08c64d4f34b2bc35b8df9a0d5131a.gif",
    title: "Insight 07",
    label: "Timeline",
  },
];

// ─── Lightbox component ────────────────────────────────────────────────────────
function Lightbox({
  item,
  onClose,
}: {
  item: (typeof INFOGRAPHICS)[number] | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="infographic-lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="infographic-lightbox__inner"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="infographic-lightbox__close"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M1 1L17 17M17 1L1 17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="infographic-lightbox__img-wrap">
          <img src={item.src} alt={item.title} />
        </div>
        <div className="infographic-lightbox__meta">
          <span className="infographic-lightbox__label">{item.label}</span>
          <span className="infographic-lightbox__title">{item.title}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Card component ────────────────────────────────────────────────────────────
function InfographicCard({
  item,
  index,
  onOpen,
}: {
  item: (typeof INFOGRAPHICS)[number];
  index: number;
  onOpen: (item: (typeof INFOGRAPHICS)[number]) => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <button
      ref={cardRef}
      id={`infographic-card-${item.id}`}
      className={`infographic-card${visible ? " infographic-card--visible" : ""}`}
      style={{ transitionDelay: `${index * 60}ms` }}
      onClick={() => onOpen(item)}
      aria-label={`View ${item.title} – ${item.label}`}
    >
      <div className="infographic-card__img-wrap">
        <img
          src={item.src}
          alt={item.label}
          className="infographic-card__img"
          loading={index < 4 ? "eager" : "lazy"}
        />
        <div className="infographic-card__overlay">
          <span className="infographic-card__expand-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 3h5M3 3v5M17 3h-5M17 3v5M3 17h5M3 17v-5M17 17h-5M17 17v-5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="infographic-card__footer">
        <span className="infographic-card__label">{item.label}</span>
        <span className="infographic-card__title">{item.title}</span>
      </div>
    </button>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function InfographicsPage() {
  const [lightboxItem, setLightboxItem] = useState<
    (typeof INFOGRAPHICS)[number] | null
  >(null);

  return (
    <>
      <style>{pageStyles}</style>

      {/* Back button */}
      <Link href="/" className="infographic-back" aria-label="Back to portfolio">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Back</span>
      </Link>

      <main className="infographic-page">
        {/* Header */}
        <header className="infographic-header">
          <p className="infographic-header__eyebrow">Portfolio · 2025</p>
          <h1 className="infographic-header__title">
            <span>Infographics</span>
          </h1>
          <p className="infographic-header__sub">
            Motion design &amp; visual storytelling — tap any card to view full
            size.
          </p>
        </header>

        {/* Grid */}
        <section
          className="infographic-grid"
          aria-label="Infographics gallery"
        >
          {INFOGRAPHICS.map((item, i) => (
            <InfographicCard
              key={item.id}
              item={item}
              index={i}
              onOpen={setLightboxItem}
            />
          ))}
        </section>

        {/* Footer */}
        <footer className="infographic-footer">
          <p>
            {INFOGRAPHICS.length} pieces · Husnain Khushid
          </p>
        </footer>
      </main>

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}

// ─── Inline styles (scoped, no Tailwind dependency) ───────────────────────────
const pageStyles = `
  /* ── Reset / base ──────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; }

  /* ── Page shell ────────────────────────────────────────── */
  .infographic-page {
    min-height: 100svh;
    background: #0d0d0d;
    padding: 96px 24px 80px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* ── Back link ──────────────────────────────────────────── */
  .infographic-back {
    position: fixed;
    top: 28px;
    left: 28px;
    z-index: 50;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #6b635a;
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .infographic-back:hover { color: #EB5939; }

  /* ── Header ─────────────────────────────────────────────── */
  .infographic-header {
    margin-bottom: 64px;
  }
  .infographic-header__eyebrow {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #EB5939;
    margin: 0 0 16px;
  }
  .infographic-header__title {
    font-family: 'Oswald', sans-serif;
    font-size: clamp(48px, 9vw, 100px);
    font-weight: 400;
    color: #ededed;
    margin: 0 0 20px;
    line-height: 0.95;
    letter-spacing: -0.02em;
  }
  .infographic-header__sub {
    font-size: 14px;
    color: #6b635a;
    letter-spacing: 0.04em;
    margin: 0;
    max-width: 400px;
    line-height: 1.6;
  }

  /* ── Grid ───────────────────────────────────────────────── */
  .infographic-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
    gap: 2px;
  }

  /* ── Card ───────────────────────────────────────────────── */
  .infographic-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #111;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    overflow: hidden;

    /* Entry animation — hidden by default */
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .infographic-card--visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* hover lift */
  .infographic-card:hover {
    z-index: 2;
  }
  .infographic-card:hover .infographic-card__img {
    transform: scale(1.03);
  }
  .infographic-card:hover .infographic-card__overlay {
    opacity: 1;
  }

  /* active press */
  .infographic-card:active {
    transform: scale(0.98);
    transition-duration: 0.1s;
  }

  /* focus ring */
  .infographic-card:focus-visible {
    outline: 2px solid #EB5939;
    outline-offset: 2px;
  }

  /* image wrapper */
  .infographic-card__img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
    background: #1a1a1a;
  }
  .infographic-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* overlay */
  .infographic-card__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(13, 13, 13, 0) 50%,
      rgba(13, 13, 13, 0.55) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .infographic-card__expand-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(235, 89, 57, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    backdrop-filter: blur(4px);
  }

  /* footer */
  .infographic-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    border-top: 1px solid #1e1e1e;
  }
  .infographic-card__label {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b635a;
  }
  .infographic-card__title {
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #EB5939;
  }

  /* ── Lightbox ───────────────────────────────────────────── */
  .infographic-lightbox {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(13, 13, 13, 0.92);
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    animation: lb-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes lb-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .infographic-lightbox__inner {
    position: relative;
    max-width: min(90vw, 900px);
    width: 100%;
    animation: lb-scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  @keyframes lb-scale-in {
    from { transform: scale(0.92) translateY(12px); opacity: 0; }
    to   { transform: scale(1)    translateY(0);    opacity: 1; }
  }

  .infographic-lightbox__close {
    position: absolute;
    top: -44px;
    right: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #2e2e2e;
    background: #1a1a1a;
    color: #b7ab98;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s, border-color 0.2s;
  }
  .infographic-lightbox__close:hover {
    color: #EB5939;
    border-color: #EB5939;
  }

  .infographic-lightbox__img-wrap {
    width: 100%;
    border-radius: 4px;
    overflow: hidden;
    background: #1a1a1a;
    line-height: 0;
  }
  .infographic-lightbox__img-wrap img {
    width: 100%;
    height: auto;
    max-height: 78vh;
    object-fit: contain;
    display: block;
  }

  .infographic-lightbox__meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
  }
  .infographic-lightbox__label {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b635a;
  }
  .infographic-lightbox__title {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #EB5939;
  }

  /* ── Page footer ────────────────────────────────────────── */
  .infographic-footer {
    margin-top: 64px;
    padding-top: 24px;
    border-top: 1px solid #1e1e1e;
    color: #3a3330;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  /* ── Mobile tweaks ──────────────────────────────────────── */
  @media (max-width: 600px) {
    .infographic-page {
      padding: 80px 12px 64px;
    }
    .infographic-back {
      top: 20px;
      left: 16px;
    }
    .infographic-header {
      margin-bottom: 40px;
    }
    .infographic-grid {
      grid-template-columns: 1fr;
      gap: 1px;
    }
    .infographic-lightbox__close {
      top: -48px;
    }
  }
  @media (min-width: 601px) and (max-width: 900px) {
    .infographic-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;
