// src/admin/components/reservations/DeleteReservationDialog.jsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

/**
 * Destructive confirmation dialog.
 * Requires the user to read a warning before the delete button activates.
 *
 * @param {{
 *   reservation: object | null,
 *   open: boolean,
 *   onClose: () => void,
 *   onConfirm: (id: string) => Promise<void>,
 * }} props
 */
export default function DeleteReservationDialog({
  reservation: r,
  open,
  onClose,
  onConfirm,
}) {
  const [deleting, setDeleting]   = useState(false);
  const [error, setError]         = useState("");
  const [confirmed, setConfirmed] = useState(false); // checkbox gate

  /* reset state on open */
  useEffect(() => {
    if (open) {
      setDeleting(false);
      setError("");
      setConfirmed(false);
    }
  }, [open]);

  /* escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && !deleting) onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, deleting]);

  const handleDelete = async () => {
    if (!confirmed) return;
    setDeleting(true);
    setError("");
    try {
      await onConfirm(r._id);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Delete failed. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

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
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-dark/50 backdrop-blur-sm"
            onClick={() => !deleting && onClose()}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="
                pointer-events-auto w-full max-w-md
                bg-background rounded-3xl shadow-luxe border border-border overflow-hidden
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-red-600 px-6 pt-6 pb-5">
                <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
                  <Trash2 size={22} className="text-white" />
                </div>
                <p className="text-[10px] uppercase tracking-widest2 text-red-200 font-medium">
                  Permanent action
                </p>
                <h2 className="font-display text-xl text-white mt-1">
                  Delete reservation?
                </h2>
                <button
                  type="button"
                  onClick={() => !deleting && onClose()}
                  disabled={deleting}
                  className="
                    absolute top-5 right-5 h-8 w-8 rounded-xl
                    flex items-center justify-center text-white/60
                    hover:text-white hover:bg-white/15 transition-all duration-150
                  "
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-5">
                {/* Summary */}
                <div className="rounded-2xl border border-border bg-white p-4 space-y-2">
                  <Row label="Guest"      value={r.customerName} />
                  <Row label="Booking ID" value={
                    <span className="font-mono text-primary text-xs">{r.bookingId || "—"}</span>
                  } />
                  <Row label="Date"       value={
                    r.reservationDate
                      ? new Date(r.reservationDate).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })
                      : "—"
                  } />
                  <Row label="Status"     value={
                    <span className="text-[10px] uppercase tracking-widest2 text-muted">
                      {r.status}
                    </span>
                  } />
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700 leading-relaxed">
                    This will <strong>permanently delete</strong> the reservation record.
                    If a table was assigned, it will be freed automatically.
                    This action cannot be undone.
                  </p>
                </div>

                {/* Confirmation checkbox */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    disabled={deleting}
                    className="h-4 w-4 rounded accent-red-600 cursor-pointer"
                  />
                  <span className="text-sm text-dark">
                    I understand this action is permanent
                  </span>
                </label>

                {/* Error */}
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 pb-6">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={!confirmed || deleting}
                  className={`
                    flex-1 h-11 rounded-xl border font-medium text-sm
                    flex items-center justify-center gap-2
                    transition-all duration-200
                    ${!confirmed || deleting
                      ? "bg-border text-muted border-border cursor-not-allowed"
                      : "bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-soft"
                    }
                  `}
                >
                  {deleting ? (
                    <><Loader2 size={15} className="animate-spin" /> Deleting…</>
                  ) : (
                    <><Trash2 size={15} /> Delete reservation</>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={deleting}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted shrink-0">{label}</span>
      <span className="text-dark text-right">{value}</span>
    </div>
  );
}