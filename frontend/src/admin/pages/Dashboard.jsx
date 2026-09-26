import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  LayoutGrid,
  Clock,
  RefreshCw,
  Plus,
  ArrowRight,
  UtensilsCrossed,
  FileText,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import { getDashboardStats } from "../services/dashboard.service.js";
import AdminPageHeader from "../components/common/AdminPageHeader.jsx";

const STAT_CARDS = [
  { key: "totalReservations", label: "Total Reservations", icon: CalendarCheck, link: "/admin/reservations", color: "text-primary bg-primary/10" },
  { key: "walkInsToday", label: "Walk-ins Today", icon: Users, link: "/admin/walk-ins", color: "text-amber-600 bg-amber-50" },
  { key: "availableTables", label: "Available Tables", icon: LayoutGrid, link: "/admin/tables", color: "text-emerald-600 bg-emerald-50" },
  { key: "pending", label: "Pending Approvals", icon: Clock, link: "/admin/reservations?status=Pending", color: "text-rose-600 bg-rose-50" },
];

const QUICK_ACTIONS = [
  { label: "Reservations", desc: "View & confirm bookings", icon: CalendarCheck, to: "/admin/reservations" },
  { label: "Walk-in Guests", desc: "Log immediate arrivals", icon: Users, to: "/admin/walk-ins" },
  { label: "Table Layout", desc: "Floor plans & occupancy", icon: LayoutGrid, to: "/admin/tables" },
  { label: "Menu Catalog", desc: "Dishes, pricing & stock", icon: UtensilsCrossed, to: "/admin/menu" },
  { label: "Website CMS", desc: "Hero, about & timings", icon: FileText, to: "/admin/cms" },
  { label: "Photo Gallery", desc: "Manage gallery pictures", icon: ImageIcon, to: "/admin/gallery" },
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setStats(await getDashboardStats());
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Could not load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const valueFor = (key) => {
    if (!stats) return "—";
    if (key === "availableTables") return stats.tables?.available ?? 0;
    return stats[key] ?? 0;
  };

  const actions = (
    <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
      <button
        type="button"
        onClick={load}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-dark/70 hover:text-dark hover:border-primary/50 transition-all disabled:opacity-50"
      >
        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        Refresh
      </button>
      <Link
        to="/admin/walk-ins"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-primary-hover active:scale-[0.98] transition-all"
      >
        <Plus size={15} />
        New Walk-in
      </Link>
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8" data-testid="admin-dashboard">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Real-time pulse of reservations, dining room tables, and guest services."
        icon={LayoutDashboard}
        actions={actions}
        badge="Live"
      />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-dark text-background p-6 sm:p-8 md:p-10 shadow-luxe">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest2 text-secondary font-semibold">Welcome Back</span>
            <Sparkles size={14} className="text-secondary" />
          </div>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl text-white font-bold">
            Hello, {currentUser?.name || "Admin"}.
          </h2>
          <p className="mt-2 text-background/70 max-w-xl text-xs sm:text-sm leading-relaxed">
            Welcome to the Hotel Yashdeep administration hub. Monitor live occupancy, confirm online reservations, manage kitchen menu items, and update your website in real-time.
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button onClick={load} className="font-semibold underline shrink-0">Retry</button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.key}
            to={card.link}
            className="group rounded-2xl bg-white border border-border p-4 sm:p-6 shadow-soft hover:shadow-luxe hover:border-primary/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className={`h-10 w-10 sm:h-11 sm:w-11 rounded-xl inline-flex items-center justify-center shrink-0 ${card.color}`}>
                <card.icon size={18} />
              </span>
              <ArrowRight size={14} className="text-muted/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4">
              <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-muted font-medium">{card.label}</p>
              <p className="mt-1 font-display text-2xl sm:text-3xl font-bold text-dark">
                {loading ? "…" : valueFor(card.key)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Navigation Hub */}
      <div>
        <h3 className="font-display text-lg sm:text-xl text-dark font-bold mb-3 sm:mb-4">
          Management Modules
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {QUICK_ACTIONS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center text-center p-4 rounded-xl bg-white border border-border hover:border-primary/50 hover:shadow-soft transition-all group"
            >
              <span className="h-10 w-10 rounded-xl bg-background flex items-center justify-center text-dark/70 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <item.icon size={18} />
              </span>
              <span className="mt-2.5 text-xs sm:text-sm font-semibold text-dark group-hover:text-primary transition-colors">
                {item.label}
              </span>
              <span className="mt-0.5 text-[10px] sm:text-[11px] text-muted line-clamp-1">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest Activity Table */}
      <div className="rounded-2xl bg-white border border-border p-5 sm:p-7 shadow-soft overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h3 className="font-display text-lg sm:text-xl text-dark font-bold">Latest Guest Activity</h3>
            <p className="text-xs sm:text-sm text-muted mt-0.5">Recent reservations logged in the system.</p>
          </div>
          <Link
            to="/admin/reservations"
            className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover flex items-center gap-1.5"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {(stats?.latestReservations || []).map((r) => (
            <div key={r._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dark truncate">{r.customerName}</p>
                <p className="text-xs text-muted mt-0.5">
                  ID: <span className="font-mono text-dark/80">{r.bookingId || r._id?.slice(-6)}</span> · {r.reservationDate ? new Date(r.reservationDate).toLocaleDateString() : "—"} · {r.reservationTime || "—"} · {r.guestCount || 1} Guests
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  r.status === "Confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  r.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  r.status === "Cancelled" ? "bg-rose-50 text-rose-700 border border-rose-200" :
                  "bg-slate-100 text-slate-700 border border-slate-200"
                }`}>
                  {r.status}
                </span>
                <Link
                  to={`/admin/reservations`}
                  className="text-xs font-medium text-muted hover:text-primary"
                >
                  Details →
                </Link>
              </div>
            </div>
          ))}

          {!loading && !(stats?.latestReservations?.length) && (
            <p className="py-8 text-center text-sm text-muted">No reservations recorded yet.</p>
          )}

          {loading && (
            <div className="py-8 text-center text-sm text-muted animate-pulse">
              Loading recent guest activity…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
