"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* ── Types ── */
interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dob: string;
  gender: string;
  dogName: string;
  profilePicture: string | null;
  aboutYourself: string | null;
  whatILove: string | null;
  whatMakesHappy: string | null;
  platformSuggestion: string | null;
  coinBalance: number;
}

/* ── Validation ── */
const profileSchema = z.object({
  phone: z
    .string()
    .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian mobile number")
    .or(z.literal("")),
  dogName: z.string().min(1, "Dog name cannot be empty").max(50),
  aboutYourself: z.string().max(500).optional(),
  whatILove: z.string().max(500).optional(),
  whatMakesHappy: z.string().max(500).optional(),
  platformSuggestion: z.string().max(1000).optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

/* ── Crop helpers ── */
interface CropState { x: number; y: number }

function getCroppedBlob(
  imageSrc: string,
  crop: CropState,
  containerSize: number,
  circleSize: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const scale = img.naturalWidth / containerSize;
      const canvas = document.createElement("canvas");
      canvas.width = circleSize;
      canvas.height = circleSize;
      const ctx = canvas.getContext("2d")!;
      // Clip to circle
      ctx.beginPath();
      ctx.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2);
      ctx.clip();
      const sx = (-crop.x) * scale;
      const sy = (-crop.y) * scale;
      const sw = containerSize * scale;
      const sh = (containerSize * img.naturalHeight / img.naturalWidth) * scale;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, circleSize, circleSize * img.naturalHeight / img.naturalWidth);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Canvas toBlob failed")), "image/jpeg", 0.92);
    };
    img.onerror = reject;
    img.src = imageSrc;
  });
}

/* ── Crop Modal ── */
function CropModal({
  src,
  onConfirm,
  onCancel,
}: {
  src: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const CONTAINER = 320;
  const CIRCLE = 260;

  const [crop, setCrop] = useState<CropState>({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: CONTAINER, h: CONTAINER });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: nw, naturalHeight: nh } = e.currentTarget;
    const scale = CONTAINER / nw;
    setImgSize({ w: CONTAINER, h: Math.round(nh * scale) });
    setCrop({ x: 0, y: Math.round((nh * scale - CONTAINER) / -2) });
  };

  const clamp = useCallback((pos: CropState, iw: number, ih: number): CropState => ({
    x: Math.min(0, Math.max(CONTAINER - iw, pos.x)),
    y: Math.min(0, Math.max(CONTAINER - ih, pos.y)),
  }), [CONTAINER]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setCrop((prev) => clamp({ x: prev.x + dx, y: prev.y + dy }, imgSize.w, imgSize.h));
  };
  const onPointerUp = () => { dragging.current = false; };

  const handleConfirm = async () => {
    const blob = await getCroppedBlob(src, crop, CONTAINER, CIRCLE);
    onConfirm(blob);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center gap-5">
        <p className="text-base font-semibold" style={{ color: "#2C1A0E", fontFamily: "var(--font-playfair)" }}>
          Position your photo
        </p>
        <p className="text-xs text-center" style={{ color: "#B09070" }}>Drag to reposition</p>

        {/* Crop container */}
        <div
          className="relative overflow-hidden rounded-full cursor-grab active:cursor-grabbing select-none"
          style={{ width: CIRCLE, height: CIRCLE, border: "3px solid #E8920A" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt="crop preview"
            draggable={false}
            onLoad={onImgLoad}
            style={{
              position: "absolute",
              left: crop.x,
              top: crop.y,
              width: imgSize.w,
              height: imgSize.h,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ background: "#F5EFE6", color: "#8C6A3F" }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: "#E8920A" }}
          >
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Field components ── */
function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#B09070" }}>{label}</span>
      <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#F5EFE6", color: "#6B4E2A" }}>
        {value}
      </div>
    </div>
  );
}

function EditableField({
  label,
  placeholder,
  multiline,
  maxLength,
  error,
  ...rest
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
  maxLength?: number;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const base =
    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all border";
  const style = {
    background: "#FFFDF8",
    color: "#2C1A0E",
    borderColor: error ? "#E05C5C" : "#EDE0CC",
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#B09070" }}>{label}</span>
      {multiline ? (
        <textarea
          rows={3}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`${base} resize-none`}
          style={style}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type="text"
          maxLength={maxLength}
          placeholder={placeholder}
          className={base}
          style={style}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className="text-[11px]" style={{ color: "#E05C5C" }}>{error}</span>}
    </div>
  );
}

/* ── Main Page ── */
export default function ProfilePage() {
  const { update: updateSession } = useSession({ required: true });

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [uploadingPic, setUploadingPic] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  /* Fetch profile */
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data: ProfileData) => {
        setProfile(data);
        reset({
          phone: data.phone ?? "",
          dogName: data.dogName,
          aboutYourself: data.aboutYourself ?? "",
          whatILove: data.whatILove ?? "",
          whatMakesHappy: data.whatMakesHappy ?? "",
          platformSuggestion: data.platformSuggestion ?? "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [reset]);

  /* Save profile */
  const onSubmit = async (values: ProfileForm) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: values.phone || undefined,
          dogName: values.dogName,
          aboutYourself: values.aboutYourself || null,
          whatILove: values.whatILove || null,
          whatMakesHappy: values.whatMakesHappy || null,
          platformSuggestion: values.platformSuggestion || null,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        await updateSession();
      }
    } finally {
      setSaving(false);
    }
  };

  /* Photo selection */
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large. Please upload a file under 2 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    e.target.value = "";
  };

  /* Crop confirmed → upload */
  const onCropConfirm = async (blob: Blob) => {
    setCropSrc(null);
    setUploadingPic(true);
    try {
      const fd = new FormData();
      fd.append("picture", blob, "profile.jpg");
      const res = await fetch("/api/profile/picture", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setProfile((p) => p ? { ...p, profilePicture: url } : p);
      }
    } finally {
      setUploadingPic(false);
    }
  };

  /* Formatting */
  const formatDob = (dob: string) => {
    const d = new Date(dob);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFDF8" }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#E8920A", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FFFDF8" }}>
        <p style={{ color: "#B09070" }}>Could not load profile.</p>
      </div>
    );
  }

  return (
    <>
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={onCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}

      <div className="min-h-screen pb-16" style={{ background: "#FFFDF8" }}>
        {/* Header */}
        <div className="sticky top-0 z-10 px-4 py-4 flex items-center justify-between"
             style={{ background: "rgba(255,253,248,0.92)", backdropFilter: "blur(8px)", borderBottom: "1px solid #EDE0CC" }}>
          <Link href="/island"
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "#8C6A3F" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5L7 10l5 5" />
            </svg>
            Island
          </Link>

          <p className="text-lg font-bold" style={{ color: "#2C1A0E", fontFamily: "var(--font-playfair)" }}>
            My Profile
          </p>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all"
            style={{ background: saving ? "#D4A44A" : "#E8920A", minWidth: 64 }}
          >
            {saving ? "Saving…" : saved ? "Saved ✓" : "Save"}
          </button>
        </div>

        <div className="max-w-lg mx-auto px-4 pt-8 flex flex-col gap-6">

          {/* ── Profile Picture ── */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4"
                   style={{ borderColor: "#E8920A" }}>
                {profile.profilePicture ? (
                  <Image
                    src={profile.profilePicture}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white"
                       style={{ background: "linear-gradient(135deg,#F4C06A,#E8920A)" }}>
                    {profile.name[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              {uploadingPic && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPic}
              className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
              style={{ background: "#FFF4E0", color: "#C47A1E", border: "1px solid #F0D9A8" }}
            >
              {uploadingPic ? "Uploading…" : "Change Photo"}
            </button>
            <p className="text-[11px]" style={{ color: "#CABB9E" }}>JPG, PNG or WEBP · max 2 MB</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} />
          </div>

          {/* ── Account Info (read-only) ── */}
          <section className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "#FFF9F2", border: "1px solid #EDE0CC" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#C47A1E", fontFamily: "var(--font-playfair)" }}>
              Account
            </p>
            <ReadOnlyField label="Name" value={profile.name} />
            <ReadOnlyField label="Email" value={profile.email} />
            <ReadOnlyField label="Date of Birth" value={formatDob(profile.dob)} />
          </section>

          {/* ── Editable Personal ── */}
          <section className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "#FFF9F2", border: "1px solid #EDE0CC" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#C47A1E", fontFamily: "var(--font-playfair)" }}>
              Personal
            </p>
            <EditableField
              label="Phone Number"
              placeholder="+91 XXXXX XXXXX"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <EditableField
              label="Dog's Name"
              placeholder="Buddy"
              error={errors.dogName?.message}
              {...register("dogName")}
            />
          </section>

          {/* ── About Me ── */}
          <section className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "#FFF9F2", border: "1px solid #EDE0CC" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#C47A1E", fontFamily: "var(--font-playfair)" }}>
              About Me
            </p>
            <EditableField
              label="Something About Yourself"
              placeholder="Share a little about who you are…"
              multiline
              maxLength={500}
              error={errors.aboutYourself?.message}
              {...register("aboutYourself")}
            />
            <EditableField
              label="What I Love About Myself"
              placeholder="Something you appreciate about yourself…"
              multiline
              maxLength={500}
              error={errors.whatILove?.message}
              {...register("whatILove")}
            />
            <EditableField
              label="What Makes Me Happy"
              placeholder="Things that bring you joy…"
              multiline
              maxLength={500}
              error={errors.whatMakesHappy?.message}
              {...register("whatMakesHappy")}
            />
          </section>

          {/* ── Platform Suggestion ── */}
          <section className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "#FFF9F2", border: "1px solid #EDE0CC" }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#C47A1E", fontFamily: "var(--font-playfair)" }}>
              Suggestions
            </p>
            <EditableField
              label="Suggestions for the Platform"
              placeholder="We'd love to hear your ideas…"
              multiline
              maxLength={1000}
              error={errors.platformSuggestion?.message}
              {...register("platformSuggestion")}
            />
            <p className="text-[11px]" style={{ color: "#CABB9E" }}>Your suggestions are shared with the team anonymously.</p>
          </section>

          {/* Coins display */}
          <div className="flex items-center justify-between rounded-2xl px-5 py-4"
               style={{ background: "#FFF4E0", border: "1px solid #F0D9A8" }}>
            <div className="flex items-center gap-2.5">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9.5" fill="rgba(201,125,78,0.9)" />
                <text x="10" y="14" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" fontFamily="system-ui">₵</text>
              </svg>
              <span className="text-sm font-medium" style={{ color: "#8C6A3F" }}>Coin Balance</span>
            </div>
            <span className="text-lg font-bold tabular-nums" style={{ color: "#C47A1E" }}>{profile.coinBalance}</span>
          </div>

          {/* Save button (bottom) */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm transition-all"
            style={{ background: saving ? "#D4A44A" : "linear-gradient(135deg,#F4C06A,#E8920A)" }}
          >
            {saving ? "Saving…" : saved ? "Changes Saved ✓" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}
