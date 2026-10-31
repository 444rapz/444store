# 444 Store

Website toko 444 Store (444s.store): Robux via Username dan Gift In Game.
Dibangun dengan Next.js, berjalan di Fly.io (app `444store`, domain 444s.store). Data (harga, stok, ulasan, pesanan) diambil dari server bot di 444s.fly.dev.

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

## Deploy

Push ke `main` otomatis deploy ke Fly.io lewat GitHub Actions (`.github/workflows/fly.yml`), asalkan secret
`FLY_API_TOKEN` sudah dipasang di repo GitHub. Deploy manual: `fly deploy --remote-only`.

Domain 444s.store (Hostinger) memakai DNS: A `@` ke IPv4 app, AAAA `@` ke IPv6 app, CNAME `www` ke `444store.fly.dev`.
Alamatnya bisa dilihat dengan `fly ips list -a 444store`.

Versi website lama tersimpan di cabang `versi-lama`.
