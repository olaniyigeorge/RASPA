import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const initPaymentSchema = z.object({
  propertyId: z.string(),
  planType: z.enum(["BUY_NOW", "INSTALLMENTS", "INVEST", "RENT"]),
  amount: z.number().positive(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = initPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { propertyId, planType, amount } = parsed.data;

  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) return NextResponse.json({ error: "Property not found" }, { status: 404 });

  const payment = await prisma.payment.create({
    data: {
      userId: session.user.id,
      propertyId,
      planType,
      amount,
      currency: property.currency,
      provider: "paystack", // swap for your provider of choice
      status: "PENDING",
    },
  });

  // --- Provider integration point -----------------------------------------
  // Example (Paystack): initialize a transaction and return the
  // authorization_url for redirect. Verify via webhook (HMAC-signed, like
  // the KYC webhook pattern in CoopWise) before flipping status to
  // SUCCESSFUL — never trust the client-side redirect alone.
  //
  // const initRes = await fetch("https://api.paystack.co/transaction/initialize", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     email: session.user.email,
  //     amount: Math.round(amount * 100), // kobo
  //     reference: payment.id,
  //     callback_url: `${process.env.AUTH_URL}/confirm-payment/${payment.id}`,
  //   }),
  // });
  // const initData = await initRes.json();
  // await prisma.payment.update({
  //   where: { id: payment.id },
  //   data: { providerRef: initData.data.reference },
  // });
  // return NextResponse.json({
  //   paymentId: payment.id,
  //   authorizationUrl: initData.data.authorization_url,
  // });
  // --------------------------------------------------------------------------

  return NextResponse.json({ paymentId: payment.id }, { status: 201 });
}
