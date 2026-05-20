"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 5 || h >= 17;
}

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const FEELINGS_EMOTIONS = [
  { label: "Happy",    col: "#F9A825" },
  { label: "Angry",    col: "#E53935" },
  { label: "Calm",     col: "#4DB6AC" },
  { label: "Sad",      col: "#5C8DB8" },
  { label: "Worried",  col: "#7B68C8" },
  { label: "Silly",    col: "#BA68C8" },
  { label: "Tired",    col: "#607D8B" },
  { label: "Confused", col: "#9C7B3A" },
  { label: "Anxious",  col: "#E8883A" },
  { label: "Excited",  col: "#FFB300" },
];

const FEELING_TYPES = ["Wobbly","Frustrating","Exciting","Scary","Confusing","Warm","Fun"];

/* ═══════════════════════════════════════════════
   EmoChar
═══════════════════════════════════════════════ */
function EmoChar({ id, sel, col }: { id: string; sel: boolean; col: string }) {
  const chars: Record<string, React.ReactNode> = {
    Happy: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <circle cx="30" cy="22" r="20" fill="#F9A825"/>
        <circle cx="30" cy="22" r="20" fill="url(#hSunLH)" opacity="0.3"/>
        {[0,45,90,135,180,225,270,315].map(a=><line key={a} x1={30+22*Math.cos(a*Math.PI/180)} y1={22+22*Math.sin(a*Math.PI/180)} x2={30+28*Math.cos(a*Math.PI/180)} y2={22+28*Math.sin(a*Math.PI/180)} stroke="#F9A825" strokeWidth="2.5" strokeLinecap="round"/>)}
        <circle cx="23" cy="19" r="2.5" fill="#5D3A00"/><circle cx="37" cy="19" r="2.5" fill="#5D3A00"/>
        <path d="M22 27 Q30 34 38 27" fill="none" stroke="#5D3A00" strokeWidth="2" strokeLinecap="round"/>
        <defs><radialGradient id="hSunLH"><stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#F9A825" stopOpacity="0"/></radialGradient></defs>
      </svg>
    ),
    Angry: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="22" fill="#E53935"/>
        <path d="M8 10 Q14 5 20 12" fill="none" stroke="#B71C1C" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M40 12 Q46 5 52 10" fill="none" stroke="#B71C1C" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="22" cy="23" r="3" fill="#4A0000"/><circle cx="38" cy="23" r="3" fill="#4A0000"/>
        <path d="M22 34 Q30 29 38 34" fill="none" stroke="#4A0000" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M18 17 L26 21M34 21 L42 17" stroke="#B71C1C" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    Calm: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="22" fill="#4DB6AC"/>
        <circle cx="23" cy="24" r="2.5" fill="#00332E"/><circle cx="37" cy="24" r="2.5" fill="#00332E"/>
        <path d="M23 33 Q30 37 37 33" fill="none" stroke="#00332E" strokeWidth="2" strokeLinecap="round"/>
        <path d="M15 18 Q22 14 26 20M34 20 Q38 14 45 18" fill="none" stroke="#26A69A" strokeWidth="1.5"/>
        {[...Array(5)].map((_,i)=><circle key={i} cx={14+i*8} cy={52+Math.sin(i)*3} r="3" fill="#80CBC4" opacity="0.7"/>)}
      </svg>
    ),
    Sad: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="19" ry="22" fill="#5C8DB8"/>
        <circle cx="23" cy="22" r="2.5" fill="#1A3A5A"/><circle cx="37" cy="22" r="2.5" fill="#1A3A5A"/>
        <path d="M22 33 Q30 29 38 33" fill="none" stroke="#1A3A5A" strokeWidth="2" strokeLinecap="round"/>
        <ellipse cx="22" cy="22" rx="4" ry="5" fill="#90CAF9" opacity="0.4"/>
        <ellipse cx="38" cy="22" rx="4" ry="5" fill="#90CAF9" opacity="0.4"/>
        <path d="M24 26 Q24 36 22 40M36 26 Q36 36 38 40" stroke="#90CAF9" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    Worried: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="21" fill="#7B68C8"/>
        <circle cx="23" cy="23" r="2.5" fill="#1A0050"/><circle cx="37" cy="23" r="2.5" fill="#1A0050"/>
        <path d="M22 33 Q30 30 38 33" fill="none" stroke="#1A0050" strokeWidth="2" strokeLinecap="round"/>
        <path d="M19 16 Q22 12 26 16M34 16 Q38 12 41 16" fill="none" stroke="#5548A0" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26 16 Q30 14 34 16" stroke="#9C8FE0" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    Silly: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="20" ry="21" fill="#BA68C8"/>
        <circle cx="23" cy="21" r="3" fill="#4A0060"/><circle cx="37" cy="21" r="3" fill="#4A0060"/>
        <circle cx="24" cy="20" r="1" fill="#fff"/><circle cx="38" cy="20" r="1" fill="#fff"/>
        <path d="M20 30 Q25 38 30 30 Q35 38 40 30" fill="#CE93D8" stroke="#4A0060" strokeWidth="1.5"/>
        <circle cx="22" cy="27" r="5" fill="#F48FB1" opacity="0.7"/>
        <circle cx="38" cy="27" r="5" fill="#F48FB1" opacity="0.7"/>
        <circle cx="30" cy="38" r="3" fill="#4A0060"/>
      </svg>
    ),
    Tired: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <ellipse cx="30" cy="26" rx="19" ry="22" fill="#607D8B"/>
        <path d="M19 21 Q23 19 27 21" fill="none" stroke="#263238" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M33 21 Q37 19 41 21" fill="none" stroke="#263238" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M23 33 Q30 30 37 33" fill="none" stroke="#263238" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 12 Q18 8 20 14M40 14 Q42 8 46 12" stroke="#546E7A" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <circle cx="30" cy="52" r="8" fill="#78909C" opacity="0.6"/>
      </svg>
    ),
    Confused: (
      <svg viewBox="0 0 60 70" width="54" height="63">
        <path d="M30 6 L54 24 L44 52 L16 52 L6 24Z" fill="#9C7B3A"/>
        <path d="M30 6 L54 24 L44 52 L16 52 L6 24Z" fill="url(#confGradLH)" opacity="0.4"/>
        <circle cx="23" cy="28" r="2.5" fill="#3E2000"/><circle cx="37" cy="28" r="2.5" fill="#3E2000"/>
        <path d="M24 38 Q30 35 36 38" fill="none" stroke="#3E2000" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 10 Q36 6 38 12" fill="none" stroke="#C9A050" strokeWidth="2" strokeLinecap="round"/>
        <text x="33" y="13" fontSize="8" fill="#C9A050" fontWeight="bold">?</text>
        <defs><linearGradient id="confGradLH" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#9C7B3A" stopOpacity="0"/></linearGradient></defs>
      </svg>
    ),
    Anxious: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <ellipse cx="30" cy="26" rx="20" ry="21" fill="#E8883A"/>
        {[...Array(8)].map((_,i)=>{const a=i*45*Math.PI/180;return <line key={i} x1={30+22*Math.cos(a)} y1={26+22*Math.sin(a)} x2={30+27*Math.cos(a)} y2={26+27*Math.sin(a)} stroke="#E8883A" strokeWidth="3" strokeLinecap="round"/>})}
        <circle cx="23" cy="23" r="3" fill="#7A3000"/><circle cx="37" cy="23" r="3" fill="#7A3000"/>
        <path d="M23 33 Q27 31 30 33 Q33 31 37 33" fill="none" stroke="#7A3000" strokeWidth="2" strokeLinecap="round"/>
        <path d="M24 17 L28 21M32 21 L36 17" stroke="#C0601A" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    Excited: (
      <svg viewBox="0 0 60 70" width="54" height="63" suppressHydrationWarning>
        <circle cx="30" cy="24" r="20" fill="#FFB300"/>
        {[0,36,72,108,144,180,216,252,288,324].map(a=><line key={a} x1={30+22*Math.cos(a*Math.PI/180)} y1={24+22*Math.sin(a*Math.PI/180)} x2={30+29*Math.cos(a*Math.PI/180)} y2={24+29*Math.sin(a*Math.PI/180)} stroke="#FF8F00" strokeWidth="2.5" strokeLinecap="round"/>)}
        <circle cx="23" cy="20" r="3" fill="#5D3A00"/><circle cx="37" cy="20" r="3" fill="#5D3A00"/>
        <circle cx="24" cy="19" r="1.2" fill="#fff"/><circle cx="38" cy="19" r="1.2" fill="#fff"/>
        <path d="M20 28 Q25 36 30 28 Q35 36 40 28" fill="#FF8F00" stroke="#5D3A00" strokeWidth="1.5"/>
        <circle cx="30" cy="31" r="2" fill="#5D3A00"/>
      </svg>
    ),
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, cursor:"pointer", userSelect:"none", padding:"12px 8px 10px", borderRadius:16, background: sel ? "rgba(255,255,255,0.13)" : "rgba(22,12,50,0.85)", border: sel ? `2px solid ${col}` : "2px solid transparent", transition:"all 0.15s", transform: sel ? "scale(1.06)" : "scale(1)", boxShadow: sel ? `0 0 18px ${col}55` : "none" }}>
      {chars[id]}
      <span style={{ fontSize:11, fontWeight:700, fontFamily:"var(--font-baloo)", color: sel ? col : "#C4B5FD", textAlign:"center", lineHeight:1 }}>{id}</span>
      <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${sel ? col : "rgba(167,139,250,0.45)"}`, background: sel ? col : "transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s", marginTop:2 }}>
        {sel && <div style={{ width:7, height:7, borderRadius:"50%", background:"#fff" }}/>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BodySilhouette
═══════════════════════════════════════════════ */
function BodySilhouette({ selected, onSelect }: { selected: string|null; onSelect:(s:string)=>void }) {
  const parts = [
    { id:"Head",    label:"Head"    },
    { id:"Chest",   label:"Chest"   },
    { id:"Stomach", label:"Stomach" },
    { id:"Arms",    label:"Arms"    },
    { id:"Legs",    label:"Legs"    },
  ];
  return (
    <div style={{ display:"flex", gap:14, alignItems:"center" }}>
      <svg viewBox="0 0 70 240" width="60" height="205" style={{ flexShrink:0 }}>
        <ellipse cx="35" cy="26" rx="16" ry="18" fill={selected==="Head" ? "#8B5CF6" : "#4B3080"} opacity={selected==="Head" ? 1 : 0.7}/>
        <rect x="30" y="42" width="10" height="10" rx="4" fill={selected==="Chest" ? "#8B5CF6" : "#4B3080"} opacity="0.7"/>
        <rect x="20" y="52" width="30" height="55" rx="8" fill={selected==="Chest"||selected==="Stomach" ? "#8B5CF6" : "#4B3080"} opacity={selected==="Chest"||selected==="Stomach" ? 1 : 0.7}/>
        <rect x="4"  y="55" width="14" height="44" rx="7" fill={selected==="Arms" ? "#8B5CF6" : "#4B3080"} opacity={selected==="Arms" ? 1 : 0.7}/>
        <rect x="52" y="55" width="14" height="44" rx="7" fill={selected==="Arms" ? "#8B5CF6" : "#4B3080"} opacity={selected==="Arms" ? 1 : 0.7}/>
        <rect x="20" y="108" width="13" height="65" rx="7" fill={selected==="Legs" ? "#8B5CF6" : "#4B3080"} opacity={selected==="Legs" ? 1 : 0.7}/>
        <rect x="37" y="108" width="13" height="65" rx="7" fill={selected==="Legs" ? "#8B5CF6" : "#4B3080"} opacity={selected==="Legs" ? 1 : 0.7}/>
        {selected==="Head"    && <circle cx="35" cy="26"  r="6" fill="#C4B5FD" opacity="0.7"/>}
        {selected==="Chest"   && <circle cx="35" cy="68"  r="6" fill="#C4B5FD" opacity="0.7"/>}
        {selected==="Stomach" && <circle cx="35" cy="95"  r="6" fill="#C4B5FD" opacity="0.7"/>}
        {selected==="Arms"    && <><circle cx="11" cy="77" r="5" fill="#C4B5FD" opacity="0.7"/><circle cx="59" cy="77" r="5" fill="#C4B5FD" opacity="0.7"/></>}
        {selected==="Legs"    && <><circle cx="26" cy="140" r="5" fill="#C4B5FD" opacity="0.7"/><circle cx="44" cy="140" r="5" fill="#C4B5FD" opacity="0.7"/></>}
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {parts.map(p => (
          <div key={p.id} onClick={() => onSelect(p.id)} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", userSelect:"none" }}>
            <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${selected===p.id ? "#A78BFA" : "rgba(167,139,250,0.4)"}`, background: selected===p.id ? "#7C3AED" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}>
              {selected===p.id && <div style={{ width:7, height:7, borderRadius:"50%", background:"#fff" }}/>}
            </div>
            <span style={{ fontSize:14, color: selected===p.id ? "#E9D5FF" : "#C4B5FD", fontWeight: selected===p.id ? 700 : 500 }}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Thermometer
═══════════════════════════════════════════════ */
function Thermometer({ level, onSelect }: { level:number|null; onSelect:(n:number)=>void }) {
  const getCol = (n: number) => {
    const t = (n-1)/9;
    if (t < 0.5) { const r=Math.round(t*2*255); return `rgb(${r},200,80)`; }
    else { const t2=(t-0.5)*2; return `rgb(255,${Math.round(200-t2*160)},${Math.round(80-t2*70)})`; }
  };
  const filled = level ?? 0;
  const updateLevel = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let n = Math.round((164 - y) / 16);
    if (n < 1) n=1; if (n > 10) n=10;
    if (n !== level) onSelect(n);
  };
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => { e.currentTarget.setPointerCapture(e.pointerId); updateLevel(e); };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) updateLevel(e); };
  const handlePointerUp   = (e: React.PointerEvent<HTMLDivElement>) => { try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {} };
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:10 }}>
      <div style={{ position:"relative", width:28, height:200, flexShrink:0, cursor:"pointer", touchAction:"none" }}
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}>
        <div style={{ position:"absolute", bottom:14, left:4, width:20, borderRadius:"10px 10px 0 0", background:"rgba(255,255,255,0.08)", border:"1.5px solid rgba(200,180,255,0.3)", height:175, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:14, left:6, width:16, borderRadius:"8px 8px 0 0", background:`linear-gradient(to top,#4CAF50,#FFEB3B 50%,#F44336)`, height: filled>0 ? `${(filled/10)*160}px` : "0px", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:26, height:26, borderRadius:"50%", background: filled>0 ? getCol(filled) : "#4B3080", border:"2px solid rgba(200,180,255,0.4)", pointerEvents:"none" }}/>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {[10,9,8,7,6,5,4,3,2,1].map(n => (
          <div key={n} onClick={() => onSelect(level===n ? 0 : n)}
            style={{ width:32, height:16, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", borderRadius:4, background: level!==null && n<=level ? getCol(n) : "transparent", color: level!==null && n<=level ? "#1a0030" : "rgba(200,180,255,0.6)", fontSize:11, fontWeight:700, fontFamily:"var(--font-baloo)", transition:"all 0.15s", border: level===n ? "1.5px solid #fff" : "1px solid transparent" }}>
            {n}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function TreasureBoxPage() {
  const router   = useRouter();
  const isNight  = isNightTime();
  const bgVideoSrc = isNight ? "/treasure-box/Treasure_night.mp4" : "/treasure-box/Treasure_day.mp4";

  const [videoReady,  setVideoReady]  = useState(false);
  const [videoFading, setVideoFading] = useState(false);

  const [screen,    setScreen]    = useState<"main"|"success">("main");
  const [emotion,   setEmotion]   = useState<string|null>(null);
  const [bodyPart,  setBodyPart]  = useState<string|null>(null);
  const [feelType,  setFeelType]  = useState<string|null>(null);
  const [level,     setLevel]     = useState<number|null>(null);

  const canDone  = emotion !== null;
  const selDef   = FEELINGS_EMOTIONS.find(e => e.label === emotion);

  /* ── VIDEO INTRO ── */
  if (!videoReady) return (
    <div style={{ position:"fixed", inset:0, background:"#000" }}>
      <video
        key={bgVideoSrc}
        src={bgVideoSrc}
        autoPlay muted playsInline
        onEnded={() => { setVideoFading(true); setTimeout(() => setVideoReady(true), 900); }}
        style={{ width:"100%", height:"100%", objectFit:"cover" }}
      />
      <div style={{ position:"absolute", inset:0, background:"#000", opacity: videoFading ? 1 : 0, transition: videoFading ? "opacity 0.9s ease" : "none", pointerEvents:"none" }}/>
    </div>
  );

  /* ── SUCCESS (5.1) ── */
  if (screen === "success") return (
    <div style={{ position:"fixed", inset:0, background:"linear-gradient(160deg,#0E0820 0%,#1A0C38 50%,#0A1828 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-nunito)" }}>
      <style>{`
        @keyframes gemPop{0%{transform:scale(0.4) rotate(-15deg);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{ fontSize:64, animation:"gemPop 0.7s cubic-bezier(.36,.07,.19,.97) both", marginBottom:20 }}>💎</div>
      <div style={{ width:120, height:1.5, background:"linear-gradient(90deg,transparent,rgba(139,92,246,0.7),transparent)", marginBottom:24, animation:"fadeUp 0.5s ease 0.3s both", opacity:0 }}/>
      <p style={{ fontFamily:"var(--font-playfair), Georgia, serif", fontSize:"clamp(22px,4vw,30px)", fontWeight:700, color:"#EDE9FE", margin:"0 0 8px", animation:"fadeUp 0.5s ease 0.4s both", opacity:0 }}>
        +10 seeds added 🌱
      </p>
      <p style={{ fontSize:13, color:"rgba(196,181,253,0.6)", fontStyle:"italic", margin:"0 0 48px", animation:"fadeUp 0.5s ease 0.5s both", opacity:0 }}>
        {selDef ? `You felt ${selDef.label.toLowerCase()} — and that matters.` : "You showed up — that takes courage."}
      </p>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, animation:"fadeUp 0.5s ease 0.6s both", opacity:0 }}>
        <button onClick={() => router.push("/island")} style={{ padding:"13px 40px", borderRadius:999, background:"linear-gradient(135deg,#6D28D9,#A855F7)", border:"none", color:"#fff", fontFamily:"var(--font-baloo)", fontWeight:800, fontSize:15, cursor:"pointer", boxShadow:"0 6px 24px rgba(109,40,217,0.5)", letterSpacing:"0.04em" }}>
          Return to Island →
        </button>
        <button onClick={() => { setScreen("main"); setEmotion(null); setBodyPart(null); setFeelType(null); setLevel(null); }} style={{ background:"none", border:"none", color:"rgba(167,139,250,0.45)", fontSize:13, cursor:"pointer", fontStyle:"italic", fontFamily:"var(--font-nunito)" }}>
          Check in again
        </button>
      </div>
    </div>
  );

  /* ── MAIN (5.0) ── */
  return (
    <div style={{ position:"fixed", inset:0, background:"linear-gradient(160deg,#080418 0%,#110830 50%,#080C24 100%)", overflowY:"auto", fontFamily:"var(--font-nunito)" }}>
      <style>{`
        @keyframes tbFadeIn { from{opacity:0} to{opacity:1} }
        .fci-emo-row { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; width:100%; max-width:660px; }
        @media(max-width:500px){ .fci-emo-row { grid-template-columns:repeat(4,1fr); gap:6px; } }
        .fci-mid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; width:100%; max-width:660px; }
        @media(max-width:560px){ .fci-mid { grid-template-columns:1fr 1fr; } }
        @media(max-width:380px){ .fci-mid { grid-template-columns:1fr; } }
        .fci-panel { background:rgba(18,8,46,0.9); border:1.5px solid rgba(139,92,246,0.3); border-radius:18px; padding:16px 14px; }
        .fci-panel-title { font-size:10px; font-weight:800; color:#A78BFA; text-transform:uppercase; letter-spacing:0.1em; margin:0 0 14px; font-family:var(--font-baloo); text-align:center; }
        .fci-radio-row { display:flex; align-items:center; gap:10px; cursor:pointer; margin-bottom:10px; user-select:none; }
        .fci-radio { width:16px; height:16px; border-radius:50%; border:2px solid rgba(167,139,250,0.5); flex-shrink:0; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
        .fci-radio.on { border-color:#8B5CF6; background:#7C3AED; }
        .fci-done-btn { width:100%; max-width:660px; padding:15px; border-radius:18px; border:none; background:linear-gradient(135deg,#6D28D9,#A855F7); color:#fff; font-size:16px; font-weight:800; font-family:var(--font-baloo); cursor:pointer; box-shadow:0 4px 22px rgba(109,40,217,0.55); letter-spacing:0.04em; animation:tbFadeIn 0.6s ease both; }
        .fci-done-btn:disabled { opacity:0.3; cursor:not-allowed; }
      `}</style>

      <div style={{ width:"100%", maxWidth:720, margin:"0 auto", padding:"16px 14px 40px", display:"flex", flexDirection:"column", alignItems:"center", gap:12, animation:"tbFadeIn 0.5s ease both" }}>

        {/* Header */}
        <div style={{ width:"100%", maxWidth:660, display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
          <button onClick={() => router.push("/island")} style={{ width:36, height:36, borderRadius:"50%", background:"rgba(22,10,50,0.9)", border:"1.5px solid rgba(139,92,246,0.4)", color:"#C4B5FD", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</button>
          <h1 style={{ fontFamily:"var(--font-baloo)", fontSize:"clamp(18px,5vw,26px)", fontWeight:900, color:"#EDE9FE", margin:0, letterSpacing:"0.08em", textShadow:"0 0 20px rgba(139,92,246,0.7)" }}>FEELINGS CHECK IN</h1>
          <button style={{ marginLeft:"auto", padding:"6px 14px", borderRadius:20, background:"rgba(140,30,30,0.7)", border:"1.5px solid rgba(200,80,80,0.5)", color:"#FFAAAA", fontSize:12, fontWeight:900, cursor:"pointer", fontFamily:"var(--font-baloo)", letterSpacing:"0.05em", flexShrink:0 }}>SOS</button>
        </div>

        {/* Emotion rows */}
        <div className="fci-emo-row">
          {FEELINGS_EMOTIONS.slice(0,5).map(em => (
            <div key={em.label} onClick={() => setEmotion(emotion===em.label ? null : em.label)}>
              <EmoChar id={em.label} sel={emotion===em.label} col={em.col}/>
            </div>
          ))}
        </div>
        <div className="fci-emo-row">
          {FEELINGS_EMOTIONS.slice(5,10).map(em => (
            <div key={em.label} onClick={() => setEmotion(emotion===em.label ? null : em.label)}>
              <EmoChar id={em.label} sel={emotion===em.label} col={em.col}/>
            </div>
          ))}
        </div>

        {/* 3-panel section */}
        <div className="fci-mid">
          <div className="fci-panel">
            <p className="fci-panel-title">The feeling is in my</p>
            <BodySilhouette selected={bodyPart} onSelect={bp => setBodyPart(bodyPart===bp ? null : bp)}/>
          </div>
          <div className="fci-panel">
            <p className="fci-panel-title">This feeling feels</p>
            {FEELING_TYPES.map(ft => (
              <div key={ft} className="fci-radio-row" onClick={() => setFeelType(feelType===ft ? null : ft)}>
                <div className={`fci-radio${feelType===ft ? " on" : ""}`}>
                  {feelType===ft && <div style={{ width:6, height:6, borderRadius:"50%", background:"#fff" }}/>}
                </div>
                <span style={{ fontSize:13, color: feelType===ft ? "#EDE9FE" : "#C4B5FD", fontWeight: feelType===ft ? 700 : 400 }}>{ft}</span>
              </div>
            ))}
          </div>
          <div className="fci-panel">
            <p className="fci-panel-title">The feeling level is</p>
            <div style={{ display:"flex", justifyContent:"center" }}>
              <Thermometer level={level} onSelect={n => setLevel(n===0 ? null : n)}/>
            </div>
          </div>
        </div>

        <p style={{ fontSize:11, color:"rgba(124,106,160,0.7)", fontStyle:"italic", textAlign:"center", margin:"4px 0 8px", maxWidth:400 }}>
          It&apos;s okay to feel what you feel. You are not alone. 💜
        </p>

        <button className="fci-done-btn" disabled={!canDone} onClick={() => setScreen("success")}>
          Done ✓
        </button>
      </div>
    </div>
  );
}
