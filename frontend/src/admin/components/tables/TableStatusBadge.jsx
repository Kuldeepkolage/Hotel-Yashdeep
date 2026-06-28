import React from "react";

const STATUS_CONFIG = {
  available: {
    label: "Available",
    bg: "#F0FDF4",
    color: "#16A34A",
    dot: "#22C55E",
  },
  reserved: {
    label: "Reserved",
    bg: "#FFF7ED",
    color: "#C2410C",
    dot: "#F97316",
  },
  occupied: {
    label: "Occupied",
    bg: "#FFF1F2",
    color: "#BE123C",
    dot: "#F43F5E",
  },
  maintenance: {
    label: "Maintenance",
    bg: "#F5F3FF",
    color: "#6D28D9",
    dot: "#8B5CF6",
  },
};

export default function TableStatusBadge({ status, size = "md" }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.available;

  const padding = size === "sm" ? "2px 8px" : "4px 12px";
  const fontSize = size === "sm" ? "11px" : "12px";
  const dotSize = size === "sm" ? "6px" : "7px";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: config.bg,
        color: config.color,
        padding,
        borderRadius: "999px",
        fontSize,
        fontWeight: 600,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: config.dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}