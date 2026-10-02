import type { Metadata } from "next";
import { BadgeCheck, Handshake, Video } from "lucide-react";
import { Container, LinkButton, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "About" };

const POINTS = [
  { icon: Handshake, title: "No agents", body: "Finding a place in Nigeria usually means paying inspection fees to agents who profit from showing you homes you never wanted. On RASPA only owners, or tenants naming their owner, can list." },
  { icon: BadgeCheck, title: "Proof, not promises", body: "Listings are verified against real documents: CofO, utility bills, tenancy agreements. Competing claims on the same address are resolved by our team." },
  { icon: Video, title: "Visit only what you love", body: "Photos, walkthrough video and 3D scans, captured to a published standard, mean you can judge a place from your phone before you travel." },
];

export default function AboutPage() {
  return (
    <Container size="lg" className="space-y-10 py-12">
      <PageHeader eyebrow="About RASPA" title="Real estate that works for the people in it" description="We connect renters, buyers and investors directly to the people who own and live in the spaces, and do the work agents used to do ourselves." />
      <div className="grid gap-5 md:grid-cols-3">
        {POINTS.map((p) => (
          <div key={p.title} className="rounded-card border border-line bg-surface p-6 shadow-card">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><p.icon className="size-5" /></span>
            <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.body}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-3"><LinkButton href="/explore">Explore properties</LinkButton><LinkButton href="/get-started" variant="outline">List a property</LinkButton></div>
    </Container>
  );
}
