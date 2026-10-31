const STYLE: Record<string, string> = {
  awaiting_payment: "bg-white/[0.08] text-ink-muted",
  awaiting_verification: "bg-warn/15 text-warn",
  processing: "bg-ice/15 text-ice",
  done: "bg-live/15 text-live",
  rejected: "bg-[#ef4444]/15 text-[#fca5a5]",
  cancelled: "bg-white/[0.06] text-ink-faint",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <span className={"inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " + (STYLE[status] || STYLE.awaiting_payment)}>
      {label}
    </span>
  );
}
