"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Alert, Button } from "@/components/ui";
import { api } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary-upload";
import { MEDIA_SPECS } from "@/modules/media/domain/media-spec";

const KIND_FOR = { PHOTOS: "PHOTO", VIDEO: "VIDEO", DRONE_VIDEO: "VIDEO", SCAN_3D: "SCAN_3D" } as const;
const ACCEPT = { PHOTO: "image/*", VIDEO: "video/*", SCAN_3D: ".glb,.gltf" } as const;

export function TaskUploader({ taskId, propertyId, kind }: { taskId: string; propertyId: string; kind: keyof typeof KIND_FOR }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"upload" | "submit" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(0);
  const mediaKind = KIND_FOR[kind];

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy("upload");
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const a = await uploadToCloudinary(file, { propertyId, kind: mediaKind, scope: "media", taskId });
        await api(`/api/contractor/tasks/${taskId}`, "POST", { action: "add_media", kind: mediaKind, publicId: a.publicId, url: a.url, format: a.format, width: a.width, height: a.height, durationSec: a.durationSec, bytes: a.bytes });
        setUploaded((n) => n + 1);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  async function submit() {
    setBusy("submit");
    setError(null);
    try {
      await api(`/api/contractor/tasks/${taskId}`, "POST", { action: "submit" });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit");
      setBusy(null);
    }
  }

  return (
    <div className="mt-4 space-y-3 border-t border-line pt-4">
      <p className="text-xs text-ink-muted">{MEDIA_SPECS[mediaKind].guidance}</p>
      <input ref={input} type="file" hidden multiple={mediaKind === "PHOTO"} accept={ACCEPT[mediaKind]} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" loading={busy === "upload"} onClick={() => input.current?.click()}><Upload className="size-4" /> Upload {mediaKind === "PHOTO" ? "photos" : "file"}</Button>
        <Button size="sm" loading={busy === "submit"} onClick={submit}>Submit for review</Button>
        {uploaded > 0 && <span className="text-xs text-success-700">{uploaded} uploaded this session</span>}
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
    </div>
  );
}
