"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { BadgeCheck, SlidersHorizontal } from "lucide-react";
import { Button, Field, Input, Select } from "@/components/ui";
import { cn } from "@/lib/utils";

const PURPOSES = [
  { value: "", label: "All" },
  { value: "RENT", label: "Rent" },
  { value: "SALE", label: "Buy" },
  { value: "INVEST", label: "Invest" },
  { value: "INSTALLMENT", label: "Installments" },
];

/** Filter state lives in the URL so results are shareable and server-rendered. */
export function ExploreFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const [pending, start] = useTransition();
  const [open, setOpen] = useState(false);

  function apply(next: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    start(() => router.push(`/explore?${params}`));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    apply({
      q: String(f.get("q") ?? "").trim() || null,
      city: String(f.get("city") ?? "").trim() || null,
      type: String(f.get("type") ?? "") || null,
      minPrice: String(f.get("minPrice") ?? "") || null,
      maxPrice: String(f.get("maxPrice") ?? "") || null,
    });
    setOpen(false);
  }

  const purpose = sp.get("purpose") ?? "";
  const verified = sp.get("verified") === "1";

  return (
    <div className={cn("space-y-4", pending && "opacity-70")}>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5">
          {PURPOSES.map((p) => (
            <button
              key={p.label}
              onClick={() => apply({ purpose: p.value || null })}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                purpose === p.value ? "bg-brand-600 text-white shadow-sm" : "bg-surface text-ink-muted ring-1 ring-inset ring-line hover:text-brand-700 hover:ring-brand-300"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => apply({ verified: verified ? null : "1" })}
          aria-pressed={verified}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ring-1 ring-inset transition-colors",
            verified ? "bg-success-50 text-success-700 ring-success-600/30" : "bg-surface text-ink-muted ring-line hover:ring-brand-300"
          )}
        >
          <BadgeCheck className="size-4" /> Verified only
        </button>
        <Button variant="outline" size="sm" className="ml-auto lg:hidden" onClick={() => setOpen((v) => !v)}>
          <SlidersHorizontal className="size-4" /> Filters
        </Button>
      </div>

      <form
        key={sp.toString()}
        onSubmit={onSubmit}
        className={cn("grid gap-3 rounded-card border border-line bg-surface p-4 shadow-card sm:grid-cols-2 lg:grid-cols-[2fr_1.2fr_1.2fr_1fr_1fr_auto] lg:items-end", !open && "hidden lg:grid")}
      >
        <Field label="Search"><Input name="q" defaultValue={sp.get("q") ?? ""} placeholder="Name or keyword" /></Field>
        <Field label="City"><Input name="city" defaultValue={sp.get("city") ?? ""} placeholder="e.g. Lagos" /></Field>
        <Field label="Type">
          <Select name="type" defaultValue={sp.get("type") ?? ""}>
            <option value="">Any type</option>
            <option value="RESIDENTIAL">Residential</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="INDUSTRIAL">Industrial</option>
            <option value="LANDED">Land</option>
          </Select>
        </Field>
        <Field label="Min price (₦)"><Input name="minPrice" type="number" min={0} defaultValue={sp.get("minPrice") ?? ""} /></Field>
        <Field label="Max price (₦)"><Input name="maxPrice" type="number" min={0} defaultValue={sp.get("maxPrice") ?? ""} /></Field>
        <Button type="submit" loading={pending}>Apply</Button>
      </form>
    </div>
  );
}
