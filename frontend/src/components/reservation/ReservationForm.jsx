import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Users,
  Calendar,
  Clock,
  Sparkles,
  FileText,
  User,
  Mail,
  Phone,
  Ticket,
} from "lucide-react";
import { createReservation } from "../../services/reservation.service.js";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { cx } from "../../utils/format.js";

const initial = {
  name: "",
  email: "",
  phone: "",
  guests: "2",
  date: "",
  time: "19:30",
  occasion: "casual",
  notes: "",
};

export default function ReservationForm() {
  const { customer, isAuthenticated } = useCustomerAuth();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | loading | success | error
  const [booking, setBooking] = useState(null);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (customer) {
      setForm((prev) => ({
        ...prev,
        name: customer.name || prev.name,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone,
      }));
    }
  }, [customer]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.date) errs.date = "Pick a date for your visit.";
    if (!form.time) errs.time = "Pick a time slot.";
    if (!form.guests || Number(form.guests) < 1) errs.guests = "At least 1 guest required.";
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setServerError("Please sign in to your account to reserve a table.");
      setState("error");
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setState("loading");
    setServerError("");

    try {
      const result = await createReservation({
        guests: Number(form.guests),
        reservationDate: form.date,
        reservationTime: form.time,
        specialRequest: [form.occasion !== "casual" ? form.occasion : null, form.notes].filter(Boolean).join(" — "),
      });
      setBooking(result);
      setState("success");
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
        err.message ||
        "We couldn't create your reservation. Please try again."
      );
      setState("error");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const getInitials = (name) => {
    if (!name) return "Y";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl bg-white border border-secondary/30 p-8 md:p-12 shadow-[0_24px_64px_-16px_rgba(44,24,16,0.12)] text-center relative overflow-hidden"
        data-testid="reservation-success"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto h-16 w-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center border-2 border-secondary/40 shadow-sm"
        >
          <Check size={32} />
        </motion.div>

        <span className="eyebrow justify-center mt-6">Table Reserved</span>
        <h3 className="heading-md mt-2 font-display">We Look Forward to Welcoming You</h3>
        
        <p className="mt-3 max-w-md mx-auto text-sm text-muted leading-relaxed">
          Thank you, <span className="font-semibold text-dark">{customer?.name || form.name}</span>. Your reservation has been recorded.
        </p>

        {/* Reservation Ticket / Voucher */}
        <div className="mt-8 max-w-md mx-auto rounded-2xl border border-secondary/30 bg-[#faf8f5] p-6 text-left shadow-xs">
          <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4">
            <div className="flex items-center gap-2 text-dark font-display text-base font-semibold">
              <Ticket size={18} className="text-secondary" />
              <span>Hotel Yashdeep</span>
            </div>
            {booking?.bookingId && (
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold tracking-wider">
                ID: {booking.bookingId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-muted font-medium">Guest Name</span>
              <span className="font-semibold text-dark mt-0.5 block">{customer?.name || form.name}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-muted font-medium">Party Size</span>
              <span className="font-semibold text-dark mt-0.5 block">{form.guests} {Number(form.guests) === 1 ? "Guest" : "Guests"}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-muted font-medium">Date</span>
              <span className="font-semibold text-dark mt-0.5 block">{form.date}</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-muted font-medium">Time Slot</span>
              <span className="font-semibold text-dark mt-0.5 block">{form.time}</span>
            </div>
            {form.occasion && (
              <div className="col-span-2 pt-2 border-t border-border/60">
                <span className="block text-[10px] uppercase tracking-wider text-muted font-medium">Occasion</span>
                <span className="capitalize font-medium text-dark mt-0.5 block">{form.occasion}</span>
              </div>
            )}
            {booking?.table && (
              <div className="col-span-2 pt-2 border-t border-border/60 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-muted font-medium">Assigned Seating</span>
                  <span className="font-semibold text-primary mt-0.5 block text-sm">
                    Table {booking.table.tableNumber || booking.table} {booking.table.location ? `(${booking.table.location})` : ""}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                  Confirmed Seating
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-xs text-muted max-w-sm mx-auto">
          A confirmation note has been scheduled. For any changes or if you are running late, please call us directly.
        </p>

        <button
          type="button"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-semibold tracking-wide border-2 border-dark/20 text-dark hover:border-primary hover:text-primary transition-all duration-300"
          onClick={() => {
            setForm((prev) => ({
              ...initial,
              name: customer?.name || "",
              email: customer?.email || "",
              phone: customer?.phone || "",
            }));
            setBooking(null);
            setServerError("");
            setState("idle");
          }}
          data-testid="reservation-reset"
        >
          Make another reservation
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl bg-white border border-border/80 p-8 md:p-11 shadow-[0_20px_50px_-20px_rgba(44,24,16,0.08)] relative"
      data-testid="reservation-form"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border/70">
        <div>
          <span className="eyebrow">Table Booking</span>
          <h3 className="font-display text-2xl text-dark mt-1">Book your table</h3>
          <p className="mt-1 text-xs text-muted">
            Held for 15 minutes past booking time. Confirmed manually during hours.
          </p>
        </div>

        {customer && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 font-medium self-start sm:self-auto shadow-xs">
            <ShieldCheck size={15} className="text-emerald-600" />
            Verified Guest
          </div>
        )}
      </div>

      {state === "error" && (
        <div role="alert" className="mt-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-800 shadow-sm animate-fadeIn">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
          <span className="font-medium">{serverError}</span>
        </div>
      )}

      {/* Verified Guest Identity Card */}
      {customer && (
        <div className="mt-6 p-4 rounded-2xl border border-secondary/25 bg-[#faf8f5] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary/15 border-2 border-secondary/40 text-secondary flex items-center justify-center font-display font-bold text-base shrink-0 shadow-xs">
            {getInitials(customer.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-dark text-sm truncate">{customer.name}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              <span className="inline-flex items-center gap-1">
                <Mail size={12} className="text-secondary" /> {customer.email}
              </span>
              {customer.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone size={12} className="text-secondary" /> {customer.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-2 gap-x-6 gap-y-6">
        {/* Guests Selector */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
            Number of Guests
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted/70">
              <Users size={17} />
            </div>
            <select
              name="guests"
              value={form.guests}
              onChange={onChange}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all cursor-pointer"
              data-testid="select-guests"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
          {errors.guests && (
            <span className="mt-1.5 block text-xs font-medium text-red-600">
              {errors.guests}
            </span>
          )}
        </div>

        {/* Date Selector */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
            Reservation Date
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted/70">
              <Calendar size={17} />
            </div>
            <input
              type="date"
              name="date"
              min={today}
              value={form.date}
              onChange={onChange}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all"
              data-testid="input-date"
            />
          </div>
          {errors.date && (
            <span className="mt-1.5 block text-xs font-medium text-red-600" data-testid="error-date">
              {errors.date}
            </span>
          )}
        </div>

        {/* Time Selector */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
            Arrival Time
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted/70">
              <Clock size={17} />
            </div>
            <select
              name="time"
              value={form.time}
              onChange={onChange}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all cursor-pointer"
              data-testid="select-time"
            >
              <optgroup label="Lunch Hours">
                <option value="11:30">11:30 AM</option>
                <option value="12:30">12:30 PM</option>
                <option value="13:30">01:30 PM</option>
                <option value="14:30">02:30 PM</option>
              </optgroup>
              <optgroup label="Dinner Hours">
                <option value="18:30">06:30 PM</option>
                <option value="19:30">07:30 PM</option>
                <option value="20:30">08:30 PM</option>
                <option value="21:30">09:30 PM</option>
                <option value="22:30">10:30 PM</option>
              </optgroup>
            </select>
          </div>
          {errors.time && (
            <span className="mt-1.5 block text-xs font-medium text-red-600" data-testid="error-time">
              {errors.time}
            </span>
          )}
        </div>

        {/* Occasion Selector */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
            Dining Occasion
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted/70">
              <Sparkles size={17} />
            </div>
            <select
              name="occasion"
              value={form.occasion}
              onChange={onChange}
              className="w-full pl-10 pr-8 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all cursor-pointer"
              data-testid="select-occasion"
            >
              <option value="casual">Casual Dining</option>
              <option value="family">Family Gathering</option>
              <option value="birthday">Birthday Celebration</option>
              <option value="anniversary">Anniversary Dinner</option>
              <option value="business">Business Lunch / Dinner</option>
              <option value="highway">Highway Stop & Recharge</option>
            </select>
          </div>
        </div>

        {/* Notes / Special Requests */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-semibold uppercase tracking-widest2 text-dark/70 mb-2">
            Special Requests & Seating Preference
          </label>
          <div className="relative">
            <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-muted/70">
              <FileText size={17} />
            </div>
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={onChange}
              placeholder="E.g., Window seating, quiet corner, high chair for infant, celebration cake arrangement…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-[#faf8f5] text-dark placeholder:text-muted/40 text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all resize-none"
              data-testid="textarea-notes"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full md:w-auto md:px-12 mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl bg-gradient-to-r from-primary via-[#8a2424] to-primary hover:from-dark hover:to-dark text-white disabled:opacity-60 disabled:cursor-not-allowed transform active:scale-[0.99]"
        data-testid="reservation-submit"
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === "loading" ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <Loader2 size={16} className="animate-spin text-secondary" /> Holding your table…
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              Confirm Reservation <Check size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </form>
  );
}
