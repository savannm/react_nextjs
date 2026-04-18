"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { importPdf, ImportPdfResult } from "./ImportPdf";
import { upload } from "@vercel/blob/client";

export default function GrokResumeAnalyzer() {
    const [resumeText, setResumeText] = useState<string>("");
    const [resumeUrl, setResumeUrl] = useState<string>("");
    const [isParsing, setIsParsing] = useState(false);

    // Grok Chat Integration using your existing /api/chat route
    const { messages, sendMessage, status, setMessages } = useChat({
        transport: new DefaultChatTransport({ api: '/api/chat' }),
    });

    const isAiThinking = status === 'submitted' || status === 'streaming';

    // 1. Handle PDF Upload & Parse
    const handleParse = async (formData: FormData) => {
        setIsParsing(true);
        setMessages([]); // Clear previous analysis
        setResumeText("");
        try {
            const file = formData.get('file') as File;
            if (!file) throw new Error("Please select a file.");

            // 1. Direct Client-Side Upload to Vercel Blob
            // This is more stable on Vercel than passing large files through Server Actions
            const blob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });

            console.log(`Successfully uploaded to Vercel Blob: ${blob.url}`);

            // 2. Send the URL to the server for PDF text extraction & AI analysis
            const result: ImportPdfResult = await importPdf(blob.url);
            
            if (result && result.text) {
                setResumeText(result.text);
                if (result.url) setResumeUrl(result.url);
            } else if (result && result.error) {
                alert(result.error);
            }
        } catch (error: any) {
            console.error("Upload/Parse Error:", error);
            alert(`Failed: ${error.message || "Unknown error"}`);
        } finally {
            setIsParsing(false);
        }
    };

    // 2. Trigger Grok Analysis with a specific Prompt
    const startAnalysis = () => {
        if (!resumeText) return;

        const prompt = `
            You are an expert HR recruitment assistant. 
            Below is the text content from a resume. 
            Please analyze it and provide:
            1. A 3-sentence executive summary.
            2. Top 5 technical skills identified.
            3. A 'Candidate Strength' rating out of 10.
            4. Suggested improvements for the resume.

            RESUME CONTENT:
            ${resumeText.substring(0, 4000)} // Limiting to first 4k chars for prompt safety
        `;

        sendMessage({ text: prompt });
    };

    // Helper: Extract text from AI parts
    const getAiResponse = () => {
        const lastMessage = messages.find(m => m.role === 'assistant');
        if (!lastMessage) return null;
        return lastMessage.parts
            .filter((p: any) => p.type === 'text')
            .map((p: any) => p.text)
            .join('');
    };

    return (
        <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            maxWidth: '800px',
            margin: '20px 0',
            fontFamily: 'inherit'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                    background: '#000',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    letterSpacing: '1px'
                }}>GROK AI</div>
                <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#111' }}>Resume Intelligence</h3>
            </div>

            {/* Step 1: Upload */}
            {!resumeText && (
                <form action={handleParse} style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '16px',
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: '#f9fafb',
                    transition: 'all 0.2s ease'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📄</div>
                    <p style={{ color: '#4b5563', marginBottom: '20px', fontWeight: 500 }}>
                        Select a resume PDF to begin analysis
                    </p>
                    <input
                        type="file"
                        name="file"
                        accept=".pdf"
                        required
                        style={{ marginBottom: '20px', display: 'block', margin: '0 auto 20px' }}
                    />
                    <button
                        type="submit"
                        disabled={isParsing}
                        style={{
                            background: '#0070f3',
                            color: 'white',
                            padding: '12px 32px',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: isParsing ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            fontSize: '1rem',
                            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)'
                        }}
                    >
                        {isParsing ? "Reading Data..." : "Upload & Parse"}
                    </button>
                </form>
            )}

            {/* Step 2: Analysis Action */}
            {resumeText && !getAiResponse() && (
                <div style={{
                    textAlign: 'center',
                    padding: '30px',
                    background: '#f0fdf4',
                    borderRadius: '16px',
                    border: '1px solid #bbf7d0'
                }}>
                    <p style={{ color: '#166534', fontSize: '1rem', marginBottom: '20px', fontWeight: 600 }}>
                        ✅ Resume parsed successfully
                    </p>
                    <button
                        onClick={startAnalysis}
                        disabled={isAiThinking}
                        style={{
                            background: '#000',
                            color: '#fff',
                            padding: '14px 40px',
                            borderRadius: '50px',
                            border: 'none',
                            cursor: isAiThinking ? 'not-allowed' : 'pointer',
                            fontWeight: 700,
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            margin: '0 auto',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {isAiThinking ? "Grok is analyzing..." : "⚡ Run Grok Analysis"}
                    </button>
                    <button
                        onClick={() => setResumeText("")}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#6b7280',
                            marginTop: '15px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            textDecoration: 'underline'
                        }}
                    >
                        Upload different file
                    </button>
                </div>
            )}

            {/* Result Area */}
            {getAiResponse() && (
                <div style={{
                    marginTop: '10px',
                    padding: '24px',
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    maxHeight: '600px',
                    overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h4 style={{ margin: 0, color: '#111', fontSize: '1.1rem' }}>Grok Insights:</h4>
                        <button
                            onClick={() => { setMessages([]); setResumeText(""); }}
                            style={{ background: '#f3f4f6', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Reset
                        </button>
                    </div>
                    <div style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.7',
                        color: '#374151',
                        fontSize: '1rem'
                    }}>
                        {getAiResponse()}
                        {isAiThinking && <span style={{ opacity: 0.5 }}>...</span>}
                    </div>
                </div>
            )}
        </div>
    );
}
