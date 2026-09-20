import { useEffect, useState } from "react";
import { CalendarCheck, Users, LayoutGrid, Clock } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import { getDashboardStats } from "../services/dashboard.service.js";

const STAT_CARDS = [
  { key: "totalReservations", label: "Total Reservations", icon: CalendarCheck },
  { key: "walkInsToday", label: "Walk-ins Today", icon: Users },
  { key: "availableTables", label: "Available Tables", icon: LayoutGrid },
  { key: "pending", label: "Pending Approvals", icon: Clock },
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

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      <div className="rounded-2xl bg-dark text-background p-8 md:p-10">
        <span className="text-[11px] uppercase tracking-widest2 text-secondary">Welcome back</span>
        <h2 className="mt-3 font-display text-2xl md:text-3xl">Hello, {currentUser?.name || "Admin"}.</h2>
        <p className="mt-3 text-background/70 max-w-xl text-sm leading-relaxed">
          Here's a quick look at what's happening at Hotel Yashdeep today.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex justify-between gap-4">
          <span>{error}</span>
          <button onClick={load} className="font-semibold underline">Retry</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="rounded-2xl bg-white border border-border p-6">
            <span className="h-11 w-11 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
              <card.icon size={18} />
            </span>
            <p className="mt-5 text-[11px] uppercase tracking-widest2 text-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl text-dark">
              {loading ? "…" : valueFor(card.key)}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-border p-6 md:p-8">
        <h3 className="font-display text-xl text-dark">Latest Activity</h3>
        <p className="mt-2 text-sm text-muted">
          {loading ? "Loading recent activity…" : "Recent reservations are shown below."}
        </p>
        <div className="mt-6 divide-y divide-border">
          {(stats?.latestReservations || []).map((r) => (
            <div key={r._id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm text-dark">{r.customerName}</p>
                <p className="text-xs text-muted mt-1">{r.bookingId} · {r.reservationDate ? new Date(r.reservationDate).toLocaleDateString() : "—"}</p>
              </div>
              <span className="text-xs uppercase tracking-widest2 text-muted">{r.status}</span>
            </div>
          ))}
          {!loading && !(stats?.latestReservations?.length) && (
            <p className="py-6 text-sm text-muted">No reservations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
