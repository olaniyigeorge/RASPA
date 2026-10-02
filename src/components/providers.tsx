"use client";

import type { ReactNode } from "react";

// Auth state is server-side (session cookie), so there is no client session provider.
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
