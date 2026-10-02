import { Handshake } from "lucide-react";
import { ActionButton } from "@/components/shared/action-button";
import { formatCurrency } from "@/lib/utils";

export interface TakeoverData {
  id: string;
  tenantName: string | null;
  rent: string;
}

export function TakeoverCard({ takeover, compact }: { takeover: TakeoverData; compact?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-control border border-line bg-canvas p-3">
      <div className="flex items-center gap-3">
        {!compact && <span className="flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Handshake className="size-5" /></span>}
        <div>
          <p className="text-sm font-medium">{takeover.tenantName ?? "A tenant"} is moving out</p>
          <p className="text-xs text-ink-muted">{formatCurrency(takeover.rent)} /yr</p>
        </div>
      </div>
      <ActionButton url={`/api/sublistings/${takeover.id}/pay`} size="sm">Take over</ActionButton>
    </div>
  );
}
