import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Plus,
  LayoutGrid,
  List,
  RefreshCw,
  Loader2,
  AlertCircle,
  UtensilsCrossed,
  CheckCircle2,
  XCircle,
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
import AdminPageHeader from "../components/common/AdminPageHeader.jsx";

const PAGE_SIZE = 12;

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[300] flex items-start gap-3 rounded-xl border p-4 shadow-luxe bg-white w-[340px] max-w-[90vw]">
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          type === "error" ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
        }`}
      >
        {type === "error" ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
      </div>
      <p className="text-xs sm:text-sm font-semibold flex-1 leading-snug text-dark">{message}</p>
      <button onClick={onClose} className="text-muted hover:text-dark text-sm">×</button>
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

  // Client-side filter + sort
  const visibleItems = useMemo(() => {
    let list = [...items];

    if (filter === "veg") list = list.filter((i) => i.veg);
    if (filter === "non-veg") list = list.filter((i) => !i.veg);
    if (filter === "available") list = list.filter((i) => i.available);
    if (filter === "unavailable") list = list.filter((i) => !i.available);
    if (filter === "recommended") list = list.filter((i) => i.is_recommended);
    if (filter === "special") list = list.filter((i) => i.is_special);

    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [items, filter, sortBy]);

  // Category counts
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

  // Submit form
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
    <div className="space-y-6 sm:space-y-8" data-testid="admin-menu">
      {/* Page Header */}
      <AdminPageHeader
        title="Menu"
        subtitle="Catalog of dishes, beverages, pricing, dietary indicators, and kitchen stock status."
        icon={UtensilsCrossed}
        badge={`${totalCount} Dishes`}
        actions={
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={fetchItems}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-dark/70 hover:text-dark hover:border-primary/50 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => { setEditItem(null); setShowForm(true); }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
              <Plus size={15} />
              Add Dish
            </button>
          </div>
        }
      />

      {/* Category Tabs */}
      <div className="rounded-2xl border border-border bg-white p-3.5 sm:p-5 shadow-soft overflow-x-auto">
        <CategoryTabs
          active={category}
          onChange={(c) => { setCategory(c); setPage(1); }}
          counts={categoryCounts}
        />
      </div>

      {/* Search + Filters + View Toggle */}
      <div className="rounded-2xl border border-border bg-white p-3.5 sm:p-5 shadow-soft">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="w-full sm:w-auto sm:min-w-[240px]">
              <MenuSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
            </div>
            <MenuFilters filter={filter} onFilter={setFilter} sortBy={sortBy} onSort={setSortBy} />
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border">
            {!loading && (
              <span className="text-xs text-muted font-medium">
                {visibleItems.length === 0
                  ? "No dishes found"
                  : `${visibleItems.length} dish${visibleItems.length !== 1 ? "es" : ""}`}
              </span>
            )}
            <div className="inline-flex rounded-xl border border-border bg-white p-1 shadow-2xs">
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-dark text-white shadow-2xs" : "text-muted hover:text-dark hover:bg-black/5"
                }`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                  viewMode === "list" ? "bg-dark text-white shadow-2xs" : "text-muted hover:text-dark hover:bg-black/5"
                }`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-border bg-white shadow-soft">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted font-medium">Loading restaurant menu…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-rose-200 bg-rose-50 text-center">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <AlertCircle size={24} />
            </div>
            <p className="text-base font-semibold text-rose-800">Something went wrong</p>
            <p className="mt-1 text-sm text-rose-600 max-w-md">{error}</p>
            <button
              onClick={fetchItems}
              className="mt-4 px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 text-xs font-semibold hover:bg-rose-50"
            >
              Try Again
            </button>
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-border bg-white shadow-soft text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <UtensilsCrossed size={22} />
            </div>
            <p className="text-base font-semibold text-dark">
              {search || filter !== "all" ? "No dishes match your filters" : "No dishes yet"}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted max-w-sm">
              {search || filter !== "all"
                ? "Try adjusting your search keywords or clearing active filters."
                : "Add your first dish to showcase it on your public menu page."}
            </p>
            {!search && filter === "all" && (
              <button
                onClick={() => { setEditItem(null); setShowForm(true); }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-primary-hover transition-all"
              >
                <Plus size={15} />
                Add First Dish
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
          <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-soft">
            <MenuTable
              items={visibleItems}
              onEdit={(i) => { setEditItem(i); setShowForm(true); }}
              onDelete={setDeleteTarget}
              onToggleAvailable={handleToggleAvailable}
              onToggleRecommended={handleToggleRecommended}
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            className="px-3.5 py-2 rounded-xl border border-border bg-white text-xs sm:text-sm font-medium text-dark/70 hover:border-primary/50 disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            ← Previous
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === "…" ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-muted text-xs">…</span>
                ) : (
                  <button
                    key={p}
                    className={`h-9 w-9 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      p === page
                        ? "bg-primary text-white shadow-soft"
                        : "border border-border bg-white text-dark/70 hover:border-primary/50"
                    }`}
                    onClick={() => setPage(p)}
                    disabled={loading}
                  >
                    {p}
                  </button>
                )
              )}
          </div>
          <button
            className="px-3.5 py-2 rounded-xl border border-border bg-white text-xs sm:text-sm font-medium text-dark/70 hover:border-primary/50 disabled:opacity-40"
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
    </div>
  );
}