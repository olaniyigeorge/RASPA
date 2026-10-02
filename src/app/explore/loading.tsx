import { CardSkeleton, Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <Container className="py-10">
      <Skeleton className="h-9 w-64" />
      <Skeleton className="mt-6 h-24 w-full" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </Container>
  );
}
