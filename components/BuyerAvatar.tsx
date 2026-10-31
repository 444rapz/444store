import Image from "next/image";

const TONE = ["bg-ice/15 text-ice", "bg-violet/20 text-violet-soft", "bg-blush/15 text-blush", "bg-silver/15 text-silver"];

export function toneOf(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return h % TONE.length;
}

/** Foto profil pembeli (Discord, atau Roblox kalau tidak ada); kalau kosong pakai huruf depan nama. */
export function BuyerAvatar({ name, src, size = "h-10 w-10", text = "text-base" }: { name: string; src?: string; size?: string; text?: string }) {
  if (src && src.startsWith("https://")) {
    return (
      <span className={"relative shrink-0 overflow-hidden rounded-full bg-raised " + size}>
        <Image src={src} alt="" width={96} height={96} unoptimized className="h-full w-full object-cover" />
      </span>
    );
  }
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-bold ${size} ${text} ${TONE[toneOf(name)]}`} aria-hidden>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
