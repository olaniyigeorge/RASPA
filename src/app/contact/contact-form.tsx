"use client";

import { useActionState } from "react";
import { Alert, Button, Field, Input, Textarea } from "@/components/ui";
import { sendContactMessage, type ContactState } from "./actions";

const initialState: ContactState = { ok: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);

  if (state.ok) {
    return <Alert tone="success" title="Message sent">Thanks for reaching out. We&apos;ll reply to your email soon.</Alert>;
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="danger">{state.error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={state.fieldErrors?.name}><Input name="name" defaultValue={state.values?.name} required autoComplete="name" /></Field>
        <Field label="Email" error={state.fieldErrors?.email}><Input name="email" type="email" defaultValue={state.values?.email} required autoComplete="email" /></Field>
      </div>
      <Field label="Message" error={state.fieldErrors?.message}><Textarea name="message" rows={5} defaultValue={state.values?.message} required /></Field>
      <Button type="submit" loading={pending}>Send message</Button>
    </form>
  );
}
