import React, { useState, useEffect, useRef } from "react";

const FLOORS = ["Ground", "1st", "2nd", "Rooftop", "Basement"];
const SECTIONS = ["Indoor", "Outdoor", "Private", "Bar", "Terrace", "Garden"];
const STATUSES = [
  { value: "available", label: "Available", color: "#16A34A" },
  { value: "reserved", label: "Reserved", color: "#C2410C" },
  { value: "occupied", label: "Occupied", color: "#BE123C" },
  { value: "maintenance", label: "Maintenance", color: "#6D28D9" },
];

const INITIAL = {
  tableNumber: "",
  capacity: "",
  floor: "Ground",
  section: "Indoor",
  status: "available",
};

function Field({ label, error, children, required }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151", letterSpacing: "0.02em" }}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: "11px", color: "#DC2626" }}>{error}</span>}
    </div>
  );
}

const INPUT_STYLE = (err) => ({
  padding: "9px 12px",
  border: `1.5px solid ${err ? "#FCA5A5" : "#E5E7EB"}`,
  borderRadius: "9px",
  fontSize: "14px",
  color: "#1F2937",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  background: "#fff",
  transition: "border-color 0.15s",
});

const SELECT_STYLE = (err) => ({
  ...INPUT_STYLE(err),
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "36px",
  cursor: "pointer",
});

export default function TableFormModal({ open, table, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const firstRef = useRef(null);
  const isEdit = !!table;

  useEffect(() => {
    if (open) {
      setForm(table ? {
        tableNumber: table.tableNumber ?? "",
        capacity: table.capacity ?? "",
        floor: table.floor ?? "Ground",
        section: table.section ?? "Indoor",
        status: table.status ?? "available",
      } : INITIAL);
      setErrors({});
      setTimeout(() => firstRef.current?.focus(), 80);
    }
  }, [open, table]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const validate = () => {
    const errs = {};
    if (!String(form.tableNumber).trim()) errs.tableNumber = "Table number is required";
    if (!form.capacity || Number(form.capacity) < 1) errs.capacity = "Capacity must be at least 1";
    if (Number(form.capacity) > 50) errs.capacity = "Capacity seems too high (max 50)";
    return errs;
  };

  const handleChange = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit({ ...form, capacity: Number(form.capacity), tableNumber: String(form.tableNumber).trim() });
  };

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "20px", backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "480px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          animation: "modalIn 0.2s ease",
          overflow: "hidden",
        }}
      >
        <style>{`@keyframes modalIn { from { opacity:0; transform:scale(0.96) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }`}</style>

        {/* Header */}
        <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#1F2937" }}>
              {isEdit ? "Edit Table" : "Add New Table"}
            </div>
            <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
              {isEdit ? `Editing Table ${table.tableNumber}` : "Configure a new seating table"}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: "32px", height: "32px", border: "1.5px solid #E5E7EB", borderRadius: "8px", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280" }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Table Number + Capacity row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <Field label="Table Number" error={errors.tableNumber} required>
              <input
                ref={firstRef}
                type="text"
                placeholder="e.g. 1, 2A, VIP-1"
                value={form.tableNumber}
                onChange={(e) => handleChange("tableNumber", e.target.value)}
                style={INPUT_STYLE(errors.tableNumber)}
                onFocus={(e) => (e.target.style.borderColor = "#3D1A08")}
                onBlur={(e) => (e.target.style.borderColor = errors.tableNumber ? "#FCA5A5" : "#E5E7EB")}
              />
            </Field>
            <Field label="Capacity (seats)" error={errors.capacity} required>
              <input
                type="number"
                min={1}
                max={50}
                placeholder="e.g. 4"
                value={form.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                style={INPUT_STYLE(errors.capacity)}
                onFocus={(e) => (e.target.style.borderColor = "#3D1A08")}
                onBlur={(e) => (e.target.style.borderColor = errors.capacity ? "#FCA5A5" : "#E5E7EB")}
              />
            </Field>
          </div>

          {/* Floor + Section row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <Field label="Floor">
              <select value={form.floor} onChange={(e) => handleChange("floor", e.target.value)} style={SELECT_STYLE()}>
                {FLOORS.map((f) => <option key={f} value={f}>{f} Floor</option>)}
              </select>
            </Field>
            <Field label="Section">
              <select value={form.section} onChange={(e) => handleChange("section", e.target.value)} style={SELECT_STYLE()}>
                {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* Status */}
          <Field label="Status">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {STATUSES.map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => handleChange("status", value)}
                  style={{
                    padding: "7px 14px", borderRadius: "8px",
                    border: `1.5px solid ${form.status === value ? color : "#E5E7EB"}`,
                    background: form.status === value ? `${color}15` : "#fff",
                    color: form.status === value ? color : "#6B7280",
                    fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "6px",
                    transition: "all 0.12s",
                  }}
                >
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color }} />
                  {label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F3F4F6", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{ padding: "10px 18px", border: "1.5px solid #E5E7EB", borderRadius: "10px", background: "#fff", color: "#374151", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "10px 22px", border: "none", borderRadius: "10px",
              background: loading ? "#9CA3AF" : "#3D1A08", color: "#fff",
              fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: "8px", minWidth: "110px", justifyContent: "center",
              transition: "background 0.15s",
            }}
          >
            {loading ? (
              <>
                <svg style={{ animation: "spin 0.8s linear infinite" }} width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Saving…
              </>
            ) : isEdit ? "Save Changes" : "Add Table"}
          </button>
        </div>
        <style>{`@keyframes spin { to { transform:rotate(360deg) } }`}</style>
      </div>
    </div>
  );
}