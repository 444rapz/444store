"use client";

import { useEffect, useState } from "react";
import { API_URL, type PayMethod } from "./store";

export type WebUser = { id: number; name: string; provider: string; email: string; phone: string; avatar: string };
export type Order = {
  invoice: string;
  status: "awaiting_payment" | "awaiting_verification" | "processing" | "done" | "rejected" | "cancelled";
  status_label: string;
  robux: number;
  rate: number;
  subtotal: number;
  discount: number;
  total: number;
  promo_code: string;
  roblox: { username: string; id: string; display: string; avatar: string };
  age_group: "adult" | "minor";
  note: string;
  payment_method: PayMethod;
  payment_label: string;
  has_proof: boolean;
  reject_reason: string;
  admin: { name: string; avatar: string } | null;
  review: { rating: number; text: string } | null;
  created_at: string;
  updated_at: string;
};
export type ChatMessage = {
  id: number;
  sender: "buyer" | "admin" | "system";
  author: string;
  body: string;
  image: boolean;
  avatar: string;
  created_at: string;
};

type Result<T> = { ok: boolean; status: number; data: T & { error?: string } };

/** Panggil API toko lewat proxy situs ini (/api/web/...). */
export async function webApi<T = Record<string, unknown>>(path: string, init?: RequestInit): Promise<Result<T>> {
  try {
    const isForm = typeof FormData !== "undefined" && init?.body instanceof FormData;
    const res = await fetch(`/api/web/${path}`, {
      ...init,
      headers: isForm ? init?.headers : { "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: "Koneksi terputus. Cek internet kamu, lalu coba lagi." } as T & { error?: string } };
  }
}

/** Link login Discord/Google: langsung ke bot, lalu bot mengarahkan balik ke /masuk/selesai. */
export function oauthUrl(provider: "discord" | "google", next: string) {
  const q = new URLSearchParams({ origin: window.location.origin, next });
  return `${API_URL}/api/web/auth/${provider}?${q}`;
}

/** Akun yang sedang masuk (null kalau belum masuk, undefined selama dimuat). `key` memicu cek ulang, misalnya saat pindah halaman. */
export function useWebUser(key?: string) {
  const [user, setUser] = useState<WebUser | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    webApi<{ user: WebUser | null }>("me").then((r) => {
      if (alive) setUser(r.ok ? r.data.user : null);
    });
    return () => {
      alive = false;
    };
  }, [key]);
  return user;
}

/** Kecilkan foto bukti bayar di HP sebelum diupload (maks. 1600 px, JPEG). */
export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}
