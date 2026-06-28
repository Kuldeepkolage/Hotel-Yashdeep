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
          className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-lg animate-in slide-in-from-right-4 duration-300 ${
            t.type === "success"
              ? "bg-[var(--surface)] border-green-200 text-green-800"
              : t.type === "error"
              ? "bg-[var(--surface)] border-red-200 text-red-800"
              : "bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
          }`}
        >
          <div
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              t.type === "success" ? "bg-green-100" : t.type === "error" ? "bg-red-100" : "bg-[var(--background)]"
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
            className="text-current opacity-40 hover:opacity-70 transition-opacity shrink-0 mt-0.5"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-3">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-xl"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[2px] text-[var(--text-muted)] font-medium mb-1">
          {label}
        </p>
        {loading ? (
          <div className="h-7 w-16 rounded-lg bg-[var(--border)] animate-pulse" />
        ) : (
          <p className="font-['Playfair_Display'] text-2xl font-bold text-[var(--text)]">
            {value ?? "—"}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const LIMIT = 10;

function toastId() {
  return Date.now() + Math.random().toString(36).slice(2);
}

function WalkIns() {
  // List state
  const [walkIns, setWalkIns] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filter / sort state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("arrivalTime");
  const [sortDir, setSortDir] = useState("desc");

  // Stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Debounce ref
  const searchTimer = useRef(null);

  // ─── Toast helpers ──────────────────────────────────────────────────────────

  function addToast(type, title, message = "") {
    const id = toastId();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4000);
  }

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  // ─── Load data ──────────────────────────────────────────────────────────────

  const loadWalkIns = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const data = await fetchWalkIns({
          page,
          limit: LIMIT,
          search,
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
    [page, search, statusFilter, dateFilter]
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

  useEffect(() => {
    loadWalkIns();
  }, [loadWalkIns]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, dateFilter]);

  // Debounced search
  function handleSearchChange(val) {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearch(val), 350);
  }

  // ─── Sort ───────────────────────────────────────────────────────────────────

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedWalkIns = [...walkIns].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];
    if (sortKey === "arrivalTime" || sortKey === "createdAt") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // ─── CRUD ───────────────────────────────────────────────────────────────────

  async function handleFormSubmit(payload) {
    setFormLoading(true);
    try {
      if (formMode === "edit") {
        const id = editTarget._id || editTarget.id;
        const updated = await updateWalkIn(id, payload);
        // Optimistic update
        setWalkIns((prev) =>
          prev.map((w) => ((w._id || w.id) === id ? { ...w, ...updated?.walkIn || updated } : w))
        );
        addToast("success", "Walk-in updated", `${payload.customerName}'s record has been updated.`);
      } else {
        const created = await createWalkIn(payload);
        const newItem = created?.walkIn || created;
        // Optimistic prepend
        setWalkIns((prev) => [newItem, ...prev].slice(0, LIMIT));
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
      // Optimistic remove
      setWalkIns((prev) => prev.filter((w) => (w._id || w.id) !== id));
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

  function openCreate() {
    setFormMode("create");
    setEditTarget(null);
    setShowForm(true);
  }

  function openEdit(walkin) {
    setFormMode("edit");
    setEditTarget(walkin);
    setShowForm(true);
  }

  const hasFilters = search || statusFilter !== "all" || dateFilter;

  const STAT_CARDS = [
    {
      icon: Users,
      label: "Total Today",
      value: stats?.todayTotal ?? stats?.total,
      color: "#7A1F1F",
    },
    {
      icon: Clock,
      label: "Waiting",
      value: stats?.waiting,
      color: "#D97706",
    },
    {
      icon: CheckCircle2,
      label: "Seated",
      value: stats?.seated,
      color: "#2563EB",
    },
    {
      icon: TrendingUp,
      label: "Completed",
      value: stats?.completed,
      color: "#16A34A",
    },
  ];

  return (
    <>
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">

        {/* Page header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="font-['Playfair_Display'] text-[clamp(1.5rem,3vw,2rem)] font-bold text-[var(--text)]">
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
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-[0_6px_18px_rgba(122,31,31,0.3)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus size={16} />
              New Walk-in
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
          {STAT_CARDS.map((s) => (
            <StatCard key={s.label} {...s} loading={statsLoading} />
          ))}
        </div>

        {/* Content card */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">

          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-[var(--border)] flex flex-col gap-3">
            <WalkInSearch value={search} onChange={handleSearchChange} />
            <WalkInFilters
              status={statusFilter}
              date={dateFilter}
              onStatusChange={setStatusFilter}
              onDateChange={setDateFilter}
              resultCount={totalItems}
            />
          </div>

          {/* Table */}
          <div className="p-5">
            <WalkInTable
              walkIns={sortedWalkIns}
              loading={loading}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
              hasFilters={!!hasFilters}
            />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-5">
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
      </div>

      {/* Form modal */}
      {showForm && (
        <WalkInForm
          mode={formMode}
          initialData={editTarget}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          loading={formLoading}
        />
      )}

      {/* Delete dialog */}
      {deleteTarget && (
        <DeleteWalkInDialog
          walkin={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default WalkIns;