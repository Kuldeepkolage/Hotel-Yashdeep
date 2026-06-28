// src/admin/components/reservations/ReservationSearch.jsx

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

/**
 * Debounced search input.
 *
 * @param {{
 *   value: string,
 *   onChange: (v: string) => void,
 *   placeholder?: string,
 *   debounceMs?: number
 * }} props
 */
export default function ReservationSearch({
  value,
  onChange,
  placeholder = "Search by name, phone, or booking ID…",
  debounceMs = 300,
}) {
  const [local, setLocal]   = useState(value);
  const timerRef            = useRef(null);

  // Keep local in sync when parent resets value (e.g. "Clear all filters")
  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setLocal(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), debounceMs);
  };

  const handleClear = () => {
    setLocal("");
    clearTimeout(timerRef.current);
    onChange("");
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* Leading icon */}
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Search size={15} className="text-muted" />
      </span>

      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full h-10 rounded-xl border border-border bg-white
          pl-9 pr-9 text-sm text-dark placeholder:text-muted/60
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10
          transition-all duration-200
        "
      />

      {/* Clear button */}
      {local && (
        <button
          type="button"
          onClick={handleClear}
          className="
            absolute inset-y-0 right-0 flex items-center pr-3
            text-muted hover:text-dark transition-colors duration-150
          "
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}