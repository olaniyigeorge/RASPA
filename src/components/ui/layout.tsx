import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, size = "xl", ...props }: ComponentProps<"div"> & { size?: "md" | "lg" | "xl" }) {
  const max = { md: "max-w-3xl", lg: "max-w-5xl", xl: "max-w-7xl" }[size];
  return <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", max, className)} {...props} />;
}

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: ReactNode; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Section({ title, description, action, children, className }: { title?: string; description?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("py-12 sm:py-16", className)}>
      <Container>
        {(title || action) && (
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              {title && <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>}
              {description && <p className="mt-2 max-w-2xl text-ink-muted">{description}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
      {icon && <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">{icon}</div>}
      <p className="text-base font-semibold text-ink">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{label}</p>
        {icon && <span className="text-brand-500">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-subtle">{hint}</p>}
    </div>
  );
}

export function Alert({ tone = "info", title, children }: { tone?: "info" | "warning" | "danger" | "success"; title?: string; children?: ReactNode }) {
  const t = {
    info: "bg-info-50 text-info-700 border-info-600/20",
    warning: "bg-warning-50 text-warning-700 border-warning-600/20",
    danger: "bg-danger-50 text-danger-700 border-danger-600/20",
    success: "bg-success-50 text-success-700 border-success-600/20",
  }[tone];
  return (
    <div className={cn("rounded-control border px-4 py-3 text-sm", t)} role="status">
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? "mt-0.5" : ""}>{children}</div>}
    </div>
  );
}

export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full text-left text-sm [&_td]:px-6 [&_td]:py-3.5 [&_th]:px-6 [&_th]:py-3 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-ink-subtle [&_tbody_tr]:border-t [&_tbody_tr]:border-line", className)} {...props} />
    </div>
  );
}
