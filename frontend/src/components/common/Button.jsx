import { Link } from "react-router-dom";
import { cx } from "../../utils/format";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-500 ease-luxe";

const variants = {
  primary: "bg-primary text-background hover:bg-dark shadow-soft hover:shadow-luxe",
  outline: "border border-dark/20 text-dark hover:border-primary hover:text-primary",
  gold: "bg-secondary text-dark hover:bg-dark hover:text-secondary",
  ghost: "text-dark hover:text-primary",
};

export default function Button({
  as = "button",
  to,
  href,
  variant = "primary",
  className,
  children,
  ...props
}) {
  const cls = cx(base, variants[variant], className);
  if (as === "link" && to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  if (as === "a" || href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
