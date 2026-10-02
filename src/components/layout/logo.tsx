import Link from "next/link";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-white">
        <Building2 className="size-4.5" />
      </span>
      <span className={cn("text-lg", tone === "light" ? "text-white" : "text-ink")}>RASPA</span>
    </Link>
  );
}
