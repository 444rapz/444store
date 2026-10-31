import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/store";
import { sessionCookie } from "@/lib/session";

// Ujung login Discord/Google: tukar kode sekali pakai dari bot dengan token sesi, lalu simpan di cookie.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code") || "";
  const raw = req.nextUrl.searchParams.get("next") || "/";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  const fail = new URL("/masuk?error=sesi_login", req.nextUrl.origin);
  if (!code) return NextResponse.redirect(fail);
  try {
    const res = await fetch(`${API_URL}/api/web/auth/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    });
    const data = await res.json();
    if (!res.ok || typeof data?.token !== "string") return NextResponse.redirect(fail);
    const out = NextResponse.redirect(new URL(next, req.nextUrl.origin));
    out.cookies.set(sessionCookie(data.token, req));
    return out;
  } catch {
    return NextResponse.redirect(fail);
  }
}
