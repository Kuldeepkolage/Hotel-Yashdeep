// src/admin/components/menu/DeleteMenuDialog.jsx
import React from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

export default function DeleteMenuDialog({ item, onClose, onConfirm, loading }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[fadeScaleIn_0.18s_ease]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <h2 className="font-bold text-stone-800 text-base">Remove Dish</h2>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-stone-600 text-sm leading-relaxed">
            Are you sure you want to remove{" "}
            <span className="font-semibold text-stone-800">"{item.name}"</span> from the menu?
            This cannot be undone.
          </p>

          {/* Preview */}
          {item.image && (
            <div className="mt-4 flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover border border-stone-200 flex-shrink-0"
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <div className="min-w-0">
                <p className="font-semibold text-stone-700 text-sm truncate">{item.name}</p>
                <p className="text-stone-500 text-xs">{item.category} · ₹{item.price}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-sm
              hover:bg-stone-50 disabled:opacity-50 transition"
          >
            Keep Dish
          </button>
          <button
            onClick={() => onConfirm(item._id)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm
              flex items-center justify-center gap-2 disabled:opacity-60 transition"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {loading ? "Removing…" : "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}