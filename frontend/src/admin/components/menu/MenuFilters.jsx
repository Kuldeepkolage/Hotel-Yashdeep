// src/admin/components/menu/MenuFilters.jsx
// Backend supports: ?category=<exact> and ?available=true|false
// Price filter + sort are done client-side (no backend pagination)
import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { MENU_CATEGORIES } from "../../services/menu.service.js";

export default function MenuFilters({
  // backend-side filters (trigger re-fetch)
  categoryFilter,
  onCategoryChange,
  availabilityFilter,
  onAvailabilityChange,
  // client-side filters (no re-fetch)
  vegFilter,
  onVegFilterChange,
  priceMax,
  onPriceMaxChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Category */}
      <div className="relative">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="pl-3 pr-7 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700
            focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {MENU_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <SlidersHorizontal size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
      </div>

      {/* Availability */}
      <select
        value={availabilityFilter}
        onChange={(e) => onAvailabilityChange(e.target.value)}
        className="pl-3 pr-7 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700
          focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
      >
        <option value="">All Status</option>
        <option value="true">Available</option>
        <option value="false">Out of Stock</option>
      </select>

      {/* Veg / Non-Veg (client-side) */}
      <select
        value={vegFilter}
        onChange={(e) => onVegFilterChange(e.target.value)}
        className="pl-3 pr-7 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700
          focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
      >
        <option value="">Veg & Non-Veg</option>
        <option value="veg">Veg Only</option>
        <option value="nonveg">Non-Veg Only</option>
      </select>

      {/* Max Price (client-side) */}
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-semibold select-none">₹</span>
        <input
          type="number"
          min="0"
          placeholder="Max price"
          value={priceMax}
          onChange={(e) => onPriceMaxChange(e.target.value)}
          className="pl-6 pr-3 py-2 w-28 rounded-lg border border-stone-200 bg-white text-sm text-stone-700
            focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        />
      </div>

      {/* Sort (client-side) */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="pl-3 pr-7 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700
          focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none cursor-pointer"
      >
        <option value="default">Sort: Default</option>
        <option value="name_asc">Name A–Z</option>
        <option value="name_desc">Name Z–A</option>
        <option value="price_asc">Price: Low → High</option>
        <option value="price_desc">Price: High → Low</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
      </select>
    </div>
  );
}