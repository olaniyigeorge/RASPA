import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { propertyId } = await req.json();
  if (!propertyId) return NextResponse.json({ error: "propertyId required" }, { status: 400 });

  const favorite = await prisma.favorite.upsert({
    where: { userId_propertyId: { userId: session.user.id, propertyId } },
    create: { userId: session.user.id, propertyId },
    update: {},
  });

  return NextResponse.json({ favorite }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { propertyId } = await req.json();
  if (!propertyId) return NextResponse.json({ error: "propertyId required" }, { status: 400 });

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, propertyId },
  });

  return NextResponse.json({ success: true });
}
