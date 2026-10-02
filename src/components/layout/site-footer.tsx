import Link from "next/link";
import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/explore?purpose=RENT", label: "Rent" },
      { href: "/explore?purpose=SALE", label: "Buy" },
      { href: "/explore?purpose=INVEST", label: "Invest" },
      { href: "/takeovers", label: "Rental takeovers" },
    ],
  },
  {
    title: "Owners & tenants",
    links: [
      { href: "/get-started", label: "List a property" },
      { href: "/#how-it-works", label: "How verification works" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200/80">
            Real estate without the middleman. Verified listings, direct from owners and tenants, viewable from anywhere.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <p className="text-sm font-semibold text-white">{c.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-200/80 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-brand-200/60">
        © {new Date().getFullYear()} RASPA. All rights reserved.
      </div>
    </footer>
  );
}
