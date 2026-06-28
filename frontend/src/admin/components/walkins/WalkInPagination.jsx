import { ChevronLeft, ChevronRight } from "lucide-react";

function WalkInPagination({ page, totalPages, totalItems, limit, onPageChange }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, totalItems);

  const pages = [];
  const delta = 1;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[var(--border)]">
      <p className="text-xs text-[var(--text-muted)]">
        Showing <span className="font-medium text-[var(--text)]">{from}–{to}</span> of{" "}
        <span className="font-medium text-[var(--text)]">{totalItems}</span> walk-ins
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-muted)]"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`dots-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-xs text-[var(--text-muted)]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all duration-200 ${
                p === page
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:border-[var(--border)] disabled:hover:text-[var(--text-muted)]"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default WalkInPagination;