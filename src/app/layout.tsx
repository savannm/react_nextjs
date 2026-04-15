// layout.tsx — This is the ROOT LAYOUT file.
// Every page in your app is wrapped inside this layout.
// Think of it like a "picture frame" — the frame stays the same,
// but the picture (page content) changes.

// We're importing the Metadata type from Next.js.
// This lets us define things like the browser tab title and description.
import type { Metadata } from "next";

//authentication
//authentication
import { AuthProviders } from '@/components/AuthProviders';
import AuthButton from '@/components/Auth';

// Import our Navbar component so we can use it in the layout.
// Any component you create goes in src/components/ by convention.
import Navbar from "@/components/Navbar";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";

//AICHAT
import AiChat from '@/components/AiChat';


// We're importing two Google Fonts to use across the whole app.
// Geist is for regular text, Geist Mono is for code-style text.
import { Geist, Geist_Mono } from "next/font/google";

// Import our global styles (CSS that applies to every page).
import "./globals.css";

// Set up the Geist font and give it a CSS variable name.
// The variable name lets us reference this font in CSS with "--font-geist-sans".
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"], // Only load the characters we need (Latin alphabet)
});

// Same thing for the monospace font.
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// This object sets the metadata for our site (shown in browser tabs & search engines).
export const metadata: Metadata = {
    title: "Experience Dev",
    description: "An experimental web project",
};

// This is the Root Layout component.
// "children" refers to the content of whatever page the user is currently on.
// The type annotation tells TypeScript that children must be valid React content.
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // The outermost HTML tag. We set lang="en" for accessibility (screen readers).
        // We pass the font variables as class names so CSS can use them.
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>

            {/* The body tag wraps all visible content. */}
            {/* suppressHydrationWarning prevents hydration errors from browser extensions adding classes to body */}
            <body suppressHydrationWarning>
                <AuthProviders>
                    {/* Dismissable announcement banner — sits above the Navbar */}
                    <TopBanner />
                    <Navbar />
                    <div style={{ textAlign: 'right', padding: '10px 40px', backgroundColor: '#000' }}>
                        <AuthButton />
                    </div>
                    <AiChat />
                    <main>{children}</main>
                    <Footer />
                </AuthProviders>
            </body>
        </html >
    );
}
