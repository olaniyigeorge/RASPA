import { prisma } from "../../../shared/infrastructure/prisma";
import { fromDecimal } from "../../../shared/kernel/money";
import type { CaptureTask, Contractor } from "../domain/capture-task";
import type { ContractorRepository, MediaRepository, TaskRepository } from "../domain/ports";
import type { CaptureTask as TaskRow, Contractor as ContractorRow } from "../../../../prisma/prisma-client";

const toTask = (r: TaskRow & { _count?: { media: number } }): CaptureTask => ({
  id: r.id,
  propertyId: r.propertyId,
  kind: r.kind,
  status: r.status,
  contractorId: r.contractorId,
  payoutAmount: fromDecimal(r.payoutAmount),
  mediaCount: r._count?.media ?? 0,
});

const toContractor = (r: ContractorRow): Contractor => ({
  id: r.id,
  userId: r.userId,
  status: r.status,
  skills: r.skills,
});

const withCount = { _count: { select: { media: true } } } as const;

export const prismaMediaRepository: MediaRepository = {
  async add(m) {
    const row = await prisma.mediaAsset.create({
      data: {
        propertyId: m.propertyId,
        uploadedById: m.uploadedById,
        kind: m.kind,
        source: m.source,
        publicId: m.publicId,
        url: m.url,
        resourceType: m.resourceType,
        format: m.format,
        width: m.width,
        height: m.height,
        durationSec: m.durationSec,
        bytes: m.bytes,
        captureTaskId: m.captureTaskId,
        position: await prisma.mediaAsset.count({ where: { propertyId: m.propertyId, kind: m.kind } }),
      },
    });
    return { id: row.id };
  },
  async remove(id) {
    const row = await prisma.mediaAsset.delete({ where: { id } }).catch(() => null);
    return row ? { propertyId: row.propertyId, uploadedById: row.uploadedById } : null;
  },
};

export const prismaTaskRepository: TaskRepository = {
  async create({ propertyId, requestedById, kind, payoutAmount, status, instructions, scheduledFor }) {
    return toTask(
      await prisma.captureTask.create({
        data: { propertyId, requestedById, kind, payoutAmount, status, instructions, scheduledFor },
        include: withCount,
      })
    );
  },
  async findById(id) {
    const r = await prisma.captureTask.findUnique({ where: { id }, include: withCount });
    return r ? toTask(r) : null;
  },
  async save(t, reviewNote) {
    await prisma.captureTask.update({
      where: { id: t.id },
      data: { status: t.status, contractorId: t.contractorId, ...(reviewNote && { reviewNote }) },
    });
  },
};

export const prismaContractorRepository: ContractorRepository = {
  async findByUserId(userId) {
    const r = await prisma.contractor.findUnique({ where: { userId } });
    return r ? toContractor(r) : null;
  },
  async findById(id) {
    const r = await prisma.contractor.findUnique({ where: { id } });
    return r ? toContractor(r) : null;
  },
  async apply(userId, skills, city, state) {
    return toContractor(
      await prisma.contractor.upsert({
        where: { userId },
        create: { userId, skills, city, state },
        update: { skills, city, state },
      })
    );
  },
  async save(c) {
    await prisma.contractor.update({ where: { id: c.id }, data: { status: c.status, skills: c.skills } });
  },
};

/** Open work board for active contractors (read side). */
export function listOpenTasks(skills: string[]) {
  return prisma.captureTask.findMany({
    where: { status: "OPEN", kind: { in: skills as never[] } },
    include: { property: { select: { id: true, title: true, address: true, city: true, state: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export function listTasksForContractor(contractorId: string) {
  return prisma.captureTask.findMany({
    where: { contractorId },
    include: { property: { select: { id: true, title: true, address: true, city: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export function listTasksAwaitingReview() {
  return prisma.captureTask.findMany({
    where: { status: "SUBMITTED" },
    include: { media: true, property: { select: { id: true, title: true } } },
    orderBy: { updatedAt: "asc" },
  });
}

export function listContractorApplications() {
  return prisma.contractor.findMany({
    where: { status: "APPLIED" },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
}
