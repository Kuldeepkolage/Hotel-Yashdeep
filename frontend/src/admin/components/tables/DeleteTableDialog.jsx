import React, { useEffect } from "react";

export default function DeleteTableDialog({ open, table, onClose, onConfirm, loading }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open || !table) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1100, padding: "20px", backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "400px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          animation: "modalIn 0.18s ease",
          overflow: "hidden",
        }}
      >
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>

        <div style={{ padding: "28px 28px 24px", textAlign: "center" }}>
          {/* Warning icon */}
          <div style={{
            width: "60px", height: "60px", borderRadius: "16px",
            background: "#FFF1F2", border: "1.5px solid #FECDD3",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 18px",
          }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#DC2626" strokeWidth={1.8}>
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4h6v2" />
            </svg>
          </div>

          <div style={{ fontSize: "18px", fontWeight: 700, color: "#1F2937", marginBottom: "8px" }}>
            Delete Table {table.tableNumber}?
          </div>
          <div style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6, maxWidth: "290px", margin: "0 auto" }}>
            This will permanently remove{" "}
            <strong style={{ color: "#374151" }}>Table {table.tableNumber}</strong>{" "}
            ({table.section}, {table.floor} Floor, {table.capacity} seats).
            This action cannot be undone.
          </div>
        </div>

        <div style={{
          padding: "16px 28px 24px",
          display: "flex", flexDirection: "column", gap: "10px",
        }}>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "12px", border: "none", borderRadius: "11px",
              background: loading ? "#9CA3AF" : "#DC2626", color: "#fff",
              fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "background 0.15s",
            }}
          >
            {loading ? (
              <>
                <svg style={{ animation: "spin 0.8s linear infinite" }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Deleting…
              </>
            ) : (
              <>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="3,6 5,6 21,6" /><path d="M19 6l-1 14H6L5 6" />
                </svg>
                Yes, Delete Table
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: "12px", border: "1.5px solid #E5E7EB", borderRadius: "11px",
              background: "#fff", color: "#374151", fontSize: "14px",
              fontWeight: 600, cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
        <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
      </div>
    </div>
  );
}