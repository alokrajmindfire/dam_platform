import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import type { Asset } from '@/types/asset'
import { assetsApi } from '../apis/assetsApi'

export interface UseAssetsResult {
  assets: Asset[]
  total: number
  isLoading: boolean
  searchAssets: (term: string, filterValue?: string) => void
  changeFilter: (filterValue: string) => void
  refetch: () => void
  page: number
  setPage: (page: number) => void
  filter: string
  setFilter: (filter: string) => void
}

export function useAssets(): UseAssetsResult {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filter, setFilter] = useState<string>('all')
  const [page, setPage] = useState<number>(1)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['assets', { search: searchTerm, filter, page }],
    queryFn: () =>
      assetsApi.listWithQuery({
        search: searchTerm,
        filter: filter !== 'all' ? filter : undefined,
        page,
        limit: 8,
      }),
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
    refetch: reload,
    page,
    setPage,
    filter,
    setFilter,
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
