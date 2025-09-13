import { useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  const isImage = asset.mimeType.startsWith('image/')
  const isVideo = asset.mimeType.startsWith('video/')
  const isPdf = asset.mimeType === 'application/pdf'

  const downloadMutation = useIncrementDownload()
  const deleteMutation = useDeleteMutation()

  const handleDownload = async () => {
    try {
      await downloadMutation.mutateAsync(asset._id)
      const response = await fetch(asset.url)
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
      console.error('Download failed', err)
      toast.error('Download failed')
    }
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Open asset ${asset.originalName || asset.filename}`}
        className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-md transition bg-gray-100 flex items-center justify-center aspect-[4/3]"
      >
        {asset.thumbnailUrlSigned ? (
          <img
            src={asset.thumbnailUrlSigned}
            alt={asset.filename}
            className="object-cover w-full h-full"
          />
        ) : isImage ? (
          <div className="flex flex-col items-center justify-center text-gray-600">
            <span className="text-5xl">🖼️</span>
            <span className="text-sm mt-2 text-black">{asset.status}</span>
          </div>
        ) : isVideo ? (
          <div className="flex flex-col items-center justify-center text-gray-600">
            <span className="text-5xl">🎞️</span>
            <span className="text-sm mt-2 text-black">{asset.status}</span>
          </div>
        ) : isPdf ? (
          <span className="text-5xl">📄</span>
        ) : (
          <span className="text-5xl">📦</span>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{asset.originalName || asset.filename}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {!isPdf && (
              <div className="w-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden aspect-video">
                {isImage && (
                  <img
                    src={asset.url}
                    alt={asset.filename}
                    className="object-contain w-full h-full"
                  />
                )}
                {isVideo && (
                  <video
                    src={asset.transcodedUrls?.['720p'] || asset.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            )}

            {isPdf && (
              <div className="w-full h-[300px] border border-gray-300 rounded">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={asset.url} />
                </Worker>
              </div>
            )}

            {!isImage && !isVideo && !isPdf && <span className="text-6xl">📦</span>}

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
              <Button variant="secondary" onClick={() => window.open(asset.url, '_blank')}>
                Preview in Browser
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              {user?._id == asset.userId && (
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
