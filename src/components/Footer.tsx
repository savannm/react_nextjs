// Footer.tsx — Site-wide Footer Component
// =========================================
// This footer is imported in layout.tsx so it appears on every page.
// It includes: brand, tagline, navigation columns, social links,
// a live status badge, and a copyright bar.

import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>

        {/* ── Top Grid ────────────────────────────────────────────── */}
        <div className={styles.footerGrid}>

          {/* Brand / About column */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logoWrap}>
              <Image
                src="/logo-jorvann-white.png"
                alt="Jorvann logo"
                width={130}
                height={44}
                priority
              />
            </Link>

            <p className={styles.tagline}>
              A development sandbox for coding experiments — exploring modern
              web technologies, and creative interfaces.
            </p>

            {/* Social links */}
            <div className={styles.socials}>
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="GitHub"
              >
                {/* GitHub SVG icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="Twitter"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="LinkedIn"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation column */}
          <div className={styles.column}>
            <span className={styles.columnTitle}>Navigate</span>
            <Link href="/" className={styles.footerLink}>Home</Link>
            <Link href="/blog" className={styles.footerLink}>Blog</Link>
            <Link href="/ServiceAi" className={styles.footerLink}>Services</Link>
            <Link href="/member" className={styles.footerLink}>Member</Link>
            <Link href="/contact" className={styles.footerLink}>Contact</Link>
          </div>

          {/* Technologies column */}
          <div className={styles.column}>
            <span className={styles.columnTitle}>Tech Stack</span>
            <span className={styles.footerLink}>Next.js</span>
            <span className={styles.footerLink}>TypeScript</span>
            <span className={styles.footerLink}>React</span>
            <span className={styles.footerLink}>WordPress</span>
            <span className={styles.footerLink}>REST APIs</span>
          </div>

          {/* Resources column */}
          <div className={styles.column}>
            <span className={styles.columnTitle}>Resources</span>
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              Next.js Docs
            </a>
            <a
              href="https://react.dev"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              React Docs
            </a>
            <a
              href="https://www.typescriptlang.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerLink}
            >
              TypeScript Docs
            </a>

          </div>

        </div>
        {/* /footerGrid */}

        {/* ── Divider ─────────────────────────────────────────────── */}
        <div className={styles.divider} />

        {/* ── Bottom Bar ──────────────────────────────────────────── */}
        <div className={styles.bottomBar}>

          <span className={styles.copyright}>
            © {currentYear} Jorvann. All rights reserved.
          </span>


          <div className={styles.bottomLinks}>
            <Link href="/contact" className={styles.bottomLink}>Sitemap</Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
