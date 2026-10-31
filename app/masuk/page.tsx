import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk atau daftar akun 444 Store supaya pesanan dan chat dengan admin tersimpan.",
  robots: { index: false },
};

export default async function MasukPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const raw = q.next || "/";
  const next = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";
  return (
    <div className="mx-auto max-w-md px-4 pb-16 pt-10 sm:pt-16">
      <AuthForm next={next} error={q.error || ""} startMode={q.mode === "daftar" ? "register" : "login"} />
    </div>
  );
}
