import { NextResponse } from "next/server";
import { requireRole } from "@/modules/identity";
import { signedEvidenceUrl } from "@/modules/media";
import { listClaimsForReview } from "@/modules/verification";
import { route } from "@/shared/infrastructure/http";

/** Review queue. Evidence links are short-lived signed URLs to the private files. */
export const GET = route(async () => {
  await requireRole("ADMIN");
  const claims = await listClaimsForReview();
  return NextResponse.json({
    claims: claims.map((c) => ({
      ...c,
      requiresCriticalReview: !c.evidence.some((e) => e.type === "COFO"),
      evidence: c.evidence.map((e) => ({ ...e, url: signedEvidenceUrl(e.publicId, e.resourceType) })),
    })),
  });
});
