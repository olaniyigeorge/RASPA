import { notFound, redirect } from "next/navigation";
import { getListingDetail } from "@/modules/listings";
import { PROPERTY_PLANS } from "./plans";

/** The plan list now lives on the property page; send people to the first plan this listing offers. */
export default async function PaymentPlansIndexPage({ params }: { params: Promise<{ propId: string }> }) {
  const { propId } = await params;
  const property = await getListingDetail(propId);
  if (!property) notFound();
  const first = PROPERTY_PLANS[property.purpose]?.[0];
  redirect(first ? `/property/${property.slug}/payment-plans/${first.href}` : `/property/${property.slug}`);
}
