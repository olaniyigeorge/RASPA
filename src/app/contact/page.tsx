import type { Metadata } from "next";
import { Button, Card, CardBody, Container, Field, Input, PageHeader, Textarea } from "@/components/ui";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <Container size="md" className="py-12">
      <PageHeader title="Contact us" description="Questions about a listing, verification or payments? Send us a message." />
      <Card className="mt-8">
        <CardBody>
          {/* TODO: wire this to a server action + email provider (Resend/SES). It does not send yet. */}
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name"><Input name="name" /></Field>
              <Field label="Email"><Input name="email" type="email" /></Field>
            </div>
            <Field label="Message"><Textarea name="message" rows={5} /></Field>
            <Button type="submit">Send message</Button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
}
