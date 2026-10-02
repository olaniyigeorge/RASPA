"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Video, Wallet } from "lucide-react";
import { Alert, Button, Card, CardBody } from "@/components/ui";
import { Logo } from "@/components/layout/logo";
import { signInWithGoogle } from "@/modules/identity/infrastructure/firebase-client";

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.8 2.300-8.300 2.300-6.300 0-11.600-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z" />
    </svg>
  );
}

function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl") ?? "/dashboard";

  async function handleGoogle() {
    setError(null);
    setPending(true);
    try {
      await signInWithGoogle();
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setPending(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-12 px-4 py-8 lg:grid-cols-2">
      <div className="hidden lg:block">
        <h1 className="text-4xl font-semibold leading-tight">Real estate without the middleman.</h1>
        <ul className="mt-8 space-y-5 text-ink-muted">
          {[
            { icon: BadgeCheck, t: "Verified listings", d: "Ownership checked by our team." },
            { icon: Video, t: "View remotely", d: "Video and 3D scans before you visit." },
            { icon: Wallet, t: "Pay securely", d: "Direct to the owner via Paystack." },
          ].map((i) => (
            <li key={i.t} className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><i.icon className="size-5" /></span>
              <span><span className="block font-medium text-ink">{i.t}</span>{i.d}</span>
            </li>
          ))}
        </ul>
      </div>

      <Card className="shadow-raised">
        <CardBody className="p-8">
          <Logo />
          <h2 className="mt-6 text-2xl font-semibold">Welcome</h2>
          <p className="mt-1 text-sm text-ink-muted">Sign in or create an account with Google to rent, buy or list a property.</p>
          {error && <div className="mt-4"><Alert tone="danger">{error}</Alert></div>}
          <Button variant="outline" size="lg" className="mt-6 w-full" onClick={handleGoogle} loading={pending}>
            {!pending && <GoogleMark />} Continue with Google
          </Button>
          <p className="mt-6 text-xs leading-relaxed text-ink-subtle">By continuing you agree to RASPA&apos;s terms and confirm you are not an agent or realtor.</p>
        </CardBody>
      </Card>
    </div>
  );
}

export default function AccountsPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
