import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { HEADING_FONT } from "./uploads.utils";

export default function DeleteUploadDialog({ item, loading, error, onCancel, onConfirm }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!item) return undefined;
    cancelRef.current?.focus();
    const esc = (e) => e.key === "Escape" && !loading && onCancel();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [item, loading, onCancel]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !loading && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-upload-title"
        aria-describedby="delete-upload-desc"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <h2 id="delete-upload-title" className="mt-4 text-xl text-[#2b1810]" style={HEADING_FONT}>
          Delete file
        </h2>
        <p id="delete-upload-desc" className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete this file?
          <span className="mt-1 block truncate font-medium text-gray-800">{item.name}</span>
        </p>
        {error && (
          <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelRef}
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="h-10 rounded-lg border border-[#e6dccd] bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(item)}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
