"use client";

import { useState, useCallback } from "react";
import styles from "./ServiceSlider.module.css";

const services = [
  {
    id: "ecommerce",
    cardClass: "card1",
    icon: "🛒",
    chip: "E-Commerce",
    title: "Smart AI E-Commerce",
    desc: "AI-driven product recommendations, dynamic pricing & automated inventory that converts browsers into buyers.",
  },
  {
    id: "digital-marketing",
    cardClass: "card2",
    icon: "📈",
    chip: "Digital Marketing",
    title: "AI Digital Marketing",
    desc: "Predictive analytics, auto A/B testing and real-time ROI forecasting across every channel.",
  },
  {
    id: "social-media",
    cardClass: "card3",
    icon: "📱",
    chip: "Social Media",
    title: "AI Social Media",
    desc: "Generate scroll-stopping posts, schedule at peak engagement, and track sentiment with AI.",
  },
  {
    id: "content-creation",
    cardClass: "card4",
    icon: "✍️",
    chip: "Content Creation",
    title: "AI Content Creation",
    desc: "Blog posts, landing pages, ad copy, and scripts written in your brand voice — 10× faster.",
  },
  {
    id: "audio-voice",
    cardClass: "card5",
    icon: "🎙️",
    chip: "Audio & Voice",
    title: "AI Voice Creation",
    desc: "Studio-quality voiceovers, multilingual narrations, and podcast production — no studio needed.",
  },
  {
    id: "course-blogging",
    cardClass: "card6",
    icon: "🎓",
    chip: "Courses & Blogging",
    title: "AI Courses & Blogging",
    desc: "AI-generated curricula, quizzes, and long-form authority content with personalised learning paths.",
  },
];

const TOTAL = services.length;

// Wrap index so it's always within [0, TOTAL)
function wrap(i: number) {
  return ((i % TOTAL) + TOTAL) % TOTAL;
}

export default function ServiceSlider() {
  const [active, setActive] = useState(0);

  const prev = useCallback(() => setActive((a) => wrap(a - 1)), []);
  const next = useCallback(() => setActive((a) => wrap(a + 1)), []);

  return (
    <section className={styles.section}>
      {/* Heading */}
      <div className={styles.heading}>
        <h2>
          <span className={styles.accent}>6 AI</span> Services Built{" "}
          <span className={styles.accentGreen}>for You</span>
        </h2>
        <p>
          Click any card or use the arrows to explore every AI-powered service
          we offer.
        </p>
      </div>

      {/* 3-D stage */}
      <div className={styles.stage} aria-label="Service slider">
        <div className={styles.track}>
          {services.map((svc, i) => {
            // position offset from active centre: -2 to +3
            const raw = i - active;
            // wrap so distant slides wrap around
            let offset = raw;
            if (raw > TOTAL / 2) offset = raw - TOTAL;
            if (raw < -TOTAL / 2) offset = raw + TOTAL;

            // Clamp visibility to -3..3
            const pos = Math.max(-3, Math.min(3, offset));

            return (
              <div
                key={svc.id}
                id={`slide-${svc.id}`}
                data-pos={String(pos)}
                className={`${styles.card} ${styles[svc.cardClass]}`}
                onClick={() => offset !== 0 && setActive(wrap(i))}
                role={offset !== 0 ? "button" : undefined}
                aria-label={offset !== 0 ? `Go to ${svc.title}` : undefined}
              >
                {/* Browser chrome */}
                <div className={styles.browserBar}>
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <span className={styles.dot} />
                  <div className={styles.browserUrl} />
                </div>

                {/* Content */}
                <div className={styles.cardBody}>
                  <div className={styles.cardIcon}>{svc.icon}</div>
                  <div className={styles.cardChip}>{svc.chip}</div>
                  <p className={styles.cardTitle}>{svc.title}</p>
                  <p className={styles.cardDesc}>{svc.desc}</p>

                  {/* Decorative mock UI */}
                  <div className={styles.mockUi}>
                    <div className={styles.mockRow} />
                    <div className={styles.mockRow} />
                    <div className={styles.mockRow} />
                    <div className={styles.mockBar}>
                      <div className={styles.mockBtn} />
                      <div className={styles.mockBtn} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Slider navigation">
        <button
          id="slider-prev"
          className={styles.navBtn}
          onClick={prev}
          aria-label="Previous service"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className={styles.dots}>
          {services.map((svc, i) => (
            <button
              key={svc.id}
              id={`dot-${svc.id}`}
              className={`${styles.dotBtn} ${i === active ? styles.active : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to slide ${i + 1}: ${svc.title}`}
              aria-current={i === active ? "true" : undefined}
            />
          ))}
        </div>

        <button
          id="slider-next"
          className={styles.navBtn}
          onClick={next}
          aria-label="Next service"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </nav>
    </section>
  );
}
