import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assetsApi } from './api'
import { useCallback, useEffect, useMemo, useState } from 'react'

export const useAssets = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['all-assets'],
    queryFn: () => assetsApi.list(),
    staleTime: 60 * 1000,
  })

  const originalAssets = data ?? []

  const [filters, setFilters] = useState<{
    type?: string
    status?: string
    tags?: string[]
    dateRange?: string
  }>({
    type: '',
    status: '',
    tags: [],
    dateRange: '',
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const searchAssets = useCallback((term: string) => {
    setSearchTerm(term.trim().toLowerCase())
  }, [])

  const filteredAssets = useMemo(() => {
    if (!originalAssets || originalAssets.length === 0) return []

    return originalAssets.filter((asset: any) => {
      if (searchTerm) {
        const hay =
          `${asset.originalName ?? ''} ${asset.filename ?? ''} ${asset.tags?.join(' ') ?? ''} ${asset.mimeType ?? ''}`.toLowerCase()
        if (!hay.includes(searchTerm)) return false
      }

      if (filters.type && asset.mimeType && !asset.mimeType.includes(filters.type)) return false

      if (filters.status && asset.status !== filters.status) return false

      if (filters.tags && filters.tags.length > 0) {
        const assetTags = (asset.tags ?? []).map((t: string) => t.toLowerCase())
        if (!filters.tags.some((t: string) => assetTags.includes(t.toLowerCase()))) return false
      }

      return true
    })
  }, [originalAssets, searchTerm, filters])

  const reload = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['all-assets'] })
    refetch()
  }, [queryClient, refetch])

  const setFiltersWrapper = useCallback((f: typeof filters) => {
    setFilters((prev) => ({ ...prev, ...f }))
  }, [])

  useEffect(() => {
    if (!data) refetch()
  }, [data, refetch])

  return {
    assets: originalAssets,
    filteredAssets,
    isLoading,
    refetch: reload,
    searchAssets: searchAssets,
    filters,
    setFilters: setFiltersWrapper,
    viewMode,
    setViewMode,
  }
}
// export const useUpdateTransaction = () => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
//       transactionApi.updateTransaction(id, data),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['transactions'] })
//     },

//     onError: (error) => {
//       console.error('Failed to update transaction', error)
//     },
//   })
// }
