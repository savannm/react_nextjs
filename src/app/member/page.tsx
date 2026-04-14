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

                {/* Introductory text block */}
                <div className={styles.intro}>
                    <h1>Members Page</h1>
                    {/* AddMemberGet fetches data from the database. 
                        It defaults to "Zax Max" if no username is passed. */}
                    <Memberinfo username="Zax Max" />
                </div>
            </main>

        </div>
    );
}
