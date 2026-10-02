// Capture standards shown to listers and contractors. These are the platform's
// published spec; tune the numbers here and the rest of the app follows.
// NOTE: initial defaults, to be confirmed by the team before publishing.

export type MediaKind = "PHOTO" | "VIDEO" | "SCAN_3D";

export const MEDIA_SPECS = {
  PHOTO: {
    minWidth: 1600,
    minHeight: 1067,
    formats: ["jpg", "jpeg", "png", "webp"],
    maxBytes: 15 * 1024 * 1024,
    guidance: "Landscape, well lit, one room per photo, no people, doors and windows visible.",
  },
  VIDEO: {
    minWidth: 1920,
    minHeight: 1080,
    orientation: "landscape",
    minDurationSec: 60,
    maxDurationSec: 300,
    formats: ["mp4", "mov"],
    maxBytes: 500 * 1024 * 1024,
    guidance:
      "Continuous walkthrough from entrance through every room, steady gimbal or tripod, daylight, 30fps or higher, no cuts or filters.",
  },
  SCAN_3D: {
    formats: ["glb", "gltf"],
    maxBytes: 150 * 1024 * 1024,
    guidance: "Scale in metres, textured mesh, whole-property scan. Listers may submit their own or request ours.",
  },
} as const;

export interface MediaMeta {
  kind: MediaKind;
  format?: string | null;
  width?: number | null;
  height?: number | null;
  durationSec?: number | null;
  bytes?: number | null;
}

/** Returns human-readable spec violations; empty means compliant. */
export function validateAgainstSpec(m: MediaMeta): string[] {
  const issues: string[] = [];
  const spec = MEDIA_SPECS[m.kind];
  const fmt = m.format?.toLowerCase();
  if (fmt && !(spec.formats as readonly string[]).includes(fmt)) {
    issues.push(`Format .${fmt} not accepted (use ${spec.formats.join(", ")})`);
  }
  if (m.bytes && m.bytes > spec.maxBytes) {
    issues.push(`File exceeds ${Math.round(spec.maxBytes / 1024 / 1024)}MB`);
  }
  if (m.kind === "PHOTO" || m.kind === "VIDEO") {
    const s = MEDIA_SPECS[m.kind];
    if (m.width && m.height) {
      if (m.width < s.minWidth || m.height < s.minHeight) {
        issues.push(`Minimum resolution is ${s.minWidth}x${s.minHeight}`);
      }
    }
  }
  if (m.kind === "VIDEO") {
    const s = MEDIA_SPECS.VIDEO;
    if (m.width && m.height && m.height > m.width) issues.push("Video must be landscape");
    if (m.durationSec !== null && m.durationSec !== undefined) {
      if (m.durationSec < s.minDurationSec || m.durationSec > s.maxDurationSec) {
        issues.push(`Video must be ${s.minDurationSec}-${s.maxDurationSec} seconds`);
      }
    }
  }
  return issues;
}

export const resourceTypeFor = (kind: MediaKind) =>
  kind === "VIDEO" ? "video" : kind === "SCAN_3D" ? "raw" : "image";
