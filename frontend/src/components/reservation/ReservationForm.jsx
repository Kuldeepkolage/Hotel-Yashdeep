import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { Input, Select, Textarea } from "../common/Input";

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
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle"); // idle | loading | success

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Please share your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "A valid email helps us confirm.";
    if (!/^[+\d\s-]{7,}$/.test(form.phone)) errs.phone = "Please enter a valid phone number.";
    if (!form.date) errs.date = "Pick a date for your visit.";
    return errs;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setState("loading");
    setTimeout(() => setState("success"), 1400);
  };

  const today = new Date().toISOString().split("T")[0];

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="card-luxe p-10 md:p-14 text-center"
        data-testid="reservation-success"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
          className="mx-auto h-16 w-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center"
        >
          <Check size={28} />
        </motion.div>
        <h3 className="heading-md mt-8">Your table is reserved.</h3>
        <p className="mt-4 max-w-md mx-auto text-muted leading-relaxed">
          Thank you, <span className="text-primary">{form.name}</span>. We've held a table for{" "}
          <span className="text-primary">{form.guests}</span> on{" "}
          <span className="text-primary">{form.date}</span> at{" "}
          <span className="text-primary">{form.time}</span>. A confirmation will reach you shortly at{" "}
          <span className="text-primary">{form.email}</span>.
        </p>
        <button
          type="button"
          className="mt-10 btn-outline"
          onClick={() => {
            setForm(initial);
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
    <form onSubmit={onSubmit} className="card-luxe p-8 md:p-10" data-testid="reservation-form">
      <h3 className="font-display text-2xl text-dark">Book your table</h3>
      <p className="mt-2 text-sm text-muted">
        Reservations are confirmed manually within an hour during opening time.
      </p>

      <div className="mt-10 grid md:grid-cols-2 gap-x-8 gap-y-7">
        <Input label="Full Name" name="name" value={form.name} onChange={onChange} error={errors.name} placeholder="Aarti Deshmukh" />
        <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} placeholder="you@email.com" />
        <Input label="Phone" name="phone" value={form.phone} onChange={onChange} error={errors.phone} placeholder="+91 98765 43210" />
        <Select label="Guests" name="guests" value={form.guests} onChange={onChange}>
          {[1,2,3,4,5,6,7,8,9,10,12,15,20].map((n) => (
            <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
          ))}
        </Select>
        <Input label="Date" name="date" type="date" min={today} value={form.date} onChange={onChange} error={errors.date} />
        <Select label="Time" name="time" value={form.time} onChange={onChange}>
          {["11:30","12:30","13:30","14:30","18:30","19:30","20:30","21:30","22:30"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </Select>
        <Select label="Occasion" name="occasion" value={form.occasion} onChange={onChange} className="md:col-span-2">
          <option value="casual">Casual dining</option>
          <option value="family">Family gathering</option>
          <option value="birthday">Birthday</option>
          <option value="anniversary">Anniversary</option>
          <option value="business">Business meal</option>
          <option value="highway">Highway stop</option>
        </Select>
        <Textarea
          label="Anything we should know?"
          name="notes"
          value={form.notes}
          onChange={onChange}
          placeholder="High chair, window seat, dietary notes…"
          className="md:col-span-2"
        />
      </div>

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn-primary mt-10 w-full md:w-auto md:px-12"
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
              <Loader2 size={16} className="animate-spin" /> Holding your table…
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Confirm Reservation
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </form>
  );
}
