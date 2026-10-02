import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-canvas text-ink-muted ring-line",
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  success: "bg-success-50 text-success-700 ring-success-600/20",
  warning: "bg-warning-50 text-warning-700 ring-warning-600/20",
  danger: "bg-danger-50 text-danger-700 ring-danger-600/20",
  info: "bg-info-50 text-info-700 ring-info-600/20",
};

export function Badge({ tone = "neutral", icon, className, children }: { tone?: Tone; icon?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", tones[tone], className)}>
      {icon}
      {children}
    </span>
  );
}
