// src/admin/components/menu/PriceInput.jsx
import React from "react";

/**
 * Controlled price input that accepts a numeric string value.
 * Renders ₹ prefix, validates min=0, step=0.01.
 */
export default function PriceInput({ value, onChange, error, disabled = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1">
        Price <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-semibold text-sm select-none">
          ₹
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full pl-7 pr-3 py-2.5 rounded-lg border text-sm bg-white text-stone-800
            focus:outline-none focus:ring-2 focus:ring-amber-400 transition
            ${error ? "border-red-400 focus:ring-red-300" : "border-stone-300"}
            ${disabled ? "opacity-50 cursor-not-allowed bg-stone-50" : ""}`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}