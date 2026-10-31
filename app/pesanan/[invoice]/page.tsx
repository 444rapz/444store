import type { Metadata } from "next";
import { OrderDetail } from "@/components/OrderDetail";

export const metadata: Metadata = { title: "Detail pesanan", robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ invoice: string }> }) {
  const { invoice } = await params;
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 md:pt-12">
      <OrderDetail invoice={invoice.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12)} />
    </div>
  );
}
