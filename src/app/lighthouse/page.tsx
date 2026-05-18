"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import feelingsBgImg from "./feelings-bg.jpg";
import breatheBgImg from "./breathe-bg.jpg";
import feelThefeelingBgImg from "./Feel the Feeling.jpg";
import stayWithItBgImg from "./Stay With It.jpg";
import understandYourselfBgImg from "./Understand Yourself.jpg";
import letItOutBgImg from "./Let it Out.jpg";
import sitWithItCardImg from "./Sit With It.jpg";

/* ══ Day / Night theme images ═══════════════════
   Replace these two imports with your actual files:
     ./lighthouse-day.jpg
     ./lighthouse-night.jpg
   ═══════════════════════════════════════════════ */
import lhDayBgImg from "./lighthouse-day.jpg";   // 🔆 swap to your day image
import lhNightBgImg from "./lighthouse-night.jpg";         // 🌙 swap to your night image
import lhLastBgImg from "./last.jpg";                      // 🏁 Screen39Complete background


/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
type LHScreen =
  | "welcome" | "feelings-check-in" | "breathe" | "name-accept"
  | "feel-q" | "stay-with-it" | "diving"
  | "control-check" | "under-control" | "not-control"
  | "choose-response" | "closure" | "complete" | "sos-needed";

interface LHData {
  emotion: string | null;
  feelingColor: string | null;
  bodyLocation: string | null;
  intensity: number | null;
  texture: string | null;
  stayWithFeeling: boolean | null;
  stayActivity: string | null;
  divingText: string;
  divingTags: string[];
  controlCheck: string | null;
  controlText: string;
  responses: string[];
  responseNote: string;
  closure: string | null;
}

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const LH_EMOTIONS = [
  { label: "Acute Stress", col: "#E07060", bg: "rgba(224,112,96,0.15)" },
  { label: "Anxiety", col: "#A970D0", bg: "rgba(169,112,208,0.15)" },
  { label: "Overwhelm", col: "#4A7ABF", bg: "rgba(74,122,191,0.15)" },
  { label: "Grief", col: "#6090B0", bg: "rgba(96,144,176,0.15)" },
  { label: "Numbness", col: "#80A0B8", bg: "rgba(128,160,184,0.15)" },
  { label: "Frustration", col: "#D4701A", bg: "rgba(212,112,26,0.15)" },
  { label: "Loneliness", col: "#4A80B0", bg: "rgba(74,128,176,0.15)" },
  { label: "Fear", col: "#7060C0", bg: "rgba(112,96,192,0.15)" },
];

const FEELING_COLORS = [
  "#E53935", "#FF7043", "#FFB300", "#66BB6A",
  "#26C6DA", "#42A5F5", "#7E57C2", "#EC407A",
  "#78909C", "#8D6E63", "#FFFFFF", "#000000",
];

const TEXTURES = ["Heavy", "Tight", "Empty", "Sharp", "Foggy", "Buzzing", "Sinking", "Floating"];
const DIVING_TAGS = ["Work", "Health", "Relationships", "Uncertainty", "Something else"];
const CONTROL_EXAMPLES = [
  "I can talk to someone I trust",
  "I can take one small step today",
  "I can set a boundary",
  "I can focus on my breathing",
  "I can ask for help",
  "I can rest and recharge",
  "I can write down what I feel",
  "I can choose my response",
];
const RESPONSE_OPTIONS = [
  "Stay with the feeling",
  "Talk to someone",
  "Take a break",
  "Let it go",
  "Take a small step within my control",
];
const CLOSURE_OPTIONS = [
  { id: "settled", label: "I feel more settled.", col: "#D4607A" },
  { id: "processing", label: "I need more time.", col: "#C9A050" },
  { id: "support", label: "I need more support.", col: "#5B80C8" },
];

/* ═══════════════════════════════════════════════
   FEELINGS CHECK IN — CONSTANTS
═══════════════════════════════════════════════ */
const FEELINGS_EMOTIONS = [
  { label: "Happy", col: "#F9C825" },
  { label: "Angry", col: "#E85D5D" },
  { label: "Calm", col: "#6ECFB5" },
  { label: "Sad", col: "#6AACD4" },
  { label: "Worried", col: "#B497D6" },
  { label: "Silly", col: "#F4A24B" },
  { label: "Tired", col: "#90A4BA" },
  { label: "Confused", col: "#C4A86A" },
  { label: "Anxious", col: "#FF8C60" },
  { label: "Excited", col: "#FFD700" },
];
const FEELING_TYPES = ["Wobbly", "Frustrating", "Exciting", "Scary", "Confusing", "Warm", "Fun"];
const CALMING_ITEMS = [
  { label: "Calm corner", icon: <svg viewBox="0 0 60 50" width="54" height="45"><rect x="5" y="20" width="50" height="25" rx="4" fill="#2D1B60" /><path d="M8 20 Q30 5 52 20" fill="#3D2580" stroke="#5D3A90" strokeWidth="1.5" /><rect x="15" y="24" width="14" height="18" rx="3" fill="#7C3AED" opacity="0.7" /><rect x="32" y="28" width="20" height="14" rx="3" fill="#5B21B6" opacity="0.8" /><circle cx="22" cy="26" r="4" fill="#C4B5FD" opacity="0.5" /><path d="M10 45 Q20 40 30 44 Q40 40 50 44" fill="none" stroke="#8B5CF6" strokeWidth="1.5" /></svg> },
  { label: "Walk", icon: <svg viewBox="0 0 60 60" width="54" height="54"><circle cx="30" cy="10" r="7" fill="#6D28D9" /><path d="M30 17 L26 38 L18 52M30 17 L34 38 L42 52" stroke="#7C3AED" strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M26 28 L20 32M34 28 L40 32" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" /><ellipse cx="30" cy="56" rx="22" ry="3" fill="#4C1D95" opacity="0.4" /></svg> },
  { label: "Take a break", icon: <svg viewBox="0 0 60 60" width="54" height="54"><circle cx="30" cy="30" r="22" fill="#5B21B6" /><circle cx="30" cy="30" r="22" fill="none" stroke="#7C3AED" strokeWidth="3" /><rect x="22" y="20" width="6" height="20" rx="3" fill="#DDD6FE" /><rect x="32" y="20" width="6" height="20" rx="3" fill="#DDD6FE" /></svg> },
  { label: "Breathing", icon: <svg viewBox="0 0 60 60" width="54" height="54"><circle cx="20" cy="30" r="12" fill="#4C1D95" /><circle cx="20" cy="30" r="8" fill="#6D28D9" /><circle cx="20" cy="30" r="4" fill="#A78BFA" /><path d="M32 30 Q40 22 52 26M32 30 Q40 38 52 34" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" /><path d="M50 20 Q58 26 50 32" fill="none" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" /></svg> },
  { label: "Drink", icon: <svg viewBox="0 0 60 60" width="54" height="54"><path d="M20 12 L16 52 L44 52 L40 12Z" fill="#3D1A7A" stroke="#6D28D9" strokeWidth="2" /><path d="M22 12 Q28 22 36 12" fill="#6D28D9" opacity="0.7" /><rect x="16" y="34" width="28" height="18" rx="2" fill="#7C3AED" opacity="0.6" /><path d="M44 28 Q52 28 52 36 Q52 44 44 44" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" /><ellipse cx="30" cy="28" rx="10" ry="3" fill="#A78BFA" opacity="0.5" /></svg> },
];

/* ═══════════════════════════════════════════════
   FEELINGS CHECK IN — COMPONENTS
═══════════════════════════════════════════════ */
function EmoChar({ id, sel, col }: { id: string; sel: boolean; col: string }) {
  const chars: Record<string, React.ReactNode> = {
    Happy: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <circle cx="30" cy="22" r="20" fill="#F9A825" />
        <circle cx="30" cy="22" r="20" fill="url(#hSunLH)" opacity="0.3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <line key={a} x1={+(30 + 22 * Math.cos(a * Math.PI / 180)).toFixed(4)} y1={+(22 + 22 * Math.sin(a * Math.PI / 180)).toFixed(4)} x2={+(30 + 28 * Math.cos(a * Math.PI / 180)).toFixed(4)} y2={+(22 + 28 * Math.sin(a * Math.PI / 180)).toFixed(4)} stroke="#F9A825" strokeWidth="2.5" strokeLinecap="round" />)}
        <circle cx="23" cy="19" r="2.5" fill="#5D3A00" /><circle cx="37" cy="19" r="2.5" fill="#5D3A00" />
        <path d="M22 27 Q30 34 38 27" fill="none" stroke="#5D3A00" strokeWidth="2" strokeLinecap="round" />
        <defs><radialGradient id="hSunLH"><stop offset="0%" stopColor="#fff" /><stop offset="100%" stopColor="#F9A825" stopOpacity="0" /></radialGradient></defs>
      </svg>
    ),
    Angry: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="22" fill="#E53935" />
        <path d="M8 10 Q14 5 20 12" fill="none" stroke="#B71C1C" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 12 Q46 5 52 10" fill="none" stroke="#B71C1C" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="22" cy="23" r="3" fill="#4A0000" /><circle cx="38" cy="23" r="3" fill="#4A0000" />
        <path d="M22 34 Q30 29 38 34" fill="none" stroke="#4A0000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 17 L26 21M34 21 L42 17" stroke="#B71C1C" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    Calm: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="22" fill="#4DB6AC" />
        <circle cx="23" cy="24" r="2.5" fill="#00332E" /><circle cx="37" cy="24" r="2.5" fill="#00332E" />
        <path d="M23 33 Q30 37 37 33" fill="none" stroke="#00332E" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 18 Q22 14 26 20M34 20 Q38 14 45 18" fill="none" stroke="#26A69A" strokeWidth="1.5" />
        {[...Array(5)].map((_, i) => <circle key={i} cx={14 + i * 8} cy={+(52 + Math.sin(i) * 3).toFixed(4)} r="3" fill="#80CBC4" opacity="0.7" />)}
      </svg>
    ),
    Sad: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="19" ry="22" fill="#5C8DB8" />
        <circle cx="23" cy="22" r="2.5" fill="#1A3A5A" /><circle cx="37" cy="22" r="2.5" fill="#1A3A5A" />
        <path d="M22 33 Q30 29 38 33" fill="none" stroke="#1A3A5A" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="22" cy="22" rx="4" ry="5" fill="#90CAF9" opacity="0.4" />
        <ellipse cx="38" cy="22" rx="4" ry="5" fill="#90CAF9" opacity="0.4" />
        <path d="M24 26 Q24 36 22 40M36 26 Q36 36 38 40" stroke="#90CAF9" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Worried: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="21" fill="#7B68C8" />
        <circle cx="23" cy="23" r="2.5" fill="#1A0050" /><circle cx="37" cy="23" r="2.5" fill="#1A0050" />
        <path d="M22 33 Q30 30 38 33" fill="none" stroke="#1A0050" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 16 Q22 12 26 16M34 16 Q38 12 41 16" fill="none" stroke="#5548A0" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 16 Q30 14 34 16" stroke="#9C8FE0" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    Silly: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="21" fill="#BA68C8" />
        <circle cx="23" cy="21" r="3" fill="#4A0060" /><circle cx="37" cy="21" r="3" fill="#4A0060" />
        <circle cx="24" cy="20" r="1" fill="#fff" /><circle cx="38" cy="20" r="1" fill="#fff" />
        <path d="M20 30 Q25 38 30 30 Q35 38 40 30" fill="#CE93D8" stroke="#4A0060" strokeWidth="1.5" />
        <circle cx="22" cy="27" r="5" fill="#F48FB1" opacity="0.7" />
        <circle cx="38" cy="27" r="5" fill="#F48FB1" opacity="0.7" />
        <circle cx="30" cy="38" r="3" fill="#4A0060" />
      </svg>
    ),
    Tired: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="19" ry="22" fill="#607D8B" />
        <path d="M19 21 Q23 19 27 21" fill="none" stroke="#263238" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M33 21 Q37 19 41 21" fill="none" stroke="#263238" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M23 33 Q30 30 37 33" fill="none" stroke="#263238" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 12 Q18 8 20 14M40 14 Q42 8 46 12" stroke="#546E7A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="52" r="8" fill="#78909C" opacity="0.6" />
      </svg>
    ),
    Confused: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <path d="M30 6 L54 24 L44 52 L16 52 L6 24Z" fill="#9C7B3A" />
        <path d="M30 6 L54 24 L44 52 L16 52 L6 24Z" fill="url(#confGradLH)" opacity="0.4" />
        <circle cx="23" cy="28" r="2.5" fill="#3E2000" /><circle cx="37" cy="28" r="2.5" fill="#3E2000" />
        <path d="M24 38 Q30 35 36 38" fill="none" stroke="#3E2000" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 10 Q36 6 38 12" fill="none" stroke="#C9A050" strokeWidth="2" strokeLinecap="round" />
        <text x="33" y="13" fontSize="8" fill="#C9A050" fontWeight="bold">?</text>
        <defs><linearGradient id="confGradLH" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fff" /><stop offset="100%" stopColor="#9C7B3A" stopOpacity="0" /></linearGradient></defs>
      </svg>
    ),
    Anxious: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <ellipse cx="30" cy="26" rx="20" ry="21" fill="#E8883A" />
        {[...Array(8)].map((_, i) => { const a = i * 45 * Math.PI / 180; return <line key={i} x1={+(30 + 22 * Math.cos(a)).toFixed(4)} y1={+(26 + 22 * Math.sin(a)).toFixed(4)} x2={+(30 + 27 * Math.cos(a)).toFixed(4)} y2={+(26 + 27 * Math.sin(a)).toFixed(4)} stroke="#E8883A" strokeWidth="3" strokeLinecap="round" /> })}
        <circle cx="23" cy="23" r="3" fill="#7A3000" /><circle cx="37" cy="23" r="3" fill="#7A3000" />
        <path d="M23 33 Q27 31 30 33 Q33 31 37 33" fill="none" stroke="#7A3000" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 17 L28 21M32 21 L36 17" stroke="#C0601A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    Excited: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <circle cx="30" cy="24" r="20" fill="#FFB300" />
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map(a => <line key={a} x1={+(30 + 22 * Math.cos(a * Math.PI / 180)).toFixed(4)} y1={+(24 + 22 * Math.sin(a * Math.PI / 180)).toFixed(4)} x2={+(30 + 29 * Math.cos(a * Math.PI / 180)).toFixed(4)} y2={+(24 + 29 * Math.sin(a * Math.PI / 180)).toFixed(4)} stroke="#FF8F00" strokeWidth="2.5" strokeLinecap="round" />)}
        <circle cx="23" cy="20" r="3" fill="#5D3A00" /><circle cx="37" cy="20" r="3" fill="#5D3A00" />
        <circle cx="24" cy="19" r="1.2" fill="#fff" /><circle cx="38" cy="19" r="1.2" fill="#fff" />
        <path d="M20 28 Q25 36 30 28 Q35 36 40 28" fill="#FF8F00" stroke="#5D3A00" strokeWidth="1.5" />
        <circle cx="30" cy="31" r="2" fill="#5D3A00" />
      </svg>
    ),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", userSelect: "none", padding: "6px 4px 8px", borderRadius: 14, background: sel ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)", border: sel ? `2px solid ${col}` : "2px solid transparent", transition: "all 0.15s", transform: sel ? "scale(1.08)" : "scale(1)", boxShadow: sel ? `0 0 16px ${col}55` : "none" }}>
      {chars[id]}
      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-baloo)", color: sel ? col : "#C4B5FD", textAlign: "center", lineHeight: 1 }}>{id}</span>
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${sel ? col : "rgba(180,160,220,0.5)"}`, background: sel ? col : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
        {sel && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
      </div>
    </div>
  );
}

  /* ═══════════════════════════════════════════════
     API HELPER
  ═══════════════════════════════════════════════ */
  async function saveLighthouse(data: LHData): Promise<{ coinsAwarded: boolean }> {
    try {
      const res = await fetch("/api/lighthouse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    } catch { return { coinsAwarded: false }; }
  }

  /* ═══════════════════════════════════════════════
     SOS MODAL
  ═══════════════════════════════════════════════ */
  function SOSModal({ onClose }: { onClose: () => void }) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,8,20,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }} onClick={onClose}>
        <div style={{ background: "#0C1830", border: "1.5px solid rgba(100,150,220,0.35)", borderRadius: 24, padding: "28px 24px 24px", maxWidth: 420, width: "100%", position: "relative" }} onClick={e => e.stopPropagation()}>
          <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", color: "#6080A0", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🆘</div>
            <h2 style={{ fontFamily: "var(--font-baloo)", fontSize: 20, color: "#E07060", margin: "0 0 4px", fontWeight: 900 }}>You&apos;re Not Alone</h2>
            <p style={{ fontSize: 13, color: "#6080A0", margin: 0 }}>Reach out — help is always available.</p>
          </div>

          {/* Talk to someone */}
          <div style={{ background: "rgba(80,130,200,0.1)", border: "1.5px solid rgba(80,130,200,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#5B8AFF", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>💬 Talk to Someone</p>
            <p style={{ fontSize: 13, color: "#90B0D0", margin: 0 }}>Reach out to a trusted friend, family member, or teacher. You don&apos;t have to carry this alone.</p>
          </div>

          {/* Helplines */}
          <div style={{ background: "rgba(224,112,96,0.08)", border: "1.5px solid rgba(224,112,96,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#E07060", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.07em" }}>📞 Indian Helplines</p>
            {[
              ["iCall", "9152987821"],
              ["Vandrevala Foundation", "1860 266 2345"],
              ["AASRA", "91-22-27546669"],
            ].map(([name, num]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#C0D0E0", fontWeight: 600 }}>{name}</span>
                <a href={`tel:${num.replace(/\s/g, "")}`} style={{ fontSize: 13, color: "#E07060", fontWeight: 800, textDecoration: "none" }}>{num}</a>
              </div>
            ))}
          </div>

          {/* Book therapy */}
          <div style={{ background: "rgba(76,175,138,0.08)", border: "1.5px solid rgba(76,175,138,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#4CAF8A", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>🩺 Book Therapy</p>
            <p style={{ fontSize: 13, color: "#90B0D0", margin: 0 }}>Connect with a professional therapist who can provide personalised support.</p>
          </div>

          <button onClick={onClose} style={{ width: "100%", padding: "12px", borderRadius: 14, border: "1.5px solid rgba(100,150,220,0.3)", background: "transparent", color: "#8090B0", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Close
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SHARED LAYOUT WRAPPER
  ═══════════════════════════════════════════════ */
  function LHWrap({ children, onBack, onSOS, showBack = true, bgImg }: {
    children: React.ReactNode;
    onBack?: () => void;
    onSOS: () => void;
    showBack?: boolean;
    bgImg?: string;
  }) {
    return (
      <div style={{ minHeight: "100vh", background: bgImg ? "transparent" : "linear-gradient(160deg,#070D1E 0%,#0B1628 60%,#070D1E 100%)", fontFamily: "var(--font-nunito)", position: "relative" }}>
        {bgImg && <img src={bgImg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -1 }} />}
        {/* Top bar */}
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
          {showBack && onBack ? (
            <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          ) : <div style={{ width: 38 }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>🏮</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#C0D0F0", letterSpacing: "0.1em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>
            SOS
          </button>
        </div>
        <style>{`@keyframes sos-pulse{0%,100%{box-shadow:0 0 0 0 rgba(224,96,80,0.3)}50%{box-shadow:0 0 0 6px rgba(224,96,80,0)}}`}</style>
        <div style={{ paddingTop: 62, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {children}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     CARD SHELL
  ═══════════════════════════════════════════════ */
  function LHCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
      <div style={{ width: "100%", maxWidth: 560, padding: "0 16px 32px", ...style }}>
        <div style={{ background: "rgba(12,22,45,0.92)", border: "1.5px solid rgba(80,130,200,0.18)", borderRadius: 24, padding: "24px 20px 28px", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }}>
          {children}
        </div>
      </div>
    );
  }

  function LHBtn({ children, onClick, disabled, outline, danger }: {
    children: React.ReactNode; onClick?: () => void;
    disabled?: boolean; outline?: boolean; danger?: boolean;
  }) {
    return (
      <button onClick={onClick} disabled={disabled} style={{
        width: "100%", padding: "13px", borderRadius: 16, cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? "rgba(40,60,90,0.4)" : danger ? "linear-gradient(135deg,#C03030,#E05050)" : outline ? "transparent" : "linear-gradient(135deg,#2A4A8A,#3A6AB0)",
        border: outline ? "1.5px solid rgba(80,130,200,0.4)" : "none",
        color: disabled ? "#304060" : "#E0F0FF",
        fontSize: 15, fontWeight: 800, fontFamily: "var(--font-baloo)",
        letterSpacing: "0.04em", transition: "opacity 0.2s", opacity: disabled ? 0.5 : 1,
        boxShadow: disabled ? "none" : "0 4px 18px rgba(42,74,138,0.4)",
      }}>
        {children}
      </button>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3.0 — WELCOME
  ═══════════════════════════════════════════════ */
  function Screen30Welcome({ onNext, onBack, onSOS }: { onNext: () => void; onBack: () => void; onSOS: () => void }) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <video
          src="/lighthouse-intro.mp4"
          autoPlay muted playsInline
          onEnded={onNext}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3.2 — PAUSE & BREATHE
  ═══════════════════════════════════════════════ */
  function Screen32Breathe({ onNext, onBack, onSOS, lhBg }: { onNext: () => void; onBack: () => void; onSOS: () => void; lhBg?: string }) {
    const TOTAL = 60;
    const [timeLeft, setTimeLeft] = useState(TOTAL);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const tick = useCallback(() => {
      setTimeLeft(t => {
        if (t <= 1) { setRunning(false); setDone(true); return 0; }
        return t - 1;
      });
    }, []);

    useEffect(() => {
      if (running) { intervalRef.current = setInterval(tick, 1000); }
      else { if (intervalRef.current) clearInterval(intervalRef.current); }
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running, tick]);

    const elapsed = TOTAL - timeLeft;
    const progress = elapsed / TOTAL;

    // Ring geometry
    const SIZE = 220, R = 90, cx = 110, cy = 110;
    const circ = 2 * Math.PI * R;
    const dotRotation = progress * 360;

    // Breathing phases: 6s inhale, 6s exhale
    const phase = Math.floor(elapsed % 12 / 6);
    const PHASES = [
      { title: "Inhale deeply", sub: "Breathe in through your nose" },
      { title: "Exhale slowly", sub: "Breathe out through your mouth" },
    ];
    const currentPhase = running ? PHASES[phase] : PHASES[0];

    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 10, fontFamily: "var(--font-nunito)",
        display: "flex", flexDirection: "column", overflowY: "auto"
      }}>
        <img src={lhBg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -1 }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
          <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>🏮</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#6090C0", letterSpacing: "0.1em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>SOS</button>
        </div>

        {/* Centered card */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "clamp(60px, 10vh, 80px) 20px clamp(20px, 5vh, 40px)" }}>
          <div style={{ width: "100%", maxWidth: 520, margin: "auto", background: "rgba(8,14,32,0.72)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 28, padding: "clamp(24px, 4vh, 36px) clamp(20px, 5vw, 32px)", backdropFilter: "blur(24px)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", textAlign: "center" }}>

            {/* Title */}
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px, 5vw, 34px)", fontWeight: 700, color: "#F0F4FF", margin: "0 0 8px", letterSpacing: "0.01em" }}>Pause &amp; Breathe</h2>
            <p style={{ fontSize: 15, color: "rgba(180,200,240,0.6)", margin: "0 0 clamp(16px, 4vh, 32px)", fontWeight: 400 }}>Take a moment for yourself.</p>

            {/* Ring */}
            <div style={{ position: "relative", width: SIZE, height: SIZE, margin: "0 auto clamp(16px, 4vh, 28px)" }}>
              <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ transform: "rotate(-90deg)", display: "block" }}>
                <defs>
                  <linearGradient id="breathRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5B8AFF" />
                    <stop offset="100%" stopColor="#9B5BF5" />
                  </linearGradient>
                </defs>
                {/* track */}
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
                {/* arc */}
                <circle cx={cx} cy={cy} r={R} fill="none" stroke="url(#breathRingGrad)" strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${circ * Math.max(progress, 0.01)} ${circ}`}
                  style={{ transition: "stroke-dasharray 0.95s linear" }} />
                {/* leading dot */}
                <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${dotRotation}deg)`, transition: "transform 0.95s linear" }}>
                  <circle cx={cx + R} cy={cy} r="9" fill="white" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))" }} />
                </g>
              </svg>
              {/* center number */}
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "Georgia,serif", fontSize: 52, fontWeight: 700, color: "#F0F4FF", lineHeight: 1 }}>{timeLeft}</span>
                <span style={{ fontSize: 13, color: "rgba(180,200,240,0.5)", marginTop: 4, letterSpacing: "0.06em" }}>seconds</span>
              </div>
            </div>

            {/* Breathing cue */}
            <div style={{ marginBottom: "clamp(16px, 4vh, 32px)", minHeight: 48 }}>
              {done ? (
                <p style={{ fontSize: 20, color: "#4CAF8A", fontWeight: 700 }}>Well done. 🌿</p>
              ) : (
                <>
                  <p style={{ fontSize: 22, color: "#8B6FE8", fontWeight: 600, margin: "0 0 6px", fontStyle: "italic" }}>{currentPhase.title}</p>
                  <p style={{ fontSize: 14, color: "rgba(160,180,220,0.6)", margin: 0 }}>{currentPhase.sub}</p>
                </>
              )}
            </div>

            {/* Buttons */}
            <div className="resp-breathe-btns" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {/* Start */}
              <button onClick={() => { if (!running && !done) setRunning(true); }}
                style={{ flex: 1, padding: "14px 10px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(200,220,255,0.8)", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-nunito)" }}>
                &#9654; Start
              </button>
              {/* Pause */}
              <button onClick={() => { if (running) setRunning(false); else if (!done && elapsed > 0) setRunning(true); }}
                style={{ flex: 1, padding: "14px 10px", borderRadius: 50, border: "none", background: running ? "linear-gradient(135deg,#5B8AFF,#9B5BF5)" : "rgba(255,255,255,0.06)", color: running ? "#fff" : "rgba(200,220,255,0.5)", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-nunito)", boxShadow: running ? "0 4px 20px rgba(100,100,255,0.4)" : "none" }}>
                &#9646;&#9646; Pause
              </button>
              {/* Done */}
              <button onClick={onNext}
                style={{ flex: 1, padding: "14px 10px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(200,220,255,0.8)", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--font-nunito)" }}>
                &#10003; Done
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3.3 — NAME & ACCEPT
  ═══════════════════════════════════════════════ */
  function Screen33NameAccept({ onNext, onBack, onSOS, data, setData, lhBg }: {
    onNext: () => void; onBack: () => void; onSOS: () => void;
    data: LHData; setData: (d: Partial<LHData>) => void; lhBg?: string;
  }) {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const bodyParts = ["Head", "Chest", "Stomach", "Arms", "Legs"];

    const textureOptions = [
      { id: "Smooth", label: "Smooth", icon: (col: string) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 12 Q8 4 12 12 T21 12" fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" /></svg> },
      { id: "Rough", label: "Rough", icon: (col: string) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 14 L7 8 L12 16 L17 8 L21 14" fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg> },
      { id: "Heavy", label: "Heavy", icon: (col: string) => <svg width="24" height="24" viewBox="0 0 24 24"><g fill={col}><circle cx="7" cy="7" r="1.5" /><circle cx="12" cy="7" r="1.5" /><circle cx="17" cy="7" r="1.5" /><circle cx="7" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="17" cy="12" r="1.5" /><circle cx="7" cy="17" r="1.5" /><circle cx="12" cy="17" r="1.5" /><circle cx="17" cy="17" r="1.5" /></g></svg> },
      { id: "Light", label: "Light", icon: (col: string) => <svg width="24" height="24" viewBox="0 0 24 24"><g fill={col}><circle cx="8" cy="8" r="1" /><circle cx="16" cy="8" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="8" cy="16" r="1" /><circle cx="16" cy="16" r="1" /></g></svg> },
      { id: "Tight", label: "Tight", icon: (col: string) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M6 9H18M6 12H18M6 15H18" fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" /></svg> },
      { id: "Flowing", label: "Flowing", icon: (col: string) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 8 Q8 4 12 8 T21 8 M3 12 Q8 8 12 12 T21 12 M3 16 Q8 12 12 16 T21 16" fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" /></svg> },
    ];

    const val = data.intensity ?? 7;
    const bgSize = `${(val - 1) * 100 / 9}% 100%`;

    return (
      <LHWrap onBack={onBack} onSOS={onSOS} bgImg={lhBg}>
        <style>{`
        .lh-slider { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; outline: none; transition: background 0.15s; }
        .lh-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #fff; border: 5px solid #5B8AFF; cursor: pointer; box-shadow: 0 0 10px rgba(91,138,255,0.6); margin-top: -9px; }
        .lh-slider::-webkit-slider-runnable-track { width: 100%; height: 4px; border-radius: 2px; }
      `}</style>

        <div style={{ width: "100%", maxWidth: 560, padding: "0 16px 40px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>

          <div style={{ width: "100%", background: "rgba(6,10,24,0.85)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 28, padding: "32px 20px", backdropFilter: "blur(24px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>

            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: 32, color: "#F0F4FF", margin: "0 0 8px", fontWeight: 400 }}>Name &amp; Accept</h2>
              <p style={{ fontSize: 14, color: "#8AAAD0", margin: 0 }}>Name your feeling to better understand it.</p>
            </div>

            {/* 1. Colour */}
            <div style={{ background: "rgba(16,24,48,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, background: "conic-gradient(from 0deg, hsl(0,85%,60%), hsl(60,85%,60%), hsl(120,85%,60%), hsl(180,85%,60%), hsl(240,85%,60%), hsl(300,85%,60%), hsl(360,85%,60%))", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", cursor: "pointer" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#E0E8F5", marginBottom: 4 }}>
                    1. Colour of feeling
                  </div>
                  <div style={{ fontSize: 12, color: "#8AAAD0", lineHeight: 1.4 }}>Tap to choose a colour that represents how you feel right now.</div>
                </div>
                <div onClick={() => setShowColorPicker(!showColorPicker)} style={{ width: 44, height: 44, borderRadius: 10, background: data.feelingColor || "transparent", border: "2px solid rgba(255,255,255,0.1)", flexShrink: 0, transition: "background 0.1s", cursor: "pointer" }} />
              </div>
              {showColorPicker && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 16, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: 13, color: "#8AAAD0", marginBottom: 20 }}>Drag around the wheel to select your hue</div>
                  <div
                    onPointerDown={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.setPointerCapture(e.pointerId);

                      const updateColor = (clientX: number, clientY: number) => {
                        const rect = el.getBoundingClientRect();
                        const x = clientX - rect.left;
                        const y = clientY - rect.top;
                        const cx = rect.width / 2, cy = rect.height / 2;
                        let deg = (Math.atan2(y - cy, x - cx) * 180 / Math.PI) + 90;
                        if (deg < 0) deg += 360;

                        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
                        const r = Math.min(cx, dist); // Clamp to circle radius
                        const sat = Math.round((r / cx) * 100);

                        setData({ feelingColor: `hsl(${Math.round(deg)}, ${sat}%, 60%)` });
                      };
                      updateColor(e.clientX, e.clientY);

                      const handleMove = (ev: PointerEvent) => updateColor(ev.clientX, ev.clientY);
                      const handleUp = (ev: PointerEvent) => {
                        el.releasePointerCapture(ev.pointerId);
                        window.removeEventListener('pointermove', handleMove);
                        window.removeEventListener('pointerup', handleUp);
                      };
                      window.addEventListener('pointermove', handleMove);
                      window.addEventListener('pointerup', handleUp);
                    }}
                    style={{ width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle closest-side, #999 0%, rgba(153,153,153,0) 100%), conic-gradient(from 0deg, hsl(0,100%,60%), hsl(60,100%,60%), hsl(120,100%,60%), hsl(180,100%,60%), hsl(240,100%,60%), hsl(300,100%,60%), hsl(360,100%,60%))", boxShadow: "0 10px 40px rgba(0,0,0,0.6)", cursor: "default", touchAction: "none", position: "relative" }}
                  >
                    {(() => {
                      if (!data.feelingColor) return null;
                      const match = data.feelingColor.match(/hsl\((\d+),\s*(\d+)%/);
                      if (!match) return null;
                      const hue = parseInt(match[1]);
                      const sat = parseInt(match[2]);
                      const radius = (sat / 100) * 100; // 100 is max radius
                      const angleRad = (hue - 90) * Math.PI / 180;
                      const thumbX = 100 + radius * Math.cos(angleRad);
                      const thumbY = 100 + radius * Math.sin(angleRad);
                      return (
                        <div style={{
                          position: "absolute", top: thumbY, left: thumbX, width: 28, height: 28, borderRadius: "50%",
                          background: data.feelingColor, border: "4px solid #fff", boxShadow: "0 0 12px rgba(0,0,0,0.4)",
                          transform: "translate(-50%, -50%)",
                          pointerEvents: "none"
                        }} />
                      );
                    })()}
                  </div>
                  <div style={{ marginTop: 28, width: "100%", display: "flex", justifyContent: "center" }}>
                    <button onClick={() => setShowColorPicker(false)} style={{ padding: "10px 32px", background: "rgba(91,138,255,0.15)", color: "#A0C8F0", borderRadius: 20, fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", transition: "background 0.15s" }} onMouseOver={e => e.currentTarget.style.background = "rgba(91,138,255,0.25)"} onMouseOut={e => e.currentTarget.style.background = "rgba(91,138,255,0.15)"}>
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Body location */}
            <div style={{ background: "rgba(16,24,48,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 60, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg viewBox="0 0 24 32" width="36" height="48" style={{ opacity: 0.4 }}>
                    <path d="M12 2C9.8 2 8 3.8 8 6C8 8.2 9.8 10 12 10C14.2 10 16 8.2 16 6C16 3.8 14.2 2 12 2ZM6 12C3.8 12 2 13.8 2 16V22C2 23.1 2.9 24 4 24H6V32H18V24H20C21.1 24 22 23.1 22 22V16C22 13.8 20.2 12 18 12H6Z" fill="#8AAAD0" />
                  </svg>
                  <div style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: "#fff", boxShadow: "0 0 12px 6px #5B8AFF", top: 22 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#E0E8F5", marginBottom: 4 }}>
                    2. Body location
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                {bodyParts.map(bp => (
                  <div key={bp} onClick={() => setData({ bodyLocation: data.bodyLocation === bp ? null : bp })}
                    style={{
                      padding: "8px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 500,
                      border: `1.5px solid ${data.bodyLocation === bp ? "#5B8AFF" : "rgba(80,120,180,0.2)"}`,
                      background: data.bodyLocation === bp ? "rgba(91,138,255,0.15)" : "transparent",
                      color: data.bodyLocation === bp ? "#A0C8F0" : "#8AAAD0"
                    }}>
                    {bp}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Intensity */}
            <div style={{ background: "rgba(16,24,48,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#E0E8F5", marginBottom: 4 }}>
                    3. Intensity
                  </div>
                  <div style={{ fontSize: 12, color: "#8AAAD0", marginBottom: 16 }}>How strong is this feeling?</div>

                  <input type="range" className="lh-slider" min="1" max="10" value={val} onChange={e => setData({ intensity: parseInt(e.target.value) })}
                    style={{ background: `linear-gradient(#5B8AFF, #5B8AFF) 0/ ${bgSize} no-repeat rgba(255,255,255,0.1)` }} />

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                    <span style={{ fontSize: 11, color: "#6080A0" }}>1 Very mild</span>
                    <span style={{ fontSize: 11, color: "#6080A0" }}>Very intense 10</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid #4A6A90", display: "flex", alignItems: "center", justifyContent: "center", color: "#4A6A90", fontSize: 10, fontStyle: "italic", fontWeight: 700 }}>i</div>
                    <span style={{ fontSize: 11, color: "#4A6A90" }}>This value will be recorded for your Cave engine.</span>
                  </div>
                </div>
                <div style={{ width: 64, height: 76, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)", flexShrink: 0 }}>
                  <div style={{ fontSize: 28, fontWeight: 400, fontFamily: "Georgia,serif", color: "#fff", lineHeight: 1 }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#6080A0", marginTop: 6 }}>/ 10</div>
                </div>
              </div>
            </div>

            {/* 4. Texture */}
            <div style={{ background: "rgba(16,24,48,0.4)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: "16px", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="#6080A0">
                    <circle cx="10" cy="4" r="1.5" /><circle cx="16" cy="10" r="1.5" /><circle cx="10" cy="16" r="1.5" /><circle cx="4" cy="10" r="1.5" />
                    <circle cx="10" cy="10" r="1.5" /><circle cx="6" cy="6" r="1.5" /><circle cx="14" cy="14" r="1.5" /><circle cx="14" cy="6" r="1.5" /><circle cx="6" cy="14" r="1.5" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#E0E8F5", marginBottom: 2 }}>
                    4. Texture of feeling
                  </div>
                  <div style={{ fontSize: 12, color: "#8AAAD0" }}>Choose a texture that matches the feeling.</div>
                </div>
              </div>

              <div className="resp-tex-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
                {textureOptions.map(t => (
                  <div key={t.id} onClick={() => setData({ texture: data.texture === t.id ? null : t.id })}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "14px 0 10px", borderRadius: 12, border: data.texture === t.id ? "1.5px solid #5B8AFF" : "1px solid rgba(255,255,255,0.05)", background: data.texture === t.id ? "rgba(91,138,255,0.1)" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.15s" }}>
                    {t.icon(data.texture === t.id ? "#5B8AFF" : "#6080A0")}
                    <div style={{ fontSize: 10, color: data.texture === t.id ? "#A0C8F0" : "#6080A0", marginTop: 10, fontWeight: 500 }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onNext} style={{ width: "100%", padding: "16px", borderRadius: 14, background: "#3A6AB0", color: "#fff", fontSize: 16, fontWeight: 500, border: "none", cursor: "pointer", marginBottom: 16, transition: "background 0.15s" }}
              onMouseOver={e => e.currentTarget.style.background = "#4A7ABA"} onMouseOut={e => e.currentTarget.style.background = "#3A6AB0"}>
              Accept
            </button>

          </div>
        </div>
      </LHWrap>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3.4 — FEEL THE FEELING
  ═══════════════════════════════════════════════ */
  function Screen34FeelQ({ onStay, onDive, onBack, onSOS, setData, lhBg }: {
    onStay: () => void; onDive: () => void; onBack: () => void; onSOS: () => void;
    setData: (d: Partial<LHData>) => void; lhBg?: string;
  }) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 10, fontFamily: "var(--font-nunito)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px"
      }}>
        <img src={lhBg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", zIndex: 20 }}>
          <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>🏮</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#6090C0", letterSpacing: "0.1em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>SOS</button>
        </div>

        {/* Card */}
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480, background: "rgba(12,14,38,0.82)", border: "1px solid rgba(120,100,200,0.18)", borderRadius: 28, padding: "40px 32px 36px", backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)", textAlign: "center" }}>

          {/* Lotus icon */}
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #2A1F4A, #120C28)", border: "1px solid rgba(180,140,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 4px 24px rgba(120,80,200,0.2)" }}>
            <svg viewBox="0 0 60 60" width="46" height="46" fill="none">
              <path d="M30 48 C18 38 10 28 14 18 C17 10 25 10 30 18 C35 10 43 10 46 18 C50 28 42 38 30 48Z" stroke="#C084FC" strokeWidth="1.5" fill="none" opacity="0.9" />
              <path d="M30 48 C24 40 20 32 22 24 C24 18 28 17 30 22 C32 17 36 18 38 24 C40 32 36 40 30 48Z" stroke="#A855F7" strokeWidth="1.5" fill="none" opacity="0.7" />
              <path d="M30 20 L30 48" stroke="#C084FC" strokeWidth="1" opacity="0.4" />
              {/* sparkles */}
              <circle cx="18" cy="14" r="1.2" fill="#E9D5FF" opacity="0.8" />
              <circle cx="44" cy="10" r="1" fill="#E9D5FF" opacity="0.7" />
              <circle cx="48" cy="20" r="0.8" fill="#DDD6FE" opacity="0.6" />
              <path d="M14 22 L16 20 L18 22 L16 24Z" fill="#E9D5FF" opacity="0.5" />
              <path d="M42 8 L44 6 L46 8 L44 10Z" fill="#E9D5FF" opacity="0.5" />
            </svg>
          </div>

          {/* Title */}
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 32, fontWeight: 700, color: "#F0EEFF", margin: "0 0 18px", letterSpacing: "0.01em" }}>Feel the Feeling</h2>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 22 }}>
            <div style={{ height: 1, width: 60, background: "linear-gradient(to right, transparent, rgba(160,120,255,0.4))" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9B5CF6" }} />
            <div style={{ height: 1, width: 60, background: "linear-gradient(to left, transparent, rgba(160,120,255,0.4))" }} />
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: 16, color: "rgba(180,190,230,0.7)", lineHeight: 1.65, margin: "0 0 32px", fontWeight: 400 }}>
            Do you want to stay with this feeling<br />for a bit before we explore it?
          </p>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Yes */}
            <button onClick={() => { setData({ stayWithFeeling: true }); onStay(); }}
              style={{
                display: "flex", alignItems: "center", gap: 18, padding: "18px 20px", borderRadius: 18,
                border: "1.5px solid rgba(140,100,220,0.5)", background: "rgba(80,50,160,0.35)",
                cursor: "pointer", textAlign: "left", transition: "background 0.15s"
              }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(120,60,200,0.5)", border: "1.5px solid rgba(180,120,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                  <path d="M12 21C12 21 3 14 3 8.5C3 6 5 4 7.5 4C9.24 4 10.91 5.01 12 6.08C13.09 5.01 14.76 4 16.5 4C19 4 21 6 21 8.5C21 14 12 21 12 21Z" fill="#D8B4FE" stroke="#C084FC" strokeWidth="1.5" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#EDE9FE", marginBottom: 2 }}>Yes, I&apos;d like to stay</div>
                <div style={{ fontSize: 13, color: "rgba(196,181,253,0.7)", fontWeight: 400 }}>with it</div>
              </div>
              <span style={{ color: "#A78BFA", fontSize: 20, fontWeight: 300 }}>›</span>
            </button>

            {/* No */}
            <button onClick={() => { setData({ stayWithFeeling: false }); onDive(); }}
              style={{
                display: "flex", alignItems: "center", gap: 18, padding: "18px 20px", borderRadius: 18,
                border: "1.5px solid rgba(80,80,140,0.35)", background: "rgba(20,22,52,0.5)",
                cursor: "pointer", textAlign: "left", transition: "background 0.15s"
              }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(40,40,90,0.6)", border: "1.5px solid rgba(100,100,180,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#818CF8" strokeWidth="1.5" />
                  <path d="M9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9C15 10.5 14 11.5 12.5 12C12.5 12 12 12.3 12 13" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="15.5" r="0.8" fill="#818CF8" />
                  <path d="M8 10C8.5 8 10 6.5 12 6.5M12 6C9.24 6 7 8.24 7 11" stroke="#A5B4FC" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
                  <path d="M14 7C15.5 7.8 16.5 9.3 16.5 11" stroke="#A5B4FC" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#E2E8F0", marginBottom: 2 }}>No, let&apos;s</div>
                <div style={{ fontSize: 13, color: "rgba(148,163,200,0.7)", fontWeight: 400 }}>understand it</div>
              </div>
              <span style={{ color: "#818CF8", fontSize: 20, fontWeight: 300 }}>›</span>
            </button>

          </div>

          {/* Bottom lotus divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 32 }}>
            <div style={{ height: 1, width: 50, background: "linear-gradient(to right, transparent, rgba(160,120,255,0.25))" }} />
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" opacity="0.4">
              <path d="M12 20 C7 15 4 10 6 6 C7.5 3 11 3 12 6 C13 3 16.5 3 18 6 C20 10 17 15 12 20Z" stroke="#C084FC" strokeWidth="1.2" />
              <path d="M12 20 C9.5 16 8 12 9 8.5 C9.8 6 11 5.5 12 7.5 C13 5.5 14.2 6 15 8.5 C16 12 14.5 16 12 20Z" stroke="#A855F7" strokeWidth="1.2" />
            </svg>
            <div style={{ height: 1, width: 50, background: "linear-gradient(to left, transparent, rgba(160,120,255,0.25))" }} />
          </div>

        </div>
      </div>
    );
  }

  /* ══ Music Card Back ══ */
  function MusicCardBack({ timeLeft, timerDone, isSelected, color }: { timeLeft: number; timerDone: boolean; isSelected: boolean; color: string }) {
    const [playing, setPlaying] = useState(false);
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", overflow: "hidden", borderRadius: 16 }}>
        <style>{`
        @keyframes wave1 { 0%,100%{d:path("M0 22 Q30 10 60 22 Q90 34 120 22 Q150 10 180 22 Q210 34 240 22 L240 40 L0 40Z")} 50%{d:path("M0 28 Q30 16 60 28 Q90 40 120 28 Q150 16 180 28 Q210 40 240 28 L240 40 L0 40Z")} }
        @keyframes wave2 { 0%,100%{d:path("M0 28 Q40 18 80 28 Q120 38 160 28 Q200 18 240 28 L240 40 L0 40Z")} 50%{d:path("M0 22 Q40 32 80 22 Q120 12 160 22 Q200 32 240 22 L240 40 L0 40Z")} }
        @keyframes starTwinkle { 0%,100%{opacity:0.6} 50%{opacity:0.1} }
        @keyframes moonGlow { 0%,100%{filter:drop-shadow(0 0 4px rgba(255,240,200,0.4))} 50%{filter:drop-shadow(0 0 10px rgba(255,240,200,0.7))} }
        @keyframes musicPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
      `}</style>

        {/* Beach scene */}
        <div style={{ position: "relative", flex: 1, background: "linear-gradient(180deg,#0A0E2A 0%,#1A2040 40%,#0D1830 70%,#162030 100%)", overflow: "hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
            {/* Stars */}
            {[[20, 12], [45, 8], [70, 18], [95, 6], [120, 14], [148, 9], [170, 16], [195, 7], [215, 12], [35, 25], [85, 22], [130, 26], [175, 20], [210, 28]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1" fill="white" style={{ animation: `starTwinkle ${1.5 + i * 0.3}s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
            {/* Moon */}
            <g style={{ animation: "moonGlow 3s ease-in-out infinite" }}>
              <circle cx="190" cy="22" r="14" fill="#FFF5CC" opacity="0.9" />
              <circle cx="196" cy="18" r="11" fill="#1A2040" />
            </g>
            {/* Distant hills */}
            <path d="M0 90 Q40 70 80 85 Q120 100 160 78 Q200 60 240 82 L240 160 L0 160Z" fill="#0D1525" opacity="0.8" />
            {/* Ocean base */}
            <rect x="0" y="100" width="240" height="60" fill="#0A2040" />
            {/* Wave 2 (back) */}
            <path fill="rgba(30,80,140,0.5)" style={{ animation: "wave2 4s ease-in-out infinite" }}>
              <animate attributeName="d" dur="4s" repeatCount="indefinite"
                values="M0 108 Q60 100 120 108 Q180 116 240 108 L240 160 L0 160Z;M0 112 Q60 104 120 112 Q180 120 240 112 L240 160 L0 160Z;M0 108 Q60 100 120 108 Q180 116 240 108 L240 160 L0 160Z" />
            </path>
            {/* Wave 1 (front) */}
            <path fill="rgba(40,100,180,0.6)" style={{ animation: "wave1 3s ease-in-out infinite" }}>
              <animate attributeName="d" dur="3s" repeatCount="indefinite"
                values="M0 118 Q60 110 120 118 Q180 126 240 118 L240 160 L0 160Z;M0 122 Q60 114 120 122 Q180 130 240 122 L240 160 L0 160Z;M0 118 Q60 110 120 118 Q180 126 240 118 L240 160 L0 160Z" />
            </path>
            {/* Wave shimmer */}
            <path d="M0 118 Q60 110 120 118 Q180 126 240 118" fill="none" stroke="rgba(150,200,255,0.3)" strokeWidth="1.5" />
            {/* Shore glow */}
            <ellipse cx="120" cy="135" rx="90" ry="6" fill="rgba(100,160,220,0.12)" />
            {/* Lighthouse silhouette */}
            <rect x="108" y="68" width="8" height="32" fill="#0A1020" />
            <polygon points="104,68 120,68 112,58" fill="#0A1020" />
            <circle cx="112" cy="57" r="3" fill="#FFF5A0" opacity="0.7" />
          </svg>

          {/* Done chip top-right */}
          <div style={{ position: "absolute", top: 6, right: 6, zIndex: 10 }}>
            {timerDone
              ? <div style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(76,175,138,0.25)", border: "1px solid #4CAF8A", color: "#4CAF8A", fontSize: 11, fontWeight: 700 }}>✓ Done</div>
              : <div style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(0,0,0,0.35)", border: `1px solid ${color}55`, color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{timeLeft}s</div>
            }
          </div>

          {/* Label */}
          <div style={{ position: "absolute", top: 8, left: 10 }}>
            <div style={{ fontSize: 9, color: "rgba(180,210,255,0.6)", letterSpacing: "0.08em", lineHeight: 1.4 }}>Calm ocean<br />breeze, waves</div>
          </div>
        </div>

        {/* Audio controls */}
        <div style={{ background: "rgba(10,12,32,0.9)", padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, borderTop: `1px solid ${color}33` }}>
          <button onClick={() => setPlaying(p => !p)}
            style={{
              width: 36, height: 36, borderRadius: "50%", border: "none", background: `linear-gradient(135deg,${color},#7C3AED)`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              animation: playing && isSelected ? "musicPulse 1.5s ease-in-out infinite" : "none",
              boxShadow: playing ? `0 0 12px ${color}88` : "none"
            }}>
            {playing
              ? <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><rect x="1" y="1" width="4" height="10" rx="1" /><rect x="7" y="1" width="4" height="10" rx="1" /></svg>
              : <svg width="12" height="12" viewBox="0 0 12 12" fill="white"><polygon points="2,1 11,6 2,11" /></svg>
            }
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(220,230,255,0.9)", marginBottom: 2 }}>Ocean Breeze</div>
            <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
              <div style={{
                height: "100%", borderRadius: 2, background: `linear-gradient(to right,${color},#7C3AED)`,
                width: isSelected ? `${((120 - timeLeft) / 120) * 100}%` : "0%", transition: "width 1s linear"
              }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3.4.1 — STAY WITH IT
  ═══════════════════════════════════════════════ */
  const STAY_CARDS = [
    { id: "cry", label: "Let it Out", icon: "🌊", color: "#E8914A", wave: "rgba(232,145,74,0.5)" },
    { id: "sit", label: "Sit With It", icon: "🧘", color: "#D4A94A", wave: "rgba(212,169,74,0.5)" },
    { id: "breathe", label: "Pause &\nBreathe", icon: "🍃", color: "#5B9ED4", wave: "rgba(91,158,212,0.5)" },
    { id: "music", label: "Listen to\nMusic", icon: "🎧", color: "#A87AE0", wave: "rgba(168,122,224,0.5)" },
  ];

  function Screen341StayWithIt({ onNext, onBack, onSOS, setData, lhBg }: {
    onNext: () => void; onBack: () => void; onSOS: () => void;
    setData: (d: Partial<LHData>) => void; lhBg?: string;
  }) {
    const [selected, setSelected] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(120);
    const [timerDone, setTimerDone] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const selectCard = (id: string) => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (selected === id) { setSelected(null); setTimeLeft(120); setTimerDone(false); return; }
      setSelected(id); setTimerDone(false); setTimeLeft(120);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current!); setTimerDone(true); return 0; }
          return t - 1;
        });
      }, 1000);
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10, fontFamily: "var(--font-nunito)", display: "flex", flexDirection: "column" }}>
        {/* Background */}
        <img src={lhBg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", zIndex: 20 }}>
          <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>🏮</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#E0D0A0", letterSpacing: "0.1em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>SOS</button>
        </div>

        {/* Main card */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "80px 24px 32px", overflowY: "auto" }}>
          <div style={{ width: "100%", maxWidth: 860, background: "rgba(10,12,32,0.78)", border: "1px solid rgba(120,100,200,0.15)", borderRadius: 28, padding: "36px 32px 32px", backdropFilter: "blur(18px)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>

            {/* Title */}
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 700, color: "#F0EEFF", margin: "0 0 10px", textAlign: "center" }}>Stay With It</h2>

            {/* Subtitle */}
            <p style={{ fontSize: 15, color: "rgba(200,210,240,0.7)", textAlign: "center", margin: "0 0 18px", fontWeight: 400 }}>
              Choose one activity. A{" "}
              <span style={{ color: "#F0A050", fontWeight: 600 }}>2-minute</span>
              {" "}timer will begin.
            </p>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 }}>
              <div style={{ height: 1, width: 60, background: "linear-gradient(to right, transparent, rgba(180,150,255,0.3))" }} />
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" opacity="0.5">
                <path d="M10 17C6 13 3 10 5 7C6.2 4.5 9 4.5 10 7C11 4.5 13.8 4.5 15 7C17 10 14 13 10 17Z" stroke="#C084FC" strokeWidth="1.2" />
                <path d="M10 17C8.5 14 7.5 11 8.5 8.5C9 7 9.5 6.5 10 8C10.5 6.5 11 7 11.5 8.5C12.5 11 11.5 14 10 17Z" stroke="#A855F7" strokeWidth="1" />
              </svg>
              <div style={{ height: 1, width: 60, background: "linear-gradient(to left, transparent, rgba(180,150,255,0.3))" }} />
            </div>

            {/* 4 cards */}
            <style>{`
            .stay-cards-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 14px;
              margin-bottom: 28px;
            }
            .stay-card-inner {
              min-height: 200px;
            }
            @media (min-width: 640px) {
              .stay-cards-grid {
                grid-template-columns: repeat(4, 1fr);
              }
              .stay-card-inner {
                min-height: 260px;
              }
            }
          `}</style>
            <div className="stay-cards-grid">
              {STAY_CARDS.map(c => {
                const isSelected = selected === c.id;
                return (
                  <div key={c.id} onClick={() => selectCard(c.id)}
                    style={{
                      perspective: "1000px", cursor: selected && !isSelected ? "not-allowed" : "pointer",
                      opacity: selected && !isSelected ? 0.35 : 1,
                      transition: "opacity 0.3s", pointerEvents: selected && !isSelected ? "none" : "auto"
                    }}>
                    <div className="stay-card-inner" style={{
                      position: "relative", width: "100%", height: "100%",
                      transformStyle: "preserve-3d", transition: "transform 0.6s",
                      transform: isSelected && !timerDone ? "rotateY(180deg)" : "rotateY(0deg)"
                    }}>
                      {/* Front Face */}
                      <div style={{
                        position: "absolute", inset: 0, backfaceVisibility: "hidden",
                        borderRadius: 18, border: `1.5px solid ${isSelected ? c.color : "rgba(100,90,160,0.25)"}`,
                        background: selected && !isSelected ? "rgba(10,10,20,0.5)" : "rgba(18,16,42,0.7)", overflow: "hidden",
                        boxShadow: isSelected ? `0 0 20px ${c.color}30` : "none",
                        display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 0",
                        filter: selected && !isSelected ? "grayscale(1)" : "none", transition: "filter 0.3s, background 0.3s"
                      }}>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(30,25,60,0.8)", border: `1.5px solid rgba(255,255,255,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 32 }}>
                            {c.icon}
                          </div>
                          <div style={{ fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 700, color: c.color, textAlign: "center", lineHeight: 1.25, marginBottom: 10, whiteSpace: "pre-line" }}>{c.label}</div>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, opacity: 0.6, marginBottom: (isSelected && timerDone) ? 12 : 0 }} />
                          {isSelected && timerDone && (
                            <div style={{ fontSize: 13, color: "#4CAF8A", fontWeight: 700 }}>✓ Done</div>
                          )}
                        </div>

                      </div>

                      {/* Back Face (Timer) */}
                      {(() => {
                        const elapsed2 = 120 - timeLeft;
                        const bPhase = Math.floor(elapsed2 % 12 / 6);
                        return (
                          <div style={{
                            position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
                            borderRadius: 18, border: `1.5px solid ${c.color}`,
                            backgroundImage: c.id === "cry" ? `url("${letItOutBgImg.src}")` : c.id === "sit" ? `url("${sitWithItCardImg.src}")` : "none",
                            backgroundColor: (c.id === "cry" || c.id === "sit") ? "#ffffff" : `rgba(${c.color === "#E8914A" ? "232,145,74" : c.color === "#D4A94A" ? "212,169,74" : c.color === "#5B9ED4" ? "91,158,212" : "168,122,224"},0.12)`,
                            backgroundSize: (c.id === "cry" || c.id === "sit") ? "contain" : "cover",
                            backgroundPosition: "center", backgroundRepeat: "no-repeat",
                            overflow: "hidden", boxShadow: `0 0 20px ${c.color}30`,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px"
                          }}>
                            {c.id === "breathe" ? (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100%", justifyContent: "center", gap: 0 }}>
                                <style>{`
                                @keyframes breathDotUp   { 0%{transform:translateY(94px) scale(1.5)} 100%{transform:translateY(0px) scale(0.7)} }
                                @keyframes breathDotDown { 0%{transform:translateY(0px) scale(0.7)} 100%{transform:translateY(94px) scale(1.5)} }
                                @keyframes breathDotHold { 0%,100%{transform:translateY(94px) scale(1.5)} }
                                @keyframes bArrPulse     { 0%,100%{opacity:0.25} 50%{opacity:0.9} }
                              `}</style>

                                {/* Timer */}
                                <div style={{ fontSize: 11, color: "rgba(180,200,240,0.5)", marginBottom: 6, letterSpacing: "0.06em" }}>
                                  {timerDone ? <span style={{ color: "#4CAF8A", fontWeight: 700 }}>✓ Done</span> : `${timeLeft}s`}
                                </div>

                                {/* Main diagram */}
                                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 160 }}>

                                  {/* Left side — IN arrows (upward) */}
                                  <div style={{ position: "absolute", left: 8, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#7BA8F0", letterSpacing: "0.06em", opacity: bPhase === 0 ? 1 : 0.25, transition: "opacity 0.5s" }}>in</span>
                                    {[0, 1, 2].map(i => (
                                      <svg key={i} width="14" height="16" viewBox="0 0 14 16" fill="none"
                                        style={{ opacity: bPhase === 0 ? 1 : 0.15, animation: bPhase === 0 ? `bArrPulse 1s ease-in-out ${i * 0.2}s infinite` : "none", transition: "opacity 0.5s" }}>
                                        <path d="M7 14L7 2M2 7L7 2L12 7" stroke="#7BA8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    ))}
                                  </div>

                                  {/* Center: track line + animated dot */}
                                  <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
                                    {/* Small circle top */}
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", border: "1.5px solid rgba(91,158,212,0.4)", background: "rgba(91,158,212,0.08)", flexShrink: 0 }} />
                                    {/* Dashed vertical line */}
                                    <div style={{ width: 2, height: 52, background: "repeating-linear-gradient(to bottom, rgba(160,140,255,0.3) 0px, rgba(160,140,255,0.3) 4px, transparent 4px, transparent 8px)" }} />
                                    {/* Large circle bottom */}
                                    <div style={{ width: 56, height: 56, borderRadius: "50%", border: "1.5px solid rgba(155,122,232,0.5)", background: "rgba(155,122,232,0.1)", flexShrink: 0 }} />

                                    {/* Animated dot riding the track */}
                                    <div style={{
                                      position: "absolute", top: 14, left: "50%", marginLeft: -8,
                                      width: 16, height: 16, borderRadius: "50%",
                                      background: bPhase === 0 ? "#7BA8F0" : bPhase === 1 ? "#9B7AE8" : "rgba(160,140,255,0.8)",
                                      boxShadow: bPhase === 0 ? "0 0 10px #7BA8F0" : bPhase === 1 ? "0 0 10px #9B7AE8" : "0 0 6px rgba(160,140,255,0.5)",
                                      animation: isSelected
                                        ? bPhase === 0 ? "breathDotUp 6s ease-in-out forwards"
                                          : bPhase === 1 ? "breathDotDown 6s ease-in-out forwards"
                                            : "breathDotHold 6s linear forwards"
                                        : "none",
                                      transform: bPhase === 1 ? "translateY(0px) scale(0.7)" : "translateY(94px) scale(1.5)",
                                    }} />
                                  </div>

                                  {/* Right side — OUT arrows (downward) */}
                                  <div style={{ position: "absolute", right: 8, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                                    {[0, 1, 2].map(i => (
                                      <svg key={i} width="14" height="16" viewBox="0 0 14 16" fill="none"
                                        style={{ opacity: bPhase === 1 ? 1 : 0.15, animation: bPhase === 1 ? `bArrPulse 1s ease-in-out ${i * 0.2}s infinite` : "none", transition: "opacity 0.5s" }}>
                                        <path d="M7 2L7 14M2 9L7 14L12 9" stroke="#9B7AE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    ))}
                                    <span style={{ fontSize: 10, fontWeight: 700, color: "#9B7AE8", letterSpacing: "0.06em", opacity: bPhase === 1 ? 1 : 0.25, transition: "opacity 0.5s" }}>out</span>
                                  </div>

                                </div>

                                {/* Phase label */}
                                <div style={{
                                  fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", marginTop: 6,
                                  color: bPhase === 0 ? "#7BA8F0" : bPhase === 1 ? "#9B7AE8" : "rgba(200,210,240,0.5)"
                                }}>
                                  {timerDone ? "" : bPhase === 0 ? "INHALE" : "EXHALE"}
                                </div>
                              </div>
                            ) : c.id === "music" ? (
                              <MusicCardBack timeLeft={timeLeft} timerDone={timerDone} isSelected={isSelected} color={c.color} />
                            ) : (
                              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }} />
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue button */}
            <button onClick={() => { setData({ stayActivity: selected ?? undefined }); onNext(); }}
              style={{
                width: "100%", padding: "18px", borderRadius: 18, border: "none",
                background: "linear-gradient(135deg, #5B4FD4, #7C3AED)",
                color: "#fff", fontSize: 18, fontWeight: 600, fontFamily: "Georgia,serif",
                cursor: "pointer", letterSpacing: "0.02em",
                boxShadow: "0 4px 24px rgba(92,60,200,0.5)"
              }}>
              Continue →
            </button>

          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3.5 — DIVING INSIDE
  ═══════════════════════════════════════════════ */
  function Screen35Diving({ onNext, onBack, onSOS, data, setData, lhBg }: {
    onNext: () => void; onBack: () => void; onSOS: () => void;
    data: LHData; setData: (d: Partial<LHData>) => void; lhBg?: string;
  }) {
    const FIELDS = ["Work / studies", "Relationships", "Health", "Something else", "Uncertainty"];
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const updateAnswer = (key: string, val: string) => {
      const updated = { ...answers, [key]: val };
      setAnswers(updated);
      setData({ divingText: Object.entries(updated).filter(([, v]) => v.trim()).map(([k, v]) => `${k}: ${v}`).join("\n") });
    };

    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 10, display: "flex", flexDirection: "column",
        background: "#07080F"
      }}>
        <img src={lhBg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", zIndex: 20 }}>
          <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.15)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>🏮</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#C0B8E0", letterSpacing: "0.1em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>SOS</button>
        </div>

        {/* Centered card */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "72px 24px 32px", overflowY: "auto" }}>
          <div style={{
            width: "100%", maxWidth: 680,
            background: "rgba(18,12,28,0.87)",
            border: "1px solid rgba(160,100,40,0.22)",
            borderRadius: 24, padding: "36px 40px 28px",
            backdropFilter: "blur(22px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(220,160,80,0.06)"
          }}>

            {/* Manobandhu heart icon */}
            <div style={{ textAlign: "center", marginBottom: 18 }}>
              <svg viewBox="0 0 64 64" width="52" height="52" fill="none">
                <path d="M32 54 C32 54 8 38 8 22 C8 14 14 8 22 8 C26.5 8 30.5 10.5 32 13 C33.5 10.5 37.5 8 42 8 C50 8 56 14 56 22 C56 38 32 54 32 54Z"
                  stroke="#C9A262" strokeWidth="2" fill="none" />
                <path d="M32 54 C32 54 18 40 18 28 C18 22 22 18 27 18 C29.5 18 31 20 32 22 C33 20 34.5 18 37 18 C42 18 46 22 46 28 C46 40 32 54 32 54Z"
                  stroke="#C9A262" strokeWidth="1.4" fill="none" opacity="0.55" />
                <circle cx="20" cy="16" r="1.3" fill="#E8C070" opacity="0.6" />
                <circle cx="46" cy="13" r="1.1" fill="#E8C070" opacity="0.5" />
                <circle cx="51" cy="24" r="0.9" fill="#F0D090" opacity="0.45" />
              </svg>
            </div>

            {/* Title */}
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 700, color: "#F2E8D8", textAlign: "center", margin: "0 0 12px", letterSpacing: "0.01em" }}>Understand Yourself</h2>

            {/* Subtitle */}
            <p style={{ fontSize: 15, color: "rgba(200,175,140,0.6)", textAlign: "center", margin: "0 0 24px", fontWeight: 400 }}>
              What do you think this feeling is connected to?
            </p>

            {/* Text fields */}
            <style>{`
            .uy-input::placeholder { color:#C9A262; opacity:0.7; font-style:italic; font-family:Georgia,serif; }
            .uy-input:focus { outline:none; background:rgba(180,120,40,0.07); }
          `}</style>
            <div style={{ border: "1px solid rgba(160,100,30,0.3)", borderRadius: 16, overflow: "hidden", background: "rgba(10,6,20,0.6)", marginBottom: 24 }}>
              {FIELDS.map((label, i) => (
                <div key={label} style={{ borderBottom: i < FIELDS.length - 1 ? "1px solid rgba(150,95,30,0.2)" : "none" }}>
                  <textarea
                    className="uy-input"
                    value={answers[label] ?? ""}
                    onChange={e => updateAnswer(label, e.target.value)}
                    placeholder={label}
                    rows={2}
                    style={{
                      width: "100%", padding: "12px 20px 10px", background: "transparent", border: "none",
                      fontFamily: "Georgia,serif", fontSize: 16, fontStyle: "italic", color: "#F2E8D8",
                      boxSizing: "border-box", transition: "background 0.2s",
                      resize: "none", overflowY: "auto", lineHeight: 1.5
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 15, color: "#C9A262", margin: "0 0 4px", fontStyle: "italic", fontFamily: "Georgia,serif" }}>Write freely...</p>
                <p style={{ fontSize: 13, color: "#C9A262", margin: 0, fontStyle: "italic", fontFamily: "Georgia,serif", opacity: 0.7 }}>This is just for you...</p>
              </div>
              <button onClick={onNext}
                style={{
                  padding: "13px 36px", borderRadius: 14, border: "none",
                  background: "#6B52CC",
                  color: "#F0EEFF", fontSize: 16, fontFamily: "Georgia,serif", fontWeight: 600,
                  cursor: "pointer", letterSpacing: "0.02em",
                  boxShadow: "0 4px 20px rgba(100,70,200,0.5)"
                }}>
                Done
              </button>
            </div>

            {/* Bottom divider + heart */}
            <div style={{ marginTop: 22, textAlign: "center" }}>
              <svg viewBox="0 0 300 12" width="100%" height="10" preserveAspectRatio="none">
                <path d="M0 6 Q75 1 150 6 Q225 11 300 6" fill="none" stroke="rgba(180,130,50,0.18)" strokeWidth="1" />
              </svg>
              <svg viewBox="0 0 64 64" width="22" height="22" fill="none" style={{ marginTop: 6, opacity: 0.2 }}>
                <path d="M32 54 C32 54 8 38 8 22 C8 14 14 8 22 8 C26.5 8 30.5 10.5 32 13 C33.5 10.5 37.5 8 42 8 C50 8 56 14 56 22 C56 38 32 54 32 54Z" stroke="#C9A262" strokeWidth="2.5" fill="none" />
              </svg>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3.6 — CONTROL CHECK
  ═══════════════════════════════════════════════ */
  function Screen36ControlCheck({ onYes, onNo, onNotSure, onBack, onSOS, setData, lhBg }: {
    onYes: () => void; onNo: () => void; onNotSure: () => void;
    onBack: () => void; onSOS: () => void;
    setData: (d: Partial<LHData>) => void; lhBg?: string;
  }) {
    const OPTS = [
      {
        id: "yes",
        label: "Yes",
        color: "#E879A0",
        borderColor: "rgba(232,121,160,0.55)",
        bgColor: "rgba(232,121,160,0.08)",
        dotColor: "#E879A0",
        icon: (
          <svg viewBox="0 0 48 48" width="42" height="42" fill="none">
            <path d="M24 42 C24 42 7 31 7 18.5 C7 13 11.5 9 16.5 9 C19.8 9 22.8 10.8 24 12.5 C25.2 10.8 28.2 9 31.5 9 C36.5 9 41 13 41 18.5 C41 31 24 42 24 42Z"
              stroke="#E879A0" strokeWidth="1.8" fill="rgba(232,121,160,0.18)" />
          </svg>
        ),
        onClick: () => { setData({ controlCheck: "yes" }); onYes(); },
      },
      {
        id: "no",
        label: "No",
        color: "#D4A84A",
        borderColor: "rgba(212,168,74,0.55)",
        bgColor: "rgba(212,168,74,0.08)",
        dotColor: "#D4A84A",
        icon: (
          <svg viewBox="0 0 48 48" width="42" height="42" fill="none">
            <line x1="14" y1="14" x2="34" y2="34" stroke="#D4A84A" strokeWidth="3" strokeLinecap="round" />
            <line x1="34" y1="14" x2="14" y2="34" stroke="#D4A84A" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ),
        onClick: () => { setData({ controlCheck: "no" }); onNo(); },
      },
      {
        id: "not-sure",
        label: "Not Sure",
        color: "#7C9EF0",
        borderColor: "rgba(124,158,240,0.55)",
        bgColor: "rgba(124,158,240,0.08)",
        dotColor: "#7C9EF0",
        icon: (
          <svg viewBox="0 0 48 48" width="42" height="42" fill="none">
            <path d="M10 20 Q10 8 24 8 Q38 8 38 20 Q38 28 30 32 L30 36 Q30 38 24 38 Q18 38 18 36 L18 32 Q10 28 10 20Z"
              stroke="#7C9EF0" strokeWidth="1.8" fill="rgba(124,158,240,0.15)" />
            <circle cx="24" cy="43" r="2.2" fill="#7C9EF0" />
          </svg>
        ),
        onClick: () => { setData({ controlCheck: "not-sure" }); onNotSure(); },
      },
    ];

    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 10, fontFamily: "var(--font-nunito)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px",
        background: "#0D0B1E",
      }}>
        <img src={lhBg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />
        <style>{`
        .ctrl36-opt { transition: transform 0.18s, box-shadow 0.18s, background 0.18s; }
        .ctrl36-opt:hover { transform: translateY(-3px); }
        .ctrl36-opt:active { transform: scale(0.96); }
        @media (max-width: 480px) {
          .ctrl36-opt { padding: 14px 8px 12px !important; min-height: 0 !important; }
          .ctrl36-opt .ctrl36-icon { width: 52px !important; height: 52px !important; margin-bottom: 10px !important; }
        }
      `}</style>

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", zIndex: 20 }}>
          <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>🏮</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#6090C0", letterSpacing: "0.1em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>SOS</button>
        </div>

        {/* Main card */}
        <div style={{
          position: "relative", zIndex: 1, width: "100%", maxWidth: 520,
          background: "rgba(18,12,40,0.88)",
          border: "1px solid rgba(140,100,60,0.2)",
          borderRadius: 28, padding: "40px 32px 36px",
          backdropFilter: "blur(24px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.78), inset 0 1px 0 rgba(220,160,80,0.05)",
          textAlign: "center",
        }}>

          {/* Amber heart icon */}
          <div style={{ marginBottom: 20 }}>
            <svg viewBox="0 0 64 64" width="52" height="52" fill="none">
              <path d="M32 54 C32 54 8 38 8 22 C8 14 14 8 22 8 C26.5 8 30.5 10.5 32 13 C33.5 10.5 37.5 8 42 8 C50 8 56 14 56 22 C56 38 32 54 32 54Z"
                stroke="#C9A262" strokeWidth="2" fill="none" />
              <path d="M32 54 C32 54 18 40 18 28 C18 22 22 18 27 18 C29.5 18 31 20 32 22 C33 20 34.5 18 37 18 C42 18 46 22 46 28 C46 40 32 54 32 54Z"
                stroke="#C9A262" strokeWidth="1.4" fill="none" opacity="0.55" />
              <circle cx="20" cy="16" r="1.3" fill="#E8C070" opacity="0.6" />
              <circle cx="46" cy="13" r="1.1" fill="#E8C070" opacity="0.5" />
              <circle cx="51" cy="24" r="0.9" fill="#F0D090" opacity="0.45" />
            </svg>
          </div>

          {/* Title */}
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: 32, fontWeight: 700, color: "#F2E8D8", margin: "0 0 14px", letterSpacing: "0.01em" }}>
            Deeper Understanding
          </h2>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 18 }}>
            <div style={{ height: 1, width: 70, background: "linear-gradient(to right,transparent,rgba(180,140,80,0.35))" }} />
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#9B5CF6" }} />
            <div style={{ height: 1, width: 70, background: "linear-gradient(to left,transparent,rgba(180,140,80,0.35))" }} />
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: 15, color: "rgba(200,180,150,0.6)", lineHeight: 1.65, margin: "0 0 32px", fontWeight: 400 }}>
            Is what you&apos;re feeling connected to something under your control?
          </p>

          {/* Three option cards */}
          <div className="resp-ctrl-btns" style={{ display: "flex", gap: 14, justifyContent: "center" }}>
            {OPTS.map(o => (
              <button key={o.id} className="ctrl36-opt" onClick={o.onClick} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                padding: "26px 10px 20px", borderRadius: 20,
                border: `1.5px solid ${o.borderColor}`,
                background: `linear-gradient(180deg,${o.bgColor},rgba(8,10,28,0.6))`,
                boxShadow: `0 0 20px ${o.bgColor}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                cursor: "pointer", gap: 0, minHeight: 0,
              }}>
                {/* Icon circle */}
                <div className="ctrl36-icon" style={{
                  width: 74, height: 74, borderRadius: "50%",
                  background: `radial-gradient(circle at 40% 35%,rgba(30,25,55,0.9),rgba(10,8,24,0.95))`,
                  border: `1.5px solid ${o.borderColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16,
                  boxShadow: `0 0 16px ${o.bgColor}`,
                }}>
                  {o.icon}
                </div>

                {/* Label */}
                <span style={{ fontFamily: "Georgia,serif", fontSize: 17, fontWeight: 600, color: o.color, marginBottom: 16 }}>
                  {o.label}
                </span>

                {/* Bottom dot */}
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: o.dotColor, opacity: 0.7 }} />
              </button>
            ))}
          </div>

          {/* Bottom decoration */}
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.25 }}>
            <svg viewBox="0 0 300 12" width="200" height="10" preserveAspectRatio="none">
              <path d="M0 6 Q75 1 150 6 Q225 11 300 6" fill="none" stroke="rgba(180,130,50,0.7)" strokeWidth="1" />
            </svg>
            <svg viewBox="0 0 64 64" width="24" height="24" fill="none">
              <path d="M32 54 C32 54 8 38 8 22 C8 14 14 8 22 8 C26.5 8 30.5 10.5 32 13 C33.5 10.5 37.5 8 42 8 C50 8 56 14 56 22 C56 38 32 54 32 54Z" stroke="#C9A262" strokeWidth="2.5" fill="none" />
            </svg>
          </div>

        </div>
      </div>
    );
  }



  function Screen361UnderControl({ onNext, onBack, onSOS, data, setData, lhBg }: {
    onNext: () => void; onBack: () => void; onSOS: () => void;
    data: LHData; setData: (d: Partial<LHData>) => void; lhBg?: string;
  }) {
    const IN_CONTROL_ITEMS = [
      {
        n: 1, label: "Other people's opinions", bg: "rgba(90,80,170,0.45)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#A090F0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="10" x2="16" y2="10" stroke="#A090F0" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="8" y1="13" x2="13" y2="13" stroke="#A090F0" strokeWidth="1.4" strokeLinecap="round" />
          </svg>)
      },
      {
        n: 2, label: "How others behave", bg: "rgba(180,80,70,0.4)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <circle cx="9" cy="7" r="3" stroke="#E08878" strokeWidth="1.6" />
            <path d="M2 20c0-3.31 3.13-6 7-6s7 2.69 7 6" stroke="#E08878" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="17" cy="7" r="2.5" stroke="#E08878" strokeWidth="1.4" />
            <path d="M21 20c0-2.76-1.79-5-4-5" stroke="#E08878" strokeWidth="1.4" strokeLinecap="round" />
          </svg>)
      },
      {
        n: 3, label: "The past", bg: "rgba(180,120,40,0.4)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#D4A04A" strokeWidth="1.6" />
            <polyline points="12 7 12 12 9 15" stroke="#D4A04A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.5 8.5C5 5.5 8.2 3.5 12 3.5" stroke="#D4A04A" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="2 2" />
          </svg>)
      },
      {
        n: 4, label: "Traffic, weather, delays", bg: "rgba(120,70,180,0.4)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke="#B07AE0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="15" x2="8" y2="15.01" stroke="#B07AE0" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="15" x2="12" y2="15.01" stroke="#B07AE0" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="15" x2="16" y2="15.01" stroke="#B07AE0" strokeWidth="2" strokeLinecap="round" />
          </svg>)
      },
      {
        n: 5, label: "Social media reactions", bg: "rgba(50,110,180,0.4)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" stroke="#5A9ED8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="#5A9ED8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>)
      },
    ];

    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 10, fontFamily: "var(--font-nunito)",
        display: "flex", flexDirection: "column", background: "#0E0B1C"
      }}>
        <img src={lhBg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", zIndex: 20 }}>
          <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>🏮</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#6090C0", letterSpacing: "0.1em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>SOS</button>
        </div>

        {/* Main card */}
        <div className="uc-scroll" style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 20px 24px" }}>
          <div className="uc-card" style={{
            width: "100%", maxWidth: 800,
            background: "rgba(12,10,30,0.87)",
            border: "1px solid rgba(100,80,200,0.22)",
            borderRadius: 28, padding: "36px 36px 28px",
            backdropFilter: "blur(24px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
          }}>
            <div className="uc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

              {/* LEFT: lotus icon + title + textarea */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: 18 }}>
                  <svg viewBox="0 0 60 60" width="46" height="46" fill="none">
                    <path d="M30 48 C18 38 10 28 14 18 C17 10 25 10 30 18 C35 10 43 10 46 18 C50 28 42 38 30 48Z" stroke="#C084FC" strokeWidth="1.5" fill="none" opacity="0.9" />
                    <path d="M30 48 C24 40 20 32 22 24 C24 18 28 17 30 22 C32 17 36 18 38 24 C40 32 36 40 30 48Z" stroke="#A855F7" strokeWidth="1.5" fill="none" opacity="0.7" />
                    <path d="M30 20 L30 48" stroke="#C084FC" strokeWidth="1" opacity="0.4" />
                    <circle cx="18" cy="14" r="1.2" fill="#E9D5FF" opacity="0.8" />
                    <circle cx="44" cy="10" r="1" fill="#E9D5FF" opacity="0.7" />
                    <circle cx="48" cy="20" r="0.8" fill="#DDD6FE" opacity="0.6" />
                  </svg>
                </div>

                <h2 className="uc-h2" style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 700, color: "#F0EEFF", margin: "0 0 12px", lineHeight: 1.3, letterSpacing: "0.01em" }}>
                  This is{" "}
                  <span style={{ color: "#C084FC" }}>within</span>
                  {" "}your reach
                </h2>

                <div style={{ width: 60, height: 2, background: "rgba(150,100,255,0.5)", borderRadius: 2, marginBottom: 24 }} />

                <style>{`.uc-ta::placeholder{color:rgba(150,130,200,0.35);font-style:italic;font-family:Georgia,serif;} .uc-ta:focus{outline:none;} @media(max-width:600px){.uc-scroll{align-items:flex-start!important;} .uc-grid{grid-template-columns:1fr!important;gap:20px!important;} .uc-card{padding:20px 16px 18px!important;} .uc-h2{font-size:22px!important;} .uc-ta-wrap{min-height:140px!important;} .uc-ta{min-height:140px!important;} .uc-item{padding:9px 12px!important;} .uc-item-icon{width:36px!important;height:36px!important;}}`}</style>
                <div className="uc-ta-wrap" style={{
                  borderRadius: 16,
                  border: "1px solid rgba(100,80,180,0.25)",
                  background: "rgba(12,8,30,0.55)",
                  backgroundImage: "repeating-linear-gradient(transparent,transparent 37px,rgba(110,80,200,0.12) 37px,rgba(110,80,200,0.12) 38px)",
                  backgroundSize: "100% 38px",
                  backgroundPositionY: "10px",
                  minHeight: 220,
                }}>
                  <textarea
                    className="uc-ta"
                    value={data.controlText ?? ""}
                    onChange={e => setData({ controlText: e.target.value })}
                    placeholder="Write what feels within your control…"
                    style={{
                      width: "100%", minHeight: 220, background: "transparent", border: "none",
                      padding: "14px 18px", color: "#D0C8F0", fontSize: 15, fontFamily: "Georgia,serif",
                      lineHeight: "38px", resize: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* RIGHT: subtitle + items + Done */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p className="uc-subtitle" style={{ fontSize: 20, color: "rgba(180,165,210,0.7)", lineHeight: 1.65, margin: "0 0 18px", fontStyle: "italic" }}>
                  There are still some things which we cannot control
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {IN_CONTROL_ITEMS.map(item => (
                    <div key={item.n} className="uc-item" style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "6px 4px",
                    }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "rgba(20,16,50,0.8)",
                        border: "1.5px solid rgba(120,100,200,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        <span style={{ fontSize: 11, color: "rgba(180,160,240,0.75)", fontWeight: 700, fontFamily: "var(--font-baloo)" }}>{item.n}</span>
                      </div>
                      <div className="uc-item-icon" style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: item.bg,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: 15, color: "#C8C0E8", fontFamily: "Georgia,serif", lineHeight: 1.3 }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                  <button onClick={onNext} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 36px", borderRadius: 50, border: "none",
                    background: "rgba(90,65,185,0.75)",
                    color: "#EDE8FF", fontSize: 16, fontFamily: "Georgia,serif", fontWeight: 600,
                    cursor: "pointer", backdropFilter: "blur(8px)",
                    boxShadow: "0 4px 20px rgba(80,55,180,0.45)",
                  }}>Done <span style={{ fontSize: 18 }}>→</span></button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 22, opacity: 0.2, textAlign: "center" }}>
              <svg viewBox="0 0 600 14" width="100%" height="10" preserveAspectRatio="none">
                <path d="M0 7 Q75 1 150 7 Q225 13 300 7 Q375 1 450 7 Q525 13 600 7" fill="none" stroke="rgba(140,100,255,0.8)" strokeWidth="1" />
              </svg>
              <svg viewBox="0 0 60 60" width="22" height="22" fill="none" style={{ marginTop: 6 }}>
                <path d="M30 48 C18 38 10 28 14 18 C17 10 25 10 30 18 C35 10 43 10 46 18 C50 28 42 38 30 48Z" stroke="#C084FC" strokeWidth="1.8" fill="none" />
                <path d="M30 48 C24 40 20 32 22 24 C24 18 28 17 30 22 C32 17 36 18 38 24 C40 32 36 40 30 48Z" stroke="#A855F7" strokeWidth="1.4" fill="none" opacity="0.7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3.6.2 — NOT IN CONTROL (shown for NO users)
  ═══════════════════════════════════════════════ */
  function Screen362NotControl({ onNext, onBack, onSOS, data, setData, lhBg }: {
    onNext: () => void; onBack: () => void; onSOS: () => void;
    data: LHData; setData: (d: Partial<LHData>) => void; lhBg?: string;
  }) {
    const ITEMS = [
      {
        n: 1, label: "Your response", bg: "rgba(90,65,180,0.55)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#B090F8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>)
      },
      {
        n: 2, label: "The way you speak to yourself", bg: "rgba(170,70,60,0.45)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#E08878" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>)
      },
      {
        n: 3, label: "Asking for help", bg: "rgba(160,120,30,0.45)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <circle cx="12" cy="8" r="3.5" stroke="#D4A04A" strokeWidth="1.6" />
            <path d="M5 20c0-3.31 3.13-6 7-6s7 2.69 7 6" stroke="#D4A04A" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="19" y1="8" x2="19" y2="14" stroke="#D4A04A" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="16" y1="11" x2="22" y2="11" stroke="#D4A04A" strokeWidth="1.8" strokeLinecap="round" />
          </svg>)
      },
      {
        n: 4, label: "Your habits and routines", bg: "rgba(40,100,160,0.45)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="#5A9ED8" strokeWidth="1.6" />
            <line x1="3" y1="9" x2="21" y2="9" stroke="#5A9ED8" strokeWidth="1.4" />
            <line x1="8" y1="2" x2="8" y2="6" stroke="#5A9ED8" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="16" y1="2" x2="16" y2="6" stroke="#5A9ED8" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="8" cy="14" r="1" fill="#5A9ED8" />
            <circle cx="12" cy="14" r="1" fill="#5A9ED8" />
            <circle cx="16" cy="14" r="1" fill="#5A9ED8" />
            <circle cx="8" cy="18" r="1" fill="#5A9ED8" />
            <circle cx="12" cy="18" r="1" fill="#5A9ED8" />
          </svg>)
      },
      {
        n: 5, label: "Choosing to begin again", bg: "rgba(100,60,170,0.45)", icon: (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path d="M1 4v6h6" stroke="#A07AE0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3.51 15a9 9 0 1 0 .49-4.5" stroke="#A07AE0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>)
      },
    ];

    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 10, fontFamily: "var(--font-nunito)",
        display: "flex", flexDirection: "column", background: "#0E0B1C"
      }}>
        <img src={lhBg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", zIndex: 20 }}>
          <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 16 }}>🏮</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#6090C0", letterSpacing: "0.1em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>SOS</button>
        </div>

        {/* Main card */}
        <div className="uc-scroll" style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 20px 24px" }}>
          <div className="uc-card" style={{
            width: "100%", maxWidth: 800,
            background: "rgba(12,10,30,0.87)",
            border: "1px solid rgba(100,80,200,0.22)",
            borderRadius: 28, padding: "36px 36px 28px",
            backdropFilter: "blur(24px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
          }}>
            <div className="uc-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

              {/* LEFT */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: 18 }}>
                  <svg viewBox="0 0 60 60" width="46" height="46" fill="none">
                    <path d="M30 48 C18 38 10 28 14 18 C17 10 25 10 30 18 C35 10 43 10 46 18 C50 28 42 38 30 48Z" stroke="#C084FC" strokeWidth="1.5" fill="none" opacity="0.9" />
                    <path d="M30 48 C24 40 20 32 22 24 C24 18 28 17 30 22 C32 17 36 18 38 24 C40 32 36 40 30 48Z" stroke="#A855F7" strokeWidth="1.5" fill="none" opacity="0.7" />
                    <path d="M30 20 L30 48" stroke="#C084FC" strokeWidth="1" opacity="0.4" />
                  </svg>
                </div>

                <h2 className="uc-h2" style={{ fontFamily: "Georgia,serif", fontSize: 28, fontWeight: 700, color: "#F0EEFF", margin: "0 0 12px", lineHeight: 1.3 }}>
                  Some things are{" "}
                  <span style={{ color: "#E07060" }}>not</span>
                  {" "}under your control
                </h2>

                <div style={{ width: 60, height: 2, background: "rgba(150,100,255,0.5)", borderRadius: 2, marginBottom: 24 }} />

                <div className="uc-ta-wrap" style={{
                  borderRadius: 16,
                  border: "1px solid rgba(100,80,180,0.25)",
                  background: "rgba(12,8,30,0.55)",
                  backgroundImage: "repeating-linear-gradient(transparent,transparent 37px,rgba(110,80,200,0.12) 37px,rgba(110,80,200,0.12) 38px)",
                  backgroundSize: "100% 38px",
                  backgroundPositionY: "10px",
                  minHeight: 220,
                }}>
                  <textarea
                    className="uc-ta"
                    value={data.controlText ?? ""}
                    onChange={e => setData({ controlText: e.target.value })}
                    placeholder="Write what's on your mind…"
                    style={{
                      width: "100%", minHeight: 220, background: "transparent", border: "none",
                      padding: "14px 18px", color: "#D0C8F0", fontSize: 15, fontFamily: "Georgia,serif",
                      lineHeight: "38px", resize: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p className="uc-subtitle" style={{ fontSize: 16, color: "rgba(180,165,210,0.7)", lineHeight: 1.65, margin: "0 0 16px", fontStyle: "italic" }}>
                  But no matter what, some things are still under your control
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {ITEMS.map(item => (
                    <div key={item.n} className="uc-item" style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "10px 14px",
                      borderRadius: 14,
                      border: "1px solid rgba(100,80,180,0.2)",
                      background: "rgba(16,12,40,0.5)",
                    }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: "50%",
                        background: "rgba(20,16,50,0.8)",
                        border: "1.5px solid rgba(120,100,200,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        <span style={{ fontSize: 11, color: "rgba(180,160,240,0.75)", fontWeight: 700, fontFamily: "var(--font-baloo)" }}>{item.n}</span>
                      </div>
                      <div className="uc-item-icon" style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: item.bg,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                      }}>
                        {item.icon}
                      </div>
                      <span style={{ fontSize: 15, color: "#C8C0E8", fontFamily: "Georgia,serif", lineHeight: 1.3 }}>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                  <button onClick={onNext} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "14px 36px", borderRadius: 50, border: "none",
                    background: "rgba(90,65,185,0.75)",
                    color: "#EDE8FF", fontSize: 16, fontFamily: "Georgia,serif", fontWeight: 600,
                    cursor: "pointer", backdropFilter: "blur(8px)",
                    boxShadow: "0 4px 20px rgba(80,55,180,0.45)",
                  }}>Done <span style={{ fontSize: 18 }}>→</span></button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 22, opacity: 0.2, textAlign: "center" }}>
              <svg viewBox="0 0 600 14" width="100%" height="10" preserveAspectRatio="none">
                <path d="M0 7 Q75 1 150 7 Q225 13 300 7 Q375 1 450 7 Q525 13 600 7" fill="none" stroke="rgba(140,100,255,0.8)" strokeWidth="1" />
              </svg>
              <svg viewBox="0 0 60 60" width="22" height="22" fill="none" style={{ marginTop: 6 }}>
                <path d="M30 48 C18 38 10 28 14 18 C17 10 25 10 30 18 C35 10 43 10 46 18 C50 28 42 38 30 48Z" stroke="#C084FC" strokeWidth="1.8" fill="none" />
                <path d="M30 48 C24 40 20 32 22 24 C24 18 28 17 30 22 C32 17 36 18 38 24 C40 32 36 40 30 48Z" stroke="#A855F7" strokeWidth="1.4" fill="none" opacity="0.7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     SCREEN 3.7 — CHOOSE RESPONSE
  ═══════════════════════════════════════════════ */
  function Screen38Closure({ onSettled, onProcessing, onSupport, onBack, onSOS, setData, lhBg }: {
    onSettled: () => void; onProcessing: () => void; onSupport: () => void;
    onBack: () => void; onSOS: () => void;
    setData: (d: Partial<LHData>) => void; lhBg?: string;
  }) {
    const [selected, setSelected] = useState<string | null>(null);

    const ICONS: Record<string, React.ReactNode> = {
      settled: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <path d="M12 22C12 22 4 16 4 10a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 12-8 12Z" stroke="#D4607A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 10c0-2-1.5-4-3-4" stroke="#D4607A" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
        </svg>
      ),
      processing: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#C9A050" strokeWidth="1.6" />
          <path d="M12 7v5l3 3" stroke="#C9A050" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      support: (
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="#5B80C8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 10c.5-1.5 2-2.5 4-2.5" stroke="#5B80C8" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
        </svg>
      ),
    };

    const handleContinue = () => {
      if (!selected) return;
      setData({ closure: selected });
      if (selected === "settled") onSettled();
      else if (selected === "processing") onProcessing();
      else onSupport();
    };

    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10, fontFamily: "var(--font-nunito)", display: "flex", flexDirection: "column", background: "#07090F" }}>
        <img src={lhBg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", zIndex: 20 }}>
          <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 2L8 8H3l4 3.5L5 18l7-4 7 4-2-6.5L21 8h-5z" stroke="#C0D0F0" strokeWidth="1.4" fill="none" /></svg>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#C0D0F0", letterSpacing: "0.12em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>SOS</button>
        </div>

        {/* Main card */}
        <div className="cl-scroll" style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 20px 32px" }}>
          <div style={{ width: "100%", maxWidth: 680, background: "rgba(10,10,28,0.82)", border: "1px solid rgba(100,80,200,0.18)", borderRadius: 28, padding: "36px 32px 32px", backdropFilter: "blur(24px)", boxShadow: "0 24px 80px rgba(0,0,0,0.85)" }}>

            {/* Lotus */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <svg viewBox="0 0 60 60" width="42" height="42" fill="none">
                <path d="M30 48 C18 38 10 28 14 18 C17 10 25 10 30 18 C35 10 43 10 46 18 C50 28 42 38 30 48Z" stroke="#C084FC" strokeWidth="1.5" fill="none" opacity="0.9" />
                <path d="M30 48 C24 40 20 32 22 24 C24 18 28 17 30 22 C32 17 36 18 38 24 C40 32 36 40 30 48Z" stroke="#A855F7" strokeWidth="1.5" fill="none" opacity="0.7" />
                <path d="M30 20 L30 48" stroke="#C084FC" strokeWidth="1" opacity="0.35" />
                <circle cx="18" cy="14" r="1.1" fill="#E9D5FF" opacity="0.8" />
                <circle cx="44" cy="10" r="0.9" fill="#E9D5FF" opacity="0.7" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="cl-title" style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 700, color: "#F0EEFF", margin: "0 0 10px", textAlign: "center", letterSpacing: "0.01em" }}>Closure</h2>

            {/* Dot divider */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(130,100,220,0.2)", maxWidth: 70 }} />
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7B5CC8" }} />
              <div style={{ flex: 1, height: 1, background: "rgba(130,100,220,0.2)", maxWidth: 70 }} />
            </div>

            <p style={{ fontSize: 15, color: "rgba(180,165,210,0.65)", textAlign: "center", margin: "0 0 28px", fontStyle: "italic" }}>How are you feeling now?</p>

            {/* 3 option cards */}
            <style>{`.cl-card:hover{background:rgba(30,20,60,0.7)!important;} @media(max-width:600px){.cl-grid{gap:8px!important;} .cl-card{padding:16px 8px 14px!important;} .cl-icon{width:58px!important;height:58px!important;margin-bottom:12px!important;} .cl-label{font-size:13px!important;} .cl-card-wrap{padding:20px 14px 20px!important;} .cl-title{font-size:26px!important;} .cl-scroll{align-items:flex-start!important;}}`}</style>
            <div className="cl-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 28 }}>
              {CLOSURE_OPTIONS.map(o => {
                const sel = selected === o.id;
                return (
                  <div key={o.id} className="cl-card" onClick={() => setSelected(o.id)} style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "24px 16px 20px",
                    borderRadius: 18, cursor: "pointer",
                    background: sel ? `${o.col}18` : "rgba(18,14,40,0.65)",
                    border: `1.5px solid ${sel ? o.col + "80" : "rgba(90,70,160,0.2)"}`,
                    transition: "all 0.18s",
                  }}>
                    {/* Icon circle */}
                    <div className="cl-icon" style={{
                      width: 80, height: 80, borderRadius: "50%",
                      background: sel ? `${o.col}22` : "rgba(14,10,35,0.85)",
                      border: `1.5px solid ${sel ? o.col + "55" : "rgba(70,55,130,0.3)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 18, transition: "all 0.18s",
                    }}>
                      {ICONS[o.id]}
                    </div>
                    {/* Label */}
                    <p className="cl-label" style={{ fontSize: 15, color: sel ? o.col : `${o.col}99`, fontFamily: "Georgia,serif", fontWeight: 600, textAlign: "center", lineHeight: 1.4, margin: "0 0 14px" }}>
                      {o.label}
                    </p>
                    {/* Bottom decoration */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 18, height: 1, background: sel ? `${o.col}60` : "rgba(100,80,180,0.2)" }} />
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: sel ? o.col : "rgba(100,80,180,0.3)" }} />
                      <div style={{ width: 28, height: 1, background: sel ? `${o.col}60` : "rgba(100,80,180,0.2)" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue button */}
            <button onClick={handleContinue} disabled={!selected} style={{
              width: "100%", padding: "16px", borderRadius: 50, border: "none",
              background: selected ? "rgba(100,75,210,0.85)" : "rgba(60,50,120,0.3)",
              color: selected ? "#EDE8FF" : "rgba(180,160,240,0.35)",
              fontSize: 17, fontFamily: "Georgia,serif", fontWeight: 600,
              cursor: selected ? "pointer" : "not-allowed",
              boxShadow: selected ? "0 4px 24px rgba(100,75,210,0.4)" : "none",
              transition: "all 0.2s",
            }}>Continue →</button>

            {/* Bottom lotus */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20, opacity: 0.2 }}>
              <svg viewBox="0 0 60 60" width="22" height="22" fill="none">
                <path d="M30 48 C18 38 10 28 14 18 C17 10 25 10 30 18 C35 10 43 10 46 18 C50 28 42 38 30 48Z" stroke="#C084FC" strokeWidth="1.8" fill="none" />
                <path d="M30 48 C24 40 20 32 22 24 C24 18 28 17 30 22 C32 17 36 18 38 24 C40 32 36 40 30 48Z" stroke="#A855F7" strokeWidth="1.4" fill="none" opacity="0.7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }


  /* ================================================================
     SCREEN 3.9 - COMPLETE
  ================================================================ */
  function Screen39Complete({ closure, coinsAwarded, onIsland, lhBg }: { closure: string; coinsAwarded: boolean; onIsland: () => void; lhBg?: string }) {
    const msg = closure === "settled" ? "You worked through something real today." : closure === "processing" ? "It's okay to still be sitting with it." : "Reaching out takes courage.";
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10, fontFamily: "var(--font-nunito)", display: "flex", flexDirection: "column", background: "#07090F", overflowY: "auto", overflowX: "hidden" }}>
        <img src={lhLastBgImg.src} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", zIndex: 0 }} />
        <div className="resp-scroll" style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center", minHeight: "min-content" }}>
          <div style={{ fontSize: 52, marginBottom: 18 }}>&#x1F3EE;</div>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(24px,5vw,32px)", fontWeight: 700, color: "#F0EEFF", margin: "0 0 14px", lineHeight: 1.3 }}>You showed up for yourself.</h2>
          <p style={{ fontSize: 16, color: "rgba(200,185,230,0.8)", maxWidth: 420, lineHeight: 1.7, margin: "0 0 32px", fontFamily: "Georgia,serif", fontStyle: "italic" }}>{msg}</p>
          <button onClick={onIsland} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 40px", borderRadius: 50, border: "none", background: "rgba(90,65,185,0.8)", color: "#EDE8FF", fontSize: 16, fontFamily: "Georgia,serif", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 24px rgba(80,55,180,0.5)" }}>Return to Island <span style={{ fontSize: 18 }}>&#x2192;</span></button>
        </div>
      </div>
    );
  }

  /* ================================================================
     EMOTION FACE SVGs
  ================================================================ */
  function EmotionFace({ label }: { label: string }) {
    if (label === "Acute Stress") return (
      <svg viewBox="0 0 52 52" width="56" height="56" fill="none">
        <circle cx="26" cy="26" r="21" fill="#E07060"/>
        <path d="M26 3 L26 7" stroke="#E07060" strokeWidth="2" strokeLinecap="round"/>
        <path d="M34 5 L32 9" stroke="#E07060" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 5 L20 9" stroke="#E07060" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 19 L20 22" stroke="#8B1A10" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M32 22 L38 19" stroke="#8B1A10" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M15 26 Q18 23.5 21 26" stroke="#8B1A10" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M31 26 Q34 23.5 37 26" stroke="#8B1A10" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M19 33 Q26 31 33 33" stroke="#8B1A10" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M19 37 Q26 38 33 37" stroke="#8B1A10" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <line x1="21.5" y1="33" x2="21.5" y2="37" stroke="#8B1A10" strokeWidth="1.2"/>
        <line x1="24.5" y1="32" x2="24.5" y2="37" stroke="#8B1A10" strokeWidth="1.2"/>
        <line x1="27.5" y1="32" x2="27.5" y2="37" stroke="#8B1A10" strokeWidth="1.2"/>
        <line x1="30.5" y1="33" x2="30.5" y2="37" stroke="#8B1A10" strokeWidth="1.2"/>
        <path d="M40 15 Q42 12 44 15 Q44 18 42 19 Q40 18 40 15Z" fill="#FFCAB8"/>
      </svg>
    );
    if (label === "Anxiety") return (
      <svg viewBox="0 0 52 52" width="56" height="56" fill="none">
        <circle cx="26" cy="26" r="21" fill="#A970D0"/>
        <path d="M14 19 Q18 15 22 19" stroke="#5A1888" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M30 19 Q34 15 38 19" stroke="#5A1888" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="19" cy="26" r="3.8" fill="#5A1888"/>
        <circle cx="33" cy="26" r="3.8" fill="#5A1888"/>
        <circle cx="20" cy="25" r="1.4" fill="white"/>
        <circle cx="34" cy="25" r="1.4" fill="white"/>
        <path d="M17 34 Q20 32 23 34 Q26 36 29 34 Q32 32 35 34" stroke="#5A1888" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
    if (label === "Overwhelm") return (
      <svg viewBox="0 0 52 52" width="56" height="56" fill="none">
        <circle cx="26" cy="26" r="21" fill="#4A7ABF"/>
        <path d="M14 18 Q18 14 22 18" stroke="#1A3A7F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M30 18 Q34 14 38 18" stroke="#1A3A7F" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M21 26 Q19 24 21 23 Q23 22 23 24 Q23 27 21 26" stroke="#1A3A7F" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M33 26 Q31 24 33 23 Q35 22 35 24 Q35 27 33 26" stroke="#1A3A7F" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <ellipse cx="26" cy="34" rx="5" ry="3.5" stroke="#1A3A7F" strokeWidth="2.2" fill="none"/>
      </svg>
    );
    if (label === "Grief") return (
      <svg viewBox="0 0 52 52" width="56" height="56" fill="none">
        <circle cx="26" cy="26" r="21" fill="#6090B0"/>
        <path d="M14 20 Q18 22 22 20" stroke="#2A5070" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M30 20 Q34 22 38 20" stroke="#2A5070" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M15 26 Q18 30 21 26" stroke="#2A5070" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M31 26 Q34 30 37 26" stroke="#2A5070" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M18 30 Q17 33 18 35 Q20 35 19 33Z" fill="#A8C8E8"/>
        <path d="M34 30 Q33 33 34 35 Q36 35 35 33Z" fill="#A8C8E8"/>
        <path d="M19 38 Q26 34 33 38" stroke="#2A5070" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      </svg>
    );
    if (label === "Numbness") return (
      <svg viewBox="0 0 52 52" width="56" height="56" fill="none">
        <circle cx="26" cy="26" r="21" fill="#80A0B8"/>
        <line x1="14" y1="19" x2="22" y2="19" stroke="#3A6080" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="30" y1="19" x2="38" y2="19" stroke="#3A6080" strokeWidth="2.2" strokeLinecap="round"/>
        <path d="M15 25 L21 25" stroke="#3A6080" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 26 Q18 29 21 26" stroke="#3A6080" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M31 25 L37 25" stroke="#3A6080" strokeWidth="2" strokeLinecap="round"/>
        <path d="M31 26 Q34 29 37 26" stroke="#3A6080" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <line x1="19" y1="35" x2="33" y2="35" stroke="#3A6080" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    );
    if (label === "Frustration") return (
      <svg viewBox="0 0 52 52" width="56" height="56" fill="none">
        <line x1="26" y1="2" x2="26" y2="7" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="46" y1="12" x2="42" y2="14" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="47" y1="26" x2="42" y2="26" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="46" y1="40" x2="42" y2="38" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="36" y1="48" x2="34" y2="43" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="16" y1="48" x2="18" y2="43" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="6" y1="40" x2="10" y2="38" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="5" y1="26" x2="10" y2="26" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="6" y1="12" x2="10" y2="14" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="16" y1="4" x2="18" y2="9" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="36" y1="4" x2="34" y2="9" stroke="#D4701A" strokeWidth="2.2" strokeLinecap="round"/>
        <circle cx="26" cy="26" r="17" fill="#D4701A"/>
        <path d="M13 21 L20 24" stroke="#7A2800" strokeWidth="3" strokeLinecap="round"/>
        <path d="M32 24 L39 21" stroke="#7A2800" strokeWidth="3" strokeLinecap="round"/>
        <ellipse cx="20" cy="28" rx="2.8" ry="2" fill="#7A2800"/>
        <ellipse cx="32" cy="28" rx="2.8" ry="2" fill="#7A2800"/>
        <path d="M18 35 Q26 40 34 35" stroke="#7A2800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    );
    if (label === "Loneliness") return (
      <svg viewBox="0 0 52 52" width="56" height="56" fill="none">
        <circle cx="26" cy="26" r="21" fill="#4A80B0"/>
        <path d="M14 19 Q18 17 22 19" stroke="#1A4070" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M30 19 Q34 17 38 19" stroke="#1A4070" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <circle cx="19" cy="27" r="3" fill="#1A4070"/>
        <circle cx="33" cy="27" r="3" fill="#1A4070"/>
        <circle cx="19.5" cy="27.8" r="1.1" fill="white"/>
        <circle cx="33.5" cy="27.8" r="1.1" fill="white"/>
        <path d="M21 36 Q26 33 31 36" stroke="#1A4070" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      </svg>
    );
    if (label === "Fear") return (
      <svg viewBox="0 0 52 52" width="56" height="56" fill="none">
        <circle cx="26" cy="26" r="21" fill="#7060C0"/>
        <path d="M14 17 Q18 13 22 17" stroke="#2A1060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M30 17 Q34 13 38 17" stroke="#2A1060" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="19" cy="26" r="5" fill="white" stroke="#2A1060" strokeWidth="1.5"/>
        <circle cx="33" cy="26" r="5" fill="white" stroke="#2A1060" strokeWidth="1.5"/>
        <circle cx="19" cy="26.5" r="2.8" fill="#2A1060"/>
        <circle cx="33" cy="26.5" r="2.8" fill="#2A1060"/>
        <circle cx="18" cy="25.3" r="1" fill="white"/>
        <circle cx="32" cy="25.3" r="1" fill="white"/>
        <ellipse cx="26" cy="36" rx="3.5" ry="3" stroke="#2A1060" strokeWidth="2" fill="none"/>
      </svg>
    );
    return <svg viewBox="0 0 52 52" width="56" height="56"><circle cx="26" cy="26" r="21" fill="#888"/></svg>;
  }

  /* ================================================================
     SCREEN: FEELINGS CHECK-IN
  ================================================================ */
  function ScreenFeelingCheckIn({ onNext, onBack, onSOS, lhBg, setData }: {
    onNext: () => void; onBack: () => void; onSOS: () => void;
    lhBg?: string; setData?: (d: Partial<LHData>) => void;
  }) {
    const handleSelect = (label: string) => {
      setData?.({ emotion: label });
      onNext();
    };
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10, fontFamily: "var(--font-nunito)", display: "flex", flexDirection: "column", background: "#07090F", overflowY: "auto", overflowX: "hidden" }}>
        {lhBg && <img src={lhBg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(4,8,20,0.55) 0%, rgba(4,8,20,0.75) 100%)", zIndex: 1 }} />

        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", zIndex: 20 }}>
          <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.12)", color: "#C0D0F0", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 16 }}>🏮</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#C0D0F0", letterSpacing: "0.1em" }}>LIGHTHOUSE</span>
          </div>
          <button onClick={onSOS} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(224,96,80,0.15)", border: "1.5px solid rgba(224,96,80,0.6)", color: "#E07060", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em" }}>SOS</button>
        </div>

        {/* Content */}
        <div className="resp-scroll" style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 40px", minHeight: "min-content" }}>
          {/* Lotus icon */}
          <svg viewBox="0 0 60 60" width="40" height="40" fill="none" style={{ marginBottom: 18, opacity: 0.9 }}>
            <path d="M30 48 C18 38 10 28 14 18 C17 10 25 10 30 18 C35 10 43 10 46 18 C50 28 42 38 30 48Z" stroke="#C084FC" strokeWidth="1.5" fill="none" />
            <path d="M30 48 C24 40 20 32 22 24 C24 18 28 17 30 22 C32 17 36 18 38 24 C40 32 36 40 30 48Z" stroke="#A855F7" strokeWidth="1.5" fill="none" opacity="0.7" />
          </svg>

          {/* Title */}
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(26px,5vw,36px)", fontWeight: 700, color: "#F0EEFF", margin: "0 0 8px", textAlign: "center", letterSpacing: "0.01em" }}>How are you feeling?</h2>
          <p style={{ fontSize: 14, color: "rgba(180,165,210,0.7)", margin: "0 0 32px", fontStyle: "italic", textAlign: "center" }}>Tap what feels closest to you right now</p>

          {/* Emotion grid — 4 columns × 2 rows */}
          <div className="resp-fci-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, width: "100%", maxWidth: 680 }}>
            {LH_EMOTIONS.map(e => (
              <button key={e.label} onClick={() => handleSelect(e.label)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "18px 10px 16px", borderRadius: 18, cursor: "pointer",
                background: e.bg, border: `1.5px solid ${e.col}55`,
                backdropFilter: "blur(12px)",
                transition: "all 0.15s", gap: 8,
                boxShadow: `0 4px 20px ${e.col}22`,
              }}
              onMouseEnter={ev => { (ev.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; (ev.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 28px ${e.col}44`; }}
              onMouseLeave={ev => { (ev.currentTarget as HTMLButtonElement).style.transform = ""; (ev.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 20px ${e.col}22`; }}>
                <EmotionFace label={e.label} />
                <span style={{ fontSize: 13, fontWeight: 700, color: e.col, fontFamily: "Georgia,serif", textAlign: "center", lineHeight: 1.3 }}>{e.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================
     LIGHTHOUSE PAGE (main)
  ================================================================ */
  const EMPTY_DATA: LHData = { emotion: null, feelingColor: null, bodyLocation: null, intensity: null, texture: null, stayWithFeeling: null, stayActivity: null, divingText: "", divingTags: [], controlCheck: null, controlText: "", responses: [], responseNote: "", closure: null };

  export default function LighthousePage() {
    const router = useRouter();
    const isNight = (() => { const h = new Date().getHours(); return h < 5 || h >= 17; })();
    const lhBg = isNight ? lhNightBgImg.src : lhDayBgImg.src;

    // Global styles for responsiveness
    const globalStyles = `
      @media (max-width: 600px) {
        .resp-fci-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .resp-breathe-btns { flex-direction: column !important; }
        .resp-tex-grid { grid-template-columns: repeat(3, 1fr) !important; }
        .resp-ctrl-btns { flex-direction: column !important; }
        .uc-grid, .cl-grid { grid-template-columns: 1fr !important; }
        .resp-scroll { justify-content: flex-start !important; padding-top: 90px !important; }
      }
    `;

    type Screen = "feelings-check-in" | "breathe" | "name-accept" | "feel-q" | "stay-with-it" | "diving" | "control-check" | "under-control" | "not-control" | "closure" | "complete";
    const bgAudioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
      const audio = new Audio("/lighthouse-bg.mp3");
      audio.loop = true;
      audio.volume = 0.4;
      bgAudioRef.current = audio;
      audio.play().catch(() => { });
      return () => { audio.pause(); audio.src = ""; };
    }, []);

    const [screen, setScreen] = useState<Screen>("feelings-check-in");
    const [coinsAwarded, setCoinsAwarded] = useState(false);
    const [showSOS, setShowSOS] = useState(false);
    const [dataState, setDataState] = useState<LHData>(EMPTY_DATA);

    const setData = useCallback((d: Partial<LHData>) => setDataState(prev => ({ ...prev, ...d })), []);
    const goTo = (s: Screen) => setScreen(s);
    const goBack = () => {
      const order: Screen[] = ["feelings-check-in", "breathe", "name-accept", "feel-q", "stay-with-it", "diving", "control-check", "under-control", "not-control", "closure", "complete"];
      const idx = order.indexOf(screen);
      if (idx > 0) setScreen(order[idx - 1]);
      else router.push("/island");
    };
    const goIsland = () => router.push("/island");

    const props = { onBack: goBack, onSOS: () => setShowSOS(true), data: dataState, setData, isNight, lhBg };

    const handleClosure = (val: string) => { setData({ closure: val }); goTo("complete"); };

    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
        {showSOS && (
          <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#1A0A0A", border: "2px solid rgba(224,96,80,0.6)", borderRadius: 20, padding: "32px 28px", maxWidth: 360, width: "90%", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>&#x1F198;</div>
              <h2 style={{ color: "#FF8070", fontFamily: "Georgia,serif", margin: "0 0 12px" }}>Need Support?</h2>
              <p style={{ color: "rgba(220,200,200,0.8)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>It's okay to ask for help. You don't have to go through this alone.</p>
              <button onClick={() => setShowSOS(false)} style={{ padding: "10px 32px", borderRadius: 50, border: "none", background: "rgba(80,60,100,0.6)", color: "#C0B0E0", cursor: "pointer", fontSize: 14 }}>Close</button>
            </div>
          </div>
        )}

        {screen === "feelings-check-in" && <ScreenFeelingCheckIn onNext={() => goTo("breathe")} onBack={goBack} onSOS={() => setShowSOS(true)} lhBg={lhBg} setData={setData} />}
        {screen === "breathe" && <Screen32Breathe onNext={() => goTo("name-accept")} {...props} />}
        {screen === "name-accept" && <Screen33NameAccept onNext={() => goTo("feel-q")} {...props} />}
        {screen === "feel-q" && <Screen34FeelQ onStay={() => goTo("stay-with-it")} onDive={() => goTo("diving")} {...props} />}
        {screen === "stay-with-it" && <Screen341StayWithIt onNext={() => goTo("diving")} {...props} />}
        {screen === "diving" && <Screen35Diving onNext={() => goTo("control-check")} {...props} />}
        {screen === "control-check" && <Screen36ControlCheck onYes={() => goTo("under-control")} onNo={() => goTo("not-control")} onNotSure={() => goTo("closure")} {...props} />}
        {screen === "under-control" && <Screen361UnderControl onNext={() => goTo("closure")} {...props} />}
        {screen === "not-control" && <Screen362NotControl onNext={() => goTo("closure")} {...props} />}
        {screen === "closure" && <Screen38Closure {...props} onSettled={() => handleClosure("settled")} onProcessing={() => handleClosure("processing")} onSupport={() => handleClosure("support")} />}
        {screen === "complete" && <Screen39Complete closure={dataState.closure ?? ""} coinsAwarded={coinsAwarded} onIsland={goIsland} lhBg={lhBg} />}
      </>
    );
  }