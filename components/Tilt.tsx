"use client";

import { useRef, type ReactNode } from "react";

const VARS = ["--mx", "--my", "--rx", "--ry"];

// Tiket miring mengikuti kursor (hanya mouse); stiker di dalamnya terangkat lewat translateZ
export function Tilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const set = (x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      el.style.setProperty("--ry", ((x - 0.5) * 8).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - y) * 6).toFixed(2) + "deg");
    });
  };

  return (
    <div
      ref={ref}
      className="tilt relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.dataset.active = "";
        set((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
      }}
      onPointerLeave={(e) => {
        const el = e.currentTarget;
        cancelAnimationFrame(raf.current);
        delete el.dataset.active;
        VARS.forEach((v) => el.style.removeProperty(v));
      }}
    >
      {children}
    </div>
  );
}
