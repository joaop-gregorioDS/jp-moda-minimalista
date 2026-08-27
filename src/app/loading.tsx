export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="h-8 w-48 animate-pulse rounded-full bg-ink/10" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-ink/5">
            <div className="aspect-[5/5.5] animate-pulse bg-sand" />
            <div className="space-y-2 p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-ink/10" />
              <div className="h-4 w-full animate-pulse rounded bg-ink/10" />
              <div className="h-4 w-20 animate-pulse rounded bg-ink/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
