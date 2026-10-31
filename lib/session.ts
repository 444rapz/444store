import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "s444";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

/** Pengaturan cookie sesi pembeli (httpOnly, hanya dikirim ke situs ini). */
export function sessionCookie(value: string, req: NextRequest, maxAge = THIRTY_DAYS) {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    secure: req.nextUrl.protocol === "https:",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
