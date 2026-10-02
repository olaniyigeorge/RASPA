/** Browser-side signed upload straight to Cloudinary. The server only signs; it never proxies the file. */
import { api } from "./api";

export interface UploadedAsset {
  publicId: string;
  url: string;
  resourceType: string;
  format?: string;
  width?: number;
  height?: number;
  durationSec?: number;
  bytes?: number;
}

export async function uploadToCloudinary(
  file: File,
  opts: { propertyId: string; kind: "PHOTO" | "VIDEO" | "SCAN_3D"; scope: "media" | "evidence"; taskId?: string }
): Promise<UploadedAsset> {
  const sig = await api<{
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    folder: string;
    type: string;
    resourceType: string;
  }>("/api/media/upload-signature", "POST", opts);

  const form = new FormData();
  form.set("file", file);
  form.set("api_key", sig.apiKey);
  form.set("timestamp", String(sig.timestamp));
  form.set("signature", sig.signature);
  form.set("folder", sig.folder);
  form.set("type", sig.type);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`, {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message ?? "Upload failed");

  return {
    publicId: json.public_id,
    url: json.secure_url,
    resourceType: json.resource_type,
    format: json.format,
    width: json.width,
    height: json.height,
    durationSec: json.duration,
    bytes: json.bytes,
  };
}
