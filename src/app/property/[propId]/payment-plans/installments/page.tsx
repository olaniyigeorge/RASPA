import { PaymentPlanDetail } from "../payment-plan-detail";

export default async function InstallmentsPage({
  params,
}: {
  params: Promise<{ propId: string }>;
}) {
  const { propId } = await params;
  return <PaymentPlanDetail propId={propId} planType="INSTALLMENTS" />;
}
