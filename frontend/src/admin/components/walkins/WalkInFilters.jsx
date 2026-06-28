import { Filter, CalendarDays } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "seated", label: "Seated" },
  { value: "waiting", label: "Waiting" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No Show" },
];

function WalkInFilters({ status, date, onStatusChange, onDateChange, resultCount }) {
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Filter label */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-[1.5px]">
        <Filter size={13} />
        <span>Filter</span>
      </div>

      {/* Status dropdown */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-3.5 pr-8 py-2 text-sm text-[var(--text)] outline-none transition-colors duration-200 focus:border-[var(--primary)] cursor-pointer"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      {/* Date picker */}
      <div className="relative flex items-center">
        <CalendarDays size={14} className="absolute left-3 text-[var(--text-muted)] pointer-events-none" />
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 py-2 text-sm text-[var(--text)] outline-none transition-colors duration-200 focus:border-[var(--primary)] cursor-pointer"
        />
      </div>

      {/* Today shortcut */}
      <button
        onClick={() => onDateChange(date === todayStr ? "" : todayStr)}
        className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
          date === todayStr
            ? "bg-[var(--primary)] text-white shadow-sm"
            : "border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
        }`}
      >
        Today
      </button>

      {/* Result count */}
      <span className="ml-auto text-xs text-[var(--text-muted)] uppercase tracking-[1.5px]">
        {resultCount} {resultCount === 1 ? "result" : "results"}
      </span>
    </div>
  );
}

export default WalkInFilters;