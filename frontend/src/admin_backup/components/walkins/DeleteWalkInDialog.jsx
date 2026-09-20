import { useEffect, useRef } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

function DeleteWalkInDialog({ walkin, loading, onConfirm, onCancel }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  if (!walkin) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[var(--surface)] shadow-[0_24px_64px_rgba(58,28,28,0.18)] border border-[var(--border)] overflow-hidden">

        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 border border-red-100">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[var(--text)]">
              Delete Walk-in
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">
              This action cannot be undone.
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-[var(--background)] transition-colors text-[var(--text-muted)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 bg-[var(--background)] mx-6 rounded-xl border border-[var(--border)]">
          <p className="text-sm text-[var(--text)] leading-relaxed">
            You are about to permanently delete the walk-in record for{" "}
            <span className="font-semibold text-[var(--primary)]">{walkin.customerName}</span>.
            {walkin.tableNumber && (
              <>
                {" "}Table <span className="font-semibold">{walkin.tableNumber}</span> will be freed up.
              </>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 p-6 pt-5">
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--background)] transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(walkin._id || walkin.id)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteWalkInDialog;