"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Pause, Bell, Settings, Heart, Leaf, Home, BookOpen, Flower2,
  Users, Tent, Coffee, Archive, Lock, ChevronRight, Play, CircleUser, MapPin, Clock
} from "lucide-react";
import {
  boyDayMobileHotspots,
  boyDayDesktopHotspots,
  boyNightMobileHotspots,
  boyNightDesktopHotspots,
  girlDayMobileHotspots,
  girlDayDesktopHotspots,
  girlNightMobileHotspots,
  girlNightDesktopHotspots,
  type Hotspot,
} from "@/config/island-hotspots";

const CURRENT_PHASE = 3;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function fmtElapsed(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${p(m)}:${p(sec)}` : `${p(m)}:${p(sec)}`;
}

function isNightTime(): boolean {
  const h = new Date().getHours();
  return h < 5 || h >= 17;
}

type Gender = "boy" | "girl";
type TimeOfDay = "day" | "night";
type Orientation = "mobile" | "desktop";

function getIslandSrc(gender: Gender, time: TimeOfDay, orientation: Orientation): string {
  return `/island/${gender}-${time}-${orientation}.png`;
}

function getHotspots(gender: Gender, time: TimeOfDay, orientation: Orientation): Hotspot[] {
  if (gender === "boy" && time === "day" && orientation === "mobile") return boyDayMobileHotspots;
  if (gender === "boy" && time === "day" && orientation === "desktop") return boyDayDesktopHotspots;
  if (gender === "boy" && time === "night" && orientation === "mobile") return boyNightMobileHotspots;
  if (gender === "boy" && time === "night" && orientation === "desktop") return boyNightDesktopHotspots;
  if (gender === "girl" && time === "day" && orientation === "mobile") return girlDayMobileHotspots;
  if (gender === "girl" && time === "day" && orientation === "desktop") return girlDayDesktopHotspots;
  if (gender === "girl" && time === "night" && orientation === "mobile") return girlNightMobileHotspots;
  return girlNightDesktopHotspots;
}

const destMeta: Record<string, { icon: any, desc: string }> = {
  "/home": { icon: Home, desc: "Your safe space on the island." },
  "/school": { icon: BookOpen, desc: "Learn, reflect, and grow a little more." },
  "/garden": { icon: Flower2, desc: "Start your day gently and set intentions." },
  "/clubhouse": { icon: Users, desc: "Connect, share, and feel supported." },
  "/fair": { icon: Tent, desc: "Enjoy light moments and small joys." },
  "/resthouse": { icon: Coffee, desc: "Pause, breathe, and restore your energy." },
  "/treasurebox": { icon: Archive, desc: "See your progress and collected rewards." },
  "/lighthouse": { icon: MapPin, desc: "Find clarity when things feel unclear." },
  "/cave": { icon: Lock, desc: "A mystery waiting to be uncovered." },
};

function HotspotArea({ spot, locked, lockMessage }: { spot: Hotspot; locked: boolean; lockMessage?: string; }) {
  const [tipOpen, setTipOpen] = useState(false);
  const style = {
    position: "absolute" as const,
    left: `${spot.x}%`,
    top: `${spot.y}%`,
    width: `${spot.width}%`,
    height: `${spot.height}%`,
  };

  if (locked) {
    return (
      <div style={style} className="group cursor-not-allowed">
        <div className="w-full h-full rounded-sm bg-gray-900/40 border border-gray-500/30 backdrop-blur-[1px]" />
        <button className="absolute inset-0 w-full h-full" onClick={() => setTipOpen((v) => !v)} aria-label={lockMessage} />
        <AnimatePresence>
          {tipOpen && lockMessage && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap z-30 bg-[#2A180D] text-[#E6D4B8] border border-[#4A2D16] text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-xl"
            >
              {lockMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return <Link href={spot.href} style={style} className="block" aria-label={spot.label} />;
}

export default function IslandMapPage() {
  const { data: session } = useSession();
  const [showGreeting, setShowGreeting] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => isNightTime() ? "night" : "day");

  const firstName = session?.user?.name?.split(" ")[0] ?? "friend";
  const dogName = (session?.user as { dogName?: string })?.dogName ?? "Buddy";
  const coinBalance = (session?.user as { coinBalance?: number })?.coinBalance ?? 0;
  const firstLoginAt = (session?.user as { firstLoginAt?: string })?.firstLoginAt;
  const gender = ((session?.user as { gender?: string })?.gender ?? "boy") as Gender;

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    const audio = new Audio("/island-bg.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    bgAudioRef.current = audio;
    audio.play().catch(() => {});
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowGreeting(false), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTimeOfDay(isNightTime() ? "night" : "day"), 60_000);
    return () => clearInterval(id);
  }, []);

  const msSinceFirst = firstLoginAt ? Date.now() - new Date(firstLoginAt).getTime() : 0;
  const isCaveLocked = !firstLoginAt || msSinceFirst < SEVEN_DAYS_MS;
  const caveDaysLeft = Math.max(1, Math.ceil((SEVEN_DAYS_MS - msSinceFirst) / (24 * 60 * 60 * 1000)));

  const desktopHotspots = getHotspots(gender, timeOfDay, "desktop").filter((h) => h.phase <= CURRENT_PHASE);
  const mobileHotspots = getHotspots(gender, timeOfDay, "mobile").filter((h) => h.phase <= CURRENT_PHASE);

  const destinations = [
    { label: "Home", href: "/home" },
    { label: "School", href: "/school" },
    { label: "Garden", href: "/garden" },
    { label: "Club House", href: "/clubhouse" },
    { label: "Fair", href: "/fair" },
    { label: "Rest House", href: "/resthouse" },
    { label: "Treasure Box", href: "/treasurebox" },
    { label: "Lighthouse", href: "/lighthouse" },
    { label: "Cave", href: "/cave", locked: isCaveLocked },
  ];

  return (
    <div className="bg-[#1A0F08] min-h-dvh w-full overflow-hidden relative font-sans text-[#E6D4B8]">

      {/* ── MOBILE LAYOUT ── */}
      <div className="md:hidden relative w-full h-dvh overflow-y-auto overflow-x-hidden">
        <div className="relative w-full" style={{ aspectRatio: '1023/1537' }}>
          <Image src={getIslandSrc(gender, timeOfDay, "mobile")} alt="Island map" fill className="object-cover select-none" priority draggable={false} />
          {mobileHotspots.map((spot) => (
            <HotspotArea key={spot.id} spot={spot} locked={spot.timeLock ? isCaveLocked : false} lockMessage={spot.timeLock && isCaveLocked ? `Cave unlocks in ${caveDaysLeft}d` : undefined} />
          ))}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (Flex Columns with Wooden Theme) ── */}
      <div className="hidden md:flex h-dvh w-full overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(44,24,14,1) 0%, rgba(26,14,8,1) 100%)" }}>

        {/* Left Sidebar (Profile) */}
        <aside className="w-[210px] shrink-0 h-full flex flex-col z-40 relative">

          <div className="flex flex-col items-center pt-9 pb-3 relative">
            <div className="relative w-[70px] h-[70px]">
              {/* Outer thin golden ring */}
              <div className="absolute inset-[-5px] rounded-full border border-[#8C6A3F] shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
              {/* Thick dark ring */}
              <div className="absolute inset-[-4px] rounded-full border-[4px] border-[#25150C] z-10" />
              {/* Main Avatar Circle */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD15C] to-[#E8920A] flex items-center justify-center text-[28px] font-bold text-white z-20 shadow-inner border-[2px] border-[#8C5D2C]">
                {firstName[0]?.toUpperCase()}
              </div>
              <div className="absolute -top-3 -left-2 text-2xl z-30 drop-shadow-md">🌿</div>
              <div className="absolute -bottom-2 -right-3 text-2xl z-30 drop-shadow-md">🍃</div>
            </div>
            <h2 className="mt-5 text-[15px] font-bold text-[#F4E1C1] tracking-wide">{firstName}</h2>
            <p className="text-[11.5px] text-[#D4A44A] mt-0.5 font-medium">Explorer</p>
          </div>

          <div className="px-4 py-2 flex flex-col gap-3">
            {/* Coins */}
            <div className="relative flex items-center justify-between bg-[#24150D] rounded-xl px-3 py-2.5 border border-[#4A2D19] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),_0_4px_6px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-all">
              <div className="flex items-center gap-3">
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#FAD961] to-[#D6820B] flex items-center justify-center text-[#FFF] font-bold shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] text-[14px] border-[1.5px] border-[#FFE8A1]/50">
                  $
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[#967C5E] text-[10.5px] font-medium leading-[1.1] mb-0.5">Coins</span>
                  <span className="text-[#FAD961] font-bold text-[15px] leading-[1.1] tracking-wide">{coinBalance}</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8A7156]" />
            </div>

            {/* Session Time */}
            <div className="relative flex items-center justify-between bg-[#24150D] rounded-xl px-3 py-2.5 border border-[#4A2D19] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),_0_4px_6px_rgba(0,0,0,0.4)] hover:brightness-110 cursor-pointer transition-all">
              <div className="flex items-center gap-3">
                <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#E0CDA9] to-[#B59567] flex items-center justify-center text-[#3D2513] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)] border-[1.5px] border-[#FFF]/40">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[#967C5E] text-[10.5px] font-medium leading-[1.1] mb-0.5">Session time</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#FAD961] font-bold text-[15px] leading-[1.1] tracking-wide">{Math.floor(elapsed / 60)}</span>
                    <span className="text-[#FAD961] font-medium text-[11px] leading-none">min</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8A7156]" />
            </div>
          </div>

          <div className="px-4 py-2 mt-1">
            <div className="relative bg-[#24150D] rounded-[16px] px-3 py-3.5 border border-[#4A2D19] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),_0_4px_6px_rgba(0,0,0,0.4)] flex flex-col items-center">
              <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 bg-[#2F1D11] rounded-full px-1">
                <Leaf className="w-3.5 h-3.5 text-[#638F36]" />
              </div>
              <p className="text-center text-[#E6D4B8] text-[11px] leading-[1.4] mt-0.5 font-medium">You showed up<br />today. That matters.</p>
              <Heart className="w-3 h-3 text-[#C95959] fill-[#C95959] mt-2" />
            </div>
          </div>

          <div className="mt-1 px-4 pb-6 flex flex-col items-center gap-3.5">
            <Link href="/profile" className="w-full flex items-center justify-between bg-[#24150D] hover:bg-[#341C0F] transition-colors rounded-[14px] px-3.5 py-3 border border-[#4A2D19] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),_0_4px_6px_rgba(0,0,0,0.4)]">
              <div className="flex items-center gap-2.5 text-[#C49A45]">
                <CircleUser className="w-4 h-4" />
                <span className="font-semibold text-[12px]">My Profile</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8A7156]" />
            </Link>

            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#24150D] hover:bg-[#341C0F] transition-colors border border-[#4A2D19] text-[#C49A45] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),_0_4px_6px_rgba(0,0,0,0.4)]">
                <Settings className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#24150D] hover:bg-[#341C0F] transition-colors border border-[#4A2D19] text-[#C49A45] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),_0_4px_6px_rgba(0,0,0,0.4)]">
                <Bell className="w-4 h-4" />
              </button>
            </div>

            {/* Dog Companion Prompt */}
            <div className="w-full relative bg-[#24150D] rounded-[16px] px-3 py-3.5 border border-[#4A2D19] shadow-[inset_0_1px_0_rgba(255,255,255,0.03),_0_4px_6px_rgba(0,0,0,0.4)] flex items-start gap-3 mt-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E6D4B8] to-[#C89B5C] shrink-0 border-[1.5px] border-[#FFE8A1]/50 flex items-center justify-center shadow-inner overflow-hidden relative">
                <span className="text-[20px] translate-y-[1px]">🐶</span>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[#FDE5B4] font-bold text-[13px]">{dogName}</span>
                  <span className="text-[#D0B286] text-[10px]">🐾</span>
                </div>
                <p className="text-[#C8AA82] text-[10px] leading-[1.3] font-medium">Let's begin gently today.</p>
                <p className="text-[#C8AA82] text-[10px] leading-[1.3] mt-0.5 font-medium">Where would you like to go?</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Island Column */}
        <div className="flex-1 h-full relative overflow-hidden flex items-center justify-center">

          {/* Constrain container to exactly the image's aspect ratio */}
          <div className="relative w-full max-h-full flex items-center justify-center p-4">
            <div className="relative w-full h-full max-h-[90vh] aspect-[1672/941]">
              <Image src={getIslandSrc(gender, timeOfDay, "desktop")} alt="ManoDweep island map" fill className="object-contain select-none" priority draggable={false} />
              {desktopHotspots.map((spot) => (
                <HotspotArea key={spot.id} spot={spot} locked={spot.timeLock ? isCaveLocked : false} lockMessage={spot.timeLock && isCaveLocked ? `Cave unlocks in ${caveDaysLeft}d` : undefined} />
              ))}
            </div>
          </div>






        </div>

        {/* Right Sidebar (Destinations) */}
        <aside className="w-[280px] shrink-0 h-full flex flex-col z-40 relative">

          <div className="px-5 pt-8 pb-4 relative">
            <h2 className="text-[20px] font-bold text-center text-[#FDE5B4] tracking-wide" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Destinations</h2>
            <p className="text-center text-[#C8AA82] text-[12px] mt-1">Where would you like to go today?</p>
            <div className="absolute bottom-0 left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-[#4A2D16] to-transparent" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar pb-6" style={{ scrollbarWidth: 'none' }}>
            {destinations.map((dest) => {
              const meta = destMeta[dest.href] || { icon: Home, desc: "Visit this destination." };
              const Icon = meta.icon;

              const cardBaseClass = "flex items-center gap-3.5 px-3.5 py-3 rounded-[12px] transition-all relative overflow-hidden group border border-[#8A5A29] shadow-[inset_0_-4px_0_rgba(138,90,41,0.4),_0_4px_6px_rgba(0,0,0,0.3)]";
              const normalCardBg = "bg-gradient-to-b from-[#E2B77B] to-[#C99C5D] hover:from-[#E8C28A] hover:to-[#D2A566]";
              const lockedCardBg = "bg-gradient-to-b from-[#6D5A46] to-[#4A3D2F] border-[#3A2E22] opacity-80 cursor-not-allowed shadow-[inset_0_-4px_0_rgba(40,30,20,0.4),_0_4px_6px_rgba(0,0,0,0.3)]";

              if (dest.locked) {
                return (
                  <div key={dest.href} className={`select-none ${cardBaseClass} ${lockedCardBg}`}>
                    <div className="w-11 h-11 flex items-center justify-center shrink-0 text-[#2A1E14]">
                      <Icon className="w-7 h-7 drop-shadow-sm" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[15px] text-[#2A1E14]">{dest.label}</p>
                      <p className="text-[11px] leading-snug mt-0.5 text-[#3D2C1E]">Unlocks in {caveDaysLeft}d</p>
                    </div>
                    <Lock className="w-4 h-4 text-[#2A1E14] shrink-0" />
                  </div>
                );
              }

              return (
                <Link key={dest.href} href={dest.href} className={`${cardBaseClass} ${normalCardBg}`}>
                  <div className="w-11 h-11 flex items-center justify-center shrink-0 text-[#3B2211]">
                    <Icon className="w-7 h-7 drop-shadow-sm" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[15px] text-[#3B2211] leading-tight">{dest.label}</p>
                    <p className="text-[11px] leading-snug mt-0.5 text-[#4A2D16]">{meta.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-[#8A5A29]" />
                </Link>
              );
            })}
          </div>
        </aside>

      </div>

      {/* Greeting Overlay */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.35 }}
            className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none px-8 bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-[#2C180E]/95 backdrop-blur-md rounded-3xl px-8 py-6 shadow-2xl border border-[#4A2D16] text-center">
              <p className="text-xl font-bold text-[#FDE5B4]">Hello, {firstName}! 🌿</p>
              <p className="text-[15px] text-[#C8AA82] mt-1.5">Welcome to your island</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}