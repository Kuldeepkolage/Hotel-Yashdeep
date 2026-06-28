// src/admin/pages/Reservations.jsx
//
// Complete Reservation Management page for Hotel Yashdeep admin.
// Handles: fetch · search · filter · sort · paginate · view · confirm
//          assign-table · complete · cancel · delete
//
// All API calls go through reservation.service.js which uses the
// shared axios instance (with auth interceptor already configured).

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  RefreshCw,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  fetchReservations,
  confirmReservation,
  completeReservation,
  updateReservationStatus,
  deleteReservation,
} from "../services/reservation.service";

import ReservationSearch     from "../components/reservations/ReservationSearch";
import ReservationFilters    from "../components/reservations/ReservationFilters";
import ReservationTable      from "../components/reservations/ReservationTable";
import ReservationPagination from "../components/reservations/ReservationPagination";
import ReservationDetailsModal   from "../components/reservations/ReservationDetailsModal";
import ConfirmReservationModal   from "../components/reservations/ConfirmReservationModal";
import DeleteReservationDialog   from "../components/reservations/DeleteReservationDialog";

const PAGE_SIZE = 12;

/* ─── status summary cards ──────────────────────────────────────────────────── */
const SUMMARY_CARDS = [
  { key: "total",     label: "Total",     icon: CalendarDays,  color: "text-primary",    bg: "bg-primary/8"   },
  { key: "Pending",   label: "Pending",   icon: Clock,         color: "text-amber-600",  bg: "bg-amber-50"    },
  { key: "Confirmed", label: "Confirmed", icon: CheckCircle2,  color: "text-emerald-600",bg: "bg-emerald-50"  },
  { key: "Completed", label: "Completed", icon: TrendingUp,    color: "text-slate-500",  bg: "bg-slate-100"   },
  { key: "Cancelled", label: "Cancelled", icon: XCircle,       color: "text-red-500",    bg: "bg-red-50"      },
];

export default function Reservations() {
  /* ── raw data from API ───────────────────────────────────────────── */
  const [all, setAll]         = useState([]);   // full unfiltered list
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  /* ── filter / search / sort / page state ────────────────────────── */
  const [search, setSearch]   = useState("");
  const [filters, setFilters] = useState({ status: "", date: "" });
  const [sort, setSort]       = useState({ key: "reservationDate", dir: "desc" });
  const [page, setPage]       = useState(1);

  /* ── modal state ─────────────────────────────────────────────────── */
  const [detailRes,  setDetailRes]  = useState(null);
  const [confirmRes, setConfirmRes] = useState(null);
  const [deleteRes,  setDeleteRes]  = useState(null);

  /* ── action feedback ─────────────────────────────────────────────── */
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }

  /* ─────────────────────────────────────────────────────────────────────────── */
  /*  DATA FETCHING                                                              */
  /* ─────────────────────────────────────────────────────────────────────────── */
  const load = useCallback(async () => {
    setLoading(true);
    setFetchError("");
    try {
      // Only pass API-supported filters; search is done client-side
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date)   params.date   = filters.date;

      const res = await fetchReservations(params);
      setAll(res.data || []);
      setPage(1); // reset to page 1 whenever we refetch
    } catch (err) {
      setFetchError(
        err?.response?.data?.message || err.message || "Failed to load reservations."
      );
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.date]);

  useEffect(() => { load(); }, [load]);

  /* ─────────────────────────────────────────────────────────────────────────── */
  /*  CLIENT-SIDE SEARCH + SORT + PAGINATE                                      */
  /* ─────────────────────────────────────────────────────────────────────────── */
  const filtered = useMemo(() => {
    let data = all;

    /* search */
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter(
        (r) =>
          r.customerName?.toLowerCase().includes(q) ||
          r.phone?.includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.bookingId?.toLowerCase().includes(q)
      );
    }

    /* sort */
    data = [...data].sort((a, b) => {
      let va = a[sort.key];
      let vb = b[sort.key];

      if (sort.key === "reservationDate") {
        va = new Date(va).getTime();
        vb = new Date(vb).getTime();
      } else if (typeof va === "string") {
        va = va.toLowerCase();
        vb = vb?.toLowerCase() || "";
      }

      if (va < vb) return sort.dir === "asc" ? -1 :  1;
      if (va > vb) return sort.dir === "asc" ?  1 : -1;
      return 0;
    });

    return data;
  }, [all, search, sort]);

  /* summary counts (computed from all, not filtered) */
  const counts = useMemo(() => {
    const c = { total: all.length };
    all.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [all]);

  /* paginated slice */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  /* ─────────────────────────────────────────────────────────────────────────── */
  /*  SORT HANDLER                                                               */
  /* ─────────────────────────────────────────────────────────────────────────── */
  const handleSort = (key) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  /* ─────────────────────────────────────────────────────────────────────────── */
  /*  FILTER HANDLERS                                                            */
  /* ─────────────────────────────────────────────────────────────────────────── */
  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ status: "", date: "" });
    setSearch("");
    setPage(1);
  };

  /* ─────────────────────────────────────────────────────────────────────────── */
  /*  STAT CARD CLICK — quick filter shortcut                                   */
  /* ─────────────────────────────────────────────────────────────────────────── */
  const handleStatClick = (key) => {
    if (key === "total") {
      handleClearFilters();
    } else {
      setFilters((prev) => ({
        ...prev,
        status: prev.status === key ? "" : key,
      }));
      setPage(1);
    }
  };

  /* ─────────────────────────────────────────────────────────────────────────── */
  /*  TOAST HELPER                                                               */
  /* ─────────────────────────────────────────────────────────────────────────── */
  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  /* ─────────────────────────────────────────────────────────────────────────── */
  /*  ACTION HANDLERS                                                            */
  /* ─────────────────────────────────────────────────────────────────────────── */

  /** Called from ConfirmReservationModal after table is selected */
  const handleConfirmSubmit = async (reservationId, tableId) => {
    const res = await confirmReservation(reservationId, tableId);
    // Update local state so UI reflects immediately without refetch
    setAll((prev) =>
      prev.map((r) => (r._id === reservationId ? res.data : r))
    );
    showToast("success", "Reservation confirmed and table assigned.");
  };

  /** Mark as Completed */
  const handleComplete = async (reservation) => {
    try {
      const res = await completeReservation(reservation._id);
      setAll((prev) =>
        prev.map((r) => (r._id === reservation._id ? res.data : r))
      );
      showToast("success", `${reservation.customerName}'s reservation marked as completed.`);
    } catch (err) {
      showToast("error", err?.response?.data?.message || err.message || "Action failed.");
    }
  };

  /** Cancel a reservation */
  const handleCancel = async (reservation) => {
    try {
      const res = await updateReservationStatus(reservation._id, "Cancelled");
      setAll((prev) =>
        prev.map((r) => (r._id === reservation._id ? res.data : r))
      );
      showToast("success", `${reservation.customerName}'s reservation cancelled.`);
    } catch (err) {
      showToast("error", err?.response?.data?.message || err.message || "Action failed.");
    }
  };

  /** Delete permanently — called from DeleteReservationDialog */
  const handleDeleteSubmit = async (id) => {
    await deleteReservation(id);
    setAll((prev) => prev.filter((r) => r._id !== id));
    showToast("success", "Reservation deleted permanently.");
  };

  /* ─────────────────────────────────────────────────────────────────────────── */
  /*  RENDER                                                                     */
  /* ─────────────────────────────────────────────────────────────────────────── */
  return (
    <>
      <div className="space-y-7 pb-10">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-dark">Reservations</h1>
            <p className="mt-1 text-sm text-muted">
              Manage all guest bookings from a single view.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="
                h-10 px-4 rounded-xl border border-border bg-white
                flex items-center gap-2 text-sm text-muted
                hover:text-primary hover:border-primary
                transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Summary stat cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SUMMARY_CARDS.map((card, i) => {
            const count    = counts[card.key] ?? 0;
            const isActive = card.key !== "total" && filters.status === card.key;

            return (
              <motion.button
                key={card.key}
                type="button"
                onClick={() => handleStatClick(card.key)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.07 }}
                className={`
                  relative text-left rounded-2xl border p-4 shadow-soft
                  transition-all duration-200 group
                  ${isActive
                    ? "border-primary bg-primary text-background"
                    : "border-border bg-white hover:border-primary/40 hover:shadow-luxe"
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  h-9 w-9 rounded-xl flex items-center justify-center mb-3
                  transition-colors duration-200
                  ${isActive ? "bg-white/15" : `${card.bg} ${card.color}`}
                `}>
                  <card.icon size={17} className={isActive ? "text-background" : card.color} />
                </div>

                {/* Count */}
                {loading ? (
                  <div className="h-7 w-10 rounded bg-border/60 animate-pulse mb-1" />
                ) : (
                  <p className={`font-display text-3xl leading-none ${isActive ? "text-background" : "text-dark"}`}>
                    {count}
                  </p>
                )}

                {/* Label */}
                <p className={`mt-1.5 text-[10px] uppercase tracking-widest2 font-medium ${isActive ? "text-background/70" : "text-muted"}`}>
                  {card.label}
                </p>

                {/* Active indicator */}
                {isActive && (
                  <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-secondary" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* ── Fetch error ──────────────────────────────────────────────────── */}
        {fetchError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
          >
            <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">Failed to load reservations</p>
              <p className="text-xs text-red-500 mt-0.5">{fetchError}</p>
            </div>
            <button
              type="button"
              onClick={load}
              className="shrink-0 text-xs text-red-600 underline underline-offset-2 hover:no-underline"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* ── Search bar ───────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <ReservationSearch
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
          />
        </div>

        {/* ── Filters ──────────────────────────────────────────────────────── */}
        <ReservationFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClearFilters}
          totalResults={filtered.length}
        />

        {/* ── Table ────────────────────────────────────────────────────────── */}
        <ReservationTable
          reservations={paginated}
          loading={loading}
          sort={sort}
          onSort={handleSort}
          onView={(r)    => setDetailRes(r)}
          onConfirm={(r) => setConfirmRes(r)}
          onComplete={(r) => handleComplete(r)}
          onCancel={(r)  => handleCancel(r)}
          onDelete={(r)  => setDeleteRes(r)}
        />

        {/* ── Pagination ───────────────────────────────────────────────────── */}
        {!loading && filtered.length > PAGE_SIZE && (
          <ReservationPagination
            page={page}
            totalPages={totalPages}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* ── Modals & dialogs ──────────────────────────────────────────────── */}
      <ReservationDetailsModal
        reservation={detailRes}
        open={Boolean(detailRes)}
        onClose={() => setDetailRes(null)}
        onConfirm={(r) => { setDetailRes(null); setConfirmRes(r); }}
        onCancel={(r)  => { handleCancel(r); setDetailRes(null); }}
        onComplete={(r) => { handleComplete(r); setDetailRes(null); }}
      />

      <ConfirmReservationModal
        reservation={confirmRes}
        open={Boolean(confirmRes)}
        onClose={() => setConfirmRes(null)}
        onConfirm={handleConfirmSubmit}
      />

      <DeleteReservationDialog
        reservation={deleteRes}
        open={Boolean(deleteRes)}
        onClose={() => setDeleteRes(null)}
        onConfirm={handleDeleteSubmit}
      />

      {/* ── Toast notification ────────────────────────────────────────────── */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}

/* ── ToastNotification ─────────────────────────────────────────────────────── */
function ToastNotification({ toast, onDismiss }) {
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] pointer-events-none"
      aria-live="polite"
    >
      <motion.div
        key={toast?.msg}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={toast ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`
          pointer-events-auto min-w-[280px] max-w-sm
          rounded-2xl border shadow-luxe px-5 py-4
          flex items-start gap-3 text-sm
          ${toast?.type === "success"
            ? "bg-white border-emerald-200 text-dark"
            : "bg-white border-red-200 text-dark"
          }
          ${!toast ? "hidden" : ""}
        `}
      >
        {toast?.type === "success" ? (
          <CheckCircle2 size={17} className="text-emerald-500 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
        )}
        <p className="flex-1 leading-relaxed">{toast?.msg}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-muted hover:text-dark transition-colors duration-150"
          aria-label="Dismiss"
        >
          ×
        </button>
      </motion.div>
    </div>
  );
}