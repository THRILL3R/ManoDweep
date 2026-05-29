"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 5 || h >= 17;
}

/* ─── Placeholder daily puzzle (replace with Google Drive fetch at 12 am) ─── */
const DAILY_PUZZLE = {
  type: "riddle",
  question: "I have cities, but no houses live there.\nI have mountains, but no trees grow there.\nI have water, but no fish swim there.\nI have roads, but no cars drive there.\nWhat am I?",
  answer: "A MAP",
  hint: "You hold me in your hands when you're lost.",
};

const YESTERDAY = {
  puzzle: "What has hands but can't clap?",
  answer: "A CLOCK",
};

export default function PuzzlePage() {
  const router = useRouter();
  const isNight = isNightTime();
  const bgImg   = isNight ? "/school/School_night.png" : "/school/School_day.png";

  const [input,     setInput]     = useState("");
  const [revealed,  setRevealed]  = useState(false);
  const [correct,   setCorrect]   = useState<boolean | null>(null);
  const [showHint,  setShowHint]  = useState(false);
  const [solvedToday, setSolvedToday] = useState(1); // placeholder count

  const check = () => {
    const isCorrect = input.trim().toUpperCase() === DAILY_PUZZLE.answer.toUpperCase();
    setCorrect(isCorrect);
    if (isCorrect) setSolvedToday((n) => n + 1);
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        fontFamily: "var(--font-nunito)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <img src={bgImg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }} />
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px 12px", position: "relative", zIndex: 2 }}>
        <button
          onClick={() => router.push("/school")}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(0,0,0,0.1)", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          ←
        </button>
        <h1 style={{ fontFamily: "var(--font-baloo)", fontSize: 22, fontWeight: 900, color: "#2D2060", margin: 0 }}>
          🧩 Solve a Puzzle
        </h1>
      </div>

      {/* Main area */}
      <div style={{ display: "flex", gap: 14, padding: "0 16px", flex: 1, position: "relative", zIndex: 2 }}>
        {/* Puzzle column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Puzzle card */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 18,
              border: "2px solid rgba(155,89,182,0.3)",
              boxShadow: "0 4px 20px rgba(155,89,182,0.12)",
              padding: "24px 22px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22 }}>🔍</span>
              <span style={{ fontFamily: "var(--font-baloo)", fontSize: 13, fontWeight: 800, color: "#9B59B6", letterSpacing: "0.08em" }}>
                TODAY'S RIDDLE
              </span>
            </div>

            <div
              style={{
                background: "rgba(155,89,182,0.07)",
                borderRadius: 14,
                padding: "20px 18px",
                borderLeft: "4px solid #9B59B6",
              }}
            >
              {DAILY_PUZZLE.question.split("\n").map((line, i) => (
                <p key={i} style={{ fontSize: "clamp(14px,2.8vw,17px)", color: "#2D2060", margin: "0 0 8px", lineHeight: 1.65, fontWeight: 500 }}>
                  {line}
                </p>
              ))}
            </div>

            {/* Hint */}
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                style={{ alignSelf: "flex-start", fontSize: 12, color: "#9B59B6", background: "none", border: "1px dashed #9B59B6", borderRadius: 12, padding: "4px 12px", cursor: "pointer", fontFamily: "var(--font-nunito)" }}
              >
                💡 Need a hint?
              </button>
            ) : (
              <p style={{ fontSize: 13, color: "#7D3C98", fontStyle: "italic", background: "rgba(155,89,182,0.08)", borderRadius: 10, padding: "8px 12px", margin: 0 }}>
                💡 {DAILY_PUZZLE.hint}
              </p>
            )}

            {/* Answer input */}
            {!correct && !revealed && (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setCorrect(null); }}
                  onKeyDown={(e) => e.key === "Enter" && check()}
                  placeholder="Your answer…"
                  style={{
                    flex: 1,
                    padding: "11px 16px",
                    borderRadius: 12,
                    border: correct === false ? "2px solid #E53935" : "2px solid rgba(155,89,182,0.3)",
                    fontSize: 15,
                    fontFamily: "var(--font-nunito)",
                    outline: "none",
                    background: "#FAFAFA",
                    color: "#2D2060",
                  }}
                />
                <button
                  onClick={check}
                  style={{
                    padding: "11px 20px",
                    borderRadius: 12,
                    background: "#9B59B6",
                    border: "none",
                    color: "#fff",
                    fontFamily: "var(--font-baloo)",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  Check
                </button>
              </div>
            )}

            {correct === false && (
              <p style={{ fontSize: 13, color: "#E53935", margin: 0, fontWeight: 600 }}>Not quite — try again! 💪</p>
            )}

            {correct === true && (
              <div style={{ background: "rgba(67,160,71,0.1)", borderRadius: 12, padding: "12px 16px", border: "1.5px solid rgba(67,160,71,0.3)" }}>
                <p style={{ fontSize: 15, color: "#2E7D32", fontWeight: 800, margin: "0 0 4px", fontFamily: "var(--font-baloo)" }}>
                  🎉 Yes! That's right!
                </p>
                <p style={{ fontSize: 13, color: "#388E3C", margin: 0 }}>The answer is <strong>{DAILY_PUZZLE.answer}</strong></p>
              </div>
            )}

            {!revealed && !correct && (
              <button
                onClick={() => setRevealed(true)}
                style={{ alignSelf: "flex-start", fontSize: 12, color: "#AAA", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-nunito)", textDecoration: "underline" }}
              >
                Show answer
              </button>
            )}

            {revealed && !correct && (
              <div style={{ background: "rgba(245,166,35,0.1)", borderRadius: 12, padding: "10px 14px", border: "1.5px solid rgba(245,166,35,0.3)" }}>
                <p style={{ fontSize: 13, color: "#8B6000", margin: 0 }}>The answer is <strong>{DAILY_PUZZLE.answer}</strong> — no worries, tomorrow is a new puzzle! ☀️</p>
              </div>
            )}

            <p style={{ fontSize: 11, color: "#BBB", marginTop: "auto", fontStyle: "italic" }}>
              ✦ Daily puzzle — refreshes at midnight
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: "clamp(120px,28vw,180px)", display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
          {/* Yesterday's answer */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 18,
              border: "2px solid rgba(155,89,182,0.2)",
              boxShadow: "0 4px 16px rgba(155,89,182,0.08)",
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <p style={{ fontFamily: "var(--font-baloo)", fontSize: 11, fontWeight: 800, color: "#9B59B6", margin: 0, letterSpacing: "0.08em" }}>
              YESTERDAY'S ANSWER
            </p>
            <p style={{ fontSize: 12, color: "#555", fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>
              "{YESTERDAY.puzzle}"
            </p>
            <div style={{ background: "rgba(155,89,182,0.1)", borderRadius: 10, padding: "8px 10px" }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#7D3C98", margin: 0, fontFamily: "var(--font-baloo)" }}>
                {YESTERDAY.answer}
              </p>
            </div>
          </div>

          {/* Solved count */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 18,
              border: "2px solid rgba(155,89,182,0.2)",
              boxShadow: "0 4px 16px rgba(155,89,182,0.08)",
              padding: "16px 14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 32 }}>🧩</span>
            <p style={{ fontFamily: "var(--font-baloo)", fontSize: 28, fontWeight: 900, color: "#2D2060", margin: 0 }}>
              {solvedToday}
            </p>
            <p style={{ fontSize: 11, color: "#888", textAlign: "center", margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
              puzzles solved today
            </p>
          </div>
        </div>
      </div>

      {/* Done */}
      <div style={{ padding: "16px 20px 36px", display: "flex", justifyContent: "center", position: "relative", zIndex: 2 }}>
        <button
          onClick={() => router.push("/school/success")}
          style={{
            padding: "14px 56px",
            borderRadius: 999,
            background: "linear-gradient(135deg,#9B59B6,#8E24AA)",
            border: "none",
            color: "#fff",
            fontFamily: "var(--font-baloo)",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(155,89,182,0.45)",
            letterSpacing: "0.04em",
          }}
        >
          Done ✓
        </button>
      </div>
    </div>
  );
}
