"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, ShieldCheck, Camera, UserRound, X } from "lucide-react";
import { buttonStyles } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

interface HeaderUser {
  name: string | null;
  image: string | null;
  email: string;
  role: string;
}

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/takeovers", label: "Rental takeovers" },
  { href: "/about-us", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeaderClient({ user }: { user: HeaderUser | null }) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    setMenu(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const accountLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/accounts/profile", label: "Profile & payouts", icon: UserRound },
    ...(user?.role === "CONTRACTOR" ? [{ href: "/contractor", label: "Contractor tasks", icon: Camera }] : []),
    ...(user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin console", icon: ShieldCheck }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(l.href) ? "text-brand-700" : "text-ink-muted hover:text-ink"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/get-started" className={buttonStyles({ variant: "secondary", size: "sm" })}>
            List a property
          </Link>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 hover:border-brand-300"
                aria-expanded={menu}
                aria-label="Account menu"
              >
                <Avatar user={user} />
                <span className="max-w-28 truncate text-sm font-medium">{user.name?.split(" ")[0] ?? "Account"}</span>
              </button>
              {menu && (
                <div className="animate-scale-in absolute right-0 mt-2 w-60 rounded-card border border-line bg-surface p-1.5 shadow-raised" onClick={() => setMenu(false)}>
                  <p className="truncate px-3 py-2 text-xs text-ink-subtle">{user.email}</p>
                  {accountLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-50">
                      <l.icon className="size-4 text-ink-muted" />
                      {l.label}
                    </Link>
                  ))}
                  <button onClick={signOut} className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-50">
                    <LogOut className="size-4 text-ink-muted" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/accounts" className={buttonStyles({ size: "sm" })}>
              Sign in
            </Link>
          )}
        </div>

        <button className="rounded-lg p-2 text-ink md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" aria-expanded={open}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-up border-t border-line bg-surface px-4 pb-5 pt-3 md:hidden" onClick={() => setOpen(false)}>
          <nav className="flex flex-col" aria-label="Mobile">
            {[...NAV, ...(user ? accountLinks : [])].map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-brand-50">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid gap-2">
            <Link href="/get-started" className={buttonStyles({ variant: "secondary" })}>
              List a property
            </Link>
            {user ? (
              <button onClick={signOut} className={buttonStyles({ variant: "outline" })}>Sign out</button>
            ) : (
              <Link href="/accounts" className={buttonStyles()}>Sign in</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function Avatar({ user }: { user: HeaderUser }) {
  if (user.image) {
    return <Image src={user.image} alt="" width={28} height={28} className="size-7 rounded-full object-cover" />;
  }
  return (
    <span className="flex size-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
      {(user.name ?? user.email).charAt(0).toUpperCase()}
    </span>
  );
}
