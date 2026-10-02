"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, KeyRound } from "lucide-react";
import { Alert, Button, Card, CardBody, Field, Input, Select, Textarea } from "@/components/ui";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Form {
  capacity: "OWNER" | "TENANT";
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  title: string;
  description: string;
  type: string;
  purpose: string;
  bedrooms: string;
  bathrooms: string;
  areaSqm: string;
  address: string;
  city: string;
  state: string;
  price: string;
}

const initial: Form = {
  capacity: "OWNER", ownerName: "", ownerPhone: "", ownerEmail: "",
  title: "", description: "", type: "RESIDENTIAL", purpose: "RENT", bedrooms: "", bathrooms: "", areaSqm: "",
  address: "", city: "", state: "", price: "",
};

const STEPS = ["Who you are", "The property", "Location & price"];

export function ListingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(initial);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const valid = [
    f.capacity === "OWNER" || f.ownerName.trim().length > 1,
    f.title.trim().length >= 3 && f.description.trim().length >= 10,
    f.address.trim().length >= 3 && f.city.trim().length >= 2 && f.state.trim().length >= 2 && Number(f.price) > 0,
  ];

  const num = (v: string) => (v ? Number(v) : undefined);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const { property } = await api<{ property: { id: string } }>("/api/properties", "POST", {
        capacity: f.capacity,
        owner: f.capacity === "TENANT" ? { name: f.ownerName, phone: f.ownerPhone || undefined, email: f.ownerEmail || undefined } : undefined,
        title: f.title, description: f.description, type: f.type, purpose: f.purpose,
        bedrooms: num(f.bedrooms), bathrooms: num(f.bathrooms), areaSqm: num(f.areaSqm),
        address: f.address, city: f.city, state: f.state, price: Number(f.price),
      });
      router.push(`/dashboard/listings/${property.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the listing");
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <ol className="mb-6 flex gap-2" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1">
            <div className={cn("h-1.5 rounded-full", i <= step ? "bg-brand-600" : "bg-line")} />
            <p className={cn("mt-2 text-xs font-medium", i === step ? "text-brand-700" : "text-ink-subtle")}>{i + 1}. {s}</p>
          </li>
        ))}
      </ol>

      <Card>
        <CardBody className="space-y-5">
          {step === 0 && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                {([
                  { v: "OWNER", icon: KeyRound, t: "I own this property", d: "You'll prove ownership with a CofO or utility bill." },
                  { v: "TENANT", icon: Building, t: "I'm the current tenant", d: "Listing on behalf of the owner, whose details we'll need." },
                ] as const).map((o) => (
                  <button key={o.v} type="button" onClick={() => setF((p) => ({ ...p, capacity: o.v }))}
                    className={cn("rounded-card border p-4 text-left transition-colors", f.capacity === o.v ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200" : "border-line hover:border-brand-300")}>
                    <o.icon className="size-5 text-brand-600" />
                    <p className="mt-3 font-medium">{o.t}</p>
                    <p className="mt-1 text-sm text-ink-muted">{o.d}</p>
                  </button>
                ))}
              </div>
              {f.capacity === "TENANT" && (
                <div className="space-y-4">
                  <Alert tone="info">Agents can&apos;t list on RASPA. As a tenant you must name the property owner.</Alert>
                  <Field label="Owner's full name"><Input value={f.ownerName} onChange={set("ownerName")} /></Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Owner's phone"><Input value={f.ownerPhone} onChange={set("ownerPhone")} inputMode="tel" /></Field>
                    <Field label="Owner's email"><Input type="email" value={f.ownerEmail} onChange={set("ownerEmail")} /></Field>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <Field label="Listing title"><Input value={f.title} onChange={set("title")} placeholder="e.g. Spacious 3-bedroom flat in Lekki Phase 1" /></Field>
              <Field label="Description" hint="What makes it a good place? Be specific and honest."><Textarea value={f.description} onChange={set("description")} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Property type">
                  <Select value={f.type} onChange={set("type")}>
                    <option value="RESIDENTIAL">Residential</option><option value="COMMERCIAL">Commercial</option>
                    <option value="INDUSTRIAL">Industrial</option><option value="LANDED">Land</option>
                  </Select>
                </Field>
                <Field label="Listing for">
                  <Select value={f.purpose} onChange={set("purpose")}>
                    <option value="RENT">Rent</option><option value="SALE">Sale</option>
                    <option value="INVEST">Investment</option><option value="INSTALLMENT">Installments</option>
                  </Select>
                </Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Bedrooms"><Input type="number" min={0} value={f.bedrooms} onChange={set("bedrooms")} /></Field>
                <Field label="Bathrooms"><Input type="number" min={0} value={f.bathrooms} onChange={set("bathrooms")} /></Field>
                <Field label="Size (sqm)"><Input type="number" min={0} value={f.areaSqm} onChange={set("areaSqm")} /></Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Street address"><Input value={f.address} onChange={set("address")} /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City / area"><Input value={f.city} onChange={set("city")} /></Field>
                <Field label="State"><Input value={f.state} onChange={set("state")} /></Field>
              </div>
              <Field label={f.purpose === "RENT" ? "Annual rent (₦)" : "Price (₦)"}><Input type="number" min={0} value={f.price} onChange={set("price")} /></Field>
            </>
          )}

          {error && <Alert tone="danger">{error}</Alert>}

          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>Back</Button>
            {step < 2 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!valid[step]}>Continue</Button>
            ) : (
              <Button onClick={submit} disabled={!valid.every(Boolean)} loading={loading}>Create listing</Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
