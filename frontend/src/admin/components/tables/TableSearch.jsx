import React from "react";

export default function TableSearch({ value, onChange }) {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: "220px", maxWidth: "340px" }}>
      <svg
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#9CA3AF",
          pointerEvents: "none",
        }}
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder="Search by table number, floor, section…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "9px 12px 9px 38px",
          border: "1.5px solid #E5E7EB",
          borderRadius: "10px",
          fontSize: "14px",
          color: "#1F2937",
          background: "#fff",
          outline: "none",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#C2410C")}
        onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9CA3AF",
            padding: "2px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}