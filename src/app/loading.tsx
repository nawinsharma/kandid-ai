import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-700 dark:text-neutral-200" />
        <p className="text-sm text-gray-600 dark:text-neutral-400">Loading…</p>
      </div>
    </div>
  )
}


