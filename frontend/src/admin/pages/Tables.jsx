import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  Users,
  AlertTriangle,
  XCircle,
  Wrench,
} from "lucide-react";
import { tableService } from "../services/table.service";
import TableGrid from "../components/tables/TableGrid";
import TableFormModal from "../components/tables/TableFormModal";
import DeleteTableDialog from "../components/tables/DeleteTableDialog";
import TableFilters from "../components/tables/TableFilters";
import TableSearch from "../components/tables/TableSearch";
import TablePagination from "../components/tables/TablePagination";
import AdminPageHeader from "../components/common/AdminPageHeader.jsx";

const LIMIT = 12;

// ── Toast ─────────────────────────────────────────────────────────
function Toast({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[300] flex flex-col gap-2 w-[340px] max-w-[90vw]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 rounded-xl border p-4 shadow-luxe bg-white ${
            t.type === "error"
              ? "border-rose-200 text-rose-800"
              : "border-emerald-200 text-emerald-800"
          }`}
        >
          <div
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
              t.type === "error" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {t.type === "error" ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
          </div>
          <p className="text-xs sm:text-sm font-semibold flex-1 leading-snug">{t.message}</p>
        </div>
      ))}
    </div>
  );
}

// ── View Toggle ───────────────────────────────────────────────────
function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-white p-1 shadow-2xs">
      <button
        type="button"
        onClick={() => onChange("grid")}
        title="Grid View"
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          view === "grid"
            ? "bg-dark text-white shadow-2xs"
            : "text-muted hover:text-dark hover:bg-black/5"
        }`}
      >
        <LayoutGrid size={15} />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        title="List View"
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
          view === "list"
            ? "bg-dark text-white shadow-2xs"
            : "text-muted hover:text-dark hover:bg-black/5"
        }`}
      >
        <List size={15} />
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function Tables() {
  const [tables, setTables] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, reserved: 0, occupied: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "all", floor: "all", section: "all" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editTable, setEditTable] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);
  const searchTimer = useRef(null);

  const toast = (message, type = "success") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await tableService.getStats();
      setStats(data.stats || data);
    } catch (err) {
      console.error("Stats fetch failed:", err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchTables = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search,
        status: filters.status !== "all" ? filters.status : undefined,
        floor: filters.floor !== "all" ? filters.floor : undefined,
        section: filters.section !== "all" ? filters.section : undefined,
        page,
        limit: LIMIT,
        ...overrides,
      };

      const data = await tableService.getTables(params);
      const list = data.tables ?? data.data ?? [];
      const tot = data.total ?? data.meta?.total ?? list.length;
      let tp = data.totalPages ?? data.pages ?? data.meta?.totalPages;
      if (!tp) tp = Math.ceil(tot / LIMIT);
      if (!tp) tp = 1;

      setTables(list);
      setTotal(tot);
      setTotalPages(tp);
    } catch (err) {
      console.error("Fetch tables error:", err);
      setError(err.message || "Failed to load tables. Check your connection and try again.");
      setTables([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, filters, page]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchTables({ page: 1 });
    }, search ? 350 : 0);
    return () => clearTimeout(searchTimer.current);
  }, [search, fetchTables]);

  useEffect(() => {
    setPage(1);
    fetchTables({ page: 1 });
  }, [filters, fetchTables]);

  useEffect(() => {
    fetchTables();
  }, [page, fetchTables]);

  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      await tableService.createTable(formData);
      toast(`Table ${formData.tableNumber} added successfully`);
      setFormOpen(false);
      setEditTable(null);
      await Promise.all([fetchTables({ page: 1 }), fetchStats()]);
      setPage(1);
    } catch (err) {
      toast(err.message || "Failed to create table", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (formData) => {
    setFormLoading(true);
    const id = editTable._id || editTable.id;
    const prevTables = [...tables];
    setTables((t) => t.map((x) => ((x._id || x.id) === id ? { ...x, ...formData } : x)));
    try {
      const res = await tableService.updateTable(id, formData);
      const updated = res.table || res;
      setTables((t) => t.map((x) => ((x._id || x.id) === id ? updated : x)));
      toast(`Table ${formData.tableNumber} updated`);
      setFormOpen(false);
      setEditTable(null);
      fetchStats();
    } catch (err) {
      setTables(prevTables);
      toast(err.message || "Failed to update table", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    const id = deleteTarget._id || deleteTarget.id;
    const prevTables = [...tables];
    setTables((t) => t.filter((x) => (x._id || x.id) !== id));
    try {
      await tableService.deleteTable(id);
      toast(`Table ${deleteTarget.tableNumber} deleted`);
      setDeleteTarget(null);
      await Promise.all([fetchTables(), fetchStats()]);
    } catch (err) {
      setTables(prevTables);
      toast(err.message || "Failed to delete table", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    const prevTables = [...tables];
    setTables((t) => t.map((x) => ((x._id || x.id) === id ? { ...x, status } : x)));
    try {
      await tableService.updateTableStatus(id, status);
      toast(`Status changed to ${status}`);
      fetchStats();
    } catch (err) {
      setTables(prevTables);
      toast(err.message || "Failed to update status", "error");
    }
  };

  const handleRetry = () => {
    fetchTables();
    fetchStats();
  };

  const hasFilters = !!(search || filters.status !== "all" || filters.floor !== "all" || filters.section !== "all");

  const STAT_CARDS = [
    { label: "Total Tables", value: stats.total, icon: LayoutGrid, color: "text-primary bg-primary/10" },
    { label: "Available", value: stats.available, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
    { label: "Reserved", value: stats.reserved, icon: Clock, color: "text-amber-600 bg-amber-50" },
    { label: "Occupied", value: stats.occupied, icon: Users, color: "text-rose-600 bg-rose-50" },
    { label: "Maintenance", value: stats.maintenance, icon: Wrench, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8" data-testid="admin-tables">
      {/* Page Header */}
      <AdminPageHeader
        title="Tables"
        subtitle="Manage seating arrangements, dining hall capacity, and live table status."
        icon={LayoutGrid}
        badge={`${stats.total ?? 0} Tables`}
        actions={
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleRetry}
              disabled={loading || statsLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-dark/70 hover:text-dark hover:border-primary/50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading || statsLoading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => { setEditTable(null); setFormOpen(true); }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
              <Plus size={15} />
              Add Table
            </button>
          </div>
        }
      />

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button onClick={handleRetry} className="font-semibold underline shrink-0">Retry</button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-soft flex flex-col justify-between">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
              <s.icon size={17} />
            </div>
            <div className="mt-3.5">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted font-medium">{s.label}</p>
              <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-dark">
                {statsLoading ? "…" : s.value ?? 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-soft">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="w-full sm:w-auto sm:min-w-[240px]">
              <TableSearch value={search} onChange={setSearch} />
            </div>
            <TableFilters filters={filters} onChange={setFilters} />
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
            {!loading && !error && (
              <span className="text-xs text-muted font-medium">
                {total === 0 ? "No tables" : `${total} table${total !== 1 ? "s" : ""}`}
              </span>
            )}
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </div>

      {/* Table Grid / List */}
      <div className="overflow-x-auto">
        <TableGrid
          tables={tables}
          loading={loading}
          view={view}
          hasFilters={hasFilters}
          onClearFilters={() => {
            setSearch("");
            setFilters({ status: "all", floor: "all", section: "all" });
          }}
          onCreate={() => { setEditTable(null); setFormOpen(true); }}
          onEdit={(t) => { setEditTable(t); setFormOpen(true); }}
          onDelete={(t) => setDeleteTarget(t)}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Pagination */}
      {!loading && !error && total > LIMIT && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={LIMIT}
          onPageChange={setPage}
        />
      )}

      {/* Modals */}
      <TableFormModal
        open={formOpen}
        table={editTable}
        loading={formLoading}
        onClose={() => { setFormOpen(false); setEditTable(null); }}
        onSubmit={editTable ? handleEdit : handleCreate}
      />
      <DeleteTableDialog
        open={!!deleteTarget}
        table={deleteTarget}
        loading={deleteLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {/* Toasts */}
      <Toast toasts={toasts} />
    </div>
  );
}