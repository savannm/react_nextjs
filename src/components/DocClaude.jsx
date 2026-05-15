import { useState } from "react";

const steps = [
  {
    phase: "01 — Prerequisites",
    color: "#7DF9AA",
    items: [
      {
        id: "pre-1",
        task: "Create an Anthropic account",
        detail: "Visit console.anthropic.com → sign up or log in",
        tag: "Account",
      },
      {
        id: "pre-2",
        task: "Generate an API key",
        detail: "Console → API Keys → Create Key → copy and store securely in .env.local",
        tag: "Config",
      },
      {
        id: "pre-3",
        task: "Confirm Node.js ≥ 18",
        detail: "Run: node -v. Upgrade via nvm if needed.",
        tag: "System",
      },
    ],
  },
  {
    phase: "02 — Project Setup",
    color: "#A0C4FF",
    items: [
      {
        id: "setup-1",
        task: "Scaffold your app",
        detail: "React: npx create-react-app my-app --template typescript\nNext.js: npx create-next-app@latest my-app --typescript --app",
        tag: "Init",
      },
      {
        id: "setup-2",
        task: "Install Anthropic SDK",
        detail: "npm install @anthropic-ai/sdk",
        tag: "Package",
      },
      {
        id: "setup-3",
        task: "Install Vercel AI SDK (optional but recommended)",
        detail: "npm install ai — provides useChat / useCompletion hooks for streaming",
        tag: "Package",
      },
      {
        id: "setup-4",
        task: "Set environment variables",
        detail: ".env.local → ANTHROPIC_API_KEY=sk-ant-...\nNext.js: prefix with NEXT_PUBLIC_ only if needed client-side (avoid leaking keys!)",
        tag: "Config",
      },
    ],
  },
  {
    phase: "03 — API Route / Backend",
    color: "#FFD6A5",
    items: [
      {
        id: "api-1",
        task: "Create an API route",
        detail: "Next.js App Router: app/api/chat/route.ts\nReact (CRA): use a proxy server with Express or Vite",
        tag: "Backend",
      },
      {
        id: "api-2",
        task: "Initialise the Anthropic client",
        detail: "import Anthropic from '@anthropic-ai/sdk'\nconst client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })",
        tag: "Backend",
      },
      {
        id: "api-3",
        task: "Call claude-sonnet-4-20250514 (latest)",
        detail: "Use client.messages.create({ model, max_tokens, messages }) — or stream via client.messages.stream()",
        tag: "Backend",
      },
      {
        id: "api-4",
        task: "Return a streaming response",
        detail: "Wrap with ReadableStream and return new Response(stream) — Vercel AI SDK handles this automatically",
        tag: "Backend",
      },
    ],
  },
  {
    phase: "04 — Vector Database (choose one)",
    color: "#FFC6FF",
    items: [
      {
        id: "vec-1",
        task: "Option A — Third-party: Pinecone",
        detail: "npm install @pinecone-database/pinecone\nCreate index in Pinecone console → set PINECONE_API_KEY + PINECONE_INDEX in .env",
        tag: "3rd Party",
      },
      {
        id: "vec-2",
        task: "Option B — Third-party: Supabase pgvector",
        detail: "npm install @supabase/supabase-js\nEnable pgvector extension in Supabase dashboard → CREATE TABLE docs (embedding vector(1536))",
        tag: "3rd Party",
      },
      {
        id: "vec-3",
        task: "Option C — Third-party: Weaviate Cloud",
        detail: "npm install weaviate-ts-client\nCreate a free Weaviate Cloud cluster → set WEAVIATE_HOST + WEAVIATE_API_KEY",
        tag: "3rd Party",
      },
      {
        id: "vec-4",
        task: "Option D — Self-hosted: Chroma (local dev)",
        detail: "pip install chromadb && chroma run\nnpm install chromadb — ideal for local RAG prototyping",
        tag: "Self-hosted",
      },
      {
        id: "vec-5",
        task: "Option E — Self-created: in-memory JS store",
        detail: "Build a simple cosine-similarity store: store embeddings as Float32Array[], implement cosineSim(a, b) for top-k retrieval",
        tag: "Custom",
      },
    ],
  },
  {
    phase: "05 — Embeddings & RAG Pipeline",
    color: "#CAFFBF",
    items: [
      {
        id: "rag-1",
        task: "Generate embeddings",
        detail: "Use OpenAI text-embedding-3-small (1536-d) or Cohere embed-english-v3.0 — Anthropic does not yet expose an embeddings API",
        tag: "Embeddings",
      },
      {
        id: "rag-2",
        task: "Chunk your documents",
        detail: "Split text into ~500 token chunks with 50-token overlap. Use langchain/text-splitter or a custom recursive splitter.",
        tag: "Data Prep",
      },
      {
        id: "rag-3",
        task: "Index chunks into your vector DB",
        detail: "Loop over chunks → embed each → upsert { id, values, metadata } into Pinecone / pgvector / Chroma",
        tag: "Indexing",
      },
      {
        id: "rag-4",
        task: "Query pipeline: embed → search → augment prompt",
        detail: "At query time: embed user query → top-k similarity search → inject results as context into Claude system prompt",
        tag: "RAG",
      },
      {
        id: "rag-5",
        task: "Pass retrieved context to Claude",
        detail: "system: `You are a helpful assistant. Use this context:\\n${context}` → user: question",
        tag: "RAG",
      },
    ],
  },
  {
    phase: "06 — Frontend UI",
    color: "#FDFFB6",
    items: [
      {
        id: "ui-1",
        task: "Build a chat component",
        detail: "Use Vercel AI SDK's useChat() hook — handles messages state, loading, streaming out of the box",
        tag: "UI",
      },
      {
        id: "ui-2",
        task: "Render Markdown from Claude",
        detail: "npm install react-markdown remark-gfm — wrap assistant messages in <ReactMarkdown>",
        tag: "UI",
      },
      {
        id: "ui-3",
        task: "Add streaming indicators",
        detail: "Show a pulsing dot while isLoading === true from useChat",
        tag: "UI",
      },
      {
        id: "ui-4",
        task: "Handle errors gracefully",
        detail: "Catch API errors → display user-friendly message → log to console/Sentry",
        tag: "UI",
      },
    ],
  },
  {
    phase: "07 — Security & Best Practices",
    color: "#FFADAD",
    items: [
      {
        id: "sec-1",
        task: "Never expose ANTHROPIC_API_KEY client-side",
        detail: "All Claude API calls must go through a server route. Never use NEXT_PUBLIC_ prefix on secret keys.",
        tag: "Security",
      },
      {
        id: "sec-2",
        task: "Rate-limit your API route",
        detail: "npm install @upstash/ratelimit @upstash/redis — or use Vercel's built-in edge middleware",
        tag: "Security",
      },
      {
        id: "sec-3",
        task: "Validate and sanitize user input",
        detail: "Strip excessive whitespace, cap message length, reject prompt-injection patterns before forwarding to Claude",
        tag: "Security",
      },
      {
        id: "sec-4",
        task: "Add .env.local to .gitignore",
        detail: "Double-check: git status should never show .env.local as tracked",
        tag: "Security",
      },
    ],
  },
  {
    phase: "08 — Deploy",
    color: "#BDB2FF",
    items: [
      {
        id: "dep-1",
        task: "Deploy to Vercel",
        detail: "vercel deploy — add ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables",
        tag: "Deploy",
      },
      {
        id: "dep-2",
        task: "Configure serverless function timeout",
        detail: "Streaming responses may exceed 10s default. Set maxDuration = 60 in your route.ts for Vercel Pro.",
        tag: "Deploy",
      },
      {
        id: "dep-3",
        task: "Test end-to-end in production",
        detail: "Verify streaming, RAG retrieval latency, and error handling under real network conditions",
        tag: "Deploy",
      },
    ],
  },
];

const tagColors = {
  Account: "#7DF9AA22",
  Config: "#A0C4FF22",
  System: "#FFD6A522",
  Init: "#CAFFBF22",
  Package: "#FFC6FF22",
  Backend: "#A0C4FF22",
  "3rd Party": "#FFD6A522",
  "Self-hosted": "#FDFFB622",
  Custom: "#CAFFBF22",
  Embeddings: "#FFC6FF22",
  "Data Prep": "#FFADAD22",
  Indexing: "#BDB2FF22",
  RAG: "#7DF9AA22",
  UI: "#A0C4FF22",
  Security: "#FFADAD22",
  Deploy: "#BDB2FF22",
};

const tagBorder = {
  Account: "#7DF9AA",
  Config: "#A0C4FF",
  System: "#FFD6A5",
  Init: "#CAFFBF",
  Package: "#FFC6FF",
  Backend: "#A0C4FF",
  "3rd Party": "#FFD6A5",
  "Self-hosted": "#FDFFB6",
  Custom: "#CAFFBF",
  Embeddings: "#FFC6FF",
  "Data Prep": "#FFADAD",
  Indexing: "#BDB2FF",
  RAG: "#7DF9AA",
  UI: "#A0C4FF",
  Security: "#FFADAD",
  Deploy: "#BDB2FF",
};

export default function ClaudeApp() {
  const allIds = steps.flatMap((s) => s.items.map((i) => i.id));
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const totalDone = allIds.filter((id) => checked[id]).length;
  const pct = Math.round((totalDone / allIds.length) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e8e8f0",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      padding: "40px 20px 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Space+Grotesk:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .item-row { cursor: pointer; transition: background 0.15s; border-radius: 6px; }
        .item-row:hover { background: #ffffff08; }
        .check-box {
          width: 20px; height: 20px; border-radius: 4px;
          border: 2px solid #444; background: transparent;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.2s; cursor: pointer;
        }
        .check-box.done { border-color: #7DF9AA; background: #7DF9AA22; }
        .check-tick { color: #7DF9AA; font-size: 13px; }
        .detail-box {
          background: #12121a; border-left: 2px solid #333;
          padding: 10px 14px; margin: 6px 0 4px 32px;
          font-size: 12px; line-height: 1.7; color: #999;
          border-radius: 0 4px 4px 0; white-space: pre-wrap;
        }
        .progress-bar-fill { transition: width 0.4s ease; }
        .phase-header { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ marginBottom: 8, fontSize: 11, color: "#555", letterSpacing: "0.15em" }}>
          ANTHROPIC / REACT / NEXT.JS / VECTOR DB
        </div>
        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(22px, 4vw, 36px)",
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.2,
          marginBottom: 8,
        }}>
          Claude AI Integration<br />
          <span style={{ color: "#7DF9AA" }}>Activity Checklist</span>
        </h1>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 32 }}>
          {totalDone}/{allIds.length} tasks complete · click any task to expand details
        </p>

        {/* Progress */}
        <div style={{
          background: "#111",
          border: "1px solid #222",
          borderRadius: 8,
          padding: "16px 20px",
          marginBottom: 40,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ height: 6, background: "#1e1e2e", borderRadius: 3, overflow: "hidden" }}>
              <div
                className="progress-bar-fill"
                style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, #7DF9AA, #A0C4FF)", borderRadius: 3 }}
              />
            </div>
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#7DF9AA", minWidth: 52, textAlign: "right" }}>
            {pct}%
          </span>
        </div>

        {/* Steps */}
        {steps.map((section) => {
          const sectionDone = section.items.filter((i) => checked[i.id]).length;
          return (
            <div key={section.phase} style={{ marginBottom: 36 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 14,
              }}>
                <div style={{ width: 3, height: 20, background: section.color, borderRadius: 2, flexShrink: 0 }} />
                <h2 className="phase-header" style={{ fontSize: 13, fontWeight: 700, color: section.color, letterSpacing: "0.12em" }}>
                  {section.phase}
                </h2>
                <span style={{ fontSize: 11, color: "#444", marginLeft: "auto" }}>
                  {sectionDone}/{section.items.length}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {section.items.map((item) => {
                  const isDone = !!checked[item.id];
                  const isOpen = !!expanded[item.id];
                  return (
                    <div key={item.id}>
                      <div
                        className="item-row"
                        style={{ padding: "10px 10px" }}
                        onClick={() => toggleExpand(item.id)}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                          <div
                            className={`check-box${isDone ? " done" : ""}`}
                            style={{ marginTop: 1 }}
                            onClick={(e) => { e.stopPropagation(); toggle(item.id); }}
                          >
                            {isDone && <span className="check-tick">✓</span>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              fontSize: 14,
                              color: isDone ? "#666" : "#ddd",
                              textDecoration: isDone ? "line-through" : "none",
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              flexWrap: "wrap",
                            }}>
                              {item.task}
                              <span style={{
                                fontSize: 10,
                                padding: "2px 8px",
                                borderRadius: 20,
                                background: tagColors[item.tag] || "#ffffff11",
                                border: `1px solid ${tagBorder[item.tag] || "#444"}44`,
                                color: tagBorder[item.tag] || "#888",
                                letterSpacing: "0.06em",
                              }}>
                                {item.tag}
                              </span>
                              <span style={{ marginLeft: "auto", color: "#444", fontSize: 11, flexShrink: 0 }}>
                                {isOpen ? "▲" : "▼"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {isOpen && (
                        <div className="detail-box">{item.detail}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ marginTop: 48, borderTop: "1px solid #1a1a2e", paddingTop: 24, fontSize: 11, color: "#444", lineHeight: 1.8 }}>
          <div>SDK: @anthropic-ai/sdk · AI SDK: vercel/ai · Model: claude-sonnet-4-20250514</div>
          <div>Vector options: Pinecone · Supabase pgvector · Weaviate · Chroma · Custom in-memory</div>
          <div style={{ marginTop: 8, color: "#333" }}>docs.claude.com · console.anthropic.com</div>
        </div>
      </div>
    </div>
  );
}
