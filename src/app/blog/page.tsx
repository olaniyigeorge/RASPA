import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { Container, EmptyState, LinkButton, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <Container size="lg" className="space-y-8 py-12">
      <PageHeader eyebrow="Blog" title="Renting and buying in Nigeria, explained" description="Guides on verification, fair rent and moving without an agent." />
      <EmptyState icon={<BookOpen className="size-5" />} title="Articles are on the way" description="We're writing our first guides now." action={<LinkButton href="/explore" variant="outline">Browse properties</LinkButton>} />
    </Container>
  );
}
