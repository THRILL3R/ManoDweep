"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 5 || h >= 17;
}

/* ── SVG card illustrations ── */
function PaletteIllustration() {
  return (
    <svg viewBox="0 0 120 110" width="82" height="75" fill="none">
      {/* Easel legs */}
      <line x1="60" y1="72" x2="30" y2="108" stroke="#8B5E3C" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="72" x2="90" y2="108" stroke="#8B5E3C" strokeWidth="4" strokeLinecap="round" />
      <line x1="40" y1="92" x2="80" y2="92" stroke="#8B5E3C" strokeWidth="3" strokeLinecap="round" />
      {/* Palette body */}
      <ellipse cx="60" cy="48" rx="36" ry="30" fill="#D4A55A" opacity="0.9" />
      <ellipse cx="60" cy="48" rx="36" ry="30" fill="none" stroke="#B8822A" strokeWidth="2" />
      {/* Thumb hole */}
      <ellipse cx="74" cy="56" rx="7" ry="5" fill="#C49040" />
      {/* Paint dots */}
      <circle cx="44" cy="38" r="7" fill="#E53935" />
      <circle cx="57" cy="30" r="7" fill="#F9A825" />
      <circle cx="71" cy="33" r="7" fill="#43A047" />
      <circle cx="78" cy="44" r="7" fill="#1E88E5" />
      <circle cx="44" cy="54" r="7" fill="#9C27B0" />
      {/* Brush */}
      <rect x="22" y="20" width="5" height="38" rx="2.5" fill="#8B5E3C" transform="rotate(-30 22 20)" />
      <ellipse cx="14" cy="52" rx="5" ry="8" fill="#E53935" transform="rotate(-30 14 52)" />
      {/* Stars */}
      <text x="92" y="28" fontSize="12" fill="#F9A825">★</text>
      <text x="10" y="30" fontSize="10" fill="#F9A825">★</text>
    </svg>
  );
}

function BookIllustration() {
  return (
    <svg viewBox="0 0 120 100" width="82" height="68" fill="none">
      {/* Left page */}
      <path d="M12 18 Q12 14 16 14 L58 14 L58 86 L16 86 Q12 86 12 82 Z" fill="#FFFEF0" stroke="#8BC34A" strokeWidth="2" />
      {/* Right page */}
      <path d="M62 14 L104 14 Q108 14 108 18 L108 82 Q108 86 104 86 L62 86 Z" fill="#FFFEF0" stroke="#8BC34A" strokeWidth="2" />
      {/* Spine */}
      <rect x="57" y="12" width="6" height="76" rx="2" fill="#5D9B3A" />
      {/* Castle illustration on left page */}
      <rect x="24" y="54" width="28" height="22" rx="2" fill="#E8A040" />
      <rect x="20" y="46" width="8" height="18" rx="1" fill="#D08030" />
      <rect x="44" y="46" width="8" height="18" rx="1" fill="#D08030" />
      <polygon points="24,46 28,38 32,46" fill="#D04020" />
      <polygon points="44,46 48,38 52,46" fill="#D04020" />
      <rect x="33" y="62" width="6" height="14" rx="1" fill="#8B5E3C" />
      {/* Flag */}
      <line x1="28" y1="38" x2="28" y2="28" stroke="#555" strokeWidth="1.5" />
      <polygon points="28,28 36,31 28,34" fill="#E53935" />
      {/* Grass */}
      <path d="M20 76 Q36 70 52 76" stroke="#5D9B3A" strokeWidth="2" fill="none" />
      {/* Lines on right page */}
      <line x1="66" y1="32" x2="100" y2="32" stroke="#C8D8B0" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="42" x2="100" y2="42" stroke="#C8D8B0" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="52" x2="100" y2="52" stroke="#C8D8B0" strokeWidth="2" strokeLinecap="round" />
      <line x1="66" y1="62" x2="96" y2="62" stroke="#C8D8B0" strokeWidth="2" strokeLinecap="round" />
      {/* Stars */}
      <text x="104" y="18" fontSize="12" fill="#F9A825">★</text>
      <text x="6" y="20" fontSize="10" fill="#F9A825">★</text>
    </svg>
  );
}

function PuzzleIllustration() {
  const letters = [
    ["C", "A", "O", "I"],
    ["L", "A", "E", "X"],
    ["B", "K", "T", "P"],
  ];
  const colors = [
    ["#E53935", "#43A047", "#1E88E5", "#9C27B0"],
    ["#F57C00", "#E53935", "#43A047", "#1E88E5"],
    ["#9C27B0", "#F57C00", "#E53935", "#43A047"],
  ];
  return (
    <svg viewBox="0 0 120 100" width="82" height="68" fill="none">
      {/* Background board */}
      <rect x="8" y="6" width="104" height="88" rx="12" fill="#E8E0FF" />
      <rect x="8" y="6" width="104" height="88" rx="12" fill="none" stroke="#B090D0" strokeWidth="2" />
      {/* Diagonal highlight line */}
      <line x1="16" y1="90" x2="88" y2="18" stroke="rgba(255,80,80,0.35)" strokeWidth="6" strokeLinecap="round" />
      {/* Letter tiles */}
      {letters.map((row, ri) =>
        row.map((letter, ci) => {
          const x = 18 + ci * 24;
          const y = 22 + ri * 24;
          return (
            <g key={`${ri}-${ci}`}>
              <rect x={x} y={y} width="20" height="20" rx="4" fill={colors[ri][ci]} />
              <text x={x + 10} y={y + 14} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="sans-serif">{letter}</text>
            </g>
          );
        })
      )}
      {/* Stars */}
      <text x="102" y="16" fontSize="11" fill="#F9A825">★</text>
      <text x="8" y="102" fontSize="10" fill="#F9A825">★</text>
    </svg>
  );
}

/* Badge icons */
function PaintBadge() {
  return (
    <svg viewBox="0 0 32 32" width="24" height="24" fill="none">
      <ellipse cx="16" cy="15" rx="9" ry="7" fill="#fff" opacity="0.9" />
      <circle cx="11" cy="13" r="2.5" fill="#E53935" />
      <circle cx="16" cy="10" r="2.5" fill="#F9A825" />
      <circle cx="21" cy="13" r="2.5" fill="#43A047" />
      <circle cx="20" cy="18" r="2" fill="#1E88E5" />
      <rect x="6" y="6" width="3" height="14" rx="1.5" fill="#8B5E3C" transform="rotate(-20 6 6)" />
    </svg>
  );
}
function BookBadge() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <path d="M6 8 Q6 6 8 6 L15 6 L15 26 L8 26 Q6 26 6 24 Z" fill="#fff" opacity="0.9" />
      <path d="M17 6 L24 6 Q26 6 26 8 L26 24 Q26 26 24 26 L17 26 Z" fill="#fff" opacity="0.9" />
      <rect x="14.5" y="5" width="3" height="22" rx="1" fill="#5D9B3A" />
    </svg>
  );
}
function PuzzleBadge() {
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <path d="M6 6 h8 v3 a3 3 0 0 1 0 6 v3 h-8 Z" fill="#fff" opacity="0.85" />
      <path d="M18 6 h8 v8 h-3 a3 3 0 0 0 0 6 h3 v6 h-8 v-3 a3 3 0 0 1-6 0 v3 h-2 v-6" fill="#fff" opacity="0.5" />
    </svg>
  );
}

const ACTIVITIES = [
  {
    title: "Paint a Picture",
    route: "/school/paint",
    Illustration: PaletteIllustration,
    BadgeIcon: PaintBadge,
    cardBg: "linear-gradient(160deg,#FFFDE0,#FFF0B0)",
    cardBorder: "#DDB840",
    titleColor: "#C84020",
    badgeBg: "linear-gradient(135deg,#E85050,#D03030)",
    badgeShadow: "0 4px 14px rgba(220,50,50,0.5)",
  },
  {
    title: "Read a Story",
    route: "/school/story",
    Illustration: BookIllustration,
    BadgeIcon: BookBadge,
    cardBg: "linear-gradient(160deg,#EDFAED,#C8ECC8)",
    cardBorder: "#68B868",
    titleColor: "#2A7A30",
    badgeBg: "linear-gradient(135deg,#48B858,#309040)",
    badgeShadow: "0 4px 14px rgba(60,160,70,0.5)",
  },
  {
    title: "Solve a Puzzle",
    route: "/school/puzzle",
    Illustration: PuzzleIllustration,
    BadgeIcon: PuzzleBadge,
    cardBg: "linear-gradient(160deg,#F5EEFF,#E8D8FF)",
    cardBorder: "#A878D8",
    titleColor: "#6040A8",
    badgeBg: "linear-gradient(135deg,#8858C8,#6840A8)",
    badgeShadow: "0 4px 14px rgba(120,70,200,0.5)",
  },
];

export default function SchoolPage() {
  const router = useRouter();
  const isNight = isNightTime();

  const bgVideoSrc = isNight ? "/school/School_night.mp4" : "/school/School_day.mp4";
  const bgImg = isNight ? "/school/School_night.png" : "/school/School_day.png";

  const [videoReady, setVideoReady] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  /* ── Intro video ── */
  if (!videoReady) return (
    <div style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>
      <video key={bgVideoSrc} src={bgVideoSrc} autoPlay muted playsInline
        onEnded={() => { setVideoFading(true); setTimeout(() => setVideoReady(true), 900); }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "112%", objectFit: "cover", objectPosition: "center top" }} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: videoFading ? 1 : 0, transition: videoFading ? "opacity 0.9s ease" : "none", pointerEvents: "none" }} />
    </div>
  );

  return (
    <div style={{
      minHeight: "100dvh",
      fontFamily: "var(--font-nunito)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      padding: "20px",
    }}>
      {/* Room background */}
      <img src={bgImg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }} />

      {/* ── Bulletin board ── */}
      <div style={{
        position: "relative",
        zIndex: 2,
        width: "min(640px, 92vw)",
        background: "linear-gradient(160deg,#FFF8E0 0%,#FFF3C0 100%)",
        borderRadius: 20,
        border: "11px solid #7A4F28",
        boxShadow: "0 0 0 2px #A06030, 0 10px 44px rgba(0,0,0,0.55), inset 0 2px 10px rgba(0,0,0,0.08)",
        padding: "20px 22px 26px",
      }}>

        {/* Board wood grain texture overlay */}
        <div style={{
          position: "absolute", inset: -14, borderRadius: 24, pointerEvents: "none",
          background: "repeating-linear-gradient(88deg,transparent,transparent 18px,rgba(80,40,10,0.06) 18px,rgba(80,40,10,0.06) 19px)",
          zIndex: 0,
        }} />

        {/* Back button — wooden sign style */}
        <button
          onClick={() => router.push("/island")}
          style={{
            position: "absolute", top: -6, right: -6,
            padding: "8px 20px",
            background: "#7A4F28",
            boxShadow: "0 0 0 2px #A06030, 0 10px 44px rgba(0,0,0,0.55), inset 0 2px 10px rgba(0,0,0,0.08)",
            borderRadius: 10,
            color: "#FFE8A0",
            fontFamily: "var(--font-baloo)",
            fontWeight: 800,
            fontSize: 14,
            cursor: "pointer",
            zIndex: 10,
            letterSpacing: "0.02em",
          }}
        >
          ← Back
        </button>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 6, position: "relative", zIndex: 1 }}>
          <p style={{
            fontFamily: "var(--font-baloo)",
            fontSize: "clamp(13px,2.8vw,18px)",
            fontWeight: 700,
            color: "#3A8A40",
            margin: "0 0 6px",
          }}>
            let us be like child again!
          </p>
          <div style={{ fontSize: 18, lineHeight: 1 }}>🩷</div>
        </div>

        {/* Activity cards */}
        <div style={{
          display: "flex",
          gap: "clamp(8px,2vw,16px)",
          justifyContent: "center",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
          marginTop: 12,
        }}>
          {ACTIVITIES.map((a) => (
            <div key={a.route} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
              {/* Card */}
              <button
                onClick={() => router.push(a.route)}
                onMouseEnter={() => setHovered(a.route)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: "clamp(118px,18vw,160px)",
                  padding: "16px 12px 14px",
                  borderRadius: 14,
                  background: a.cardBg,
                  border: `3px solid ${a.cardBorder}`,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: hovered === a.route
                    ? `0 10px 32px rgba(0,0,0,0.22)`
                    : `0 4px 14px rgba(0,0,0,0.12)`,
                  transform: hovered === a.route ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                  transition: "all 0.18s cubic-bezier(.34,1.56,.64,1)",
                }}
              >
                <a.Illustration />
                <span style={{
                  fontFamily: "var(--font-baloo)",
                  fontSize: "clamp(13px,2vw,16px)",
                  fontWeight: 900,
                  color: a.titleColor,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}>
                  {a.title}
                </span>
              </button>

              {/* Connector dot */}
              <div style={{ width: 3, height: 14, background: "#B0906040", borderRadius: 2 }} />

              {/* Badge circle */}
              <div style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: a.badgeBg,
                boxShadow: a.badgeShadow,
                border: "3px solid rgba(255,255,255,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <a.BadgeIcon />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
