// src/admin/components/reservations/ConfirmReservationModal.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Table2,
  Users,
  MapPin,
  CheckCircle2,
  Loader2,
  AlertCircle,
  BadgeCheck,
} from "lucide-react";
import { fetchAvailableTables } from "../../services/reservation.service";
import ReservationStatusBadge from "./ReservationStatusBadge";

/**
 * Modal to pick an available table and confirm a reservation.
 *
 * @param {{
 *   reservation: object | null,
 *   open: boolean,
 *   onClose: () => void,
 *   onConfirm: (reservationId: string, tableId: string) => Promise<void>,
 * }} props
 */
export default function ConfirmReservationModal({
  reservation: r,
  open,
  onClose,
  onConfirm,
}) {
  const [tables, setTables]         = useState([]);
  const [selectedTableId, setSelectedTableId] = useState("");
  const [tablesLoading, setTablesLoading]     = useState(false);
  const [tablesError, setTablesError]         = useState("");
  const [submitting, setSubmitting]           = useState(false);
  const [submitError, setSubmitError]         = useState("");

  /* Reset state every time the modal opens with a new reservation */
  useEffect(() => {
    if (!open || !r) return;

    setSelectedTableId("");
    setSubmitError("");
    setTables([]);

    const load = async () => {
      setTablesLoading(true);
      setTablesError("");
      try {
        const res = await fetchAvailableTables({
          reservationDate: r.reservationDate,
          reservationTime: r.reservationTime,
          guests:          r.guests,
        });
        setTables(res.data || []);
      } catch (err) {
        setTablesError(err?.response?.data?.message || err.message || "Failed to load tables.");
      } finally {
        setTablesLoading(false);
      }
    };

    load();
  }, [open, r]);

  /* Escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleConfirm = async () => {
    if (!selectedTableId) {
      setSubmitError("Please select a table before confirming.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      await onConfirm(r._id, selectedTableId);
      onClose();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err.message || "Confirmation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const dateFormatted = r?.reservationDate
    ? new Date(r.reservationDate).toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric",
      })
    : "—";

  return (
    <AnimatePresence>
      {open && r && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-dark/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="
              fixed inset-0 z-50 flex items-center justify-center p-4
              pointer-events-none
            "
          >
            <div
              className="
                pointer-events-auto w-full max-w-lg
                bg-background rounded-3xl shadow-luxe border border-border
                flex flex-col max-h-[90vh] overflow-hidden
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border bg-white rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <BadgeCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest2 text-muted">
                      Confirm reservation
                    </p>
                    <h2 className="font-display text-lg text-dark mt-0.5">
                      {r.customerName}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    h-8 w-8 rounded-xl border border-border
                    flex items-center justify-center text-muted
                    hover:border-primary hover:text-primary transition-all duration-200
                  "
                >
                  <X size={15} />
                </button>
              </div>

              {/* Reservation summary chips */}
              <div className="px-6 py-4 flex flex-wrap gap-2 border-b border-border bg-background/50">
                <Chip icon={BadgeCheck} label={r.bookingId || "—"} />
                <Chip icon={null} label={`${dateFormatted} · ${r.reservationTime}`} />
                <Chip icon={Users} label={`${r.guests} guest${r.guests > 1 ? "s" : ""}`} />
                <ReservationStatusBadge status={r.status} />
              </div>

              {/* Table picker — scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <p className="text-[10px] uppercase tracking-widest2 text-muted font-medium mb-4">
                  Select a table
                </p>

                {tablesLoading && (
                  <div className="flex items-center gap-3 text-sm text-muted py-4">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    Loading available tables…
                  </div>
                )}

                {tablesError && !tablesLoading && (
                  <ErrorBanner msg={tablesError} />
                )}

                {!tablesLoading && !tablesError && tables.length === 0 && (
                  <div className="rounded-xl border border-border bg-white p-6 text-center">
                    <Table2 size={28} className="text-muted mx-auto mb-3" />
                    <p className="text-sm text-dark font-medium">
                      No tables available
                    </p>
                    <p className="text-xs text-muted mt-1">
                      All tables are occupied for this date and time slot.
                    </p>
                  </div>
                )}

                {!tablesLoading && tables.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {tables.map((table) => {
                      const isSelected = selectedTableId === table._id;
                      return (
                        <button
                          key={table._id}
                          type="button"
                          onClick={() => setSelectedTableId(table._id)}
                          className={`
                            relative rounded-2xl border p-4 text-left
                            transition-all duration-200
                            ${isSelected
                              ? "border-primary bg-primary/5 shadow-soft"
                              : "border-border bg-white hover:border-primary/40 hover:shadow-soft"
                            }
                          `}
                        >
                          {/* Selected tick */}
                          {isSelected && (
                            <span className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                              <CheckCircle2 size={12} className="text-background" />
                            </span>
                          )}

                          <div className="flex items-center gap-2 mb-2">
                            <Table2 size={15} className={isSelected ? "text-primary" : "text-muted"} />
                            <span className={`font-display text-lg leading-none ${isSelected ? "text-primary" : "text-dark"}`}>
                              T{table.tableNumber}
                            </span>
                          </div>

                          {table.tableName && (
                            <p className="text-xs text-muted mb-1.5">{table.tableName}</p>
                          )}

                          <div className="flex items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs text-muted">
                              <Users size={10} /> {table.capacity}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted">
                              <MapPin size={10} /> {table.location}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border bg-white px-6 py-4 rounded-b-3xl">
                {submitError && <ErrorBanner msg={submitError} className="mb-3" />}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={submitting || !selectedTableId || tablesLoading}
                    className={`
                      flex-1 h-11 rounded-xl border font-medium text-sm
                      flex items-center justify-center gap-2
                      transition-all duration-200
                      ${!selectedTableId || submitting || tablesLoading
                        ? "bg-border text-muted border-border cursor-not-allowed"
                        : "bg-primary text-background border-primary hover:bg-dark shadow-soft hover:shadow-luxe"
                      }
                    `}
                  >
                    {submitting ? (
                      <><Loader2 size={15} className="animate-spin" /> Confirming…</>
                    ) : (
                      <><BadgeCheck size={15} /> Confirm reservation</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="
                      h-11 px-5 rounded-xl border border-border bg-background
                      text-sm text-muted hover:text-dark hover:border-dark/30
                      transition-all duration-200
                    "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

function Chip({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs text-dark">
      {Icon && <Icon size={11} className="text-muted" />}
      {label}
    </span>
  );
}

function ErrorBanner({ msg, className = "" }) {
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 ${className}`}>
      <AlertCircle size={15} className="shrink-0 mt-0.5" />
      <p>{msg}</p>
    </div>
  );
}