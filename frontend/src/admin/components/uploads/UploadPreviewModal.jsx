import { useEffect, useRef, useState } from "react";
import { X, Trash2, Copy, Check, FileText } from "lucide-react";
import { formatBytes, formatDate, getKind, getTypeLabel, HEADING_FONT } from "./uploads.utils";

export default function UploadPreviewModal({ item, onClose, onDelete }) {
  const closeRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!item) return undefined;
    closeRef.current?.focus();
    const esc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [item, onClose]);

  if (!item) return null;
  const kind = getKind(item);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upload-preview-title"
        className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
      >
        <div className="flex min-h-[220px] flex-1 items-center justify-center bg-[#1c1009] md:min-h-[420px]">
          {kind === "image" && item.url ? (
            <img src={item.url} alt={item.name} className="max-h-[60vh] w-full object-contain md:max-h-[88vh]" />
          ) : kind === "video" && item.url ? (
            <video src={item.url} controls className="max-h-[60vh] w-full md:max-h-[88vh]" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#d9c7a8]">
              <FileText className="h-14 w-14" />
              <span className="text-xs font-semibold uppercase tracking-widest">{getTypeLabel(item)}</span>
              <span className="text-xs text-[#b8a58a]">No preview available</span>
            </div>
          )}
        </div>

        <div className="flex w-full flex-col overflow-y-auto p-6 md:w-80">
          <div className="flex items-start justify-between gap-3">
            <h2 id="upload-preview-title" className="break-words text-xl text-[#2b1810]" style={HEADING_FONT}>
              {item.name}
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <dl className="mt-5 space-y-4 text-sm">
            {[
              ["Type", getTypeLabel(item)],
              ["Size", formatBytes(item.size)],
              ["Uploaded", formatDate(item.createdAt)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{k}</dt>
                <dd className="mt-1 text-gray-800">{v}</dd>
              </div>
            ))}
            {item.url && (
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">URL</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <input
                    readOnly
                    value={item.url}
                    aria-label="File URL"
                    onFocus={(e) => e.target.select()}
                    className="min-w-0 flex-1 rounded-md border border-[#e6dccd] bg-[#fbf8f3] px-2 py-1.5 text-xs text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={copyUrl}
                    aria-label="Copy URL"
                    className="rounded-md border border-[#e6dccd] p-1.5 text-gray-600 hover:bg-gray-50"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-auto flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="h-10 flex-1 rounded-lg border border-[#e6dccd] bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
