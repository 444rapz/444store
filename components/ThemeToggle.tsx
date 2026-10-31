"use client";

import { Moon, Sun } from "lucide-react";

/** Ganti mode gelap/terang. Pilihan disimpan di browser pembeli; ikon yang tampil diatur CSS lewat data-theme. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Mode privat: tema tetap berganti, hanya tidak diingat
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Ganti mode terang atau gelap"
      title="Mode terang / gelap"
      className={
        "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line-strong text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink " +
        className
      }
    >
      <Sun size={18} aria-hidden className="light:hidden" />
      <Moon size={18} aria-hidden className="hidden light:block" />
    </button>
  );
}
