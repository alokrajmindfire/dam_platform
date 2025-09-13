import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../apis/dashboardApi'

export const useDashboardStash = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.stash,
  })
}
