---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/robux","app/item","app/cek-pesanan"]
---

Scope: home (app/page.tsx) and the order surfaces it leads to. Mode: Persuade for home, Operate for checkout and order tracking.
Audience and job: young Indonesian Roblox players on phones who want Robux or an item fast and need to trust a small seller.
Proof available: live rate and stock from the bot, real reviews, real completed-order stats, top buyers (masked).
Constraints: no Robux via Login/Gamepass, no Limited/Premium, no seller list; no invented claims; no emoji in UI copy.

## Direction contract
THESIS: The store is the order counter itself. The first viewport is a working Robux order (amount, live price, live stock) instead of a banner pointing to one; it refuses the hero-over-a-row-of-cards top-up template.
OWN-WORLD: rapz444.site lineage pushed one step: near-black #0B0B0C ground, warm off-white #F6F3EF ink, smoked surfaces, one violet #8B5CF6 accent that only marks live data and the chosen amount, green dot for stock, off-white pill as the single primary action, Geist type with tabular numerals.
STORY: Visitor sees the live stock and today's price, taps an amount, sees exactly what they pay, then scrolls into proof: real reviews, real totals, top buyers, how ordering works, FAQ.
FIRST VIEWPORT: Mobile: compact header, one line hook, the amount grid with total and primary button fully visible above the fold, live stock pill on top. Desktop: hook and proof strip left, order counter right at full height.
FORM: pinned by owner (rapz444.site base, bloxsweet layout inspiration); no concept-seed roll; code-led (no image generation).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Revision 2 (owner feedback, pinned)
Owner rejected the colorful bloxsweet-like pass (loud pink, Fredoka, invented coin art) as "changed, not fixed". Pinned world now: the owner's own Y2K chrome assets.
- Assets (public/brand/): banner.jpg (silver grain, chrome sparkles, "444 store" serif), server-icon.jpg (logo), robux.png and robux-hex.png (pale pink), chrome-infinity.png (icy blue chrome + sparkle), chrome-heart.png (silver tribal), tribal-violet.png (purple chrome), web-heart.png (white spider web heart), me.png, verified.png, pay/{dana,qris,gopay,shopeepay}.png.
- Palette: monochrome black/silver like the banner; accents only from the icons: icy blue, violet, pale pink. No loud pink fills.
- Type: Geist only (same as rapz444.site), heavy weight and tight tracking for display. Remove Fredoka.
- Hero: the real banner.jpg in a rounded frame as the centerpiece, chrome icons floating at its edges; CTA below. Replace the authored RobuxCoin with the owner's icons everywhere.
- Primary button: silver chrome pill. Badges and medals in chrome/silver, not colored.
- Keep all structure and features from Revision 1 (order counter, categories, stats, leaderboard, reviews, FAQ).

## Revision 3 (owner feedback on the hero, pinned)
Owner: "creative lagi dong buat banner simpel estetik keren dan jangan terlalu sama kaya web lain tapi enak di lihat dan menarik".
- THESIS: the hero is a chrome order ticket, the object the store already runs on in Discord. It replaces the framed banner image (banner.jpg becomes the OG image) and refuses the banner-over-headline template.
- FIRST VIEWPORT: one wide ticket. Silver chrome body holds the h1, subcopy, a dark pill "Beli Robux sekarang" and an outline "Cek Pesanan"; a perforated tear line with punched notches; an icy-blue chrome stub printing the live price per Robux, live stock and a barcode captioned 444s.store. Mobile: body on top, stub under a horizontal tear line. The owner's chrome icons are die-cut stickers stuck across edges and the tear line.
- SIGNATURE: on desktop the ticket tilts toward the pointer, stickers lift in parallax and a specular sheen follows the cursor; on touch a slow sheen sweep; nothing moves under reduced motion.
- Material: chrome gradients and crisp geometry only (four-point sparkles from the banner, barcode bars). No raster texture, no noise grain.
