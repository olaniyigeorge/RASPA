"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** The webhook, not the redirect, settles payments, so poll briefly until it lands. */
export function RefreshWhilePending() {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      router.refresh();
      if (++n >= 20) clearInterval(t);
    }, 3000);
    return () => clearInterval(t);
  }, [router]);
  return null;
}
