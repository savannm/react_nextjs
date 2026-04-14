
// We import our CSS styles from a "CSS Module" file.
// CSS Modules keep styles scoped to just this component (no name conflicts).
import styles from "../page.module.css";

// This is the ServiceAi page.
// Note: AiChat is already rendered globally via layout.tsx — no need to add it here.
export default function Service() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                {/* Introductory text block */}
                <div className={styles.intro}>
                    <h1>Service AI</h1>
                    <p>Experience our beautiful AI interface below.</p>
                </div>
            </main>
        </div>
    );
}
