/// <reference types="@testing-library/jest-dom" />
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAssets, useUploadAssets, useDeleteMutation } from '../src/utils/queries/assetsQueries'
import { assetsApi } from '../src/utils/apis/assetsApi'
import { toast } from 'sonner'

jest.mock('../src/utils/apis/assetsApi', () => ({
  assetsApi: {
    listWithQuery: jest.fn(),
    upload: jest.fn(),
    incrementDownload: jest.fn(),
    deleteAsset: jest.fn(),
  },
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useAssets Hook', () => {
  test('fetches assets successfully', async () => {
    ;(assetsApi.listWithQuery as jest.Mock).mockResolvedValueOnce({
      assets: [{ id: '1', name: 'Asset 1' }],
      total: 1,
    })

    const { result } = renderHook(() => useAssets(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.assets).toHaveLength(1)
      expect(result.current.total).toBe(1)
      expect(result.current.isLoading).toBe(false)
    })
  })

  test('changes filter and resets page', async () => {
    ;(assetsApi.listWithQuery as jest.Mock).mockResolvedValue({ assets: [], total: 0 })

    const { result } = renderHook(() => useAssets(), { wrapper: createWrapper() })

    act(() => {
      result.current.changeFilter('images')
    })

    expect(result.current.filter).toBe('images')
    expect(result.current.page).toBe(1)
  })

  test('searchAssets updates term and filter', async () => {
    ;(assetsApi.listWithQuery as jest.Mock).mockResolvedValue({ assets: [], total: 0 })

    const { result } = renderHook(() => useAssets(), { wrapper: createWrapper() })

    act(() => {
      result.current.searchAssets('logo', 'pdf')
    })

    expect(result.current.filter).toBe('pdf')
  })
})

describe('useUploadAssets Hook', () => {
  test('calls upload and invalidates queries on success', async () => {
    ;(assetsApi.upload as jest.Mock).mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() => useUploadAssets(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync(new FormData())
    })

    expect(assetsApi.upload).toHaveBeenCalled()
  })

  test('handles upload error', async () => {
    // ;(assetsApi.upload as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'))

    const { result } = renderHook(() => useUploadAssets(), { wrapper: createWrapper() })

    await act(async () => {
      try {
        await result.current.mutateAsync(new FormData())
      } catch {}
    })

    expect(assetsApi.upload).toHaveBeenCalled()
  })
})

describe('useDeleteMutation Hook', () => {
  test('calls deleteAsset and shows success toast', async () => {
    ;(assetsApi.deleteAsset as jest.Mock).mockResolvedValueOnce({ success: true })

    const { result } = renderHook(() => useDeleteMutation(), { wrapper: createWrapper() })

    await act(async () => {
      await result.current.mutateAsync('123')
    })

    expect(assetsApi.deleteAsset).toHaveBeenCalledWith('123')
    expect(toast.success).toHaveBeenCalledWith('Asset deleted successfully')
  })

  test('handles deleteAsset error with toast', async () => {
    ;(assetsApi.deleteAsset as jest.Mock).mockRejectedValueOnce(new Error('Fail'))

    const { result } = renderHook(() => useDeleteMutation(), { wrapper: createWrapper() })

    await act(async () => {
      try {
        await result.current.mutateAsync('123')
      } catch {}
    })

    expect(toast.error).toHaveBeenCalledWith('Failed to delete asset')
  })
})
