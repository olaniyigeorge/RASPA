import { PrismaClient } from "./prisma-client";

const prisma = new PrismaClient();

const normalizeAddress = (address: string, city: string, state: string) =>
  [address, city, state].join(" ").toLowerCase().replace(/\b(street|st|road|rd|avenue|ave|close|crescent|cres)\b/g, "").replace(/[^a-z0-9]+/g, " ").trim();

async function main() {
  // Seeded owner has no real Firebase account; signing in with Google as this
  // email adopts the row (see prismaUserRepository.upsertFromIdentity).
  const owner = await prisma.user.upsert({
    where: { email: "owner@raspa.dev" },
    update: {},
    create: {
      firebaseUid: "seed-owner",
      name: "Ada Okafor",
      email: "owner@raspa.dev",
      phone: "+2348012345678",
    },
  });

  const amenityNames = ["Swimming Pool", "24/7 Power", "Fenced Compound", "CCTV", "Parking"];
  const amenities = await Promise.all(
    amenityNames.map((name) =>
      prisma.amenity.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  const propertiesData = [
    {
      title: "3-Bedroom Duplex in Lekki Phase 1",
      slug: "3-bed-duplex-lekki-phase-1",
      description: "A modern, fully-serviced duplex with premium finishing in the heart of Lekki Phase 1.",
      type: "RESIDENTIAL" as const,
      purpose: "SALE" as const,
      status: "VERIFIED" as const,
      price: 185_000_000,
      bedrooms: 3,
      bathrooms: 4,
      areaSqm: 320,
      address: "12 Admiralty Way",
      city: "Lekki",
      state: "Lagos",
      latitude: 6.4432,
      longitude: 3.4726,
      featured: true,
    },
    {
      title: "Serviced 2-Bed Apartment, Ikoyi",
      slug: "serviced-2-bed-ikoyi",
      description: "Rent-ready serviced apartment with concierge, gym, and rooftop access.",
      type: "RESIDENTIAL" as const,
      purpose: "RENT" as const,
      status: "VERIFIED" as const,
      price: 6_500_000,
      bedrooms: 2,
      bathrooms: 2,
      areaSqm: 140,
      address: "5 Bourdillon Road",
      city: "Ikoyi",
      state: "Lagos",
      latitude: 6.4531,
      longitude: 3.4331,
      featured: true,
    },
    {
      title: "Commercial Plaza, Abuja Central",
      slug: "commercial-plaza-abuja-central",
      description: "Investment-grade commercial plaza with existing retail tenants and stable yield.",
      type: "COMMERCIAL" as const,
      purpose: "INVEST" as const,
      status: "UNVERIFIED" as const,
      price: 420_000_000,
      expectedRoiPct: 14.5,
      minDownPaymentPct: 30,
      address: "Plot 22 Central Business District",
      city: "Abuja",
      state: "FCT",
      latitude: 9.0579,
      longitude: 7.4951,
      featured: true,
    },
    {
      title: "Land Plot, Epe (Installment Plan)",
      slug: "land-plot-epe-installments",
      description: "500sqm dry land with governor's consent, available on a 12-month installment plan.",
      type: "LANDED" as const,
      purpose: "INSTALLMENT" as const,
      status: "UNVERIFIED" as const,
      price: 12_000_000,
      installmentMonths: 12,
      minDownPaymentPct: 25,
      areaSqm: 500,
      address: "Epe-Ijebu Expressway",
      city: "Epe",
      state: "Lagos",
      latitude: 6.5832,
      longitude: 3.9836,
      featured: false,
    },
  ];

  for (const data of propertiesData) {
    const property = await prisma.property.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        addressKey: normalizeAddress(data.address, data.city, data.state),
        listerId: owner.id,
        ownerUserId: owner.id,
        listerCapacity: "OWNER",
        cofoVerified: data.status === "VERIFIED",
        media: {
          create: [
            {
              uploadedById: owner.id,
              kind: "PHOTO",
              publicId: `seed/${data.slug}`,
              url: `https://picsum.photos/seed/${data.slug}/800/600`,
              position: 0,
            },
          ],
        },
        amenities: {
          create: amenities.slice(0, 3).map((a) => ({ amenityId: a.id })),
        },
      },
    });
    console.log(`Seeded property: ${property.title}`);
  }

  // Management plans (subscription-based property dashboard). Set paystackPlanCode
  // after creating the matching plans in the Paystack dashboard.
  const plans = [
    { code: "basic", name: "Basic", amount: 15_000, features: ["Bills & utilities tracking", "Waste collection scheduling"] },
    { code: "standard", name: "Standard", amount: 35_000, features: ["Everything in Basic", "Dispute resolution", "Maintenance tickets"] },
    { code: "full", name: "Full management", amount: 80_000, features: ["Everything in Standard", "On-the-ground personnel", "Monthly condition report"] },
  ];
  for (const plan of plans) {
    await prisma.managementPlan.upsert({ where: { code: plan.code }, update: {}, create: plan });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
