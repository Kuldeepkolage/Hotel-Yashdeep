import React from "react";

export default function AdminPageHeader({
  title,
  subtitle,
  icon: Icon,
  actions,
  badge,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-2xs">
            <Icon size={22} />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl text-dark tracking-tight font-bold">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/15 text-secondary border border-secondary/30 shrink-0">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
