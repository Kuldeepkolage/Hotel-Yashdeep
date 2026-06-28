// src/admin/components/menu/MenuSearch.jsx
import React, { useRef } from "react";
import { Search, X } from "lucide-react";

export default function MenuSearch({ value, onChange }) {
  const inputRef = useRef(null);

  return (
    <div className="relative flex-1 min-w-[200px] max-w-xs">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search dishes…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-8 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-800
          placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
      />
      {value && (
        <button
          type="button"
          onClick={() => { onChange(""); inputRef.current?.focus(); }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition"
          aria-label="Clear search"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}