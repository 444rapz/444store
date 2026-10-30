import Image from "next/image";

const METHODS = [
  { id: "qris", name: "QRIS", w: 160, h: 63 },
  { id: "dana", name: "DANA", w: 160, h: 47 },
  { id: "gopay", name: "GoPay", w: 160, h: 35 },
  { id: "shopeepay", name: "ShopeePay", w: 146, h: 64 },
];

// Logo metode pembayaran di atas chip putih supaya warnanya tetap asli
export function PayLogos({ className = "" }: { className?: string }) {
  return (
    <ul className={"flex flex-wrap items-center gap-2 " + className} aria-label="Metode pembayaran">
      {METHODS.map((m) => (
        <li key={m.id} className="grid h-8 place-items-center rounded-lg bg-white px-2.5">
          <Image src={"/brand/pay/" + m.id + ".png"} alt={m.name} width={m.w} height={m.h} className="h-[18px] w-auto" />
        </li>
      ))}
    </ul>
  );
}
