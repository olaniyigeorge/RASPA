import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-control border border-line-strong bg-surface px-3.5 text-sm text-ink placeholder:text-ink-subtle " +
  "transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:bg-canvas disabled:text-ink-subtle";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-28 py-3", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(control, "h-11 pr-8", className)} {...props} />;
}

export function Field({ label, hint, error, children, className }: { label: string; hint?: string; error?: string | null; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-ink-subtle">{hint}</span>}
      {error && <span className="mt-1.5 block text-xs font-medium text-danger-600">{error}</span>}
    </label>
  );
}
