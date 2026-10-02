import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, FileCheck2, Handshake, Landmark, TreePine, Factory, Video, Wallet, Home as HomeIcon, Camera } from "lucide-react";
import { HeroSearch } from "@/components/listings/hero-search";
import { PropertyGrid } from "@/components/listings/property-card";
import { Badge, Container, LinkButton, Reveal, Section } from "@/components/ui";
import { discovery } from "@/modules/discovery";
import { getCurrentUser } from "@/modules/identity";
import { getFeaturedListings } from "@/modules/listings";

const PROPERTY_TYPES = [
  { title: "Residential", type: "RESIDENTIAL", icon: HomeIcon, blurb: "Flats, duplexes and family homes" },
  { title: "Commercial", type: "COMMERCIAL", icon: Landmark, blurb: "Offices, shops and plazas" },
  { title: "Industrial", type: "INDUSTRIAL", icon: Factory, blurb: "Warehouses and factories" },
  { title: "Land", type: "LANDED", icon: TreePine, blurb: "Plots ready to build on" },
];

const PILLARS = [
  { icon: BadgeCheck, title: "Ownership is verified", body: "Every verified listing is backed by documents we have reviewed: CofO, utility bills, tenancy agreements." },
  { icon: Video, title: "See it before you go", body: "Photos, walkthrough video and 3D scans mean you only visit places you already like, with no inspection fees." },
  { icon: Wallet, title: "No agents, no cut", body: "You deal with the owner or the tenant handing over. Owners keep their asking price; you skip agent fees." },
];

const STEPS = [
  { icon: Building2, title: "List", body: "Owners, or tenants naming their owner, create a listing in minutes." },
  { icon: FileCheck2, title: "Prove", body: "Upload ownership documents. Our team reviews them and settles any duplicate claims." },
  { icon: Camera, title: "Show", body: "Add photos, video and 3D scans yourself, or request a professional videographer." },
  { icon: Handshake, title: "Close", body: "Seekers view remotely and pay securely through Paystack. The platform handles the rest." },
];

export default async function HomePage() {
  const user = await getCurrentUser();
  const recommended = user ? await discovery.recommend(user.id, { limit: 8 }) : null;
  const listings = recommended && recommended.length > 0 ? recommended : await getFeaturedListings(8);
  const personalised = !!recommended && recommended.length > 0;

  const cards = (listings as Awaited<ReturnType<typeof getFeaturedListings>>).map((p) => ({
    ...p,
    price: p.price.toString(),
  }));

  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <Image src="/images/rendering-house-model.png" alt="" fill priority sizes="100vw" className="-z-20 object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-950 via-brand-900/90 to-brand-700/60" />
        <Container className="flex flex-col items-start gap-8 py-20 sm:py-28 lg:py-32">
          <Badge tone="brand" className="animate-fade-up bg-white/10 text-brand-100 ring-white/20">No agents · No inspection fees</Badge>
          <h1 style={{ "--i": 1 } as React.CSSProperties} className="animate-fade-up max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
            Find your next place, <span className="text-brand-300">straight from the owner.</span>
          </h1>
          <p style={{ "--i": 2 } as React.CSSProperties} className="animate-fade-up max-w-xl text-lg text-brand-100/85">
            Verified listings across Nigeria with video walkthroughs and 3D scans, so you only visit the properties you actually want.
          </p>
          <div style={{ "--i": 3 } as React.CSSProperties} className="animate-fade-up w-full max-w-2xl"><HeroSearch /></div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <Reveal key={p.title} index={PILLARS.indexOf(p)} className="rounded-card border border-line bg-surface p-6 shadow-card">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><p.icon className="size-5" /></span>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        className="pt-0 sm:pt-0"
        title={personalised ? "Recommended for you" : "Fresh on RASPA"}
        description={personalised ? "Based on what you've searched, filtered and viewed." : "Verified listings are shown first."}
        action={<LinkButton href="/explore" variant="ghost" size="sm">View all <ArrowRight className="size-4" /></LinkButton>}
      >
        {cards.length === 0 ? (
          <p className="rounded-card border border-dashed border-line-strong p-12 text-center text-ink-muted">No listings yet. Be the first to list a property.</p>
        ) : (
          <PropertyGrid properties={cards} />
        )}
      </Section>

      <Section title="Browse by type" className="bg-surface">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {PROPERTY_TYPES.map((t) => (
            <Link key={t.type} href={`/explore?type=${t.type}`} className="group rounded-card border border-line bg-canvas p-5 transition-all hover:border-brand-300 hover:bg-brand-50">
              <t.icon className="size-7 text-brand-600" />
              <p className="mt-6 font-semibold">{t.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{t.blurb}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="How RASPA works" description="From listing to move-in, without an agent in the middle.">
        <div id="how-it-works" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} index={i} className="relative rounded-card border border-line bg-surface p-6 shadow-card">
              <span className="text-xs font-semibold text-brand-600">STEP {i + 1}</span>
              <s.icon className="mt-3 size-6 text-brand-600" />
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-card bg-brand-700 p-8 text-white sm:p-10">
            <h3 className="text-2xl font-semibold">Moving out? Pass your rental on and earn.</h3>
            <p className="mt-3 text-brand-100/90">Re-list your tenancy for the next renter. Once they pay and we and your landlord approve, we pay you a commission.</p>
            <LinkButton href="/takeovers" variant="outline" className="mt-6 border-transparent">See rental takeovers</LinkButton>
          </div>
          <div className="rounded-card border border-line bg-surface p-8 shadow-card sm:p-10">
            <h3 className="text-2xl font-semibold">Own a property? List it directly.</h3>
            <p className="mt-3 text-ink-muted">Set your price, prove ownership once, and add optional property management: bills, utilities, waste and disputes in one dashboard.</p>
            <LinkButton href="/get-started" className="mt-6">List a property</LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
