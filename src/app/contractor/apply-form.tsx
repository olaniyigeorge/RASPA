"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Field, Input } from "@/components/ui";
import { api } from "@/lib/api";

const SKILLS = [
  { v: "PHOTOS", l: "Photography" },
  { v: "VIDEO", l: "Video walkthroughs" },
  { v: "DRONE_VIDEO", l: "Drone video" },
  { v: "SCAN_3D", l: "3D scanning" },
];

export function ApplyForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    try {
      await api("/api/contractor/apply", "POST", { skills: f.getAll("skills"), city: f.get("city") || undefined, state: f.get("state") || undefined });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">What can you capture?</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {SKILLS.map((s) => (
            <label key={s.v} className="flex items-center gap-2.5 rounded-control border border-line px-3.5 py-3 text-sm has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
              <input type="checkbox" name="skills" value={s.v} className="size-4 accent-brand-600" /> {s.l}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City"><Input name="city" /></Field>
        <Field label="State"><Input name="state" /></Field>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
      <Button type="submit" loading={loading}>Apply</Button>
    </form>
  );
}
