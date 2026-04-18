"use server";

// Polyfills for PDF.js in Node.js environment (fixes ReferenceError: DOMMatrix is not defined)
if (typeof window === "undefined") {
    (global as any).DOMMatrix = (global as any).DOMMatrix || class DOMMatrix {
        constructor() { }
    };
    (global as any).DOMPoint = (global as any).DOMPoint || class DOMPoint {
        constructor() { }
    };
    (global as any).DOMRect = (global as any).DOMRect || class DOMRect {
        constructor() { }
    };
    (global as any).Path2D = (global as any).Path2D || class Path2D {
        constructor() { }
    };
}

// Removed static import to prevent 'ReferenceError' during module evaluation
// import { PDFParse } from "pdf-parse";

import { saveResume } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Result type for the PDF import process.
 */
export type ImportPdfResult = {
    text?: string;
    url?: string;
    error?: string;
};

/**
 * Simplified Server Action to parse a PDF from a path or an upload.
 */
export async function importPdf(data: string | FormData): Promise<ImportPdfResult> {
    try {
        // Dynamically import PDFParse to ensure polyfills above are applied first
        // @ts-ignore
        const pdfParseModule: any = await import("pdf-parse");
        const PDFParse = pdfParseModule.PDFParse || pdfParseModule.default?.PDFParse || pdfParseModule.default;

        // 1. Worker Setup
        console.log("Step 1: Setting up PDF Worker...");
        if (typeof window === "undefined") {
            try {
                // @ts-ignore
                const worker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
                PDFParse.setWorker(worker as any);
                console.log("Worker setup successful.");
            } catch (e: any) {
                console.error("Worker setup failed:", e.message);
                PDFParse.setWorker("https://unpkg.com/pdfjs-dist@5.4.296/legacy/build/pdf.worker.min.mjs");
            }
        }

        // 2. Data Extraction
        console.log("Step 2: Extracting PDF data...");
        let bytes: ArrayBuffer;
        let finalUrl: string;

        if (typeof data === "string" && data.startsWith("http")) {
            console.log(`Fetching from URL: ${data}`);
            const response = await fetch(data);
            if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
            bytes = await response.arrayBuffer();
            finalUrl = data;
        } else if (data instanceof (global as any).FormData || (data && (data as any).get)) {
            const file = (data as any).get("file") as any;
            if (!file) throw new Error("No file uploaded");
            bytes = await file.arrayBuffer();
            finalUrl = "local-upload";
        } else {
            throw new Error("Invalid input format");
        }

        // 3. Parsing
        console.log(`Step 3: Parsing PDF bits (${bytes.byteLength} bytes)...`);
        const parser = new PDFParse({
            data: new Uint8Array(bytes),
            verbosity: 0,
            cMapUrl: "https://unpkg.com/pdfjs-dist@5.4.296/cmaps/",
            cMapPacked: true,
            standardFontDataUrl: "https://unpkg.com/pdfjs-dist@5.4.296/standard_fonts/",
            disableFontFace: true,
        });

        const { text } = await parser.getText();
        console.log(`Parsing successful: ${text.length} chars found.`);

        // 4. Session & Save
        console.log("Step 4: Checking session...");
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            console.log(`Saving resume for: ${session.user.email}`);
            await saveResume(session.user.email, text);
        }

        return { text, url: finalUrl };
    } catch (error: any) {
        console.error("PDF Import error details:", error);
        return { error: `PDF Processing Error: ${error.message || "Unknown error"}` };
    }
}



/**
 * Server Action to save parsed resume text to the database.
 */
export async function saveResumeAction(content: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { error: "You must be logged in to save a resume." };
    }

    const success = await saveResume(session.user.email, content);

    if (success) {
        return { success: true };
    } else {
        return { error: "Failed to save resume to the database." };
    }
}
