import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "s444";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** Alamat situs yang dibuka pembeli. Di Fly.io server ada di belakang proxy, jadi host dan protokol aslinya ada di header. */
export function siteOrigin(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || req.nextUrl.host;
  const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "");
  return `${proto}://${host}`;
}

/** Pengaturan cookie sesi pembeli (httpOnly, hanya dikirim ke situs ini). */
export function sessionCookie(value: string, req: NextRequest, maxAge = THIRTY_DAYS) {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    secure: siteOrigin(req).startsWith("https:"),
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
