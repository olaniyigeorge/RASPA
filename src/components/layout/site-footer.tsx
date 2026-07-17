import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-bold text-purple-700">RASPA</p>
          <p className="mt-2 text-sm text-gray-500">
            Find, invest in, and manage real estate — all in one place.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link href="/explore?purpose=SALE">Buy</Link></li>
            <li><Link href="/explore?purpose=RENT">Rent</Link></li>
            <li><Link href="/explore?purpose=INVEST">Invest</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Company</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link href="/about-us">About us</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Get started</p>
          <ul className="mt-3 space-y-2 text-sm text-gray-500">
            <li><Link href="/get-started">List a property</Link></li>
            <li><Link href="/accounts">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} RASPA. All rights reserved.
      </div>
    </footer>
  );
}
