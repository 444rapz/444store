# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router), deployed on Vercel. Confirmed by the owner. Replaces the earlier Vite + React prototype in this repo (kept on the `versi-lama` branch).

Data and orders live in the existing bot backend (`bot-discord` repo, aiohttp server on Fly.io at 444s.fly.dev, planned public alias `api.444s.store`). The website reads live prices, stock, reviews and stats from that API; it never stores its own copy.

## Users

Indonesian Roblox players, many of them young, mostly on phones. They want Robux or an in-game item quickly and cheaply, without technical steps, and need to trust a small seller before paying. Some have Discord, many only have WhatsApp.

Secondary: the store owner (rapz, Discord `@444rappz`) and staff, who verify payments and deliver orders from Discord and the 444s.fly.dev dashboard.

## Product Purpose

444 Store sells Robux and Roblox in-game items. The website lets a buyer pick a product, see the real price and stock, pay, upload proof, and follow the order until it is done, without needing to open a Discord ticket. Success: a first-time buyer completes an order on their phone without asking an admin how.

## Positioning

A small, personally run store tied to the 444s Discord community: orders are handled by real admins, prices and stock come live from the same system the Discord bot uses, and every review on the site is a real review left by a buyer after a completed ticket.

## Operating Context

- Order flow (phase 1): buyer chooses product, fills Roblox username and a contact (WhatsApp or Discord), pays with a static QRIS, uploads proof. Admin gets a bot message with Terima/Tolak/Selesai buttons in a Discord channel plus a webhook log, and the buyer's order page updates through stages: Menunggu pembayaran, Menunggu verifikasi, Diproses, Selesai (or Ditolak).
- Payment gateway is planned but not yet available; the code must allow switching it on later.
- Guest checkout is allowed. Optional accounts: email + password, WhatsApp number + password, Google, Discord. Accounts give order history.
- Order lookup by invoice code for guests.
- Admin tools (product catalog for in-game items, promo toggle, web orders) live in the 444s.fly.dev dashboard.

## Capabilities and Constraints

- Products: Robux via Username (sent without a password), Gift In Game / item (delivered by joining the buyer's server). Robux price per unit and stock come from the bot (`/api/rates`).
- Sections: promo / flash sale, categories, today's Robux price, store stats, Top Pembeli (names masked), real reviews, FAQ, Cek Pesanan, account and order history.
- Not offered, never show: Robux via Login, Robux via Gamepass, Limited Item, Roblox Premium/Plus, top sellers, seller list or seller registration.
- Domain: 444s.store.
- Secrets (webhook URLs, OAuth credentials, gateway keys) never go in this public repo.

## Brand Commitments

- Name: 444 Store (also written 444's Store). Community: 444s Discord server.
- Voice: casual Indonesian addressed to "kamu", short and reassuring ("gampang kok"), as on rapz444.site; wording references the owner pointed to: kingblox.id (simple ordering steps) and bie.my.id ("Mulai dari Rp..." product cards, QRIS then confirm).
- Visual base: the owner's existing site rapz444.site; layout inspiration from bloxsweet.com, which must not be copied closely.
- No emoji in UI copy unless the owner approves (standing rule from the bot project).

## Evidence on Hand

- Real reviews and star ratings from completed tickets (bot database, `ticket_reviews`).
- Real sales data: completed tickets, Robux delivered, top buyers (bot database).
- Live Robux rate and stock (bot `/api/rates`).
- Contact: WhatsApp wa.me/6285121388293, Discord invite discord.gg/z6tuj82Jw8, TikTok @rapz444s.
- Static QRIS image (`assets/qris.png` in bot-discord) and payment accounts listed by the bot.
- Absent, never fabricate: guarantees or refund promises, "100% aman" claims, invented testimonials or stats, partner/seller counts, affiliation with Roblox Corporation (show a not-affiliated disclaimer).

## Product Principles

1. A first-time buyer on a phone must be able to finish an order without help.
2. Only show what is true right now: live price, live stock, real reviews, real order status.
3. Every step tells the buyer what happens next and how long it usually takes.
4. Guest first: an account is a convenience, never a gate.
5. Admins work from Discord; the website must reflect their actions immediately.

## Accessibility & Inclusion

Young, mobile-first audience on mid-range Android phones and varying connections: large tap targets, readable contrast on a dark theme, fast first load, and plain Indonesian without jargon.
