"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const IDLE_MS = 1400;

/**
 * Petunjuk scroll yang tidak mengganggu:
 * - Laptop: garis progres tipis di atas layar.
 * - HP: panah kecil "geser ke bawah" yang baru muncul saat layar diam dan masih ada isi di bawah.
 */
export function ScrollCues() {
  const path = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const remaining = () => document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (bar.current) {
        bar.current.style.transform = `scaleX(${p})`;
        bar.current.style.opacity = p > 0.005 ? "1" : "0";
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
      setHint(false);
      clearTimeout(timer);
      timer = setTimeout(() => setHint(remaining() > window.innerHeight * 0.6), IDLE_MS);
    };

    update();
    setHint(false);
    timer = setTimeout(() => setHint(remaining() > window.innerHeight * 0.6), IDLE_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [path]);

  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-[2px] md:block">
        <div
          ref={bar}
          className="h-full origin-left bg-linear-to-r from-ice via-violet to-ice opacity-0 transition-opacity duration-300"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <button
        type="button"
        onClick={() => window.scrollBy({ top: window.innerHeight * 0.75, behavior: "smooth" })}
        aria-label="Geser ke bawah"
        tabIndex={hint ? 0 : -1}
        className={
          "nav-shell fixed bottom-[calc(env(safe-area-inset-bottom)+5.6rem)] left-1/2 z-30 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full text-ink-muted transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden " +
          (hint ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0")
        }
      >
        <ChevronDown size={18} aria-hidden className={hint ? "nudge" : ""} />
      </button>
    </>
  );
}
