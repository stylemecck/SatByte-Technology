import { Skeleton } from '@/components/ui/skeleton'

/** Full-page loading placeholder for lazy routes. */
export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="mx-auto h-10 max-w-md" />
      <Skeleton className="mx-auto h-6 max-w-xl" />
      <div className="grid gap-4 pt-8 md:grid-cols-3">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  )
}
