import { NextResponse } from "next/server";

// Cek username Roblox lewat API publik Roblox (dipanggil dari server karena Roblox tidak mengizinkan CORS)
const VALID = /^[A-Za-z0-9_]{3,20}$/;
const AVATAR_HOST = "https://tr.rbxcdn.com/";

const cached = (seconds: number) => ({ "Cache-Control": `public, s-maxage=${seconds}, stale-while-revalidate=${seconds}` });

export async function GET(req: Request) {
  const username = (new URL(req.url).searchParams.get("username") ?? "").trim();
  if (!VALID.test(username)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    const res = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ usernames: [username], excludeBannedUsers: true }),
      cache: "no-store",
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(String(res.status));
    const user = (await res.json())?.data?.[0];
    const id = Number(user?.id);
    if (!user || !Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ found: false }, { headers: cached(300) });
    }

    let avatar = "";
    try {
      const t = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=150x150&format=Png&isCircular=false`,
        { cache: "no-store", signal: AbortSignal.timeout(6000) },
      );
      const img = (await t.json())?.data?.[0];
      if (img?.state === "Completed" && typeof img.imageUrl === "string" && img.imageUrl.startsWith(AVATAR_HOST)) {
        avatar = img.imageUrl;
      }
    } catch {
      // Foto profil opsional; akun tetap dianggap ketemu
    }

    return NextResponse.json(
      {
        found: true,
        id,
        name: String(user.name ?? username),
        displayName: String(user.displayName ?? user.name ?? username),
        verified: Boolean(user.hasVerifiedBadge),
        avatar,
      },
      { headers: cached(3600) },
    );
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
}
