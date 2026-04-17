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
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

// Configure worker once at module level
pdfjs.GlobalWorkerOptions.workerSrc = path.resolve("node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs");

/**
 * Simplified Server Action to parse a PDF from a path or an upload.
 */

export async function importPdf(data: string | FormData) {
    console.log("Sav");
    try {
        // Extract bytes from either a file path or an uploaded file
        const bytes = typeof data === "string"
            ? fs.readFileSync(path.resolve(data))
            : await (data.get("file") as File).arrayBuffer();

        // Parse and return text content
        const { text } = await new PDFParse({ data: new Uint8Array(bytes) }).getText();

        console.log(`Successfully parsed PDF (${text.length} characters)`);
        return { text };
    } catch (error: any) {
        console.error("PDF Import Error:", error.message);
        return { error: "Failed to process PDF" };
    }
}

import { saveResume } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
