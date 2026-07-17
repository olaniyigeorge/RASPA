import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPropertyBySlugOrId } from "@/lib/properties";

interface RouteParams {
  params: Promise<{ propId: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { propId } = await params;
  const property = await getPropertyBySlugOrId(propId);
  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ property });
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  const { propId } = await params;
  const property = await prisma.property.findUnique({ where: { id: propId } });

  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!session?.user || (session.user.id !== property.agentId && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const updated = await prisma.property.update({ where: { id: propId }, data: body });
  return NextResponse.json({ property: updated });
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();
  const { propId } = await params;
  const property = await prisma.property.findUnique({ where: { id: propId } });

  if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!session?.user || (session.user.id !== property.agentId && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.property.delete({ where: { id: propId } });
  return NextResponse.json({ success: true });
}
