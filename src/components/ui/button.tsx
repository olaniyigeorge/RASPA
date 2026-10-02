import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-all duration-150 active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm",
  secondary: "bg-brand-50 text-brand-700 hover:bg-brand-100",
  outline: "border border-line-strong bg-surface text-ink hover:bg-canvas hover:border-brand-300",
  ghost: "text-ink-muted hover:bg-brand-50 hover:text-brand-700",
  danger: "bg-danger-600 text-white hover:bg-danger-700",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonStyles({ variant = "primary", size = "md", className }: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size; loading?: boolean };

export function Button({ variant, size, className, loading, disabled, children, ...props }: ButtonProps) {
  return (
    <button className={buttonStyles({ variant, size, className })} disabled={disabled || loading} {...props}>
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}

type LinkButtonProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
