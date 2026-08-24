export function LoadingSkeleton() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          className="animate-rise-in overflow-hidden rounded-[24px] bg-white p-4 shadow-sm ring-1 ring-stone-200"
          key={index}
          style={{ animationDelay: `${index * 55}ms` }}
        >
          <div className="aspect-video animate-pulse bg-gradient-to-br from-orange-100 via-stone-100 to-green-100" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-green-100" />
            <div className="h-5 w-full animate-pulse rounded bg-stone-100" />
            <div className="h-5 w-3/4 animate-pulse rounded bg-stone-100" />
            <div className="h-10 w-32 animate-pulse rounded-full bg-orange-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
