import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { listProperties } from "@/lib/properties";

const createPropertySchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "LANDED"]),
  purpose: z.enum(["SALE", "RENT", "INVEST", "INSTALLMENT"]),
  price: z.number().positive(),
  currency: z.string().default("NGN"),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  areaSqm: z.number().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const properties = await listProperties({
    purpose: (searchParams.get("purpose") as never) ?? undefined,
    type: (searchParams.get("type") as never) ?? undefined,
    city: searchParams.get("city") ?? undefined,
    q: searchParams.get("q") ?? undefined,
  });

  return NextResponse.json({ properties });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["AGENT", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createPropertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const property = await prisma.property.create({
    data: {
      ...parsed.data,
      agentId: session.user.id,
      status: "DRAFT",
    },
  });

  return NextResponse.json({ property }, { status: 201 });
}
