// page.tsx — This is the HOME PAGE of your app.
// It's what users see when they visit the root URL: http://localhost:3000/
//
// In Next.js (App Router), every "page.tsx" file inside the /app folder
// automatically becomes a route. This one is at "/" (the homepage).

// We import the Image component from Next.js.
// It's like a regular <img> tag, but smarter — it auto-optimises images.
import Image from "next/image";
import { Suspense } from "react";

// ArticleViewer is a Server Component that fetches from two data sources.
import ArticleViewer from "@/components/ArticleViewer";
import AllArticlesViewer from "@/components/DatabaseMapAll";

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
    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
      this.address = {
        street: "123 Main St",
        city: "Town",
        country: "USA"
      }
      this.myAction = () => {
        return (
          `${this.age} and ${this.address.city}`
        );
      };
    }
  }
  const person1 = new sav("Savann", 25);





  return (
    // A <div> is a generic container — here it wraps the whole page.

    <div className={styles.page}>

      {/* <main> is a semantic HTML tag that marks the main content area. */}
      <main className={styles.main}>

        {/* The Next.js logo image */}
        <Image
          className={styles.logo}
          src="/next.svg"         // Path to the image in the /public folder
          alt="Next.js logo"      // Alt text for accessibility (screen readers)
          width={100}             // Display width in pixels
          height={20}             // Display height in pixels
          priority                // Load this image immediately (above the fold)
        />

        {/* Introductory text block */}
        <div className={styles.intro}>
          <div>{person1.myAction()}</div>
          <h1>Welcome to Next.js!</h1>
          <p>
            Edit <code>src/app/page.tsx</code> to get started.
          </p>
        </div>

        <section style={{ margin: '4rem 0', width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Latest Article</h2>
          <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading article...</div>}>
            <ArticleViewer articleId={2} />
            <AllArticlesViewer />
          </Suspense>
        </section>

        {/* Call-to-action buttons */}
        <div className={styles.ctas}>

          {/* Primary button — links to Vercel deployment */}
          <a
            className={styles.primary}
            href="https://vercel.com/new"
            target="_blank"           // Opens in a new browser tab
            rel="noopener noreferrer" // Security best practice for external links
          >
            {/* The Vercel logo image inside the button */}
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>

          {/* Secondary button — links to the Next.js docs */}
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>

        </div>
      </main>

    </div>
  );
}
