import { prisma, Prisma } from "../../../shared/infrastructure/prisma";
import type { Activity } from "../domain/scoring";
import type { ActivityInput } from "../application/discovery-use-cases";

export const prismaActivityRepository = {
  async record(userId: string, a: ActivityInput) {
    await prisma.userActivity.create({
      data: {
        userId,
        kind: a.kind,
        query: a.query,
        city: a.city,
        propertyId: a.propertyId,
        latitude: a.latitude,
        longitude: a.longitude,
        filters: (a.filters as Prisma.InputJsonValue | undefined) ?? undefined,
      },
    });
  },
  async recent(userId: string, limit: number): Promise<Activity[]> {
    const rows = await prisma.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.map((r) => ({
      kind: r.kind,
      query: r.query,
      city: r.city,
      propertyId: r.propertyId,
      latitude: r.latitude,
      longitude: r.longitude,
      filters: r.filters as Activity["filters"],
      createdAt: r.createdAt,
    }));
  },
};
