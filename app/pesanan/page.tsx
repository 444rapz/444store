import type { Metadata } from "next";
import { MyOrders } from "@/components/MyOrders";

export const metadata: Metadata = { title: "Pesanan saya", robots: { index: false } };

export default function PesananPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-12 pt-8 sm:px-6 md:pt-12">
      <MyOrders />
    </div>
  );
}
