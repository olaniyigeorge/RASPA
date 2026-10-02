"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Field, Input, Select } from "@/components/ui";
import { api } from "@/lib/api";

export function TicketForm({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setLoading(true);
    setError(null);
    try {
      const amount = String(f.get("amountDue") ?? "");
      await api(`/api/properties/${propertyId}/management`, "POST", {
        action: "raise_ticket",
        category: f.get("category"),
        title: f.get("title"),
        description: String(f.get("description") ?? "") || undefined,
        amountDue: amount ? Number(amount) : undefined,
      });
      form.reset();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Type">
        <Select name="category" defaultValue="BILL">
          <option value="BILL">Bill</option><option value="UTILITY">Utility</option><option value="WASTE">Waste</option>
          <option value="DISPUTE">Dispute</option><option value="MAINTENANCE">Maintenance</option><option value="OTHER">Other</option>
        </Select>
      </Field>
      <Field label="Amount due (₦, optional)"><Input name="amountDue" type="number" min={0} /></Field>
      <Field label="Title" className="sm:col-span-2"><Input name="title" required minLength={3} placeholder="e.g. Electricity bill for October" /></Field>
      <Field label="Details" className="sm:col-span-2"><Input name="description" /></Field>
      {error && <div className="sm:col-span-2"><Alert tone="danger">{error}</Alert></div>}
      <div className="sm:col-span-2"><Button type="submit" loading={loading}>Add</Button></div>
    </form>
  );
}
