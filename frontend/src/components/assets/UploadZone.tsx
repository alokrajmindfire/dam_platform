import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FileText, Image, Video, Upload, CheckCircle2, X } from 'lucide-react'
import { useUploadAssets } from '@/utils/queries'

interface UploadFile {
  id: string
  file: File
}

export function UploadZone() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const uploadMutation = useUploadAssets()

  const onDrop = useCallback(
    (accepted: File[]) => {
      const newFiles = accepted.map((file, i) => ({
        id: `${Date.now()}-${i}`,
        file,
      }))

      setFiles((prev) => [...prev, ...newFiles])
      uploadMutation.mutate(accepted)
    },
    [uploadMutation],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'application/pdf': [],
    },
    maxSize: 100 * 1024 * 1024,
  })

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5 text-green-500" />
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5 text-blue-500" />
    return <FileText className="w-5 h-5 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive ? 'border-primary bg-muted' : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <Upload className="w-8 h-8 text-gray-400" />
          <h3 className="text-xl font-semibold">Upload your assets</h3>
          <p className="text-gray-500 text-sm">
            Supports images, videos, and documents up to 100MB
          </p>
          <Button variant="default">Choose Files</Button>
        </div>
      </div>

      {files.length > 0 && (
        <Card className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Uploads</h4>
            <Button variant="ghost" size="sm" onClick={() => setFiles([])}>
              Clear
            </Button>
          </div>

          {files.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between gap-4 border rounded-md p-3"
            >
              <div className="flex items-center gap-2 truncate">
                {getFileIcon(f.file)}
                <span className="truncate text-sm">{f.file.name}</span>
              </div>

              <div className="flex items-center gap-2">
                {uploadMutation.isPending && <Progress value={70} className="w-24" />}
                {uploadMutation.isSuccess && (
                  <Badge variant="default">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Uploaded
                  </Badge>
                )}
                {uploadMutation.isError && <Badge variant="destructive">Error</Badge>}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setFiles((prev) => prev.filter((file) => file.id !== f.id))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
