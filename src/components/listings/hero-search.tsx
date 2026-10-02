"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const PURPOSES = [
  { value: "RENT", label: "Rent" },
  { value: "SALE", label: "Buy" },
  { value: "INVEST", label: "Invest" },
];

export function HeroSearch() {
  const router = useRouter();
  const [purpose, setPurpose] = useState("RENT");
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ purpose });
    if (q.trim()) params.set("q", q.trim());
    router.push(`/explore?${params}`);
  }

  return (
    <form onSubmit={submit} className="w-full max-w-2xl rounded-card bg-surface p-2 shadow-raised">
      <div className="flex gap-1 p-1" role="tablist" aria-label="I want to">
        {PURPOSES.map((p) => (
          <button
            key={p.value}
            type="button"
            role="tab"
            aria-selected={purpose === p.value}
            onClick={() => setPurpose(p.value)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              purpose === p.value ? "bg-brand-600 text-white" : "text-ink-muted hover:bg-brand-50 hover:text-brand-700"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 p-1 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-ink-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="City, area or property name — e.g. Lekki"
            aria-label="Search location"
            className="h-12 w-full rounded-control border border-line bg-canvas pl-11 pr-4 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
          />
        </div>
        <Button size="lg" type="submit">Search</Button>
      </div>
    </form>
  );
}
