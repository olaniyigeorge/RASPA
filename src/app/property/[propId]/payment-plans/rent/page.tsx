import { PaymentPlanDetail } from "../payment-plan-detail";

export default async function RentPage({
  params,
}: {
  params: Promise<{ propId: string }>;
}) {
  const { propId } = await params;
  return <PaymentPlanDetail propId={propId} planType="RENT" />;
}
