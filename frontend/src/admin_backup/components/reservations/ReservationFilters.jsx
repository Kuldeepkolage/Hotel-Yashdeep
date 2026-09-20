// src/admin/components/reservations/ReservationFilters.jsx

import { CalendarDays, ChevronDown, SlidersHorizontal, X } from "lucide-react";

export const ALL_STATUSES = [
  "Pending",
  "Confirmed",
  "Rescheduled",
  "Completed",
  "Cancelled",
  "Walk-In",
];

const STATUS_PILL = {
  Pending:     "bg-amber-50   text-amber-700  border-amber-200",
  Confirmed:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rescheduled: "bg-blue-50    text-blue-700   border-blue-200",
  Completed:   "bg-slate-50   text-slate-600  border-slate-200",
  Cancelled:   "bg-red-50     text-red-600    border-red-200",
  "Walk-In":   "bg-purple-50  text-purple-700 border-purple-200",
};

/**
 * @param {{
 *   filters: { status: string, date: string },
 *   onChange: (key: string, val: string) => void,
 *   onClear: () => void,
 *   totalResults: number,
 * }} props
 */
export default function ReservationFilters({
  filters,
  onChange,
  onClear,
  totalResults,
}) {
  const hasFilters = filters.status || filters.date;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filter label */}
      <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest2 text-muted font-medium">
        <SlidersHorizontal size={13} />
        Filter
      </span>

      {/* Status select */}
      <div className="relative">
        <select
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
          className="
            h-10 appearance-none rounded-xl border border-border bg-white
            pl-3.5 pr-8 text-sm text-dark
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
            transition-all duration-200 cursor-pointer
          "
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown
          size={13}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>

      {/* Date input */}
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-muted">
          <CalendarDays size={14} />
        </span>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => onChange("date", e.target.value)}
          className="
            h-10 rounded-xl border border-border bg-white
            pl-9 pr-3.5 text-sm text-dark
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
            transition-all duration-200 cursor-pointer
          "
        />
      </div>

      {/* Active status pill (visual confirmation) */}
      {filters.status && (
        <span
          className={`
            inline-flex items-center gap-1.5 rounded-full border px-3 py-1
            text-[11px] uppercase tracking-[0.18em] font-medium
            ${STATUS_PILL[filters.status] || "bg-background text-muted border-border"}
          `}
        >
          {filters.status}
        </span>
      )}

      {/* Clear all */}
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="
            flex items-center gap-1.5 h-10 px-3.5 rounded-xl border border-border
            bg-white text-sm text-muted hover:text-primary hover:border-primary
            transition-all duration-200
          "
        >
          <X size={13} />
          Clear
        </button>
      )}

      {/* Result count */}
      <span className="ml-auto text-[11px] uppercase tracking-widest2 text-muted font-medium">
        {totalResults} result{totalResults !== 1 ? "s" : ""}
      </span>
    </div>
  );
}