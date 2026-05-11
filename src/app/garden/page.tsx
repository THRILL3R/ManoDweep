"use client";
import socialBgImg from "./social-bg.jpg";
import feelingsBgImg from "./feelings-bg.jpg";
import meditationBgImg from "./meditation-bg.jpg";
import meditationGirlImg from "./meditation-girl.jpg";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */
type SessionType = "morning" | "night";
type Screen =
  | "entry"
  | "meditation" | "gratitude" | "affirmations" | "goals" | "cups" | "complete"
  | "n-stretch" | "n-day-review" | "n-social" | "n-meditation" | "n-complete";
interface GoalItem { text: string; checked: boolean; }
interface Goals {
  personal: GoalItem[]; social: GoalItem[]; wellness: GoalItem[];
  work: GoalItem[]; study: GoalItem[]; hobbies: GoalItem[];
}
/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const GRATITUDE_THEMES = ["People", "Places", "Food", "Opportunities", "Festivals", "Nature", "My Strengths"];
const DAILY_INTENTIONS: Record<number, string[]> = {
  0: ["Connect with the people I love", "Open my heart to new experiences", "Start fresh with positivity"],
  1: ["Overcome challenges with positivity", "Stay focused on my goals", "Believe in myself and my abilities"],
  2: ["Face my challenges head on", "Practice patience with myself", "Take one step at a time"],
  3: ["Be mindful of my thoughts", "Spread kindness today", "Find peace in the present moment"],
  4: ["Express my gratitude openly", "Notice the good in my day", "Appreciate what I already have"],
  5: ["Bring joy to those around me", "Let go of stress and worry", "Celebrate my progress this week"],
  6: ["Rest without guilt today", "Enjoy the simple moments", "Nurture my creativity and spirit"],
};
const DAILY_INTENTION_ICONS: Record<number, string[]> = {
  0: ["🤝", "🌺", "✨"],
  1: ["🏔️", "🎯", "🌱"],
  2: ["⚡", "🕊️", "👣"],
  3: ["🧘", "💛", "🌿"],
  4: ["🙏", "👀", "💎"],
  5: ["😊", "🍃", "🎉"],
  6: ["😴", "🌸", "🎨"],
};
const GOAL_CATS: { key: keyof Goals; label: string; pin: string; header: string; bg: string }[] = [
  { key: "personal", label: "Personal", pin: "#D94F4F", header: "#FADADB", bg: "#FFF8F8" },
  { key: "social", label: "Social", pin: "#3D9970", header: "#C8EDD8", bg: "#F4FDF7" },
  { key: "wellness", label: "Wellness", pin: "#C47A1E", header: "#FDECC8", bg: "#FFFDF4" },
  { key: "work", label: "Work / Learning", pin: "#2980B9", header: "#C8DFF0", bg: "#F4F9FD" },
  { key: "study", label: "Study", pin: "#B8921A", header: "#F5ECC8", bg: "#FFFDF0" },
  { key: "hobbies", label: "Hobbies", pin: "#D35400", header: "#FDDAC8", bg: "#FFF8F4" },
];
const CUP_DATA = [
  { color: "#F94144", label: "Peace", message: "May you find stillness in the chaos around you." },
  { color: "#F9C74F", label: "Joy", message: "May laughter find you in unexpected places today." },
  { color: "#F3722C", label: "Courage", message: "May you take the leap you have been afraid to take." },
  { color: "#43AA8B", label: "Rest", message: "May you give yourself the rest you truly deserve." },
  { color: "#277DA1", label: "Love", message: "May you feel deeply seen and truly understood." },
  { color: "#90BE6D", label: "Hope", message: "May tomorrow bring more light than today." },
];
/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
function getSessionType(): SessionType {
  const h = new Date().getHours();
  return (h >= 5 && h < 17) ? "morning" : "night";
}
function getGratitudeTheme(): string {
  const epochWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  return GRATITUDE_THEMES[epochWeek % 7];
}
function getDayIntentions(): string[] { return DAILY_INTENTIONS[new Date().getDay()]; }
function emptyGoals(): Goals {
  const items = (): GoalItem[] => Array(3).fill(null).map(() => ({ text: "", checked: false }));
  return { personal: items(), social: items(), wellness: items(), work: items(), study: items(), hobbies: items() };
}
async function saveGarden(payload: Record<string, unknown>) {
  await fetch("/api/garden", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
}
const DAY_NAMES = ["Slow Sunday", "Motivation Monday", "Thoughtful Tuesday", "Wellness Wednesday", "Thankful Thursday", "Feel-Good Friday", "Serene Saturday"];
/* ═══════════════════════════════════════════════════
   SVGS
═══════════════════════════════════════════════════ */
const PuppySVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <path d="M 30 70 C 30 40, 70 40, 70 70 L 70 85 C 70 90, 30 90, 30 85 Z" fill="#F9C74F" />
    <circle cx="50" cy="45" r="25" fill="#F9C74F" />
    <path d="M 25 40 C 15 45, 15 65, 25 65 C 30 65, 30 45, 25 40 Z" fill="#D4A33B" />
    <path d="M 75 40 C 85 45, 85 65, 75 65 C 70 65, 70 45, 75 40 Z" fill="#D4A33B" />
    <circle cx="40" cy="40" r="4" fill="#333" /><circle cx="60" cy="40" r="4" fill="#333" />
    <ellipse cx="50" cy="52" rx="12" ry="8" fill="#FFF8EC" />
    <ellipse cx="50" cy="49" rx="4" ry="3" fill="#333" />
    <path d="M 45 53 Q 50 58 55 53" fill="none" stroke="#333" strokeWidth="2" />
    <path d="M 32 60 Q 50 70 68 60" fill="none" stroke="#F94144" strokeWidth="4" />
    <circle cx="50" cy="65" r="5" fill="#F9C74F" stroke="#D4A33B" strokeWidth="1" />
    <ellipse cx="35" cy="85" rx="8" ry="5" fill="#D4A33B" />
    <ellipse cx="65" cy="85" rx="8" ry="5" fill="#D4A33B" />
  </svg>
);
const MeditationSVG = () => (
  <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B3DFF5" /><stop offset="100%" stopColor="#D6EFF8" /></linearGradient></defs>
    <rect width="300" height="200" fill="url(#sky)" />
    <ellipse cx="50" cy="40" rx="35" ry="18" fill="rgba(255,255,255,0.7)" />
    <ellipse cx="220" cy="30" rx="45" ry="20" fill="rgba(255,255,255,0.7)" />
    <ellipse cx="140" cy="55" rx="30" ry="14" fill="rgba(255,255,255,0.6)" />
    <path d="M 0 150 Q 75 110 150 150 T 300 150 L 300 200 L 0 200 Z" fill="#8BC34A" />
    <path d="M 0 165 Q 80 140 160 165 T 300 165 L 300 200 L 0 200 Z" fill="#6AAF2A" />
    <ellipse cx="150" cy="190" rx="80" ry="14" fill="#5A9F20" />
    <rect x="130" y="130" width="14" height="30" rx="3" fill="#5D8AA8" />
    <ellipse cx="137" cy="125" rx="18" ry="18" fill="#FDDBB4" />
    <path d="M 120 125 Q 137 105 154 125" fill="#8B5E3C" />
    <path d="M 110 155 Q 90 175 95 185" fill="none" stroke="#FDDBB4" strokeWidth="9" strokeLinecap="round" />
    <path d="M 164 155 Q 184 175 179 185" fill="none" stroke="#FDDBB4" strokeWidth="9" strokeLinecap="round" />
    <ellipse cx="137" cy="190" rx="55" ry="8" fill="#7B68EE" opacity="0.3" />
    <path d="M 110 190 Q 137 195 164 190 L 160 185 Q 137 190 114 185 Z" fill="#9B8DCC" />
    <line x1="40" y1="60" x2="55" y2="50" stroke="#90BE6D" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="260" y1="40" x2="275" y2="30" stroke="#90BE6D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
function ThankYouJarSVG({ count }: { count: number }) {
  const fillH = [0, 25, 50, 72][count];
  return (
    <svg viewBox="0 0 120 150" width="120" height="150">
      <path d="M 38 18 L 82 18 L 78 28 L 42 28 Z" fill="#8B5E3C" />
      <rect x="42" y="6" width="36" height="12" rx="3" fill="#A8754A" />
      <path d="M 42 28 C 12 28, 10 138, 22 138 L 98 138 C 110 138, 108 28, 78 28 Z" fill="#E8F4FB" opacity="0.85" />
      {count > 0 && (
        <clipPath id="jar-clip"><path d="M 42 28 C 12 28, 10 138, 22 138 L 98 138 C 110 138, 108 28, 78 28 Z" /></clipPath>
      )}
      {count > 0 && (
        <g clipPath="url(#jar-clip)">
          <rect x="10" y={138 - fillH} width="100" height={fillH} fill="#FFF9C4" opacity="0.6" />
          {Array.from({ length: count * 3 }).map((_, i) => (
            <g key={i} transform={`translate(${20 + (i % 4) * 22}, ${125 - Math.floor(i / 4) * 24}) rotate(${(i % 3 - 1) * 8})`}>
              <rect x="0" y="0" width="22" height="16" rx="2" fill="#FFF176" opacity="0.9" />
              <path d="M 6 10 Q 11 14 16 10" fill="none" stroke="#F9A825" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="11" cy="6" r="2" fill="#F9A825" opacity="0.7" />
            </g>
          ))}
        </g>
      )}
      <rect x="30" y="72" width="60" height="28" rx="6" fill="rgba(255,255,255,0.75)" />
      <text x="60" y="83" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#5C3A00" fontFamily="sans-serif">Thank You</text>
      <text x="60" y="93" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#5C3A00" fontFamily="sans-serif">Jar</text>
      <ellipse cx="46" cy="86" rx="4" ry="3" fill="#F9C74F" opacity="0.8" />
      <path d="M 22 55 C 18 80, 20 110, 24 130" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="5" strokeLinecap="round" />
      <path d="M 42 28 C 12 28, 10 138, 22 138 L 98 138 C 110 138, 108 28, 78 28 Z" fill="none" stroke="#93C9E8" strokeWidth="2.5" />
    </svg>
  );
}
function CupSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 100" width="52" height="52">
      <path d="M 20 20 L 80 20 L 70 80 C 65 90, 35 90, 30 80 Z" fill={color} />
      <path d="M 80 30 Q 95 30 95 45 Q 95 60 75 60" fill="none" stroke={color} strokeWidth="6" />
      <path d="M 30 38 Q 50 32 70 38" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function SeedJarSVG() {
  return (
    <svg viewBox="0 0 100 130" width="90" height="117">
      <path d="M 30 12 L 70 12 L 66 22 L 34 22 Z" fill="#8B5E3C" />
      <rect x="34" y="4" width="32" height="10" rx="2" fill="#A8754A" />
      <path d="M 34 22 C 10 22, 8 118, 18 118 L 82 118 C 92 118, 90 22, 66 22 Z" fill="#E8F4FB" opacity="0.8" />
      <clipPath id="seed-clip"><path d="M 34 22 C 10 22, 8 118, 18 118 L 82 118 C 92 118, 90 22, 66 22 Z" /></clipPath>
      <g clipPath="url(#seed-clip)">
        <rect x="8" y="80" width="84" height="40" fill="#D4A33B" opacity="0.7" />
        {[{ x: 22, y: 90 }, { x: 38, y: 85 }, { x: 54, y: 92 }, { x: 68, y: 87 }, { x: 30, y: 100 }, { x: 50, y: 105 }, { x: 65, y: 98 }, { x: 42, y: 97 }].map((p, i) => (
          <ellipse key={i} cx={p.x} cy={p.y} rx="6" ry="4" fill="#C8860A" opacity="0.9" transform={`rotate(${i * 23},${p.x},${p.y})`} />
        ))}
      </g>
      <path d="M 34 22 C 10 22, 8 118, 18 118 L 82 118 C 92 118, 90 22, 66 22 Z" fill="none" stroke="#93C9E8" strokeWidth="2" />
    </svg>
  );
}
/* ═══════════════════════════════════════════════════
   GARDEN BACKGROUND
═══════════════════════════════════════════════════ */
function GardenBackground({ isNight }: { isNight: boolean }) {
  return (
    <>
      <style>{`
        @keyframes float-cloud{0%{transform:translateX(-200px)}100%{transform:translateX(110vw)}}
        @keyframes fly-bird{0%{transform:translateX(-60px) translateY(0)}50%{transform:translateX(50vw) translateY(-18px)}100%{transform:translateX(110vw) translateY(0)}}
        @keyframes twinkle{0%,100%{opacity:0.2}50%{opacity:1}}
        @keyframes lantern-glow{0%,100%{opacity:0.7}50%{opacity:1}}
        @keyframes seed-fall{0%{transform:translateY(-20px);opacity:0}60%{opacity:1}100%{transform:translateY(0);opacity:0.8}}
        .gbird{position:absolute;width:10px;height:10px;border-top:2px solid rgba(80,40,10,0.5);border-radius:50% 50% 0 0}
        .gbird::after{content:'';position:absolute;left:10px;top:0;width:10px;height:10px;border-top:2px solid rgba(80,40,10,0.5);border-radius:50% 50% 0 0}
        .gb1{top:14%;left:-50px;animation:fly-bird 34s linear infinite}
        .gb2{top:19%;left:-80px;animation:fly-bird 42s linear infinite 7s}
        .gb3{top:9%;left:-120px;animation:fly-bird 48s linear infinite 18s}
        @media(max-width:480px){.garden-goals-grid{grid-template-columns:1fr 1fr!important}}
      `}</style>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url('/garden-bg.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, transition: "background 1.2s", background: isNight ? "rgba(5,10,30,0.65)" : "rgba(255,200,100,0.12)" }} />
      {!isNight && (<div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "40%", zIndex: 3, pointerEvents: "none" }}><div className="gbird gb1" /><div className="gbird gb2" /><div className="gbird gb3" /></div>)}
      {isNight && Array.from({ length: 30 }).map((_, i) => (<div key={i} style={{ position: "absolute", width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, borderRadius: "50%", background: i % 5 === 0 ? "#ffe8a0" : "white", left: `${(i * 41 + 7) % 96}%`, top: `${(i * 19 + 5) % 38}%`, animation: `twinkle ${1.2 + i % 4 * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.18}s`, zIndex: 3 }} />))}
      {isNight && (<div style={{ position: "absolute", top: "5%", right: "7%", zIndex: 4 }}><div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,#FEF9C3,#F9C74F)", boxShadow: "0 0 36px 8px rgba(249,199,79,0.35)" }} /><div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(5,10,30,0.85)", position: "absolute", top: -2, left: 10 }} /></div>)}
      {isNight && (<div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 64, zIndex: 4, pointerEvents: "none" }}>{[8, 22, 36, 50, 64, 78, 92].map((pct, i) => (<div key={i} style={{ position: "absolute", left: `${pct}%`, top: i % 2 === 0 ? 12 : 22, width: 11, height: 17, borderRadius: "3px 3px 5px 5px", background: ["#F9C74F", "#E8920A", "#F4C06A", "#F9C74F", "#E8920A", "#F4C06A", "#F9C74F"][i], boxShadow: "0 0 10px 4px rgba(249,199,79,0.55)", animation: `lantern-glow ${1.8 + i * 0.25}s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }} />))}</div>)}
    </>
  );
}
/* ═══════════════════════════════════════════════════
   UI PRIMITIVES
═══════════════════════════════════════════════════ */
function ParchCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "linear-gradient(160deg,#FDF8EE 0%,#F2E3C0 100%)",
      border: "1.5px solid #C9A870", borderRadius: 28, padding: "28px 22px",
      maxWidth: 480, width: "100%", margin: "0 auto", position: "relative",
      boxShadow: "0 6px 32px rgba(80,40,0,0.2),inset 0 0 40px rgba(255,220,140,0.08)",
      display: "flex", flexDirection: "column", gap: 16, ...style
    }}>
      {children}
    </div>
  );
}
function GoldBtn({ children, onClick, full, outline, small, disabled }: {
  children: React.ReactNode; onClick?: () => void; full?: boolean; outline?: boolean; small?: boolean; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: outline ? "transparent" : "linear-gradient(135deg,#FFD740,#F9A825)",
      border: outline ? "2px solid #C9A870" : "none",
      borderRadius: 99,
      padding: small ? "9px 20px" : "13px 28px",
      cursor: "pointer", fontFamily: "var(--font-baloo)",
      fontSize: small ? 14 : 17, fontWeight: 800,
      color: outline ? "#8C6A3F" : "#5C3A00",
      boxShadow: outline ? "none" : "0 4px 0 #B8720A,0 6px 16px rgba(200,120,0,0.22)",
      width: full ? "100%" : undefined, transition: "transform 0.1s,box-shadow 0.1s",
    }}>
      {children}
    </button>
  );
}
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,248,232,0.8)", border: "1.5px solid #C9A870", borderRadius: 99, width: 36, height: 36, cursor: "pointer", color: "#8C6A3F", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>←</button>
  );
}
function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 99, transition: "all 0.3s", background: i === step ? "#E8920A" : i < step ? "rgba(232,146,10,0.45)" : "rgba(200,160,80,0.2)" }} />
      ))}
    </div>
  );
}
/* ═══════════════════════════════════════════════════
   SCREEN: ENTRY (2.0)
═══════════════════════════════════════════════════ */
function ScreenEntry({ isNight, dogName, onStart, onBack, coins, elapsed }: {
  isNight: boolean; dogName: string; coins: number; elapsed: number;
  onStart: () => void; onBack: () => void;
}) {
  const FEATURES = [
    { icon: "🌱", label: "Daily rituals", sub: "Build mindful habits" },
    { icon: "💗", label: "Gratitude", sub: "Focus on the good" },
    { icon: "📋", label: "Reflection", sub: "Understand yourself better" },
    { icon: "🪣", label: "Growth", sub: "Nourish your mind" },
  ];
  const mins = Math.floor(elapsed / 60);
  const timeStr = mins > 0 ? `${mins} min` : `${elapsed}s`;
  const TIPS = [
    "Take a deep breath. You're doing just fine.",
    "Small steps every day lead to big changes.",
    "You showed up — that already matters.",
    "Be kind to yourself today.",
  ];
  const tip = TIPS[new Date().getDay() % TIPS.length];
  return (
    <div className={`e-wrap${isNight ? " e-night" : ""}`}>
      <style>{`
        /* ── WRAPPER ── */
        .e-wrap{width:100%;max-width:440px;margin:0 auto;display:flex;flex-direction:column;padding-bottom:80px;}
        @media(max-width:480px){
          .e-wrap{position:fixed;inset:0;max-width:100%;padding:0;display:flex;flex-direction:column;overflow:hidden;z-index:20;}
        }
        /* ── TOP BAR ── */
        .e-header{display:flex;align-items:center;justify-content:space-between;padding:14px 8px 0;flex-shrink:0;}
        .e-back{width:36px;height:36px;border-radius:50%;background:rgba(40,20,0,0.60);border:none;cursor:pointer;color:#FFF8E7;font-size:17px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px);flex-shrink:0;}
        .e-topright{display:flex;align-items:center;gap:8px;}
        .e-pill{display:flex;align-items:center;gap:6px;background:rgba(40,20,0,0.60);border-radius:99px;padding:7px 14px;backdrop-filter:blur(6px);color:#FFF8E7;font-size:13px;font-weight:700;}
        .e-pill-div{width:1px;height:13px;background:rgba(255,248,220,0.3);}
        @media(max-width:480px){
          .e-header{padding:10px 14px 0;}
          /* on mobile coins+timer go in one pill in the center area */
          .e-header{justify-content:space-between;}
        }
        /* ── SCROLLABLE CONTENT AREA (mobile) ── */
        .e-scroll{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;}
        @media(min-width:481px){.e-scroll{display:contents;}}
        /* ── CARD ── */
        .e-card{
          background:linear-gradient(170deg,#FEFAF0 0%,#F5E8C8 100%);
          border-radius:26px;border:2px solid #D4B068;
          padding:8px 20px 22px;width:100%;margin:60px auto 0;position:relative;overflow:visible;
          box-shadow:0 4px 0 #B8860A,0 8px 32px rgba(90,50,0,0.32),inset 0 1px 0 rgba(255,255,255,0.7);
          flex-shrink:0;
        }
        @media(max-width:480px){
          .e-card{margin:10px 12px 0;width:calc(100% - 24px);border-radius:24px;padding:0 16px 16px;overflow:visible;}
        }
        .e-card::before{content:'';position:absolute;inset:5px;border-radius:21px;border:1px solid rgba(210,175,90,0.3);pointer-events:none;}
        /* ── AVATAR ── */
        .e-avatar-wrap{position:absolute;top:-52px;left:0;right:0;margin:0;display:flex;justify-content:center;z-index:5;}
        @media(max-width:480px){
          .e-avatar-wrap{
            position:absolute;top:-90px;left:0;right:0;
            margin:0;display:flex;justify-content:center;z-index:5;
          }
          .e-card{padding-top:6px;overflow:visible;}
        }
        .e-leaves{position:absolute;top:-14px;left:50%;transform:translateX(-50%);width:130px;height:52px;pointer-events:none;}
        @media(max-width:480px){.e-leaves{width:110px;height:44px;top:-10px;}}
        .e-avatar-ring{
          width:96px;height:96px;border-radius:50%;border:4px solid #C9A050;
          background:linear-gradient(160deg,#FDF8EE,#F2E3C0);
          box-shadow:0 6px 20px rgba(100,60,0,0.3),0 2px 0 #9A7020;
          overflow:hidden;display:flex;align-items:center;justify-content:center;position:relative;z-index:1;flex-shrink:0;
        }
        @media(max-width:480px){.e-avatar-ring{width:80px;height:80px;border-width:3px;}}
        /* ── TEXT ── */
        .e-title{font-family:var(--font-baloo);font-size:clamp(20px,5vw,28px);color:#1E5C1E;font-weight:900;text-align:center;margin:4px 0 6px;line-height:1.2;text-shadow:0 1px 0 rgba(255,255,255,0.5);}
        @media(max-width:480px){.e-title{font-size:24px;margin:2px 0 5px;}}
        .e-sub{color:#7A5C2E;font-size:13.5px;line-height:1.65;text-align:center;margin:0 0 14px;}
        @media(max-width:480px){.e-sub{font-size:12.5px;line-height:1.6;margin:0 0 12px;}}
        /* ── FEATURE TILES ── */
        .e-feats{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:1fr;gap:8px;margin-bottom:16px;align-items:stretch;}
        @media(max-width:480px){.e-feats{grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px;}}
        .e-feat{
          display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:4px;
          background:linear-gradient(170deg,#FFFDF4,#FBF0D0);
          border:1.5px solid #DEC880;border-radius:14px;padding:12px 8px 10px;text-align:center;
          box-shadow:0 3px 0 #C8A840,0 4px 10px rgba(160,100,0,0.1),inset 0 1px 0 rgba(255,255,255,0.8);
        }
        @media(max-width:480px){.e-feat{padding:12px 8px 10px;border-radius:14px;}}
        .e-feat-icon{font-size:28px;line-height:1;margin-bottom:3px;}
        @media(max-width:480px){.e-feat-icon{font-size:26px;}}
        .e-feat-lbl{font-family:var(--font-baloo);font-size:11.5px;font-weight:800;color:#4A2E00;line-height:1.2;}
        .e-feat-sub{font-size:10px;color:#9A7A50;line-height:1.3;margin-top:2px;}
        /* ── BUTTONS ── */
        .e-start{
          width:100%;padding:15px 28px;border:none;border-radius:99px;cursor:pointer;
          font-family:var(--font-baloo);font-size:18px;font-weight:900;color:#3D2000;
          background:linear-gradient(135deg,#FFD740 0%,#F9A825 60%,#E8920A 100%);
          box-shadow:0 5px 0 #A86200,0 8px 24px rgba(200,120,0,0.28);
          transition:transform 0.12s,box-shadow 0.12s;
        }
        @media(max-width:480px){.e-start{padding:13px 20px;font-size:17px;box-shadow:0 4px 0 #A86200;}}
        .e-start:active{transform:translateY(3px);box-shadow:0 2px 0 #A86200;}
        .e-map{
          width:100%;padding:13px 28px;border:2px solid #C9A050;border-radius:99px;cursor:pointer;
          font-family:var(--font-baloo);font-size:16px;font-weight:700;color:#7A5820;
          background:rgba(255,252,240,0.5);margin-top:10px;transition:background 0.15s;
        }
        @media(max-width:480px){.e-map{padding:11px 20px;font-size:15px;margin-top:8px;}}
        /* ── BUDDY BAR ── */
        .e-buddy{display:flex;align-items:center;gap:12px;background:rgba(35,16,0,0.82);border-radius:18px;padding:13px 16px;margin-top:10px;backdrop-filter:blur(8px);flex-shrink:0;}
        @media(max-width:480px){
          .e-buddy{margin:0;border-radius:0;border-top:1px solid rgba(255,200,80,0.15);padding:12px 16px 20px;}
        }
        .e-buddy-av{width:46px;height:46px;border-radius:50%;border:2px solid #C9A050;overflow:hidden;flex-shrink:0;position:relative;}
        @media(max-width:480px){.e-buddy-av{width:44px;height:44px;}}
        .e-buddy-name{color:#F9C74F;font-family:var(--font-baloo);font-size:13px;font-weight:800;margin-bottom:3px;}
        .e-buddy-q{color:#F0DFC0;font-size:12px;line-height:1.4;}
        .e-buddy-chevron{width:30px;height:30px;border-radius:50%;background:rgba(255,200,80,0.15);border:1px solid rgba(255,200,80,0.25);display:flex;align-items:center;justify-content:center;color:#F9C74F;font-size:14px;flex-shrink:0;cursor:pointer;}
        .e-tip{display:flex;align-items:center;gap:7px;border-left:1.5px solid rgba(255,240,180,0.2);padding-left:12px;flex-shrink:0;max-width:155px;}
        /* ═══ NIGHT OVERRIDES ═══ */
        .e-night .e-card{
          background:linear-gradient(160deg,#2E1A08 0%,#1A0D04 100%) !important;
          border:2px solid #C9A050 !important;
          box-shadow:0 5px 0 #7A4800,0 8px 32px rgba(0,0,0,0.55),inset 0 0 60px rgba(255,180,60,0.04) !important;
        }
        .e-night .e-card::before{border-color:rgba(201,160,80,0.18) !important;}
        .e-night .e-avatar-ring{
          border-color:#C9A050 !important;
          background:linear-gradient(160deg,#3A2008,#1E0E02) !important;
          box-shadow:0 0 0 3px rgba(201,160,80,0.25),0 6px 20px rgba(0,0,0,0.5) !important;
        }
        .e-night .e-title{color:#F5E4A8 !important;text-shadow:0 0 20px rgba(255,200,80,0.3) !important;}
        .e-night .e-sub{color:#C8A870 !important;}
        .e-night .e-feat{
          background:linear-gradient(160deg,#241404,#180C02) !important;
          border-color:#7A5010 !important;
          box-shadow:0 3px 0 #4A2C00,0 4px 10px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,180,60,0.06) !important;
        }
        .e-night .e-feat-lbl{color:#E8C87A !important;}
        .e-night .e-feat-sub{color:#907040 !important;}
        .e-night .e-start{
          background:linear-gradient(135deg,#FFD740 0%,#F9A825 60%,#E8920A 100%) !important;
          box-shadow:0 5px 0 #7A4800,0 8px 24px rgba(200,120,0,0.4) !important;
        }
        .e-night .e-map{
          border-color:#7A5010 !important;
          color:#C9A050 !important;
          background:rgba(40,20,4,0.6) !important;
        }
        /* string lights across card top */
        .e-lights{
          position:absolute;top:0;left:0;right:0;height:28px;pointer-events:none;z-index:2;overflow:hidden;
        }
        .e-light{
          position:absolute;top:6px;width:7px;height:10px;border-radius:3px 3px 5px 5px;
          animation:light-glow 2s ease-in-out infinite;
        }
        @keyframes light-glow{0%,100%{opacity:0.7;filter:brightness(1);}50%{opacity:1;filter:brightness(1.4);}}
        .e-night .e-buddy{background:rgba(20,10,2,0.92) !important;border-top-color:rgba(201,160,80,0.2) !important;}
        .e-tip-lbl{color:#90D47A;font-size:10.5px;font-weight:700;margin-bottom:2px;}
        .e-tip-txt{color:#EDD9B0;font-size:10.5px;line-height:1.4;}
        @media(max-width:480px){.e-tip{display:none;}.e-buddy-chevron-desktop{display:none;}}
        @media(min-width:481px){.e-buddy-chevron{display:none;}}
      `}</style>
      {/* ── Top bar ── */}
      <div className="e-header">
        <button className="e-back" onClick={onBack}>&#8249;</button>
        <div className="e-topright">
          <div className="e-pill">
            <span style={{ fontSize: 15 }}>🟡</span>
            <span>{coins}</span>
            <div className="e-pill-div" />
            <span style={{ fontSize: 13 }}>⏱</span>
            <span>{timeStr}</span>
          </div>
        </div>
      </div>
      {/* ── Scrollable middle (mobile) / normal (desktop) ── */}
      <div className="e-scroll">
        {/* Main card */}
        <div className="e-card">
          {isNight && (
            <div className="e-lights">
              {[
                { l: "9%", c: "#F9C74F" }, { l: "18%", c: "#F3722C" }, { l: "27%", c: "#F9C74F" }, { l: "36%", c: "#43AA8B" },
                { l: "45%", c: "#F9C74F" }, { l: "54%", c: "#F3722C" }, { l: "63%", c: "#F9C74F" }, { l: "72%", c: "#43AA8B" },
                { l: "81%", c: "#F9C74F" }, { l: "90%", c: "#F3722C" }
              ].map((lt, i) => (
                <div key={i} className="e-light" style={{ left: lt.l, background: lt.c, boxShadow: `0 0 8px 3px ${lt.c}88`, animationDelay: `${i * 0.22}s` }} />
              ))}
            </div>
          )}

          <h2 className="e-title">🌿 Welcome to the Garden 🌿</h2>
          <p className="e-sub">
            Good {isNight ? "evening" : "morning"}! {dogName} is happy to see you.<br />
            A space to pause, breathe, and come back to yourself.
          </p>
          <div className="e-feats">
            {FEATURES.map(f => (
              <div key={f.label} className="e-feat">
                <span className="e-feat-icon">{f.icon}</span>
                <span className="e-feat-lbl">{f.label}</span>
                <span className="e-feat-sub">{f.sub}</span>
              </div>
            ))}
          </div>
          <button className="e-start" onClick={onStart}>Start My Garden 🌱</button>
          <button className="e-map" onClick={onBack}>Back to Map 🗺️</button>
        </div>
      </div>
      {/* ── Buddy bar ── */}
      <div className="e-buddy">
        <div className="e-buddy-av" style={{ position: "relative" }}>
          <img src="/dog-avatar.png" alt={dogName} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%", borderRadius: "50%", zIndex: 1 }} onError={e => { e.currentTarget.style.display = "none"; }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="e-buddy-name">Buddy says 🐾</div>
          <div className="e-buddy-q">Let&#39;s grow something beautiful together today.</div>
        </div>
        <div className="e-buddy-chevron">&#8679;</div>
        <div className="e-tip">
          <div>
            <div className="e-tip-lbl">🌿 Quick tip 🌿</div>
            <div className="e-tip-txt">{tip}</div>
          </div>
          <span style={{ color: "#F9C74F", fontSize: 18, opacity: 0.7 }}>&#8250;</span>
        </div>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════
   SCREEN: MORNING MEDITATION (2.1)
═══════════════════════════════════════════════════ */
function ScreenMeditation({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <ParchCard style={{ position: "relative", gap: 12 }}>
      <BackBtn onClick={onPrev} />
      {/* Header */}
      <div style={{ textAlign: "center", paddingTop: 6 }}>
        <h2 style={{ fontFamily: "var(--font-baloo)", fontSize: 22, color: "#4A6741", margin: "0 0 3px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{ color: "#7CB87A", fontSize: 13 }}>✦</span>
          Morning Meditation
          <span style={{ color: "#7CB87A", fontSize: 13 }}>✦</span>
        </h2>
        <p style={{ fontSize: 12.5, color: "#8C6A3F", margin: 0 }}>Take one quiet minute for yourself</p>
      </div>
      {/* Image + bubbles */}
      <div style={{ borderRadius: 20, overflow: "hidden", width: "100%", aspectRatio: "4/3", position: "relative", boxShadow: "0 4px 18px rgba(0,0,0,0.14)" }}>
        <style>{`
          @keyframes med-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
          .med-bubble{position:absolute;background:rgba(255,255,255,0.88);border-radius:22px;padding:5px 12px;font-size:11.5px;font-weight:700;color:#3A5C38;backdrop-filter:blur(6px);box-shadow:0 2px 10px rgba(0,0,0,0.13);white-space:nowrap;animation:med-float 3.5s ease-in-out infinite;}
        `}</style>
        <img src="/meditation-bg.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="med-bubble" style={{ top: "11%", left: "7%", animationDelay: "0s" }}>Breathe in 🫑</div>
        <div className="med-bubble" style={{ top: "7%", left: "50%", transform: "translateX(-50%)", animationDelay: "1.1s" }}>Stay calm 🧘</div>
        <div className="med-bubble" style={{ top: "11%", right: "7%", animationDelay: "2.2s" }}>Breathe out 💨</div>
      </div>
      {/* Button */}
      <GoldBtn onClick={onNext} full>Done ✓</GoldBtn>
    </ParchCard>
  );
}
/* ═══════════════════════════════════════════════════
   SCREEN: GRATITUDE / THANK YOU JAR (2.2)
═══════════════════════════════════════════════════ */
function ScreenGratitude({ onNext, onPrev, sessionType, gratitude, setGratitude }: {
  onNext: () => void; onPrev: () => void; sessionType: SessionType;
  gratitude: string[]; setGratitude: (g: string[]) => void;
}) {
  const theme = getGratitudeTheme();
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const update = (i: number, val: string) => {
    const next = [...gratitude]; next[i] = val; setGratitude(next);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => saveGarden({ session: sessionType, gratitude: next.map(n => ({ name: n })) }), 600);
  };
  const QUOTES = [
    "Gratitude grows kindness in your heart.",
    "What we appreciate, appreciates.",
    "A grateful heart is a magnet for miracles.",
    "Gratitude turns what we have into enough.",
  ];
  const quote = QUOTES[new Date().getDay() % QUOTES.length];
  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{`
        .grat-card{background:linear-gradient(160deg,#FDF8EE 0%,#F0E4C0 100%);border:3px solid #7A4A1A;border-radius:26px;overflow:hidden;position:relative;box-shadow:0 8px 32px rgba(60,30,0,0.30),inset 0 1px 0 rgba(255,255,255,0.55);}
        .grat-inner{position:relative;z-index:1;padding:20px 20px 18px;}
        .grat-scene{width:100%;aspect-ratio:16/8;border-radius:16px;overflow:hidden;position:relative;margin-bottom:14px;box-shadow:0 3px 12px rgba(0,0,0,0.18);}
        .grat-scene-fallback{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#D4EFC4,#B8E098);gap:16px;}
        .grat-row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
        .grat-num{width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 38% 35%,#9A6030,#5C3010);color:#FFF8E7;font-family:var(--font-baloo);font-size:15px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 3px 8px rgba(0,0,0,0.28),inset 0 1px 0 rgba(255,255,255,0.15);}
        .grat-wrap{position:relative;flex:1;}
        .grat-inp{width:100%;padding:11px 36px 11px 14px;border-radius:12px;border:1.5px solid #D4B87A;background:#FEFAE8;font-size:14px;color:#2C1A0E;outline:none;font-family:var(--font-nunito);box-shadow:inset 0 1px 3px rgba(0,0,0,0.06);transition:border-color 0.2s,background 0.2s;box-sizing:border-box;}
        .grat-inp:focus{border-color:#C8860A;background:#FFFDF0;}
        .grat-leaf-ico{position:absolute;right:11px;top:50%;transform:translateY(-50%);font-size:15px;pointer-events:none;}
        .grat-quote{background:rgba(255,248,220,0.75);border:1.5px solid #D4B87A;border-radius:12px;padding:10px 14px;font-size:12.5px;color:#6B4C1E;text-align:center;font-style:italic;margin-bottom:14px;display:flex;align-items:center;gap:6px;justify-content:center;line-height:1.5;}
        .grat-btns{display:flex;gap:10px;}
        .grat-skip{flex:1;padding:13px;border:2px solid #C9A050;border-radius:99px;background:rgba(255,252,240,0.8);font-family:var(--font-baloo);font-size:15px;font-weight:700;color:#7A5820;cursor:pointer;transition:background 0.15s;}
        .grat-done{flex:2;padding:13px;border:none;border-radius:99px;background:linear-gradient(135deg,#FFD740,#F9A825);font-family:var(--font-baloo);font-size:16px;font-weight:900;color:#3D2000;cursor:pointer;box-shadow:0 4px 0 #A86200,0 6px 16px rgba(200,120,0,0.25);transition:transform 0.12s,box-shadow 0.12s;}
        .grat-done:active{transform:translateY(2px);box-shadow:0 2px 0 #A86200;}
        .grat-vine{position:absolute;top:0;width:90px;height:90px;pointer-events:none;z-index:2;}
      `}</style>
      <div className="grat-card">
        {/* Corner vine — top left */}
        <svg className="grat-vine" style={{ left: 0 }} viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 C 20 30, 10 60, 0 90" fill="none" stroke="#5A8A3A" strokeWidth="2" opacity="0.45" />
          <path d="M0 0 C 40 10, 60 5, 90 0" fill="none" stroke="#5A8A3A" strokeWidth="2" opacity="0.45" />
          <ellipse cx="14" cy="22" rx="9" ry="5" fill="#4A7A2A" opacity="0.6" transform="rotate(-30 14 22)" />
          <ellipse cx="6" cy="48" rx="8" ry="4.5" fill="#5A8A3A" opacity="0.55" transform="rotate(-55 6 48)" />
          <ellipse cx="34" cy="8" rx="8" ry="4" fill="#3A6A1A" opacity="0.55" transform="rotate(15 34 8)" />
          <ellipse cx="60" cy="4" rx="6" ry="3.5" fill="#4A7A2A" opacity="0.5" transform="rotate(5 60 4)" />
          <circle cx="22" cy="6" r="3.5" fill="#D43060" opacity="0.75" />
          <circle cx="4" cy="34" r="3" fill="#C878C8" opacity="0.65" />
          <circle cx="70" cy="3" r="2.5" fill="#E06090" opacity="0.6" />
        </svg>
        {/* Corner vine — top right (mirrored) */}
        <svg className="grat-vine" style={{ right: 0, transform: "scaleX(-1)" }} viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0 C 20 30, 10 60, 0 90" fill="none" stroke="#5A8A3A" strokeWidth="2" opacity="0.45" />
          <path d="M0 0 C 40 10, 60 5, 90 0" fill="none" stroke="#5A8A3A" strokeWidth="2" opacity="0.45" />
          <ellipse cx="14" cy="22" rx="9" ry="5" fill="#4A7A2A" opacity="0.6" transform="rotate(-30 14 22)" />
          <ellipse cx="6" cy="48" rx="8" ry="4.5" fill="#5A8A3A" opacity="0.55" transform="rotate(-55 6 48)" />
          <ellipse cx="34" cy="8" rx="8" ry="4" fill="#3A6A1A" opacity="0.55" transform="rotate(15 34 8)" />
          <ellipse cx="60" cy="4" rx="6" ry="3.5" fill="#4A7A2A" opacity="0.5" transform="rotate(5 60 4)" />
          <circle cx="22" cy="6" r="3.5" fill="#D43060" opacity="0.75" />
          <circle cx="4" cy="34" r="3" fill="#C878C8" opacity="0.65" />
          <circle cx="70" cy="3" r="2.5" fill="#E06090" opacity="0.6" />
        </svg>
        <div className="grat-inner">
          <BackBtn onClick={onPrev} />
          {/* Header */}
          <div style={{ textAlign: "center", paddingTop: 10, marginBottom: 12 }}>
            <h2 style={{ fontFamily: "var(--font-baloo)", fontSize: 28, color: "#2D5A1B", margin: "0 0 6px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>🌿</span>Thank You<span style={{ fontSize: 18 }}>🌿</span>
            </h2>
            <p style={{ fontSize: 13, color: "#6B4C1E", margin: "0 0 10px", lineHeight: 1.55 }}>
              Write the names of three people<br />you want to say thank you to today ❤️
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 16px", borderRadius: 99, background: "rgba(255,252,240,0.9)", border: "1.5px solid #C8A840", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <span style={{ fontSize: 13 }}>🌱</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#5A3A00" }}>This week: {theme}</span>
            </div>
          </div>
          {/* Scene image */}
          <div className="grat-scene">
            <div className="grat-scene-fallback">
              <ThankYouJarSVG count={gratitude.filter(g => g.trim().length > 0).length} />
              <div style={{ width: 72, height: 72 }}><PuppySVG /></div>
            </div>
            <img src="/gratitude-bg.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          </div>
          {/* Inputs */}
          {[0, 1, 2].map(i => (
            <div key={i} className="grat-row">
              <div className="grat-num">{i + 1}</div>
              <div className="grat-wrap">
                <input value={gratitude[i] ?? ""} onChange={e => update(i, e.target.value)} placeholder="Name someone..." className="grat-inp" />
                <span className="grat-leaf-ico">🍃</span>
              </div>
            </div>
          ))}
          {/* Quote */}
          <div className="grat-quote"><span>🌿</span><span>{quote}</span></div>
          {/* Buttons */}
          <div className="grat-btns">
            <button className="grat-skip" onClick={onNext}>Skip</button>
            <button className="grat-done" onClick={onNext}>Done ❤️</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SCREEN: AFFIRMATIONS / INTENTIONS (2.3)
═══════════════════════════════════════════════════ */
function ScreenAffirmations({ onNext, onPrev, sessionType, selected, setSelected }: {
  onNext: () => void; onPrev: () => void; sessionType: SessionType;
  selected: number[]; setSelected: (v: number[]) => void;
}) {
  const dayIdx = new Date().getDay();
  const dayPill = DAY_NAMES[dayIdx];
  const intentions = getDayIntentions();
  const icons = DAILY_INTENTION_ICONS[dayIdx] ?? ["🌟", "🎯", "🌱"];
  const toggle = (i: number) => {
    const next = selected.includes(i) ? selected.filter(x => x !== i) : [...selected, i];
    setSelected(next);
    saveGarden({ session: sessionType, intentions: next });
  };
  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{`
        @keyframes int-leaf-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
        .int-leaf-anim{display:inline-block;animation:int-leaf-sway 3s ease-in-out infinite;}
        .int-card{background:linear-gradient(160deg,#FDF3DC 0%,#F5E4BB 100%);border:3px solid #7B4A1E;border-radius:28px;padding:22px 18px 20px;box-shadow:0 6px 28px rgba(60,30,0,0.22),inset 0 0 40px rgba(255,220,140,0.08);position:relative;display:flex;flex-direction:column;gap:14px;}
        .int-vine-corner{position:absolute;pointer-events:none;}
        .int-day-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 20px;border-radius:99px;background:linear-gradient(135deg,#FFD740,#F9A825);border:none;font-size:14px;font-weight:800;color:#5C3A00;box-shadow:0 3px 8px rgba(200,120,0,0.25);}
        .int-list-wrap{background:rgba(255,252,240,0.65);border:1.5px solid #C9A870;border-radius:18px;padding:10px 10px;display:flex;flex-direction:column;gap:8px;}
        .int-item{display:flex;align-items:center;gap:12px;background:#FFFDF4;border:1.5px solid #E8D5A8;border-radius:14px;padding:12px 12px;cursor:pointer;transition:background 0.2s,border-color 0.2s;box-shadow:0 2px 6px rgba(120,80,0,0.07);}
        .int-item:active{transform:scale(0.98);}
        .int-item.checked{background:#F0FFF0;border-color:#81C784;}
        .int-checkbox{width:22px;height:22px;border-radius:5px;border:2.5px solid #9E8060;background:transparent;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
        .int-checkbox.checked{background:#4CAF50;border-color:#4CAF50;}
        .int-icon-circle{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#FFF8E1,#FFE082);border:1.5px solid #E0C060;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
        .int-text{flex:1;font-size:15px;color:#3D2800;line-height:1.4;font-family:var(--font-nunito);font-weight:600;}
        .int-leaf-r{font-size:16px;color:#5A8A40;flex-shrink:0;}
        .int-sign{background:linear-gradient(160deg,#8B5E3C,#6B3F1F);border-radius:12px;padding:12px 16px;border:2px solid #5A3010;box-shadow:0 4px 12px rgba(50,25,0,0.3),inset 0 1px 0 rgba(255,200,120,0.15);position:relative;margin-top:2px;}
        .int-sign::before{content:"";position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:40px;height:6px;background:#6B3F1F;border-radius:3px 3px 0 0;}
        .int-sign-text{font-size:13px;color:#FFE0A0;font-style:italic;text-align:center;line-height:1.5;font-family:var(--font-nunito);font-weight:600;}
        .int-deco-row{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:2px;}
        .int-puppy{font-size:40px;line-height:1;}
        .int-lantern{font-size:32px;line-height:1;}
      `}</style>
      {/* Wooden card */}
      <div className="int-card">
        <BackBtn onClick={onPrev} />
        {/* Vine corner top-left */}
        <svg className="int-vine-corner" style={{ top: -2, left: -2, width: 70, height: 70 }} viewBox="0 0 70 70" fill="none">
          <path d="M4 66 C4 40 10 18 30 8" stroke="#5A8A3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M4 50 C12 44 22 46 24 36" stroke="#5A8A3A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="30" cy="8" r="5" fill="#E8463C" /><circle cx="24" cy="36" r="4" fill="#E8913C" />
          <ellipse cx="9" cy="55" rx="5" ry="7" fill="#5A8A3A" transform="rotate(-30 9 55)" />
          <ellipse cx="14" cy="42" rx="4" ry="6" fill="#6FAD4A" transform="rotate(20 14 42)" />
          <ellipse cx="22" cy="30" rx="4" ry="6" fill="#5A8A3A" transform="rotate(-10 22 30)" />
        </svg>
        {/* Vine corner top-right */}
        <svg className="int-vine-corner" style={{ top: -2, right: -2, width: 70, height: 70 }} viewBox="0 0 70 70" fill="none">
          <path d="M66 66 C66 40 60 18 40 8" stroke="#5A8A3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M66 50 C58 44 48 46 46 36" stroke="#5A8A3A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="40" cy="8" r="5" fill="#E8463C" /><circle cx="46" cy="36" r="4" fill="#E8913C" />
          <ellipse cx="61" cy="55" rx="5" ry="7" fill="#5A8A3A" transform="rotate(30 61 55)" />
          <ellipse cx="56" cy="42" rx="4" ry="6" fill="#6FAD4A" transform="rotate(-20 56 42)" />
          <ellipse cx="48" cy="30" rx="4" ry="6" fill="#5A8A3A" transform="rotate(10 48 30)" />
        </svg>
        {/* Header */}
        <div style={{ textAlign: "center", paddingTop: 10 }}>
          <h2 style={{ fontFamily: "var(--font-baloo)", fontSize: 26, color: "#C0392B", margin: "0 0 4px", fontStyle: "italic", lineHeight: 1.2 }}>
            <span className="int-leaf-anim">🍃</span> Intentions for the Day <span className="int-leaf-anim" style={{ animationDelay: "1.5s" }}>🍃</span>
          </h2>
          <p style={{ fontSize: 13, color: "#8C6A3F", margin: "0 0 10px", fontFamily: "var(--font-nunito)" }}>Set your focus. Grow your day. 🧡</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="int-day-pill"><span>🌸</span>{dayPill}</div>
          </div>
        </div>
        {/* Intentions list */}
        <div className="int-list-wrap">
          {intentions.map((text, i) => {
            const active = selected.includes(i);
            return (
              <div key={i} className={`int-item${active ? " checked" : ""}`} onClick={() => toggle(i)}>
                <div className={`int-checkbox${active ? " checked" : ""}`}>
                  {active && <span style={{ color: "white", fontSize: 14, lineHeight: 1 }}>✓</span>}
                </div>
                <div className="int-icon-circle">{icons[i]}</div>
                <span className="int-text">{text}</span>
                <span className="int-leaf-r">🌿</span>
              </div>
            );
          })}
        </div>
        {/* Scene image with Done button overlaid */}
        <div style={{ position: "relative", width: "100%", borderRadius: 16, overflow: "hidden", aspectRatio: "16/9", marginTop: 2 }}>
          {/* Fallback scene */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#A8D5A2 0%,#6BAE6B 40%,#8B6914 100%)", display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 16px 8px" }}>
            <div style={{ fontSize: 48 }}>🐕</div>
            <div style={{ background: "linear-gradient(160deg,#8B5E3C,#6B3F1F)", borderRadius: 10, padding: "8px 12px", border: "2px solid #5A3010", maxWidth: 140 }}>
              <p style={{ fontSize: 11, color: "#FFE0A0", fontStyle: "italic", textAlign: "center", lineHeight: 1.4, margin: 0, fontFamily: "var(--font-nunito)", fontWeight: 600 }}>Little steps today, big changes tomorrow. ❤️</p>
            </div>
            <div style={{ fontSize: 36 }}>🏮</div>
          </div>
          {/* Real image on top */}
          <img src="/intentions-bg.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%", zIndex: 1 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
          {/* Done button — small, sits in upper sandy strip, dog fully visible below */}
          <div style={{ position: "absolute", top: "18%", left: "50%", transform: "translate(-50%, 0)", width: "44%", zIndex: 2 }}>
            <GoldBtn onClick={onNext} full small>Done ✓</GoldBtn>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════
   SCREEN: DAILY GOALS (2.4) — full-screen layout
═══════════════════════════════════════════════════ */
function ScreenGoals({ onNext, onPrev, sessionType, goals, setGoals }: {
  onNext: () => void; onPrev: () => void; sessionType: SessionType;
  goals: Goals; setGoals: (g: Goals) => void;
}) {
  const debounce = useRef<NodeJS.Timeout | null>(null);
  const update = (cat: keyof Goals, idx: number, field: "text" | "checked", val: string | boolean) => {
    const next: Goals = { ...goals, [cat]: goals[cat].map((g, i) => i === idx ? { ...g, [field]: val } : g) };
    setGoals(next);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => saveGarden({ session: sessionType, goals: next }), 600);
  };
  const FLOWERS: Record<string, React.ReactNode> = {
    personal: <svg viewBox="0 0 34 34" width="32" height="32"><circle cx="17" cy="17" r="5" fill="#F9C74F" /><circle cx="17" cy="6" r="5" fill="#F4A5B8" /><circle cx="17" cy="28" r="5" fill="#F4A5B8" /><circle cx="6" cy="17" r="5" fill="#F4A5B8" /><circle cx="28" cy="17" r="5" fill="#F4A5B8" /><circle cx="9.5" cy="9.5" r="4" fill="#F48FB1" /><circle cx="24.5" cy="9.5" r="4" fill="#F48FB1" /><circle cx="9.5" cy="24.5" r="4" fill="#F48FB1" /><circle cx="24.5" cy="24.5" r="4" fill="#F48FB1" /></svg>,
    social: <svg viewBox="0 0 34 34" width="32" height="32"><path d="M17 30 C10 23 3 17 6 9 C8 3 14 3 17 9 C20 3 26 3 28 9 C31 17 24 23 17 30Z" fill="#4CAF50" /><path d="M17 30 C17 17 11 10 7 8" stroke="#2E7D32" strokeWidth="1.2" fill="none" /><circle cx="7" cy="8" r="3" fill="#E8463C" /><circle cx="25" cy="11" r="3" fill="#F9C74F" /></svg>,
    wellness: <svg viewBox="0 0 34 34" width="32" height="32"><circle cx="17" cy="17" r="5" fill="#F9A825" /><circle cx="17" cy="5" r="5" fill="#FFE082" /><circle cx="17" cy="29" r="5" fill="#FFE082" /><circle cx="5" cy="17" r="5" fill="#FFE082" /><circle cx="29" cy="17" r="5" fill="#FFE082" /><circle cx="9.5" cy="9.5" r="4" fill="#FFC107" /><circle cx="24.5" cy="9.5" r="4" fill="#FFC107" /><circle cx="9.5" cy="24.5" r="4" fill="#FFC107" /><circle cx="24.5" cy="24.5" r="4" fill="#FFC107" /></svg>,
    work: <svg viewBox="0 0 34 34" width="32" height="32"><circle cx="17" cy="17" r="5" fill="#F9C74F" /><circle cx="17" cy="6" r="5" fill="#CE93D8" /><circle cx="17" cy="28" r="5" fill="#CE93D8" /><circle cx="6" cy="17" r="5" fill="#CE93D8" /><circle cx="28" cy="17" r="5" fill="#CE93D8" /><circle cx="9.5" cy="9.5" r="4" fill="#BA68C8" /><circle cx="24.5" cy="9.5" r="4" fill="#BA68C8" /><circle cx="9.5" cy="24.5" r="4" fill="#BA68C8" /><circle cx="24.5" cy="24.5" r="4" fill="#BA68C8" /></svg>,
    study: <svg viewBox="0 0 34 34" width="32" height="32"><path d="M17 3 C17 3 9 9 9 19 C9 23 13 27 17 27 C21 27 25 23 25 19 C25 9 17 3 17 3Z" fill="#5A8A3A" /><path d="M17 3 L17 27" stroke="#2E7D32" strokeWidth="1.2" /><path d="M9 16 C13 14 21 17 25 15" stroke="#2E7D32" strokeWidth="1" fill="none" /></svg>,
    hobbies: <svg viewBox="0 0 34 34" width="32" height="32"><circle cx="17" cy="17" r="5" fill="#FF8F00" /><circle cx="17" cy="6" r="5" fill="#FFAB40" /><circle cx="17" cy="28" r="5" fill="#FFAB40" /><circle cx="6" cy="17" r="5" fill="#FFAB40" /><circle cx="28" cy="17" r="5" fill="#FFAB40" /><circle cx="9.5" cy="9.5" r="4" fill="#FF6D00" /><circle cx="24.5" cy="9.5" r="4" fill="#FF6D00" /><circle cx="9.5" cy="24.5" r="4" fill="#FF6D00" /><circle cx="24.5" cy="24.5" r="4" fill="#FF6D00" /></svg>,
  };
  const DoneFlower = () => (
    <svg viewBox="0 0 28 28" width="24" height="24" style={{ flexShrink: 0 }}>
      <circle cx="14" cy="14" r="4" fill="#F9C74F" />
      <circle cx="14" cy="4" r="4" fill="#F48FB1" /><circle cx="14" cy="24" r="4" fill="#F48FB1" />
      <circle cx="4" cy="14" r="4" fill="#F48FB1" /><circle cx="24" cy="14" r="4" fill="#F48FB1" />
      <circle cx="7" cy="7" r="3" fill="#F06292" /><circle cx="21" cy="7" r="3" fill="#F06292" />
      <circle cx="7" cy="21" r="3" fill="#F06292" /><circle cx="21" cy="21" r="3" fill="#F06292" />
    </svg>
  );
  return (
    <div style={{ width: "100%", maxWidth: 700, margin: "0 auto", padding: "0 6px 16px" }}>
      <style>{`
        /* ── OUTER DARK WOODEN FRAME ── */
        .dg-frame{
          background: linear-gradient(160deg,#FDF3DC 0%,#F5E4BB 100%);
          border: 3px solid #7B4A1E;
          border-radius: 28px;
          padding: 0 12px 14px;
          position: relative;
          box-shadow: 0 6px 28px rgba(60,30,0,0.22), inset 0 0 40px rgba(255,220,140,0.08);
          overflow: visible;
        }

        /* ── HANGING SIGN SECTION ── */
        .dg-sign-section{display:flex;flex-direction:column;align-items:center;padding-top:14px;margin-bottom:12px;}
        .dg-chains-row{display:flex;justify-content:space-around;width:48%;}
        .dg-sign{
          width:100%;
          background:linear-gradient(160deg,#FDF8EE,#EDD9A3);
          border:3px solid #7B4A1E;
          border-radius:12px;
          padding:12px 42px 10px;
          text-align:center;
          position:relative;
          box-shadow:0 6px 20px rgba(0,0,0,0.45),inset 0 1px 0 rgba(255,240,180,0.6);
        }
        .dg-sign h2{font-family:var(--font-baloo);font-size:clamp(20px,4.5vw,28px);color:#3D1A00;margin:0 0 3px;font-weight:900;}
        .dg-sign p{font-size:clamp(11px,2.5vw,13px);color:#6B4010;margin:0;font-family:var(--font-nunito);}
        .dg-sign-leaf{position:absolute;top:50%;transform:translateY(-50%);font-size:16px;}
        /* ── GOAL GRID ── */
        .dg-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;}
        @media(max-width:560px){.dg-grid{grid-template-columns:repeat(2,1fr);gap:8px;}}
        /* ── GOAL CARD ── */
        .dg-gc{background:linear-gradient(160deg,#FEFAF0,#F8EDD0);border:2.5px solid #7B4A1E;border-radius:14px;position:relative;overflow:visible;box-shadow:0 3px 12px rgba(0,0,0,0.3);}
        .dg-pin{position:absolute;top:-11px;left:50%;transform:translateX(-50%);width:22px;height:22px;border-radius:50%;box-shadow:0 3px 8px rgba(0,0,0,0.35),inset 0 -3px 4px rgba(0,0,0,0.2),inset 0 2px 5px rgba(255,255,255,0.35);z-index:2;}
        .dg-gc-head{border-radius:11px 11px 0 0;padding:10px 8px 8px;text-align:center;font-family:var(--font-baloo);font-size:clamp(11px,2.2vw,13px);font-weight:800;letter-spacing:0.2px;}
        .dg-gc-body{padding:8px 10px 30px;}
        .dg-gi{border-bottom:1.5px dashed #C9A870;padding:6px 0;display:flex;align-items:center;gap:7px;}
        .dg-gi:last-child{border-bottom:none;}
        .dg-chk{width:15px;height:15px;border-radius:3px;border:2px solid #9E8060;background:transparent;flex-shrink:0;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;}
        .dg-inp{flex:1;min-width:0;border:none;background:transparent;font-size:clamp(10px,2.2vw,12px);color:#2C1A0E;outline:none;padding:0;font-family:var(--font-nunito);}
        .dg-inp::placeholder{color:#B8A080;}
        .dg-deco{position:absolute;bottom:3px;right:3px;opacity:0.9;}
        /* ── DONE ROW ── */
        .dg-done-row{display:flex;align-items:center;gap:8px;padding:0 2px;}
        /* ── VINE OVERLAY ── */
        .dg-vine{position:absolute;pointer-events:none;z-index:8;}
      `}</style>

      <div className="dg-frame">
        {/* Back button — on top-left corner of the outer frame */}
        <BackBtn onClick={onPrev} />

        {/* Vines climbing left side and top */}
        <svg className="dg-vine" style={{ top: -10, left: -10, width: 90, height: 120 }} viewBox="0 0 90 120" fill="none">
          <path d="M6 118 C6 85 14 52 36 18 C50 2 68 -2 80 4" stroke="#4A7A30" strokeWidth="3" strokeLinecap="round" />
          <path d="M6 90 C18 80 32 84 36 68" stroke="#4A7A30" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M6 60 C16 52 28 56 30 44" stroke="#4A7A30" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 30 C24 22 36 26 38 16" stroke="#4A7A30" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="10" cy="100" rx="7" ry="10" fill="#5A8A3A" transform="rotate(-30 10 100)" />
          <ellipse cx="18" cy="80" rx="6" ry="9" fill="#6FAD4A" transform="rotate(25 18 80)" />
          <ellipse cx="26" cy="60" rx="6" ry="8" fill="#5A8A3A" transform="rotate(-15 26 60)" />
          <ellipse cx="32" cy="40" rx="5" ry="7" fill="#6FAD4A" transform="rotate(10 32 40)" />
          <ellipse cx="42" cy="22" rx="5" ry="7" fill="#5A8A3A" transform="rotate(-20 42 22)" />
          <circle cx="36" cy="68" r="5" fill="#F48FB1" />
          <circle cx="30" cy="44" r="5" fill="#F48FB1" />
          <circle cx="80" cy="4" r="6" fill="#E8463C" />
          <circle cx="36" cy="18" r="4" fill="#F9C74F" />
        </svg>
        <svg className="dg-vine" style={{ top: -10, right: -10, width: 90, height: 90 }} viewBox="0 0 90 90" fill="none">
          <path d="M84 88 C84 65 76 42 54 18 C42 4 28 -2 14 4" stroke="#4A7A30" strokeWidth="3" strokeLinecap="round" />
          <path d="M84 65 C72 56 60 60 56 46" stroke="#4A7A30" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M70 30 C62 22 52 26 48 16" stroke="#4A7A30" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="78" cy="74" rx="7" ry="10" fill="#5A8A3A" transform="rotate(30 78 74)" />
          <ellipse cx="66" cy="55" rx="6" ry="9" fill="#6FAD4A" transform="rotate(-25 66 55)" />
          <ellipse cx="54" cy="38" rx="5" ry="7" fill="#5A8A3A" transform="rotate(15 54 38)" />
          <ellipse cx="44" cy="22" rx="5" ry="7" fill="#6FAD4A" transform="rotate(-10 44 22)" />
          <circle cx="56" cy="46" r="5" fill="#F48FB1" />
          <circle cx="14" cy="4" r="6" fill="#E8913C" />
          <circle cx="54" cy="18" r="4" fill="#F9C74F" />
        </svg>

        {/* Hanging sign with chain links from top bar */}
        <div className="dg-sign-section">
          <div className="dg-chains-row">
            {[0, 1].map(k => (
              <svg key={k} width="14" height="30" viewBox="0 0 14 30">
                <ellipse cx="7" cy="4" rx="5" ry="3.5" fill="none" stroke="#8B5030" strokeWidth="2.5" />
                <ellipse cx="7" cy="12" rx="5" ry="3.5" fill="none" stroke="#8B5030" strokeWidth="2.5" />
                <ellipse cx="7" cy="20" rx="5" ry="3.5" fill="none" stroke="#8B5030" strokeWidth="2.5" />
                <ellipse cx="7" cy="28" rx="5" ry="3.5" fill="none" stroke="#8B5030" strokeWidth="2.5" />
              </svg>
            ))}
          </div>
          <div className="dg-sign">
            <span className="dg-sign-leaf" style={{ left: 10 }}>🍃</span>
            <h2>Daily Goals</h2>
            <p>What would you like to accomplish today?</p>
            <span className="dg-sign-leaf" style={{ right: 10 }}>🍃</span>
          </div>
        </div>

        {/* Goal cards */}
        <div className="dg-grid">
          {GOAL_CATS.map(cat => (
            <div key={cat.key} className="dg-gc">
              <div className="dg-pin" style={{ background: `radial-gradient(circle at 35% 30%,${cat.pin}CC,${cat.pin})` }} />
              <div className="dg-gc-head" style={{ background: cat.header, color: cat.pin }}>{cat.label}</div>
              <div className="dg-gc-body">
                {goals[cat.key].map((g, i) => (
                  <div key={i} className="dg-gi">
                    <input type="text" value={g.text} onChange={e => update(cat.key, i, "text", e.target.value)}
                      placeholder={`Goal ${i + 1}`} className="dg-inp" />
                  </div>
                ))}
              </div>
              <div className="dg-deco">{FLOWERS[cat.key]}</div>
            </div>
          ))}
        </div>

        {/* Done button with flower icons */}
        <div className="dg-done-row">
          <DoneFlower />
          <div style={{ flex: 1 }}><GoldBtn onClick={onNext} full>Done ✓</GoldBtn></div>
          <DoneFlower />
        </div>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════
   SCREEN: TAKE WHAT YOU NEED (2.5)
═══════════════════════════════════════════════════ */
function ScreenCups({ onNext, onPrev, sessionType, cups, setCups }: {
  onNext: () => void; onPrev: () => void; sessionType: SessionType;
  cups: number[]; setCups: (c: number[]) => void;
}) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set(cups));
  const tap = (i: number) => {
    const next = new Set(revealed);
    next.has(i) ? next.delete(i) : next.add(i);
    setRevealed(next);
    const arr = Array.from(next);
    setCups(arr);
    saveGarden({ session: sessionType, cups: arr });
  };
  const CUP_FLOWERS = [
    <svg key="0" viewBox="0 0 28 28" width="26" height="26"><circle cx="14" cy="14" r="4" fill="#F9C74F" /><circle cx="14" cy="4" r="4" fill="#F48FB1" /><circle cx="14" cy="24" r="4" fill="#F48FB1" /><circle cx="4" cy="14" r="4" fill="#F48FB1" /><circle cx="24" cy="14" r="4" fill="#F48FB1" /><circle cx="7" cy="7" r="3" fill="#F06292" /><circle cx="21" cy="7" r="3" fill="#F06292" /><circle cx="7" cy="21" r="3" fill="#F06292" /><circle cx="21" cy="21" r="3" fill="#F06292" /></svg>,
    <svg key="1" viewBox="0 0 28 28" width="26" height="26"><circle cx="14" cy="14" r="4" fill="#F9A825" /><circle cx="14" cy="4" r="4" fill="#FFE082" /><circle cx="14" cy="24" r="4" fill="#FFE082" /><circle cx="4" cy="14" r="4" fill="#FFE082" /><circle cx="24" cy="14" r="4" fill="#FFE082" /><circle cx="7" cy="7" r="3" fill="#FFC107" /><circle cx="21" cy="7" r="3" fill="#FFC107" /><circle cx="7" cy="21" r="3" fill="#FFC107" /><circle cx="21" cy="21" r="3" fill="#FFC107" /></svg>,
    <svg key="2" viewBox="0 0 28 28" width="26" height="26"><circle cx="14" cy="14" r="4" fill="#FF8F00" /><circle cx="14" cy="4" r="4" fill="#FFAB40" /><circle cx="14" cy="24" r="4" fill="#FFAB40" /><circle cx="4" cy="14" r="4" fill="#FFAB40" /><circle cx="24" cy="14" r="4" fill="#FFAB40" /><circle cx="7" cy="7" r="3" fill="#FF6D00" /><circle cx="21" cy="7" r="3" fill="#FF6D00" /><circle cx="7" cy="21" r="3" fill="#FF6D00" /><circle cx="21" cy="21" r="3" fill="#FF6D00" /></svg>,
    <svg key="3" viewBox="0 0 28 28" width="26" height="26"><circle cx="14" cy="14" r="4" fill="#F9C74F" /><circle cx="14" cy="4" r="4" fill="#80CBC4" /><circle cx="14" cy="24" r="4" fill="#80CBC4" /><circle cx="4" cy="14" r="4" fill="#80CBC4" /><circle cx="24" cy="14" r="4" fill="#80CBC4" /><circle cx="7" cy="7" r="3" fill="#4DB6AC" /><circle cx="21" cy="7" r="3" fill="#4DB6AC" /><circle cx="7" cy="21" r="3" fill="#4DB6AC" /><circle cx="21" cy="21" r="3" fill="#4DB6AC" /></svg>,
    <svg key="4" viewBox="0 0 28 28" width="26" height="26"><circle cx="14" cy="14" r="4" fill="#F9C74F" /><circle cx="14" cy="4" r="4" fill="#90CAF9" /><circle cx="14" cy="24" r="4" fill="#90CAF9" /><circle cx="4" cy="14" r="4" fill="#90CAF9" /><circle cx="24" cy="14" r="4" fill="#90CAF9" /><circle cx="7" cy="7" r="3" fill="#64B5F6" /><circle cx="21" cy="7" r="3" fill="#64B5F6" /><circle cx="7" cy="21" r="3" fill="#64B5F6" /><circle cx="21" cy="21" r="3" fill="#64B5F6" /></svg>,
    <svg key="5" viewBox="0 0 28 28" width="26" height="26"><circle cx="14" cy="14" r="4" fill="#F9C74F" /><circle cx="14" cy="4" r="4" fill="#A5D6A7" /><circle cx="14" cy="24" r="4" fill="#A5D6A7" /><circle cx="4" cy="14" r="4" fill="#A5D6A7" /><circle cx="24" cy="14" r="4" fill="#A5D6A7" /><circle cx="7" cy="7" r="3" fill="#66BB6A" /><circle cx="21" cy="7" r="3" fill="#66BB6A" /><circle cx="7" cy="21" r="3" fill="#66BB6A" /><circle cx="21" cy="21" r="3" fill="#66BB6A" /></svg>,
  ];
  const DoneFlower = () => (
    <svg viewBox="0 0 28 28" width="24" height="24" style={{ flexShrink: 0 }}>
      <circle cx="14" cy="14" r="4" fill="#F9C74F" />
      <circle cx="14" cy="4" r="4" fill="#F48FB1" /><circle cx="14" cy="24" r="4" fill="#F48FB1" />
      <circle cx="4" cy="14" r="4" fill="#F48FB1" /><circle cx="24" cy="14" r="4" fill="#F48FB1" />
      <circle cx="7" cy="7" r="3" fill="#F06292" /><circle cx="21" cy="7" r="3" fill="#F06292" />
      <circle cx="7" cy="21" r="3" fill="#F06292" /><circle cx="21" cy="21" r="3" fill="#F06292" />
    </svg>
  );
  return (
    <div style={{ width: "100%", maxWidth: 700, margin: "0 auto", padding: "0 6px 16px" }}>
      <style>{`
        @keyframes cup-reveal{0%{opacity:0;transform:scale(0.85)}100%{opacity:1;transform:scale(1)}}
        .cup-frame{background:linear-gradient(160deg,#FDF3DC 0%,#F5E4BB 100%);border:3px solid #7B4A1E;border-radius:28px;padding:0 12px 14px;position:relative;box-shadow:0 6px 28px rgba(60,30,0,0.22),inset 0 0 40px rgba(255,220,140,0.08);overflow:visible;}
        .cup-vine{position:absolute;pointer-events:none;z-index:8;}
        .cup-sign-section{display:flex;flex-direction:column;align-items:center;padding-top:14px;margin-bottom:12px;}
        .cup-chains-row{display:flex;justify-content:space-around;width:48%;}
        .cup-sign{width:100%;background:linear-gradient(160deg,#FDF8EE,#EDD9A3);border:3px solid #7B4A1E;border-radius:12px;padding:12px 42px 10px;text-align:center;position:relative;box-shadow:0 6px 20px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,240,180,0.6);}
        .cup-sign h2{font-family:var(--font-baloo);font-size:clamp(20px,4.5vw,28px);color:#3D1A00;margin:0 0 3px;font-weight:900;}
        .cup-sign p{font-size:clamp(11px,2.5vw,13px);color:#6B4010;margin:0;font-family:var(--font-nunito);}
        .cup-sign-leaf{position:absolute;top:50%;transform:translateY(-50%);font-size:16px;}
        .cup-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px;}
        @media(max-width:560px){.cup-grid{grid-template-columns:repeat(2,1fr);gap:8px;}}
        .cup-card{background:linear-gradient(160deg,#FEFAF0,#F5E8CC);border:2.5px solid #7B4A1E;border-radius:16px;padding:14px 10px 28px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;position:relative;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 3px 10px rgba(0,0,0,0.15);}
        .cup-card:active{transform:scale(0.96);}
        .cup-card.open{box-shadow:0 4px 16px rgba(0,0,0,0.2);}
        .cup-label{font-family:var(--font-baloo);font-size:clamp(13px,3vw,16px);font-weight:800;margin:0;}
        .cup-msg{font-size:clamp(9px,2vw,11px);color:#3D2800;text-align:center;line-height:1.5;margin:0;font-family:var(--font-nunito);animation:cup-reveal 0.3s ease-out;}
        .cup-deco{position:absolute;bottom:3px;right:3px;opacity:0.85;}
        .cup-done-row{display:flex;align-items:center;gap:8px;padding:0 2px;}
      `}</style>
      <div className="cup-frame">
        <BackBtn onClick={onPrev} />
        {/* Vines */}
        <svg className="cup-vine" style={{ top: -10, left: -10, width: 90, height: 120 }} viewBox="0 0 90 120" fill="none">
          <path d="M6 118 C6 85 14 52 36 18 C50 2 68 -2 80 4" stroke="#4A7A30" strokeWidth="3" strokeLinecap="round" />
          <path d="M6 90 C18 80 32 84 36 68" stroke="#4A7A30" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M6 60 C16 52 28 56 30 44" stroke="#4A7A30" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 30 C24 22 36 26 38 16" stroke="#4A7A30" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="10" cy="100" rx="7" ry="10" fill="#5A8A3A" transform="rotate(-30 10 100)" />
          <ellipse cx="18" cy="80" rx="6" ry="9" fill="#6FAD4A" transform="rotate(25 18 80)" />
          <ellipse cx="26" cy="60" rx="6" ry="8" fill="#5A8A3A" transform="rotate(-15 26 60)" />
          <ellipse cx="32" cy="40" rx="5" ry="7" fill="#6FAD4A" transform="rotate(10 32 40)" />
          <ellipse cx="42" cy="22" rx="5" ry="7" fill="#5A8A3A" transform="rotate(-20 42 22)" />
          <circle cx="36" cy="68" r="5" fill="#F48FB1" /><circle cx="30" cy="44" r="5" fill="#F48FB1" />
          <circle cx="80" cy="4" r="6" fill="#E8463C" /><circle cx="36" cy="18" r="4" fill="#F9C74F" />
        </svg>
        <svg className="cup-vine" style={{ top: -10, right: -10, width: 90, height: 90 }} viewBox="0 0 90 90" fill="none">
          <path d="M84 88 C84 65 76 42 54 18 C42 4 28 -2 14 4" stroke="#4A7A30" strokeWidth="3" strokeLinecap="round" />
          <path d="M84 65 C72 56 60 60 56 46" stroke="#4A7A30" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M70 30 C62 22 52 26 48 16" stroke="#4A7A30" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="78" cy="74" rx="7" ry="10" fill="#5A8A3A" transform="rotate(30 78 74)" />
          <ellipse cx="66" cy="55" rx="6" ry="9" fill="#6FAD4A" transform="rotate(-25 66 55)" />
          <ellipse cx="54" cy="38" rx="5" ry="7" fill="#5A8A3A" transform="rotate(15 54 38)" />
          <ellipse cx="44" cy="22" rx="5" ry="7" fill="#6FAD4A" transform="rotate(-10 44 22)" />
          <circle cx="56" cy="46" r="5" fill="#F48FB1" />
          <circle cx="14" cy="4" r="6" fill="#E8913C" /><circle cx="54" cy="18" r="4" fill="#F9C74F" />
        </svg>
        {/* Hanging sign */}
        <div className="cup-sign-section">
          <div className="cup-chains-row">
            {[0, 1].map(k => (
              <svg key={k} width="14" height="30" viewBox="0 0 14 30">
                <ellipse cx="7" cy="4" rx="5" ry="3.5" fill="none" stroke="#8B5030" strokeWidth="2.5" />
                <ellipse cx="7" cy="12" rx="5" ry="3.5" fill="none" stroke="#8B5030" strokeWidth="2.5" />
                <ellipse cx="7" cy="20" rx="5" ry="3.5" fill="none" stroke="#8B5030" strokeWidth="2.5" />
                <ellipse cx="7" cy="28" rx="5" ry="3.5" fill="none" stroke="#8B5030" strokeWidth="2.5" />
              </svg>
            ))}
          </div>
          <div className="cup-sign">
            <span className="cup-sign-leaf" style={{ left: 10 }}>🍃</span>
            <h2>Take What You Need</h2>
            <p>Tap a cup to reveal your message for today</p>
            <span className="cup-sign-leaf" style={{ right: 10 }}>🍃</span>
          </div>
        </div>
        {/* Cup grid */}
        <div className="cup-grid">
          {CUP_DATA.map((cup, i) => {
            const open = revealed.has(i);
            return (
              <div key={i} className={`cup-card${open ? " open" : ""}`} onClick={() => tap(i)}
                style={{ borderColor: open ? cup.color : "#7B4A1E", background: open ? `linear-gradient(160deg,#FEFAF0,${cup.color}18)` : "linear-gradient(160deg,#FEFAF0,#F5E8CC)" }}>
                <CupSVG color={cup.color} />
                <span className="cup-label" style={{ color: cup.color }}>{cup.label}</span>
                {open && <p className="cup-msg">{cup.message}</p>}
                <div className="cup-deco">{CUP_FLOWERS[i]}</div>
              </div>
            );
          })}
        </div>
        {/* Done */}
        <div className="cup-done-row">
          <DoneFlower />
          <div style={{ flex: 1 }}><GoldBtn onClick={onNext} full>Done ✓</GoldBtn></div>
          <DoneFlower />
        </div>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════
   SCREEN: COMPLETION (2.6) — full-screen, no card
═══════════════════════════════════════════════════ */
function ScreenComplete({ onBack, dogName, coinsEarned, isNight }: {
  onBack: () => void; dogName: string; coinsEarned: boolean; isNight: boolean;
}) {
  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", padding: "0 8px 16px" }}>
      <style>{`
        @keyframes comp-fade{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
        .comp-outer{background:linear-gradient(160deg,#FDF3DC 0%,#F5E4BB 100%);border:3px solid #7B4A1E;border-radius:28px;padding:20px 16px 18px;position:relative;box-shadow:0 6px 28px rgba(60,30,0,0.22),inset 0 0 40px rgba(255,220,140,0.08);display:flex;flex-direction:column;gap:12px;align-items:center;animation:comp-fade 0.5s ease-out;}
        .comp-vine{position:absolute;pointer-events:none;}
        .comp-title{font-family:var(--font-baloo);font-size:clamp(22px,5vw,28px);color:#3D1A00;margin:0;font-weight:900;text-align:center;padding-top:6px;}
        .comp-sign-wrap{display:flex;flex-direction:column;align-items:center;width:100%;}
        .comp-chains-row{display:flex;justify-content:space-around;width:48%;}
        .comp-sign{width:100%;background:linear-gradient(160deg,#FDF8EE,#EDD9A3);border:3px solid #7B4A1E;border-radius:12px;padding:10px 30px 8px;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,240,180,0.6);}
        .comp-sign h2{font-family:var(--font-baloo);font-size:clamp(18px,4.5vw,24px);color:#3D1A00;margin:0;font-weight:900;}
        .comp-sign-leaf{font-size:14px;margin:0 5px;}
        .comp-sub{font-family:var(--font-nunito);font-size:14px;color:#6B4010;margin:0;font-weight:600;text-align:center;}
        .comp-seeds{display:flex;align-items:center;gap:8px;padding:8px 20px;border-radius:99px;background:linear-gradient(135deg,#FFF8DC,#FFE8A0);border:1.5px solid #C9A870;box-shadow:0 3px 10px rgba(200,120,0,0.2);}
        .comp-seeds span{font-size:15px;font-weight:800;color:#5C3A00;font-family:var(--font-baloo);}
        .comp-scene{width:100%;border-radius:16px;overflow:hidden;position:relative;aspect-ratio:4/3;box-shadow:0 4px 16px rgba(0,0,0,0.2);}
        .comp-scene-fallback{position:absolute;inset:0;background:linear-gradient(180deg,#5A9A3A 0%,#4A8A2A 40%,#8B7A3A 80%,#5A3A10 100%);display:flex;align-items:center;justify-content:center;gap:16px;}
        .comp-done-row{display:flex;align-items:center;gap:8px;width:100%;}
        .comp-df{font-size:20px;flex-shrink:0;}
      `}</style>
      <div className="comp-outer">
        {/* Vine corners — same as all other screens */}
        <svg className="comp-vine" style={{ top: -2, left: -2, width: 70, height: 70 }} viewBox="0 0 70 70" fill="none">
          <path d="M4 66 C4 40 10 18 30 8" stroke="#5A8A3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M4 50 C12 44 22 46 24 36" stroke="#5A8A3A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="30" cy="8" r="5" fill="#E8463C" /><circle cx="24" cy="36" r="4" fill="#E8913C" />
          <ellipse cx="9" cy="55" rx="5" ry="7" fill="#5A8A3A" transform="rotate(-30 9 55)" />
          <ellipse cx="14" cy="42" rx="4" ry="6" fill="#6FAD4A" transform="rotate(20 14 42)" />
          <ellipse cx="22" cy="30" rx="4" ry="6" fill="#5A8A3A" transform="rotate(-10 22 30)" />
        </svg>
        <svg className="comp-vine" style={{ top: -2, right: -2, width: 70, height: 70 }} viewBox="0 0 70 70" fill="none">
          <path d="M66 66 C66 40 60 18 40 8" stroke="#5A8A3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M66 50 C58 44 48 46 46 36" stroke="#5A8A3A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <circle cx="40" cy="8" r="5" fill="#E8463C" /><circle cx="46" cy="36" r="4" fill="#F9C74F" />
          <ellipse cx="61" cy="55" rx="5" ry="7" fill="#5A8A3A" transform="rotate(30 61 55)" />
          <ellipse cx="56" cy="42" rx="4" ry="6" fill="#6FAD4A" transform="rotate(-20 56 42)" />
          <ellipse cx="48" cy="30" rx="4" ry="6" fill="#5A8A3A" transform="rotate(10 48 30)" />
        </svg>
        <BackBtn onClick={onBack} />
        {/* Title */}
        <h1 className="comp-title">You showed up today 🌱</h1>
        {/* Hanging sign */}
        <div className="comp-sign-wrap">
          <div className="comp-chains-row">
            {[0, 1].map(k => (
              <svg key={k} width="12" height="26" viewBox="0 0 12 26">
                <ellipse cx="6" cy="4" rx="4" ry="3" fill="none" stroke="#8B5030" strokeWidth="2.2" />
                <ellipse cx="6" cy="11" rx="4" ry="3" fill="none" stroke="#8B5030" strokeWidth="2.2" />
                <ellipse cx="6" cy="18" rx="4" ry="3" fill="none" stroke="#8B5030" strokeWidth="2.2" />
                <ellipse cx="6" cy="25" rx="4" ry="3" fill="none" stroke="#8B5030" strokeWidth="2.2" />
              </svg>
            ))}
          </div>
          <div className="comp-sign">
            <h2><span className="comp-sign-leaf">🍃</span>The Community Garden<span className="comp-sign-leaf">🍃</span></h2>
          </div>
        </div>
        <p className="comp-sub">Small steps matter. Keep going.</p>
        {coinsEarned && (
          <div className="comp-seeds">
            <span>+20 points added</span>
          </div>
        )}
        {/* Scene image */}
        <div className="comp-scene">
          <div className="comp-scene-fallback">
            <div style={{ width: 90, height: 90 }}><PuppySVG /></div>
            <SeedJarSVG />
          </div>
          <img src="/completion-bg.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        {/* Done button */}
        <div className="comp-done-row">
          <span className="comp-df">🌸</span>
          <div style={{ flex: 1 }}><GoldBtn onClick={onBack} full>Back to your Island 🌴</GoldBtn></div>
          <span className="comp-df">🌸</span>
        </div>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════
   NIGHT SCREENS
═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   NIGHT SCREENS
═══════════════════════════════════════════════════ */
/* shared vine corners helper for night screens */
function NightVines() {
  return (<>
    <svg style={{ position: "absolute", top: -2, left: -2, width: 70, height: 70, pointerEvents: "none" }} viewBox="0 0 70 70" fill="none">
      <path d="M4 66 C4 40 10 18 30 8" stroke="#5A8A3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M4 50 C12 44 22 46 24 36" stroke="#5A8A3A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="30" cy="8" r="5" fill="#E8463C" /><circle cx="24" cy="36" r="4" fill="#E8913C" />
      <ellipse cx="9" cy="55" rx="5" ry="7" fill="#5A8A3A" transform="rotate(-30 9 55)" />
      <ellipse cx="14" cy="42" rx="4" ry="6" fill="#6FAD4A" transform="rotate(20 14 42)" />
      <ellipse cx="22" cy="30" rx="4" ry="6" fill="#5A8A3A" transform="rotate(-10 22 30)" />
    </svg>
    <svg style={{ position: "absolute", top: -2, right: -2, width: 70, height: 70, pointerEvents: "none" }} viewBox="0 0 70 70" fill="none">
      <path d="M66 66 C66 40 60 18 40 8" stroke="#5A8A3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M66 50 C58 44 48 46 46 36" stroke="#5A8A3A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <circle cx="40" cy="8" r="5" fill="#E8463C" /><circle cx="46" cy="36" r="4" fill="#E8913C" />
      <ellipse cx="61" cy="55" rx="5" ry="7" fill="#5A8A3A" transform="rotate(30 61 55)" />
      <ellipse cx="56" cy="42" rx="4" ry="6" fill="#6FAD4A" transform="rotate(-20 56 42)" />
      <ellipse cx="48" cy="30" rx="4" ry="6" fill="#5A8A3A" transform="rotate(10 48 30)" />
    </svg>
  </>);
}
function NightCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ width: "100%", maxWidth: 700, margin: "0 auto", padding: "0 6px 16px" }}>
      <div style={{ background: "linear-gradient(160deg,#2E1A08 0%,#1A0D04 100%)", border: "2px solid #C9A050", borderRadius: 28, padding: "20px 18px 22px", position: "relative", boxShadow: "0 5px 0 #7A4800,0 8px 32px rgba(0,0,0,0.55),inset 0 0 60px rgba(255,180,60,0.04)", overflow: "visible", ...style }}>
        <NightVines />
        {children}
      </div>
    </div>
  );
}
/* ── Real Video Player (2.N-1 and 2.N-5) ── */
function VideoPlayer({ src, onDone }: { src: string; onDone?: () => void }) {
  const vidRef = useRef<HTMLVideoElement | null>(null);

  const repeat = () => { const v = vidRef.current; if (!v) return; v.currentTime = 0; v.play(); };

  return (
    <div style={{ width: "100%", borderRadius: 18, overflow: "hidden", background: "#000", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
      <div style={{ position: "relative", lineHeight: 0, height: "clamp(300px,48vh,520px)", overflow: "hidden" }}>
        <video ref={vidRef} src={src} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", display: "block", objectFit: "cover", objectPosition: "center 15%" }} />
        {/* Repeat + Done overlay — centred in dark purple mat area */}
        <div style={{ position: "absolute", bottom: "18%", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "row", gap: 12, zIndex: 4 }} onClick={e => e.stopPropagation()}>
          <button onClick={repeat}
            style={{ background: "linear-gradient(135deg,#9060d8,#6840a8)", border: "none", borderRadius: 99, padding: "10px 22px", fontSize: 14, color: "#e8d0ff", cursor: "pointer", fontFamily: "var(--font-baloo)", fontWeight: 800, boxShadow: "0 4px 14px rgba(100,50,200,0.55)", whiteSpace: "nowrap" }}>
            🔁 Repeat
          </button>
          {onDone && (
            <button onClick={onDone}
              style={{ background: "linear-gradient(135deg,#FFD740,#F9A825)", border: "none", borderRadius: 99, padding: "10px 22px", fontSize: 14, color: "#3D2000", cursor: "pointer", fontFamily: "var(--font-baloo)", fontWeight: 800, boxShadow: "0 4px 14px rgba(200,120,0,0.5)", whiteSpace: "nowrap" }}>
              Done ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
/* ── 2.N-1: Gentle Stretching ── */
function ScreenNightStretch({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const TOTAL = 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(true);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current!); setRunning(false); return 0; } return t - 1; });
    }, 1000);
  };
  const repeatTimer = () => { if (timerRef.current) clearInterval(timerRef.current); setTimeLeft(TOTAL); setTimeout(startTimer, 80); };
  useEffect(() => { const t = setTimeout(startTimer, 800); return () => { clearTimeout(t); if (timerRef.current) clearInterval(timerRef.current); }; }, []);
  const progress = (TOTAL - timeLeft) / TOTAL;
  const R = 30; const circ = 2 * Math.PI * R;
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 10 }}>
      {/* Background */}
      <img src="/stretch-bg.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", zIndex: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
      {/* Gradient — light top, heavy dark bottom */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,rgba(5,5,30,0.35) 0%,rgba(5,5,30,0.0) 25%,rgba(5,5,30,0.0) 48%,rgba(5,5,30,0.7) 68%,#060314 88%)", zIndex: 1 }} />

      {/* ── TOP BAR ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 0" }}>
        <BackBtn onClick={onPrev} />
        {/* Timer pill */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(10,5,40,0.75)", borderRadius: 99, padding: "8px 18px", backdropFilter: "blur(8px)", border: "1px solid rgba(150,100,255,0.3)" }}>
          <div style={{ position: "relative", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="36" height="36" viewBox="0 0 36 36" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(100,60,200,0.25)" strokeWidth="3" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="url(#ng-top)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 14 * progress} ${2 * Math.PI * 14}`} />
              <defs><linearGradient id="ng-top" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8040d0" /><stop offset="100%" stopColor="#c090ff" /></linearGradient></defs>
            </svg>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 11, color: "#F5E4A8", fontWeight: 900, position: "relative", zIndex: 1 }}>{timeLeft}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 11, color: "rgba(215,195,160,0.7)", fontWeight: 700 }}>TIME LEFT</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 13, color: "#F5E4A8", fontWeight: 900 }}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* ── SUBTITLE — floats just below top bar ── */}
      <div style={{ position: "absolute", top: 70, left: 0, right: 0, zIndex: 3, textAlign: "center", pointerEvents: "none" }}>
        <span style={{ display: "inline-block", background: "rgba(10,5,40,0.55)", backdropFilter: "blur(6px)", borderRadius: 99, padding: "6px 20px", border: "1px solid rgba(150,100,255,0.2)", fontSize: 13.5, color: "rgba(240,215,170,0.9)", fontFamily: "var(--font-nunito)", fontWeight: 600, letterSpacing: 0.3 }}>
          🌿 Let&apos;s move gently and feel good inside
        </span>
      </div>

      {/* ── BOTTOM SECTION — cards + buttons ── */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3, padding: "0 16px 28px", maxWidth: 760, margin: "0 auto" }}>
        {/* Cards row */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "stretch" }}>
          {/* Why it helps */}
          <div style={{ flex: 1, background: "rgba(8,4,28,0.88)", borderRadius: 18, padding: "14px 13px 12px", border: "1px solid rgba(100,60,200,0.35)", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(200,160,20,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 13 }}>⭐</span></div>
              <span style={{ fontFamily: "var(--font-baloo)", fontSize: 12.5, color: "#F5E4A8", fontWeight: 800 }}>Why it helps</span>
            </div>
            <p style={{ fontSize: 11.5, color: "rgba(215,195,160,0.88)", margin: 0, lineHeight: 1.6 }}>Gentle stretching improves flexibility, releases tension, and lifts your mood.</p>
          </div>
          {/* Tip */}
          <div style={{ flex: 1, background: "rgba(8,4,28,0.88)", borderRadius: 18, padding: "14px 13px 12px", border: "1px solid rgba(100,60,200,0.35)", backdropFilter: "blur(12px)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(60,120,60,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ fontSize: 13 }}>🌿</span></div>
              <span style={{ fontFamily: "var(--font-baloo)", fontSize: 12.5, color: "#F5E4A8", fontWeight: 800 }}>Tip</span>
            </div>
            <p style={{ fontSize: 11.5, color: "rgba(215,195,160,0.88)", margin: 0, lineHeight: 1.6 }}>Breathe in... stretch up.<br />Breathe out... relax down.</p>
          </div>
        </div>
        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={repeatTimer} style={{ flex: 1, padding: "15px 0", borderRadius: 99, background: "rgba(55,18,120,0.95)", border: "2px solid rgba(120,80,210,0.55)", cursor: "pointer", fontFamily: "var(--font-baloo)", fontSize: 17, fontWeight: 900, color: "#DCC8FF", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 0 rgba(20,8,70,0.9),0 6px 20px rgba(55,18,120,0.5)" }}>
            🔁 Repeat
          </button>
          <button onClick={onNext} style={{ flex: 1, padding: "15px 0", borderRadius: 99, background: "linear-gradient(135deg,#FFD740,#F9A825)", border: "none", cursor: "pointer", fontFamily: "var(--font-baloo)", fontSize: 17, fontWeight: 900, color: "#3D2000", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 0 #A86200,0 6px 20px rgba(200,120,0,0.5)" }}>
            ✓ Done
          </button>
        </div>
      </div>
    </div>
  );
}
/* ── 2.N-2: How Was Your Day ── */
function ScreenNightDayReview({ onNext, onPrev, goals }: {
  onNext: () => void; onPrev: () => void; goals: Goals;
}) {
  const CATS = [
    { key: "personal", label: "Personal", icon: "👤", bg: "#F9D0C4", headerBg: "#F2B8AA", checkColor: "#C85A5A", textColor: "#7A2828" },
    { key: "professional", label: "Professional", icon: "💼", bg: "#EDD5F5", headerBg: "#DDB8F0", checkColor: "#7A3DA8", textColor: "#4A2870" },
    { key: "social", label: "Social", icon: "👥", bg: "#D8EDD8", headerBg: "#BEE0BE", checkColor: "#3A7A3A", textColor: "#2A5828" },
  ] as const;
  const getGoalItems = (key: string) => {
    const g = goals[key as keyof Goals];
    if (!Array.isArray(g)) return Array(5).fill("");
    const texts = g.map((item: { text: string }) => item.text).filter(Boolean);
    while (texts.length < 5) texts.push("");
    return texts.slice(0, 5);
  };
  const [entries, setEntries] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(CATS.map(c => [c.key, getGoalItems(c.key)]))
  );
  const update = (cat: string, i: number, val: string) =>
    setEntries(p => ({ ...p, [cat]: p[cat].map((v, j) => j === i ? val : v) }));

  return (
    <NightCard>
      <style>{`
        .ndr2-sign{text-align:center;margin-bottom:10px;}
        .ndr2-sign h2{font-family:var(--font-baloo);font-size:clamp(18px,3.5vw,26px);color:#F5D060;font-weight:900;margin:0 0 2px;line-height:1.1;text-shadow:0 1px 8px rgba(200,140,10,0.5);}
        .ndr2-sign p{font-size:clamp(11px,1.6vw,12.5px);color:rgba(220,195,140,0.85);margin:0;font-family:var(--font-nunito);}
        .ndr2-stars{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:2px;}
        /* 3-column grid on desktop, stack on mobile */
        .ndr2-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:9px;}
        @media(max-width:520px){.ndr2-grid{grid-template-columns:1fr;}}
        .ndr2-card{border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.2);}
        .ndr2-head{display:flex;align-items:center;gap:6px;padding:6px 10px;font-family:var(--font-baloo);font-size:clamp(11px,1.8vw,13px);font-weight:800;}
        .ndr2-body{padding:5px 10px 7px;display:flex;flex-direction:column;gap:3px;position:relative;}
        .ndr2-row{display:flex;align-items:center;gap:7px;padding:3px 0;border-bottom:1px dashed rgba(0,0,0,0.35);}
        .ndr2-row:last-child{border-bottom:none;}
        .ndr2-inp{flex:1;background:transparent;border:none;outline:none;font-size:clamp(10px,1.5vw,11.5px);font-family:var(--font-nunito);color:rgba(40,20,10,0.72);min-width:0;}
        .ndr2-inp::placeholder{color:rgba(80,40,20,0.35);}
        .ndr2-vine{position:absolute;bottom:3px;right:6px;font-size:15px;opacity:0.2;pointer-events:none;transform:scaleX(-1);}
        .ndr2-quote{display:flex;align-items:center;gap:7px;background:rgba(255,240,200,0.07);border:1px solid rgba(201,160,80,0.2);border-radius:10px;padding:7px 11px;margin-bottom:9px;font-size:clamp(10px,1.5vw,11.5px);color:rgba(220,195,140,0.88);font-family:var(--font-nunito);}
        .ndr2-btns{display:flex;gap:10px;}
        .ndr2-skip{flex:1;padding:11px 0;border-radius:99px;background:rgba(55,18,120,0.95);border:2px solid rgba(120,80,220,0.5);cursor:pointer;font-family:var(--font-baloo);font-size:clamp(13px,2vw,15px);font-weight:900;color:#DCC8FF;box-shadow:0 3px 0 rgba(20,8,70,0.9);}
        .ndr2-done{flex:1;padding:11px 0;border-radius:99px;background:linear-gradient(135deg,#FFD740,#F9A825);border:none;cursor:pointer;font-family:var(--font-baloo);font-size:clamp(13px,2vw,15px);font-weight:900;color:#3D2000;box-shadow:0 3px 0 #A86200;}
        @media(max-width:520px){
          .ndr2-grid{gap:6px;margin-bottom:7px;}
          .ndr2-head{padding:5px 9px;}
          .ndr2-body{padding:4px 9px 6px;}
        }
      `}</style>
      <BackBtn onClick={onPrev} />
      {/* Title */}
      <div className="ndr2-sign" style={{ paddingTop: 14 }}>
        <h2>How was your day?</h2>
        <div className="ndr2-stars">
          <span style={{ fontSize: 11, color: "#F9C74F" }}>⭐</span>
          <p>Take a moment to reflect on your day</p>
          <span style={{ fontSize: 11, color: "#F9C74F" }}>⭐</span>
        </div>
      </div>
      {/* 3-col grid */}
      <div className="ndr2-grid">
        {CATS.map(cat => (
          <div key={cat.key} className="ndr2-card" style={{ background: cat.bg }}>
            <div className="ndr2-head" style={{ background: cat.headerBg, color: cat.textColor }}>
              <span style={{ fontSize: 13 }}>{cat.icon}</span>
              <span>{cat.label}</span>
            </div>
            <div className="ndr2-body">
              {entries[cat.key].map((txt, i) => (
                <div key={i} className="ndr2-row">
                  <input className="ndr2-inp" value={txt} onChange={e => update(cat.key, i, e.target.value)}
                  />
                </div>
              ))}
              <span className="ndr2-vine">🌿</span>
            </div>
          </div>
        ))}
      </div>
      {/* Quote */}
      <div className="ndr2-quote">
        <span style={{ fontSize: 13, flexShrink: 0 }}>⭐</span>
        <span>There&apos;s no right or wrong here. Just an honest reflection.</span>
      </div>
      {/* Buttons */}
      <div className="ndr2-btns">
        <button className="ndr2-skip" onClick={onNext}>Skip</button>
        <button className="ndr2-done" onClick={() => { saveGarden({ session: "night", dayReview: entries }); onNext(); }}>🌱 Done</button>
      </div>
    </NightCard>
  );
}

/* ── 2.N-3: Relational Mapping ── */
interface SocialPerson { id: number; name: string; relation: string; circle: "close" | "somewhat" | "farther"; last: string; freq: string; notes: string; }
const circleColors: Record<string, string> = { close: "#ff82aa", somewhat: "#f9d14a", farther: "#50d28c" };
const circleLabel: Record<string, string> = { close: "Close Friend", somewhat: "Somewhat Close", farther: "Farther Away" };
const circleOrder = ["close", "somewhat", "farther"] as const;
const DEFAULT_PEOPLE: SocialPerson[] = [
  { id: 1, name: "Aarav", relation: "Close Friend", circle: "close", last: "2 days ago", freq: "Weekly", notes: "" },
  { id: 2, name: "Meera", relation: "Best Friend", circle: "close", last: "5 days ago", freq: "Weekly", notes: "" },
  { id: 3, name: "Riya", relation: "Close Friend", circle: "close", last: "1 week ago", freq: "Monthly", notes: "" },
  { id: 4, name: "Kabir", relation: "Brother", circle: "somewhat", last: "2 weeks ago", freq: "Daily", notes: "" },
  { id: 5, name: "Tina", relation: "College Friend", circle: "somewhat", last: "3 weeks ago", freq: "Monthly", notes: "" },
  { id: 6, name: "Neha", relation: "Cousin", circle: "somewhat", last: "1 month ago", freq: "Rarely", notes: "" },
  { id: 7, name: "Vikram", relation: "Work Friend", circle: "farther", last: "1 month ago", freq: "Rarely", notes: "" },
  { id: 8, name: "Ishita", relation: "Friend", circle: "farther", last: "2 months ago", freq: "Rarely", notes: "" },
];
function getAvatar(name: string, flip?: boolean) {
  const n = name.toLowerCase();
  const boyExceptions = ["aditya", "shiva", "krishna", "arya", "ravi", "rishi", "hari"];
  const isFemale = (n.endsWith("a") || n.endsWith("i") || ["meera", "riya", "tina", "neha", "ishita"].includes(n)) && !boyExceptions.includes(n);
  const hair = isFemale ? "full,pixie" : "fonze,mrT,dougFunny,mrClean,dannyPhantom";
  const fhProb = isFemale ? "0" : "30";
  return `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name)}&baseColor=f9c9b6&hair=${hair}&facialHairProbability=${fhProb}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&backgroundType=gradientLinear${flip ? '&flip=true' : ''}`;
}

function ScreenNightSocial({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [people, setPeople] = useState<SocialPerson[]>(() => {
    if (typeof window === "undefined") return DEFAULT_PEOPLE;
    try { const s = localStorage.getItem("mbsocial2"); return s ? JSON.parse(s) : DEFAULT_PEOPLE; } catch { return DEFAULT_PEOPLE; }
  });
  const [layout, setLayout] = useState<{
    close: { cx: number; cy: number; rx: number; ry: number };
    somewhat: { cx: number; cy: number; rx: number; ry: number };
    farther: { cx: number; cy: number; rx: number; ry: number };
  } | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [filterMode, setFilterMode] = useState<"all" | "close" | "somewhat" | "farther">("all");
  const [editId, setEditId] = useState<number | null>(null);
  const [detailCircle, setDetailCircle] = useState<0 | 1 | 2>(0);
  const [detailFreq, setDetailFreq] = useState("Weekly");
  const [detailNotes, setDetailNotes] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addRel, setAddRel] = useState("Friend");

  const save = (next: SocialPerson[]) => { setPeople(next); if (typeof window !== "undefined") localStorage.setItem("mbsocial2", JSON.stringify(next)); };

  const computeLayout = () => {
    const el = containerRef.current; if (!el) return;
    const W = el.offsetWidth, H = el.offsetHeight;
    const scale = Math.max(W / 1920, H / 1080);
    const dW = 1920 * scale, dH = 1080 * scale;
    const offX = (dW - W) * 0.50, offY = (dH - H) * 0.50;

    // Fit ellipses extracted from the user's Label Studio annotations
    setLayout({
      close: { cx: 969.0 * scale - offX, cy: 533.3 * scale - offY, rx: 164.6 * scale, ry: 137.6 * scale },
      somewhat: { cx: 972.5 * scale - offX, cy: 545.3 * scale - offY, rx: 241.3 * scale, ry: 208.0 * scale },
      farther: { cx: 969.7 * scale - offX, cy: 554.3 * scale - offY, rx: 323.4 * scale, ry: 275.0 * scale }
    });
  };
  useEffect(() => { computeLayout(); window.addEventListener("resize", computeLayout); return () => window.removeEventListener("resize", computeLayout); }, []);

  const openDetail = (id: number) => {
    const p = people.find(x => x.id === id); if (!p) return;
    setEditId(id);
    setDetailCircle(circleOrder.indexOf(p.circle) as 0 | 1 | 2);
    setDetailFreq(p.freq);
    setDetailNotes(p.notes || "");
  };
  const saveDetail = () => {
    if (editId === null) return;
    save(people.map(p => p.id === editId ? { ...p, circle: circleOrder[detailCircle], freq: detailFreq, notes: detailNotes } : p));
    setEditId(null);
  };
  const doAddPerson = () => {
    if (!addName.trim()) return;
    save([...people, { id: Date.now(), name: addName.trim(), relation: addRel || "Friend", circle: "farther", last: "Just now", freq: "Rarely", notes: "" }]);
    setAddName(""); setAddRel("Friend"); setShowAdd(false);
  };

  // Compute avatar positions
  const avatarPositions = layout ? (() => {
    const startAngle: Record<string, number> = { close: -Math.PI * 0.5, somewhat: -Math.PI * 0.65, farther: -Math.PI * 0.75 };
    const groups: Record<string, SocialPerson[]> = { close: [], somewhat: [], farther: [] };
    people.forEach(p => groups[p.circle].push(p));
    const positions: Array<{ p: SocialPerson; x: number; y: number; flip: boolean }> = [];
    (["close", "somewhat", "farther"] as const).forEach(circle => {
      const ps = groups[circle]; if (!ps.length) return;
      const ring = layout[circle]; const start = startAngle[circle];
      ps.forEach((person, i) => {
        const angle = start + (2 * Math.PI / ps.length) * i;
        const x = ring.cx + ring.rx * Math.cos(angle);
        const y = ring.cy + ring.ry * Math.sin(angle);
        const flip = x > ring.cx;
        positions.push({ p: person, x, y, flip });
      });
    });
    return positions;
  })() : [];

  const editPerson = editId !== null ? people.find(x => x.id === editId) : null;
  const filtered = filterMode === "all" ? people : people.filter(p => p.circle === filterMode);

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 10, fontFamily: "var(--font-nunito)" }}>
      {/* Full-screen background */}
      <img src={socialBgImg.src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 54%, transparent 28%, rgba(0,0,0,.18) 65%, rgba(0,0,0,.55) 100%)", zIndex: 1 }} />
      <style>{`
        .soc-bubble { position:absolute; width:clamp(38px,4.5vw,58px); height:clamp(38px,4.5vw,58px); border-radius:50%; overflow:visible; cursor:pointer; z-index:15; transform:translate(-50%,-50%); transition:transform .2s; }
        .soc-bubble:hover { transform:translate(-50%,-50%) scale(1.22); z-index:25; }
        .soc-bubble img { width:clamp(38px,4.5vw,58px); height:clamp(38px,4.5vw,58px); border-radius:50%; display:block; object-fit:cover; }
        .soc-bname { position:absolute; bottom:-20px; left:50%; transform:translateX(-50%); color:#fff; font-size:clamp(9px,1vw,11px); font-weight:800; white-space:nowrap; text-shadow:0 1px 6px #000,0 0 10px #000; pointer-events:none; }
        .soc-panel { position:fixed; top:0; right:-100%; width:min(88vw,360px); height:100%; background:#fdf6e3; z-index:50; display:flex; flex-direction:column; transition:right .35s cubic-bezier(.4,0,.2,1); box-shadow:-8px 0 40px rgba(0,0,0,.7); border-radius:24px 0 0 24px; }
        .soc-panel.open { right:0; }
        .soc-ftab { padding:4px 12px; border-radius:20px; font-size:11px; font-weight:800; border:none; cursor:pointer; }
        .soc-prow { display:flex; align-items:center; padding:10px 16px; border-bottom:1px solid #f0e8d8; cursor:pointer; }
        .soc-prow:hover { background:#fdf0dc; }
        .soc-detail { position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:60; display:flex; align-items:flex-end; justify-content:center; }
        .soc-sheet { background:#fdf6e3; width:min(100%,480px); border-radius:28px 28px 0 0; padding:0 0 24px; max-height:88vh; overflow-y:auto; }
        .soc-fbtn { padding:5px 14px; border-radius:16px; border:1.5px solid #d0c0a0; background:#fff; font-size:12px; font-weight:700; color:#7a6a50; cursor:pointer; }
        .soc-fbtn.active { background:#ffd0de; border-color:#e08080; color:#c0305a; }
      `}</style>

      {/* Title bar */}
      <div style={{ position: "absolute", top: 14, left: 0, right: 0, textAlign: "center", zIndex: 20, pointerEvents: "none" }}>
        <h1 style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(18px,5vw,26px)", fontWeight: 800, color: "#fff", textShadow: "0 2px 14px rgba(0,0,0,.9)", lineHeight: 1.15, margin: 0 }}>Understanding Social Life</h1>
        <p style={{ fontSize: 12, color: "#ddf0ff", fontStyle: "italic", textShadow: "0 1px 6px rgba(0,0,0,.9)", marginTop: 2 }}>Everyone has a special place in our life.</p>
      </div>

      {/* Back/Help button */}
      <button onClick={onPrev} style={{ position: "absolute", top: 14, left: 14, zIndex: 30, width: 36, height: 36, background: "rgba(20,12,5,.6)", border: "1.5px solid rgba(255,200,80,.4)", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5d890", fontSize: 18, fontFamily: "var(--font-baloo)", fontWeight: 800, boxShadow: "0 2px 10px rgba(0,0,0,.4)" }}>←</button>





      {/* Avatar bubbles */}
      {avatarPositions.map(({ p, x, y, flip }) => (
        <div key={p.id} className="soc-bubble" style={{ left: x, top: y }} onClick={() => openDetail(p.id)}>
          <img src={getAvatar(p.name, flip)} alt={p.name} style={{ border: `3px solid ${p.circle === "close" ? "rgba(255,130,170,.95)" : p.circle === "somewhat" ? "rgba(255,215,60,.95)" : "rgba(100,225,140,.95)"}`, borderRadius: "50%", boxShadow: `0 3px 14px rgba(0,0,0,.7), 0 0 16px ${p.circle === "close" ? "rgba(255,130,170,.6)" : p.circle === "somewhat" ? "rgba(255,215,60,.5)" : "rgba(100,225,140,.5)"}` }} />
          <div className="soc-bname">{p.name}</div>
        </div>
      ))}

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 14, left: 12, display: "flex", gap: 14, zIndex: 20 }}>
        {(["close", "somewhat", "farther"] as const).map(c => (
          <div key={c} style={{ display: "flex", alignItems: "center", gap: 6, color: "#fff", fontSize: 12, fontWeight: 700, lineHeight: 1, textShadow: "0 1px 5px rgba(0,0,0,.9)" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: circleColors[c], flexShrink: 0 }} />
            {c === "close" ? "Close to me" : c === "somewhat" ? "Somewhat close" : "Farther away"}
          </div>
        ))}
      </div>

      {/* People list button */}
      <button onClick={() => setShowPanel(true)} style={{ position: "absolute", bottom: 62, left: 14, background: "rgba(40,24,10,.88)", border: "2px solid rgba(180,130,50,.7)", borderRadius: 14, color: "#f5d890", fontFamily: "var(--font-baloo)", fontSize: 13, fontWeight: 700, padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 4px 20px rgba(0,0,0,.6)", zIndex: 20 }}>👥 People List</button>

      {/* Done button */}
      <button onClick={onNext} style={{ position: "absolute", bottom: 58, right: 16, background: "linear-gradient(135deg,#50d28c,#2aa860)", border: "none", borderRadius: 22, color: "#fff", fontFamily: "var(--font-baloo)", fontSize: 15, fontWeight: 700, padding: "10px 22px", cursor: "pointer", boxShadow: "0 4px 22px rgba(50,200,120,.6)", zIndex: 20 }}>Done ✓</button>

      {/* People Panel */}
      <div className={`soc-panel${showPanel ? " open" : ""}`}>
        <div style={{ background: "#2a1e10", padding: "20px 18px 14px", borderRadius: "24px 0 0 0", position: "relative" }}>
          <h2 style={{ fontFamily: "var(--font-baloo)", color: "#f5d890", fontSize: 18 }}>People in your life</h2>
          <button onClick={() => setShowPanel(false)} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,.15)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#f5d890", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "10px 14px 6px", background: "#f5ead0", borderBottom: "1px solid #e8d8b8" }}>
          {([["all", "All", "#3a5bd9", "#fff"], ["close", "Close", "#ffd0de", "#c0305a"], ["somewhat", "Somewhat", "#fff0b0", "#8a6a00"], ["farther", "Farther", "#d0f5e0", "#1a6a40"]] as const).map(([mode, label, bg, col]) => (
            <button key={mode} className="soc-ftab" onClick={() => setFilterMode(mode as typeof filterMode)} style={{ background: filterMode === mode ? bg : "#ede3d2", color: filterMode === mode ? col : "#8a7a60" }}>{label}</button>
          ))}
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          {filtered.map(p => (
            <div key={p.id} className="soc-prow" onClick={() => { openDetail(p.id); setShowPanel(false); }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", marginRight: 10, flexShrink: 0, border: "2px solid #ddd" }}><img src={getAvatar(p.name)} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#2a1e0e" }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#8a7a60", display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: circleColors[p.circle] }} />{p.relation}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#b09070", marginLeft: "auto", paddingLeft: 6, whiteSpace: "nowrap" }}>{p.last}</div>
              <div style={{ marginLeft: 6, fontSize: 14 }}>{p.circle === "close" ? "❤️" : "🤍"}</div>
              <div style={{ color: "#c0a880", marginLeft: 4 }}>›</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e8dece" }}>
          {showAdd ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input value={addName} onChange={e => setAddName(e.target.value)} placeholder="Name" autoFocus style={{ padding: "8px 12px", borderRadius: 10, border: "1.5px solid #C9A870", background: "#FEFAE8", fontSize: 14, color: "#2C1A0E", outline: "none" }} />
              <input value={addRel} onChange={e => setAddRel(e.target.value)} placeholder="Relationship (e.g. Friend)" style={{ padding: "8px 12px", borderRadius: 10, border: "1.5px solid #C9A870", background: "#FEFAE8", fontSize: 14, color: "#2C1A0E", outline: "none" }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={doAddPerson} style={{ flex: 1, padding: 10, background: "linear-gradient(135deg,#3a5040,#2a3e30)", color: "#c0f0b0", border: "none", borderRadius: 20, fontFamily: "var(--font-baloo)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Add</button>
                <button onClick={() => setShowAdd(false)} style={{ padding: "10px 14px", background: "#ede3d2", border: "none", borderRadius: 20, fontSize: 13, cursor: "pointer", color: "#7a6a50" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAdd(true)} style={{ width: "100%", padding: 10, background: "linear-gradient(135deg,#3a5040,#2a3e30)", color: "#c0f0b0", border: "none", borderRadius: 20, fontFamily: "var(--font-baloo)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Add Person</button>
          )}
        </div>
      </div>

      {/* Detail bottom sheet */}
      {editId !== null && editPerson && (
        <div className="soc-detail" onClick={e => { if (e.target === e.currentTarget) setEditId(null); }}>
          <div className="soc-sheet">
            <button onClick={() => setEditId(null)} style={{ position: "absolute", zIndex: 1, top: 12, right: 14, background: "rgba(255,255,255,.15)", border: "none", borderRadius: "50%", width: 30, height: 30, color: "#f5d890", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
            <div style={{ display: "flex", alignItems: "center", padding: "16px 18px 12px", background: "#2a1e10", borderRadius: "28px 28px 0 0", gap: 14, position: "relative" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", border: "3px solid #f5d890", flexShrink: 0 }}><img src={getAvatar(editPerson.name)} alt={editPerson.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div>
                <h3 style={{ fontFamily: "var(--font-baloo)", color: "#f5d890", fontSize: 19, margin: 0 }}>{editPerson.name}</h3>
                <div style={{ display: "inline-block", padding: "2px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700, background: "#ffd0de", color: "#c0305a", marginTop: 3 }}>{circleLabel[circleOrder[detailCircle]]}</div>
                <div style={{ fontSize: 11, color: "#a09080", marginTop: 3 }}>Last connected <span style={{ color: "#e08080", fontWeight: 700 }}>{editPerson.last}</span></div>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 30 }}>🪴</div>
            </div>
            <div style={{ padding: "14px 18px 0" }}>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: "#5a4a30", marginBottom: 4 }}>Closeness</h4>
              <p style={{ fontSize: 11, color: "#9a8a70", marginBottom: 8 }}>Move person closer or farther</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#9a8a70", whiteSpace: "nowrap" }}>Closer</span>
                <input type="range" min={0} max={2} step={1} value={detailCircle} onChange={e => setDetailCircle(+e.target.value as 0 | 1 | 2)} style={{ flex: 1, WebkitAppearance: "none", height: 7, borderRadius: 4, background: "linear-gradient(to right,#3a7a30,#e05050)", outline: "none", cursor: "pointer" }} />
                <span style={{ fontSize: 11, color: "#9a8a70", whiteSpace: "nowrap" }}>Farther</span>
              </div>
            </div>
            <div style={{ padding: "14px 18px 0" }}>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: "#5a4a30", marginBottom: 6 }}>How often do you connect?</h4>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["Daily", "Weekly", "Monthly", "Rarely"].map(f => (
                  <button key={f} className={`soc-fbtn${detailFreq === f ? " active" : ""}`} onClick={() => setDetailFreq(f)}>{f}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: "14px 18px 0" }}>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: "#5a4a30", marginBottom: 6 }}>Notes (optional)</h4>
              <textarea value={detailNotes} onChange={e => setDetailNotes(e.target.value)} placeholder="Write something you appreciate..." style={{ width: "100%", height: 62, border: "1.5px solid #d8c8a8", borderRadius: 12, background: "#fff9f0", padding: "8px 10px", fontFamily: "var(--font-nunito)", fontSize: 12, color: "#5a4a30", resize: "none", outline: "none" }} />
            </div>
            <button onClick={saveDetail} style={{ display: "block", width: "calc(100% - 36px)", margin: "16px 18px 0", padding: 12, background: "linear-gradient(135deg,#3a5040,#2a3e30)", color: "#c0f0b0", border: "none", borderRadius: 22, fontFamily: "var(--font-baloo)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Save changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 2.N-4: Emotional Mapping ── */
/* Character SVG art for Feelings Check In — each is a small illustrated figure */
function EmoChar({ id, sel, col }: { id: string; sel: boolean; col: string }) {
  // Inline SVG characters matching the mockup's illustrated style
  const chars: Record<string, React.ReactNode> = {
    Happy: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <circle cx="30" cy="22" r="20" fill="#F9A825" />
        <circle cx="30" cy="22" r="20" fill="url(#hSun)" opacity="0.3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <line key={a} x1={30 + 22 * Math.cos(a * Math.PI / 180)} y1={22 + 22 * Math.sin(a * Math.PI / 180)} x2={30 + 28 * Math.cos(a * Math.PI / 180)} y2={22 + 28 * Math.sin(a * Math.PI / 180)} stroke="#F9A825" strokeWidth="2.5" strokeLinecap="round" />)}
        <circle cx="23" cy="19" r="2.5" fill="#5D3A00" />
        <circle cx="37" cy="19" r="2.5" fill="#5D3A00" />
        <path d="M22 27 Q30 34 38 27" fill="none" stroke="#5D3A00" strokeWidth="2" strokeLinecap="round" />
        <defs><radialGradient id="hSun"><stop offset="0%" stopColor="#fff" /><stop offset="100%" stopColor="#F9A825" stopOpacity="0" /></radialGradient></defs>
      </svg>
    ),
    Angry: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="22" fill="#E53935" />
        <path d="M8 10 Q14 5 20 12" fill="none" stroke="#B71C1C" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M40 12 Q46 5 52 10" fill="none" stroke="#B71C1C" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="22" cy="23" r="3" fill="#4A0000" />
        <circle cx="38" cy="23" r="3" fill="#4A0000" />
        <path d="M22 34 Q30 29 38 34" fill="none" stroke="#4A0000" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 17 L26 21M34 21 L42 17" stroke="#B71C1C" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    Calm: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="22" fill="#4DB6AC" />
        <circle cx="23" cy="24" r="2.5" fill="#00332E" />
        <circle cx="37" cy="24" r="2.5" fill="#00332E" />
        <path d="M23 33 Q30 37 37 33" fill="none" stroke="#00332E" strokeWidth="2" strokeLinecap="round" />
        <path d="M15 18 Q22 14 26 20M34 20 Q38 14 45 18" fill="none" stroke="#26A69A" strokeWidth="1.5" />
        {[...Array(5)].map((_, i) => <circle key={i} cx={14 + i * 8} cy={52 + Math.sin(i) * 3} r="3" fill="#80CBC4" opacity="0.7" />)}
      </svg>
    ),
    Sad: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="19" ry="22" fill="#5C8DB8" />
        <circle cx="23" cy="22" r="2.5" fill="#1A3A5A" />
        <circle cx="37" cy="22" r="2.5" fill="#1A3A5A" />
        <path d="M22 33 Q30 29 38 33" fill="none" stroke="#1A3A5A" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="22" cy="22" rx="4" ry="5" fill="#90CAF9" opacity="0.4" />
        <ellipse cx="38" cy="22" rx="4" ry="5" fill="#90CAF9" opacity="0.4" />
        <path d="M24 26 Q24 36 22 40M36 26 Q36 36 38 40" stroke="#90CAF9" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
    Worried: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="21" fill="#7B68C8" />
        <circle cx="23" cy="23" r="2.5" fill="#1A0050" />
        <circle cx="37" cy="23" r="2.5" fill="#1A0050" />
        <path d="M22 33 Q30 30 38 33" fill="none" stroke="#1A0050" strokeWidth="2" strokeLinecap="round" />
        <path d="M19 16 Q22 12 26 16M34 16 Q38 12 41 16" fill="none" stroke="#5548A0" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 16 Q30 14 34 16" stroke="#9C8FE0" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    Silly: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="21" fill="#BA68C8" />
        <circle cx="23" cy="21" r="3" fill="#4A0060" />
        <circle cx="37" cy="21" r="3" fill="#4A0060" />
        <circle cx="24" cy="20" r="1" fill="#fff" />
        <circle cx="38" cy="20" r="1" fill="#fff" />
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
        <path d="M30 6 L54 24 L44 52 L16 52 L6 24Z" fill="url(#confGrad)" opacity="0.4" />
        <circle cx="23" cy="28" r="2.5" fill="#3E2000" />
        <circle cx="37" cy="28" r="2.5" fill="#3E2000" />
        <path d="M24 38 Q30 35 36 38" fill="none" stroke="#3E2000" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 10 Q36 6 38 12" fill="none" stroke="#C9A050" strokeWidth="2" strokeLinecap="round" />
        <text x="33" y="13" fontSize="8" fill="#C9A050" fontWeight="bold">?</text>
        <defs><linearGradient id="confGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fff" /><stop offset="100%" stopColor="#9C7B3A" stopOpacity="0" /></linearGradient></defs>
      </svg>
    ),
    Anxious: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <ellipse cx="30" cy="26" rx="20" ry="21" fill="#E8883A" />
        {[...Array(8)].map((_, i) => { const a = i * 45 * Math.PI / 180; return <line key={i} x1={30 + 22 * Math.cos(a)} y1={26 + 22 * Math.sin(a)} x2={30 + 27 * Math.cos(a)} y2={26 + 27 * Math.sin(a)} stroke="#E8883A" strokeWidth="3" strokeLinecap="round" /> })}
        <circle cx="23" cy="23" r="3" fill="#7A3000" />
        <circle cx="37" cy="23" r="3" fill="#7A3000" />
        <path d="M23 33 Q27 31 30 33 Q33 31 37 33" fill="none" stroke="#7A3000" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 17 L28 21M32 21 L36 17" stroke="#C0601A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    Excited: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <circle cx="30" cy="24" r="20" fill="#FFB300" />
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map(a => <line key={a} x1={30 + 22 * Math.cos(a * Math.PI / 180)} y1={24 + 22 * Math.sin(a * Math.PI / 180)} x2={30 + 29 * Math.cos(a * Math.PI / 180)} y2={24 + 29 * Math.sin(a * Math.PI / 180)} stroke="#FF8F00" strokeWidth="2.5" strokeLinecap="round" />)}
        <circle cx="23" cy="20" r="3" fill="#5D3A00" />
        <circle cx="37" cy="20" r="3" fill="#5D3A00" />
        <circle cx="24" cy="19" r="1.2" fill="#fff" />
        <circle cx="38" cy="19" r="1.2" fill="#fff" />
        <path d="M20 28 Q25 36 30 28 Q35 36 40 28" fill="#FF8F00" stroke="#5D3A00" strokeWidth="1.5" />
        <circle cx="30" cy="31" r="2" fill="#5D3A00" />
      </svg>
    ),
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", userSelect: "none", padding: "6px 4px 8px", borderRadius: 14, background: sel ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)", border: sel ? `2px solid ${col}` : "2px solid transparent", transition: "all 0.15s", transform: sel ? "scale(1.08)" : "scale(1)", boxShadow: sel ? `0 0 16px ${col}55` : "none" }}>
      {chars[id]}
      <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font-baloo)", color: sel ? col : "#C4B5FD", textAlign: "center", lineHeight: 1 }}>{id}</span>
      {/* Radio circle */}
      <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${sel ? col : "rgba(180,160,220,0.5)"}`, background: sel ? col : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
        {sel && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
      </div>
    </div>
  );
}

function BodySilhouette({ selected, onSelect }: { selected: string | null; onSelect: (s: string) => void }) {
  const parts = [
    { id: "Head", y: 30, label: "Head" },
    { id: "Chest", y: 90, label: "Chest" },
    { id: "Stomach", y: 135, label: "Stomach" },
    { id: "Arms", y: 115, label: "Arms" },
    { id: "Legs", y: 195, label: "Legs" },
  ];
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {/* Silhouette SVG */}
      <svg viewBox="0 0 70 240" width="60" height="205" style={{ flexShrink: 0 }}>
        {/* head */}
        <ellipse cx="35" cy="26" rx="16" ry="18" fill={selected === "Head" ? "#8B5CF6" : "#4B3080"} opacity={selected === "Head" ? 1 : 0.7} />
        {/* neck */}
        <rect x="30" y="42" width="10" height="10" rx="4" fill={selected === "Chest" ? "#8B5CF6" : "#4B3080"} opacity="0.7" />
        {/* torso */}
        <rect x="20" y="52" width="30" height="55" rx="8" fill={selected === "Chest" || selected === "Stomach" ? "#8B5CF6" : "#4B3080"} opacity={selected === "Chest" || selected === "Stomach" ? 1 : 0.7} />
        {/* arms */}
        <rect x="4" y="55" width="14" height="44" rx="7" fill={selected === "Arms" ? "#8B5CF6" : "#4B3080"} opacity={selected === "Arms" ? 1 : 0.7} />
        <rect x="52" y="55" width="14" height="44" rx="7" fill={selected === "Arms" ? "#8B5CF6" : "#4B3080"} opacity={selected === "Arms" ? 1 : 0.7} />
        {/* legs */}
        <rect x="20" y="108" width="13" height="65" rx="7" fill={selected === "Legs" ? "#8B5CF6" : "#4B3080"} opacity={selected === "Legs" ? 1 : 0.7} />
        <rect x="37" y="108" width="13" height="65" rx="7" fill={selected === "Legs" ? "#8B5CF6" : "#4B3080"} opacity={selected === "Legs" ? 1 : 0.7} />
        {/* highlight dots for selected */}
        {selected === "Head" && <circle cx="35" cy="26" r="6" fill="#C4B5FD" opacity="0.7" />}
        {selected === "Chest" && <circle cx="35" cy="68" r="6" fill="#C4B5FD" opacity="0.7" />}
        {selected === "Stomach" && <circle cx="35" cy="95" r="6" fill="#C4B5FD" opacity="0.7" />}
        {selected === "Arms" && <><circle cx="11" cy="77" r="5" fill="#C4B5FD" opacity="0.7" /><circle cx="59" cy="77" r="5" fill="#C4B5FD" opacity="0.7" /></>}
        {selected === "Legs" && <><circle cx="26" cy="140" r="5" fill="#C4B5FD" opacity="0.7" /><circle cx="44" cy="140" r="5" fill="#C4B5FD" opacity="0.7" /></>}
      </svg>
      {/* Radio list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {parts.map(p => (
          <div key={p.id} onClick={() => onSelect(p.id)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
            <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${selected === p.id ? "#A78BFA" : "rgba(167,139,250,0.4)"}`, background: selected === p.id ? "#7C3AED" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
              {selected === p.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
            </div>
            <span style={{ fontSize: 13, color: selected === p.id ? "#E9D5FF" : "#C4B5FD", fontWeight: selected === p.id ? 700 : 500 }}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Thermometer({ level, onSelect }: { level: number | null; onSelect: (n: number) => void }) {
  // Color gradient: 1=green, 5=yellow, 10=red
  const getCol = (n: number) => {
    const t = (n - 1) / 9;
    if (t < 0.5) { const r = Math.round(t * 2 * 255); return `rgb(${r},200,80)`; }
    else { const t2 = (t - 0.5) * 2; return `rgb(255,${Math.round(200 - t2 * 160)},${Math.round(80 - t2 * 70)})`; }
  };
  const filled = level ?? 0;
  const updateLevel = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let n = Math.round((164 - y) / 16);
    if (n < 1) n = 1;
    if (n > 10) n = 10;
    if (n !== level) onSelect(n);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    updateLevel(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      updateLevel(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { }
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
      {/* Thermometer tube */}
      <div
        style={{ position: "relative", width: 28, height: 200, flexShrink: 0, cursor: "pointer", touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* tube bg */}
        <div style={{ position: "absolute", bottom: 14, left: 4, width: 20, borderRadius: "10px 10px 0 0", background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(200,180,255,0.3)", height: 175, pointerEvents: "none" }} />
        {/* fill */}
        <div style={{ position: "absolute", bottom: 14, left: 6, width: 16, borderRadius: "8px 8px 0 0", background: `linear-gradient(to top, #4CAF50, #FFEB3B 50%, #F44336)`, height: filled > 0 ? `${(filled / 10) * 160}px` : "0px", pointerEvents: "none" }} />
        {/* bulb */}
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 26, height: 26, borderRadius: "50%", background: filled > 0 ? getCol(filled) : "#4B3080", border: "2px solid rgba(200,180,255,0.4)", pointerEvents: "none" }} />
        {/* tick marks */}
        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n, i) => (
          <div key={n} style={{ position: "absolute", right: 0, top: 4 + i * 16, display: "flex", alignItems: "center", gap: 2, pointerEvents: "none" }}>
            <div style={{ width: 6, height: 1.5, background: "rgba(200,180,255,0.3)" }} />
          </div>
        ))}
      </div>
      {/* Number buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(n => (
          <div key={n} onClick={() => onSelect(level === n ? 0 : n)}
            style={{
              width: 28, height: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: 4,
              background: level !== null && n <= level ? getCol(n) : "transparent",
              color: level !== null && n <= level ? "#1a0030" : "rgba(200,180,255,0.6)",
              fontSize: 10, fontWeight: 700, fontFamily: "var(--font-baloo)", transition: "all 0.15s",
              border: level === n ? "1.5px solid #fff" : "1px solid transparent"
            }}>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

const FEELING_TYPES = ["Wobbly", "Frustrating", "Exciting", "Scary", "Confusing", "Warm", "Fun"];

const CALMING_ITEMS = [
  {
    label: "Calm corner", icon: (
      <svg viewBox="0 0 60 50" width="54" height="45">
        <rect x="5" y="20" width="50" height="25" rx="4" fill="#2D1B60" />
        <path d="M8 20 Q30 5 52 20" fill="#3D2580" stroke="#5D3A90" strokeWidth="1.5" />
        <rect x="15" y="24" width="14" height="18" rx="3" fill="#7C3AED" opacity="0.7" />
        <rect x="32" y="28" width="20" height="14" rx="3" fill="#5B21B6" opacity="0.8" />
        <circle cx="22" cy="26" r="4" fill="#C4B5FD" opacity="0.5" />
        <path d="M10 45 Q20 40 30 44 Q40 40 50 44" fill="none" stroke="#8B5CF6" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    label: "Walk", icon: (
      <svg viewBox="0 0 60 60" width="54" height="54">
        <circle cx="30" cy="10" r="7" fill="#6D28D9" />
        <path d="M30 17 L26 38 L18 52M30 17 L34 38 L42 52" stroke="#7C3AED" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M26 28 L20 32M34 28 L40 32" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="30" cy="56" rx="22" ry="3" fill="#4C1D95" opacity="0.4" />
      </svg>
    )
  },
  {
    label: "Take a break", icon: (
      <svg viewBox="0 0 60 60" width="54" height="54">
        <circle cx="30" cy="30" r="22" fill="#5B21B6" />
        <circle cx="30" cy="30" r="22" fill="none" stroke="#7C3AED" strokeWidth="3" />
        <rect x="22" y="20" width="6" height="20" rx="3" fill="#DDD6FE" />
        <rect x="32" y="20" width="6" height="20" rx="3" fill="#DDD6FE" />
      </svg>
    )
  },
  {
    label: "Breathing", icon: (
      <svg viewBox="0 0 60 60" width="54" height="54">
        <circle cx="20" cy="30" r="12" fill="#4C1D95" />
        <circle cx="20" cy="30" r="8" fill="#6D28D9" />
        <circle cx="20" cy="30" r="4" fill="#A78BFA" />
        <path d="M32 30 Q40 22 52 26M32 30 Q40 38 52 34" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M50 20 Q58 26 50 32" fill="none" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    label: "Drink", icon: (
      <svg viewBox="0 0 60 60" width="54" height="54">
        <path d="M20 12 L16 52 L44 52 L40 12Z" fill="#3D1A7A" stroke="#6D28D9" strokeWidth="2" />
        <path d="M22 12 Q28 22 36 12" fill="#6D28D9" opacity="0.7" />
        <rect x="16" y="34" width="28" height="18" rx="2" fill="#7C3AED" opacity="0.6" />
        <path d="M44 28 Q52 28 52 36 Q52 44 44 44" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="30" cy="28" rx="10" ry="3" fill="#A78BFA" opacity="0.5" />
      </svg>
    )
  },
];

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

/* ── 2.N-5: Night Meditation ── */
function ScreenNightMeditation({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10, overflow: "hidden" }}>
      <img src={meditationBgImg.src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(6,3,22,0.18)", zIndex: 1 }} />
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "14px 20px 36px" }}>
        {/* Back button */}
        <div style={{ width: "100%", maxWidth: 900, display: "flex", justifyContent: "flex-start" }}>
          <button onClick={onPrev} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(14,8,36,0.7)", border: "1.5px solid rgba(180,140,255,0.3)", color: "#C4B5FD", fontSize: 18, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        </div>
        {/* Meditating girl — full center */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: "40px" }}>
          <img src={meditationGirlImg.src} alt="Meditating" style={{ height: "clamp(220px,42vh,460px)", width: "auto", objectFit: "contain", borderRadius: "50%", filter: "drop-shadow(0 0 40px rgba(180,140,255,0.5))" }} />
        </div>
        {/* Done button */}
        <button onClick={onNext} style={{ padding: "14px 56px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,#6D28D9,#9333EA)", color: "#fff", fontSize: 18, fontWeight: 800, fontFamily: "var(--font-baloo)", cursor: "pointer", letterSpacing: "0.06em", boxShadow: "0 4px 28px rgba(109,40,217,0.65)" }}>
          Done ✓
        </button>
      </div>
    </div>
  );
}
/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ *//* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function GardenPage() {
  const { data: session } = useSession({ required: true });
  const router = useRouter();
  const [isNight, setIsNight] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("morning");
  const [screen, setScreen] = useState<Screen>("entry");
  const [completed, setCompleted] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audio = new Audio("/garden-bg.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    bgAudioRef.current = audio;
    audio.play().catch(() => {});
    return () => { audio.pause(); audio.src = ""; };
  }, []);
  const [gratitude, setGratitude] = useState<string[]>(["", "", ""]);
  const [selected, setSelected] = useState<number[]>([]);
  const [goals, setGoals] = useState<Goals>(emptyGoals());
  const [cups, setCups] = useState<number[]>([]);

  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loadingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dogName = (session?.user as { dogName?: string })?.dogName ?? "Buddy";
  const coins = (session?.user as { coins?: number })?.coins ?? 0;
  useEffect(() => {
    elapsedRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { if (elapsedRef.current) clearInterval(elapsedRef.current); };
  }, []);
  useEffect(() => {
    const sType = getSessionType();
    setIsNight(sType === "night");
    setSessionType(sType);
    // Hard failsafe — loading never stays forever
    loadingRef.current = setTimeout(() => setLoading(false), 5000);
    const minWait = new Promise<void>(res => setTimeout(res, 1500));
    const dataFetch = fetch(`/api/garden?session=${sType}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: Record<string, unknown> | null) => {
        if (!data) return;
        try {
          if (data.gratitude) setGratitude((data.gratitude as { name: string }[]).map((g: { name: string }) => g.name));
          if (data.intentions) setSelected(data.intentions as number[]);
          if (data.goals) {
            const g = data.goals;
            if (g && typeof g === "object" && "personal" in g && Array.isArray((g as Goals).personal)) setGoals(g as Goals);
          }
          if (data.cups) setCups(data.cups as number[]);
          if (data.completed) setCompleted(true);
        } catch { /* ignore data parsing errors */ }
      })
      .catch(() => { });
    Promise.all([minWait, dataFetch])
      .catch(() => { })
      .finally(() => {
        if (loadingRef.current) clearTimeout(loadingRef.current);
        setLoading(false);
      });
    return () => {
      if (loadingRef.current) clearTimeout(loadingRef.current);
    };
  }, []);
  const morningFlow: Screen[] = ["entry", "meditation", "gratitude", "affirmations", "goals", "cups", "complete"];
  const nightFlow: Screen[] = ["entry", "n-stretch", "n-day-review", "n-social", "n-meditation", "n-complete"];
  const flow = isNight ? nightFlow : morningFlow;
  const goNext = async () => {
    const idx = flow.indexOf(screen);
    if (idx < 0) return;
    const next = flow[idx + 1];
    if (!next) return;
    if (next === "complete" || next === "n-complete") {
      await saveGarden({ session: sessionType, completed: true });
      setCoinsEarned(true); setCompleted(true);
    }
    setScreen(next);
  };
  const goPrev = () => {
    const idx = flow.indexOf(screen);
    if (idx <= 1) { setScreen("entry"); return; }
    setScreen(flow[idx - 1]);
  };
  const progressStep = () => { const inner = flow.slice(1); return inner.indexOf(screen); };
  const total = flow.length - 2;
  const showProgress = !["entry", "complete", "n-complete"].includes(screen);
  const isFullScreen = ["goals", "complete", "n-complete", "n-social", "n-meditation"].includes(screen);
  if (loading || !videoReady) {
    const introSrc = getSessionType() === "night" ? "/garden-night.mp4" : "/garden-day.mp4";
    const handleVideoEnd = () => {
      setVideoFading(true);
      setTimeout(() => setVideoReady(true), 900);
    };
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10, background: "#000" }}>
        <video
          key={introSrc}
          src={introSrc}
          autoPlay muted playsInline
          onEnded={handleVideoEnd}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Dark overlay fades IN over the video → goes to black */}
        <div style={{
          position: "absolute", inset: 0, background: "#000",
          opacity: videoFading ? 1 : 0,
          transition: videoFading ? "opacity 0.9s ease" : "none",
          pointerEvents: "none",
        }} />
      </div>
    );
  }
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <GardenBackground isNight={isNight} />
      {/* Fade in from black after video transition */}
      <style>{`@keyframes gardenFadeIn{from{opacity:1}to{opacity:0}}`}</style>
      <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "#000", animation: "gardenFadeIn 0.9s ease forwards", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 10, width: "100%", paddingTop: isFullScreen ? "8px" : "16px", paddingLeft: isFullScreen ? "8px" : "16px", paddingRight: isFullScreen ? "8px" : "16px", paddingBottom: 24, display: "flex", flexDirection: "column", alignItems: "center", maxHeight: "100vh", overflowY: "auto" }}>
        {showProgress && <ProgressDots step={progressStep()} total={total} />}
        {screen === "entry" && <ScreenEntry isNight={isNight} dogName={dogName} coins={coins} elapsed={elapsed} onStart={goNext} onBack={() => router.push("/island")} />}
        {screen === "meditation" && <ScreenMeditation onNext={goNext} onPrev={goPrev} />}
        {screen === "gratitude" && <ScreenGratitude onNext={goNext} onPrev={goPrev} sessionType={sessionType} gratitude={gratitude} setGratitude={setGratitude} />}
        {screen === "affirmations" && <ScreenAffirmations onNext={goNext} onPrev={goPrev} sessionType={sessionType} selected={selected} setSelected={setSelected} />}
        {screen === "goals" && <ScreenGoals onNext={goNext} onPrev={goPrev} sessionType={sessionType} goals={goals} setGoals={setGoals} />}
        {screen === "cups" && <ScreenCups onNext={goNext} onPrev={goPrev} sessionType={sessionType} cups={cups} setCups={setCups} />}
        {screen === "complete" && <ScreenComplete onBack={() => router.push("/island")} dogName={dogName} coinsEarned={coinsEarned} isNight={false} />}
        {screen === "n-stretch" && <ScreenNightStretch onNext={goNext} onPrev={goPrev} />}
        {screen === "n-day-review" && <ScreenNightDayReview onNext={goNext} onPrev={goPrev} goals={goals} />}
        {screen === "n-social" && <ScreenNightSocial onNext={goNext} onPrev={goPrev} />}
        {screen === "n-meditation" && <ScreenNightMeditation onNext={goNext} onPrev={goPrev} />}
        {screen === "n-complete" && <ScreenComplete onBack={() => router.push("/island")} dogName={dogName} coinsEarned={coinsEarned} isNight={true} />}
      </div>
    </div>
  );
}