// page.tsx — This is the HOME PAGE of your app.
// It's what users see when they visit the root URL: http://localhost:3000/
//
// In Next.js (App Router), every "page.tsx" file inside the /app folder
// automatically becomes a route. This one is at "/" (the homepage).

// We import the Image component from Next.js.
// It's like a regular <img> tag, but smarter — it auto-optimises images.
import Image from "next/image";
import Script from "next/script";

// We import our CSS styles from a "CSS Module" file.
// CSS Modules keep styles scoped to just this component (no name conflicts).
import styles from "../page.module.css";

// This is the Contact component — the main content of the contact page.
// "export default" means this is the main thing exported from this file,
// and Next.js will use it to render the page.
export default function Contact() {
    // "return" sends back the JSX (HTML-like code) that gets displayed on screen.
    return (
        // A <div> is a generic container — here it wraps the whole page.
        <div className={styles.page_contact}>
            {/* <main> is a semantic HTML tag that marks the main content area. */}
            <main className={styles.main}>

                {/* Introductory text block */}
                <div className={styles.intro}>
                    <h1>Get in Touch</h1>
                    <p>
                        Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
                    </p>

                    {/* HubSpot Form Embedding */}
                    <Script src="https://js-ap1.hsforms.net/forms/embed/442933338.js" defer />

                    <div className={styles.hs_form_frame}>
                        <div
                            className="hs-form-frame"
                            data-region="ap1"
                            data-form-id="708b29da-e267-4c9d-bf64-7dfe5e2b0702"
                            data-portal-id="442933338"
                        ></div>
                    </div>
                </div>

            </main>
        </div>
    );
}
