export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://444s.fly.dev").replace(/\/$/, "");

export const CONTACT = {
  whatsapp: "6285121388293",
  discord: "https://discord.gg/z6tuj82Jw8",
  tiktok: "https://tiktok.com/@rapz444s",
};

export const PAYMENT = {
  ewallet: "0813 6166 8954",
  ewalletRaw: "081361668954",
  ewalletNames: "DANA · GoPay · ShopeePay",
  holder: "M.R.T",
};

export type Review = { name: string; rating: number; text: string; robux: number; date: string; avatar?: string };
export type TopBuyer = { name: string; total_rp: number; orders: number; avatar?: string };
export type Summary = {
  rate: number;
  stock: number;
  stats: { orders_done: number; robux_sold: number; review_count: number; rating_avg: number };
  reviews: Review[];
  top_buyers: TopBuyer[];
  updated_at: string;
};

export const FALLBACK_SUMMARY: Summary = {
  rate: 0,
  stock: 0,
  stats: { orders_done: 0, robux_sold: 0, review_count: 0, rating_avg: 0 },
  reviews: [],
  top_buyers: [],
  updated_at: "",
};

/** Data live dari bot. Di-cache 30 detik di server supaya cepat. */
export async function getSummary(): Promise<Summary> {
  try {
    const res = await fetch(`${API_URL}/api/store/summary`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as Summary;
  } catch {
    return FALLBACK_SUMMARY;
  }
}

export const rupiah = (n: number) => "Rp " + Math.round(n).toLocaleString("id-ID");
export const number = (n: number) => Math.round(n).toLocaleString("id-ID");

/** Paket jumlah Robux (label dari rapz444.site milik owner). */
export const PACKAGES: { amount: number; tag?: string }[] = [
  { amount: 100, tag: "Murah" },
  { amount: 200 },
  { amount: 300 },
  { amount: 400, tag: "Populer" },
  { amount: 500 },
  { amount: 1000, tag: "Best seller" },
  { amount: 2000 },
  { amount: 5000 },
];

export type PayMethod = "qris" | "dana" | "gopay" | "shopeepay";

/** Cara bayar yang bisa dipilih pembeli (QRIS atau transfer e-wallet ke nomor toko). */
export const PAY_METHODS: { id: PayMethod; name: string; hint: string; logo: string; w: number; h: number }[] = [
  { id: "qris", name: "QRIS", hint: "Scan pakai aplikasi bank atau e-wallet apa aja", logo: "/brand/pay/qris.png", w: 160, h: 63 },
  { id: "dana", name: "DANA", hint: "Transfer ke nomor DANA toko", logo: "/brand/pay/dana.png", w: 160, h: 47 },
  { id: "gopay", name: "GoPay", hint: "Transfer ke nomor GoPay toko", logo: "/brand/pay/gopay.png", w: 160, h: 35 },
  { id: "shopeepay", name: "ShopeePay", hint: "Transfer ke nomor ShopeePay toko", logo: "/brand/pay/shopeepay.png", w: 146, h: 64 },
];

export type GigItem = { id: number; name: string; game: string; robux: number; price: number; image: string };
export type Gig = { ready: boolean; rate: number; items: GigItem[] };

/** Data Gift In Game dari bot (rate, status ready, daftar item). */
export async function getGig(): Promise<Gig> {
  try {
    const res = await fetch(`${API_URL}/api/store/gig`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as Gig;
  } catch {
    return { ready: false, rate: 0, items: [] };
  }
}

export function waLink(text: string) {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}
