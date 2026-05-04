"use client";
import { useState } from "react";

export default function TopBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div style={{
      width: "100%",
      background: "linear-gradient(90deg, #6d28d9 0%, #4f46e5 40%, #2563eb 70%, #0ea5e9 100%)",
      color: "#fff",
      fontSize: "13.5px",
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "10px 48px",
      position: "relative",
      zIndex: 100,
      letterSpacing: "0.2px",
      minHeight: "40px",
      overflow: "hidden",
    }}>
      {/* Subtle shimmer sweep */}
      <span style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
        animation: "bannerShimmer 3s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Pulsing dot */}
      <span style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "#4ade80",
        display: "inline-block",
        flexShrink: 0,
        boxShadow: "0 0 0 0 rgba(74,222,128,0.5)",
        animation: "bannerDot 1.8s ease-in-out infinite",
      }} />

      {/* Message */}
      <span>
        Explore the latest demo: AI Chat with Tools integration.&nbsp;
        <a
          href="https://codeplenty.vercel.app/"
          target="_blank"
          style={{
            color: "#fff",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            opacity: 0.9,
            fontWeight: 600,
          }}
        >
          Explore now →
        </a>
      </span>

      {/* Dismiss */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss banner"
        style={{
          position: "absolute",
          right: 16,
          background: "transparent",
          border: "none",
          color: "rgba(255,255,255,0.7)",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
          padding: "4px 6px",
          borderRadius: 4,
          transition: "color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
      >
        ×
      </button>

      <style>{`
        @keyframes bannerShimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bannerDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.5); }
          50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0); }
        }
      `}</style>
    </div>
  );
}
