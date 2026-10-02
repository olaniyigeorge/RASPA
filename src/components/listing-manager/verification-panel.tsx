"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileUp, Trash2 } from "lucide-react";
import { Alert, Button } from "@/components/ui";
import { api } from "@/lib/api";
import { uploadToCloudinary, type UploadedAsset } from "@/lib/cloudinary-upload";

type EvidenceType = "COFO" | "UTILITY_BILL" | "OWNER_ID" | "TENANCY_AGREEMENT" | "VIDEO" | "SCAN_3D" | "IMAGE";

interface Slot {
  type: EvidenceType;
  label: string;
  hint: string;
  proof: boolean;
}

const OWNER_SLOTS: Slot[] = [
  { type: "COFO", label: "Certificate of Occupancy (CofO)", hint: "The strongest proof; listings with a CofO verify fastest.", proof: true },
  { type: "UTILITY_BILL", label: "Recent utility bill", hint: "Electricity, water or waste bill for this address.", proof: true },
  { type: "OWNER_ID", label: "Owner's ID", hint: "Government-issued ID matching the document names.", proof: true },
  { type: "VIDEO", label: "Video of the property", hint: "A quick walkthrough proving you have access.", proof: false },
];

const TENANT_SLOTS: Slot[] = [
  { type: "TENANCY_AGREEMENT", label: "Tenancy agreement", hint: "Your current signed agreement. Required unless you attach a utility bill.", proof: true },
  { type: "UTILITY_BILL", label: "Utility bill in your name", hint: "Shows you live at this address.", proof: true },
  { type: "COFO", label: "Owner's CofO (if you have it)", hint: "Without a CofO we review your claim more critically before any commission is paid.", proof: true },
  { type: "VIDEO", label: "Video of the property", hint: "A quick walkthrough proving you have access.", proof: false },
];

interface Item extends UploadedAsset {
  type: EvidenceType;
  name: string;
}

export function VerificationPanel({ propertyId, capacity }: { propertyId: string; capacity: "OWNER" | "TENANT" }) {
  const router = useRouter();
  const slots = capacity === "OWNER" ? OWNER_SLOTS : TENANT_SLOTS;
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState<EvidenceType | "submit" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<Partial<Record<EvidenceType, HTMLInputElement | null>>>({});

  async function onFile(slot: Slot, file: File | undefined) {
    if (!file) return;
    setBusy(slot.type);
    setError(null);
    try {
      const kind = slot.type === "VIDEO" ? "VIDEO" : slot.type === "SCAN_3D" ? "SCAN_3D" : "PHOTO";
      const asset = await uploadToCloudinary(file, { propertyId, kind, scope: "evidence" });
      setItems((prev) => [...prev, { ...asset, type: slot.type, name: file.name }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(null);
    }
  }

  const hasProof = items.some((i) => slots.find((s) => s.type === i.type)?.proof);
  const hasCofo = items.some((i) => i.type === "COFO");

  async function submit() {
    setBusy("submit");
    setError(null);
    try {
      await api(`/api/properties/${propertyId}/claim`, "POST", {
        evidence: items.map((i) => ({ type: i.type, publicId: i.publicId, url: i.url, resourceType: i.resourceType })),
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="divide-y divide-line rounded-card border border-line">
        {slots.map((slot) => {
          const mine = items.filter((i) => i.type === slot.type);
          return (
            <div key={slot.type} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{slot.label}</p>
                <p className="text-xs text-ink-muted">{slot.hint}</p>
                {mine.map((m) => (
                  <p key={m.publicId} className="mt-1.5 flex items-center gap-1.5 text-xs text-success-700">
                    <CheckCircle2 className="size-3.5" /> {m.name}
                    <button type="button" aria-label={`Remove ${m.name}`} onClick={() => setItems((p) => p.filter((x) => x.publicId !== m.publicId))} className="text-ink-subtle hover:text-danger-600">
                      <Trash2 className="size-3.5" />
                    </button>
                  </p>
                ))}
              </div>
              <input ref={(el) => { inputs.current[slot.type] = el; }} type="file" hidden accept={slot.type === "VIDEO" ? "video/*" : "image/*,application/pdf"} onChange={(e) => { onFile(slot, e.target.files?.[0]); e.target.value = ""; }} />
              <Button type="button" variant="outline" size="sm" loading={busy === slot.type} onClick={() => inputs.current[slot.type]?.click()}>
                <FileUp className="size-4" /> {mine.length ? "Add another" : "Upload"}
              </Button>
            </div>
          );
        })}
      </div>

      {hasProof && !hasCofo && (
        <Alert tone="warning" title="No CofO attached">
          We can still review your claim, but it will get a closer look and may take longer.
        </Alert>
      )}
      {error && <Alert tone="danger">{error}</Alert>}

      <Button size="lg" disabled={!hasProof} loading={busy === "submit"} onClick={submit}>
        Submit for verification
      </Button>
      {!hasProof && <p className="text-xs text-ink-subtle">Attach at least one proof document to submit.</p>}
    </div>
  );
}
