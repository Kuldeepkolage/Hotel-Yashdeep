// src/admin/components/reservations/ReservationPagination.jsx

import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * @param {{
 *   page: number,
 *   totalPages: number,
 *   totalItems: number,
 *   pageSize: number,
 *   onPageChange: (page: number) => void,
 * }} props
 */
export default function ReservationPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to   = Math.min(page * pageSize, totalItems);

  // Build visible page numbers with ellipsis
  const pages = buildPageNumbers(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
      {/* Range text */}
      <p className="text-[11px] uppercase tracking-widest2 text-muted">
        Showing {from}–{to} of {totalItems}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <NavBtn
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </NavBtn>

        {/* Pages */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-sm text-muted select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
              className={`
                w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  p === page
                    ? "bg-primary text-background shadow-soft"
                    : "bg-white text-dark border border-border hover:border-primary hover:text-primary"
                }
              `}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <NavBtn
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </NavBtn>
      </div>
    </div>
  );
}

/* ── helpers ──────────────────────────────────────────────────────────────── */

function NavBtn({ children, disabled, onClick, "aria-label": ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        w-9 h-9 rounded-lg border flex items-center justify-center
        transition-all duration-200
        ${
          disabled
            ? "border-border text-muted/40 cursor-not-allowed bg-background"
            : "border-border bg-white text-dark hover:border-primary hover:text-primary"
        }
      `}
    >
      {children}
    </button>
  );
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3)
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}