"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { api } from "@/lib/api";

interface Props {
  url: string;
  method?: "POST" | "PATCH" | "DELETE";
  body?: unknown;
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
  /** Ask for a note (e.g. a rejection reason) and send it as `note`. */
  promptNote?: string;
  confirm?: string;
}

/** Fires an API call; follows a Paystack `authorizationUrl` if one comes back, else refreshes the page. */
export function ActionButton({ url, method = "POST", body, children, promptNote, confirm: confirmText, ...rest }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    let payload = body;
    if (confirmText && !window.confirm(confirmText)) return;
    if (promptNote) {
      const note = window.prompt(promptNote);
      if (!note?.trim()) return;
      payload = { ...(body as object), note };
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api<{ authorizationUrl?: string }>(url, method, payload ?? {});
      if (res?.authorizationUrl) window.location.href = res.authorizationUrl;
      else router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button onClick={run} loading={loading} {...rest}>{children}</Button>
      {error && <span className="max-w-xs text-xs font-medium text-danger-600">{error}</span>}
    </span>
  );
}
