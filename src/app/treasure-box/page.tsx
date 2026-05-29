"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 5 || h >= 17;
}

const FEELINGS_EMOTIONS = [
  { label: "Happy", col: "#F9A825" },
  { label: "Angry", col: "#E53935" },
  { label: "Calm", col: "#4DB6AC" },
  { label: "Sad", col: "#5C8DB8" },
  { label: "Worried", col: "#7B68C8" },
  { label: "Silly", col: "#BA68C8" },
  { label: "Tired", col: "#607D8B" },
  { label: "Confused", col: "#9C7B3A" },
  { label: "Anxious", col: "#E8883A" },
  { label: "Excited", col: "#FFB300" },
];

/* ── Diamond gem — round brilliant cut, CSS-tinted per emotion ── */
function GemIcon({ col, intensity }: { col: string; intensity: number }) {
  // Convert hex color → hue degrees for CSS hue-rotate
  const r = parseInt(col.slice(1,3),16)/255;
  const g = parseInt(col.slice(3,5),16)/255;
  const b = parseInt(col.slice(5,7),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min;
  let h=0;
  if(d>0){
    if(max===r) h=((g-b)/d+(g<b?6:0))*60;
    else if(max===g) h=((b-r)/d+2)*60;
    else h=((r-g)/d+4)*60;
  }
  const rot   = Math.round(h - 45); // sepia() base ≈ 45°
  const bri   = (0.48+(intensity/100)*0.82).toFixed(2);
  const sat   = (1.4 +(intensity/100)*3.6).toFixed(1);
  const sc    = (0.58+(intensity/100)*0.42).toFixed(2);

  // Round brilliant geometry (viewBox 0 0 130 108)
  const CX=65, GCY=48, GRX=62, GRY=7;
  const TCY=12, TRX=43, TRY=5;
  const CULET: [number,number]=[65,103];

  const gp=Array.from({length:8},(_,i)=>{
    const a=i*45*Math.PI/180;
    return [CX+GRX*Math.cos(a), GCY+GRY*Math.sin(a)] as [number,number];
  });
  const tp=Array.from({length:8},(_,i)=>{
    const a=(22.5+i*45)*Math.PI/180;
    return [CX+TRX*Math.cos(a), TCY+TRY*Math.sin(a)] as [number,number];
  });
  const pts=(arr:[number,number][])=>arr.map(p=>p.join(",")).join(" ");

  const pavFill=["rgba(80,130,220,.58)","rgba(170,120,55,.48)","rgba(50,100,205,.54)","rgba(190,140,65,.44)","rgba(60,110,215,.58)","rgba(180,125,55,.50)","rgba(70,120,218,.54)","rgba(160,110,48,.44)"];
  const crownFill=["rgba(238,247,255,.82)","rgba(200,222,255,.62)","rgba(222,240,255,.76)","rgba(210,232,255,.66)","rgba(246,252,255,.88)","rgba(216,234,255,.72)","rgba(232,244,255,.80)","rgba(205,227,255,.66)"];

  return (
    <div style={{filter:`sepia(1) saturate(${sat}) hue-rotate(${rot}deg) brightness(${bri})`,transform:`scale(${sc})`,transformOrigin:"center",transition:"all 0.3s ease",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <svg viewBox="0 0 130 108" width="40" height="34" style={{overflow:"visible"}}>
        <defs>
          <radialGradient id="dg-int" cx="48%" cy="42%" r="62%">
            <stop offset="0%"   stopColor="#0f1f72"/>
            <stop offset="18%"  stopColor="#1a5ccb"/>
            <stop offset="42%"  stopColor="#c89032"/>
            <stop offset="62%"  stopColor="#c03012"/>
            <stop offset="82%"  stopColor="#1038a2"/>
            <stop offset="100%" stopColor="#080f42"/>
          </radialGradient>
        </defs>
        {/* Pavilion: 8 triangles from girdle → culet */}
        {Array.from({length:8},(_,i)=>(
          <polygon key={`pf${i}`} points={pts([gp[i],gp[(i+1)%8],CULET])} fill={pavFill[i]} stroke="rgba(255,255,255,.20)" strokeWidth="0.4"/>
        ))}
        {/* Girdle band */}
        <ellipse cx={CX} cy={GCY} rx={GRX} ry={GRY} fill="rgba(210,228,255,.28)" stroke="rgba(255,255,255,.52)" strokeWidth="0.9"/>
        {/* Crown bezel facets: tp[i] → tp[i+1] → gp[i+1] */}
        {Array.from({length:8},(_,i)=>(
          <polygon key={`cf${i}`} points={pts([tp[i],tp[(i+1)%8],gp[(i+1)%8]])} fill={crownFill[i]} stroke="rgba(255,255,255,.26)" strokeWidth="0.4"/>
        ))}
        {/* Table face (octagonal) with internal refraction */}
        <polygon points={pts(tp)} fill="url(#dg-int)" stroke="rgba(255,255,255,.52)" strokeWidth="0.7"/>
        {/* Star facet lines */}
        {tp.map((p,i)=>(
          <line key={`tl${i}`} x1={p[0]} y1={p[1]} x2={CX} y2={TCY} stroke="rgba(255,255,255,.16)" strokeWidth="0.3"/>
        ))}
        {/* Specular highlights */}
        <ellipse cx={44} cy={10} rx={11} ry={3.5} fill="rgba(255,255,255,.68)" transform="rotate(-22,44,10)"/>
        <ellipse cx={90} cy={16} rx={8}  ry={2.5} fill="rgba(255,255,255,.42)" transform="rotate(14,90,16)"/>
        <circle  cx={29} cy={21} r={2.2} fill="rgba(255,255,255,.32)"/>
      </svg>
    </div>
  );
}

/* ── Emotion character SVGs ── */
function EmoChar({ id, sel, col, night, bare }: {
  id: string; sel: boolean; col: string; night: boolean; bare?: boolean;
}) {
  const chars: Record<string, React.ReactNode> = {
    Happy: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <circle cx="30" cy="22" r="20" fill="#F9A825" />
        <circle cx="30" cy="22" r="20" fill="url(#hSunLH)" opacity="0.3" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <line key={a} x1={30 + 22 * Math.cos(a * Math.PI / 180)} y1={22 + 22 * Math.sin(a * Math.PI / 180)} x2={30 + 28 * Math.cos(a * Math.PI / 180)} y2={22 + 28 * Math.sin(a * Math.PI / 180)} stroke="#F9A825" strokeWidth="2.5" strokeLinecap="round" />)}
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
        {[...Array(5)].map((_, i) => <circle key={i} cx={14 + i * 8} cy={52 + Math.sin(i) * 3} r="3" fill="#80CBC4" opacity="0.7" />)}
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
        {[...Array(8)].map((_, i) => { const a = i * 45 * Math.PI / 180; return <line key={i} x1={30 + 22 * Math.cos(a)} y1={26 + 22 * Math.sin(a)} x2={30 + 27 * Math.cos(a)} y2={26 + 27 * Math.sin(a)} stroke="#E8883A" strokeWidth="3" strokeLinecap="round" /> })}
        <circle cx="23" cy="23" r="3" fill="#7A3000" /><circle cx="37" cy="23" r="3" fill="#7A3000" />
        <path d="M23 33 Q27 31 30 33 Q33 31 37 33" fill="none" stroke="#7A3000" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 17 L28 21M32 21 L36 17" stroke="#C0601A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    Excited: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <circle cx="30" cy="24" r="20" fill="#FFB300" />
        {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map(a => <line key={a} x1={30 + 22 * Math.cos(a * Math.PI / 180)} y1={24 + 22 * Math.sin(a * Math.PI / 180)} x2={30 + 29 * Math.cos(a * Math.PI / 180)} y2={24 + 29 * Math.sin(a * Math.PI / 180)} stroke="#FF8F00" strokeWidth="2.5" strokeLinecap="round" />)}
        <circle cx="23" cy="20" r="3" fill="#5D3A00" /><circle cx="37" cy="20" r="3" fill="#5D3A00" />
        <circle cx="24" cy="19" r="1.2" fill="#fff" /><circle cx="38" cy="19" r="1.2" fill="#fff" />
        <path d="M20 28 Q25 36 30 28 Q35 36 40 28" fill="#FF8F00" stroke="#5D3A00" strokeWidth="1.5" />
        <circle cx="30" cy="31" r="2" fill="#5D3A00" />
      </svg>
    ),
  };

  /* bare mode: just the SVG, no card chrome */
  if (bare) return <>{chars[id]}</>;

  const bg = sel ? (night ? "rgba(45,175,175,0.18)" : "rgba(255,220,120,0.18)") : (night ? "rgba(5,22,28,0.88)" : "rgba(30,18,4,0.84)");
  const bdr = sel ? col : (night ? "rgba(45,175,175,0.35)" : "rgba(200,150,40,0.38)");
  const txt = sel ? col : (night ? "#B8E0E0" : "#E8D5A0");
  const radBdr = sel ? col : (night ? "rgba(45,175,175,0.55)" : "rgba(210,145,10,0.55)");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", userSelect: "none", padding: "10px 6px 8px", borderRadius: 14, background: bg, border: "2px solid " + bdr, transition: "all 0.15s", transform: sel ? "scale(1.06)" : "scale(1)", boxShadow: sel ? "0 0 16px " + col + "66" : "none", width: "100%" }}>
      {chars[id]}
      <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "var(--font-baloo)", color: txt, textAlign: "center", lineHeight: 1 }}>{id}</span>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid " + radBdr, background: sel ? col : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", marginTop: 2 }}>
        {sel && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function TreasureBoxPage() {
  const router = useRouter();
  const isNight = isNightTime();
  const bgVideoSrc = isNight ? "/treasure-box/Treasure_night.mp4" : "/treasure-box/Treasure_day.mp4";
  const bgImg = isNight ? "/treasure-box/treasure_night.png" : "/treasure-box/treasure_day.png";

  /* theme */
  const overlay = isNight ? "rgba(2,14,18,0.62)" : "rgba(12,7,2,0.52)";
  const panelBg = isNight ? "rgba(5,22,28,0.88)" : "rgba(30,18,4,0.84)";
  const panelBdr = isNight ? "rgba(45,175,175,0.35)" : "rgba(200,150,40,0.38)";
  const accent = isNight ? "#3ECFCF" : "#D4920A";
  const titleClr = isNight ? "#7EEAEA" : "#F0C040";
  const bodyClr = isNight ? "#B8E0E0" : "#E8D5A0";
  const btnBg = isNight ? "linear-gradient(135deg,#0E6060,#1CAAAA)" : "linear-gradient(135deg,#8B5A00,#D4920A)";
  const btnShadow = isNight ? "0 4px 22px rgba(40,160,160,0.55)" : "0 4px 22px rgba(180,110,0,0.55)";
  const headerGlow = isNight ? "0 0 22px rgba(50,200,200,0.8)" : "0 0 22px rgba(220,160,20,0.8)";

  /* state */
  const [videoReady, setVideoReady] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const [screen, setScreen] = useState<"main" | "success">("main");
  /* emotions: label → intensity 0-100 */
  const [emotions, setEmotions] = useState<Record<string, number>>({});

  const toggleEmotion = (label: string) =>
    setEmotions(prev => {
      const next = { ...prev };
      if (label in next) delete next[label];
      else next[label] = 50;
      return next;
    });

  const setIntensity = (label: string, val: number) =>
    setEmotions(prev => ({ ...prev, [label]: val }));

  const canDone      = Object.keys(emotions).length > 0;
  const selectedList = FEELINGS_EMOTIONS.filter(e => e.label in emotions);

  /* ── intro video ── */
  if (!videoReady) return (
    <div style={{ position: "fixed", inset: 0, background: "#000", overflow: "hidden" }}>
      <video key={bgVideoSrc} src={bgVideoSrc} autoPlay muted playsInline
        onEnded={() => { setVideoFading(true); setTimeout(() => setVideoReady(true), 900); }}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "112%", objectFit: "cover", objectPosition: "center top" }} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: videoFading ? 1 : 0, transition: videoFading ? "opacity 0.9s ease" : "none", pointerEvents: "none" }} />
    </div>
  );

  /* ── success screen ── */
  if (screen === "success") return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-nunito)" }}>
      <img src={bgImg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, background: overlay, zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <style>{`
          @keyframes gemPop{0%{transform:scale(0.4) rotate(-15deg);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1);opacity:1}}
          @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        `}</style>
        <div style={{ fontSize: 64, animation: "gemPop 0.7s cubic-bezier(.36,.07,.19,.97) both", marginBottom: 20 }}>&#128142;</div>
        <div style={{ width: 140, height: 1.5, background: "linear-gradient(90deg,transparent," + accent + ",transparent)", marginBottom: 24, animation: "fadeUp 0.5s ease 0.3s both", opacity: 0 }} />
        <p style={{ fontFamily: "var(--font-playfair),Georgia,serif", fontSize: "clamp(22px,4vw,30px)", fontWeight: 700, color: "#FFF8E0", margin: "0 0 8px", animation: "fadeUp 0.5s ease 0.4s both", opacity: 0, textShadow: headerGlow }}>
          +{selectedList.length * 10} seeds added &#127807;
        </p>
        <p style={{ fontSize: 13, color: bodyClr, fontStyle: "italic", margin: "0 0 48px", animation: "fadeUp 0.5s ease 0.5s both", opacity: 0 }}>
          {selectedList.length === 1
            ? "You felt " + selectedList[0].label.toLowerCase() + " — and that matters."
            : "You felt so much today — and that matters."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, animation: "fadeUp 0.5s ease 0.6s both", opacity: 0 }}>
          <button onClick={() => router.push("/island")} style={{ padding: "13px 40px", borderRadius: 999, background: btnBg, border: "none", color: "#fff", fontFamily: "var(--font-baloo)", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: btnShadow, letterSpacing: "0.04em" }}>
            Return to Island &#8594;
          </button>
          <button onClick={() => { setScreen("main"); setEmotions({}); }} style={{ background: "none", border: "none", color: bodyClr + "99", fontSize: 13, cursor: "pointer", fontStyle: "italic", fontFamily: "var(--font-nunito)" }}>
            Check in again
          </button>
        </div>
      </div>
    </div>
  );

  /* ── main screen ── */
  return (
    <div style={{ position: "fixed", inset: 0, overflowY: "auto", fontFamily: "var(--font-nunito)" }}>
      <img src={bgImg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, background: overlay, zIndex: 1, pointerEvents: "none" }} />
      <style>{`
        @keyframes tbFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes rowSlide { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        html,body { background:url('${bgImg}') center top / cover no-repeat fixed; margin:0; }

        /* Done button */
        .fci-done-btn { width:100%; max-width:660px; padding:15px; border-radius:18px; border:none; background:${btnBg}; color:#fff; font-size:16px; font-weight:800; font-family:var(--font-baloo); cursor:pointer; box-shadow:${btnShadow}; letter-spacing:0.04em; animation:tbFadeIn 0.6s ease both; margin-top:4px; }
        .fci-done-btn:disabled { opacity:0.3; cursor:not-allowed; }

        /* Intensity slider */
        .fci-slider { -webkit-appearance:none; appearance:none; width:100%; height:5px; border-radius:3px; background:linear-gradient(to right, var(--ec) var(--pct), rgba(255,255,255,0.12) var(--pct)); outline:none; cursor:pointer; }
        .fci-slider::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:16px; height:16px; border-radius:50%; background:var(--ec); cursor:pointer; border:2.5px solid rgba(255,255,255,0.75); box-shadow:0 0 8px var(--ec); }
        .fci-slider::-moz-range-thumb { width:16px; height:16px; border-radius:50%; background:var(--ec); cursor:pointer; border:2.5px solid rgba(255,255,255,0.75); }

        /* Emotion grid */
        .fci-emo-row { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; width:100%; max-width:660px; }
        @media(max-width:480px){
          .fci-emo-row { gap:4px; }
          .fci-emo-row svg { width:36px !important; height:42px !important; }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 720, margin: "0 auto", padding: "16px 14px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, animation: "tbFadeIn 0.5s ease both" }}>

        {/* ── Header ── */}
        <div style={{ width: "100%", maxWidth: 660, display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
          <button onClick={() => router.push("/island")} style={{ width: 36, height: 36, borderRadius: "50%", background: panelBg, border: "1.5px solid " + panelBdr, color: titleClr, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>&#8592;</button>
          <h1 style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(18px,5vw,26px)", fontWeight: 900, color: "#FFF8E0", margin: 0, letterSpacing: "0.08em", textShadow: headerGlow, flex: 1, minWidth: 0, textAlign: "center" }}>FEELINGS CHECK IN</h1>
          <button style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(140,30,30,0.75)", border: "1.5px solid rgba(220,80,80,0.5)", color: "#FFB0A0", fontSize: 12, fontWeight: 900, cursor: "pointer", fontFamily: "var(--font-baloo)", letterSpacing: "0.05em", flexShrink: 0 }}>SOS</button>
        </div>

        {/* ── Subtitle / Intro Box ── */}
        <div style={{ 
          width: "100%", maxWidth: 660, 
          background: isNight ? "rgba(10,30,35,0.65)" : "rgba(45,25,10,0.55)", 
          backdropFilter: "blur(12px)", 
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid " + (isNight ? "rgba(45,175,175,0.25)" : "rgba(220,160,50,0.25)"),
          borderTop: "1px solid " + (isNight ? "rgba(100,220,220,0.4)" : "rgba(255,200,100,0.4)"),
          borderRadius: 24, 
          padding: "20px 24px", 
          display: "flex", 
          flexDirection: "column", 
          gap: 12, 
          boxShadow: isNight ? "0 12px 40px rgba(0,0,0,0.4)" : "0 12px 40px rgba(80,40,0,0.2)", 
          position: "relative", 
          overflow: "hidden" 
        }}>
          {/* Decorative glow */}
          <div style={{ position: "absolute", top: -40, left: -40, width: 120, height: 120, background: accent, filter: "blur(60px)", opacity: 0.15, pointerEvents: "none" }} />
          
          <h2 style={{ fontFamily: "var(--font-baloo)", fontSize: "clamp(20px, 4vw, 24px)", fontWeight: 900, margin: 0, letterSpacing: "0.02em", background: isNight ? "linear-gradient(to right, #7EEAEA, #B8E0E0)" : "linear-gradient(to right, #F0C040, #FFE080)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Yayyy... we showed up today! &#10024;
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative", zIndex: 1 }}>
            <p style={{ fontSize: 15, color: isNight ? "#E0F5F5" : "#FFF8E0", margin: 0, fontWeight: 700, letterSpacing: "0.01em" }}>
              Select all the feelings you experienced today.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: isNight ? "rgba(45,175,175,0.12)" : "rgba(220,160,50,0.12)", padding: "10px 14px", borderRadius: 14, border: "1px dashed " + (isNight ? "rgba(45,175,175,0.4)" : "rgba(220,160,50,0.4)"), width: "fit-content" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: accent, color: isNight ? "#0A2828" : "#2A1800", fontSize: 12, fontWeight: 900 }}>↓</div>
              <p style={{ fontSize: 14, color: bodyClr, margin: 0, fontWeight: 600, fontStyle: "italic" }}>
                Then, gently slide to show how deeply you felt each one
              </p>
            </div>
          </div>
        </div>

        {/* ── All emotions grid (multi-select) ── */}
        <div className="fci-emo-row">
          {FEELINGS_EMOTIONS.slice(0, 5).map(em => (
            <div key={em.label} onClick={() => toggleEmotion(em.label)} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <EmoChar id={em.label} sel={em.label in emotions} col={em.col} night={isNight} />
            </div>
          ))}
        </div>
        <div className="fci-emo-row">
          {FEELINGS_EMOTIONS.slice(5, 10).map(em => (
            <div key={em.label} onClick={() => toggleEmotion(em.label)} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <EmoChar id={em.label} sel={em.label in emotions} col={em.col} night={isNight} />
            </div>
          ))}
        </div>

        {/* ── Detail table ── */}
        <div style={{ width: "100%", maxWidth: 660, borderRadius: 16, overflow: "hidden", border: "1.5px solid " + panelBdr }}>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 58px 1fr 44px", alignItems: "center", padding: "8px 14px", gap: 8, background: isNight ? "rgba(3,18,22,0.95)" : "rgba(20,12,2,0.95)", borderBottom: "1px solid " + panelBdr }}>
            {(["Emotion", "Expr", "Intensity", "Gem"] as const).map((h, i) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 800, fontFamily: "var(--font-baloo)", letterSpacing: "0.1em", color: "#ffffff", textAlign: i === 0 ? "left" : "center" }}>{h}</span>
            ))}
          </div>

          {/* Empty state */}
          {selectedList.length === 0 && (
            <div style={{ padding: "22px 14px", textAlign: "center", background: panelBg }}>
              <p style={{ color: bodyClr + "44", fontSize: 13, fontStyle: "italic", margin: 0 }}>Select feelings above ↑</p>
            </div>
          )}

          {/* One row per selected emotion */}
          {selectedList.map((em, i) => {
            const pct = emotions[em.label];
            return (
              <div key={em.label} style={{ display: "grid", gridTemplateColumns: "1fr 58px 1fr 44px", alignItems: "center", padding: "12px 14px", gap: 8, borderTop: "1px solid " + panelBdr + "88", background: i % 2 === 1 ? "rgba(255,255,255,0.025)" : panelBg, animation: "rowSlide 0.25s ease both" }}>
                {/* Emotion name */}
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: em.col, flexShrink: 0, boxShadow: "0 0 6px " + em.col + "99" }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: bodyClr, fontFamily: "var(--font-baloo)" }}>{em.label}</span>
                </div>
                {/* Expression */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50, overflow: "hidden" }}>
                  <div style={{ transform: "scale(0.78)", transformOrigin: "center" }}>
                    <EmoChar id={em.label} sel={true} col={em.col} night={isNight} bare />
                  </div>
                </div>
                {/* Intensity slider */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <input
                    type="range" min={0} max={100} value={pct}
                    onChange={e => setIntensity(em.label, +e.target.value)}
                    className="fci-slider"
                    style={{ "--ec": em.col, "--pct": pct + "%" } as React.CSSProperties}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 9, color: bodyClr + "50", fontStyle: "italic" }}>a little</span>
                    <span style={{ fontSize: 9, color: bodyClr + "50", fontStyle: "italic" }}>a lot</span>
                  </div>
                </div>
                {/* Gem */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <GemIcon col={em.col} intensity={pct} />
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ fontSize: 11, color: bodyClr + "55", fontStyle: "italic", textAlign: "center", margin: "4px 0 0", maxWidth: 400 }}>
          It&apos;s okay to feel what you feel. You are not alone. &#128156;
        </p>

        <button className="fci-done-btn" disabled={!canDone} onClick={() => setScreen("success")}>
          Done
        </button>

      </div>
    </div>
  );
}
