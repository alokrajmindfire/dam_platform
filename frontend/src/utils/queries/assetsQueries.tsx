import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import type { Asset } from '@/types/asset'
import { assetsApi } from '../apis/assetsApi'
import { toast } from 'sonner'

export interface UseAssetsResult {
  assets: Asset[]
  total: number
  isLoading: boolean
  searchAssets: (term: string, filterValue?: string) => void
  changeFilter: (filterValue: string) => void
  changeTeam: (teamIdValue: string) => void
  changeDate: (dateValue: string) => void
  refetch: () => void
  page: number
  setPage: (page: number) => void
  filter: string
  setFilter: (filter: string) => void
  teamId: string
  setTeamId: (teamId: string) => void
  date: string
  setDate: (date: string) => void
}

export function useAssets(): UseAssetsResult {
  const queryClient = useQueryClient()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filter, setFilter] = useState<string>('all')
  const [teamId, setTeamId] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['assets', { search: searchTerm, filter, teamId, date, page }],
    queryFn: () =>
      assetsApi.listWithQuery({
        search: searchTerm,
        filter: filter !== 'all' ? filter : undefined,
        teamId: teamId == '0' ? undefined : teamId || undefined,
        date: date || undefined,
        page,
        limit: 8,
      }),
    staleTime: 0,
  })

  const assets = data?.assets ?? []
  const total = data?.total ?? 0

  const searchAssets = useCallback((term: string, filterValue?: string) => {
    setPage(1)
    setSearchTerm(term)
    if (filterValue !== undefined) {
      setFilter(filterValue)
    }
  }, [])

  const changeFilter = useCallback((filterValue: string) => {
    setPage(1)
    setFilter(filterValue)
  }, [])

  const changeTeam = useCallback((teamIdValue: string) => {
    setPage(1)
    setTeamId(teamIdValue)
  }, [])

  const changeDate = useCallback((dateValue: string) => {
    setPage(1)
    setDate(dateValue)
  }, [])

  const reload = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['assets'] })
    refetch()
  }, [queryClient, refetch])

  return {
    assets,
    total,
    isLoading,
    searchAssets,
    changeFilter,
    changeTeam,
    changeDate,
    refetch: reload,
    page,
    setPage,
    filter,
    setFilter,
    teamId,
    setTeamId,
    date,
    setDate,
  }
}

export const useUploadAssets = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) => assetsApi.upload(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },

    onError: (error) => {
      console.error('Upload failed:', error)
    },
  })
}
export const useIncrementDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => assetsApi.incrementDownload(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
    },
  })
}
export const useDeleteMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assetsApi.deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] })
      toast.success('Asset deleted successfully')
    },
    onError: () => toast.error('Failed to delete asset'),
  })
}
