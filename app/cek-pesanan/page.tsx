import { redirect } from "next/navigation";

// Halaman lama: status pesanan sekarang ada di Pesanan saya (perlu masuk akun)
export default function CekPesananPage() {
  redirect("/pesanan");
}
