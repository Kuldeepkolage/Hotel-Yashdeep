// File: src/admin/pages/Dashboard.jsx
import { CalendarCheck, Users, LayoutGrid, Clock } from "lucide-react";
import useAuth from "../hooks/useAuth.js";

const STAT_CARDS = [
  { label: "Total Reservations", icon: CalendarCheck },
  { label: "Walk-ins Today", icon: Users },
  { label: "Available Tables", icon: LayoutGrid },
  { label: "Pending Approvals", icon: Clock },
];

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8" data-testid="admin-dashboard">
      <div className="rounded-2xl bg-dark text-background p-8 md:p-10">
        <span className="text-[11px] uppercase tracking-widest2 text-secondary">
          Welcome back
        </span>
        <h2 className="mt-3 font-display text-2xl md:text-3xl">
          Hello, {currentUser?.name || "Admin"}.
        </h2>
        <p className="mt-3 text-background/70 max-w-xl text-sm leading-relaxed">
          Here's a quick look at what's happening at Hotel Yashdeep today. Use the
          sidebar to manage reservations, tables, the menu, and the website content.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl bg-white border border-border p-6"
            data-testid={`stat-card-${card.label.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <span className="h-11 w-11 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
              <card.icon size={18} />
            </span>
            <p className="mt-5 text-[11px] uppercase tracking-widest2 text-muted">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl text-dark">—</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-border p-6 md:p-8">
        <h3 className="font-display text-xl text-dark">Latest Activity</h3>
        <p className="mt-2 text-sm text-muted">
          Recent reservations and walk-ins will appear here once connected.
        </p>
        <div className="mt-6 divide-y divide-border">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm text-dark">No activity yet</p>
                <p className="text-xs text-muted mt-1">—</p>
              </div>
              <span className="text-xs uppercase tracking-widest2 text-muted">—</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}