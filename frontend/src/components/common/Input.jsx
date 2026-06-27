import { cx } from "../../utils/format";

export function Input({ label, name, error, className, ...props }) {
  return (
    <label className={cx("block", className)}>
      <span className="text-[11px] font-medium uppercase tracking-widest2 text-muted">
        {label}
      </span>
      <input
        name={name}
        className="input-luxe mt-2"
        data-testid={`input-${name}`}
        {...props}
      />
      {error && (
        <span className="mt-2 block text-xs text-primary" data-testid={`error-${name}`}>
          {error}
        </span>
      )}
    </label>
  );
}

export function Select({ label, name, error, children, className, ...props }) {
  return (
    <label className={cx("block", className)}>
      <span className="text-[11px] font-medium uppercase tracking-widest2 text-muted">
        {label}
      </span>
      <select
        name={name}
        className="input-luxe mt-2 appearance-none cursor-pointer"
        data-testid={`select-${name}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <span className="mt-2 block text-xs text-primary" data-testid={`error-${name}`}>
          {error}
        </span>
      )}
    </label>
  );
}

export function Textarea({ label, name, error, className, ...props }) {
  return (
    <label className={cx("block", className)}>
      <span className="text-[11px] font-medium uppercase tracking-widest2 text-muted">
        {label}
      </span>
      <textarea
        name={name}
        rows={4}
        className="input-luxe mt-2 resize-none"
        data-testid={`textarea-${name}`}
        {...props}
      />
      {error && (
        <span className="mt-2 block text-xs text-primary" data-testid={`error-${name}`}>
          {error}
        </span>
      )}
    </label>
  );
}
