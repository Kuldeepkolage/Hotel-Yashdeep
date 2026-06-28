import React, { useState } from "react";
import TableStatusBadge from "./TableStatusBadge";

const STATUS_COLORS = {
  available: { bg: "#F0FDF4", border: "#BBF7D0", icon: "#16A34A" },
  reserved: { bg: "#FFF7ED", border: "#FED7AA", icon: "#C2410C" },
  occupied: { bg: "#FFF1F2", border: "#FECDD3", icon: "#BE123C" },
  maintenance: { bg: "#F5F3FF", border: "#DDD6FE", icon: "#6D28D9" },
};

function TableIcon({ status }) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.available;
  return (
    <div
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "14px",
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke={c.icon} strokeWidth={1.8}>
        <rect x="3" y="8" width="18" height="3" rx="1" />
        <path d="M5 11v5M19 11v5M8 16h8" />
      </svg>
    </div>
  );
}

export default function TableCard({ table, onEdit, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const statusOptions = ["available", "reserved", "occupied", "maintenance"].filter(
    (s) => s !== table.status
  );

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? "#E5C49A" : "#F0EDE8"}`,
        borderRadius: "16px",
        padding: "20px",
        position: "relative",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: hovered ? "0 4px 20px rgba(61,26,8,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        cursor: "default",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
          <TableIcon status={table.status} />
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#1F2937", lineHeight: 1.2 }}>
              Table {table.tableNumber}
            </div>
            <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
              #{table._id?.slice(-6) || table._id?.slice(-6) || "—"}
            </div>
          </div>
        </div>

        {/* Menu button */}
        <div style={{ position: "relative" }}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            style={{
              width: "32px",
              height: "32px",
              border: "1.5px solid #E5E7EB",
              borderRadius: "8px",
              background: menuOpen ? "#F3F4F6" : "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B7280",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "38px",
                background: "#fff",
                border: "1.5px solid #E5E7EB",
                borderRadius: "12px",
                boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                zIndex: 50,
                minWidth: "170px",
                overflow: "hidden",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: "6px" }}>
                <MenuItem icon="edit" label="Edit Table" onClick={() => { onEdit(table); setMenuOpen(false); }} />
                <div style={{ height: "1px", background: "#F3F4F6", margin: "4px 0" }} />
                <div style={{ padding: "4px 8px", fontSize: "11px", color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Set Status
                </div>
                {statusOptions.map((s) => (
                  <MenuItem
                    key={s}
                    label={s.charAt(0).toUpperCase() + s.slice(1)}
                    statusColor={STATUS_COLORS[s].icon}
                    onClick={() => { onStatusChange(table._id || table._id, s); setMenuOpen(false); }}
                  />
                ))}
                <div style={{ height: "1px", background: "#F3F4F6", margin: "4px 0" }} />
                <MenuItem icon="delete" label="Delete Table" danger onClick={() => { onDelete(table); setMenuOpen(false); }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div>
        <TableStatusBadge status={table.status} />
      </div>

      {/* Info grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <InfoChip label="Floor" value={table.floor || "—"} />
        <InfoChip label="Section" value={table.section || "—"} />
        <InfoChip label="Capacity" value={`${table.capacity || 0} seats`} />
      </div>
    </div>
  );
}

function InfoChip({ label, value }) {
  return (
    <div style={{ background: "#FAFAF9", borderRadius: "8px", padding: "8px 10px" }}>
      <div style={{ fontSize: "10px", color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "2px" }}>
        {label}
      </div>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{value}</div>
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger, statusColor }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 10px",
        borderRadius: "8px",
        border: "none",
        background: hov ? (danger ? "#FFF1F2" : "#F3F4F6") : "transparent",
        color: danger ? "#DC2626" : "#374151",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {statusColor && (
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
      )}
      {icon === "edit" && (
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      )}
      {icon === "delete" && (
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <polyline points="3,6 5,6 21,6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
        </svg>
      )}
      {label}
    </button>
  );
}