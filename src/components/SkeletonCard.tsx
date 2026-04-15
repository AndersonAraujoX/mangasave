export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#1E1E2E] border border-[#2A2A3E]">
      <div className="aspect-[3/4] skeleton" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-3 rounded w-full" />
        <div className="skeleton h-3 rounded w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
