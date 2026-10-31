import { NextResponse } from "next/server";

// Daftar gamepass yang masih dijual di sebuah game Roblox, lengkap dengan harga Robux dan ikonnya
type Pass = { id: number; name: string; robux: number; icon: string };

async function json(url: string) {
  const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

export async function GET(req: Request) {
  const universeId = Number(new URL(req.url).searchParams.get("universe"));
  if (!Number.isSafeInteger(universeId) || universeId <= 0) return NextResponse.json({ passes: [] }, { status: 400 });
  try {
    const passes: Pass[] = [];
    let token = "";
    for (let page = 0; page < 5; page++) {
      const q = new URLSearchParams({ passView: "Full", pageSize: "100" });
      if (token) q.set("pageToken", token);
      const d = await json(`https://apis.roblox.com/game-passes/v1/universes/${universeId}/game-passes?${q}`);
      for (const p of d?.gamePasses ?? []) {
        if (p.isForSale && Number(p.price) > 0) passes.push({ id: Number(p.id), name: String(p.name ?? ""), robux: Number(p.price), icon: "" });
      }
      token = d?.nextPageToken ?? "";
      if (!token) break;
    }
    passes.sort((a, b) => a.robux - b.robux);
    for (let i = 0; i < passes.length; i += 100) {
      const chunk = passes.slice(i, i + 100);
      try {
        const t = await json(`https://thumbnails.roblox.com/v1/game-passes?gamePassIds=${chunk.map((p) => p.id).join(",")}&size=150x150&format=Png&isCircular=false`);
        const map = new Map<number, string>();
        for (const x of t?.data ?? []) if (x.state === "Completed" && String(x.imageUrl).startsWith("https://tr.rbxcdn.com/")) map.set(x.targetId, x.imageUrl);
        for (const p of chunk) p.icon = map.get(p.id) ?? "";
      } catch {
        // ikon opsional
      }
    }
    return NextResponse.json({ passes }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300" } });
  } catch {
    return NextResponse.json({ error: "Daftar gamepass belum bisa dimuat. Coba lagi sebentar." }, { status: 502 });
  }
}
