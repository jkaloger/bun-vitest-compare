export default function Loading() {
  return (
    <main className="min-h-screen p-8">
      <div className="h-4 w-24 bg-muted rounded animate-pulse" />

      <div className="mt-4 max-w-md mx-auto rounded-lg border p-6 space-y-4">
        <div className="h-7 w-40 bg-muted rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
          <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
        </div>
        <div className="h-64 w-64 mx-auto bg-muted rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-2 w-full bg-muted rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
