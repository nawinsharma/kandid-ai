import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        <p className="text-gray-600 dark:text-neutral-400">Loading...</p>
      </div>
    </div>
  );
}

export function LoadingTable() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700 border-b">
                <tr>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <th key={index} className="text-left py-4 px-6">
                      <Skeleton className="h-4 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((bar) => (
                          <Skeleton key={bar} className="w-1 h-4" />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Skeleton className="h-6 w-20" />
                    </td>
                    <td className="py-4 px-6">
                      <Skeleton className="h-4 w-16" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
