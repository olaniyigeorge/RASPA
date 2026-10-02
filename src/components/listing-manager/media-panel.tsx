"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Camera, Video } from "lucide-react";
import { Alert, Button, Select } from "@/components/ui";
import { api } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { MEDIA_SPECS } from "@/modules/media/domain/media-spec";

type Kind = "PHOTO" | "VIDEO" | "SCAN_3D";

const KINDS: { kind: Kind; label: string; icon: typeof Camera; accept: string; spec: string }[] = [
  { kind: "PHOTO", label: "Photos", icon: Camera, accept: "image/*", spec: `${MEDIA_SPECS.PHOTO.minWidth}×${MEDIA_SPECS.PHOTO.minHeight}px or larger. ${MEDIA_SPECS.PHOTO.guidance}` },
  { kind: "VIDEO", label: "Walkthrough video", icon: Video, accept: "video/*", spec: `${MEDIA_SPECS.VIDEO.minWidth}×${MEDIA_SPECS.VIDEO.minHeight}, landscape, ${MEDIA_SPECS.VIDEO.minDurationSec}–${MEDIA_SPECS.VIDEO.maxDurationSec}s, ${MEDIA_SPECS.VIDEO.formats.join("/")}. ${MEDIA_SPECS.VIDEO.guidance}` },
  { kind: "SCAN_3D", label: "3D scan", icon: Box, accept: ".glb,.gltf,model/gltf-binary", spec: `${MEDIA_SPECS.SCAN_3D.formats.join("/").toUpperCase()}, up to ${MEDIA_SPECS.SCAN_3D.maxBytes / 1024 / 1024}MB. ${MEDIA_SPECS.SCAN_3D.guidance}` },
];

const CAPTURE = [
  { value: "PHOTOS", label: "Professional photos" },
  { value: "VIDEO", label: "Professional video" },
  { value: "DRONE_VIDEO", label: "Drone video" },
  { value: "SCAN_3D", label: "3D scan" },
];

export function MediaPanel({ propertyId, counts }: { propertyId: string; counts: Record<Kind, number> }) {
  const router = useRouter();
  const [busy, setBusy] = useState<Kind | "capture" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capture, setCapture] = useState("VIDEO");
  const refs = useRef<Partial<Record<Kind, HTMLInputElement | null>>>({});

  async function onFiles(kind: Kind, files: FileList | null) {
    if (!files?.length) return;
    setBusy(kind);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const a = await uploadToCloudinary(file, { propertyId, kind, scope: "media" });
        await api("/api/media", "POST", { propertyId, kind, publicId: a.publicId, url: a.url, format: a.format, width: a.width, height: a.height, durationSec: a.durationSec, bytes: a.bytes });
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  async function requestCapture() {
    setBusy("capture");
    setError(null);
    try {
      const res = await api<{ authorizationUrl?: string }>("/api/capture-tasks", "POST", { propertyId, kind: capture });
      if (res.authorizationUrl) window.location.href = res.authorizationUrl;
      else router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {KINDS.map((k) => (
          <div key={k.kind} className="flex flex-col rounded-card border border-line p-4">
            <div className="flex items-center gap-2 font-medium"><k.icon className="size-4.5 text-brand-600" /> {k.label}</div>
            <p className="mt-0.5 text-xs text-ink-subtle">{counts[k.kind]} uploaded</p>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-ink-muted">{k.spec}</p>
            <input ref={(el) => { refs.current[k.kind] = el; }} type="file" hidden multiple={k.kind === "PHOTO"} accept={k.accept} onChange={(e) => { onFiles(k.kind, e.target.files); e.target.value = ""; }} />
            <Button variant="outline" size="sm" className="mt-3" loading={busy === k.kind} onClick={() => refs.current[k.kind]?.click()}>Upload</Button>
          </div>
        ))}
      </div>

      <div className="rounded-card bg-brand-50 p-5">
        <p className="font-medium">Want it done professionally?</p>
        <p className="mt-0.5 text-sm text-ink-muted">A vetted RASPA videographer, drone operator or 3D scanner visits and captures the property to our standard. Paid per job.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Select value={capture} onChange={(e) => setCapture(e.target.value)} className="w-56 bg-surface">
            {CAPTURE.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </Select>
          <Button onClick={requestCapture} loading={busy === "capture"}>Request & pay</Button>
        </div>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
    </div>
  );
}
