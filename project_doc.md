# Real Estate Platform — Product Documentation

*Version 0.1 — Living document, to be extended as the product gets niched down.*

## 1. Overview

A Nigeria-focused real estate platform that removes agents/realtors from the property rental and sale process, connecting homeowners and tenants directly, and letting prospective renters/buyers evaluate a property remotely before ever visiting in person.

## 2. Problem Statement

Two core problems in the current Nigerian real estate market:

1. **Agent-dependency.** Home seekers must go through many agents/realtors before finding a property. Agents take a cut and have an incentive to show properties users don't actually want, since users are charged per viewing.
2. **Cost and friction of physical viewing.** Users typically pay a per-property inspection fee (~₦5,000) to check out a listing in person. Because agents are incentivized to maximize the number of viewings, users end up paying to see properties that don't match what they asked for.

## 3. Solution Summary

- Cut agents out of the transaction entirely. Only two parties are authorized to list a property:
  - **Homeowners** (must own the property).
  - **Current occupants/tenants** (may list on behalf of an owner, and must provide the owner's details).
- The platform itself takes on the functions an agent used to perform: aggregating demand, matching users to properties, presenting curated/tailored recommendations, and facilitating the transaction.
- Reduce the need for in-person viewings by building a rich, verifiable digital representation of each property (photos, video, and ideally 3D scans), so users can evaluate a property remotely before committing to visit or transact.

## 4. User Roles & Listing Authorization

| Role | Can list? | Requirements |
|---|---|---|
| Homeowner | Yes | Must own the property |
| Current occupant/tenant | Yes | Must provide the property owner's details |
| Agent/realtor | No | Not a supported listing role — explicitly excluded by design |
| Renter/buyer (seeker) | No (browses/transacts only) | — |

### Rental transfer between tenants
A current tenant can list their rental so that, when they move out, occupancy/tenancy is transferred directly to the next tenant through the platform — again without an agent involved.

## 5. Core Features

### 5.1 Direct Listing (No Agents)
Homeowners list directly and set/receive the exact amount they want for their property, without an agent's cut. The platform manages user acquisition and property showcasing on the owner's behalf.

### 5.2 Property Management (add-on service, paid)
Optional, chargeable services a homeowner can opt into after listing:
- Full property management handled by the platform.
- Dispute resolution between owner and tenant.
- On-the-ground personnel dispatched to handle property issues.

This is positioned as a plug-in / add-on to the core listing, not a default.

### 5.3 Rental/Ownership Transfer
A current tenant can hand off their tenancy directly to the next tenant through the platform when they move out, keeping the handoff agent-free.

### 5.4 Immersive Remote Viewing
To reduce/eliminate the cost of physical property inspections, each listing aims to build a detailed digital representation of the property:
- Standard photo uploads.
- Detailed video walkthroughs recorded to a platform-defined quality standard (may involve drones or videographers; owners/renters can also self-record to spec).
- Where possible, 3D scans of the property.
- Periodic re-capture/renewal of this media over time, both to keep it current and to track condition/changes in the property.

This is a paid service (has real production cost), consistent with the platform being a small business initially.

### 5.5 Curated Matching
The platform tailors recommendations to what a seeker is looking for, rather than showing them everything, reducing wasted viewings (physical or virtual).

## 6. Business Model Notes (early)

- Revenue from paid add-ons: property management, dispute handling, professional media capture/renewal.
- No agent commissions — homeowners get closer to their asking price.
- Framed as a small business initially — media capture costs are real and need to be priced accordingly.

## 7. Technical Architecture

### 7.1 Stack
- **Framework:** Next.js (full-stack, single project), TypeScript.
- **ORM / DB:** Prisma + PostgreSQL (Supabase).
- **Auth:** Google sign-in via Firebase Auth. Server verifies Firebase ID tokens and maps them to a local `User`.
- **Media storage:** Cloudinary (photos, video, 3D scans).
- **Payments:** Paystack (initialize + webhook verification).
- **Hosting:** Vercel.

### 7.2 Architecture: Domain-Driven Design
Single deployable, modular monolith. Each bounded context owns its domain model, use cases and persistence; contexts talk through public APIs/domain events, never through each other's tables.

```
src/
  app/                    # Next.js routes: thin, call application services only
  modules/
    identity/             # User, Role, Firebase auth mapping
    listings/             # Property aggregate, ListingStatus, lifecycle
    verification/         # OwnershipClaim, EvidenceDocument, review workflow
    media/                # MediaAsset, CaptureRequest, Cloudinary adapter
    rentals/              # Tenancy, Sublist (tenant-to-tenant), Commission
    payments/             # PaymentIntent, Paystack adapter, webhook handling
    discovery/            # Search/filter history, location, recommender
    <module>/domain/          # entities, value objects, domain services, events (no framework imports)
    <module>/application/     # use cases / commands / queries
    <module>/infrastructure/  # Prisma repos, Cloudinary, Paystack, Firebase adapters
  shared/                 # kernel: Result, DomainEvent, Money, ids
  components/, ui/        # presentation only
```
Rules: `domain` imports nothing from Next/Prisma/SDKs; `infrastructure` implements repository/port interfaces declared in `domain`/`application`; route handlers and server actions only invoke `application`.

### 7.3 Bounded contexts and key rules

**Identity.** Firebase Google auth. Roles: homeowner, tenant, seeker, contractor (videographer/drone), admin. Agents are not a role.

**Verification (proof of ownership).** A listing owner submits an `OwnershipClaim` with `EvidenceDocument`s: Certificate of Occupancy (CofO), utility bill, video, 3D/video scans, images. Tenants listing on an owner's behalf also supply the owner's details. Admin review moves the claim to approved/rejected; approval promotes the listing to `VERIFIED`.

**Listings.** Status lifecycle: `DRAFT` -> `UNVERIFIED` (submitted, no approved claim) -> `VERIFIED` (ownership approved). Later states (suspended, rented/sold, archived) to be added. Only `VERIFIED` listings get the verified badge and priority in recommendations.

**Media.** Stored on Cloudinary. Photos, videos and 3D scans are normally captured by the lister (homeowner or tenant). On special occasions or as a paid add-on, a platform-assigned contractor (videographer/drone operator) produces professional media via a `CaptureRequest`. Media records whether it is self-captured or professional.

**Rentals / tenant-to-tenant.** A current tenant re-lists ("retweets") the rental they occupy. The new renter pays through Paystack; the commission is paid to the re-listing tenant by the platform only when the renter has paid AND the platform has approved AND the owner has approved. If the tenant is also the original lister and the listing has no verified CofO, platform approval requires an explicit critical review. Commission = 5% of rent, capped at ₦250,000 (placeholder policy in `rentals/domain/sublisting.ts`). On release, occupancy transfers to the new renter.

**Payments.** Paystack. Covers rent/purchase, add-on services (management subscriptions, media capture), and payouts (tenant commissions, contractor earnings) to a user's `PayoutAccount`. Webhooks are the source of truth: HMAC-verified, idempotent, amount-checked.

**Discovery / recommendations.** Per-user ranking from search history, filter history, views and location (plus verified status, freshness, featured), recency-decayed, behind a pure scoring module so the algorithm can be swapped later.

**Management (subscription add-on).** A per-property dashboard for bills, utilities, waste, disputes and maintenance tickets, available only with an active subscription plan (Paystack plans; seeded `management_plans`).

**Contractors.** Contractors apply; staff activate them. They see a task board (open tasks matched to skills), claim a task, upload media to spec, and submit. Staff approval releases a payout. Listers can request professional capture (paid up front via Paystack); staff can also create free tasks for special occasions.

### 7.4 Policies decided
- **Duplicate claims:** staff resolve between competing listers during verification (disputes keyed by normalised address); losing claims are rejected and their listings suspended.
- **Verification SLA:** to be drafted and shown to listers (not yet written).
- **Media specs:** published in `media/domain/media-spec.ts` (video 1080p landscape 60-300s; photos 1600px+; 3D scans as glTF/GLB). Listers may self-capture or request professionals; the 3D format is stated for self-scanners. Values are initial defaults to confirm.
- **Ownership documents** are stored as private (authenticated) Cloudinary assets; only staff get short-lived signed URLs.

### 7.5 Frontend design system
Tokens live in `src/app/globals.css` (`@theme`): brand purple scale, neutral ink/canvas/line, semantic success/warning/danger/info, radii and shadows, and motion utilities (respecting `prefers-reduced-motion`). Primitives are in `src/components/ui` (Button, Badge, StatusBadge/VerificationBadge, Card, Field/Input, layout helpers, Reveal, Skeleton). Pages use only these primitives; no hardcoded colours.

## 8. Open Questions / Next Steps

- Write the verification SLA shown to listers.
- Confirm media spec numbers, the capture rate card (price vs. contractor payout) and the commission rate/cap.
- Owner approval of a takeover when the owner is not on the platform (currently requires an account matched to `ownerUserId`).
- Interactive map view (needs a map provider decision).
- Contact form is not wired to an email provider.
- Paystack subscription webhook payloads (`subscription.create`, `invoice.update`) need verifying against a sandbox account.
- Management-context application code still queries Prisma directly; move behind repository ports.
