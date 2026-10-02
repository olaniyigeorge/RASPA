"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/session", { method: "DELETE" }).finally(() => {
      router.replace("/");
      router.refresh();
    });
  }, [router]);

  return <p className="p-12 text-center text-gray-500">Signing you out…</p>;
}
