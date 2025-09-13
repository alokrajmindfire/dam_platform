import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useDashboardStash } from '@/utils/queries/dashboardQueries'

export default function AdminDashboard() {
  const { isLoading, data } = useDashboardStash()
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  const { totalAssets, totalDownloads, uploadCounts, latestAssets } = data

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalAssets}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalDownloads}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploads Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={uploadCounts}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Latest Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {latestAssets.map((asset: any) => (
              <li key={asset._id} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">{asset.originalName}</p>
                  <p className="text-sm text-muted-foreground">{asset.mimeType}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
