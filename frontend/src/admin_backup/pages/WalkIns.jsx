import { useState, useEffect, useCallback, useRef } from "react";
import {
  Users,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Loader2,
  CalendarDays,
  CircleX,
} from "lucide-react";
import WalkInTable from "../components/walkins/WalkInTable";
import WalkInSearch from "../components/walkins/WalkInSearch";
import WalkInFilters from "../components/walkins/WalkInFilters";
import WalkInPagination from "../components/walkins/WalkInPagination";
import WalkInForm from "../components/walkins/WalkInForm";
import DeleteWalkInDialog from "../components/walkins/DeleteWalkInDialog";
import {
  fetchWalkIns,
  fetchWalkInStats,
  createWalkIn,
  updateWalkIn,
  deleteWalkIn,
} from "../services/walkin.service";

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 w-[340px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-lg ${
            t.type === "success"
              ? "bg-white border-green-200 text-green-800"
              : t.type === "error"
              ? "bg-white border-red-200 text-red-800"
              : "bg-white border-[var(--border)] text-[var(--text)]"
          }`}
        >
          <div
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              t.type === "success"
                ? "bg-green-100"
                : t.type === "error"
                ? "bg-red-100"
                : "bg-[var(--background)]"
            }`}
          >
            {t.type === "success" && <CheckCircle2 size={12} className="text-green-600" />}
            {t.type === "error" && <XCircle size={12} className="text-red-600" />}
            {t.type === "info" && <TrendingUp size={12} className="text-[var(--primary)]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{t.title}</p>
            {t.message && <p className="text-xs mt-0.5 opacity-75">{t.message}</p>}
          </div>
          <button
            onClick={() => onRemove(t.id)}
            className="text-current opacity-40 hover:opacity-70 transition-opacity shrink-0 text-base leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card — exact clone of Reservations stat card ────────────────────────

function StatCard({ icon: Icon, iconColor, label, value, loading }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5 flex flex-col gap-3">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}22` }}
      >
        <Icon size={17} style={{ color: iconColor }} />
      </div>
      {loading ? (
        <div className="h-7 w-10 rounded-md bg-[var(--border)] animate-pulse" />
      ) : (
        <p className="font-['Playfair_Display'] text-3xl font-bold text-[var(--text)] leading-none">
          {value ?? 0}
        </p>
      )}
      <p className="text-[10px] uppercase tracking-[2px] text-[var(--text-muted)] font-medium">
        {label}
      </p>
    </div>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LIMIT = 10;

function uid() {
  return Date.now() + Math.random().toString(36).slice(2);
}

// ─── Main page ────────────────────────────────────────────────────────────────

function WalkIns() {
  const [walkIns, setWalkIns]           = useState([]);
  const [totalItems, setTotalItems]     = useState(0);
  const [totalPages, setTotalPages]     = useState(1);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  const [search, setSearch]             = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter]     = useState("");
  const [page, setPage]                 = useState(1);
  const [sortKey, setSortKey]           = useState("arrivalTime");
  const [sortDir, setSortDir]           = useState("desc");

  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [showForm, setShowForm]         = useState(false);
  const [formMode, setFormMode]         = useState("create");
  const [editTarget, setEditTarget]     = useState(null);
  const [formLoading, setFormLoading]   = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toasts, setToasts]             = useState([]);
  const searchTimer                     = useRef(null);

  // ─── Toasts ─────────────────────────────────────────────────────────────────

  function addToast(type, title, message = "") {
    const id = uid();
    setToasts((p) => [...p, { id, type, title, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }

  // ─── Search debounce ────────────────────────────────────────────────────────

  function handleSearchChange(val) {
    setSearch(val);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 350);
  }

  // ─── Fetch ──────────────────────────────────────────────────────────────────

  const loadWalkIns = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const data = await fetchWalkIns({
          page,
          limit: LIMIT,
          search: debouncedSearch,
          status: statusFilter,
          date: dateFilter,
        });
        setWalkIns(data?.walkIns || data?.data || []);
        setTotalItems(data?.total || data?.totalItems || 0);
        setTotalPages(data?.totalPages || Math.ceil((data?.total || 0) / LIMIT) || 1);
      } catch (err) {
        addToast("error", "Failed to load walk-ins", err.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, debouncedSearch, statusFilter, dateFilter]
  );

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await fetchWalkInStats();
      setStats(data);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => { loadWalkIns(); }, [loadWalkIns]);
  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { setPage(1); }, [statusFilter, dateFilter]);

  // ─── Sort ───────────────────────────────────────────────────────────────────

  function handleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const sortedWalkIns = [...walkIns].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (sortKey === "arrivalTime" || sortKey === "createdAt") {
      av = new Date(av || 0).getTime();
      bv = new Date(bv || 0).getTime();
    }
    if (typeof av === "string") av = av.toLowerCase();
    if (typeof bv === "string") bv = bv.toLowerCase();
    return av < bv ? (sortDir === "asc" ? -1 : 1) : av > bv ? (sortDir === "asc" ? 1 : -1) : 0;
  });

  // ─── CRUD ───────────────────────────────────────────────────────────────────

  async function handleFormSubmit(payload) {
    setFormLoading(true);
    try {
      if (formMode === "edit") {
        const id = editTarget._id || editTarget.id;
        const updated = await updateWalkIn(id, payload);
        setWalkIns((p) =>
          p.map((w) => (w._id || w.id) === id ? { ...w, ...(updated?.walkIn || updated) } : w)
        );
        addToast("success", "Walk-in updated", `${payload.customerName}'s record has been updated.`);
      } else {
        const created = await createWalkIn(payload);
        setWalkIns((p) => [created?.walkIn || created, ...p].slice(0, LIMIT));
        setTotalItems((n) => n + 1);
        addToast("success", "Walk-in created", `${payload.customerName} has been added.`);
      }
      setShowForm(false);
      setEditTarget(null);
      loadStats();
    } catch (err) {
      addToast("error", formMode === "edit" ? "Update failed" : "Create failed", err.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteConfirm(id) {
    setDeleteLoading(true);
    try {
      await deleteWalkIn(id);
      const name = deleteTarget?.customerName || "Walk-in";
      setWalkIns((p) => p.filter((w) => (w._id || w.id) !== id));
      setTotalItems((n) => Math.max(0, n - 1));
      setDeleteTarget(null);
      addToast("success", "Deleted", `${name}'s record has been removed.`);
      loadStats();
    } catch (err) {
      addToast("error", "Delete failed", err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  const hasFilters = debouncedSearch || statusFilter !== "all" || dateFilter;

  const STAT_CARDS = [
    { icon: CalendarDays, iconColor: "#7A1F1F", label: "Total Today",  value: stats?.todayTotal ?? stats?.total },
    { icon: Clock,        iconColor: "#D97706", label: "Waiting",       value: stats?.waiting    },
    { icon: CheckCircle2, iconColor: "#2563EB", label: "Seated",        value: stats?.seated     },
    { icon: TrendingUp,   iconColor: "#16A34A", label: "Completed",     value: stats?.completed  },
    { icon: CircleX,      iconColor: "#DC2626", label: "Cancelled",     value: stats?.cancelled  },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Page — same background as rest of admin (var(--background) = cream) */}
      <div className="p-6 lg:p-8">

        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-['Playfair_Display'] text-[2rem] font-bold text-[var(--text)]">
              Walk-ins
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Manage today's walk-in guests from a single view.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadWalkIns({ silent: true })}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)] transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={() => { setFormMode("create"); setEditTarget(null); setShowForm(true); }}
              className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-[0_6px_18px_rgba(122,31,31,0.28)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={15} />
              New Walk-in
            </button>
          </div>
        </div>

        {/* ── ONE white card wrapping stats + search + filters + table ── */}
        {/* This is exactly what Reservations does */}
        <div className="rounded-2xl border border-[var(--border)] bg-white overflow-hidden">

          {/* Stat cards row — sits inside the white card, separated by bottom border */}
          <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-5 border-b border-[var(--border)]">
            {STAT_CARDS.map((s, i) => (
              <div
                key={s.label}
                className={`p-5 flex flex-col gap-3 ${
                  i < STAT_CARDS.length - 1
                    ? "border-r border-[var(--border)]"
                    : ""
                }`}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${s.iconColor}18`, border: `1px solid ${s.iconColor}22` }}
                >
                  <s.icon size={17} style={{ color: s.iconColor }} />
                </div>
                {statsLoading ? (
                  <div className="h-7 w-10 rounded-md bg-[var(--border)] animate-pulse" />
                ) : (
                  <p className="font-['Playfair_Display'] text-3xl font-bold text-[var(--text)] leading-none">
                    {s.value ?? 0}
                  </p>
                )}
                <p className="text-[10px] uppercase tracking-[2px] text-[var(--text-muted)] font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Search row */}
          <div className="px-5 pt-5 pb-3">
            <div className="max-w-sm">
              <WalkInSearch value={search} onChange={handleSearchChange} />
            </div>
          </div>

          {/* Filter row */}
          <div className="px-5 pb-4 border-b border-[var(--border)]">
            <WalkInFilters
              status={statusFilter}
              date={dateFilter}
              onStatusChange={(v) => { setStatusFilter(v); setPage(1); }}
              onDateChange={(v) => { setDateFilter(v); setPage(1); }}
              resultCount={totalItems}
            />
          </div>

          {/* Table — no extra wrapper, sits flush inside the white card */}
          <WalkInTable
            walkIns={sortedWalkIns}
            loading={loading}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            onEdit={(w) => { setFormMode("edit"); setEditTarget(w); setShowForm(true); }}
            onDelete={setDeleteTarget}
            hasFilters={!!hasFilters}
          />

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="px-5 py-4 border-t border-[var(--border)]">
              <WalkInPagination
                page={page}
                totalPages={totalPages}
                totalItems={totalItems}
                limit={LIMIT}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <WalkInForm
          mode={formMode}
          initialData={editTarget}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          loading={formLoading}
        />
      )}

      {deleteTarget && (
        <DeleteWalkInDialog
          walkin={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast toasts={toasts} onRemove={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </>
  );
}

export default WalkIns;