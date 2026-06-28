import { useState, useEffect, useRef } from "react";
import { X, Loader2, User, Phone, Users, TableProperties, FileText, ChevronDown } from "lucide-react";
import { fetchAvailableTables } from "../../services/walkin.service";

const STATUS_OPTIONS = [
  { value: "waiting", label: "Waiting" },
  { value: "seated", label: "Seated" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No Show" },
];

const INITIAL_FORM = {
  customerName: "",
  phone: "",
  guests: "1",
  tableId: "",
  specialRequest: "",
  status: "waiting",
};

const VALIDATION = {
  customerName: (v) => (!v.trim() ? "Customer name is required" : v.trim().length < 2 ? "Name must be at least 2 characters" : ""),
  phone: (v) => (!v.trim() ? "Phone number is required" : !/^[0-9+\s\-()]{7,15}$/.test(v.trim()) ? "Enter a valid phone number" : ""),
  guests: (v) => (!v ? "Number of guests is required" : Number(v) < 1 ? "Minimum 1 guest" : Number(v) > 50 ? "Maximum 50 guests" : ""),
  tableId: () => "",
  specialRequest: () => "",
  status: () => "",
};

function FieldWrapper({ label, error, required, children, icon: Icon }) {
  return (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-[2px] text-[var(--text-muted)] mb-1.5">
        {label}
        {required && <span className="text-[var(--primary)] ml-0.5">*</span>}
      </label>
      <div className={`relative ${Icon ? "flex items-center" : ""}`}>
        {Icon && (
          <Icon
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none z-10"
          />
        )}
        {children}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function WalkInForm({ mode = "create", initialData = null, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [tables, setTables] = useState([]);
  const [tablesLoading, setTablesLoading] = useState(false);
  const firstInputRef = useRef(null);

  // Populate form for edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        customerName: initialData.customerName || "",
        phone: initialData.phone || "",
        guests: String(initialData.guests || 1),
        tableId: initialData.tableId || initialData.table?._id || "",
        specialRequest: initialData.specialRequest || "",
        status: initialData.status || "waiting",
      });
    }
  }, [mode, initialData]);

  // Load available tables
  useEffect(() => {
    setTablesLoading(true);
    fetchAvailableTables()
      .then((data) => setTables(data?.tables || data || []))
      .catch(() => setTables([]))
      .finally(() => setTablesLoading(false));
  }, []);

  // Focus first field
  useEffect(() => {
    const timer = setTimeout(() => firstInputRef.current?.focus(), 80);
    return () => clearTimeout(timer);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function validateField(name, value) {
    return VALIDATION[name] ? VALIDATION[name](value) : "";
  }

  function validateAll() {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const err = validateField(key, form[key]);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;

    const payload = {
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      guests: Number(form.guests),
      status: form.status,
      ...(form.tableId && { tableId: form.tableId }),
      ...(form.specialRequest.trim() && { specialRequest: form.specialRequest.trim() }),
    };

    onSubmit(payload);
  }

  const inputBase =
    "w-full rounded-xl border bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)]/10";

  const inputClass = (field) =>
    `${inputBase} ${
      errors[field] && touched[field]
        ? "border-red-300 focus:border-red-400"
        : "border-[var(--border)] focus:border-[var(--primary)]"
    }`;

  const iconInputClass = (field) => `${inputClass(field)} pl-10`;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-[var(--surface)] shadow-[0_32px_80px_rgba(58,28,28,0.22)] border border-[var(--border)]">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[var(--surface)] px-6 py-5 border-b border-[var(--border)]">
          <div>
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[var(--text)]">
              {mode === "edit" ? "Edit Walk-in" : "New Walk-in"}
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              {mode === "edit" ? "Update walk-in details below." : "Register a new walk-in guest."}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--text)] transition-all duration-200 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-6 flex flex-col gap-5">

            {/* Customer Name */}
            <FieldWrapper label="Customer Name" required error={touched.customerName && errors.customerName} icon={User}>
              <input
                ref={firstInputRef}
                type="text"
                value={form.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                onBlur={() => handleBlur("customerName")}
                placeholder="Full name"
                className={iconInputClass("customerName")}
                autoComplete="off"
              />
            </FieldWrapper>

            {/* Phone */}
            <FieldWrapper label="Phone Number" required error={touched.phone && errors.phone} icon={Phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                onBlur={() => handleBlur("phone")}
                placeholder="+91 XXXXX XXXXX"
                className={iconInputClass("phone")}
                autoComplete="off"
              />
            </FieldWrapper>

            {/* Guests + Status row */}
            <div className="grid grid-cols-2 gap-4">
              <FieldWrapper label="Guests" required error={touched.guests && errors.guests} icon={Users}>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={form.guests}
                  onChange={(e) => handleChange("guests", e.target.value)}
                  onBlur={() => handleBlur("guests")}
                  className={iconInputClass("guests")}
                />
              </FieldWrapper>

              <FieldWrapper label="Status">
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 pr-8 py-2.5 text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                </div>
              </FieldWrapper>
            </div>

            {/* Assign Table */}
            <FieldWrapper label="Assign Table" icon={TableProperties}>
              <div className="relative">
                <TableProperties
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none z-10"
                />
                <select
                  value={form.tableId}
                  onChange={(e) => handleChange("tableId", e.target.value)}
                  disabled={tablesLoading}
                  className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-8 py-2.5 text-sm text-[var(--text)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 disabled:opacity-60"
                >
                  <option value="">
                    {tablesLoading ? "Loading tables..." : "No table assigned"}
                  </option>
                  {tables.map((t) => (
                    <option key={t._id || t.id} value={t._id || t.id}>
                      Table {t.tableNumber || t.number} — {t.capacity} seats
                      {t.location ? ` (${t.location})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              </div>
            </FieldWrapper>

            {/* Special Request */}
            <FieldWrapper label="Special Request" icon={FileText}>
              <div className="relative">
                <FileText
                  size={14}
                  className="absolute left-3.5 top-3 text-[var(--text-muted)] pointer-events-none z-10"
                />
                <textarea
                  value={form.specialRequest}
                  onChange={(e) => handleChange("specialRequest", e.target.value)}
                  placeholder="Any dietary needs, seating preferences, celebrations..."
                  rows={3}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/10 resize-none"
                />
              </div>
            </FieldWrapper>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-[var(--surface)] flex items-center justify-end gap-3 px-6 py-5 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--background)] transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-[0_6px_18px_rgba(122,31,31,0.3)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading
                ? mode === "edit" ? "Saving..." : "Creating..."
                : mode === "edit" ? "Save Changes" : "Create Walk-in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WalkInForm;