import { prisma } from "../../../shared/infrastructure/prisma";
import type { User, UserRepository } from "../domain/user";

const select = {
  id: true,
  firebaseUid: true,
  email: true,
  name: true,
  image: true,
  phone: true,
  role: true,
} as const;

export const prismaUserRepository: UserRepository = {
  findById: (id) => prisma.user.findUnique({ where: { id }, select }) as Promise<User | null>,
  findByFirebaseUid: (uid) =>
    prisma.user.findUnique({ where: { firebaseUid: uid }, select }) as Promise<User | null>,
  async upsertFromIdentity(identity) {
    // A pre-existing row for this email (e.g. seeded) is adopted rather than duplicated.
    return prisma.user.upsert({
      where: { email: identity.email },
      create: {
        firebaseUid: identity.uid,
        email: identity.email,
        emailVerified: identity.emailVerified,
        name: identity.name ?? null,
        image: identity.picture ?? null,
      },
      update: {
        firebaseUid: identity.uid,
        emailVerified: identity.emailVerified,
        image: identity.picture ?? undefined,
        name: identity.name ?? undefined,
      },
      select,
    }) as Promise<User>;
  },
  async setRole(userId, role) {
    await prisma.user.update({ where: { id: userId }, data: { role } });
  },
};
