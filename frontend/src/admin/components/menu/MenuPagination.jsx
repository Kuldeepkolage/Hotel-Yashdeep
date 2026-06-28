// src/admin/components/menu/MenuPagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MenuPagination({ page, totalPages, total, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build page number list with ellipsis
  function pages() {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
        arr.push(i);
      } else if (arr[arr.length - 1] !== "…") {
        arr.push("…");
      }
    }
    return arr;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-100">
      <p className="text-xs text-stone-500">
        Showing <span className="font-semibold text-stone-700">{from}–{to}</span> of{" "}
        <span className="font-semibold text-stone-700">{total}</span> dishes
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600
            hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>

        {pages().map((p, idx) =>
          p === "…" ? (
            <span key={`el-${idx}`} className="px-1.5 text-stone-400 text-sm select-none">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium border transition
                ${p === page
                  ? "bg-amber-700 text-white border-amber-700"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600
            hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}