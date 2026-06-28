import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(page, totalPages);

  return (
    <div className="pagination">
      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="ellipsis">…</span>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === page ? "active" : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className="page-btn nav-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRight size={16} />
      </button>

      <style>{`
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 12px 0;
        }
        .page-btn {
          min-width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 1.5px solid #e8e0d8;
          background: #fff;
          color: #5a4a42;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.18s;
          padding: 0 10px;
        }
        .page-btn:hover:not(:disabled) {
          border-color: #c9a96e;
          color: #c9a96e;
        }
        .page-btn.active {
          background: #2c1810;
          border-color: #2c1810;
          color: #f5ede0;
        }
        .page-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .nav-btn {
          padding: 0 8px;
        }
        .ellipsis {
          color: #9b8ea0;
          font-size: 14px;
          padding: 0 4px;
          user-select: none;
        }
      `}</style>
    </div>
  );
}

function buildPageRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}