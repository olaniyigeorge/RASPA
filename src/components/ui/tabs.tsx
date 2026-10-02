import Link from "next/link";
import { cn } from "@/lib/utils";

/** URL-driven pill tabs (server-renderable). */
export function PillTabs({ items }: { items: { label: string; href: string; active: boolean }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <Link
          key={t.label}
          href={t.href}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            t.active ? "bg-brand-600 text-white shadow-sm" : "bg-surface text-ink-muted ring-1 ring-inset ring-line hover:text-brand-700 hover:ring-brand-300"
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}
