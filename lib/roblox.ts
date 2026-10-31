"use client";

import { useEffect, useState } from "react";

export type RobloxProfile = { name: string; displayName: string; avatar: string; verified: boolean };
export type LookupStatus = "idle" | "loading" | "found" | "notfound" | "error";
type Lookup = { user: string; state: "found" | "notfound" | "error"; profile?: RobloxProfile };

export const VALID_USERNAME = /^[A-Za-z0-9_]{3,20}$/;

/** Cari akun Roblox setelah pembeli berhenti mengetik sebentar (lewat /api/roblox di situs ini). */
export function useRobloxLookup(username: string) {
  const uname = username.trim();
  const valid = VALID_USERNAME.test(uname);
  const [lookup, setLookup] = useState<Lookup | null>(null);

  useEffect(() => {
    if (!VALID_USERNAME.test(uname)) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch("/api/roblox?username=" + encodeURIComponent(uname), { signal: ctrl.signal })
        .then(async (r) => {
          const d = await r.json().catch(() => null);
          if (!r.ok || !d) return setLookup({ user: uname, state: "error" });
          setLookup(d.found ? { user: uname, state: "found", profile: d as RobloxProfile } : { user: uname, state: "notfound" });
        })
        .catch((e) => {
          if (e?.name !== "AbortError") setLookup({ user: uname, state: "error" });
        });
    }, 500);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [uname]);

  const status: LookupStatus = !valid ? "idle" : lookup?.user === uname ? lookup.state : "loading";
  return { uname, valid, status, profile: status === "found" ? lookup?.profile : undefined };
}
