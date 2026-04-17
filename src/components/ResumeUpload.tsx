"use client";

import { useState } from "react";
// Import the Server Actions (these are the safe "bridges" to your database)
import { importPdf, saveResumeAction } from "./ImportPdf";

export default function ResumeUpload() {
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // 1. Logic for Uploading/Parsing PDF
    async function handleUpload(formData: FormData) {
        setLoading(true);
        try {
            const result = await importPdf(formData);
            if (result && "text" in result && result.text) {
                // Append text so multiple uploads can be saved together
                setText((prev) => prev + result.text);
            } else if (result && "error" in result) {
                alert(result.error);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Something went wrong during local file processing.");
        } finally {
            setLoading(false);
        }
    }

    // 2. Logic for Saving to Database
    async function handleSave() {
        if (!text) return;
        setLoading(true);
        try {
            // Call the Server Action (which securely runs on the server)
            const result = await saveResumeAction(text);
            if (result.success) {
                alert("Resume saved successfully!");
            } else {
                alert(result.error || "Failed to save to database.");
            }
        } catch (error) {
            console.error("Save failed:", error);
            alert("Database error. Check your server logs.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ width: '100%' }}>
            {/* Upload Section */}
            <form action={handleUpload}>
                <input
                    type="file"
                    name="file"
                    accept=".pdf"
                    required
                    style={{
                        marginBottom: '10px',
                        display: 'block',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        width: '100%'
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: loading ? '#ccc' : '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    {loading ? "Parsing PDF..." : "Step 1: Upload & Parse PDF"}
                </button>
            </form>
            {text && (
                <div>
                    {/* The Save Button calls the handleSave function above */}
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        style={{
                            marginTop: '15px',
                            padding: '10px 20px',
                            backgroundColor: loading ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            width: '100%'
                        }}
                    >
                        {loading ? "Saving..." : "Step 2: Save Extracted Text to Database"}
                    </button>
                </div>
            )}

            {/* Results & Save Section */}
            {text && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    background: '#f4f4f4',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                        Extracted Content:
                    </h4>
                    <pre style={{
                        whiteSpace: 'pre-wrap',
                        fontSize: '13px',
                        lineHeight: '1.5',
                        fontFamily: 'inherit',
                        color: '#333'
                    }}>
                        {text}
                    </pre>
                </div>
            )}
        </div>
    );
}
