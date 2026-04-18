// ### **1. Transfer (Client → Server)**  
// - Browser wraps the PDF into a **FormData** object.  
// - Sends it via a **secure POST** request to the Next.js server (Server Action).  

// ### **2. Multi‑part Receipt (Server Processing)**  
// - Server **receives the byte stream** of the PDF.  
// - `importPdf` in **ImportPdf.tsx** runs on the **server CPU**, not the browser.  

"use server";

import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";
import { put } from "@vercel/blob";

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
        // Configure worker for Vercel/Serverless stability (Server-side ONLY)
        if (typeof window === "undefined") {
            try {
                const workerPath = path.join(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs");
                if (fs.existsSync(workerPath)) {
                    const workerData = fs.readFileSync(workerPath);
                    const workerBase64 = `data:application/javascript;base64,${workerData.toString("base64")}`;
                    PDFParse.setWorker(workerBase64);
                } else {
                    // Fallback to CDN if for some reason the file is missing
                    PDFParse.setWorker("https://unpkg.com/pdfjs-dist@5.4.296/legacy/build/pdf.worker.min.mjs");
                }
            } catch (e) {
                console.error("Failed to set up PDF worker:", e);
            }
        }

        // Extract bytes from either a file path or an uploaded file
        let bytes: ArrayBuffer;
        let finalUrl: string;

        if (typeof data === "string" && data.startsWith("http")) {
            // Case 1: URL provided (e.g., from client-side Vercel Blob upload)
            console.log(`Fetching PDF from URL: ${data}`);
            const response = await fetch(data);
            if (!response.ok) throw new Error(`Failed to fetch PDF from URL: ${response.statusText}`);
            bytes = await response.arrayBuffer();
            finalUrl = data;
        } else if (data instanceof FormData) {
            // Case 2: FormData provided (traditional upload)
            const file = data.get("file") as File;
            if (!file) throw new Error("No file uploaded");

            // Upload to Vercel Blob for persistence (if not already uploaded)
            const blob = await put(`resumes/${Date.now()}-${file.name}`, file, {
                access: "public",
                addRandomSuffix: true
            });

            console.log(`File uploaded to Vercel Blob: ${blob.url}`);
            bytes = await file.arrayBuffer();
            finalUrl = blob.url;
        } else {
            throw new Error("Invalid data format or missing file");
        }

        console.log(`Processing PDF bytes: ${bytes.byteLength}`);
        if (bytes.byteLength === 0) {
            return { error: "The PDF file is empty." };
        }

        // 3. Parse and return text content with robust settings for serverless environment.
        const parser = new PDFParse({
            data: new Uint8Array(bytes),
            verbosity: 0,
            cMapUrl: "https://unpkg.com/pdfjs-dist@5.4.296/cmaps/",
            cMapPacked: true,
            standardFontDataUrl: "https://unpkg.com/pdfjs-dist@5.4.296/standard_fonts/",
            disableFontFace: true,
        });

        const { text } = await parser.getText();

        console.log(`Successfully parsed PDF (${text.length} characters)`);
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
