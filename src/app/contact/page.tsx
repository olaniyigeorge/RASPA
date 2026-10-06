import type { Metadata } from "next";
import { Card, CardBody, Container, PageHeader } from "@/components/ui";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container size="md" className="py-12">
      <PageHeader title="Contact us" description="Questions about a listing, verification or payments? Send us a message." />
      <Card className="mt-8">
        <CardBody>
          <ContactForm />
        </CardBody>
      </Card>
    </Container>
  );
}
