// src/admin/components/reservations/ReservationTable.jsx

import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Trash2,
  BadgeCheck,
  Users,
  Clock,
  CalendarDays,
  Phone,
  Hash,
  ArrowUpDown,
} from "lucide-react";
import ReservationStatusBadge from "./ReservationStatusBadge";

/**
 * @param {{
 *   reservations: Array,
 *   loading: boolean,
 *   onView: (r) => void,
 *   onConfirm: (r) => void,
 *   onCancel: (r) => void,
 *   onComplete: (r) => void,
 *   onDelete: (r) => void,
 *   sort: { key: string, dir: "asc"|"desc" },
 *   onSort: (key: string) => void,
 * }} props
 */
export default function ReservationTable({
  reservations,
  loading,
  onView,
  onConfirm,
  onCancel,
  onComplete,
  onDelete,
  sort,
  onSort,
}) {
  /* ── column definitions ───────────────────────────────────────────── */
  const columns = [
    { key: "bookingId",       label: "Booking ID",  icon: Hash,         sortable: true  },
    { key: "customerName",    label: "Guest",        icon: null,         sortable: true  },
    { key: "reservationDate", label: "Date & Time",  icon: CalendarDays, sortable: true  },
    { key: "guests",          label: "Guests",       icon: Users,        sortable: false },
    { key: "phone",           label: "Phone",        icon: Phone,        sortable: false },
    { key: "table",           label: "Table",        icon: null,         sortable: false },
    { key: "status",          label: "Status",       icon: null,         sortable: true  },
    { key: "actions",         label: "",             icon: null,         sortable: false },
  ];

  /* ── loading skeleton ─────────────────────────────────────────────── */
  if (loading) {
return (
  <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-soft">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px]">
        <TableHead columns={columns} sort={sort} onSort={onSort} />

        <tbody className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </tbody>

      </table>
    </div>
  </div>
);
  }

  /* ── empty state ──────────────────────────────────────────────────── */
  if (reservations.length === 0) {
return (
  <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-soft">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px]">
        <TableHead columns={columns} sort={sort} onSort={onSort} />

        <tbody>
          <tr>
            <td colSpan={8}>
              <div className="py-20 text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-border/50 flex items-center justify-center">
                  <CalendarDays size={22} className="text-muted" />
                </div>

                <p className="font-display text-lg text-dark">
                  No reservations found
                </p>

                <p className="mt-2 text-sm text-muted">
                  Try adjusting your filters or search query.
                </p>
              </div>
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
);
  }

  /* ── table ────────────────────────────────────────────────────────── */
  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <TableHead columns={columns} sort={sort} onSort={onSort} />
          <tbody className="divide-y divide-border">
            <AnimatePresence initial={false}>
              {reservations.map((r, i) => (
                <ReservationRow
                  key={r._id}
                  reservation={r}
                  index={i}
                  onView={onView}
                  onConfirm={onConfirm}
                  onCancel={onCancel}
                  onComplete={onComplete}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── TableHead ─────────────────────────────────────────────────────────────── */
function TableHead({ columns, sort, onSort }) {
  return (
    <thead className="bg-background border-b border-border">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className="px-4 py-3 text-left"
          >
            {col.sortable ? (
              <button
                type="button"
                onClick={() => onSort(col.key)}
                className="
                  inline-flex items-center gap-1.5
                  text-[10px] uppercase tracking-widest2 text-muted font-medium
                  hover:text-primary transition-colors duration-150
                "
              >
                {col.icon && <col.icon size={11} />}
                {col.label}
                <ArrowUpDown
                  size={10}
                  className={
                    sort.key === col.key ? "text-primary" : "text-border"
                  }
                />
              </button>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest2 text-muted font-medium">
                {col.icon && <col.icon size={11} />}
                {col.label}
              </span>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/* ── ReservationRow ────────────────────────────────────────────────────────── */
function ReservationRow({ reservation: r, index, onView, onConfirm, onCancel, onComplete, onDelete }) {
  const isPending    = r.status === "Pending";
  const isRescheduled = r.status === "Rescheduled";
  const canConfirm   = isPending || isRescheduled;
  const canComplete  = !["Completed", "Cancelled"].includes(r.status);
  const canCancel    = !["Completed", "Cancelled"].includes(r.status);

  const dateFormatted = r.reservationDate
    ? new Date(r.reservationDate).toLocaleDateString("en-IN", {
        day:   "2-digit",
        month: "short",
        year:  "numeric",
      })
    : "—";

  const tableLabel = r.table
    ? `T${r.table.tableNumber}${r.table.tableName ? ` · ${r.table.tableName}` : ""}`
    : <span className="text-muted/50">—</span>;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, delay: index * 0.025 }}
      className="group hover:bg-background/60 transition-colors duration-150"
    >
      {/* Booking ID */}
      <td className="px-4 py-3.5">
        <span className="font-mono text-xs text-primary font-semibold tracking-wide">
          {r.bookingId || "—"}
        </span>
        {r.isWalkIn && (
          <span className="ml-2 text-[9px] uppercase tracking-widest2 text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-1.5 py-0.5">
            Walk-in
          </span>
        )}
      </td>

      {/* Guest */}
      <td className="px-4 py-3.5">
        <p className="text-sm font-medium text-dark leading-tight">{r.customerName}</p>
        {r.email && (
          <p className="text-xs text-muted truncate max-w-[160px]">{r.email}</p>
        )}
      </td>

      {/* Date & Time */}
      <td className="px-4 py-3.5">
        <p className="text-sm text-dark">{dateFormatted}</p>
        <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
          <Clock size={10} />
          {r.reservationTime}
        </p>
      </td>

      {/* Guests */}
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center gap-1 text-sm text-dark">
          <Users size={13} className="text-muted" />
          {r.guests}
        </span>
      </td>

      {/* Phone */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-dark">{r.phone}</span>
      </td>

      {/* Table */}
      <td className="px-4 py-3.5">
        <span className="text-sm text-dark">{tableLabel}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-3.5">
        <ReservationStatusBadge status={r.status} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
          {/* View */}
          <ActionBtn
            onClick={() => onView(r)}
            title="View details"
            className="hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          >
            <Eye size={14} />
          </ActionBtn>

          {/* Confirm */}
          {canConfirm && (
            <ActionBtn
              onClick={() => onConfirm(r)}
              title="Confirm reservation"
              className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
            >
              <BadgeCheck size={14} />
            </ActionBtn>
          )}

          {/* Complete */}
          {canComplete && (
            <ActionBtn
              onClick={() => onComplete(r)}
              title="Mark completed"
              className="hover:bg-slate-100 hover:text-slate-600 hover:border-slate-200"
            >
              <CheckCircle2 size={14} />
            </ActionBtn>
          )}

          {/* Cancel */}
          {canCancel && (
            <ActionBtn
              onClick={() => onCancel(r)}
              title="Cancel reservation"
              className="hover:bg-red-50 hover:text-red-500 hover:border-red-200"
            >
              <XCircle size={14} />
            </ActionBtn>
          )}

          {/* Delete */}
          <ActionBtn
            onClick={() => onDelete(r)}
            title="Delete permanently"
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          >
            <Trash2 size={14} />
          </ActionBtn>
        </div>
      </td>
    </motion.tr>
  );
}

/* ── ActionBtn ─────────────────────────────────────────────────────────────── */
function ActionBtn({ children, onClick, title, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        h-7 w-7 rounded-lg border border-border bg-white
        flex items-center justify-center text-muted
        transition-all duration-150 ${className}
      `}
    >
      {children}
    </button>
  );
}

/* ── SkeletonRow ───────────────────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[120, 160, 120, 60, 120, 80, 90, 120].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div
            className="h-3.5 rounded-full bg-border"
            style={{ width: w }}
          />
        </td>
      ))}
    </tr>
  );
}