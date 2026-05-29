"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import homeBgImg from "./home.jpg";

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
type HomeScreen = "main" | "write-it-out" | "daily-selfie" | "success" | "info";
type SuccessSource = "letter" | "selfie";

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 5 || h >= 17;
}
function getTodayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
}

/* ═══════════════════════════════════════════════
   SVG ICONS
═══════════════════════════════════════════════ */
function LighthouseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect x="10" y="2" width="4" height="3" rx="1" fill="white" opacity="0.9" />
      <path d="M9 5 L15 5 L17 20 L7 20 Z" fill="white" opacity="0.85" />
      <rect x="6" y="20" width="12" height="2" rx="1" fill="white" opacity="0.7" />
      <rect x="9" y="9" width="6" height="1.5" rx="0.5" fill="rgba(255,248,200,0.5)" />
      <rect x="9" y="13" width="6" height="1.5" rx="0.5" fill="rgba(255,248,200,0.5)" />
    </svg>
  );
}
function WriteItOutIcon() {
  return (
    <svg viewBox="0 0 52 52" width="44" height="44" fill="none">
      <rect x="10" y="8" width="28" height="34" rx="4" fill="none" stroke="#C87040" strokeWidth="2" />
      <line x1="16" y1="18" x2="36" y2="18" stroke="#C87040" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="24" x2="36" y2="24" stroke="#C87040" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="30" x2="28" y2="30" stroke="#C87040" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 6 L40 12 L26 26 L20 26 L20 20 Z" fill="#C87040" opacity="0.9" />
      <path d="M34 6 L40 12 L38 14 L32 8 Z" fill="#A05020" />
    </svg>
  );
}
function DailySettleIcon() {
  return (
    <svg viewBox="0 0 52 52" width="44" height="44" fill="none">
      <rect x="10" y="8" width="28" height="36" rx="5" fill="none" stroke="#5A8A6A" strokeWidth="2" />
      <rect x="14" y="8" width="4" height="6" rx="2" fill="#5A8A6A" />
      <rect x="30" y="8" width="4" height="6" rx="2" fill="#5A8A6A" />
      <path d="M22 26 C22 22 28 22 28 26 C28 30 26 32 24 33 C22 32 22 30 22 26Z"
        stroke="#5A8A6A" strokeWidth="1.8" fill="rgba(90,138,106,0.2)" strokeLinejoin="round" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════ */
export default function HomePage() {
  const router = useRouter();
  const isNight = isNightTime();

  /* video intro */
  const [videoReady, setVideoReady] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const bgVideoSrc = isNight ? "/home/Home_night.mp4" : "/home/Home_day.mp4";

  /* screen */
  const [screen, setScreen] = useState<HomeScreen>("main");
  const [successSource, setSuccessSource] = useState<SuccessSource>("letter");

  /* write-it-out */
  const [letterBody, setLetterBody] = useState("");

  /* daily selfie */
  const [selfieDataUrl, setSelfieDataUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const todayStr = getTodayStr();

  /* ── VIDEO INTRO ─────────────────────────────── */
  if (!videoReady) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>
        <video
          key={bgVideoSrc}
          src={bgVideoSrc}
          autoPlay muted playsInline
          onEnded={() => { setVideoFading(true); setTimeout(() => setVideoReady(true), 900); }}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "112%", objectFit: "cover", objectPosition: "center top" }}
        />
        <div style={{
          position: "absolute", inset: 0, background: "#000",
          opacity: videoFading ? 1 : 0,
          transition: videoFading ? "opacity 0.9s ease" : "none",
          pointerEvents: "none",
        }} />
      </div>
    );
  }

  /* ── SHARED BG (sub-screens) ─────────────────── */
  const BgLayer = () => (
    <>
      <img src={homeBgImg.src} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", zIndex: 0 }} />
      {/* White spotlight / oval glow */}
      <div className="oval-glow"
        style={{
          position: "fixed",
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          width: "40vw",
          maxWidth: 950,
          height: "90vh",
          maxHeight: 800,
          borderRadius: "50%",
          opacity: 1,
          filter: "blur(18px)",
          zIndex: 2,
          background: "radial-gradient(ellipse at center, rgba(255,250,243,1) 0%, rgba(255,248,240,0.95) 40%, rgba(255,248,240,0.7) 65%, rgba(255,248,240,0.0) 100%)",
          pointerEvents: "none",
        }}
      />
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:767px){ .oval-glow { width: 92vw !important; } }
      `}</style>
    </>
  );

  /* ════════════════════════════════════════════════
     SCREEN: MAIN (6.0) — storybook redesign
  ════════════════════════════════════════════════ */
  if (screen === "main") return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }}>

      {/* ── Background ── */}
      <img
        src={homeBgImg.src}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", zIndex: 0 }}
      />
      {/* Warm subtle overlay — very light, just a tint */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "rgba(255,248,240,0.10)" }} />

      {/* White spotlight / oval glow */}
      <div
        className="oval-glow"
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          transform: "translate(-50%, -50%)",
          width: "40vw",
          maxWidth: 950,
          height: "90vh",
          maxHeight: 800,
          borderRadius: "50%",
          opacity: 1,
          filter: "blur(18px)",
          zIndex: 2,
          background: "radial-gradient(ellipse at center, rgba(255,250,243,1) 0%, rgba(255,248,240,0.95) 40%, rgba(255,248,240,0.7) 65%, rgba(255,248,240,0.0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Fade-in from black after video */}
      <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "#000", animation: "homeFadeOut 0.9s ease forwards", pointerEvents: "none" }} />

      <style>{`
        @keyframes homeFadeOut { from{opacity:1} to{opacity:0} }
        @keyframes riseIn      { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .dest-card             { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .dest-card:hover       { transform: translateY(-8px) !important; box-shadow: 0 24px 56px rgba(0,0,0,0.18) !important; }
        .arrow-btn             { transition: transform 0.2s ease, background 0.2s ease; }
        .arrow-btn:hover       { transform: scale(1.12) !important; background: rgba(74,38,23,0.18) !important; }
        @media(max-width:767px){
          .hero-title  { font-size: 22px !important; }
          .hero-sub    { font-size: 13px !important; }
          .cards-row   { flex-direction: row !important; align-items: center !important; gap: 12px !important; }
          .dest-card   { width: 42vw !important; max-width: 200px !important; min-width: 140px !important; height: auto !important; min-height: 260px !important; padding: 20px 14px !important; border-radius: 18px !important; }
          .oval-glow   { width: 92vw !important; }
        }
      `}</style>

      {/* ── Header — LIGHTHOUSE wordmark + Island button ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 30px" }}>

        {/* Island button — top left */}
        <button
          onClick={() => router.push("/island")}
          style={{ position: "absolute", left: 30, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 999, background: "white", border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.13)", fontFamily: "var(--font-baloo)", fontWeight: 700, fontSize: 13, color: "#4A2617", letterSpacing: "0.03em" }}
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#4A2617" strokeWidth="1.5"/>
            <path d="M6 14 C6 10 8 7 10 6 C12 7 14 10 14 14" stroke="#4A2617" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="6" y1="14" x2="14" y2="14" stroke="#4A2617" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="6" x2="10" y2="3" stroke="#4A2617" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Island
        </button>

        {/* LIGHTHOUSE wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LighthouseIcon />
          <span style={{ fontSize: 16, letterSpacing: "0.38em", fontWeight: 500, color: "white", fontFamily: "var(--font-baloo)", textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
            LIGHTHOUSE
          </span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 80px", overflowY: "auto" }}>

        {/* Hero title */}
        <h1
          className="hero-title"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontSize: "clamp(24px, 3.5vw, 44px)",
            fontWeight: 600,
            color: "#3A2012",
            lineHeight: 1.1,
            textAlign: "center",
            margin: "0 auto 18px",
            width: "100%",
            maxWidth: 820,
            animation: "riseIn 0.7s ease 0.05s both",
            textShadow: "none",
          }}
        >
          Welcome to<br />your-only Home.
        </h1>

        {/* Decorative divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, animation: "riseIn 0.7s ease 0.15s both" }}>
          <div style={{ width: 56, height: 1, background: "linear-gradient(90deg, transparent, #8B5A3A)" }} />
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
            <path d="M10 3 L13 8 L19 9 L14.5 13 L16 19 L10 16 L4 19 L5.5 13 L1 9 L7 8 Z" stroke="#8B5A3A" strokeWidth="1.5" fill="rgba(139,90,58,0.12)" />
          </svg>
          <div style={{ width: 56, height: 1, background: "linear-gradient(90deg, #8B5A3A, transparent)" }} />
        </div>

        {/* Subtitle */}
        <p
          className="hero-sub"
          style={{
            fontFamily: "var(--font-nunito), sans-serif",
            fontSize: "clamp(13px, 1.4vw, 16px)",
            color: "#5C4033",
            margin: "0 0 40px",
            textAlign: "center",
            animation: "riseIn 0.7s ease 0.2s both",
            textShadow: "none",
          }}
        >
          Now our next destination is Home.
        </p>

        {/* ── Cards Row ── */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", animation: "riseIn 0.7s ease 0.28s both" }}>

          {/* Cards */}
          <div className="cards-row" style={{ display: "flex", gap: 24 }}>

            {/* Card 1 — Write It Out */}
            <button
              className="dest-card"
              onClick={() => setScreen("write-it-out")}
              style={{
                width: 240, height: 320,
                background: "rgba(255,252,248,0.92)",
                backdropFilter: "blur(16px)",
                borderRadius: 24,
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                border: "none",
                padding: "28px 22px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {/* Icon */}
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(220,155,100,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <WriteItOutIcon />
              </div>

              {/* Title + divider + desc */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "6px 0" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 19, fontWeight: 700, color: "#4A2617", margin: 0 }}>
                  Write It Out
                </h3>
                <svg viewBox="0 0 24 12" width="18" height="9">
                  <path d="M12 6 C12 4 14 3 15 4.5 C16 6 15 8 12 10 C9 8 8 6 9 4.5 C10 3 12 4 12 6Z" fill="#C85040" opacity="0.7" />
                </svg>
                <p style={{ fontFamily: "var(--font-nunito), sans-serif", fontSize: 12, color: "#6F5C4D", margin: 0, lineHeight: 1.5, maxWidth: 180 }}>
                  Express your thoughts and let it flow.
                </p>
              </div>

              {/* Arrow button */}
              <div
                className="arrow-btn"
                style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(74,38,23,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6F5C4D", fontSize: 15 }}
              >
                →
              </div>
            </button>

            {/* Card 2 — Daily Settle */}
            <button
              className="dest-card"
              onClick={() => setScreen("daily-selfie")}
              style={{
                width: 240, height: 320,
                background: "rgba(255,252,248,0.92)",
                backdropFilter: "blur(16px)",
                borderRadius: 24,
                boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                border: "none",
                padding: "28px 22px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {/* Icon */}
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(100,155,110,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <DailySettleIcon />
              </div>

              {/* Title + divider + desc */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "6px 0" }}>
                <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 19, fontWeight: 700, color: "#4A2617", margin: 0 }}>
                  Daily Settle
                </h3>
                <svg viewBox="0 0 24 12" width="18" height="9">
                  <path d="M12 6 C12 4 14 3 15 4.5 C16 6 15 8 12 10 C9 8 8 6 9 4.5 C10 3 12 4 12 6Z" fill="#C85040" opacity="0.7" />
                </svg>
                <p style={{ fontFamily: "var(--font-nunito), sans-serif", fontSize: 12, color: "#6F5C4D", margin: 0, lineHeight: 1.5, maxWidth: 180 }}>
                  Create your daily routine for a calmer you.
                </p>
              </div>

              {/* Arrow button */}
              <div
                className="arrow-btn"
                style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid rgba(74,38,23,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6F5C4D", fontSize: 15 }}
              >
                →
              </div>
            </button>
          </div>

        </div>
      </div>

      {/* ── Info button bottom-right ── */}
      <div style={{ position: "absolute", bottom: 30, right: 30, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <button
          onClick={() => setScreen("info")}
          style={{ width: 56, height: 56, borderRadius: "50%", background: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "#4A2617" }}
        >
          i
        </button>

      </div>
    </div>
  );

  /* ════════════════════════════════════════════════
     SCREEN: WRITE IT OUT (6.1.1)
  ════════════════════════════════════════════════ */
  if (screen === "write-it-out") return (
    <div style={{ position: "fixed", inset: 0, fontFamily: "var(--font-nunito)", overflowY: "auto" }}>
      <BgLayer />
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ position: "relative", zIndex: 5, minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 16px 48px" }}>

        {/* Back */}
        <button onClick={() => setScreen("main")} style={{ position: "absolute", top: 20, left: 20, width: 44, height: 44, borderRadius: "50%", background: "white", border: "none", color: "#4A2617", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}>←</button>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeInUp 0.5s ease both", padding: "0 16px" }}>
          <p style={{ fontFamily: "var(--font-baloo)", fontSize: 11, letterSpacing: "0.15em", color: "#8B5E20", textTransform: "uppercase", margin: "0 0 8px", fontWeight: 800 }}>Write It Out</p>
          <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(20px, 4vw, 30px)", fontWeight: 700, color: "#1A0A00", margin: 0, lineHeight: 1.2, textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>
            A letter to my future self
          </h2>
        </div>

        {/* Letter card */}
        <div style={{ width: "100%", maxWidth: 520, background: "rgba(245,236,210,0.97)", borderRadius: 20, padding: "24px 20px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.10)", animation: "fadeInUp 0.5s ease 0.1s both", boxSizing: "border-box" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#3A2006", margin: "0 0 10px", fontStyle: "italic" }}>Dear me,</p>
          <textarea
            value={letterBody}
            onChange={e => setLetterBody(e.target.value)}
            placeholder="Whatever's on your mind... write it out. This is safe with your future self."
            style={{ width: "100%", minHeight: 160, border: "none", outline: "none", resize: "none", background: "transparent", fontFamily: "Georgia, serif", fontSize: 14, lineHeight: 1.8, color: "#2C1A06", boxSizing: "border-box" }}
          />
          <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "#3A2006", margin: "10px 0 0", fontStyle: "italic" }}>Sincerely,<br /><span style={{ fontSize: 12, opacity: 0.6 }}>You</span></p>
          <div style={{ marginTop: 12, borderTop: "1px solid rgba(60,30,0,0.12)", paddingTop: 10 }}>
            <p style={{ fontSize: 11, color: "rgba(80,50,10,0.45)", fontStyle: "italic", margin: 0 }}>🔒 Only you can see this. It&apos;s completely private.</p>
          </div>
        </div>

        {/* Done button */}
        <button
          onClick={() => { setSuccessSource("letter"); setScreen("success"); }}
          disabled={letterBody.trim().length === 0}
          style={{ marginTop: 24, padding: "13px 48px", borderRadius: 50, border: "none", background: letterBody.trim().length > 0 ? "linear-gradient(135deg,#C8860A 0%,#E6A020 100%)" : "rgba(100,80,30,0.15)", color: letterBody.trim().length > 0 ? "#FFF8E8" : "rgba(150,120,60,0.4)", fontFamily: "var(--font-baloo)", fontWeight: 800, fontSize: 15, letterSpacing: "0.08em", cursor: letterBody.trim().length > 0 ? "pointer" : "not-allowed", boxShadow: letterBody.trim().length > 0 ? "0 6px 24px rgba(200,120,10,0.35)" : "none", transition: "all 0.2s", animation: "fadeInUp 0.5s ease 0.2s both" }}
        >
          Done ✓
        </button>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════
     SCREEN: DAILY SELFIE (6.2.1)
  ════════════════════════════════════════════════ */
  if (screen === "daily-selfie") {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => setSelfieDataUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    };
    return (
      <div style={{ position: "fixed", inset: 0, fontFamily: "var(--font-nunito)", overflowY: "auto" }}>
        <BgLayer />
        <div style={{ position: "relative", zIndex: 5, minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px 48px" }}>

          <button onClick={() => { setScreen("main"); setSelfieDataUrl(null); }} style={{ position: "absolute", top: 20, left: 20, width: 44, height: 44, borderRadius: "50%", background: "white", border: "none", color: "#4A2617", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}>←</button>

          <div style={{ textAlign: "center", marginBottom: 28, animation: "fadeInUp 0.5s ease both" }}>
            <p style={{ fontFamily: "var(--font-baloo)", fontSize: 11, letterSpacing: "0.15em", color: "#8B5E20", textTransform: "uppercase", margin: "0 0 10px", fontWeight: 800 }}>Daily Settle</p>
            <h2 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(20px,4vw,30px)", fontWeight: 700, color: "#1A0A00", margin: 0, lineHeight: 1.2, textShadow: "0 1px 0 rgba(255,255,255,0.4)" }}>
              Look at me showing up today
            </h2>
          </div>

          <button onClick={() => fileRef.current?.click()} style={{ marginBottom: 24, padding: "10px 28px", borderRadius: 50, border: "1.5px solid rgba(74,38,23,0.25)", background: "rgba(74,38,23,0.08)", color: "#6F4E2A", fontFamily: "var(--font-baloo)", fontWeight: 800, fontSize: 14, cursor: "pointer", letterSpacing: "0.05em", animation: "fadeInUp 0.5s ease 0.1s both" }}>
            + Add Image
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

          <div style={{ width: 240, background: "#FAFAF8", padding: "14px 14px 44px", borderRadius: 4, boxShadow: "0 16px 48px rgba(0,0,0,0.6)", position: "relative", animation: "fadeInUp 0.5s ease 0.15s both" }}>
            <div style={{ width: "100%", aspectRatio: "1", background: selfieDataUrl ? "transparent" : "#E8E4DC", borderRadius: 2, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {selfieDataUrl ? (
                <img src={selfieDataUrl} alt="selfie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <svg viewBox="0 0 100 100" width="80" height="80" style={{ opacity: 0.3 }}>
                    <line x1="5" y1="5" x2="95" y2="95" stroke="#888" strokeWidth="2" />
                    <line x1="95" y1="5" x2="5" y2="95" stroke="#888" strokeWidth="2" />
                    <rect x="5" y="5" width="90" height="90" stroke="#888" strokeWidth="2" fill="none" />
                  </svg>
                  <p style={{ fontSize: 11, color: "#999", marginTop: 6, fontFamily: "Georgia, serif", fontStyle: "italic" }}>Blank</p>
                </div>
              )}
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 13, color: "#555", margin: 0, letterSpacing: "0.05em" }}>{todayStr}</p>
            </div>
          </div>

          <button
            onClick={() => { setSuccessSource("selfie"); setScreen("success"); }}
            disabled={!selfieDataUrl}
            style={{ marginTop: 32, padding: "13px 48px", borderRadius: 50, border: "none", background: selfieDataUrl ? "linear-gradient(135deg,#C8860A 0%,#E6A020 100%)" : "rgba(100,80,30,0.15)", color: selfieDataUrl ? "#FFF8E8" : "rgba(150,120,60,0.4)", fontFamily: "var(--font-baloo)", fontWeight: 800, fontSize: 15, letterSpacing: "0.08em", cursor: selfieDataUrl ? "pointer" : "not-allowed", boxShadow: selfieDataUrl ? "0 6px 24px rgba(200,120,10,0.35)" : "none", transition: "all 0.2s", animation: "fadeInUp 0.5s ease 0.25s both" }}
          >
            Done ✓
          </button>
          {!selfieDataUrl && <p style={{ marginTop: 8, fontSize: 11, color: "rgba(80,50,10,0.45)", fontStyle: "italic" }}>Add an image to continue</p>}
        </div>
        <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     SCREEN: SUCCESS (6.3)
  ════════════════════════════════════════════════ */
  if (screen === "success") return (
    <div style={{ position: "fixed", inset: 0, fontFamily: "var(--font-nunito)", overflowY: "auto" }}>
      <BgLayer />
      <div style={{ position: "relative", zIndex: 5, minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ animation: "fadeInUp 0.6s ease both" }}>
          <svg viewBox="0 0 60 60" width="64" height="64" fill="none">
            <path d="M30 50 C10 36 4 24 8 14 C11 6 20 4 26 10 L30 14 L34 10 C40 4 49 6 52 14 C56 24 50 36 30 50Z" stroke="#C87A20" strokeWidth="2" fill="rgba(212,160,80,0.25)" />
            <path d="M30 50 C18 40 14 32 16 22 C18 16 24 14 28 18 L30 20 L32 18 C36 14 42 16 44 22 C46 32 42 40 30 50Z" stroke="#A05A10" strokeWidth="1.5" fill="rgba(200,136,32,0.18)" opacity="0.7" />
          </svg>
        </div>
        <div style={{ width: 120, height: 1.5, background: "linear-gradient(90deg,transparent,rgba(139,90,58,0.5),transparent)", margin: "20px 0", animation: "fadeInUp 0.6s ease 0.1s both" }} />
        <div style={{ textAlign: "center", animation: "fadeInUp 0.6s ease 0.15s both" }}>
          <p style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(20px,4vw,28px)", fontWeight: 700, color: "#1A0A00", margin: "0 0 6px" }}>+ 10 seeds credited 🌱</p>
          <p style={{ fontSize: 13, color: "#6F4E2A", fontStyle: "italic", margin: 0 }}>
            {successSource === "letter" ? "Your letter is safely written" : "You showed up today — that matters"}
          </p>
        </div>
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, animation: "fadeInUp 0.6s ease 0.25s both" }}>
          <button onClick={() => router.push("/island")} style={{ padding: "13px 40px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#C8860A 0%,#E6A020 100%)", color: "#FFF8E8", fontFamily: "var(--font-baloo)", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 6px 24px rgba(200,120,10,0.35)", letterSpacing: "0.04em" }}>
            Return to Island →
          </button>
          <button onClick={() => { setScreen("main"); setLetterBody(""); setSelfieDataUrl(null); }} style={{ background: "none", border: "none", color: "rgba(80,50,10,0.5)", fontSize: 13, cursor: "pointer", fontStyle: "italic", fontFamily: "var(--font-nunito)" }}>
            Do another activity
          </button>
        </div>
      </div>
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  /* ════════════════════════════════════════════════
     SCREEN: INFO (6.4)
  ════════════════════════════════════════════════ */
  if (screen === "info") return (
    <div style={{ position: "fixed", inset: 0, fontFamily: "var(--font-nunito)", overflowY: "auto" }}>
      <BgLayer />
      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ position: "relative", zIndex: 5, minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "72px 20px 48px" }}>

        {/* Back */}
        <button onClick={() => setScreen("main")} style={{ position: "absolute", top: 20, left: 20, width: 44, height: 44, borderRadius: "50%", background: "white", border: "none", color: "#4A2617", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}>←</button>

        {/* Card */}
        <div style={{ width: "100%", maxWidth: 480, background: "rgba(255,252,248,0.93)", backdropFilter: "blur(16px)", borderRadius: 24, padding: "32px 28px", boxShadow: "0 8px 40px rgba(0,0,0,0.10)", animation: "fadeInUp 0.5s ease both" }}>

          {/* Label */}
          <p style={{ fontFamily: "var(--font-baloo)", fontSize: 11, letterSpacing: "0.18em", color: "#8B5E20", textTransform: "uppercase", fontWeight: 800, margin: "0 0 12px", textAlign: "center" }}>★ Information ★</p>

          {/* Title */}
          <h3 style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: 22, fontWeight: 700, color: "#1A0A00", margin: "0 0 16px" }}>About your entries</h3>

          {/* Body */}
          <p style={{ fontSize: 14, color: "#4A2D10", lineHeight: 1.8, margin: "0 0 20px" }}>
            All past entries of letters &amp; selfies can be viewed in the{" "}
            <strong style={{ color: "#1A0A00" }}>Profile section</strong>.
          </p>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(74,38,23,0.12)", paddingTop: 18 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(200,140,30,0.08)", borderRadius: 12, padding: "14px 16px" }}>
              <span style={{ fontSize: 20, marginTop: 1, flexShrink: 0 }}>🌱</span>
              <p style={{ fontSize: 14, color: "#4A2D10", lineHeight: 1.7, margin: 0 }}>
                Viewing a past entry costs{" "}
                <strong style={{ color: "#1A0A00" }}>10 seeds</strong> each.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return null;
}