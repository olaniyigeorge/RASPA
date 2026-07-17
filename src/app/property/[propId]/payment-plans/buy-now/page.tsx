import { PaymentPlanDetail } from "../payment-plan-detail";

export default async function BuyNowPage({
  params,
}: {
  params: Promise<{ propId: string }>;
}) {
  const { propId } = await params;
  return <PaymentPlanDetail propId={propId} planType="BUY_NOW" />;
}
