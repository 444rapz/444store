// Harga Robux sama persis dengan kalkulator bot Discord (utils/price_calculator.py).
const TIERS = new Set([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 3000, 4000, 5000]);

/** Paket resmi harga pas; nominal custom dibulatkan ke atas per Rp 1.000. */
export function robuxPrice(amount: number, rate: number) {
  const raw = amount * rate;
  if (TIERS.has(amount)) return raw;
  return Math.ceil(raw / 1000) * 1000;
}

/** Budget Rupiah ke jumlah Robux: kelipatan 5 ke bawah, sisa 4 dibulatkan ke atas. */
export function budgetToRobux(rupiah: number, rate: number) {
  if (rate <= 0) return 0;
  const raw = Math.floor(rupiah / rate);
  const rem = raw % 5;
  return rem === 4 ? raw + 1 : raw - rem;
}

/** Harga Gift In Game: harga item (Robux) x rate, dibulatkan ke atas per Rp 1.000 seperti kalkulator bot. */
export function gigPrice(robux: number, rate: number) {
  return Math.ceil((robux * rate) / 1000) * 1000;
}
