'use client';

// We import our CSS styles from a "CSS Module" file.
// CSS Modules keep styles scoped to just this component (no name conflicts).
import styles from "../page.module.css";
// import GoogleMaps from '@/components/GoogleMaps'

// This is the ReactReference component — the main content of the react page.
// "export default" means this is the main thing exported from this file,
// and Next.js will use it to render the page.
export default function GoogleMapsPage() {
    // "return" sends back the JSX (HTML-like code) that gets displayed on screen.
    return (
        // A <div> is a generic container — here it wraps the whole page.
        <div>
            {/* <GoogleMaps /> */}
        </div>
    );
}
