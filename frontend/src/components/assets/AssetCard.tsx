import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Trash } from 'lucide-react'
import type { Asset } from '@/types/asset'
import { toast } from 'sonner'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { useAuth } from '@/contexts/AuthContext'
import { useDeleteMutation, useIncrementDownload } from '@/utils/queries/assetsQueries'

interface AssetCardProps {
  asset: Asset
}

export function AssetCard({ asset }: AssetCardProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [thumbnailStatus, setThumbnailStatus] = useState<'loading' | 'available' | 'unavailable'>(
    'loading',
  )
  const [streamAvailable, setStreamAvailable] = useState(true)

  const isImage = asset.mimeType.startsWith('image/')
  const isVideo = asset.mimeType.startsWith('video/')
  const isPdf = asset.mimeType === 'application/pdf'

  const downloadMutation = useIncrementDownload()
  const deleteMutation = useDeleteMutation()

  const backendDownloadUrl = `/api/assets/${asset._id}/download`
  const backendStreamUrl = open ? `/api/assets/${asset._id}/stream` : ''
  const backendThumbnailUrl = `/api/assets/${asset._id}/thumbnail`

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const res = await fetch(backendThumbnailUrl, { method: 'HEAD' }) // lightweight check
        if (res.ok) {
          setThumbnailStatus('available')
        } else {
          setThumbnailStatus('unavailable')
        }
      } catch {
        setThumbnailStatus('unavailable')
      }
    }
    fetchThumbnail()
  }, [backendThumbnailUrl])

  const handleDownload = async () => {
    try {
      await downloadMutation.mutateAsync(asset._id)
      const response = await fetch(backendDownloadUrl)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = asset.originalName || asset.filename || 'download'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      // console.error('Download failed', err)
      toast.error('Download failed')
    }
  }

  const handleStreamError = () => setStreamAvailable(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Open asset ${asset.originalName || asset.filename}`}
        className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-md transition bg-gray-100 flex items-center justify-center aspect-[4/3]"
      >
        {thumbnailStatus === 'available' && (isImage || isVideo) ? (
          <img
            src={backendThumbnailUrl}
            alt={asset.filename}
            className="object-cover w-full h-full"
          />
        ) : isPdf ? (
          <span className="text-5xl">📄</span>
        ) : !isImage && !isVideo ? (
          <span className="text-5xl">📦</span>
        ) : (
          <span className="text-sm text-gray-500">Thumbnail not available</span>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{asset.originalName || asset.filename}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {!isPdf && (isImage || isVideo) && streamAvailable ? (
              <div className="w-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden aspect-video">
                {isImage && backendStreamUrl && (
                  <img
                    src={backendStreamUrl}
                    alt={asset.filename}
                    className="object-contain w-full h-full"
                    onError={handleStreamError}
                  />
                )}
                {isVideo && backendStreamUrl && (
                  <video
                    src={backendStreamUrl}
                    controls
                    className="w-full h-full object-contain"
                    onError={handleStreamError}
                  />
                )}
              </div>
            ) : !isPdf && !streamAvailable ? (
              <div className="flex flex-col items-center justify-center text-gray-500 bg-gray-100 rounded-lg aspect-video">
                <span className="text-sm mt-2">Stream not available</span>
              </div>
            ) : null}

            {isPdf && streamAvailable && backendStreamUrl ? (
              <div className="w-full h-[500px] border border-gray-300 rounded">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={backendStreamUrl} />
                </Worker>
              </div>
            ) : isPdf && !streamAvailable ? (
              <div className="flex flex-col items-center justify-center text-gray-500 border border-gray-300 rounded h-[500px]">
                <span className="text-sm mt-2">PDF not available</span>
              </div>
            ) : null}

            {!isImage && !isVideo && !isPdf && (
              <div className="flex flex-col items-center text-gray-600">
                <span className="text-6xl">📦</span>
                <span className="text-sm mt-2">{asset.status}</span>
              </div>
            )}

            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <strong>Size:</strong> {(asset.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p>
                <strong>Type:</strong> {asset.mimeType}
              </p>
              <p>
                <strong>Status:</strong> {asset.status}
              </p>
              <p>
                <strong>Downloads:</strong> {asset.downloadCount}
              </p>
              {asset.projectId?.name && (
                <p>
                  <strong>Project:</strong> {asset.projectId?.name}
                </p>
              )}
              {asset.projectId?.teamId?.name && (
                <p>
                  <strong>Team:</strong> {asset.projectId.teamId.name}
                </p>
              )}
              {asset.tags && asset.tags.length > 0 && (
                <p>
                  <strong>Tags:</strong> {asset.tags.join(', ')}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button
                variant="secondary"
                onClick={() => backendStreamUrl && window.open(backendStreamUrl, '_blank')}
                disabled={!streamAvailable}
              >
                Preview in Browser
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              {user?._id === asset.userId && (
                <Button variant="destructive" onClick={() => deleteMutation.mutate(asset._id)}>
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
