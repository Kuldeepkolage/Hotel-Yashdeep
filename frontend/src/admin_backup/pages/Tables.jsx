import React, { useState, useEffect, useCallback, useRef } from "react";
import { tableService } from "../services/table.service";
import TableGrid from "../components/tables/TableGrid";
import TableFormModal from "../components/tables/TableFormModal";
import DeleteTableDialog from "../components/tables/DeleteTableDialog";
import TableFilters from "../components/tables/TableFilters";
import TableSearch from "../components/tables/TableSearch";
import TablePagination from "../components/tables/TablePagination";

const LIMIT = 12;

// ── Toast ─────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", display: "flex", flexDirection: "column", gap: "10px", zIndex: 2000 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 18px", borderRadius: "12px",
            background: t.type === "error" ? "#FFF1F2" : "#F0FDF4",
            border: `1.5px solid ${t.type === "error" ? "#FECDD3" : "#BBF7D0"}`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
            color: t.type === "error" ? "#DC2626" : "#16A34A",
            fontSize: "13px", fontWeight: 600,
            animation: "slideIn 0.2s ease",
            minWidth: "240px",
          }}
        >
          {t.type === "error" ? (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}

// ── Error Banner ──────────────────────────────────────────────────
function ErrorBanner({ message, onRetry }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "14px", padding: "14px 18px",
        background: "#FFF1F2", border: "1.5px solid #FECDD3",
        borderRadius: "12px", marginBottom: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#DC2626" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
        </svg>
        <span style={{ fontSize: "13px", color: "#DC2626", fontWeight: 500 }}>{message}</span>
      </div>
      <button
        onClick={onRetry}
        style={{
          padding: "6px 14px", border: "1.5px solid #FCA5A5", borderRadius: "8px",
          background: "#fff", color: "#DC2626", fontSize: "12px",
          fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
        }}
      >
        Retry
      </button>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ label, value, color, icon, loading }) {
  return (
    <div style={{ background: "#fff", border: "1.5px solid #F0EDE8", borderRadius: "14px", padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        {loading ? (
          <div style={{ width: "40px", height: "22px", borderRadius: "6px", background: "linear-gradient(90deg,#F3F4F6 25%,#E9EAEC 50%,#F3F4F6 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s ease-in-out infinite" }} />
        ) : (
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#1F2937", lineHeight: 1 }}>{value ?? 0}</div>
        )}
        <div style={{ fontSize: "11px", fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.05em", textTransform: "uppercase", marginTop: "3px" }}>{label}</div>
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  );
}

// ── View Toggle ───────────────────────────────────────────────────
function ViewToggle({ view, onChange }) {
  return (
    <div style={{ display: "flex", border: "1.5px solid #E5E7EB", borderRadius: "10px", overflow: "hidden" }}>
      {["grid", "list"].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          title={v === "grid" ? "Grid View" : "List View"}
          style={{
            width: "36px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", cursor: "pointer", transition: "all 0.12s",
            background: view === v ? "#3D1A08" : "#fff",
            color: view === v ? "#fff" : "#6B7280",
          }}
        >
          {v === "grid" ? (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          ) : (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          )}
        </button>
      ))}
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

  // ── Fetch stats separately so they always reflect all tables ──
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await tableService.getStats();
      // Backend returns { total, available, reserved, occupied, maintenance }
      setStats(data.stats || data);
    } catch (err) {
      // Stats will just show 0s if this fails — non-critical
      console.error("Stats fetch failed:", err.message);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // ── Fetch paginated / filtered table list ─────────────────────
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

      // Normalise response shape — support:
      //   { tables: [...], total, totalPages }
      //   { data: [...], meta: { total, totalPages } }
      //   { tables: [...], total, pages }
      const list        = data.tables   ?? data.data   ?? [];
      const tot         = data.total    ?? data.meta?.total    ?? list.length;
      let tp =
  data.totalPages ??
  data.pages ??
  data.meta?.totalPages;

if (!tp) {
  tp = Math.ceil(total / LIMIT);
}

if (!tp) {
  tp = 1;
}

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

  // Initial load
  useEffect(() => {
    fetchStats();
  }, []);

  // Re-fetch on search (debounced)
  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchTables({ page: 1 });
    }, search ? 350 : 0);
    return () => clearTimeout(searchTimer.current);
  }, [search]);

  // Re-fetch on filter change
  useEffect(() => {
    setPage(1);
    fetchTables({ page: 1 });
  }, [filters]);

  // Re-fetch on page change
  useEffect(() => {
    fetchTables();
  }, [page]);

  // ── CRUD Handlers ─────────────────────────────────────────────

  const handleCreate = async (formData) => {
    setFormLoading(true);
    try {
      await tableService.createTable(formData);
      toast(`Table ${formData.tableNumber} added successfully`);
      setFormOpen(false);
      setEditTable(null);
      // Refresh both list and stats from DB
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
    const id = editTable._id || editTable._id;
    // Optimistic UI update
    const prevTables = [...tables];
    setTables((t) => t.map((x) => ((x._id || x.id) === id ? { ...x, ...formData } : x)));
    try {
      const res = await tableService.updateTable(id, formData);
      // Replace with exact server response
      const updated = res.table || res;
      setTables((t) => t.map((x) => ((x._id || x.id) === id ? updated : x)));
      toast(`Table ${formData.tableNumber} updated`);
      setFormOpen(false);
      setEditTable(null);
      fetchStats();
    } catch (err) {
      // Rollback
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
    // Optimistic removal
    setTables((t) => t.filter((x) => (x._id || x.id) !== id));
    try {
      await tableService.deleteTable(id);
      toast(`Table ${deleteTarget.tableNumber} deleted`);
      setDeleteTarget(null);
      // Re-fetch in case page needs to shift
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
    // Optimistic update
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

  const STAT_ITEMS = [
    {
      label: "Total Tables", value: stats.total, color: "#3D1A08",
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#3D1A08" strokeWidth={1.8}><rect x="3" y="8" width="18" height="3" rx="1" /><path d="M5 11v5M19 11v5M8 16h8" /></svg>,
    },
    {
      label: "Available", value: stats.available, color: "#16A34A",
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#16A34A" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>,
    },
    {
      label: "Reserved", value: stats.reserved, color: "#C2410C",
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#C2410C" strokeWidth={1.8}><circle cx="12" cy="12" r="10" /><path d="M12 8v4l2 2" /></svg>,
    },
    {
      label: "Occupied", value: stats.occupied, color: "#BE123C",
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#BE123C" strokeWidth={1.8}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
    },
    {
      label: "Maintenance", value: stats.maintenance, color: "#6D28D9",
      icon: <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6D28D9" strokeWidth={1.8}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>,
    },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1400px", margin: "0 auto" }}>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "26px", gap: "16px", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1F2937", margin: 0 }}>Tables</h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: "4px 0 0" }}>
            Manage seating arrangements across all floors and sections
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            onClick={handleRetry}
            style={{ padding: "9px 14px", border: "1.5px solid #E5E7EB", borderRadius: "10px", background: "#fff", color: "#6B7280", fontSize: "13px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "7px" }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            Refresh
          </button>
          <button
            onClick={() => { setEditTable(null); setFormOpen(true); }}
            style={{ padding: "9px 18px", border: "none", borderRadius: "10px", background: "#3D1A08", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", boxShadow: "0 2px 8px rgba(61,26,8,0.25)" }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Table
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && <ErrorBanner message={error} onRetry={handleRetry} />}

      {/* Stats Row — always fetched from DB via /api/tables/stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "14px", marginBottom: "26px" }}>
        {STAT_ITEMS.map((s) => (
          <StatCard key={s.label} {...s} loading={statsLoading} />
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "18px", flexWrap: "wrap" }}>
        <TableSearch value={search} onChange={setSearch} />
        <TableFilters filters={filters} onChange={setFilters} />
        <div style={{ marginLeft: "auto" }}>
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* Results count */}
      {!loading && !error && (
        <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "14px" }}>
          {total === 0
            ? "No tables found"
            : `${total} table${total !== 1 ? "s" : ""} found`}
        </div>
      )}

      {/* Table Grid / List */}
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