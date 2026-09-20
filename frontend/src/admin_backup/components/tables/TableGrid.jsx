import TableCard from "./TableCard";
import TableStatusBadge from "./TableStatusBadge";
import React, { useState } from "react";

// ── Loading Skeleton ──────────────────────────────────────────────
function SkeletonCard() {
  const s = (w, h, r = "6px") => ({
    width: w,
    height: h,
    background: "linear-gradient(90deg, #F3F4F6 25%, #E9EAEC 50%, #F3F4F6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s ease-in-out infinite",
    borderRadius: r,
    flexShrink: 0,
  });

  return (
    <div style={{ background: "#fff", border: "1.5px solid #F0EDE8", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={s("56px", "56px", "14px")} />
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={s("80px", "18px")} />
          <div style={s("50px", "12px")} />
        </div>
      </div>
      <div style={s("90px", "24px", "999px")} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={s("100%", "46px", "8px")} />
        <div style={s("100%", "46px", "8px")} />
        <div style={s("100%", "46px", "8px")} />
      </div>
    </div>
  );
}

function SkeletonRow() {
  const s = (w, h = "14px") => ({
    width: w, height: h,
    background: "linear-gradient(90deg, #F3F4F6 25%, #E9EAEC 50%, #F3F4F6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s ease-in-out infinite",
    borderRadius: "4px",
  });
  return (
    <tr>
      {["60px","120px","80px","80px","80px","90px","80px"].map((w, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <div style={s(w)} />
        </td>
      ))}
    </tr>
  );
}

// ── Empty State ───────────────────────────────────────────────────
function EmptyState({ hasFilters, onClear, onCreate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
      <div style={{ width: "72px", height: "72px", background: "#F3F0EB", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#C2A882" strokeWidth={1.5}>
          <rect x="3" y="8" width="18" height="3" rx="1" />
          <path d="M5 11v5M19 11v5M8 16h8" />
        </svg>
      </div>
      <div style={{ fontSize: "18px", fontWeight: 700, color: "#1F2937", marginBottom: "8px" }}>
        {hasFilters ? "No tables match your filters" : "No tables yet"}
      </div>
      <div style={{ fontSize: "14px", color: "#6B7280", maxWidth: "300px", marginBottom: "24px" }}>
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Add your first table to start managing seating and reservations."}
      </div>
      {hasFilters ? (
        <button onClick={onClear} style={OUTLINE_BTN}>Clear Filters</button>
      ) : (
        <button onClick={onCreate} style={PRIMARY_BTN}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add First Table
        </button>
      )}
    </div>
  );
}

const PRIMARY_BTN = {
  display: "flex", alignItems: "center", gap: "7px",
  padding: "10px 20px", background: "#3D1A08", color: "#fff",
  border: "none", borderRadius: "10px", fontSize: "14px",
  fontWeight: 600, cursor: "pointer",
};
const OUTLINE_BTN = {
  padding: "9px 18px", background: "#fff", color: "#374151",
  border: "1.5px solid #D1D5DB", borderRadius: "10px",
  fontSize: "14px", fontWeight: 500, cursor: "pointer",
};

// ── List Row ─────────────────────────────────────────────────────
function TableRow({ table, onEdit, onDelete, onStatusChange }) {
  const [hov, setHov] = useState(false);

  return (
    <tr
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: hov ? "#FAFAF8" : "#fff", transition: "background 0.12s" }}
    >
      <td style={TD}><span style={{ fontWeight: 700, color: "#1F2937" }}>#{table.tableNumber}</span></td>
      <td style={TD}>{table.floor || "—"}</td>
      <td style={TD}>{table.section || "—"}</td>
      <td style={TD}>{table.capacity || "—"} seats</td>
      <td style={TD}><TableStatusBadge status={table.status} size="sm" /></td>
      <td style={{ ...TD, textAlign: "right" }}>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <ActionBtn onClick={() => onEdit(table)} title="Edit">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </ActionBtn>
          <ActionBtn onClick={() => onDelete(table)} title="Delete" danger>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="3,6 5,6 21,6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
          </ActionBtn>
        </div>
      </td>
    </tr>
  );
}

const TD = { padding: "14px 16px", fontSize: "13px", color: "#374151", borderBottom: "1px solid #F3F4F6" };

function ActionBtn({ children, onClick, title, danger }) {
  const [h, setH] = React.useState(false);
  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: "30px", height: "30px", border: `1.5px solid ${h && danger ? "#FCA5A5" : "#E5E7EB"}`,
        borderRadius: "7px", background: h ? (danger ? "#FFF1F2" : "#F3F4F6") : "#fff",
        color: danger ? "#DC2626" : "#6B7280", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.12s",
      }}
    >
      {children}
    </button>
  );
}

// ── useState import needed in TableRow ────────────────────────────


// ── Main Grid Component ───────────────────────────────────────────
export default function TableGrid({
  tables,
  loading,
  view,
  hasFilters,
  onClearFilters,
  onCreate,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      {view === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "18px",
          }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : tables.length === 0
            ? <div style={{ gridColumn: "1/-1" }}>
                <EmptyState hasFilters={hasFilters} onClear={onClearFilters} onCreate={onCreate} />
              </div>
            : tables.map((t) => (
                <TableCard
                  key={t._id || t.id}
                  table={t}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              ))}
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1.5px solid #F0EDE8", borderRadius: "16px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#FAFAF8" }}>
                {["Table #", "Floor", "Section", "Capacity", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px", textAlign: h === "Actions" ? "right" : "left",
                      fontSize: "11px", fontWeight: 700, color: "#6B7280",
                      letterSpacing: "0.06em", textTransform: "uppercase",
                      borderBottom: "1.5px solid #F0EDE8",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : tables.length === 0
                ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState hasFilters={hasFilters} onClear={onClearFilters} onCreate={onCreate} />
                    </td>
                  </tr>
                )
                : tables.map((t) => (
                    <TableRow
                      key={t._id || t.id}
                      table={t}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}