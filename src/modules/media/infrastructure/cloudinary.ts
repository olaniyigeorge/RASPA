import "server-only";
import { v2 as cloudinary } from "cloudinary";
import type { UploadSigner } from "../domain/ports";

interface Creds {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

/** Reads CLOUDINARY_URL (cloudinary://key:secret@cloud), or the three separate variables. */
function creds(): Creds {
  const url = process.env.CLOUDINARY_URL;
  if (url) {
    const u = new URL(url);
    return { cloudName: u.hostname, apiKey: decodeURIComponent(u.username), apiSecret: decodeURIComponent(u.password) };
  }
  const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = process.env;
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary is not configured (set CLOUDINARY_URL)");
  return { cloudName, apiKey, apiSecret };
}

function configure() {
  const c = creds();
  cloudinary.config({ cloud_name: c.cloudName, api_key: c.apiKey, api_secret: c.apiSecret, secure: true });
  return c;
}

export const cloudinarySigner: UploadSigner = {
  sign(params) {
    const c = configure();
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request({ ...params, timestamp }, c.apiSecret);
    return { signature, timestamp, apiKey: c.apiKey, cloudName: c.cloudName };
  },
};

/** Short-lived signed URL for private ownership documents (staff review only). */
export function signedEvidenceUrl(publicId: string, resourceType = "image") {
  configure();
  return cloudinary.url(publicId, {
    type: "authenticated",
    resource_type: resourceType === "auto" ? "image" : resourceType,
    sign_url: true,
    secure: true,
  });
}
