import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/accounts");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/accounts");

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Your profile</h1>

      <div className="mt-6 space-y-4 rounded-2xl border border-gray-100 p-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Name</p>
          <p className="mt-1 text-gray-900">{user.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Email</p>
          <p className="mt-1 text-gray-900">{user.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Phone</p>
          <p className="mt-1 text-gray-900">{user.phone ?? "—"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400">Role</p>
          <p className="mt-1 text-gray-900">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
