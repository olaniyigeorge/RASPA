"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerAction, signInAction } from "@/components/accounts/actions";

export default function AccountsPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("callbackUrl", callbackUrl);

    startTransition(async () => {
      const action = mode === "sign-in" ? signInAction : registerAction;
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setMode("sign-in")}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            mode === "sign-in" ? "bg-purple-700 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Sign in
        </button>
        <button
          onClick={() => setMode("sign-up")}
          className={`flex-1 rounded-full py-2 text-sm font-medium ${
            mode === "sign-up" ? "bg-purple-700 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Sign up
        </button>
      </div>

      <form action={handleSubmit} className="space-y-4">
        {mode === "sign-up" && (
          <input
            name="name"
            placeholder="Full name"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-purple-700 py-3 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50"
        >
          {pending ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="mt-6 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Continue with Google
      </button>
    </div>
  );
}
