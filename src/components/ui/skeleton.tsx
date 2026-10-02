import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => <div className={cn("skeleton", className)} aria-hidden />;

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-card">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-4 h-6 w-1/3" />
      </div>
    </div>
  );
}
