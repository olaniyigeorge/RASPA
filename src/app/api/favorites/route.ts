import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { prisma } from "@/shared/infrastructure/prisma";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({ propertyId: z.string() });

export const POST = route(async (req: NextRequest) => {
  const user = await requireUser();
  const { propertyId } = schema.parse(await req.json());

  const favorite = await prisma.favorite.upsert({
    where: { userId_propertyId: { userId: user.id, propertyId } },
    create: { userId: user.id, propertyId },
    update: {},
  });
  return NextResponse.json({ favorite }, { status: 201 });
});

export const DELETE = route(async (req: NextRequest) => {
  const user = await requireUser();
  const { propertyId } = schema.parse(await req.json());
  await prisma.favorite.deleteMany({ where: { userId: user.id, propertyId } });
  return NextResponse.json({ success: true });
});
