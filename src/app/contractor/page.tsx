import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Camera, Clock3, MapPin } from "lucide-react";
import { ActionButton } from "@/components/shared/action-button";
import { Alert, Card, CardBody, CardHeader, Container, EmptyState, PageHeader, StatusBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/modules/identity";
import { contractors, listOpenTasks, listTasksForContractor } from "@/modules/media";
import { ApplyForm } from "./apply-form";
import { TaskUploader } from "./task-uploader";

export const metadata: Metadata = { title: "Contractor tasks" };

const KIND = { PHOTOS: "Photos", VIDEO: "Video walkthrough", DRONE_VIDEO: "Drone video", SCAN_3D: "3D scan" } as const;

export default async function ContractorPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/accounts?callbackUrl=/contractor");

  const contractor = await contractors.findByUserId(user.id);

  if (!contractor) {
    return (
      <Container size="md" className="py-10">
        <PageHeader eyebrow="Work with RASPA" title="Become a contractor" description="Capture properties as a photographer, videographer, drone operator or 3D scanner. Pick up tasks near you and get paid per job." />
        <Card className="mt-8"><CardBody><ApplyForm /></CardBody></Card>
      </Container>
    );
  }

  if (contractor.status !== "ACTIVE") {
    return (
      <Container size="md" className="py-10">
        <PageHeader title="Contractor tasks" />
        <div className="mt-6">
          <Alert tone={contractor.status === "SUSPENDED" ? "danger" : "info"} title={contractor.status === "SUSPENDED" ? "Your account is suspended" : "Application received"}>
            {contractor.status === "SUSPENDED" ? "Please contact support." : "Our team is reviewing your application. You'll see tasks here once you're approved."}
          </Alert>
        </div>
      </Container>
    );
  }

  const [open, mine] = await Promise.all([listOpenTasks(contractor.skills), listTasksForContractor(contractor.id)]);
  const active = mine.filter((t) => t.status === "CLAIMED");
  const other = mine.filter((t) => t.status !== "CLAIMED");

  return (
    <Container size="lg" className="space-y-8 py-10">
      <PageHeader title="Contractor tasks" description="Claim a task, capture to spec, upload, and submit. Payment is released when we approve your work." actions={<StatusBadge status="ACTIVE" />} />

      {active.length > 0 && (
        <Card>
          <CardHeader title="In progress" />
          <CardBody className="space-y-5">
            {active.map((t) => (
              <div key={t.id} className="rounded-card border border-line p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{KIND[t.kind]} · {t.property.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-ink-muted"><MapPin className="size-3.5" /> {t.property.address}, {t.property.city}</p>
                    {t.instructions && <p className="mt-2 text-sm">{t.instructions}</p>}
                    {t.reviewNote && <p className="mt-2 text-sm text-danger-600">Needs fixing: {t.reviewNote}</p>}
                  </div>
                  <p className="font-semibold">{formatCurrency(t.payoutAmount.toString())}</p>
                </div>
                <TaskUploader taskId={t.id} propertyId={t.propertyId} kind={t.kind} />
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title="Open tasks" description="Matched to your skills." />
        {open.length === 0 ? (
          <CardBody><EmptyState icon={<Camera className="size-5" />} title="No open tasks right now" description="New jobs appear here as owners request professional capture." /></CardBody>
        ) : (
          <div className="divide-y divide-line">
            {open.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="font-medium">{KIND[t.kind]} · {t.property.title}</p>
                  <p className="flex items-center gap-1 text-sm text-ink-muted"><MapPin className="size-3.5" /> {t.property.city}, {t.property.state}</p>
                  {t.scheduledFor && <p className="flex items-center gap-1 text-xs text-ink-subtle"><Clock3 className="size-3" /> {t.scheduledFor.toLocaleDateString("en-NG")}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">{formatCurrency(t.payoutAmount.toString())}</p>
                  <ActionButton url={`/api/contractor/tasks/${t.id}`} body={{ action: "claim" }} size="sm">Claim</ActionButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {other.length > 0 && (
        <Card>
          <CardHeader title="History" />
          <div className="divide-y divide-line">
            {other.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-6 py-3 text-sm">
                <span>{KIND[t.kind]} · {t.property.title}</span><StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </Container>
  );
}
