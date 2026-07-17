import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null; // middleware already redirects

  const isAgent = session.user.role === "AGENT" || session.user.role === "ADMIN";

  const [favoriteCount, paymentCount, propertyCount] = await Promise.all([
    prisma.favorite.count({ where: { userId: session.user.id } }),
    prisma.payment.count({ where: { userId: session.user.id } }),
    isAgent ? prisma.property.count({ where: { agentId: session.user.id } }) : Promise.resolve(0),
  ]);

  const stats = [
    { label: "Saved properties", value: favoriteCount, href: "/portfolio" },
    { label: "Payments made", value: paymentCount, href: "/portfolio" },
    ...(isAgent ? [{ label: "Your listings", value: propertyCount, href: "/dashboard/listings" }] : []),
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-gray-100 p-6 hover:border-purple-300"
          >
            <p className="text-3xl font-bold text-purple-700">{stat.value}</p>
            <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {isAgent && (
        <div className="mt-8">
          <Link
            href="/get-started"
            className="inline-block rounded-full bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-800"
          >
            + List a new property
          </Link>
        </div>
      )}
    </div>
  );
}
