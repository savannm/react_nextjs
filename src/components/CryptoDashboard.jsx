"use client";

/**
 * CryptoDashboard.jsx
 *
 * Real-time cryptocurrency price tracker.
 * Works in both Next.js (App Router / Pages Router) and plain React.
 *
 * API used: CoinGecko public REST API (no key required)
 *   https://api.coingecko.com/api/v3/coins/markets
 *
 * Features
 * ─────────
 * • Polls live prices every 30 s with useEffect + setInterval
 * • Shows price, 24-h change, market cap, sparkline badge
 * • Abort controller cancels in-flight fetch on unmount / re-fetch
 * • Full loading skeleton + graceful error state
 * • All styling via inline CSS-in-JS (zero dependencies beyond React)
 */

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Config ──────────────────────────────────────────────────────────────────

const COINS = ["bitcoin", "ethereum", "solana", "avalanche-2", "chainlink"];
const POLL_INTERVAL_MS = 30_000;

const API_URL =
    `https://api.coingecko.com/api/v3/coins/markets` +
    `?vs_currency=usd` +
    `&ids=${COINS.join(",")}` +
    `&order=market_cap_desc` +
    `&sparkline=false` +
    `&price_change_percentage=24h`;

// ─── Palette & tokens ─────────────────────────────────────────────────────────

const T = {
    bg: "#09090f",
    surface: "#0f0f1a",
    border: "#1e1e32",
    accent: "#6c63ff",
    accentDim: "rgba(108,99,255,0.15)",
    up: "#00e5a0",
    upDim: "rgba(0,229,160,0.12)",
    down: "#ff4f6b",
    downDim: "rgba(255,79,107,0.12)",
    muted: "#4a4a6a",
    text: "#e0dfff",
    subtext: "#7c7c9e",
    font: "'DM Mono', 'Fira Code', monospace",
    display: "'Syne', 'Space Grotesk', sans-serif",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = {
    usd: (n) =>
        n >= 1_000_000_000
            ? `$${(n / 1_000_000_000).toFixed(2)}B`
            : n >= 1_000_000
                ? `$${(n / 1_000_000).toFixed(2)}M`
                : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    price: (n) =>
        n < 1
            ? `$${n.toFixed(6)}`
            : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    pct: (n) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`,
    time: (d) =>
        d.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Skeleton({ w = "100%", h = 16, r = 6 }) {
    return (
        <div
            style={{
                width: w, height: h, borderRadius: r,
                background: `linear-gradient(90deg, ${T.border} 25%, #1a1a2e 50%, ${T.border} 75%)`,
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
            }}
        />
    );
}

function Badge({ pct }) {
    const pos = pct >= 0;
    return (
        <span
            style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 10px", borderRadius: 99,
                background: pos ? T.upDim : T.downDim,
                color: pos ? T.up : T.down,
                fontFamily: T.font, fontSize: 13, fontWeight: 600,
                letterSpacing: "0.02em",
            }}
        >
            <span style={{ fontSize: 10 }}>{pos ? "▲" : "▼"}</span>
            {fmt.pct(Math.abs(pct))}
        </span>
    );
}

function CoinRow({ coin, index, flash }) {
    const pos = coin.price_change_percentage_24h >= 0;
    const isFlashing = flash === coin.id;

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "2rem 1fr auto auto",
                alignItems: "center",
                gap: "0 20px",
                padding: "18px 24px",
                borderBottom: `1px solid ${T.border}`,
                background: isFlashing
                    ? pos ? T.upDim : T.downDim
                    : "transparent",
                transition: "background 0.6s ease",
                cursor: "default",
            }}
        >
            {/* Rank */}
            <span style={{ color: T.muted, fontFamily: T.font, fontSize: 12 }}>
                {String(index + 1).padStart(2, "0")}
            </span>

            {/* Coin identity */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                    src={coin.image}
                    alt={coin.name}
                    width={32}
                    height={32}
                    style={{ borderRadius: "50%", background: T.border }}
                />
                <div>
                    <div style={{ fontFamily: T.display, fontSize: 15, fontWeight: 700, color: T.text }}>
                        {coin.name}
                    </div>
                    <div style={{ fontFamily: T.font, fontSize: 11, color: T.subtext, letterSpacing: "0.08em" }}>
                        {coin.symbol.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Market cap */}
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: T.font, fontSize: 11, color: T.subtext }}>MKT CAP</span>
                <span style={{ fontFamily: T.font, fontSize: 13, color: T.subtext }}>
                    {fmt.usd(coin.market_cap)}
                </span>
            </div>

            {/* Price + change */}
            <div style={{ textAlign: "right", minWidth: 140 }}>
                <div
                    style={{
                        fontFamily: T.font, fontSize: 18, fontWeight: 700,
                        color: isFlashing ? (pos ? T.up : T.down) : T.text,
                        transition: "color 0.6s ease",
                        letterSpacing: "-0.02em",
                    }}
                >
                    {fmt.price(coin.current_price)}
                </div>
                <div style={{ marginTop: 4 }}>
                    <Badge pct={coin.price_change_percentage_24h} />
                </div>
            </div>
        </div>
    );
}

function SkeletonRow() {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "2rem 1fr auto auto",
                alignItems: "center",
                gap: "0 20px",
                padding: "20px 24px",
                borderBottom: `1px solid ${T.border}`,
            }}
        >
            <Skeleton w={20} h={12} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Skeleton w={32} h={32} r={99} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <Skeleton w={90} h={14} />
                    <Skeleton w={40} h={10} />
                </div>
            </div>
            <Skeleton w={70} h={12} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                <Skeleton w={110} h={18} />
                <Skeleton w={60} h={22} r={99} />
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CryptoDashboard() {
    const [coins, setCoins] = useState([]);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [lastUpdated, setLastUpdated] = useState(null);
    const [countdown, setCountdown] = useState(POLL_INTERVAL_MS / 1000);
    const [flashCoin, setFlashCoin] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const prevPrices = useRef({});
    const countdownRef = useRef(null);



    // ── Fetch ──────────────────────────────────────────────────────────────────

    const fetchCoins = useCallback(async (signal) => {
        setStatus((s) => (s === "idle" ? "loading" : s));

        try {
            const res = await fetch(API_URL, { signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            const data = await res.json();

            // Detect which coin price changed most → flash it
            let biggestMover = null;
            let biggestDelta = 0;
            data.forEach((c) => {
                const prev = prevPrices.current[c.id];
                if (prev !== undefined) {
                    const delta = Math.abs(c.current_price - prev);
                    if (delta > biggestDelta) { biggestDelta = delta; biggestMover = c.id; }
                }
                prevPrices.current[c.id] = c.current_price;
            });

            setCoins(data);
            setStatus("success");
            setLastUpdated(new Date());
            setCountdown(POLL_INTERVAL_MS / 1000);
            setErrorMsg("");

            if (biggestMover) {
                setFlashCoin(biggestMover);
                setTimeout(() => setFlashCoin(null), 700);
            }
        } catch (err) {
            if (err.name === "AbortError") return;
            setStatus("error");
            setErrorMsg(err.message || "Failed to fetch data.");
        }
    }, []);

    // ── Polling ────────────────────────────────────────────────────────────────

    useEffect(() => {
        const controller = new AbortController();
        fetchCoins(controller.signal);

        const poll = setInterval(() => fetchCoins(controller.signal), POLL_INTERVAL_MS);

        countdownRef.current = setInterval(() => {
            setCountdown((c) => (c > 0 ? c - 1 : POLL_INTERVAL_MS / 1000));
        }, 1000);

        return () => {
            controller.abort();
            clearInterval(poll);
            clearInterval(countdownRef.current);
        };
    }, [fetchCoins]);

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Global styles */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.bg}; }
      `}</style>

            <div
                style={{
                    minHeight: "100vh",
                    background: T.bg,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    padding: "48px 16px",
                    fontFamily: T.font,
                }}
            >
                <div style={{ width: "100%", maxWidth: 720 }}>

                    {/* ── Header ── */}
                    <div style={{ marginBottom: 32 }}>

                        <h1

                            style={{
                                fontFamily: T.display, fontSize: "clamp(28px, 5vw, 44px)",
                                fontWeight: 800, color: T.text, letterSpacing: "-0.03em",
                                lineHeight: 1.1,
                            }}
                        >
                            Crypto<span style={{ color: T.accent }}>Market</span>
                        </h1>
                        <p style={{ color: T.subtext, fontSize: 14, marginTop: 8, fontFamily: T.font }}>
                            Top assets · USD · Refreshes every {POLL_INTERVAL_MS / 1000}s
                        </p>
                    </div>

                    {/* ── Card ── */}
                    <div
                        style={{
                            background: T.surface,
                            border: `1px solid ${T.border}`,
                            borderRadius: 16,
                            overflow: "hidden",
                            animation: "fadeIn 0.4s ease both",
                        }}
                    >
                        {/* Card header */}
                        <div
                            style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "14px 24px",
                                borderBottom: `1px solid ${T.border}`,
                                background: "rgba(108,99,255,0.04)",
                            }}
                        >
                            <span style={{ fontSize: 11, color: T.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                Asset · Price · 24h
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                {lastUpdated && (
                                    <span style={{ fontSize: 11, color: T.muted }}>
                                        Updated {fmt.time(lastUpdated)}
                                    </span>
                                )}
                                {status === "success" && (
                                    <div
                                        style={{
                                            display: "flex", alignItems: "center", gap: 6,
                                            padding: "3px 10px", borderRadius: 99,
                                            border: `1px solid ${T.border}`,
                                        }}
                                    >
                                        {/* Mini countdown arc */}
                                        <svg width={12} height={12} viewBox="0 0 12 12">
                                            <circle cx={6} cy={6} r={5} fill="none" stroke={T.border} strokeWidth={1.5} />
                                            <circle
                                                cx={6} cy={6} r={5} fill="none"
                                                stroke={T.accent} strokeWidth={1.5}
                                                strokeDasharray={`${2 * Math.PI * 5}`}
                                                strokeDashoffset={`${2 * Math.PI * 5 * (1 - countdown / (POLL_INTERVAL_MS / 1000))}`}
                                                strokeLinecap="round"
                                                transform="rotate(-90 6 6)"
                                                style={{ transition: "stroke-dashoffset 1s linear" }}
                                            />
                                        </svg>
                                        <span style={{ fontSize: 11, color: T.subtext }}>{countdown}s</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── States ── */}
                        {status === "error" ? (
                            <div style={{ padding: 40, textAlign: "center" }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
                                <p style={{ color: T.down, fontSize: 14, marginBottom: 8 }}>Failed to load data</p>
                                <p style={{ color: T.muted, fontSize: 12 }}>{errorMsg}</p>
                                <button
                                    onClick={() => fetchCoins(new AbortController().signal)}
                                    style={{
                                        marginTop: 20, padding: "8px 20px", borderRadius: 8,
                                        background: T.accentDim, border: `1px solid ${T.accent}`,
                                        color: T.accent, fontFamily: T.font, fontSize: 13, cursor: "pointer",
                                    }}
                                >
                                    Retry
                                </button>
                            </div>
                        ) : status === "loading" ? (
                            Array.from({ length: COINS.length }).map((_, i) => <SkeletonRow key={i} />)
                        ) : (
                            coins.map((coin, i) => (
                                <CoinRow key={coin.id} coin={coin} index={i} flash={flashCoin} />
                            ))
                        )}
                    </div>

                    {/* ── Footer ── */}
                    <p style={{ textAlign: "center", color: T.muted, fontSize: 11, marginTop: 20, letterSpacing: "0.05em" }}>
                        {/* Data: CoinGecko Public API · No key required · Next.js / React compatible */}
                    </p>
                </div>
            </div >
        </>
    );
}
