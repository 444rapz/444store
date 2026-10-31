"use client";

import { useState } from "react";

const TONE = ["bg-ice/15 text-ice", "bg-violet/20 text-violet-ink", "bg-blush/15 text-blush-ink", "bg-silver/15 text-silver-ink"];

export function toneOf(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return h % TONE.length;
}

/** Foto profil pembeli (Discord, atau Roblox kalau tidak ada). Kalau kosong atau gagal dimuat, pakai huruf depan nama. */
export function BuyerAvatar({ name, src, size = "h-10 w-10", text = "text-base" }: { name: string; src?: string; size?: string; text?: string }) {
  const [broken, setBroken] = useState(false);
  if (src && src.startsWith("https://") && !broken) {
    return (
      <span className={"relative block shrink-0 overflow-hidden rounded-full bg-raised " + size}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setBroken(true)} className="h-full w-full object-cover" />
      </span>
    );
  }
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-bold ${size} ${text} ${TONE[toneOf(name)]}`} aria-hidden>
      {(name.trim().charAt(0) || "?").toUpperCase()}
    </span>
  );
}
