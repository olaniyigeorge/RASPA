"use client";

import { useState, type FormEvent } from "react";

export function NewsLetterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      // NOTE: there is no src/app/api/newsletter route in the current tree —
      // this will 404 until one is added (or point it at a real provider).
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-5/6 items-center overflow-hidden rounded-full bg-white shadow md:w-1/2"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 p-3 text-sm text-gray-800 focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-purple-600 px-5 py-3 text-sm font-bold text-white hover:bg-purple-800 disabled:opacity-60"
      >
        {status === "loading" ? "Signing up..." : "Sign up"}
      </button>
      {status === "success" && (
        <span className="sr-only">Signed up successfully</span>
      )}
      {status === "error" && (
        <span className="sr-only">Something went wrong, try again</span>
      )}
    </form>
  );
}
































// import { NewspaperIcon } from "@heroicons/react/24/solid";




// export default function NewsLetterForm() {


//     return <div className="w-full flex justify-center">
        
//         <div className="bg-white flex w-2/3 items-center border rounded-full space-x-1 p-1">
//             <NewspaperIcon className="text-purple-600 w-8 h-8 p-1 " />
//             <input type="text" placeholder="Enter your email" className="text-gray-800 focus:outline-none focus:ring-0 active:border-0 w-full h-full p-2" />
//             <input type="submit" className="bg-purple-600 text-sm  hover:bg-purple-700 text-white py-2 px-3 rounded-full" />
//         </div>
//     </div>
// }