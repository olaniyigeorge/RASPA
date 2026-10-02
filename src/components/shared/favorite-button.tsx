"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function FavoriteButton({ propertyId, initial = false }: { propertyId: string; initial?: boolean }) {
  const [saved, setSaved] = useState(initial);
  const [error, setError] = useState(false);

  async function toggle() {
    const next = !saved;
    setSaved(next);
    setError(false);
    try {
      await api("/api/favorites", next ? "POST" : "DELETE", { propertyId });
    } catch {
      setSaved(!next); // revert; most likely not signed in
      setError(true);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle} aria-pressed={saved}>
      <Heart className={cn("size-4", saved && "fill-brand-600 text-brand-600")} />
      {error ? "Sign in to save" : saved ? "Saved" : "Save"}
    </Button>
  );
}
