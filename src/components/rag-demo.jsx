import { useState, useRef } from "react";

// ── Tiny in-memory "vector store" using cosine similarity on TF-IDF-style bag-of-words ──
function tokenize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
}

function buildVector(tokens, vocab) {
    const freq = {};
    tokens.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
    return vocab.map(v => freq[v] || 0);
}

function cosineSim(a, b) {
    const dot = a.reduce((s, v, i) => s + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    return magA && magB ? dot / (magA * magB) : 0;
}

const DOCS = [
    { id: 1, title: "React Hooks Guide", content: "useState is a React hook that lets you add state to functional components. It returns an array with the current state value and a setter function. useEffect runs side effects after rendering, such as fetching data or subscribing to events. useRef creates a mutable reference that persists across renders without triggering re-renders." },
    { id: 2, title: "Node.js Basics", content: "Node.js is a JavaScript runtime built on Chrome's V8 engine. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. npm is the Node package manager used to install libraries. Express.js is a popular framework for building REST APIs with Node.js." },
    { id: 3, title: "CSS Grid Layout", content: "CSS Grid is a two-dimensional layout system. You define a grid container with display: grid, then place items using grid-template-columns and grid-template-rows. The gap property controls spacing between cells. Grid areas allow you to name regions for semantic layout." },
    { id: 4, title: "TypeScript Intro", content: "TypeScript adds static types to JavaScript. You define types with interfaces or type aliases. Generics allow reusable typed components. TypeScript catches type errors at compile time before they reach production. It compiles down to plain JavaScript that runs anywhere." },
    { id: 5, title: "REST API Design", content: "REST APIs use HTTP verbs: GET retrieves data, POST creates resources, PUT updates them, DELETE removes them. Status codes communicate outcomes: 200 OK, 201 Created, 404 Not Found, 500 Server Error. Endpoints should be noun-based and represent resources, not actions." },
];

// Build vocab and vectors once
const allTokens = DOCS.flatMap(d => tokenize(d.title + " " + d.content));
const VOCAB = [...new Set(allTokens)];
const DOC_VECTORS = DOCS.map(d => ({
    ...d,
    vec: buildVector(tokenize(d.title + " " + d.content), VOCAB),
}));

function retrieve(query, topK = 2) {
    const qVec = buildVector(tokenize(query), VOCAB);
    return DOC_VECTORS
        .map(d => ({ ...d, score: cosineSim(qVec, d.vec) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}

// ── UI ──
const STEPS = ["idle", "retrieving", "augmenting", "generating", "done"];

const STEP_LABELS = {
    retrieving: "Searching knowledge base…",
    augmenting: "Building context prompt…",
    generating: "Generating answer…",
    done: "Done",
};

export default function RAGDemo() {
    const [query, setQuery] = useState("");
    const [step, setStep] = useState("idle");
    const [retrieved, setRetrieved] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState("");
    const [streaming, setStreaming] = useState("");
    const abortRef = useRef(null);

    async function runRAG() {
        if (!query.trim()) return;
        setStep("retrieving");
        setRetrieved([]);
        setPrompt("");
        setAnswer("");
        setError("");
        setStreaming("");

        await delay(600);

        // 1. Retrieve
        const hits = retrieve(query, 2);
        setRetrieved(hits);
        setStep("augmenting");
        await delay(500);

        // 2. Build augmented prompt
        const context = hits.map((h, i) =>
            `[Doc ${i + 1}: ${h.title}]\n${h.content}`
        ).join("\n\n");

        const systemPrompt = `You are a helpful assistant. Answer the user's question using ONLY the provided context documents. Be concise and cite which document supports your answer.`;
        const userMsg = `Context:\n${context}\n\nQuestion: ${query}`;
        setPrompt(userMsg);
        setStep("generating");
        await delay(300);

        // 3. Call Claude API
        try {
            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system: systemPrompt,
                    messages: [{ role: "user", content: userMsg }],
                }),
            });

            const data = await res.json();
            const text = data.content?.map(b => b.text || "").join("") || "No response.";
            setAnswer(text);
            setStep("done");
        } catch (e) {
            setError("API error: " + e.message);
            setStep("done");
        }
    }

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    const isRunning = step !== "idle" && step !== "done";

    return (
        <div style={{
            minHeight: "",
            background: "#0b0e14",
            fontFamily: "'Courier New', monospace",
            color: "#e2e8f0",
            padding: "2rem",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        .title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; letter-spacing: -1px; }
        .subtitle { color: #64748b; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 2rem; }
        .mono { font-family: 'Space Mono', monospace; }
        .panel {
          background: #131722;
          border: 1px solid #1e2535;
          border-radius: 8px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1rem;
        }
        .panel-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #475569;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #334155;
          flex-shrink: 0;
        }
        .dot.active { background: #22d3ee; box-shadow: 0 0 6px #22d3ee; }
        .dot.done { background: #4ade80; }
        input[type=text] {
          width: 100%;
          background: #0b0e14;
          border: 1px solid #1e2535;
          border-radius: 6px;
          color: #e2e8f0;
          padding: 0.75rem 1rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }
        input[type=text]:focus { border-color: #22d3ee; }
        button {
          background: #22d3ee;
          color: #0b0e14;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.5rem;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          margin-top: 0.75rem;
          letter-spacing: 1px;
          transition: opacity 0.2s;
        }
        button:disabled { opacity: 0.4; cursor: not-allowed; }
        button:hover:not(:disabled) { opacity: 0.85; }
        .chip {
          display: inline-block;
          background: #1e2535;
          border: 1px solid #2d3a50;
          border-radius: 4px;
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
          color: #94a3b8;
          margin: 0.2rem;
        }
        .score { color: #22d3ee; }
        .answer-text {
          color: #cbd5e1;
          font-size: 0.85rem;
          line-height: 1.7;
          white-space: pre-wrap;
        }
        .flow-steps {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        .flow-step {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 0.3rem 0.7rem;
          border-radius: 4px;
          border: 1px solid #1e2535;
          color: #334155;
          transition: all 0.3s;
        }
        .flow-step.active {
          border-color: #22d3ee;
          color: #22d3ee;
          background: rgba(34,211,238,0.07);
        }
        .flow-step.done-step {
          border-color: #4ade80;
          color: #4ade80;
          background: rgba(74,222,128,0.05);
        }
        .doc-card {
          background: #0b0e14;
          border: 1px solid #1e2535;
          border-radius: 6px;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
        }
        .doc-title { color: #22d3ee; font-size: 0.75rem; margin-bottom: 0.35rem; }
        .doc-snippet { color: #64748b; font-size: 0.72rem; line-height: 1.5; }
        .kb-list {
          display: flex; flex-wrap: wrap; gap: 0.4rem;
          margin-top: 0.5rem;
        }
        .kb-tag {
          font-size: 0.68rem;
          background: #1e2535;
          border-radius: 4px;
          padding: 0.25rem 0.6rem;
          color: #94a3b8;
        }
        .pulse { animation: pulse 1.2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .error { color: #f87171; font-size: 0.8rem; }
        .separator { border-color: #1e2535; margin: 1rem 0; }
      `}</style>

            <div style={{ maxWidth: 720, margin: "0 auto" }}>
                <div className="title">RAG <span style={{ color: "#22d3ee" }}>Pipeline</span></div>
                <div className="subtitle">Retrieval-Augmented Generation — Live Demo</div>

                {/* Flow indicator */}
                <div className="flow-steps">
                    {["Query", "Retrieve", "Augment", "Generate", "Answer"].map((s, i) => {
                        const stepMap = ["idle", "retrieving", "augmenting", "generating", "done"];
                        const idx = STEPS.indexOf(step);
                        const isDone = idx > i;
                        const isActive = idx === i;
                        return (
                            <div key={s} className={`flow-step ${isActive ? "active" : ""} ${isDone ? "done-step" : ""}`}>
                                {i + 1}. {s}
                            </div>
                        );
                    })}
                </div>

                {/* Knowledge Base */}
                <div className="panel">
                    <div className="panel-label"><span className="dot done" />Knowledge Base (5 documents)</div>
                    <div className="kb-list">
                        {DOCS.map(d => <span key={d.id} className="kb-tag">{d.title}</span>)}
                    </div>
                </div>

                {/* Query input */}
                <div className="panel">
                    <div className="panel-label"><span className={`dot ${step === "idle" || step === "done" ? "" : "active"}`} />Your Question</div>
                    <input
                        type="text"
                        placeholder="e.g. How do I fetch data in React? What HTTP verbs does REST use?"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && !isRunning && runRAG()}
                        disabled={isRunning}
                    />
                    <button onClick={runRAG} disabled={isRunning || !query.trim()}>
                        {isRunning ? "Running…" : "Run RAG →"}
                    </button>
                </div>

                {/* Retrieved docs */}
                {(step === "augmenting" || step === "generating" || step === "done") && retrieved.length > 0 && (
                    <div className="panel">
                        <div className="panel-label"><span className="dot done" />Retrieved Chunks (top {retrieved.length} by cosine similarity)</div>
                        {retrieved.map((doc, i) => (
                            <div key={doc.id} className="doc-card">
                                <div className="doc-title">
                                    {i + 1}. {doc.title} — <span className="score">score: {doc.score.toFixed(3)}</span>
                                </div>
                                <div className="doc-snippet">{doc.content.slice(0, 120)}…</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Augmented prompt preview */}
                {(step === "generating" || step === "done") && prompt && (
                    <div className="panel">
                        <div className="panel-label">
                            <span className={`dot ${step === "generating" ? "active pulse" : "done"}`} />
                            Augmented Prompt (sent to Claude)
                        </div>
                        <div style={{
                            background: "#0b0e14",
                            border: "1px solid #1e2535",
                            borderRadius: 6,
                            padding: "0.75rem 1rem",
                            fontSize: "0.7rem",
                            color: "#475569",
                            maxHeight: 140,
                            overflowY: "auto",
                            whiteSpace: "pre-wrap",
                            lineHeight: 1.5,
                        }}>
                            {prompt}
                        </div>
                    </div>
                )}

                {/* Answer */}
                {step === "done" && (
                    <div className="panel">
                        <div className="panel-label"><span className="dot done" />Generated Answer</div>
                        {error
                            ? <div className="error">{error}</div>
                            : <div className="answer-text">{answer}</div>
                        }
                    </div>
                )}

                {/* Live status */}
                {isRunning && (
                    <div style={{ color: "#22d3ee", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="pulse">▶</span> {STEP_LABELS[step]}
                    </div>
                )}
            </div>
        </div>
    );
}
