import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function PortfolioPage() {
  const session = await auth();
  if (!session?.user) redirect("/accounts");

  const items = await prisma.portfolioItem.findMany({
    where: { userId: session.user.id },
    include: { property: { include: { images: { take: 1 } } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Your portfolio</h1>

      {items.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
          No active plans yet.{" "}
          <Link href="/explore" className="text-purple-700 hover:underline">
            Explore properties
          </Link>{" "}
          to get started.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => {
            const pct = item.totalDue.toNumber()
              ? Math.min(100, Math.round((item.totalPaid.toNumber() / item.totalDue.toNumber()) * 100))
              : 0;

            return (
              <Link
                key={item.id}
                href={`/property/${item.property.slug}`}
                className="block rounded-2xl border border-gray-100 p-5 hover:border-purple-300"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{item.property.title}</p>
                  <span className="text-xs font-medium text-gray-500">{item.planType}</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-purple-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {formatCurrency(item.totalPaid.toString(), item.property.currency)} of{" "}
                  {formatCurrency(item.totalDue.toString(), item.property.currency)} paid ({pct}%)
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
