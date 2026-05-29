"use client";
import { useRouter } from "next/navigation";

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 5 || h >= 17;
}

/* ─── Placeholder daily story (replace with Google Drive fetch at 12 am) ─── */
const DAILY_STORY = {
  title: "The Cloud Who Was Afraid to Rain",
  image: "🌧️",
  paragraphs: [
    "High above the meadow, a small cloud named Nimbus floated quietly among his big, fluffy friends. Every morning the other clouds would stretch themselves wide, gather up all their rain, and let it fall in a joyful rush — pattering on rooftops, singing in gutters, and waking the flowers below.",
    "But Nimbus was afraid. What if the rain fell in the wrong place? What if the drops were too heavy, or too cold, or too many? So he held his rain inside, day after day, growing heavier and darker and more worried with every passing hour.",
    "One afternoon a tiny sparrow landed on the edge of Nimbus and looked up at him with bright eyes. \"You look very full,\" the sparrow said. \"And very sad.\"",
    "\"I am,\" said Nimbus. \"I'm afraid that my rain won't be good enough.\"",
    "The sparrow tilted her head. \"Have you ever seen a bad rain? Even the softest drizzle fills the ponds a little. Even one drop is a drink for a bee.\"",
    "Nimbus thought about this for a long, quiet moment. Then, very gently, he let go.",
    "The rain fell — not perfectly, not all at once — but it fell. And far below, a child looked up, laughed, and held out her hands.",
  ],
};

export default function StoryPage() {
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
          📖 Read a Story
        </h1>
      </div>

      {/* Story area */}
      <div style={{ display: "flex", gap: 14, padding: "0 16px", flex: 1, minHeight: 0, overflow: "hidden", position: "relative", zIndex: 2 }}>
        {/* Text column */}
        <div
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.82)",
            borderRadius: 18,
            border: "2px solid rgba(74,144,217,0.3)",
            boxShadow: "0 4px 20px rgba(74,144,217,0.12)",
            padding: "22px 20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-baloo)",
              fontSize: "clamp(17px,3.5vw,22px)",
              fontWeight: 900,
              color: "#2D2060",
              margin: "0 0 18px",
              lineHeight: 1.3,
              borderBottom: "2px solid rgba(74,144,217,0.2)",
              paddingBottom: 14,
            }}
          >
            {DAILY_STORY.title}
          </h2>

          {DAILY_STORY.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: "clamp(14px,2.5vw,16px)",
                color: "#333",
                lineHeight: 1.75,
                margin: "0 0 14px",
                fontStyle: i === DAILY_STORY.paragraphs.length - 1 ? "italic" : "normal",
              }}
            >
              {p}
            </p>
          ))}

          <p style={{ fontSize: 11, color: "#AAA", marginTop: 8, fontStyle: "italic" }}>
            ✦ Daily story — refreshes at midnight
          </p>
        </div>

        {/* Image column */}
        <div
          style={{
            width: "clamp(120px,28vw,200px)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flexShrink: 0,
          }}
        >
          {/* Illustration card */}
          <div
            style={{
              background: "rgba(255,255,255,0.85)",
              borderRadius: 18,
              border: "2px solid rgba(74,144,217,0.25)",
              boxShadow: "0 4px 16px rgba(74,144,217,0.10)",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              flex: 1,
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: 14,
                background: "linear-gradient(135deg,#E3F4FF,#B0D8FF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 64,
              }}
            >
              {DAILY_STORY.image}
            </div>
            <p
              style={{
                fontSize: 11,
                color: "#888",
                textAlign: "center",
                margin: 0,
                fontStyle: "italic",
                lineHeight: 1.4,
              }}
            >
              Today's illustration
            </p>
          </div>

          {/* Quote card */}
          <div
            style={{
              background: "rgba(74,144,217,0.12)",
              borderRadius: 16,
              border: "1.5px solid rgba(74,144,217,0.2)",
              padding: "14px 12px",
            }}
          >
            <p
              style={{
                fontSize: 12,
                color: "#2D5080",
                fontStyle: "italic",
                textAlign: "center",
                margin: 0,
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              "Even one drop is a drink for a bee."
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
            background: "linear-gradient(135deg,#4A90D9,#1E88E5)",
            border: "none",
            color: "#fff",
            fontFamily: "var(--font-baloo)",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(74,144,217,0.45)",
            letterSpacing: "0.04em",
          }}
        >
          Done ✓
        </button>
      </div>
    </div>
  );
}
