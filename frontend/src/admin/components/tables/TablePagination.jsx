import React from "react";

export default function TablePagination({ page, totalPages, total, limit, onPageChange }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const btnStyle = (active, disabled) => ({
    width: "34px",
    height: "34px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    border: active ? "none" : "1.5px solid #E5E7EB",
    background: active ? "#3D1A08" : disabled ? "#F9FAFB" : "#fff",
    color: active ? "#fff" : disabled ? "#D1D5DB" : "#374151",
    fontSize: "13px",
    fontWeight: active ? 700 : 500,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s",
  });

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 0",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "13px", color: "#6B7280" }}>
        Showing <strong style={{ color: "#374151" }}>{from}–{to}</strong> of{" "}
        <strong style={{ color: "#374151" }}>{total}</strong> tables
      </span>

      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <button
          style={btnStyle(false, page === 1)}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} style={{ fontSize: "13px", color: "#9CA3AF", padding: "0 4px" }}>
              …
            </span>
          ) : (
            <button
              key={p}
              style={btnStyle(p === page, false)}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button
          style={btnStyle(false, page === totalPages)}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}