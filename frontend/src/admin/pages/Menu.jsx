import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus, LayoutGrid, List, RefreshCw, ChefHat,
  Loader2, AlertCircle, UtensilsCrossed
} from "lucide-react";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  toggleRecommended,
  MENU_CATEGORIES,
} from "../services/menu.service";

import CategoryTabs from "../components/menu/CategoryTabs";
import MenuSearch from "../components/menu/MenuSearch";
import MenuFilters from "../components/menu/MenuFilters";
import MenuCard from "../components/menu/MenuCard";
import MenuTable from "../components/menu/MenuTable";
import MenuFormModal from "../components/menu/MenuFormModal";
import DeleteMenuDialog from "../components/menu/DeleteMenuDialog";

const PAGE_SIZE = 12;

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}

export default function Menu() {
  // Data
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [page, setPage] = useState(1);

  // View
  const [viewMode, setViewMode] = useState("grid");

  // Modals
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // Fetch
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, count } = await getMenuItems({ category, search, page, limit: PAGE_SIZE });
      setItems(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err.message || "Failed to load menu items.");
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [category, search, filter, sortBy]);

  // Client-side filter + sort (after fetch)
  const visibleItems = useMemo(() => {
    let list = [...items];

    // Client filters
    if (filter === "veg") list = list.filter((i) => i.veg);
    if (filter === "non-veg") list = list.filter((i) => !i.veg);
    if (filter === "available") list = list.filter((i) => i.available);
    if (filter === "unavailable") list = list.filter((i) => !i.available);
    if (filter === "recommended") list = list.filter((i) => i.is_recommended);
    if (filter === "special") list = list.filter((i) => i.is_special);

    // Sort
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [items, filter, sortBy]);

  // Category counts (from current loaded items)
  const categoryCounts = useMemo(() => {
    const counts = { All: totalCount };
    MENU_CATEGORIES.filter((c) => c !== "All").forEach((cat) => {
      counts[cat] = items.filter((i) => i.category === cat).length;
    });
    return counts;
  }, [items, totalCount]);

  // Optimistic toggle availability
  async function handleToggleAvailable(item) {
    const newVal = !item.available;
    setItems((prev) => prev.map((i) => i._id === item._id ? { ...i, available: newVal } : i));
    try {
      await toggleAvailability(item._id, newVal);
      showToast(`${item.name} marked as ${newVal ? "available" : "unavailable"}.`);
    } catch {
      setItems((prev) => prev.map((i) => i._id === item._id ? { ...i, available: !newVal } : i));
      showToast("Failed to update availability.", "error");
    }
  }

  // Optimistic toggle recommended
  async function handleToggleRecommended(item) {
    const newVal = !item.is_recommended;
    setItems((prev) => prev.map((i) => i._id === item._id ? { ...i, is_recommended: newVal } : i));
    try {
      await toggleRecommended(item._id, newVal);
      showToast(`${item.name} ${newVal ? "added to" : "removed from"} recommendations.`);
    } catch {
      setItems((prev) => prev.map((i) => i._id === item._id ? { ...i, is_recommended: !newVal } : i));
      showToast("Failed to update recommendation.", "error");
    }
  }

  // Submit form (add or edit)
  async function handleFormSubmit(formData) {
    setFormLoading(true);
    try {
      if (editItem) {
        const updated = await updateMenuItem(editItem._id, formData);
        setItems((prev) => prev.map((i) => i._id === editItem._id ? updated : i));
        showToast(`${updated.name} updated successfully.`);
      } else {
        const created = await createMenuItem(formData);
        setItems((prev) => [created, ...prev]);
        setTotalCount((c) => c + 1);
        showToast(`${created.name} added to menu.`);
      }
      setShowForm(false);
      setEditItem(null);
    } catch (err) {
      showToast(err.message || "Failed to save dish.", "error");
    } finally {
      setFormLoading(false);
    }
  }

  // Delete
  async function handleDelete(id) {
    setDeleteLoading(true);
    try {
      await deleteMenuItem(id);
      const name = deleteTarget?.name;
      setItems((prev) => prev.filter((i) => i._id !== id));
      setTotalCount((c) => c - 1);
      setDeleteTarget(null);
      showToast(`${name} removed from menu.`);
    } catch (err) {
      showToast(err.message || "Failed to delete dish.", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="menu-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-icon">
            <ChefHat size={22} />
          </div>
          <div>
            <h1 className="page-title">Menu</h1>
            <p className="page-subtitle">
              {totalCount > 0 ? `${totalCount} dishes across ${MENU_CATEGORIES.length - 1} MENU_CATEGORIES` : "Manage your restaurant menu"}
            </p>
          </div>
        </div>
        <div className="page-header-right">
          <button
            className="btn-refresh"
            onClick={fetchItems}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw size={15} className={loading ? "spin" : ""} />
          </button>
          <button
            className="btn-add"
            onClick={() => { setEditItem(null); setShowForm(true); }}
          >
            <Plus size={16} />
            Add Dish
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="section-bar">
        <CategoryTabs
          active={category}
          onChange={(c) => { setCategory(c); setPage(1); }}
          counts={categoryCounts}
        />
      </div>

      {/* Search + Filters + View Toggle */}
      <div className="toolbar">
        <MenuSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        <MenuFilters filter={filter} onFilter={setFilter} sortBy={sortBy} onSort={setSortBy} />
        <div className="view-toggle">
          <button
            className={`view-btn${viewMode === "grid" ? " active" : ""}`}
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            className={`view-btn${viewMode === "list" ? " active" : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <div className="results-bar">
          <span className="results-count">
            {visibleItems.length === 0
              ? "No dishes found"
              : `${visibleItems.length} dish${visibleItems.length !== 1 ? "es" : ""} shown`}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="menu-content">
        {loading ? (
          <div className="state-center">
            <Loader2 size={32} className="spin state-icon" />
            <p className="state-text">Loading menu…</p>
          </div>
        ) : error ? (
          <div className="state-center">
            <div className="state-icon-wrap error">
              <AlertCircle size={28} />
            </div>
            <p className="state-title">Something went wrong</p>
            <p className="state-text">{error}</p>
            <button className="btn-retry" onClick={fetchItems}>Try Again</button>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="state-center">
            <div className="state-icon-wrap empty">
              <UtensilsCrossed size={28} />
            </div>
            <p className="state-title">
              {search || filter !== "all" ? "No dishes match your filters" : "No dishes yet"}
            </p>
            <p className="state-text">
              {search || filter !== "all"
                ? "Try adjusting your search or filters."
                : "Add your first dish to get started."}
            </p>
            {!search && filter === "all" && (
              <button className="btn-add-empty" onClick={() => { setEditItem(null); setShowForm(true); }}>
                <Plus size={15} />
                Add First Dish
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="menu-grid">
            {visibleItems.map((item) => (
              <MenuCard
                key={item._id}
                item={item}
                onEdit={(i) => { setEditItem(i); setShowForm(true); }}
                onDelete={setDeleteTarget}
                onToggleAvailable={handleToggleAvailable}
                onToggleRecommended={handleToggleRecommended}
              />
            ))}
          </div>
        ) : (
          <MenuTable
            items={visibleItems}
            onEdit={(i) => { setEditItem(i); setShowForm(true); }}
            onDelete={setDeleteTarget}
            onToggleAvailable={handleToggleAvailable}
            onToggleRecommended={handleToggleRecommended}
          />
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            ← Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "…" ? (
                  <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`page-num${p === page ? " active" : ""}`}
                    onClick={() => setPage(p)}
                    disabled={loading}
                  >
                    {p}
                  </button>
                )
              )}
          </div>
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next →
          </button>
        </div>
      )}

      {/* Modals */}
      <MenuFormModal
        open={showForm}
        editItem={editItem}
        onClose={() => { setShowForm(false); setEditItem(null); }}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      <DeleteMenuDialog
        open={!!deleteTarget}
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        .menu-page {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 28px 32px 40px;
          min-height: 100%;
          background: #faf9f6;
          box-sizing: border-box;
        }

        /* Header */
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .page-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .page-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #2c1a0e;
          color: #f5e6c8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .page-title {
          font-size: 24px;
          font-weight: 800;
          color: #1a0f08;
          margin: 0 0 3px;
          letter-spacing: -0.4px;
        }

        .page-subtitle {
          font-size: 13.5px;
          color: #9b8b7a;
          margin: 0;
        }

        .page-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-refresh {
          width: 40px;
          height: 40px;
          border: 1.5px solid #e5e1d8;
          border-radius: 10px;
          background: #fff;
          color: #6b6152;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .btn-refresh:hover { background: #faf6f1; border-color: #b5936b; color: #2c1a0e; }
        .btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-add {
          height: 40px;
          padding: 0 20px;
          border: none;
          border-radius: 10px;
          background: #2c1a0e;
          color: #f5e6c8;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: opacity 0.15s, transform 0.12s;
        }

        .btn-add:hover { opacity: 0.88; }
        .btn-add:active { transform: scale(0.97); }

        /* Section */
        .section-bar {
          background: #fff;
          border: 1.5px solid #ede9e0;
          border-radius: 14px;
          padding: 16px 18px;
        }

        /* Toolbar */
        .toolbar {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .view-toggle {
          display: flex;
          gap: 4px;
          border: 1.5px solid #e5e1d8;
          border-radius: 10px;
          padding: 3px;
          background: #fff;
          margin-left: auto;
        }

        .view-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 7px;
          background: transparent;
          color: #9b8b7a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .view-btn:hover { background: #f5f1eb; color: #2c1a0e; }

        .view-btn.active {
          background: #2c1a0e;
          color: #f5e6c8;
        }

        /* Results bar */
        .results-bar {
          display: flex;
          align-items: center;
        }

        .results-count {
          font-size: 13px;
          color: #9b8b7a;
          font-weight: 500;
        }

        /* Content */
        .menu-content { min-height: 300px; }

        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 18px;
        }

        /* States */
        .state-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 72px 24px;
          text-align: center;
        }

        .state-icon { color: #b5936b; }

        .state-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .state-icon-wrap.error { background: #fff1f1; color: #ef4444; }
        .state-icon-wrap.empty { background: #fdf6ec; color: #b5936b; }

        .state-title {
          font-size: 17px;
          font-weight: 700;
          color: #2c1a0e;
          margin: 0;
        }

        .state-text {
          font-size: 14px;
          color: #9b8b7a;
          margin: 0;
          max-width: 320px;
        }

        .btn-retry {
          margin-top: 4px;
          height: 38px;
          padding: 0 22px;
          border: 1.5px solid #e5e1d8;
          border-radius: 10px;
          background: #fff;
          font-size: 14px;
          font-weight: 600;
          color: #3d2c1e;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-retry:hover { border-color: #b5936b; background: #fdf6ec; }

        .btn-add-empty {
          margin-top: 4px;
          height: 40px;
          padding: 0 22px;
          border: none;
          border-radius: 10px;
          background: #2c1a0e;
          color: #f5e6c8;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 7px;
          transition: opacity 0.15s;
        }

        .btn-add-empty:hover { opacity: 0.88; }

        /* Pagination */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding-top: 8px;
          flex-wrap: wrap;
        }

        .page-btn {
          height: 38px;
          padding: 0 16px;
          border: 1.5px solid #e5e1d8;
          border-radius: 10px;
          background: #fff;
          font-size: 13.5px;
          font-weight: 600;
          color: #6b6152;
          cursor: pointer;
          transition: all 0.15s;
        }

        .page-btn:hover:not(:disabled) { border-color: #b5936b; background: #fdf6ec; color: #2c1a0e; }
        .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .page-numbers {
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .page-num {
          min-width: 36px;
          height: 36px;
          padding: 0 6px;
          border: 1.5px solid #e5e1d8;
          border-radius: 9px;
          background: #fff;
          font-size: 13.5px;
          font-weight: 600;
          color: #6b6152;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .page-num:hover:not(:disabled) { border-color: #b5936b; background: #fdf6ec; color: #2c1a0e; }

        .page-num.active {
          background: #2c1a0e;
          border-color: #2c1a0e;
          color: #f5e6c8;
        }

        .page-ellipsis {
          font-size: 14px;
          color: #b5a898;
          display: flex;
          align-items: center;
          padding: 0 2px;
        }

        /* Toast */
        .toast {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 2000;
          min-width: 240px;
          max-width: 380px;
          padding: 14px 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 8px 32px rgba(0,0,0,0.16);
          animation: toast-in 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }

        @keyframes toast-in {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: none; }
        }

        .toast-success { background: #1a1a1a; color: #f0f0f0; }
        .toast-error { background: #ef4444; color: #fff; }

        .toast-close {
          background: none;
          border: none;
          color: inherit;
          opacity: 0.7;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          padding: 0;
          flex-shrink: 0;
        }

        .toast-close:hover { opacity: 1; }

        /* Spinner */
        .spin { animation: spin 0.8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Responsive */
        @media (max-width: 768px) {
          .menu-page { padding: 20px 16px 32px; }
          .page-title { font-size: 20px; }
          .menu-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
          .toolbar { gap: 8px; }
          .view-toggle { margin-left: 0; }
          .toast { bottom: 16px; right: 16px; left: 16px; max-width: none; }
        }

        @media (max-width: 480px) {
          .menu-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .page-header { flex-direction: column; align-items: flex-start; }
          .page-header-right { width: 100%; justify-content: flex-end; }
        }

        @media (max-width: 360px) {
          .menu-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}