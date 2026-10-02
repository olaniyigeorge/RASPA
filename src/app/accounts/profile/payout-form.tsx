"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Field, Input } from "@/components/ui";
import { api } from "@/lib/api";

export function PayoutForm() {
  const router = useRouter();
  const [state, setState] = useState<{ ok?: boolean; error?: string; loading?: boolean }>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState({ loading: true });
    try {
      await api("/api/payout-account", "POST", {
        bankCode: f.get("bankCode"),
        accountNumber: f.get("accountNumber"),
        accountName: f.get("accountName"),
      });
      setState({ ok: true });
      router.refresh();
    } catch (err) {
      setState({ error: err instanceof Error ? err.message : "Could not save" });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Account name"><Input name="accountName" required /></Field>
      <Field label="Account number" hint="10-digit NUBAN"><Input name="accountNumber" required pattern="\d{10}" inputMode="numeric" maxLength={10} /></Field>
      <Field label="Bank code" hint="e.g. 058 for GTBank, 044 for Access"><Input name="bankCode" required /></Field>
      <div className="flex items-end"><Button type="submit" loading={state.loading}>Save account</Button></div>
      {state.error && <div className="sm:col-span-2"><Alert tone="danger">{state.error}</Alert></div>}
      {state.ok && <div className="sm:col-span-2"><Alert tone="success">Payout account saved.</Alert></div>}
    </form>
  );
}
