"use client";
import { useRouter } from "next/navigation";

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 5 || h >= 17;
}

export default function SchoolSuccessPage() {
  const router = useRouter();
  const isNight = isNightTime();
  const bgImg   = isNight ? "/school/School_night.png" : "/school/School_day.png";

  return (
    <div
      style={{
        minHeight: "100dvh",
        fontFamily: "var(--font-nunito)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
        position: "relative",
      }}
    >
      <img src={bgImg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }} />
      <style>{`
        @keyframes popIn { 0%{transform:scale(0.3) rotate(-15deg);opacity:0} 65%{transform:scale(1.15);opacity:1} 100%{transform:scale(1);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Heart */}
      <div style={{ fontSize: 80, animation: "popIn 0.7s cubic-bezier(.36,.07,.19,.97) both", marginBottom: 24, position: "relative", zIndex: 2 }}>
        💙
      </div>

      {/* Divider */}
      <div
        style={{
          width: 120,
          height: 2,
          background: "linear-gradient(90deg,transparent,#4A90D9,transparent)",
          marginBottom: 28,
          animation: "fadeUp 0.5s ease 0.3s both",
          opacity: 0,
          position: "relative",
          zIndex: 2,
        }}
      />

      {/* Message */}
      <h1
        style={{
          fontFamily: "var(--font-baloo)",
          fontSize: "clamp(26px,5vw,38px)",
          fontWeight: 900,
          color: "#2D2060",
          margin: "0 0 10px",
          textAlign: "center",
          animation: "fadeUp 0.5s ease 0.4s both",
          opacity: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        Two points credited! ✨
      </h1>

      <p
        style={{
          fontSize: "clamp(14px,3vw,17px)",
          color: "#4A90D9",
          textAlign: "center",
          margin: "0 0 52px",
          fontWeight: 600,
          animation: "fadeUp 0.5s ease 0.5s both",
          opacity: 0,
          maxWidth: 320,
          lineHeight: 1.5,
          position: "relative",
          zIndex: 2,
        }}
      >
        You showed up and learned something today — that's everything. 🌱
      </p>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          animation: "fadeUp 0.5s ease 0.6s both",
          opacity: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        <button
          onClick={() => router.push("/island")}
          style={{
            padding: "14px 48px",
            borderRadius: 999,
            background: "linear-gradient(135deg,#4A90D9,#9B59B6)",
            border: "none",
            color: "#fff",
            fontFamily: "var(--font-baloo)",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 4px 22px rgba(74,144,217,0.4)",
            letterSpacing: "0.04em",
          }}
        >
          Return to Island →
        </button>

        <button
          onClick={() => router.push("/school")}
          style={{
            background: "none",
            border: "none",
            color: "#AAA",
            fontSize: 13,
            cursor: "pointer",
            fontStyle: "italic",
            fontFamily: "var(--font-nunito)",
          }}
        >
          Try another activity
        </button>
      </div>
    </div>
  );
}
