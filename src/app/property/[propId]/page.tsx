import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, BedDouble, Bath, Box, Maximize2, MapPin, ShieldAlert, UserRound } from "lucide-react";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { Alert, Badge, Card, CardBody, Container, LinkButton, VerificationBadge } from "@/components/ui";
import { cn, formatCurrency } from "@/lib/utils";
import { discovery } from "@/modules/discovery";
import { getCurrentUser } from "@/modules/identity";
import { getListingDetail } from "@/modules/listings";
import { listOpenSublistings } from "@/modules/rentals";
import { PROPERTY_PLANS } from "./payment-plans/plans";
import { TakeoverCard } from "@/components/rentals/takeover-card";
import { prisma } from "@/shared/infrastructure/prisma";

type Props = { params: Promise<{ propId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propId } = await params;
  const p = await getListingDetail(propId);
  return { title: p?.title ?? "Property" };
}

export default async function PropertyPage({ params }: Props) {
  const { propId } = await params;
  const property = await getListingDetail(propId);
  if (!property) notFound();

  const user = await getCurrentUser();
  const isPublic = property.status === "UNVERIFIED" || property.status === "VERIFIED";
  const isOwnerView = property.listerId === user?.id || user?.role === "ADMIN";
  if (!isPublic && !isOwnerView) notFound();
  if (user) await discovery.record(user.id, { kind: "VIEW", propertyId: property.id, city: property.city });

  const [takeovers, saved] = await Promise.all([
    property.purpose === "RENT" ? listOpenSublistings(property.id) : Promise.resolve([]),
    user ? prisma.favorite.count({ where: { userId: user.id, propertyId: property.id } }) : Promise.resolve(0),
  ]);

  const photos = property.media.filter((m) => m.kind === "PHOTO");
  const video = property.media.find((m) => m.kind === "VIDEO");
  const scan = property.media.find((m) => m.kind === "SCAN_3D");
  const plans = PROPERTY_PLANS[property.purpose] ?? [];

  return (
    <Container className="py-8">
      <nav className="mb-4 text-sm text-ink-muted" aria-label="Breadcrumb">
        <Link href="/explore" className="hover:text-brand-700">Explore</Link> / <span className="text-ink">{property.city}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <VerificationBadge status={property.status} />
            <Badge tone="brand">{property.purpose === "RENT" ? "For rent" : property.purpose === "SALE" ? "For sale" : property.purpose === "INVEST" ? "Investment" : "Installments"}</Badge>
          </div>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-ink-muted">
            <MapPin className="size-4" /> {property.address}, {property.city}, {property.state}
          </p>
        </div>
        <FavoriteButton propertyId={property.id} initial={saved > 0} />
      </div>

      <div className={cn("mt-6 grid gap-2", photos.length > 1 && "sm:grid-cols-4 sm:grid-rows-2")}>
        <div className={cn("relative aspect-[4/3] overflow-hidden rounded-card bg-brand-50 sm:aspect-[16/9]", photos.length > 1 && "sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-96")}>
          {photos[0] ? (
            <Image src={photos[0].url} alt={property.title} fill priority sizes={photos.length > 1 ? "(min-width: 640px) 50vw, 100vw" : "100vw"} className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-ink-subtle">No photos yet</div>
          )}
        </div>
        {photos.slice(1, 5).map((m) => (
          <div key={m.id} className="relative hidden aspect-[4/3] overflow-hidden rounded-card bg-brand-50 sm:block">
            <Image src={m.url} alt="" fill sizes="25vw" className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-10">
          <div className="flex flex-wrap gap-6 border-b border-line pb-6 text-sm text-ink-muted">
            {property.bedrooms !== null && <span className="flex items-center gap-2"><BedDouble className="size-4.5" /> {property.bedrooms} bedrooms</span>}
            {property.bathrooms !== null && <span className="flex items-center gap-2"><Bath className="size-4.5" /> {property.bathrooms} bathrooms</span>}
            {property.areaSqm && <span className="flex items-center gap-2"><Maximize2 className="size-4.5" /> {property.areaSqm.toString()} sqm</span>}
          </div>

          <section>
            <h2 className="text-xl font-semibold">About this property</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-muted">{property.description}</p>
          </section>

          {(video || scan) && (
            <section>
              <h2 className="text-xl font-semibold">View it remotely</h2>
              <div className="mt-4 space-y-4">
                {video && <video src={video.url} controls preload="metadata" className="w-full rounded-card bg-ink" />}
                {scan && (
                  <a href={scan.url} className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 hover:border-brand-300">
                    <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Box className="size-5" /></span>
                    <span><span className="block font-medium">3D scan</span><span className="text-sm text-ink-muted">Open or download the scan</span></span>
                  </a>
                )}
              </div>
            </section>
          )}

          {property.amenities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Amenities</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {property.amenities.map(({ amenity }) => (
                  <Badge key={amenity.id} tone="neutral" className="px-3 py-1.5 text-sm">{amenity.name}</Badge>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold">Listed by</h2>
            <Card className="mt-4">
              <CardBody className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-brand-100 text-brand-700"><UserRound className="size-5" /></span>
                <div>
                  <p className="font-medium">{property.lister.name ?? "RASPA member"}</p>
                  <p className="text-sm text-ink-muted">{property.listerCapacity === "OWNER" ? "Property owner" : "Current tenant, listing on behalf of the owner"}</p>
                </div>
              </CardBody>
            </Card>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="shadow-raised">
            <CardBody>
              <p className="text-3xl font-semibold">
                {formatCurrency(property.price.toString(), property.currency)}
                {property.purpose === "RENT" && <span className="text-base font-normal text-ink-subtle"> /yr</span>}
              </p>
              {property.status === "VERIFIED" ? (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-success-700"><BadgeCheck className="size-4" /> Ownership documents verified</p>
              ) : (
                <div className="mt-3">
                  <Alert tone="warning" title="Ownership not yet verified">
                    <span className="flex items-start gap-1.5"><ShieldAlert className="mt-0.5 size-4 shrink-0" />The lister has not completed verification. Proceed with care.</span>
                  </Alert>
                </div>
              )}
              <div className="mt-5 grid gap-2">
                {plans.map((plan, i) => (
                  <LinkButton key={plan.href} href={`/property/${property.slug}/payment-plans/${plan.href}`} variant={i === 0 ? "primary" : "outline"}>
                    {plan.label}
                  </LinkButton>
                ))}
              </div>
              {isOwnerView && (
                <LinkButton href={`/dashboard/listings/${property.id}`} variant="secondary" className="mt-3 w-full">Manage this listing</LinkButton>
              )}
            </CardBody>
          </Card>

          {takeovers.length > 0 && (
            <Card>
              <CardBody className="space-y-3">
                <p className="font-semibold">Take over from a tenant</p>
                {takeovers.map((t) => (
                  <TakeoverCard key={t.id} takeover={{ id: t.id, tenantName: t.tenant.name, rent: t.property.price.toString() }} compact />
                ))}
              </CardBody>
            </Card>
          )}
        </aside>
      </div>
    </Container>
  );
}
