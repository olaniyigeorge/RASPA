import { prisma } from "../../../shared/infrastructure/prisma";
import { fromDecimal } from "../../../shared/kernel/money";
import type { Listing } from "../domain/listing";
import type { ListingRepository } from "../domain/listing-repository";
import type { Property } from "../../../../prisma/prisma-client";

export const toListing = (p: Property): Listing => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  status: p.status,
  type: p.type,
  purpose: p.purpose,
  price: fromDecimal(p.price),
  address: p.address,
  addressKey: p.addressKey,
  city: p.city,
  state: p.state,
  listerId: p.listerId,
  listerCapacity: p.listerCapacity,
  ownerUserId: p.ownerUserId,
  owner: p.ownerName ? { name: p.ownerName, phone: p.ownerPhone, email: p.ownerEmail } : null,
  cofoVerified: p.cofoVerified,
});

export const prismaListingRepository: ListingRepository = {
  async findById(id) {
    const p = await prisma.property.findUnique({ where: { id } });
    return p ? toListing(p) : null;
  },
  async create({ owner, ...input }) {
    const p = await prisma.property.create({
      data: {
        ...input,
        ownerName: owner?.name,
        ownerPhone: owner?.phone,
        ownerEmail: owner?.email,
        status: "DRAFT",
      },
    });
    return toListing(p);
  },
  async save(l) {
    await prisma.property.update({
      where: { id: l.id },
      data: {
        status: l.status,
        cofoVerified: l.cofoVerified,
        ownerUserId: l.ownerUserId,
        verifiedAt: l.status === "VERIFIED" ? new Date() : undefined,
      },
    });
  },
  async update(id, patch) {
    const { owner, ...rest } = patch;
    await prisma.property.update({
      where: { id },
      data: {
        ...rest,
        ...(owner && { ownerName: owner.name, ownerPhone: owner.phone, ownerEmail: owner.email }),
      },
    });
  },
  async delete(id) {
    await prisma.property.delete({ where: { id } });
  },
};
