import { useEffect, useRef, useState } from "react";
import { MoreVertical, Eye, Trash2, FileText, Film, Image as ImageIcon } from "lucide-react";
import { formatBytes, formatDate, getKind, getTypeLabel } from "./uploads.utils";

export function UploadThumb({ item, className = "" }) {
  const kind = getKind(item);
  const [broken, setBroken] = useState(false);

  if (kind === "image" && item.url && !broken) {
    return (
      <img
        src={item.url}
        alt={item.name}
        loading="lazy"
        onError={() => setBroken(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  if (kind === "video" && item.url && !broken) {
    return (
      <video
        src={`${item.url}#t=0.1`}
        preload="metadata"
        muted
        playsInline
        onError={() => setBroken(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  const Icon = kind === "video" ? Film : kind === "image" ? ImageIcon : FileText;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#f4eee4] text-[#8a6f52]">
      <Icon className="h-7 w-7" />
      <span className="text-[10px] font-semibold uppercase tracking-widest">{getTypeLabel(item)}</span>
    </div>
  );
}

export function ActionsMenu({ onPreview, onDelete, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        aria-label={`Actions for ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-[#eee6da] bg-white py-1 shadow-lg">
          <button
            role="menuitem"
            type="button"
            onClick={() => { setOpen(false); onPreview(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-[#f8f4ee]"
          >
            <Eye className="h-4 w-4" /> Preview
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => { setOpen(false); onDelete(); }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function UploadCard({ item, onPreview, onDelete }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[#eee6da] bg-white shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={() => onPreview(item)}
        aria-label={`Preview ${item.name}`}
        className="block aspect-[4/3] w-full overflow-hidden bg-[#f4eee4]"
      >
        <UploadThumb item={item} className="transition duration-300 group-hover:scale-105" />
      </button>
      <div className="flex items-start gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#2b1810]" title={item.name}>{item.name}</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            {getTypeLabel(item)} · {formatBytes(item.size)}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">{formatDate(item.createdAt)}</p>
        </div>
        <ActionsMenu label={item.name} onPreview={() => onPreview(item)} onDelete={() => onDelete(item)} />
      </div>
    </article>
  );
}
