interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm ${className}`}
    >
      <div className="space-y-3">
        <div className="h-4 bg-zinc-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-8 bg-zinc-200 rounded w-2/3 animate-pulse"></div>
      </div>
    </div>
  );
}
