'use client'

import { useEffect, useState } from 'react'
import { AssetCard } from '@/components/assets/AssetCard'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useAssets } from '@/utils/queries/assetsQueries'

function AssetGallery() {
  const { assets, total, isLoading, searchAssets, changeFilter, filter, page, setPage } =
    useAssets()

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const t = setTimeout(() => {
      searchAssets(searchTerm.trim())
    }, 300)
    return () => clearTimeout(t)
  }, [searchTerm, searchAssets])

  const lastPage = Math.ceil(total / 8) || 1

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
        <input
          type="text"
          className="w-full sm:w-1/2 px-4 py-2 border rounded-md"
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select value={filter} onValueChange={(val) => changeFilter(val)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <AssetCard key={(asset as any)._id} asset={asset} />
            ))}
          </div>

          <Pagination className="mt-4 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(1, page - 1))}
                  aria-disabled={page <= 1}
                  tabIndex={page <= 1 ? -1 : undefined}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
                />
              </PaginationItem>

              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {page} of {lastPage}
              </span>

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(lastPage, page + 1))}
                  aria-disabled={page >= lastPage}
                  tabIndex={page >= lastPage ? -1 : undefined}
                  className={page >= lastPage ? 'pointer-events-none opacity-50' : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  )
}

export default AssetGallery
