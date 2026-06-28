import React from "react";

const SELECT_STYLE = {
  padding: "8px 32px 8px 12px",
  border: "1.5px solid #E5E7EB",
  borderRadius: "10px",
  fontSize: "13px",
  color: "#374151",
  background: "#fff",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
  fontWeight: 500,
};

export default function TableFilters({ filters, onChange, floors, sections }) {
  const handleChange = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
      <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#6B7280" strokeWidth={2}>
        <path d="M3 6h18M7 12h10m-6 6h2" />
      </svg>

      <select
        style={SELECT_STYLE}
        value={filters.status}
        onChange={(e) => handleChange("status", e.target.value)}
      >
        <option value="all">All Statuses</option>
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="occupied">Occupied</option>
        <option value="maintenance">Maintenance</option>
      </select>

      <select
        style={SELECT_STYLE}
        value={filters.floor}
        onChange={(e) => handleChange("floor", e.target.value)}
      >
        <option value="all">All Floors</option>
        {(floors || ["Ground", "1st", "2nd", "Rooftop"]).map((f) => (
          <option key={f} value={f}>
            {f} Floor
          </option>
        ))}
      </select>

      <select
        style={SELECT_STYLE}
        value={filters.section}
        onChange={(e) => handleChange("section", e.target.value)}
      >
        <option value="all">All Sections</option>
        {(sections || ["Indoor", "Outdoor", "Private", "Bar", "Terrace"]).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {(filters.status !== "all" || filters.floor !== "all" || filters.section !== "all") && (
        <button
          onClick={() => onChange({ status: "all", floor: "all", section: "all" })}
          style={{
            padding: "8px 12px",
            border: "1.5px solid #FCA5A5",
            borderRadius: "10px",
            background: "#FFF5F5",
            color: "#DC2626",
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}
    </div>
  );
}