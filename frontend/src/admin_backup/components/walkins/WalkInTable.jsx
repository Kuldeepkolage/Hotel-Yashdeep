import { useState } from "react";
import {
  CalendarDays,
  Users,
  Phone,
  TableProperties,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

const STATUS_CONFIG = {
  waiting:   { label: "Waiting",   bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  seated:    { label: "Seated",    bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  completed: { label: "Completed", bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  dot: "bg-green-500"  },
  cancelled: { label: "Cancelled", bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",    dot: "bg-red-400"    },
  no_show:   { label: "No Show",   bg: "bg-gray-100",  text: "text-gray-600",   border: "border-gray-200",   dot: "bg-gray-400"   },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.waiting;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[1px] ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-[var(--border)]">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-3.5 rounded-md bg-[var(--border)] animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <tr>
      <td colSpan={7}>
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--background)] border border-[var(--border)]">
            <Users size={22} className="text-[var(--text-muted)]" />
          </div>
          <p className="text-base font-semibold text-[var(--text)]">
            {hasFilters ? "No walk-ins found" : "No walk-ins yet"}
          </p>
          <p className="text-sm text-[var(--text-muted)] text-center max-w-xs">
            {hasFilters
              ? "Try adjusting your filters or search query."
              : "Walk-in guests will appear here once recorded."}
          </p>
        </div>
      </td>
    </tr>
  );
}

const COLUMNS = [
  { key: "walkInId", label: "Walk-in ID", sortable: false },
  { key: "customerName", label: "Guest", sortable: true },
  { key: "arrivalTime", label: "Arrived At", sortable: true },
  { key: "guests", label: "Guests", sortable: true },
  { key: "phone", label: "Phone", sortable: false },
  { key: "table", label: "Table", sortable: false },
  { key: "status", label: "Status", sortable: true },
];

function SortIcon({ column, sortKey, sortDir }) {
  if (sortKey !== column) return <ChevronsUpDown size={12} className="text-[var(--border)]" />;
  return sortDir === "asc"
    ? <ChevronUp size={12} className="text-[var(--primary)]" />
    : <ChevronDown size={12} className="text-[var(--primary)]" />;
}

function formatTime(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}

function ActionsMenu({ walkin, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--background)] hover:text-[var(--text)] transition-colors"
        aria-label="Actions"
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_8px_32px_rgba(58,28,28,0.12)] overflow-hidden">
            <button
              onClick={() => { setOpen(false); onEdit(walkin); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--background)] transition-colors"
            >
              <Pencil size={13} className="text-[var(--primary)]" />
              Edit
            </button>
            <button
              onClick={() => { setOpen(false); onDelete(walkin); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function WalkInTable({ walkIns, loading, sortKey, sortDir, onSort, onEdit, onDelete, hasFilters }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full min-w-[720px] border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--background)]">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--text-muted)] ${
                  col.sortable ? "cursor-pointer select-none hover:text-[var(--primary)] transition-colors" : ""
                }`}
                onClick={() => col.sortable && onSort(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />}
                </div>
              </th>
            ))}
            <th className="px-4 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[1.5px] text-[var(--text-muted)]">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
          ) : walkIns.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            walkIns.map((w) => {
              const id = w._id || w.id;
              const shortId = typeof id === "string" ? `#WI-${id.slice(-5).toUpperCase()}` : `#WI-${String(id).slice(-5)}`;
              const tableNum = w.tableNumber || w.table?.tableNumber || w.table?.number;

              return (
                <tr
                  key={id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)] transition-colors duration-150 group"
                >
                  {/* ID */}
                  <td className="px-4 py-4">
                    <span className="font-mono text-xs font-semibold text-[var(--text-muted)] bg-[var(--background)] px-2 py-1 rounded-lg border border-[var(--border)]">
                      {shortId}
                    </span>
                  </td>

                  {/* Guest */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[#9B2C2C] text-white text-xs font-bold font-['Playfair_Display']">
                        {(w.customerName || "?").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{w.customerName || "—"}</p>
                        {w.specialRequest && (
                          <p className="text-[11px] text-[var(--text-muted)] truncate max-w-[160px]" title={w.specialRequest}>
                            {w.specialRequest}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Arrived At */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text)]">
                      <CalendarDays size={13} className="text-[var(--text-muted)] shrink-0" />
                      <span>{formatDate(w.arrivalTime || w.createdAt)}</span>
                      <span className="text-[var(--text-muted)]">{formatTime(w.arrivalTime || w.createdAt)}</span>
                    </div>
                  </td>

                  {/* Guests */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text)]">
                      <Users size={13} className="text-[var(--text-muted)] shrink-0" />
                      {w.guests || 1}
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                      <Phone size={13} className="shrink-0" />
                      {w.phone || "—"}
                    </div>
                  </td>

                  {/* Table */}
                  <td className="px-4 py-4">
                    {tableNum ? (
                      <div className="flex items-center gap-1.5">
                        <TableProperties size={13} className="text-[var(--text-muted)] shrink-0" />
                        <span className="text-sm font-medium text-[var(--text)]">Table {tableNum}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--text-muted)]">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={w.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex justify-end">
                      <ActionsMenu walkin={w} onEdit={onEdit} onDelete={onDelete} />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default WalkInTable;