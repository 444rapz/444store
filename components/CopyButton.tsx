"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text, label = "Salin" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          /* clipboard tidak tersedia */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-xs text-ink transition-colors hover:bg-raised"
    >
      {done ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      {done ? "Tersalin" : label}
    </button>
  );
}
