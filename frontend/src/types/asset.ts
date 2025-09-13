export interface TeamRef {
  _id: string
  name: string
  description?: string
}

export interface ProjectRef {
  _id: string
  name: string
  description?: string
  teamId?: TeamRef
}

export interface Asset {
  _id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  storagePath: string
  url: string
  thumbnailUrl?: string
  thumbnailUrlSigned?: string
  status: 'uploading' | 'processing' | 'ready' | 'failed'
  metadata?: {
    width?: number
    height?: number
    duration?: number
    dimensions?: {
      width: number
      height: number
    }
  }
  transcodedUrls?: Record<string, string>
  tags?: string[]
  description?: string
  downloadCount: number
  userId: string
  teamId?: TeamRef
  projectId?: ProjectRef
  channels?: string[]
  createdAt: string
  updatedAt: string
  uploadedAt?: string
}

export interface Filters {
  type: string
  dateRange: string
  tags: string[]
  status: string
}

export interface AssetFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}
