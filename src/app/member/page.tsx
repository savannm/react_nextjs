import Memberinfo from '@/components/AddMemberGet';
// We import the Image component from Next.js.
// It's like a regular <img> tag, but smarter — it auto-optimises images.
import Image from "next/image";

// We import our CSS styles from a "CSS Module" file.
// CSS Modules keep styles scoped to just this component (no name conflicts).
import styles from "../page.module.css";



export default function Members() {
    // "return" sends back the JSX (HTML-like code) that gets displayed on screen.
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
                    <h1>Members Page</h1>
                    {/* AddMemberGet fetches data from the database. 
                        It defaults to "Zax Max" if no username is passed. */}
                    <Memberinfo />
                </div>

                {/* Call-to-action buttons */}
                <div className={styles.ctas}>
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
