import { Search, X } from "lucide-react";
import { useRef } from "react";

function WalkInSearch({ value, onChange }) {
  const inputRef = useRef(null);

  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, phone, or walk-in ID..."
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-9 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default WalkInSearch;