// src/admin/components/reservations/ReservationStatusBadge.jsx

/**
 * Compact status pill for reservation rows and detail views.
 * Colors are intentionally muted / professional to match the
 * existing cream-and-dark admin palette seen in the screenshots.
 */

const CONFIG = {
  Pending: {
    dot: "bg-amber-500",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  Confirmed: {
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  Rescheduled: {
    dot: "bg-blue-500",
    pill: "bg-blue-50 text-blue-700 border-blue-200",
  },
  Completed: {
    dot: "bg-slate-400",
    pill: "bg-slate-50 text-slate-600 border-slate-200",
  },
  Cancelled: {
    dot: "bg-red-400",
    pill: "bg-red-50 text-red-600 border-red-200",
  },
  "Walk-In": {
    dot: "bg-purple-500",
    pill: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

const DEFAULT = {
  dot: "bg-muted",
  pill: "bg-background text-muted border-border",
};

/**
 * @param {{ status: string, size?: "sm" | "md" }} props
 */
export default function ReservationStatusBadge({ status, size = "sm" }) {
  const cfg  = CONFIG[status] || DEFAULT;
  const text = size === "md"
    ? "text-[11px] px-3 py-1.5 tracking-[0.22em]"
    : "text-[10px] px-2.5 py-1 tracking-[0.20em]";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium uppercase
        whitespace-nowrap ${text} ${cfg.pill}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  );
}