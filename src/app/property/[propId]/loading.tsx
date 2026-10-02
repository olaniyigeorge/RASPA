import { Container, Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <Container className="py-8">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 h-10 w-2/3" />
      <div className="mt-6 grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
        <Skeleton className="min-h-96 sm:col-span-2 sm:row-span-2" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="hidden aspect-[4/3] sm:block" />)}
      </div>
    </Container>
  );
}
