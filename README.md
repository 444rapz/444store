# 444 Store

Website toko 444 Store (444s.store): Robux via Username dan Gift In Game.
Dibangun dengan Next.js, di-deploy di Vercel. Data (harga, stok, ulasan, pesanan) diambil dari server bot di 444s.fly.dev.

## Jalankan di komputer

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Pengaturan

Salin `.env.example` ke `.env.local` bila alamat API berubah:

- `NEXT_PUBLIC_API_URL`: alamat server bot (bawaan `https://444s.fly.dev`).

Jangan taruh link webhook, kunci payment gateway, atau kredensial login di repo ini (repo publik).

Versi website lama tersimpan di cabang `versi-lama`.
