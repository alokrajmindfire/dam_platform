import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Play } from 'lucide-react'
import type { Asset } from '@/types/asset'

interface AssetCardProps {
  asset: Asset
}

export function AssetCard({ asset }: AssetCardProps) {
  const [open, setOpen] = useState(false)

  const isImage = asset.mimeType.startsWith('image/')
  const isVideo = asset.mimeType.startsWith('video/')
  const isPdf = asset.mimeType === 'application/pdf'

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = asset.url
    link.download = asset.originalName || asset.filename
    link.click()
  }

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-md transition bg-gray-100 flex items-center justify-center aspect-[4/3]"
      >
        {asset.thumbnailUrlSigned && (
          <img
            src={asset.thumbnailUrlSigned}
            alt={asset.filename}
            className="object-cover w-full h-full"
          />
        )}
        {/* {isVideo && (
          <div className="flex items-center justify-center w-full h-full bg-black/30">
            <Play className="w-10 h-10 text-white" />
          </div>
        )}*/}
        {isPdf && <span className="text-5xl">📄</span>}
        {!isImage && !isVideo && !isPdf && <span className="text-5xl">📦</span>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{asset.originalName || asset.filename}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {/* Preview Section */}
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
              {isPdf && (
                <iframe
                  src={asset.url}
                  className="w-full h-[600px]"
                  title={asset.filename}
                ></iframe>
              )}
              {!isImage && !isVideo && !isPdf && <span className="text-6xl">📦</span>}
            </div>

            {/* Meta Info */}
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
              {asset.tags && asset.tags.length > 0 && (
                <p>
                  <strong>Tags:</strong> {asset.tags.join(', ')}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
