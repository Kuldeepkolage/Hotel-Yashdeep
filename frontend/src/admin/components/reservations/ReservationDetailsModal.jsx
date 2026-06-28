// src/admin/components/reservations/ReservationDetailsModal.jsx

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  Mail,
  CalendarDays,
  Clock,
  Users,
  Table2,
  Hash,
  MessageSquare,
  History,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import ReservationStatusBadge from "./ReservationStatusBadge";

/**
 * Full-detail slide-over panel for a single reservation.
 *
 * @param {{
 *   reservation: object | null,
 *   open: boolean,
 *   onClose: () => void,
 *   onConfirm: (r) => void,
 *   onCancel: (r) => void,
 *   onComplete: (r) => void,
 * }} props
 */
export default function ReservationDetailsModal({
  reservation: r,
  open,
  onClose,
  onConfirm,
  onCancel,
  onComplete,
}) {
  /* lock body scroll while open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* escape key */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const canConfirm  = r && (r.status === "Pending" || r.status === "Rescheduled");
  const canComplete = r && !["Completed", "Cancelled"].includes(r.status);
  const canCancel   = r && !["Completed", "Cancelled"].includes(r.status);

  const dateFormatted = r?.reservationDate
    ? new Date(r.reservationDate).toLocaleDateString("en-IN", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : "—";

  const createdAt = r?.createdAt
    ? new Date(r.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
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

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="
              fixed right-0 top-0 bottom-0 z-50
              w-full max-w-lg bg-background shadow-luxe
              flex flex-col overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-white">
              <div>
                <p className="text-[10px] uppercase tracking-widest2 text-muted">
                  Reservation
                </p>
                <h2 className="font-display text-xl text-dark mt-0.5">
                  {r.customerName}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <ReservationStatusBadge status={r.status} size="md" />
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    h-9 w-9 rounded-xl border border-border bg-background
                    flex items-center justify-center text-muted
                    hover:border-primary hover:text-primary transition-all duration-200
                  "
                  aria-label="Close panel"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Booking ID */}
              <InfoSection title="Booking Reference">
                <InfoRow icon={Hash} label="Booking ID" value={
                  <span className="font-mono text-primary font-semibold tracking-wide">
                    {r.bookingId || "—"}
                  </span>
                } />
                {r.isWalkIn && (
                  <InfoRow icon={null} label="Type" value={
                    <span className="text-[10px] uppercase tracking-widest2 text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-2.5 py-1">
                      Walk-in
                    </span>
                  } />
                )}
                <InfoRow icon={Clock} label="Created" value={createdAt} />
              </InfoSection>

              {/* Guest Info */}
              <InfoSection title="Guest Information">
                <InfoRow icon={User}  label="Name"  value={r.customerName} />
                <InfoRow icon={Phone} label="Phone" value={r.phone} />
                <InfoRow icon={Mail}  label="Email" value={r.email || "—"} />
              </InfoSection>

              {/* Reservation Info */}
              <InfoSection title="Reservation Details">
                <InfoRow icon={CalendarDays} label="Date"   value={dateFormatted} />
                <InfoRow icon={Clock}        label="Time"   value={r.reservationTime} />
                <InfoRow icon={Users}        label="Guests" value={`${r.guests} guest${r.guests > 1 ? "s" : ""}`} />
                <InfoRow
                  icon={Table2}
                  label="Table"
                  value={
                    r.table
                      ? `Table ${r.table.tableNumber}${r.table.tableName ? ` · ${r.table.tableName}` : ""} (seats ${r.table.capacity}, ${r.table.location})`
                      : <span className="text-muted">Not assigned yet</span>
                  }
                />
              </InfoSection>

              {/* Special Request */}
              {r.specialRequest && (
                <InfoSection title="Special Request">
                  <div className="flex items-start gap-3 text-sm text-dark">
                    <MessageSquare size={14} className="text-muted mt-0.5 shrink-0" />
                    <p className="leading-relaxed">{r.specialRequest}</p>
                  </div>
                </InfoSection>
              )}

              {/* Reschedule History */}
              {r.previousReservations?.length > 0 && (
                <InfoSection title="Reschedule History">
                  <div className="flex items-start gap-3">
                    <History size={14} className="text-muted mt-0.5 shrink-0" />
                    <div className="space-y-1.5">
                      {r.previousReservations.map((prev, i) => (
                        <p key={i} className="text-sm text-muted">
                          {new Date(prev.reservationDate).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                          {" "}at {prev.reservationTime}
                        </p>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 ml-5 text-xs text-muted">
                    Rescheduled {r.rescheduleCount} time{r.rescheduleCount !== 1 ? "s" : ""}
                  </p>
                </InfoSection>
              )}
            </div>

            {/* Footer — action buttons */}
            <div className="border-t border-border bg-white px-6 py-4">
              <div className="flex flex-wrap gap-3">
                {canConfirm && (
                  <ActionButton
                    onClick={() => { onConfirm(r); onClose(); }}
                    variant="success"
                    icon={BadgeCheck}
                    label="Confirm"
                  />
                )}
                {canComplete && (
                  <ActionButton
                    onClick={() => { onComplete(r); onClose(); }}
                    variant="slate"
                    icon={CheckCircle2}
                    label="Mark completed"
                  />
                )}
                {canCancel && (
                  <ActionButton
                    onClick={() => { onCancel(r); onClose(); }}
                    variant="danger"
                    icon={XCircle}
                    label="Cancel"
                  />
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="
                    ml-auto h-10 px-4 rounded-xl border border-border bg-background
                    text-sm text-muted hover:text-dark hover:border-dark/30
                    transition-all duration-200
                  "
                >
                  Close
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

function InfoSection({ title, children }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 space-y-3.5">
      <p className="text-[10px] uppercase tracking-widest2 text-muted font-medium pb-2 border-b border-border">
        {title}
      </p>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <span className="flex items-center gap-2 text-xs text-muted shrink-0 min-w-[90px]">
        {Icon && <Icon size={12} />}
        {label}
      </span>
      <span className="text-sm text-dark text-right">{value}</span>
    </div>
  );
}

const VARIANT_STYLES = {
  success: "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600",
  slate:   "bg-slate-600   text-white hover:bg-slate-700   border-slate-600",
  danger:  "bg-red-600     text-white hover:bg-red-700     border-red-600",
};

function ActionButton({ onClick, variant, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium
        transition-all duration-200 ${VARIANT_STYLES[variant]}
      `}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}