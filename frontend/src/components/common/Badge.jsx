import { cx } from "../../utils/format";

export default function Badge({ children, tone = "gold", className }) {
  const tones = {
    gold: "bg-secondary/15 text-secondary border-secondary/30",
    primary: "bg-primary/10 text-primary border-primary/20",
    dark: "bg-dark/10 text-dark border-dark/20",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-widest2",
        tones[tone],
        className
      )}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {children}
    </span>
  );
}
