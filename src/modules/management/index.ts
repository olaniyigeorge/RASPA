// Public API of the management context.
import { prisma } from "../../shared/infrastructure/prisma";
import { payments } from "../payments";
import { makeManagementUseCases } from "./application/management-use-cases";

export const management = makeManagementUseCases({
  payments: { initiate: (actor, i) => payments.initiate(actor, i) },
  async canManage(propertyId, userId) {
    const p = await prisma.property.findFirst({
      where: {
        id: propertyId,
        OR: [
          { listerId: userId },
          { ownerUserId: userId },
          { tenancies: { some: { tenantId: userId, status: "ACTIVE" } } },
        ],
      },
      select: { id: true },
    });
    return !!p;
  },
});
