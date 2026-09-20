import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  UploadCloud, RefreshCw, AlertCircle, Files, Image as ImageIcon, Film, HardDrive, Loader2,
} from "lucide-react";
import { deleteUpload, getUploads, getUploadStats } from "../services/uploads.service";
import { UPLOAD_CONFIG } from "../components/uploads/uploads.config";
import { formatBytes, getErrorMessage, getKind, HEADING_FONT } from "../components/uploads/uploads.utils";
import UploadToolbar from "../components/uploads/UploadToolbar";
import UploadDropzone from "../components/uploads/UploadDropzone";
import UploadGrid from "../components/uploads/UploadGrid";
import UploadPagination from "../components/uploads/UploadPagination";
import UploadPreviewModal from "../components/uploads/UploadPreviewModal";
import DeleteUploadDialog from "../components/uploads/DeleteUploadDialog";
import UploadToast from "../components/uploads/UploadToast";

const SORTERS = {
  newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  oldest: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
  "name-asc": (a, b) => a.name.localeCompare(b.name),
  "name-desc": (a, b) => b.name.localeCompare(a.name),
  largest: (a, b) => b.size - a.size,
  smallest: (a, b) => a.size - b.size,
};

function StatCard({ Icon, label, value, loading }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#eee6da] bg-white p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8ece8] text-[#7a1f2b]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</p>
        {loading ? (
          <div className="mt-1.5 h-5 w-14 animate-pulse rounded bg-[#f1eadf]" aria-label="Loading" />
        ) : (
          <p className="text-xl font-semibold text-[#2b1810]" style={HEADING_FONT}>{value}</p>
        )}
      </div>
    </div>
  );
}

export default function Uploads() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null); // non-null => backend paginates
  const [apiStats, setApiStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);

  const [showDropzone, setShowDropzone] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [toasts, setToasts] = useState([]);

  const serverMode = useRef(false);
  const requestId = useRef(0);

  const notify = useCallback((kind, message) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, type: kind, message }]);
  }, []);
  const dismissToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), UPLOAD_CONFIG.searchDebounceMs);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(
    async ({ silent = false } = {}) => {
      const id = ++requestId.current;
      if (!silent) setLoading(true);
      setError("");
      try {
        const params = {
          page,
          limit: UPLOAD_CONFIG.pageSize,
          sort,
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
          ...(type !== "all" ? { type } : {}),
        };
        const result = await getUploads(params);
        if (id !== requestId.current) return;
        setItems(result.items);
        setMeta(result.meta);
        serverMode.current = Boolean(result.meta);
        if (result.meta) {
          const s = await getUploadStats();
          if (id === requestId.current) setApiStats(s);
        } else {
          setApiStats(null);
        }
      } catch (err) {
        if (id !== requestId.current) return;
        setError(getErrorMessage(err, "Failed to load uploads."));
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [page, sort, debouncedSearch, type]
  );

  // Initial load
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch on query changes only when the backend does the filtering/pagination
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (serverMode.current) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, debouncedSearch, type]);

  // Reset to page 1 when filters change
  useEffect(() => setPage(1), [debouncedSearch, type, sort]);

  // Client-side processing (used when backend returns the full list)
  const processed = useMemo(() => {
    if (meta) return items;
    const q = debouncedSearch.toLowerCase();
    return items
      .filter((i) => (type === "all" ? true : getKind(i) === type))
      .filter((i) => (q ? i.name.toLowerCase().includes(q) : true))
      .sort(SORTERS[sort] || SORTERS.newest);
  }, [items, meta, debouncedSearch, type, sort]);

  const pageSize = meta?.limit || UPLOAD_CONFIG.pageSize;
  const total = meta ? meta.total : processed.length;
  const totalPages = meta ? meta.totalPages : Math.max(1, Math.ceil(processed.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = meta ? processed : processed.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Statistics — from the API, or derived from the real full list. Never invented.
  const stats = useMemo(() => {
    if (meta) return apiStats;
    return {
      totalFiles: items.length,
      images: items.filter((i) => getKind(i) === "image").length,
      videos: items.filter((i) => getKind(i) === "video").length,
      storageUsed: items.reduce((sum, i) => sum + (i.size || 0), 0),
    };
  }, [items, meta, apiStats]);
  const statsLoading = loading && !stats;
  const fmt = (v, f = (x) => x) => (stats ? f(v) : "—");

  const handleDelete = async (item) => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteUpload(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      setDeleteTarget(null);
      setPreviewItem(null);
      notify("success", "File deleted successfully.");
      if (serverMode.current) load({ silent: true });
    } catch (err) {
      const msg = getErrorMessage(err, "Failed to delete file.");
      setDeleteError(msg);
      notify("error", msg);
    } finally {
      setDeleting(false);
    }
  };

  const hasFilters = Boolean(debouncedSearch) || type !== "all";
  const isEmpty = !loading && !error && visible.length === 0;

  return (
    <div className="px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl text-[#2b1810]" style={HEADING_FONT}>Uploads</h1>
            <p className="mt-1 text-sm text-gray-600">Manage images and media used across Hotel Yashdeep.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#e6dccd] bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowDropzone((s) => !s)}
              aria-expanded={showDropzone}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#2b1810] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#3d2418]"
            >
              <UploadCloud className="h-4 w-4" /> Upload Media
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => load()}
              className="ml-auto rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard Icon={Files} label="Total Files" value={fmt(stats?.totalFiles)} loading={statsLoading} />
          <StatCard Icon={ImageIcon} label="Images" value={fmt(stats?.images)} loading={statsLoading} />
          <StatCard Icon={Film} label="Videos" value={fmt(stats?.videos)} loading={statsLoading} />
          <StatCard Icon={HardDrive} label="Storage Used" value={fmt(stats?.storageUsed, formatBytes)} loading={statsLoading} />
        </div>

        {/* Dropzone */}
        {showDropzone && (
          <UploadDropzone
            onNotify={notify}
            onUploaded={() => load({ silent: true })}
            onClose={() => setShowDropzone(false)}
          />
        )}

        {/* Toolbar */}
        <UploadToolbar
          search={search}
          onSearch={setSearch}
          type={type}
          onType={setType}
          sort={sort}
          onSort={setSort}
          view={view}
          onView={setView}
          onUploadClick={() => setShowDropzone(true)}
          resultCount={total}
        />

        {/* Content */}
        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#eee6da] bg-white py-20">
            <Loader2 className="h-7 w-7 animate-spin text-[#2b1810]" />
            <p className="mt-3 text-sm text-gray-600">Loading uploads...</p>
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#eee6da] bg-white px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4eee4] text-[#8a6f52]">
              <UploadCloud className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-[#2b1810]">
              {hasFilters ? "No files match your filters" : "No uploads yet"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {hasFilters
                ? "Try adjusting your search or filters."
                : "Upload your first image or video to get started."}
            </p>
            {!hasFilters && (
              <button
                type="button"
                onClick={() => setShowDropzone(true)}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#2b1810] px-5 text-sm font-semibold text-white hover:bg-[#3d2418]"
              >
                <UploadCloud className="h-4 w-4" /> Upload First File
              </button>
            )}
          </div>
        ) : (
          !error && (
            <div className={`space-y-5 ${loading ? "opacity-60" : ""}`}>
              <UploadGrid items={visible} view={view} onPreview={setPreviewItem} onDelete={(i) => { setDeleteError(""); setDeleteTarget(i); }} />
              <UploadPagination
                page={currentPage}
                totalPages={totalPages}
                total={total}
                pageSize={pageSize}
                onChange={setPage}
              />
            </div>
          )
        )}
      </div>

      <UploadPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onDelete={(i) => { setDeleteError(""); setDeleteTarget(i); }}
      />
      <DeleteUploadDialog
        item={deleteTarget}
        loading={deleting}
        error={deleteError}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
      <UploadToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
