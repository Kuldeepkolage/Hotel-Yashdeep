// src/admin/components/menu/MenuFilters.jsx
import React from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function MenuFilters({
  filter = "all",
  onFilter,
  sortBy = "created_at",
  onSort,
  // backwards compatibility
  onFilterChange,
  onSortChange,
}) {
  const handleFilterChange = (val) => {
    if (onFilter) onFilter(val);
    else if (onFilterChange) onFilterChange(val);
  };

  const handleSortChange = (val) => {
    if (onSort) onSort(val);
    else if (onSortChange) onSortChange(val);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
      {/* Status & Dietary Filter */}
      <div className="relative">
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="pl-8 pr-7 py-2 rounded-xl border border-border bg-white text-xs sm:text-sm font-medium text-dark
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer shadow-2xs"
        >
          <option value="all">All Dishes</option>
          <option value="veg">Vegetarian</option>
          <option value="non-veg">Non-Vegetarian</option>
          <option value="available">Available Now</option>
          <option value="unavailable">Sold Out / Unavailable</option>
          <option value="recommended">Chef's Picks</option>
          <option value="special">Signature Specials</option>
        </select>
        <SlidersHorizontal size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </div>

      {/* Sort */}
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="pl-8 pr-7 py-2 rounded-xl border border-border bg-white text-xs sm:text-sm font-medium text-dark
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer shadow-2xs"
        >
          <option value="created_at">Sort: Newest</option>
          <option value="name">Sort: Name (A–Z)</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
        <ArrowUpDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </div>
    </div>
  );
}