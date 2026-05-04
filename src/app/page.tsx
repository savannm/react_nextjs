// page.tsx — This is the HOME PAGE of your app.
// It's what users see when they visit the root URL: http://localhost:3000/
//
// In Next.js (App Router), every "page.tsx" file inside the /app folder
// automatically becomes a route. This one is at "/" (the homepage).

// We import the Image component from Next.js.
// It's like a regular <img> tag, but smarter — it auto-optimises images.
"use client"


import Image from "next/image";
import { Suspense } from "react";





// We import our CSS styles from a "CSS Module" file.
// CSS Modules keep styles scoped to just this component (no name conflicts).
import styles from "./page.module.css";




// This is the Home component — the main content of the homepage.
// "export default" means this is the main thing exported from this file,
// and Next.js will use it to render the page.
export default function Home() {
  // "return" sends back the JSX (HTML-like code) that gets displayed on screen.


  const sav = class {
    name: string;
    age: number;
    address: {
      street: string;
      city: string;
      country: string;
    }

    myAction: () => string;
    constructor(name: string, age: number, street: string, city: string, country: string) {
      this.name = name;
      this.age = age;
      this.address = {
        street: street,
        city: city,
        country: country
      }
      this.myAction = () => {
        return (
          `${this.name}, ${this.age}, ${this.address.city}`
        );
      };
    }
  }
  const person1 = new sav("Savann", 25, "11", "lucca", "australia");


  return (
    // A <div> is a generic container — here it wraps the whole page.

    <div className={styles.page}>

      {/* <main> is a semantic HTML tag that marks the main content area. */}
      <main className={styles.main}>


        <section style={{ margin: '4rem 0', width: '100%' }}>
          <h2 style={{ textAlign: 'left', marginBottom: '2rem' }}>A development Sandbox for coding experiments.</h2>

          {/* 2-column list layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            marginTop: '1.5rem',
          }}>
            {/* Column 1 */}
            <div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 600 }}>🛠 Technologies Used</h3>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '2', color: '#444' }}>
                <li>Next.js (App Router)</li>
                <li>TypeScript</li>
                <li>Databases</li>
                <li>React Server Components</li>
                <li>Suspense & Streaming</li>
                <li>REST APIs & Fetch</li>
                <li>Git & CI/CD</li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 style={{ marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 600 }}>Features & Experiments</h3>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '2', color: '#444' }}>
                <li>AI Chat Integration</li>
                <li>Blog & Article System</li>
                <li>Database Member Mapping</li>
                <li>Dynamic Routing</li>
                <li>3D Slider Component</li>
                <li>Service AI Page</li>
                <li>Secure Authentication</li>
              </ul>
            </div>
          </div>
        </section>



        {/* Introductory text block */}
        <div className={styles.intro}>
          {/* <div>{person1.myAction()}</div> */}


        </div>

        {/* <section style={{ margin: '4rem 0', width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Latest Article</h2>
          <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading article...</div>}>
            <ArticleViewer articleId={2} />
            <AllArticlesViewer />
          </Suspense>
        </section> */}
      </main>

    </div>
  );
}
