"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 5 || h >= 17;
}

const CRAYONS = [
  "#EE1111","#EE5511","#FF8C00","#FFAA00","#FFD700",
  "#99CC00","#22BB44","#00BBAA","#0099DD","#2255CC",
  "#7722CC","#CC22AA","#EE1177","#884422","#555555","#BBBBBB","#FFFFFF",
];
const SIZES = [3, 6, 11, 18];

/* ── crayon SVG ── */
function Crayon({ color, selected, onClick }: { color: string; selected: boolean; onClick: () => void }) {
  const darken = (hex: string) => {
    const r = Math.max(0, parseInt(hex.slice(1,3),16) - 50);
    const g = Math.max(0, parseInt(hex.slice(3,5),16) - 50);
    const b = Math.max(0, parseInt(hex.slice(5,7),16) - 50);
    return `rgb(${r},${g},${b})`;
  };
  return (
    <svg
      viewBox="0 0 22 90" width="22" height="90"
      style={{ cursor: "pointer", filter: selected ? "drop-shadow(0 0 6px rgba(255,255,255,0.9))" : "none",
               transform: selected ? "translateY(-8px)" : "translateY(0)", transition: "all 0.15s ease" }}
      onClick={onClick}
    >
      {/* Tip */}
      <polygon points="11,2 4,22 18,22" fill={darken(color)}/>
      {/* Body */}
      <rect x="4" y="22" width="14" height="52" fill={color}/>
      {/* Label band */}
      <rect x="4" y="52" width="14" height="10" fill="rgba(255,255,255,0.35)"/>
      {/* Base */}
      <rect x="4" y="74" width="14" height="8" rx="1" fill={darken(color)}/>
      {/* Shine */}
      <rect x="7" y="26" width="3" height="38" rx="1.5" fill="rgba(255,255,255,0.3)"/>
    </svg>
  );
}

/* ── colour wheel ── */
function ColorWheel({ onClick }: { onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ position: "relative", width: 68, height: 68, cursor: "pointer" }}>
      <div style={{
        width: 68, height: 68, borderRadius: "50%",
        background: "conic-gradient(red 0deg, #FF8C00 40deg, yellow 80deg, #88CC00 120deg, #00BB44 160deg, #00BBCC 200deg, blue 240deg, #8800CC 280deg, #CC0088 320deg, red 360deg)",
        boxShadow: "0 3px 12px rgba(0,0,0,0.35)",
      }}/>
      {/* White centre hole */}
      <div style={{ position: "absolute", top: "28%", left: "28%", width: "44%", height: "44%", borderRadius: "50%", background: "#fff" }}/>
    </div>
  );
}

/* ── draw on canvas ── */
function drawDailyImage(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#FFFEF5";
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2;
  ctx.strokeStyle = "#CCBBAA";
  ctx.lineWidth = 1.8;
  // Outer star spikes
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI * 2) / 12;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 145, cy + Math.sin(a) * 145);
    ctx.lineTo(cx + Math.cos(a) * 190, cy + Math.sin(a) * 190);
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, 145, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI * 2) / 8;
    const px = cx + Math.cos(a) * 88, py = cy + Math.sin(a) * 88;
    ctx.beginPath(); ctx.arc(px, py, 42, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, 96, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI * 2) / 8 + Math.PI / 8;
    const px = cx + Math.cos(a) * 50, py = cy + Math.sin(a) * 50;
    ctx.beginPath(); ctx.arc(px, py, 24, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(cx, cy, 48, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 20);
    ctx.lineTo(cx + Math.cos(a) * 48, cy + Math.sin(a) * 48);
    ctx.stroke();
  }
}

export default function PaintPage() {
  const router = useRouter();
  const isNight = isNightTime();
  const bgImg   = isNight ? "/school/School_night.png" : "/school/School_day.png";

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const colorRef   = useRef<HTMLInputElement>(null);
  const [tool, setTool]   = useState<"brush" | "eraser">("brush");
  const [color, setColor] = useState("#EE1111");
  const [size, setSize]   = useState(6);
  const isDown  = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    drawDailyImage(ctx, c.width, c.height);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const sx = c.width / rect.width, sy = c.height / rect.height;
    if ("touches" in e) {
      const t = e.touches[0];
      return { x: (t.clientX - rect.left) * sx, y: (t.clientY - rect.top) * sy };
    }
    const m = e as React.MouseEvent;
    return { x: (m.clientX - rect.left) * sx, y: (m.clientY - rect.top) * sy };
  };

  const paint = (ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    const col = tool === "eraser" ? "#FFFEF5" : color;
    const lw  = tool === "eraser" ? size * 3 : size;
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
    ctx.beginPath(); ctx.arc(from.x, from.y, lw / 2, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill();
  };

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); isDown.current = true;
    const pos = getPos(e); lastPos.current = pos;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) paint(ctx, pos, pos);
  };
  const onMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDown.current || !lastPos.current) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) paint(ctx, lastPos.current, pos);
    lastPos.current = pos;
  };
  const onUp = () => { isDown.current = false; lastPos.current = null; };

  const clearCanvas = () => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    drawDailyImage(ctx, c.width, c.height);
  };

  return (
    <div style={{
      minHeight: "100dvh",
      fontFamily: "var(--font-nunito)",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Room BG */}
      <img src={bgImg} alt="" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }} />

      {/* Main area: canvas + tools */}
      <div style={{ display: "flex", flex: 1, gap: 14, padding: "14px 14px 0", position: "relative", zIndex: 2, minHeight: 0 }}>

        {/* ── Canvas column ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          {/* Hanging Back sign */}
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: -4 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Hanging strings */}
              <div style={{ display: "flex", gap: 40, marginBottom: -1 }}>
                <div style={{ width: 2, height: 10, background: "#8B6020" }}/>
                <div style={{ width: 2, height: 10, background: "#8B6020" }}/>
              </div>
              <button
                onClick={() => router.push("/school")}
                style={{
                  padding: "8px 22px",
                  background: "linear-gradient(160deg,#C8853A,#8B5520)",
                  border: "3px solid #5A3010",
                  borderRadius: 10,
                  color: "#FFE8A0",
                  fontFamily: "var(--font-baloo)",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,220,100,0.3)",
                  letterSpacing: "0.02em",
                }}
              >
                ← Back
              </button>
            </div>
          </div>

          {/* Canvas paper */}
          <div style={{
            flex: 1,
            borderRadius: 12,
            overflow: "hidden",
            background: "#FFFEF5",
            boxShadow: "0 6px 28px rgba(0,0,0,0.45), inset 0 0 0 2px rgba(200,180,140,0.5)",
            cursor: tool === "eraser" ? "cell" : "crosshair",
            position: "relative",
          }}>
            {/* Corner pins */}
            {[{t:10,l:10},{t:10,r:10},{b:10,l:10},{b:10,r:10}].map((pos,i) => (
              <div key={i} style={{
                position:"absolute", width:10, height:10, borderRadius:"50%",
                background:"radial-gradient(circle at 35% 35%,#D0B060,#8B6020)",
                boxShadow:"0 1px 3px rgba(0,0,0,0.4)",
                top: pos.t, bottom: (pos as any).b, left: pos.l, right: (pos as any).r, zIndex:2,
              }}/>
            ))}
            <canvas
              ref={canvasRef}
              width={800} height={580}
              style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
              onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
              onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp}
            />
          </div>

          {/* Done button */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8 }}>
            <button
              onClick={() => router.push("/school/success")}
              style={{
                padding: "11px 48px",
                borderRadius: 999,
                background: "linear-gradient(135deg,#38C050,#28A040)",
                border: "3px solid #1A8030",
                color: "#fff",
                fontFamily: "var(--font-baloo)",
                fontWeight: 800,
                fontSize: 17,
                cursor: "pointer",
                boxShadow: "0 4px 18px rgba(40,160,60,0.6)",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
                <circle cx="10" cy="10" r="9" fill="rgba(255,255,255,0.25)"/>
                <path d="M5 10.5 L8.5 14 L15 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Done
            </button>
          </div>
        </div>

        {/* ── Tools panel ── */}
        <div style={{
          width: "clamp(130px,20vw,180px)",
          background: "linear-gradient(160deg,#FFF8E0,#FFF0C0)",
          borderRadius: 16,
          border: "10px solid #8B5520",
          boxShadow: "0 0 0 2px #A06030, 0 6px 24px rgba(0,0,0,0.4), inset 0 1px 8px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "14px 10px",
          gap: 0,
          flexShrink: 0,
          alignSelf: "flex-start",
        }}>
          {/* Tools header */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 14 }}>
            <span style={{ fontSize: 14 }}>🌿</span>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 17, fontWeight: 900, color: "#5A2D0A" }}>Tools</span>
            <span style={{ fontSize: 14 }}>🌿</span>
          </div>

          {/* Colour wheel section */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", paddingBottom: 14 }}>
            <ColorWheel onClick={() => colorRef.current?.click()} />
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#5A2D0A" }}>Colour</span>
            <input ref={colorRef} type="color" value={color} onChange={e => { setColor(e.target.value); setTool("brush"); }}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }} />
          </div>

          {/* Dashed divider */}
          <div style={{ width: "85%", borderTop: "2px dashed rgba(160,100,40,0.3)", marginBottom: 14 }} />

          {/* Brush section */}
          <button
            onClick={() => setTool("brush")}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              background: tool === "brush" ? "rgba(255,200,80,0.35)" : "none",
              border: tool === "brush" ? "2px solid #D4A020" : "2px solid transparent",
              borderRadius: 12, padding: "8px 12px", cursor: "pointer", width: "100%", marginBottom: 6,
            }}
          >
            <svg viewBox="0 0 48 80" width="32" height="54" fill="none">
              <rect x="18" y="2" width="12" height="50" rx="6" fill="#8B5E3C"/>
              <rect x="20" y="4" width="4" height="46" rx="2" fill="rgba(255,220,160,0.4)"/>
              <ellipse cx="24" cy="60" rx="10" ry="14" fill="#C84020"/>
              <ellipse cx="24" cy="72" rx="6" ry="4" fill="#A03010"/>
            </svg>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#5A2D0A" }}>Brush</span>
          </button>

          {/* Brush sizes */}
          {tool === "brush" && (
            <div style={{ display: "flex", gap: 6, marginBottom: 10, alignItems: "center", justifyContent: "center" }}>
              {SIZES.map(s => (
                <div key={s} onClick={() => setSize(s)} style={{
                  width: s + 10, height: s + 10, borderRadius: "50%",
                  background: size === s ? color : "#C8A060",
                  border: size === s ? "2px solid #5A2D0A" : "2px solid transparent",
                  cursor: "pointer", transition: "all 0.12s",
                }}/>
              ))}
            </div>
          )}

          {/* Dashed divider */}
          <div style={{ width: "85%", borderTop: "2px dashed rgba(160,100,40,0.3)", marginBottom: 14 }} />

          {/* Eraser section */}
          <button
            onClick={() => setTool("eraser")}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              background: tool === "eraser" ? "rgba(100,160,255,0.2)" : "none",
              border: tool === "eraser" ? "2px solid #4488DD" : "2px solid transparent",
              borderRadius: 12, padding: "8px 12px", cursor: "pointer", width: "100%", marginBottom: 6,
            }}
          >
            <svg viewBox="0 0 70 40" width="52" height="30" fill="none">
              <rect x="2" y="8" width="52" height="28" rx="4" fill="#EEEEF0"/>
              <rect x="2" y="8" width="52" height="28" rx="4" stroke="#AAAACC" strokeWidth="1.5"/>
              <rect x="2" y="8" width="52" height="14" rx="4" fill="#5588EE"/>
              <rect x="54" y="8" width="14" height="28" rx="4" fill="#CCCCDD"/>
            </svg>
            <span style={{ fontFamily: "var(--font-baloo)", fontSize: 14, fontWeight: 800, color: "#5A2D0A" }}>Eraser</span>
          </button>

          {/* Clear button */}
          <div style={{ width: "85%", borderTop: "2px dashed rgba(160,100,40,0.3)", margin: "10px 0 10px" }} />
          <button onClick={clearCanvas} style={{
            fontSize: 11, color: "#A06030", background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-baloo)", fontWeight: 700, letterSpacing: "0.05em",
          }}>↺ Clear</button>
        </div>
      </div>

      {/* ── Crayon shelf ── */}
      <div style={{
        position: "relative",
        zIndex: 2,
        background: "linear-gradient(180deg,#A06030,#7A4520)",
        borderTop: "4px solid #5A3010",
        padding: "10px 20px 14px",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 4,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.4)",
      }}>
        {/* Shelf inner shadow */}
        <div style={{ position: "absolute", top: 0, inset: "0 0 auto 0", height: 6, background: "rgba(0,0,0,0.2)", pointerEvents: "none" }}/>
        {CRAYONS.map((c) => (
          <Crayon key={c} color={c} selected={color === c && tool === "brush"}
            onClick={() => { setColor(c); setTool("brush"); }} />
        ))}
      </div>
    </div>
  );
}
