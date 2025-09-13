import { useEffect, useState } from 'react'
import { AssetCard } from '@/components/assets/AssetCard'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { AssetFilters } from '@/components/assets/AssetFilters'
import { useAssets } from '@/utils/queries/assetsQueries'

function AssetGallery() {
  const {
    assets,
    total,
    isLoading,
    searchAssets,
    changeFilter,
    filter,
    teamId,
    changeTeam,
    date,
    changeDate,
    page,
    setPage,
  } = useAssets()

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
      <AssetFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        changeFilter={changeFilter}
        teamId={teamId}
        changeTeam={changeTeam}
        date={date}
        changeDate={changeDate}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <AssetCard key={asset._id} asset={asset} />
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
