// Navbar.tsx — The Navigation Bar Component
// ==========================================
// This component renders the menu bar that appears at the top of every page.
// It's imported and used in layout.tsx so it shows up site-wide.
//
// "Link" from Next.js works like an <a> tag but navigates between pages
// WITHOUT doing a full browser re;load — much faster!
"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";





// The Navbar component. No props needed — the links are hardcoded here.
export default function Navbar() {

  const [navbarActive, setNavbarActive] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);


  const navItems = [
    { name: "Home", href: "/", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg> },
    { name: "Future Services", href: "/ServiceAi", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg> },
    { name: "Member", href: "/member", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> },
    { name: "Showcase", href: "#", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>, isSubmenu: true },
    { name: "Resources", href: "#", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /><path d="M8 6h10" /></svg>, isSubmenu: true },
    { name: "Contact", href: "/contact", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg> },
  ];

  const showcaseItems = [
    { name: "AI Chat", target: "_blank", href: "https://codeplenty.vercel.app", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
    { name: "Maps", target: "", href: "/api_showcase/Google", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg> },
    { name: "Weather", target: "", href: "/api_showcase/OpenWeather", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" /><path d="M12.5 13V5a2.5 2.5 0 1 0-5 0v8" /><path d="M10 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" /></svg> },
    { name: "RAG AI", target: "", href: "/api_showcase/RAG", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8" /><path d="m4.93 10.93 1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" /><path d="M22 22H2" /><path d="m16 6-4 4-4-4" /><path d="M16 18a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /></svg> },
    { name: "Blog", target: "", href: "/api_showcase/blog", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" /><path d="M18 14h-8" /><path d="M15 18h-5" /><path d="M10 6h8v4h-8V6Z" /></svg> },
    { name: "Converter", target: "", href: "https://youtubemp3converter-production-c65d.up.railway.app", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg> },
  ];

  const resourceItems = [
    { name: "React", target: "", href: "/Resources/React", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg> },
    { name: "Contentful", target: "", href: "/Resources/Contentful", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M7 7h10" /><path d="M7 12h10" /><path d="M7 17h10" /></svg> },
    { name: "API Docs", target: "", href: "/Resources/Api", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10" /><path d="M12 22H2V12" /><path d="M22 22h-10V12" /><path d="M22 2h-10v10" /></svg> },
    { name: "Google API", target: "_blank", href: "/docs/Google_Maps_API.html", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="21.17" y1="8" x2="12" y2="8" /><line x1="3.95" y1="6.06" x2="8.54" y2="14" /><line x1="10.88" y1="21.94" x2="15.46" y2="14" /></svg> },
  ];





  return (
    // <nav> is a semantic HTML tag that tells browsers (and screen readers)
    // this section contains navigation links.                  
    <nav className={styles.navbar}>

      <button
        className={styles.hamburger}
        onClick={() => setNavbarActive(!navbarActive)}
        aria-label="Toggle navigation"
      >
        <span className={`${styles.bar} ${navbarActive ? styles.active : ""}`}></span>
        <span className={`${styles.bar} ${navbarActive ? styles.active : ""}`}></span>
        <span className={`${styles.bar} ${navbarActive ? styles.active : ""}`}></span>
      </button>

      {/* Left side: the site logo / brand name */}
      <div className={styles.brand}>
        {/* Link to the homepage ("/") */}
        <Link href="/" className={styles.brandLink}>
          <Image
            className={styles.logo}
            src="/logo-jorvann-white.png"         // Path to the image in the /public folder
            alt="jorvann company logo"      // Alt text for accessibility (screen readers)
            width={150}             // Display width in pixels
            height={50}             // Display height in pixels
            priority                // Load this image immediately (above the fold)
          />
        </Link>
      </div>

      {/* Navigation links (Desktop & Mobile) */}
      <ul className={`${styles.navLinks} ${navbarActive ? styles.active : ""}`} >

        {/* Mobile-only Grid View */}
        <div className={styles.mobileGrid}>
          <div className={`${styles.mobileSlider} ${activeSubmenu ? styles.showSubmenu : ""}`}>

            {/* Main Menu Section */}
            <div className={styles.menuSection}>
              {navItems.map((item) => (
                <li key={item.name} className={styles.mobileItem}>
                  <Link
                    href={item.href}
                    className={styles.mobileLink}
                    onClick={(e) => {
                      if (item.isSubmenu) {
                        e.preventDefault();
                        setActiveSubmenu(item.name);
                      } else {
                        setNavbarActive(false);
                      }
                    }}
                  >
                    <div className={styles.iconCircle}>
                      {item.icon}
                    </div>
                    <span className={styles.iconLabel}>{item.name}</span>
                  </Link>
                </li>
              ))}
            </div>

            {/* Submenu Section (Dynamic Content) */}
            <div className={styles.menuSection}>
              {(activeSubmenu === "Showcase" ? showcaseItems : activeSubmenu === "Resources" ? resourceItems : []).map((item) => (
                <li key={item.name} className={styles.mobileItem}>
                  <Link
                    href={item.href}
                    target={item.target}
                    className={styles.mobileLink}
                    onClick={() => {
                      setNavbarActive(false);
                      setActiveSubmenu(null);
                    }}
                  >
                    <div className={styles.iconCircle}>
                      {item.icon}
                    </div>
                    <span className={styles.iconLabel}>{item.name}</span>
                  </Link>
                </li>
              ))}

              {/* Back Button inside the submenu section */}
              <li className={styles.mobileBackItem}>
                <button className={styles.mobileBackButton} onClick={() => setActiveSubmenu(null)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  <span>Go Back</span>
                </button>
              </li>
            </div>


          </div>

          {/* Close button at the bottom of the grid on mobile */}
          <li className={styles.mobileCloseItem}>
            <button className={styles.mobileCloseButton} onClick={() => { setNavbarActive(false); setActiveSubmenu(null); }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </li>
        </div>

        {/* Desktop View (Traditional list) */}
        <div className={styles.desktopMenu}>
          {/*
            Each <li> is a list item.
            Using a <ul> (unordered list) for nav links is the correct,
            accessible HTML pattern for navigation menus.
          */}
          <li>
            <Link href="/" className={styles.link}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/ServiceAi" className={styles.link}>
              Future Services
            </Link>
          </li>
          <li>
            <Link href="/member" className={styles.link}>
              Member
            </Link>
          </li>

          <li className={styles.dropdown}>
            <Link href="#" className={styles.link}>
              API showcase <span className={styles.arrow}>▼</span>
            </Link>

            <div className={styles.dropdownContent}>
              <Link href="https://codeplenty.vercel.app" target="_blank" className={styles.dropdownItem}>
                AI Chat with Tools integration
              </Link>
              <Link href="/api_showcase/Google" className={styles.dropdownItem}>
                Google Maps
              </Link>
              <Link href="/api_showcase/OpenWeather" className={styles.dropdownItem}>
                OpenWeather
              </Link>
              <Link href="/api_showcase/RAG" className={styles.dropdownItem}>
                RAG Ai
              </Link>
              <Link href="/api_showcase/blog" className={styles.dropdownItem}>
                Blog CRUD
              </Link>
              <Link href="https://youtubemp3converter-production-c65d.up.railway.app" target="_blank" className={styles.dropdownItem}>
                Youtube mp3 converter
              </Link>
            </div>
          </li>
          <li className={styles.dropdown}>
            <Link href="#" className={styles.link}>
              Resources <span className={styles.arrow}>▼</span>
            </Link>
            <div className={styles.dropdownContent}>
              <Link href="/Resources/React" className={styles.dropdownItem}>
                React
              </Link>
              <Link href="/Resources/Contentful" className={styles.dropdownItem}>
                Contentful
              </Link>
              <Link href="/Resources/Api" className={styles.dropdownItem}>
                Api
              </Link>
              <Link href="/docs/Google_Maps_API.html" target="_blank" className={styles.dropdownItem}>
                Google Maps
              </Link>

            </div>
          </li>
          <li>
            <Link href="/contact" className={styles.link}>
              Contact
            </Link>
          </li>
        </div>
      </ul>

    </nav >
  );
}
