import { logger, serializeError } from "../../../shared/infrastructure/logger";
import { buildProfile, rank, type Activity, type Candidate } from "../domain/scoring";

export interface ActivityInput {
  kind: "SEARCH" | "FILTER" | "VIEW";
  query?: string;
  city?: string;
  propertyId?: string;
  latitude?: number;
  longitude?: number;
  filters?: Record<string, unknown>;
}

interface Deps {
  activities: {
    record(userId: string, a: ActivityInput): Promise<void>;
    recent(userId: string, limit: number): Promise<Activity[]>;
  };
  candidates(): Promise<Candidate[]>;
  hydrate(ids: string[]): Promise<unknown[]>;
}

export const makeDiscoveryUseCases = (d: Deps) => ({
  async record(userId: string, a: ActivityInput) {
    // best-effort signal: never fail the user's request because history could not be saved
    await d.activities.record(userId, a).catch((err) => logger.warn("activity not recorded", { userId, error: serializeError(err) }));
  },

  /** Ranked listings for this user; falls back to location + verified + freshness on a cold start. */
  async recommend(userId: string | null, opts: { limit?: number; location?: { lat: number; lng: number } } = {}) {
    const limit = opts.limit ?? 12;
    const history = userId ? await d.activities.recent(userId, 150) : [];
    const profile = buildProfile(history, new Date(), opts.location);
    const ids = rank(await d.candidates(), profile, limit);
    return d.hydrate(ids);
  },
});
