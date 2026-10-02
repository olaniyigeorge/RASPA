import { Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <Container className="space-y-8 py-10">
      <Skeleton className="h-9 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
      <Skeleton className="h-64 w-full" />
    </Container>
  );
}
