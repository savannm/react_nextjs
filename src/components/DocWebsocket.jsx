import { useState, useEffect, useRef } from "react";

// ─── SYNTAX HIGHLIGHTER ──────────────────────────────────────────────────────
function highlight(code) {
  if (!code) return "";

  // Single regex with capturing groups to avoid double-wrapping
  // 1: Directives, 2: Comments, 3: Strings, 4: Keywords, 5: Types, 6: Numbers, 7: Functions
  const regex = /("use [^"]+")|(\/\/[^\n]*)|(`[^`]*`|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(import|export|from|const|let|var|async|await|return|try|catch|if|else|new|default|function|class|extends|typeof|instanceof|true|false|null|undefined|void|switch|case|break|for|while|of|in|throw|type|interface)\b|\b([A-Z][a-zA-Z0-9]*)\b|\b(\d+)\b|\b([a-z_][a-zA-Z0-9_]*)\s*(?=\()/g;

  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(regex, (match, g1, g2, g3, g4, g5, g6, g7) => {
      if (g1) return `<span class="c-directive">${match}</span>`;
      if (g2) return `<span class="c-comment">${match}</span>`;
      if (g3) return `<span class="c-str">${match}</span>`;
      if (g4) return `<span class="c-kw">${match}</span>`;
      if (g5) return `<span class="c-type">${match}</span>`;
      if (g6) return `<span class="c-num">${match}</span>`;
      if (g7) return `<span class="c-fn">${match}</span>`;
      return match;
    });
}

// ─── CODE BLOCK ──────────────────────────────────────────────────────────────
function CodeBlock({ code, lang = "tsx", title }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ margin: "24px 0", borderRadius: 3, overflow: "hidden", border: "1px solid #DFE1E6", background: "#F4F5F7" }}>
      <div style={{ background: "#EBECF0", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", borderBottom: "1px solid #DFE1E6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#42526E", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{lang}</span>
          {title && <span style={{ color: "#172B4D", fontSize: 12, fontWeight: 600, marginLeft: 8 }}>{title}</span>}
        </div>
        <button onClick={copy} style={{ background: copied ? "#E3FCEF" : "#FFF", border: `1px solid ${copied ? "#36B37E" : "#DFE1E6"}`, borderRadius: 3, color: copied ? "#006644" : "#42526E", cursor: "pointer", fontSize: 11, padding: "4px 10px", fontWeight: 600 }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div style={{ overflowX: "auto", background: "#FFFFFF" }}>
        <pre style={{ margin: 0, padding: "16px 20px", fontSize: 13, lineHeight: 1.6, fontFamily: "'IBM Plex Mono', monospace", tabSize: 2, color: "#172B4D" }}>
          <code dangerouslySetInnerHTML={{ __html: highlight(code.trim()) }} />
        </pre>
      </div>
    </div>
  );
}

// ─── CALLOUT ─────────────────────────────────────────────────────────────────
function Callout({ type = "info", title, children }) {
  const cfg = {
    info: { bg: "#DEEBFF", border: "#B3D4FF", accent: "#0747A6", icon: "◈", tc: "#0747A6", body: "#172B4D" },
    warn: { bg: "#FFFAE6", border: "#FFF0B3", accent: "#FFAB00", icon: "⚠", tc: "#825C00", body: "#172B4D" },
    success: { bg: "#E3FCEF", border: "#ABF5D1", accent: "#36B37E", icon: "✦", tc: "#006644", body: "#172B4D" },
    danger: { bg: "#FFEBE6", border: "#FFBDAD", accent: "#FF5630", icon: "✕", tc: "#BF2600", body: "#172B4D" },
    tip: { bg: "#EAE6FF", border: "#C0B6F2", accent: "#6554C0", icon: "✧", tc: "#403294", body: "#172B4D" },
  };
  const s = cfg[type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderLeft: `4px solid ${s.accent}`, borderRadius: 3, padding: "12px 16px", margin: "16px 0" }}>
      <div style={{ color: s.tc, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>{s.icon}</span>{title || type.toUpperCase()}
      </div>
      <div style={{ color: s.body, fontSize: 14, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

// ─── SECTION HEADING ─────────────────────────────────────────────────────────
function SH1({ children }) {
  return <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 600, color: "#172B4D", margin: "0 0 12px", letterSpacing: "-0.01em" }}>{children}</h1>;
}
function SH2({ children }) {
  return <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 600, color: "#172B4D", margin: "24px 0 12px", paddingBottom: 8, borderBottom: "1px solid #DFE1E6" }}>{children}</h2>;
}
function SH3({ children }) {
  return <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: "#42526E", margin: "20px 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{children}</h3>;
}
function P({ children }) {
  return <p style={{ color: "#172B4D", fontSize: 14, lineHeight: 1.6, margin: "12px 0" }}>{children}</p>;
}
function Mono({ children }) {
  return <code style={{ background: "#F4F5F7", border: "1px solid #DFE1E6", borderRadius: 4, color: "#0747A6", fontSize: 12.5, padding: "2px 6px", fontFamily: "'IBM Plex Mono', monospace" }}>{children}</code>;
}

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
function Badge({ children, color = "blue" }) {
  const colors = {
    blue: { bg: "#DEEBFF", text: "#0747A6" },
    green: { bg: "#E3FCEF", text: "#006644" },
    orange: { bg: "#FFFAE6", text: "#825C00" },
    purple: { bg: "#EAE6FF", text: "#403294" },
    red: { bg: "#FFEBE6", text: "#BF2600" },
  };
  const c = colors[color] || colors.blue;
  return <span style={{ background: c.bg, color: c.text, borderRadius: 3, padding: "2px 6px", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{children}</span>;
}

// ─── LIVE DEMO: Connection States ─────────────────────────────────────────────
function ConnectionDemo() {
  const [state, setState] = useState("DISCONNECTED");
  const [log, setLog] = useState([]);
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);

  const addLog = (msg, type = "info") => {
    const ts = new Date().toLocaleTimeString("en-AU", { hour12: false });
    setLog(prev => [...prev.slice(-8), { msg, type, ts, id: Date.now() + Math.random() }]);
  };

  const connect = () => {
    if (state !== "DISCONNECTED") return;
    setState("CONNECTING");
    addLog("Initiating WebSocket handshake…", "info");
    setTimeout(() => {
      setState("CONNECTED");
      addLog("✦ Connection established (readyState: 1)", "success");
      addLog("Ping/keepalive interval started", "info");
      timerRef.current = setInterval(() => {
        setCount(c => c + 1);
        addLog("→ ping sent", "ping");
      }, 2500);
    }, 1200);
  };

  const disconnect = () => {
    clearInterval(timerRef.current);
    setState("CLOSING");
    addLog("← Close frame sent (1000 Normal)", "warn");
    setTimeout(() => {
      setState("DISCONNECTED");
      setCount(0);
      addLog("Connection closed cleanly", "info");
    }, 600);
  };

  const stateColors = { DISCONNECTED: "#f87171", CONNECTING: "#fb923c", CONNECTED: "#4ade80", CLOSING: "#fbbf24" };
  const stateNums = { DISCONNECTED: 3, CONNECTING: 0, CONNECTED: 1, CLOSING: 2 };

  return (
    <div style={{ background: "#060f17", border: "1px solid #1e2d3d", borderRadius: 12, padding: 20, margin: "16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#4d7fa8" }}>◈ LIVE CONNECTION DEMO</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: stateColors[state], boxShadow: `0 0 8px ${stateColors[state]}`, animation: state === "CONNECTED" ? "pulse 2s infinite" : "none" }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: stateColors[state] }}>{state} ({stateNums[state]})</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <button onClick={connect} disabled={state !== "DISCONNECTED"} style={{ background: state === "DISCONNECTED" ? "#0e2e1a" : "#0a1510", border: `1px solid ${state === "DISCONNECTED" ? "#1a7a45" : "#1a3d25"}`, borderRadius: 7, color: state === "DISCONNECTED" ? "#4ade80" : "#1a5c35", cursor: state === "DISCONNECTED" ? "pointer" : "not-allowed", padding: "8px 18px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, transition: "all 0.2s" }}>
          ws.connect()
        </button>
        <button onClick={disconnect} disabled={state !== "CONNECTED"} style={{ background: state === "CONNECTED" ? "#2a0e0e" : "#150a0a", border: `1px solid ${state === "CONNECTED" ? "#7a1a1a" : "#3d1515"}`, borderRadius: 7, color: state === "CONNECTED" ? "#f87171" : "#5c1a1a", cursor: state === "CONNECTED" ? "pointer" : "not-allowed", padding: "8px 18px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, transition: "all 0.2s" }}>
          ws.close()
        </button>
        {state === "CONNECTED" && (
          <span style={{ marginLeft: "auto", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#4d7fa8", alignSelf: "center" }}>
            pings: <span style={{ color: "#4ade80" }}>{count}</span>
          </span>
        )}
      </div>
      <div style={{ background: "#030a0f", border: "1px solid #0d1f2d", borderRadius: 8, padding: "12px 14px", height: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
        {log.length === 0 && <span style={{ color: "#2a4a5f", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>Click connect() to begin simulation…</span>}
        {log.map(l => (
          <div key={l.id} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, display: "flex", gap: 10, animation: "fadeIn 0.3s ease" }}>
            <span style={{ color: "#1e3d54", flexShrink: 0 }}>{l.ts}</span>
            <span style={{ color: l.type === "success" ? "#4ade80" : l.type === "warn" ? "#fbbf24" : l.type === "ping" ? "#5dade2" : "#6b8fa8" }}>{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LIVE DEMO: Message Simulator ────────────────────────────────────────────
function MessageDemo() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [binaryMode, setBinaryMode] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const msg = {
      id: Date.now(),
      direction: "out",
      type: binaryMode ? "binary" : "text",
      content: binaryMode ? `ArrayBuffer(${input.length * 2}B) ← "${input}"` : input,
      ts: new Date().toLocaleTimeString("en-AU", { hour12: false }),
    };
    setMessages(prev => [...prev, msg]);
    setInput("");

    // Simulate server echo
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        direction: "in",
        type: binaryMode ? "binary" : "text",
        content: binaryMode ? `ArrayBuffer echo: ${msg.content}` : `Echo: ${msg.content}`,
        ts: new Date().toLocaleTimeString("en-AU", { hour12: false }),
      }]);
    }, 350 + Math.random() * 400);
  };

  const injectEvent = (eventMsg, type = "event") => {
    setMessages(prev => [...prev, { id: Date.now(), direction: "event", type, content: eventMsg, ts: new Date().toLocaleTimeString("en-AU", { hour12: false }) }]);
  };

  return (
    <div style={{ background: "#060f17", border: "1px solid #606f80ff", borderRadius: 12, overflow: "hidden", margin: "16px 0" }}>
      <div style={{ background: "#0a1520", padding: "10px 16px", borderBottom: "1px solid #1e2d3d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#4d7fa8" }}>◈ MESSAGE FRAME SIMULATOR</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setBinaryMode(false)} style={{ background: !binaryMode ? "#0a1e30" : "transparent", border: `1px solid ${!binaryMode ? "#1a5276" : "#1e2d3d"}`, borderRadius: 5, color: !binaryMode ? "#5dade2" : "#2a4a5f", cursor: "pointer", padding: "4px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>TEXT</button>
          <button onClick={() => setBinaryMode(true)} style={{ background: binaryMode ? "#1a0a1e" : "transparent", border: `1px solid ${binaryMode ? "#4a1a6a" : "#1e2d3d"}`, borderRadius: 5, color: binaryMode ? "#a78bfa" : "#2a4a5f", cursor: "pointer", padding: "4px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>BINARY</button>
          <button onClick={() => injectEvent("server.broadcast: {type:'notification',data:'Deploy complete'}", "broadcast")} style={{ background: "transparent", border: "1px solid #1e2d3d", borderRadius: 5, color: "#4d7fa8", cursor: "pointer", padding: "4px 10px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>inject event</button>
        </div>
      </div>
      <div style={{ height: 200, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
        {messages.length === 0 && <span style={{ color: "#1e3d54", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>No messages yet…</span>}
        {messages.map(m => (
          <div key={m.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", animation: "fadeIn 0.25s ease" }}>
            <span style={{ color: "#1e3d54", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, flexShrink: 0, paddingTop: 1 }}>{m.ts}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, flexShrink: 0, color: m.direction === "out" ? "#4ade80" : m.direction === "in" ? "#5dade2" : "#a78bfa" }}>
              {m.direction === "out" ? "→ SEND" : m.direction === "in" ? "← RECV" : "⚡ EVT "}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: m.type === "binary" ? "#a78bfa" : m.direction === "event" ? "#fbbf24" : "#8ba8bf", wordBreak: "break-all" }}>{m.content}</span>
            <span style={{ marginLeft: "auto", flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#1e3d54" }}>{m.type}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: "10px 16px", borderTop: "1px solid #1e2d3d", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={binaryMode ? "Enter text → will encode to ArrayBuffer" : "Type a message to send…"} style={{ flex: 1, background: "#030a0f", border: "1px solid #1e2d3d", borderRadius: 7, color: "#8ba8bf", padding: "8px 12px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, outline: "none" }} />
        <button onClick={send} style={{ background: "#0a1e30", border: "1px solid #1a5276", borderRadius: 7, color: "#5dade2", cursor: "pointer", padding: "8px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>send()</button>
      </div>
    </div>
  );
}

// ─── RECONNECT VISUALISER ─────────────────────────────────────────────────────
function ReconnectDemo() {
  const [attempt, setAttempt] = useState(0);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("idle");
  const timerRef = useRef(null);

  const delays = [1000, 2000, 4000, 8000, 16000, 30000];

  const start = () => {
    setRunning(true);
    setAttempt(0);
    setStatus("connecting");
    let i = 0;
    const run = () => {
      setAttempt(i);
      setStatus("connecting");
      setTimeout(() => {
        if (i < 4) {
          setStatus("failed");
          i++;
          const d = Math.min(delays[i], 30000);
          setTimeout(run, Math.min(d * 0.2, 800)); // speed up for demo
        } else {
          setStatus("connected");
          setRunning(false);
        }
      }, 400);
    };
    run();
  };

  const reset = () => { setRunning(false); setAttempt(0); setStatus("idle"); clearTimeout(timerRef.current); };

  return (
    <div style={{ background: "#060f17", border: "1px solid #1e2d3d", borderRadius: 12, padding: 18, margin: "16px 0" }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#4d7fa8", marginBottom: 14 }}>◈ EXPONENTIAL BACKOFF VISUALISER</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {delays.map((d, i) => {
          const state = i < attempt ? "failed" : i === attempt && running ? "active" : status === "connected" && i === 4 ? "success" : "pending";
          return (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ background: state === "failed" ? "#2a0e0e" : state === "active" ? "#0a1e30" : state === "success" ? "#0e2e1a" : "#0a1520", border: `1px solid ${state === "failed" ? "#7a1a1a" : state === "active" ? "#1a5276" : state === "success" ? "#1a7a45" : "#1e2d3d"}`, borderRadius: 8, padding: "10px 4px", marginBottom: 6, transition: "all 0.3s" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: state === "failed" ? "#f87171" : state === "active" ? "#5dade2" : state === "success" ? "#4ade80" : "#2a4a5f" }}>
                  {state === "active" ? "●" : state === "failed" ? "✕" : state === "success" ? "✦" : "○"}
                </div>
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#2a4a5f" }}>{(d / 1000).toFixed(0)}s</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#1e3d54" }}>#{i + 1}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={start} disabled={running} style={{ background: running ? "#0a1520" : "#0a1e30", border: `1px solid ${running ? "#1e2d3d" : "#1a5276"}`, borderRadius: 7, color: running ? "#2a4a5f" : "#5dade2", cursor: running ? "not-allowed" : "pointer", padding: "8px 16px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
          simulate disconnect →
        </button>
        <button onClick={reset} style={{ background: "transparent", border: "1px solid #1e2d3d", borderRadius: 7, color: "#4d7fa8", cursor: "pointer", padding: "8px 14px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>reset</button>
        {status === "connected" && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#4ade80" }}>✦ reconnected on attempt {attempt + 1}</span>}
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "intro", icon: "◈", label: "Introduction" },
  { id: "setup", icon: "⬡", label: "Project Setup" },
  { id: "hook", icon: "↺", label: "useWebSocket Hook" },
  { id: "connection", icon: "⚡", label: "Connection Lifecycle" },
  { id: "messages", icon: "⇄", label: "Sending & Receiving" },
  { id: "binary", icon: "⬡", label: "Binary Data" },
  { id: "reconnect", icon: "↺", label: "Auto-Reconnect" },
  { id: "rooms", icon: "◈", label: "Rooms & Broadcast" },
  { id: "server", icon: "⬡", label: "Next.js Server" },
  { id: "patterns", icon: "⇄", label: "UI Patterns" },
  { id: "security", icon: "⚡", label: "Security" },
  { id: "ref", icon: "◈", label: "Quick Reference" },
];

// ─── ALL SECTION CONTENT ─────────────────────────────────────────────────────
const CONTENT = {
  intro: () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#2a5f8f", letterSpacing: "0.15em", marginBottom: 8 }}>DOCUMENTATION / WEBSOCKETS</div>
        <SH1>WebSockets in Next.js</SH1>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#2a5f8f", marginTop: 6 }}>Full lifecycle · Binary data · Reconnection · UI patterns</div>
      </div>

      <P>WebSockets provide a persistent, full-duplex communication channel over a single TCP connection. Unlike HTTP polling, the server can push data to the client at any time — making them essential for real-time features.</P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "20px 0" }}>
        {[
          { icon: "⚡", title: "Full-Duplex", desc: "Both client and server send messages simultaneously on one connection." },
          { icon: "⇄", title: "Low Latency", desc: "No HTTP overhead per message. Frames are tiny — as small as 2 bytes." },
          { icon: "↺", title: "Persistent", desc: "One handshake, then the connection stays open until explicitly closed." },
          { icon: "◈", title: "Binary Support", desc: "Native ArrayBuffer and Blob support for audio, images, and binary protocols." },
        ].map(c => (
          <div key={c.title} style={{ background: "#0a1520", border: "1px solid #1e2d3d", borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#c8dff0", fontSize: 14, marginBottom: 4 }}>{c.title}</div>
            <div style={{ color: "#4d7fa8", fontSize: 13, lineHeight: 1.6 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <SH2>WebSocket vs. Alternatives</SH2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0a1520" }}>
              {["Feature", "WebSocket", "HTTP Polling", "SSE", "WebRTC"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#4d7fa8", borderBottom: "1px solid #1e2d3d", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["Direction", "Full-duplex", "Client→Server", "Server→Client", "P2P"],
              ["Latency", "Very low", "High", "Low", "Very low"],
              ["Overhead", "Minimal", "High (HTTP)", "Low", "Medium"],
              ["Binary", "Native", "Via Base64", "No", "Native"],
              ["Proxy friendly", "Mostly", "Yes", "Yes", "Complex"],
              ["Next.js support", "Via custom server", "Native", "Native (App Router)", "Via adapter"],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#060f17" : "#08131d" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "9px 14px", color: j === 0 ? "#7fb8d8" : j === 1 ? "#4ade80" : "#6b8fa8", borderBottom: "1px solid #0d1f2d" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="info" title="NEXT.JS CONSTRAINT">
        Next.js (Vercel serverless) does not natively support persistent WebSocket server connections in API routes or Route Handlers. You need either a <strong style={{ color: "#5dade2" }}>custom server</strong> (Node.js), a dedicated WS server process, or a managed service like <strong style={{ color: "#5dade2" }}>Ably / Pusher / Supabase Realtime</strong>.
      </Callout>
    </div>
  ),

  setup: () => (
    <div>
      <SH1>Project Setup</SH1>
      <P>Install dependencies and configure your Next.js project for WebSocket support.</P>

      <CodeBlock lang="bash" title="terminal" code={`# Next.js project (App Router)
npx create-next-app@latest my-ws-app --typescript --app
cd my-ws-app

# WebSocket server (ws is the gold-standard Node.js WS library)
npm install ws
npm install -D @types/ws

# Optional: socket.io for rooms, namespaces, fallbacks
npm install socket.io socket.io-client

# Optional: reconnecting-websocket for auto-reconnect client
npm install reconnecting-websocket`} />

      <SH2>Custom Server Setup (server.ts)</SH2>
      <P>Because Next.js API routes are stateless, you need a custom server that upgrades HTTP connections to WebSocket. This runs alongside Next.js on the same port.</P>

      <CodeBlock lang="typescript" title="server.ts (project root)" code={`import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Attach WebSocket server to the HTTP server
  const wss = new WebSocketServer({ noServer: true });

  // Intercept HTTP upgrade requests for /ws path
  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url!, true);

    if (pathname === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      socket.destroy(); // Reject other upgrade requests
    }
  });

  wss.on("connection", (ws: WebSocket, req) => {
    console.log("Client connected. Total:", wss.clients.size);

    // Send welcome message
    ws.send(JSON.stringify({ type: "welcome", message: "Connected!" }));

    ws.on("message", (data) => {
      // Echo back to all clients (broadcast)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    });

    ws.on("close", (code, reason) => {
      console.log("Client disconnected:", code, reason.toString());
    });

    ws.on("error", (err) => console.error("WS Error:", err));
  });

  server.listen(3000, () => {
    console.log("Ready on http://localhost:3000");
  });
});`} />

      <CodeBlock lang="json" title="package.json (scripts)" code={`{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts"
  }
}`} />

      <Callout type="tip" title="ENVIRONMENT VARIABLES">
        Store your WebSocket URL in <Mono>.env.local</Mono>. Use <Mono>NEXT_PUBLIC_WS_URL</Mono> for the client-facing URL.<br /><br />
        <code style={{ color: "#a78bfa", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws</code><br />
        <code style={{ color: "#a78bfa", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>NEXT_PUBLIC_WS_URL_PROD=wss://yourdomain.com/ws</code>
      </Callout>
    </div>
  ),

  hook: () => (
    <div>
      <SH1>useWebSocket Hook</SH1>
      <P>A production-ready custom hook that encapsulates the entire WebSocket lifecycle — connection, messages, reconnection, and cleanup — behind a clean React API.</P>

      <CodeBlock lang="typescript" title="hooks/useWebSocket.ts" code={`"use client";

import { useEffect, useRef, useCallback, useState } from "react";

type WSStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";

interface WSOptions {
  onOpen?: (e: Event) => void;
  onClose?: (e: CloseEvent) => void;
  onError?: (e: Event) => void;
  reconnect?: boolean;
  reconnectDelay?: number;   // Base delay in ms (exponential backoff applied)
  maxReconnects?: number;
  pingInterval?: number;     // Send ping every N ms (0 = disabled)
}

interface WSMessage {
  data: string | ArrayBuffer | Blob;
  timestamp: number;
  type: "text" | "binary";
}

export function useWebSocket(url: string, options: WSOptions = {}) {
  const {
    onOpen, onClose, onError,
    reconnect = true,
    reconnectDelay = 1000,
    maxReconnects = 5,
    pingInterval = 30000,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const pingRef = useRef<ReturnType<typeof setInterval>>();
  const unmounted = useRef(false);

  const [status, setStatus] = useState<WSStatus>("idle");
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const [messageHistory, setMessageHistory] = useState<WSMessage[]>([]);

  const connect = useCallback(() => {
    if (unmounted.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setStatus("connecting");
    const ws = new WebSocket(url);

    // ─── Binary type: "arraybuffer" | "blob" ────────────────────────
    ws.binaryType = "arraybuffer";

    ws.onopen = (e) => {
      if (unmounted.current) return;
      reconnectCount.current = 0;
      setStatus("connected");
      onOpen?.(e);

      // Start keepalive ping
      if (pingInterval > 0) {
        pingRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, pingInterval);
      }
    };

    ws.onmessage = (e) => {
      if (unmounted.current) return;
      const msg: WSMessage = {
        data: e.data,
        timestamp: Date.now(),
        type: e.data instanceof ArrayBuffer ? "binary" : "text",
      };
      setLastMessage(msg);
      setMessageHistory((prev) => [...prev.slice(-99), msg]); // Keep last 100
    };

    ws.onclose = (e) => {
      if (unmounted.current) return;
      clearInterval(pingRef.current);
      setStatus("disconnected");
      onClose?.(e);

      // Exponential backoff reconnection
      if (reconnect && reconnectCount.current < maxReconnects && !e.wasClean) {
        const delay = Math.min(reconnectDelay * 2 ** reconnectCount.current, 30000);
        reconnectCount.current++;
        setTimeout(connect, delay);
      }
    };

    ws.onerror = (e) => {
      setStatus("error");
      onError?.(e);
      ws.close();
    };

    wsRef.current = ws;
  }, [url]);

  // Send text or binary data
  const send = useCallback((data: string | ArrayBuffer | Blob) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
      return true;
    }
    return false;
  }, []);

  // Send JSON convenience method
  const sendJSON = useCallback((data: unknown) => {
    return send(JSON.stringify(data));
  }, [send]);

  // Manual close
  const close = useCallback((code = 1000, reason = "Normal closure") => {
    clearInterval(pingRef.current);
    wsRef.current?.close(code, reason);
  }, []);

  useEffect(() => {
    unmounted.current = false;
    connect();
    return () => {
      unmounted.current = true;
      clearInterval(pingRef.current);
      wsRef.current?.close(1000, "Component unmounted");
    };
  }, [connect]);

  return {
    status,        // Current connection state
    send,          // Send raw data
    sendJSON,      // Send serialized JSON
    close,         // Manually close
    lastMessage,   // Latest received message
    messageHistory,// Array of last 100 messages
    ws: wsRef,     // Direct ref access (escape hatch)
  };
}`} />

      <SH3>Usage in a Component</SH3>
      <CodeBlock lang="tsx" title="app/chat/page.tsx" code={`"use client";

import { useWebSocket } from "@/hooks/useWebSocket";

export default function ChatPage() {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;

  const { status, sendJSON, lastMessage, messageHistory } = useWebSocket(WS_URL, {
    reconnect: true,
    reconnectDelay: 1000,
    maxReconnects: 5,
    onOpen: () => console.log("WS open"),
    onClose: (e) => console.log("WS closed:", e.code),
  });

  const sendMessage = (text: string) => {
    sendJSON({ type: "chat", content: text, ts: Date.now() });
  };

  return (
    <div>
      <p>Status: {status}</p>
      <p>Last: {lastMessage?.data as string}</p>
      <button onClick={() => sendMessage("Hello!")}>Send</button>
      <ul>
        {messageHistory.map((m, i) => (
          <li key={i}>{m.data as string}</li>
        ))}
      </ul>
    </div>
  );
}`} />
    </div>
  ),

  connection: () => (
    <div>
      <SH1>Connection Lifecycle</SH1>
      <P>A WebSocket connection moves through four <Mono>readyState</Mono> values. Understanding each is critical for handling UI state correctly.</P>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "20px 0" }}>
        {[
          { state: "0 — CONNECTING", color: "#fb923c", desc: "TCP handshake + HTTP Upgrade in progress. No messages can be sent yet." },
          { state: "1 — OPEN", color: "#4ade80", desc: "Connection established. send() and receive work freely." },
          { state: "2 — CLOSING", color: "#fbbf24", desc: "Close handshake initiated. Buffered messages may still be delivered." },
          { state: "3 — CLOSED", color: "#f87171", desc: "Connection terminated. A new WebSocket object is needed to reconnect." },
        ].map(s => (
          <div key={s.state} style={{ background: "#0a1520", border: `1px solid ${s.color}22`, borderLeft: `3px solid ${s.color}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: s.color, fontWeight: 700, marginBottom: 6 }}>{s.state}</div>
            <div style={{ color: "#5a8aaa", fontSize: 13, lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <ConnectionDemo />

      <SH2>Event Handlers</SH2>
      <CodeBlock lang="typescript" code={`const ws = new WebSocket("wss://example.com/ws");
ws.binaryType = "arraybuffer"; // or "blob"

// ─── Lifecycle events ────────────────────────────────────────────
ws.onopen = (event: Event) => {
  console.log("Connected!", ws.readyState); // 1

  // Safe to send immediately
  ws.send(JSON.stringify({ type: "auth", token: "Bearer ..." }));
};

ws.onclose = (event: CloseEvent) => {
  console.log("Code:", event.code);     // 1000 = normal, 1006 = abnormal
  console.log("Reason:", event.reason); // Server-provided close reason
  console.log("Clean:", event.wasClean); // false if connection dropped
};

ws.onerror = (event: Event) => {
  // Note: errors are intentionally opaque for security.
  // Check onclose for the real code.
  console.error("WebSocket error — see onclose for details");
};

// ─── Common close codes ──────────────────────────────────────────
// 1000 Normal closure
// 1001 Going away (page unload)
// 1002 Protocol error
// 1003 Unsupported data type
// 1006 Abnormal closure (no close frame — network drop)
// 1008 Policy violation (e.g. auth failed)
// 1011 Server error
// 4000-4999 Available for application use`} />

      <Callout type="warn" title="CLOSE CODE 1006">
        Code 1006 means the connection dropped without a proper close frame — a network interruption, server crash, or proxy timeout. Always implement reconnection logic for 1006.
      </Callout>
    </div>
  ),

  messages: () => (
    <div>
      <SH1>Sending & Receiving Messages</SH1>
      <P>WebSocket supports text (UTF-8 strings) and binary frames (ArrayBuffer or Blob). In practice, most apps use JSON-encoded text for control messages and binary for media/data.</P>

      <MessageDemo />

      <SH2>Sending Data</SH2>
      <CodeBlock lang="typescript" code={`// ─── 1. Plain text ────────────────────────────────────────────────
ws.send("Hello, server!");

// ─── 2. JSON (most common) ────────────────────────────────────────
ws.send(JSON.stringify({
  type: "chat_message",
  roomId: "general",
  content: "Hey everyone",
  userId: "user_abc123",
  timestamp: Date.now(),
}));

// ─── 3. TypedArray (binary) ───────────────────────────────────────
const buffer = new Uint8Array([0x48, 0x65, 0x6C, 0x6C, 0x6F]);
ws.send(buffer);

// ─── 4. ArrayBuffer directly ─────────────────────────────────────
const ab = new ArrayBuffer(8);
const view = new DataView(ab);
view.setFloat32(0, 3.14);
view.setFloat32(4, 2.71);
ws.send(ab);

// ─── 5. Blob (e.g. file upload chunk) ────────────────────────────
const blob = new Blob([JSON.stringify({ meta: true })], { type: "application/json" });
ws.send(blob);

// ─── 6. Check buffered data before sending ────────────────────────
// bufferedAmount = bytes queued but not yet sent
if (ws.bufferedAmount < 16384) {  // 16KB threshold
  ws.send(largeData);
} else {
  console.warn("Socket buffer is full — backpressure!");
}`} />

      <SH2>Receiving Messages</SH2>
      <CodeBlock lang="typescript" code={`ws.binaryType = "arraybuffer"; // Receive binary as ArrayBuffer, not Blob

ws.onmessage = (event: MessageEvent) => {

  // ─── Detect message type ──────────────────────────────────────
  if (typeof event.data === "string") {
    // Text frame
    try {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "chat_message":
          appendMessage(msg);
          break;
        case "pong":
          // Server responded to our ping
          break;
        case "error":
          handleServerError(msg.code, msg.message);
          break;
        default:
          console.warn("Unknown message type:", msg.type);
      }
    } catch {
      console.error("Invalid JSON from server:", event.data);
    }

  } else if (event.data instanceof ArrayBuffer) {
    // Binary frame (when binaryType = "arraybuffer")
    handleBinaryMessage(event.data);

  } else if (event.data instanceof Blob) {
    // Binary frame (when binaryType = "blob", the default)
    event.data.arrayBuffer().then(handleBinaryMessage);
  }
};

async function handleBinaryMessage(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  const messageType = view.getUint8(0); // First byte = type ID

  if (messageType === 0x01) {
    // E.g. audio chunk
    const audioData = buffer.slice(1);
    await playAudioChunk(audioData);
  }
}`} />
    </div>
  ),

  binary: () => (
    <div>
      <SH1>Binary Data</SH1>
      <P>Binary WebSocket frames are essential for high-performance applications: audio streaming, canvas collaboration, file transfers, and custom binary protocols avoid JSON parsing overhead entirely.</P>

      <SH2>Binary Protocol Design</SH2>
      <P>Define a byte layout for your messages. The first byte typically identifies the message type — the rest is the payload.</P>

      <CodeBlock lang="typescript" title="lib/binary-protocol.ts" code={`// Message format:
// [0]    type    (1 byte  — Uint8)
// [1-4]  userId  (4 bytes — Uint32)
// [5-8]  x       (4 bytes — Float32) ← cursor X
// [9-12] y       (4 bytes — Float32) ← cursor Y

export const MSG_TYPE = {
  CURSOR_MOVE: 0x01,
  DRAW_START:  0x02,
  DRAW_POINT:  0x03,
  DRAW_END:    0x04,
  FILE_CHUNK:  0x10,
} as const;

// ─── Encode a cursor move ─────────────────────────────────────────
export function encodeCursorMove(userId: number, x: number, y: number): ArrayBuffer {
  const buffer = new ArrayBuffer(13); // 1 + 4 + 4 + 4
  const view = new DataView(buffer);

  view.setUint8(0, MSG_TYPE.CURSOR_MOVE);
  view.setUint32(1, userId, true);    // true = little-endian
  view.setFloat32(5, x, true);
  view.setFloat32(9, y, true);

  return buffer;
}

// ─── Decode a cursor move ─────────────────────────────────────────
export function decodeCursorMove(buffer: ArrayBuffer) {
  const view = new DataView(buffer);

  return {
    type:   view.getUint8(0),
    userId: view.getUint32(1, true),
    x:      view.getFloat32(5, true),
    y:      view.getFloat32(9, true),
  };
}

// ─── File chunking (chunk large files for transfer) ───────────────
export function* chunkFile(file: File, chunkSize = 16384) {
  let offset = 0;
  while (offset < file.size) {
    yield {
      chunk: file.slice(offset, offset + chunkSize),
      offset,
      total: file.size,
      last: offset + chunkSize >= file.size,
    };
    offset += chunkSize;
  }
}

// ─── Send a file over WebSocket ───────────────────────────────────
export async function sendFile(ws: WebSocket, file: File) {
  for (const { chunk, offset, total, last } of chunkFile(file)) {
    const arrayBuffer = await chunk.arrayBuffer();

    // Header: [type(1)] [offset(4)] [total(4)] [last(1)] = 10 bytes
    const header = new ArrayBuffer(10);
    const hv = new DataView(header);
    hv.setUint8(0, MSG_TYPE.FILE_CHUNK);
    hv.setUint32(1, offset, true);
    hv.setUint32(5, total, true);
    hv.setUint8(9, last ? 1 : 0);

    // Concatenate header + chunk
    const combined = new Uint8Array(header.byteLength + arrayBuffer.byteLength);
    combined.set(new Uint8Array(header), 0);
    combined.set(new Uint8Array(arrayBuffer), header.byteLength);

    // Wait if buffer is filling up (backpressure)
    await new Promise<void>((resolve) => {
      const check = () => ws.bufferedAmount < 65536 ? resolve() : setTimeout(check, 50);
      check();
    });

    ws.send(combined);
  }
}`} />

      <SH2>Receiving & Assembling File Chunks</SH2>
      <CodeBlock lang="typescript" code={`// Client-side file reassembly
const chunks = new Map<number, Uint8Array>(); // offset → data
let totalSize = 0;

ws.onmessage = (event) => {
  if (!(event.data instanceof ArrayBuffer)) return;

  const view = new DataView(event.data);
  const type = view.getUint8(0);

  if (type === 0x10) { // FILE_CHUNK
    const offset = view.getUint32(1, true);
    const total  = view.getUint32(5, true);
    const isLast = view.getUint8(9) === 1;
    const data   = new Uint8Array(event.data, 10); // Skip header

    chunks.set(offset, data);
    totalSize = total;

    updateProgressBar((chunks.size * 16384) / total);

    if (isLast) {
      // Reassemble all chunks in order
      const result = new Uint8Array(totalSize);
      let pos = 0;
      for (const [, chunk] of [...chunks].sort((a, b) => a[0] - b[0])) {
        result.set(chunk, pos);
        pos += chunk.byteLength;
      }

      const blob = new Blob([result]);
      const url = URL.createObjectURL(blob);
      downloadFile(url, "received-file");
      chunks.clear();
    }
  }
};`} />

      <Callout type="tip" title="PERFORMANCE TIP">
        For real-time canvas collaboration, send cursor/draw positions as binary Float32 pairs — 8 bytes vs ~40 bytes for JSON <Mono>{"{ x: 123.456, y: 789.012 }"}</Mono>. That's 5× smaller, significantly reducing latency at scale.
      </Callout>
    </div>
  ),

  reconnect: () => (
    <div>
      <SH1>Auto-Reconnect & Resilience</SH1>
      <P>Network connections drop. Servers restart. Proxies time out. A production WebSocket implementation must handle all of these gracefully with exponential backoff.</P>

      <ReconnectDemo />

      <SH2>Exponential Backoff Implementation</SH2>
      <CodeBlock lang="typescript" title="lib/ws-reconnect.ts" code={`export class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private attempt = 0;
  private closed = false;

  private readonly BASE_DELAY = 1000;
  private readonly MAX_DELAY  = 30000;
  private readonly MAX_RETRIES = 10;
  private readonly JITTER = 0.3; // ±30% randomness to prevent thundering herd

  public onopen?: (e: Event) => void;
  public onclose?: (e: CloseEvent) => void;
  public onmessage?: (e: MessageEvent) => void;
  public onerror?: (e: Event) => void;
  public onstatechange?: (state: "connecting"|"connected"|"disconnected") => void;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    this.onstatechange?.("connecting");
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = (e) => {
      this.attempt = 0; // Reset counter on success
      this.onstatechange?.("connected");
      this.onopen?.(e);
    };

    this.ws.onmessage = (e) => this.onmessage?.(e);
    this.ws.onerror   = (e) => this.onerror?.(e);

    this.ws.onclose = (e) => {
      this.onstatechange?.("disconnected");
      this.onclose?.(e);

      if (this.closed) return;             // Manual close — don't reconnect
      if (e.wasClean) return;              // Clean closure — don't reconnect
      if (this.attempt >= this.MAX_RETRIES) {
        console.error("Max reconnection attempts reached");
        return;
      }

      const exponential = this.BASE_DELAY * 2 ** this.attempt;
      const capped = Math.min(exponential, this.MAX_DELAY);
      // Add jitter: ±30% of the delay
      const jittered = capped * (1 + (Math.random() * 2 - 1) * this.JITTER);

      console.log(\`Reconnecting in \${(jittered / 1000).toFixed(1)}s (attempt \${this.attempt + 1})\`);
      this.attempt++;
      setTimeout(() => this.connect(), jittered);
    };
  }

  send(data: string | ArrayBuffer | Blob) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  close(code = 1000, reason = "") {
    this.closed = true;
    this.ws?.close(code, reason);
  }

  get readyState() {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}`} />

      <SH3>Heartbeat / Keepalive</SH3>
      <P>Many load balancers and proxies terminate idle connections after 60–90 seconds. Implement a ping/pong cycle to keep the connection alive.</P>
      <CodeBlock lang="typescript" code={`class PingPongWebSocket {
  private ws: WebSocket;
  private pingTimer?: ReturnType<typeof setInterval>;
  private pongTimeout?: ReturnType<typeof setTimeout>;
  private readonly PING_INTERVAL = 25000;  // 25s
  private readonly PONG_TIMEOUT  = 5000;   // Expect pong within 5s

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => this.startPing();
    this.ws.onclose = () => this.stopPing();
    this.ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data as string);
        if (msg.type === "pong") {
          clearTimeout(this.pongTimeout); // Server is alive!
        }
      } catch {}
    };
  }

  private startPing() {
    this.pingTimer = setInterval(() => {
      if (this.ws.readyState !== WebSocket.OPEN) return;

      this.ws.send(JSON.stringify({ type: "ping" }));

      // If no pong arrives in time, force close (triggers reconnect)
      this.pongTimeout = setTimeout(() => {
        console.warn("Pong timeout — forcing reconnect");
        this.ws.close(1001, "Pong timeout");
      }, this.PONG_TIMEOUT);
    }, this.PING_INTERVAL);
  }

  private stopPing() {
    clearInterval(this.pingTimer);
    clearTimeout(this.pongTimeout);
  }
}`} />
    </div>
  ),

  rooms: () => (
    <div>
      <SH1>Rooms & Broadcasting</SH1>
      <P>Most real-time apps need namespaced channels — chat rooms, game lobbies, document collaboration sessions. Implement this server-side by tracking which clients belong to which room.</P>

      <CodeBlock lang="typescript" title="server/rooms.ts" code={`import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";

interface Client {
  ws: WebSocket;
  userId: string;
  rooms: Set<string>;
}

// ─── Room Manager ─────────────────────────────────────────────────
class RoomManager {
  private clients = new Map<string, Client>();
  private rooms   = new Map<string, Set<string>>(); // roomId → Set<userId>

  addClient(ws: WebSocket, req: IncomingMessage): string {
    const userId = crypto.randomUUID();
    this.clients.set(userId, { ws, userId, rooms: new Set() });

    ws.on("message", (data) => this.handleMessage(userId, data.toString()));
    ws.on("close", () => this.removeClient(userId));

    // Send user their ID
    ws.send(JSON.stringify({ type: "connected", userId }));
    return userId;
  }

  private handleMessage(userId: string, raw: string) {
    try {
      const msg = JSON.parse(raw);

      switch (msg.type) {
        case "join":   return this.joinRoom(userId, msg.roomId);
        case "leave":  return this.leaveRoom(userId, msg.roomId);
        case "chat":   return this.broadcastToRoom(msg.roomId, msg, userId);
        case "ping":   return this.clients.get(userId)?.ws.send(JSON.stringify({ type: "pong" }));
      }
    } catch {}
  }

  joinRoom(userId: string, roomId: string) {
    const client = this.clients.get(userId);
    if (!client) return;

    if (!this.rooms.has(roomId)) this.rooms.set(roomId, new Set());
    this.rooms.get(roomId)!.add(userId);
    client.rooms.add(roomId);

    // Notify all room members
    this.broadcastToRoom(roomId, {
      type: "user_joined",
      userId,
      roomId,
      memberCount: this.rooms.get(roomId)!.size,
    });
  }

  leaveRoom(userId: string, roomId: string) {
    this.rooms.get(roomId)?.delete(userId);
    this.clients.get(userId)?.rooms.delete(roomId);

    this.broadcastToRoom(roomId, { type: "user_left", userId, roomId });
  }

  broadcastToRoom(roomId: string, msg: object, excludeUserId?: string) {
    const members = this.rooms.get(roomId);
    if (!members) return;

    const payload = JSON.stringify(msg);
    members.forEach((memberId) => {
      if (memberId === excludeUserId) return;
      const client = this.clients.get(memberId);
      if (client?.ws.readyState === WebSocket.OPEN) {
        client.ws.send(payload);
      }
    });
  }

  private removeClient(userId: string) {
    const client = this.clients.get(userId);
    if (!client) return;

    // Remove from all joined rooms
    client.rooms.forEach((roomId) => this.leaveRoom(userId, roomId));
    this.clients.delete(userId);
  }

  getRoomMembers(roomId: string) {
    return Array.from(this.rooms.get(roomId) ?? []);
  }

  getStats() {
    return {
      totalClients: this.clients.size,
      totalRooms: this.rooms.size,
      rooms: Object.fromEntries(
        [...this.rooms].map(([id, members]) => [id, members.size])
      ),
    };
  }
}

export const roomManager = new RoomManager();

// Hook into the WebSocket server
export function attachRoomManager(wss: WebSocketServer) {
  wss.on("connection", (ws, req) => {
    roomManager.addClient(ws, req);
  });
}`} />

      <SH3>Client-side Room Usage</SH3>
      <CodeBlock lang="tsx" code={`"use client";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect } from "react";

export function ChatRoom({ roomId }: { roomId: string }) {
  const { status, sendJSON, lastMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL!
  );

  // Join the room once connected
  useEffect(() => {
    if (status === "connected") {
      sendJSON({ type: "join", roomId });
    }
    return () => {
      if (status === "connected") {
        sendJSON({ type: "leave", roomId });
      }
    };
  }, [status, roomId]);

  const sendChat = (content: string) => {
    sendJSON({ type: "chat", roomId, content });
  };

  return <div>{/* render messages */}</div>;
}`} />
    </div>
  ),

  server: () => (
    <div>
      <SH1>Next.js Server Patterns</SH1>
      <P>Three deployment patterns depending on your constraints: custom server (most flexible), separate WS service (most scalable), or managed service (fastest to ship).</P>

      <SH2>Pattern 1 — Socket.io with Custom Server</SH2>
      <P>Socket.io adds rooms, namespaces, automatic fallback, and middleware on top of WebSockets. Best for complex applications.</P>
      <CodeBlock lang="typescript" title="server.ts" code={`import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import next from "next";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new SocketIOServer(httpServer, {
    cors: { origin: process.env.NEXT_PUBLIC_APP_URL, methods: ["GET", "POST"] },
    transports: ["websocket", "polling"], // Fallback to polling if WS blocked
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!verifyToken(token)) return next(new Error("Unauthorized"));
    socket.data.userId = getUserIdFromToken(token);
    next();
  });

  io.on("connection", (socket) => {
    const { userId } = socket.data;
    console.log("User connected:", userId);

    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      io.to(roomId).emit("user_joined", { userId, roomId });
    });

    socket.on("chat_message", ({ roomId, content }: { roomId: string; content: string }) => {
      io.to(roomId).emit("chat_message", { userId, content, ts: Date.now() });
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", userId, reason);
    });
  });

  httpServer.listen(3000);
});

function verifyToken(token: string): boolean {
  return !!token; // Replace with real JWT verification
}
function getUserIdFromToken(token: string): string {
  return "user_" + token.slice(0, 8); // Replace with real decode
}`} />

      <SH2>Pattern 2 — Managed Service (Ably / Pusher)</SH2>
      <P>No custom server needed. The managed service handles WebSocket infrastructure. Your Next.js app uses their client SDK and triggers events via API routes.</P>
      <CodeBlock lang="typescript" title="app/api/events/route.ts" code={`// Trigger a realtime event from a Next.js API route
import Pusher from "pusher";
import { NextRequest, NextResponse } from "next/server";

const pusher = new Pusher({
  appId:   process.env.PUSHER_APP_ID!,
  key:     process.env.PUSHER_KEY!,
  secret:  process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS:  true,
});

export async function POST(req: NextRequest) {
  const { channel, event, data } = await req.json();

  await pusher.trigger(channel, event, data);
  return NextResponse.json({ ok: true });
}`} />

      <Callout type="info" title="VERCEL DEPLOYMENT">
        On Vercel Edge/Serverless, you <strong style={{ color: "#5dade2" }}>cannot</strong> run a persistent WebSocket server. Options: (1) Use a managed WS service, (2) Deploy your custom server on Railway / Fly.io / VPS, (3) Use Vercel's <strong style={{ color: "#5dade2" }}>Durable Objects</strong> (via Workers — beta).
      </Callout>
    </div>
  ),

  patterns: () => (
    <div>
      <SH1>UI Patterns</SH1>
      <P>Common, production-tested patterns for surfacing WebSocket state and data in your React UI.</P>

      <SH2>Connection Status Indicator</SH2>
      <CodeBlock lang="tsx" code={`// components/WSStatusBadge.tsx
"use client";

type Status = "idle" | "connecting" | "connected" | "disconnected" | "error";

const CONFIG: Record<Status, { color: string; label: string; pulse: boolean }> = {
  idle:         { color: "#6b7280", label: "Offline",      pulse: false },
  connecting:   { color: "#f59e0b", label: "Connecting…",  pulse: true  },
  connected:    { color: "#10b981", label: "Live",         pulse: true  },
  disconnected: { color: "#ef4444", label: "Disconnected", pulse: false },
  error:        { color: "#ef4444", label: "Error",        pulse: false },
};

export function WSStatusBadge({ status }: { status: Status }) {
  const cfg = CONFIG[status];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8,
      background: cfg.color + "18", border: \`1px solid \${cfg.color}44\`,
      borderRadius: 20, padding: "4px 12px" }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: cfg.color,
        boxShadow: cfg.pulse ? \`0 0 0 0 \${cfg.color}\` : "none",
        animation: cfg.pulse ? "ws-pulse 2s infinite" : "none",
      }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>
        {cfg.label}
      </span>
    </div>
  );
}
// CSS: @keyframes ws-pulse { 0%,100%{box-shadow:0 0 0 0 currentColor44} 50%{box-shadow:0 0 0 6px transparent} }`} />

      <SH2>Optimistic UI Updates</SH2>
      <CodeBlock lang="tsx" code={`"use client";
import { useState, useOptimistic } from "react";

interface Message { id: string; content: string; status: "sending"|"sent"|"failed"; }

export function OptimisticChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (state, newMsg: Message) => [...state, newMsg]
  );

  const { sendJSON } = useWebSocket(process.env.NEXT_PUBLIC_WS_URL!);

  const sendMessage = async (content: string) => {
    const id = crypto.randomUUID();

    // 1. Immediately show in UI as "sending"
    addOptimistic({ id, content, status: "sending" });

    // 2. Actually send over WebSocket
    const ok = sendJSON({ type: "chat", id, content });

    if (!ok) {
      // Update to "failed" state
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "failed" } : m));
    }
  };

  return (
    <ul>
      {optimisticMessages.map(m => (
        <li key={m.id} style={{ opacity: m.status === "sending" ? 0.6 : 1 }}>
          {m.content}
          {m.status === "failed" && <span style={{color:"red"}}> (failed)</span>}
        </li>
      ))}
    </ul>
  );
}`} />

      <SH2>Presence Indicator (Who's Online)</SH2>
      <CodeBlock lang="tsx" code={`"use client";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect } from "react";

interface User { id: string; name: string; avatar: string; }

export function PresenceIndicator({ roomId }: { roomId: string }) {
  const [online, setOnline] = useState<User[]>([]);
  const { lastMessage, status, sendJSON } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL!
  );

  useEffect(() => {
    if (status === "connected") {
      sendJSON({ type: "join", roomId, tracking: "presence" });
    }
  }, [status, roomId]);

  useEffect(() => {
    if (!lastMessage || typeof lastMessage.data !== "string") return;
    try {
      const msg = JSON.parse(lastMessage.data);
      if (msg.type === "presence_update") setOnline(msg.users);
    } catch {}
  }, [lastMessage]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: -8 }}>
      {online.slice(0, 5).map((user, i) => (
        <img key={user.id} src={user.avatar} alt={user.name}
          title={user.name}
          style={{ width: 32, height: 32, borderRadius: "50%",
            border: "2px solid #1e293b", marginLeft: i === 0 ? 0 : -8,
            zIndex: online.length - i }}
        />
      ))}
      {online.length > 5 && (
        <div style={{ width: 32, height: 32, borderRadius: "50%",
          background: "#334155", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 11, color: "#94a3b8",
          marginLeft: -8, border: "2px solid #1e293b" }}>
          +{online.length - 5}
        </div>
      )}
      {online.length > 0 && (
        <span style={{ marginLeft: 12, fontSize: 12, color: "#64748b" }}>
          {online.length} online
        </span>
      )}
    </div>
  );
}`} />
    </div>
  ),

  security: () => (
    <div>
      <SH1>Security</SH1>
      <P>WebSocket connections are long-lived and bypass standard HTTP security headers on every frame. Apply these defences at connection time.</P>

      <div style={{ display: "grid", gap: 10, margin: "20px 0" }}>
        {[
          { title: "Authenticate on connect", color: "danger", body: "Pass a JWT or session token in the connection URL query param or in the first message after connecting. Never allow an unauthenticated connection to persist." },
          { title: "Validate the Origin header", color: "warn", body: "The browser always sends the Origin header on WS upgrade — unlike other headers, this cannot be spoofed by JavaScript. Reject connections from unexpected origins." },
          { title: "Use wss:// in production", color: "info", body: "Always use TLS (wss://) in production. Plain ws:// exposes all message content to network eavesdroppers and is blocked by many corporate proxies." },
          { title: "Validate every message", color: "tip", body: "Never trust message structure. Validate shape, length, and types with zod or similar before acting on any message. Reject malformed messages immediately." },
          { title: "Rate limiting", color: "warn", body: "Track messages per client per second. Disconnect clients that exceed your threshold to prevent message flooding DoS attacks." },
        ].map(item => <Callout key={item.title} type={item.color} title={item.title}>{item.body}</Callout>)}
      </div>

      <SH2>Authentication Pattern</SH2>
      <CodeBlock lang="typescript" title="server.ts — authenticated upgrade" code={`import { verify } from "jsonwebtoken";

server.on("upgrade", (req, socket, head) => {
  const { pathname, query } = parse(req.url!, true);

  if (pathname !== "/ws") { socket.destroy(); return; }

  // ─── 1. Validate Origin ───────────────────────────────────────────
  const origin = req.headers.origin;
  const allowed = ["https://myapp.com", "http://localhost:3000"];
  if (origin && !allowed.includes(origin)) {
    socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
    socket.destroy();
    return;
  }

  // ─── 2. Verify JWT from query param ───────────────────────────────
  // Client: new WebSocket(\`wss://api.com/ws?token=\${jwt}\`)
  const token = query.token as string;
  if (!token) { socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n"); socket.destroy(); return; }

  try {
    const payload = verify(token, process.env.JWT_SECRET!) as { sub: string };

    wss.handleUpgrade(req, socket, head, (ws) => {
      // Attach user data to the socket for use in message handlers
      (ws as any).userId = payload.sub;
      wss.emit("connection", ws, req);
    });
  } catch {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});

// ─── 3. Rate limiting per client ─────────────────────────────────────
const rateLimits = new Map<string, { count: number; reset: number }>();

wss.on("connection", (ws: any) => {
  ws.on("message", () => {
    const now = Date.now();
    const state = rateLimits.get(ws.userId) ?? { count: 0, reset: now + 1000 };

    if (now > state.reset) {
      state.count = 0;
      state.reset = now + 1000;
    }

    state.count++;
    rateLimits.set(ws.userId, state);

    if (state.count > 50) { // Max 50 messages/second
      ws.close(1008, "Rate limit exceeded");
      return;
    }
  });
});`} />
    </div>
  ),

  ref: () => (
    <div>
      <SH1>Quick Reference</SH1>
      <P>Everything in one place for when you just need the syntax.</P>

      <SH2>WebSocket API Cheatsheet</SH2>
      <CodeBlock lang="typescript" code={`// ─── Constructor ─────────────────────────────────────────────────
const ws = new WebSocket(url);
const ws = new WebSocket(url, "protocol");         // Single subprotocol
const ws = new WebSocket(url, ["p1", "p2"]);       // Multiple subprotocols

// ─── Properties ──────────────────────────────────────────────────
ws.readyState       // 0=CONNECTING 1=OPEN 2=CLOSING 3=CLOSED
ws.binaryType       // "blob" (default) | "arraybuffer"
ws.bufferedAmount   // Bytes queued to send
ws.protocol         // Negotiated subprotocol
ws.url              // Connection URL
ws.extensions       // Negotiated extensions

// ─── Events ──────────────────────────────────────────────────────
ws.onopen    = (e: Event) => {}
ws.onclose   = (e: CloseEvent) => { e.code; e.reason; e.wasClean; }
ws.onmessage = (e: MessageEvent) => { e.data; e.origin; e.lastEventId; }
ws.onerror   = (e: Event) => {}

// ─── Methods ─────────────────────────────────────────────────────
ws.send(data)           // string | ArrayBuffer | Blob | TypedArray
ws.close()              // Normal close (1000)
ws.close(code, reason)  // Custom close

// ─── Server (ws library) ─────────────────────────────────────────
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
wss.clients              // Set<WebSocket> of all connections
wss.clients.size         // Number of connected clients
ws.send(data, callback)
ws.ping(data, mask, cb)
ws.terminate()           // Force close without handshake`} />

      <SH2>Close Codes Reference</SH2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0a1520" }}>
              {["Code", "Name", "Reconnect?", "Description"].map(h => (
                <th key={h} style={{ padding: "9px 14px", textAlign: "left", color: "#4d7fa8", borderBottom: "1px solid #1e2d3d" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ["1000", "Normal Closure", "No", "Intentional close. Don't reconnect."],
              ["1001", "Going Away", "Yes", "Page unload or server restart."],
              ["1002", "Protocol Error", "No", "Invalid frame — don't retry same session."],
              ["1003", "Unsupported Data", "No", "e.g. received binary when expecting text."],
              ["1005", "No Status", "—", "Absence of code (internal only)."],
              ["1006", "Abnormal Closure", "Yes", "Network drop — always reconnect with backoff."],
              ["1007", "Invalid Payload", "No", "Non-UTF-8 text frame."],
              ["1008", "Policy Violation", "No", "Auth failure or rate limit."],
              ["1009", "Message Too Big", "No", "Payload exceeds server limit."],
              ["1011", "Internal Error", "Yes", "Server-side bug — safe to retry."],
              ["1012", "Service Restart", "Yes", "Server restarting — reconnect after delay."],
              ["4000–4999", "App Defined", "—", "Your custom application codes."],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#060f17" : "#08131d" }}>
                {row.map((cell, j) => (
                  <td key={j} style={{
                    padding: "8px 14px",
                    color: j === 0 ? "#5dade2" : j === 2 ? (cell === "Yes" ? "#4ade80" : cell === "No" ? "#f87171" : "#6b8fa8") : "#7a9bb5",
                    borderBottom: "1px solid #0d1f2d"
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SH2>Environment Variables Template</SH2>
      <CodeBlock lang="env" title=".env.local" code={`# WebSocket server
NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws
NEXT_PUBLIC_WS_URL_PROD=wss://api.yourdomain.com/ws

# Auth
JWT_SECRET=your-super-secret-key-min-32-chars

# If using Socket.io
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# If using managed service (e.g. Pusher)
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=ap4
PUSHER_APP_ID=your-app-id
PUSHER_SECRET=your-secret`} />
    </div>
  ),
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; background: #FFFFFF; font-family: 'Inter', -apple-system, sans-serif; color: #172B4D; }
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #DFE1E6; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #C1C7D0; }
  .c-comment { color: #42526E; font-style: italic; }
  .c-str     { color: #00875A; }
  .c-kw      { color: #0052CC; font-weight: 600; }
  .c-type    { color: #6554C0; }
  .c-num     { color: #DE350B; }
  .c-fn      { color: #0065FF; }
  .c-directive { color: #FF8B00; }
  @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
`;

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("intro");
  const [viewMode, setViewMode] = useState("board"); // "board" or "detail"
  const mainRef = useRef(null);

  const navigate = (id) => {
    setActive(id);
    setViewMode("detail");
    setTimeout(() => mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const columns = [
    { title: "TO DO", color: "#42526E", items: NAV.slice(0, 3) },
    { title: "IN PROGRESS", color: "#0052CC", items: NAV.slice(3, 6) },
    { title: "CODE REVIEW", color: "#FF8B00", items: NAV.slice(6, 9) },
    { title: "DONE", color: "#00875A", items: NAV.slice(9) }
  ];

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", color: "#172B4D" }}>


        {/* Project Sidebar */}
        <aside style={{ width: 240, background: "#F4F5F7", borderRight: "1px solid #DFE1E6", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: "24px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "#6554C0", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚀</div>
            <div><div style={{ fontWeight: 600, fontSize: 14 }}>Websocket UI</div><div style={{ fontSize: 12, color: "#42526E" }}>Documentation</div></div>
          </div>
          <nav style={{ flex: 1, padding: 8 }}>

            <div style={{ margin: "16px 0", borderTop: "1px solid #DFE1E6" }} />
            <div style={{ padding: "0 12px 8px", color: "#42526E", fontSize: 11, fontWeight: 700 }}>SECTIONS</div>
            {NAV.map(n => (
              <div key={n.id} onClick={() => navigate(n.id)} style={{
                padding: "6px 12px 6px 36px", fontSize: 13, cursor: "pointer",
                color: active === n.id && viewMode === "detail" ? "#0052CC" : "#42526E",
                background: active === n.id && viewMode === "detail" ? "#DEEBFF" : "transparent", borderRadius: 4
              }}>{n.label}</div>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main ref={mainRef} style={{ flex: 1, background: "#FFF", overflowY: "auto" }}>
          <div style={{ padding: "24px 40px" }}>
            <div style={{ fontSize: 12, color: "#42526E", marginBottom: 8 }}>Projects  /  Websocket UI</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 600 }}>{viewMode === "board" ? "Board" : NAV.find(n => n.id === active)?.label}</h1>
              <div style={{ display: "flex", gap: 8 }}><button style={{ background: "#EBECF0", border: "none", borderRadius: 3, padding: "6px 12px", fontSize: 14, cursor: "pointer", color: "#42526E" }}>Share</button></div>
            </div>

            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 32 }}>
              <div style={{ position: "relative", width: 240 }}>
                <input type="text" placeholder="Search this board" style={{ padding: "8px 12px 8px 32px", border: "2px solid #DFE1E6", borderRadius: 3, fontSize: 14, outline: "none", width: "100%", color: "#172B4D" }} />
                <span style={{ position: "absolute", left: 10, top: 10, fontSize: 14, color: "#42526E" }}>🔍</span>
              </div>
              <div style={{ color: "#42526E", fontSize: 14 }}>Quick Filters:</div>
              {["Only my issues", "Recently updated"].map(f => <button key={f} style={{ background: "none", border: "none", color: "#42526E", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>{f}</button>)}
            </div>

            {viewMode === "board" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, minHeight: 600 }}>
                {columns.map(col => (
                  <div key={col.title} style={{ background: "#F4F5F7", borderRadius: 4, padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ padding: "8px 12px", color: "#42526E", fontSize: 12, fontWeight: 600 }}>{col.title} {col.items.length}</div>
                    {col.items.map(item => (
                      <div key={item.id} onClick={() => navigate(item.id)} style={{
                        background: "#FFF", borderRadius: 3, padding: 12, boxShadow: "0 1px 1px rgba(9,30,66,.25)",
                        cursor: "pointer", border: "1px solid #DFE1E6"
                      }}>
                        <div style={{ fontSize: 14, marginBottom: 12 }}>{item.label}</div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 11, background: "#DEEBFF", color: "#0747A6", padding: "2px 6px", borderRadius: 3, fontWeight: 700 }}>{item.id.toUpperCase()}</div>
                          <span style={{ fontSize: 12 }}>⚡</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 900 }}>
                {CONTENT[active]?.()}
                <button onClick={() => setViewMode("board")} style={{ marginTop: 60, background: "none", border: "none", color: "#0052CC", fontWeight: 600, cursor: "pointer", padding: "20px 0", borderTop: "1px solid #DFE1E6", width: "100%", textAlign: "left" }}>← Back to Board</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
