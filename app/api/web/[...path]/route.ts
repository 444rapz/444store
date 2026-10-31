import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/store";
import { SESSION_COOKIE, sessionCookie } from "@/lib/session";

// Proxy ke API toko di bot (444s.fly.dev). Token sesi disimpan di cookie httpOnly situs ini,
// lalu dikirim ke bot lewat header X-Web-Token, jadi tidak pernah terbaca oleh JavaScript.
const TOKEN_ROUTES = new Set(["auth/login", "auth/register", "auth/exchange"]);

async function forward(req: NextRequest, path: string[]) {
  const joined = path.map(encodeURIComponent).join("/");
  const url = `${API_URL}/api/web/${joined}${req.nextUrl.search}`;
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) headers["X-Web-Token"] = token;
  // Fly.io menaruh IP asli pembeli di Fly-Client-IP; di hosting lain pakai X-Forwarded-For
  const ip = req.headers.get("fly-client-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) headers["X-Client-IP"] = ip;
  const type = req.headers.get("content-type");
  if (type) headers["Content-Type"] = type;

  let res: Response;
  try {
    res = await fetch(url, {
      method: req.method,
      headers,
      body: req.method === "GET" ? undefined : await req.arrayBuffer(),
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.json({ error: "Server toko lagi sibuk. Coba lagi sebentar." }, { status: 502 });
  }

  const resType = res.headers.get("content-type") || "";
  if (!resType.includes("application/json")) {
    return new NextResponse(res.body, {
      status: res.status,
      headers: { "Content-Type": resType || "application/octet-stream", "Cache-Control": "private, max-age=3600" },
    });
  }

  const data = await res.json().catch(() => ({}));
  if (joined === "auth/logout") {
    const out = NextResponse.json({ ok: true });
    out.cookies.set(sessionCookie("", req, 0));
    return out;
  }
  if (TOKEN_ROUTES.has(joined) && res.ok && typeof data?.token === "string") {
    const { token: newToken, ...rest } = data;
    const out = NextResponse.json(rest);
    out.cookies.set(sessionCookie(newToken, req));
    return out;
  }
  const out = NextResponse.json(data, { status: res.status, headers: { "Cache-Control": "no-store" } });
  if (res.status === 401 && token) out.cookies.set(sessionCookie("", req, 0));
  return out;
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return forward(req, (await ctx.params).path);
}
