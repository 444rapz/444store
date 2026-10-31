import { NextResponse } from "next/server";

// Cari game Roblox dari nama atau link (contoh: https://www.roblox.com/games/9872472334/Evade)
type Game = { universeId: number; placeId: number; name: string; players: number; icon: string };

const cached = (seconds: number) => ({ "Cache-Control": `public, s-maxage=${seconds}, stale-while-revalidate=${seconds}` });

async function json(url: string) {
  const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(7000) });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

async function withIcons(games: Game[]) {
  if (!games.length) return games;
  try {
    const ids = games.map((g) => g.universeId).join(",");
    const d = await json(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&size=150x150&format=Png&isCircular=false`);
    const map = new Map<number, string>();
    for (const t of d?.data ?? []) if (t.state === "Completed" && String(t.imageUrl).startsWith("https://tr.rbxcdn.com/")) map.set(t.targetId, t.imageUrl);
    return games.map((g) => ({ ...g, icon: map.get(g.universeId) ?? "" }));
  } catch {
    return games;
  }
}

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().slice(0, 200);
  if (q.length < 2) return NextResponse.json({ games: [] });
  try {
    const link = q.match(/roblox\.com\/(?:[a-z]{2}\/)?games\/(\d+)/i);
    if (link) {
      const placeId = Number(link[1]);
      const u = await json(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
      const universeId = Number(u?.universeId);
      if (!universeId) return NextResponse.json({ games: [] }, { headers: cached(300) });
      const info = await json(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
      const g = info?.data?.[0];
      const games = await withIcons([{ universeId, placeId: Number(g?.rootPlaceId ?? placeId), name: String(g?.name ?? "Game"), players: Number(g?.playing ?? 0), icon: "" }]);
      return NextResponse.json({ games }, { headers: cached(300) });
    }
    const d = await json(`https://apis.roblox.com/search-api/omni-search?searchQuery=${encodeURIComponent(q)}&pageType=all&sessionId=444store`);
    const games: Game[] = [];
    for (const group of d?.searchResults ?? []) {
      if (group.contentGroupType !== "Game") continue;
      for (const c of group.contents ?? []) {
        if (games.length >= 8 || !c.universeId) continue;
        games.push({ universeId: Number(c.universeId), placeId: Number(c.rootPlaceId ?? 0), name: String(c.name ?? ""), players: Number(c.playerCount ?? 0), icon: "" });
      }
    }
    return NextResponse.json({ games: await withIcons(games) }, { headers: cached(300) });
  } catch {
    return NextResponse.json({ error: "Roblox lagi sibuk. Coba cari lagi sebentar." }, { status: 502 });
  }
}
