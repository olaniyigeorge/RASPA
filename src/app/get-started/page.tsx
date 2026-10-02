import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container, PageHeader } from "@/components/ui";
import { getCurrentUser } from "@/modules/identity";
import { ListingWizard } from "./listing-wizard";

export const metadata: Metadata = { title: "List a property" };

export default async function GetStartedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/accounts?callbackUrl=/get-started");

  return (
    <Container size="md" className="py-10">
      <PageHeader
        eyebrow="Direct listing, no agents"
        title="List a property"
        description="Three quick steps. Afterwards you'll upload proof of ownership and media, which is what earns the Verified badge."
      />
      <ListingWizard />
    </Container>
  );
}
