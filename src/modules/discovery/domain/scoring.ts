// Pure recommendation scoring: no framework, no database.

export type ActivityKind = "SEARCH" | "FILTER" | "VIEW";

export interface Activity {
  kind: ActivityKind;
  query?: string | null;
  city?: string | null;
  propertyId?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  filters?: { type?: string; purpose?: string; minPrice?: number; maxPrice?: number; city?: string } | null;
  createdAt: Date;
}

export interface Candidate {
  id: string;
  city: string;
  type: string;
  purpose: string;
  price: number;
  latitude: number | null;
  longitude: number | null;
  status: string;
  featured: boolean;
  createdAt: Date;
}

export interface Profile {
  cities: Map<string, number>;
  types: Map<string, number>;
  purposes: Map<string, number>;
  prices: number[];
  viewed: Set<string>;
  location: { lat: number; lng: number } | null;
}

const HALF_LIFE_DAYS = 14;
const norm = (s: string) => s.trim().toLowerCase();

function bump(m: Map<string, number>, key: string | null | undefined, w: number) {
  if (!key) return;
  const k = norm(key);
  m.set(k, (m.get(k) ?? 0) + w);
}

/** Folds search/filter/view history into weighted preferences; recent activity counts more. */
export function buildProfile(
  activities: Activity[],
  now = new Date(),
  fallbackLocation?: { lat: number; lng: number } | null
): Profile {
  const p: Profile = {
    cities: new Map(),
    types: new Map(),
    purposes: new Map(),
    prices: [],
    viewed: new Set(),
    location: fallbackLocation ?? null,
  };
  let latestLocAt = 0;

  for (const a of activities) {
    const ageDays = Math.max(0, (now.getTime() - a.createdAt.getTime()) / 86_400_000);
    const decay = Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
    const kindWeight = a.kind === "VIEW" ? 1 : a.kind === "FILTER" ? 1.5 : 1; // explicit filters are strong intent
    const w = decay * kindWeight;

    bump(p.cities, a.city ?? a.filters?.city, w);
    bump(p.types, a.filters?.type, w);
    bump(p.purposes, a.filters?.purpose, w);
    if (a.filters?.minPrice) p.prices.push(a.filters.minPrice);
    if (a.filters?.maxPrice) p.prices.push(a.filters.maxPrice);
    if (a.propertyId) p.viewed.add(a.propertyId);

    if (a.latitude != null && a.longitude != null && a.createdAt.getTime() > latestLocAt) {
      latestLocAt = a.createdAt.getTime();
      p.location = { lat: a.latitude, lng: a.longitude };
    }
  }
  return p;
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const rad = (x: number) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/** Share of the profile's total weight that this value holds (0..1). */
function affinity(m: Map<string, number>, value: string) {
  const total = [...m.values()].reduce((s, v) => s + v, 0);
  return total === 0 ? 0 : (m.get(norm(value)) ?? 0) / total;
}

export const WEIGHTS = {
  city: 3,
  type: 2,
  purpose: 1.5,
  price: 2,
  distance: 3,
  verified: 2,
  featured: 0.5,
  fresh: 1,
  seenPenalty: 1.5,
} as const;

export function scoreCandidate(c: Candidate, p: Profile, now = new Date()): number {
  let score = 0;
  score += WEIGHTS.city * affinity(p.cities, c.city);
  score += WEIGHTS.type * affinity(p.types, c.type);
  score += WEIGHTS.purpose * affinity(p.purposes, c.purpose);

  if (p.prices.length) {
    const lo = Math.min(...p.prices);
    const hi = Math.max(...p.prices);
    const mid = (lo + hi) / 2 || c.price;
    const within = c.price >= lo * 0.9 && c.price <= hi * 1.1;
    const off = Math.abs(c.price - mid) / mid;
    score += WEIGHTS.price * (within ? 1 : Math.max(0, 1 - off));
  }

  if (p.location && c.latitude != null && c.longitude != null) {
    const km = haversineKm(p.location, { lat: c.latitude, lng: c.longitude });
    score += WEIGHTS.distance * Math.exp(-km / 25);
  }

  if (c.status === "VERIFIED") score += WEIGHTS.verified;
  if (c.featured) score += WEIGHTS.featured;
  const ageDays = (now.getTime() - c.createdAt.getTime()) / 86_400_000;
  score += WEIGHTS.fresh * Math.exp(-ageDays / 30);
  if (p.viewed.has(c.id)) score -= WEIGHTS.seenPenalty;
  return score;
}

export function rank(candidates: Candidate[], profile: Profile, limit: number, now = new Date()): string[] {
  return candidates
    .map((c) => ({ id: c.id, score: scoreCandidate(c, profile, now) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.id);
}
