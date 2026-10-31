import Image from "next/image";
import { BadgeCheck, Check, Loader2, TriangleAlert } from "lucide-react";
import type { LookupStatus, RobloxProfile } from "@/lib/roblox";

export function RobloxAvatar({ src, size }: { src: string; size: string }) {
  return (
    <span className={"relative shrink-0 overflow-hidden rounded-xl bg-raised ring-1 ring-line-strong " + size}>
      {src && <Image src={src} alt="" width={150} height={150} unoptimized className="h-full w-full object-cover" />}
    </span>
  );
}

/** Kartu profil Roblox di bawah kolom username, supaya pembeli yakin akunnya benar. */
export function ProfilePreview({ status, profile, username }: { status: LookupStatus; profile?: RobloxProfile; username: string }) {
  if (status === "loading") {
    return (
      <p className="mt-2.5 flex items-center gap-2 text-sm text-ink-muted" aria-live="polite">
        <Loader2 size={15} className="animate-spin" aria-hidden /> Mencari akun Roblox...
      </p>
    );
  }
  if (status === "found" && profile) {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-live/30 bg-live/[0.07] p-2.5 pr-3" aria-live="polite">
        <RobloxAvatar src={profile.avatar} size="h-12 w-12" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 font-semibold">
            <span className="truncate">{profile.displayName}</span>
            {profile.verified && <BadgeCheck size={15} className="shrink-0 text-ice" aria-label="Terverifikasi Roblox" />}
          </p>
          <p className="truncate text-sm text-ink-muted">@{profile.name}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-live/15 px-2.5 py-1 text-xs font-semibold text-live">
          <Check size={13} aria-hidden /> Akun ketemu
        </span>
      </div>
    );
  }
  if (status === "notfound") {
    return (
      <p className="mt-2.5 flex items-start gap-2 text-sm text-warn" aria-live="polite">
        <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
        Username @{username} nggak ketemu di Roblox. Cek lagi ejaannya, pakai username (bukan display name).
      </p>
    );
  }
  if (status === "error") {
    return (
      <p className="mt-2.5 text-sm text-ink-muted" aria-live="polite">
        Belum bisa cek akun Roblox sekarang. Pastikan username sudah benar, ya.
      </p>
    );
  }
  return null;
}
