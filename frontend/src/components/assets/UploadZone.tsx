import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { FileText, Image, Video, Upload, CheckCircle2, X } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { ChannelSelector } from '@/components/assets/ChannelSelector'
import { useProjectsByTeam } from '@/utils/queries/projectQueries'
import { useTeams } from '@/utils/queries/teamQueries'
import { useUploadAssets } from '@/utils/queries/assetsQueries'
import { toast } from 'sonner'

interface UploadFile {
  id: string
  file: File
  progress?: number
}

type FormValues = {
  scope: 'personal' | 'team'
  teamId?: string
  projectId?: string
  channels?: string[]
}

export function UploadZone() {
  const methods = useForm<FormValues>({ defaultValues: { scope: 'personal', channels: [] } })
  const { watch, setValue, reset } = methods
  const scope = watch('scope')
  const teamId = watch('teamId')
  const projectId = watch('projectId')
  const projectsQuery = useProjectsByTeam(teamId)
  const { data: teams = [] } = useTeams()
  const uploadMutation = useUploadAssets()

  const [files, setFiles] = useState<UploadFile[]>([])

  useEffect(() => {
    setValue('projectId', undefined)
  }, [teamId, setValue])

  useEffect(() => {
    if (scope === 'personal') {
      reset({ scope: 'personal', channels: [] })
    } else if (scope === 'team') {
      reset({ scope: 'team', channels: [] })
    }
    setFiles([])
  }, [scope, reset])

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length === 0) return

      if (scope === 'team' && (!teamId || teamId === '0')) {
        toast.info('Team scope selected but no valid team chosen. Skipping upload.')
        return
      }
      const newFiles = accepted.map((file, i) => ({
        id: `${Date.now()}-${i}`,
        file,
        progress: 0,
      }))
      setFiles((prev) => [...prev, ...newFiles])

      const formData = new FormData()
      accepted.forEach((f) => formData.append('files', f))
      formData.append('scope', scope)
      if (scope === 'team' && teamId && teamId != '0') formData.append('teamId', teamId)
      if (methods.getValues('projectId') && projectId && projectId != '0')
        formData.append('projectId', projectId)
      const channels = methods.getValues('channels') || []
      channels.forEach((c: string) => formData.append('channels', c))

      uploadMutation.mutate(formData, {
        onError: (err) => {
          console.error('Upload failed', err)
        },
      })
    },
    [scope, teamId, projectId, methods, uploadMutation],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [], 'video/*': [], 'application/pdf': [] },
    maxSize: 100 * 1024 * 1024,
  })

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/'))
      return <Image className="w-5 h-5 text-green-500" aria-hidden="true" />
    if (file.type.startsWith('video/'))
      return <Video className="w-5 h-5 text-blue-500" aria-hidden="true" />
    return <FileText className="w-5 h-5 text-gray-500" aria-hidden="true" />
  }

  return (
    <FormProvider {...methods}>
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex gap-4 items-center">
            <div
              {...getRootProps()}
              role="button"
              aria-label="Upload files by dragging and dropping or selecting"
              tabIndex={0}
              className={`flex-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary bg-muted' : 'border-gray-300 hover:border-primary/50'}`}
            >
              <input {...getInputProps()} aria-label="File input" />
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-gray-400" aria-hidden="true" />
                <div className="text-lg font-semibold">Drag & drop files here</div>
                <div className="text-sm text-gray-500">
                  Supports images, videos, docs — up to 100MB
                </div>
              </div>
            </div>

            <div className="w-80 space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Scope</label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setValue('scope', 'personal')}
                    aria-label="Set scope to personal"
                    className={`px-3 py-1 rounded ${scope === 'personal' ? 'bg-primary text-green-600' : 'border'}`}
                  >
                    Personal
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setValue('scope', 'team')}
                    aria-label="Set scope to team"
                    className={`px-3 py-1 rounded ${scope === 'team' ? 'bg-primary text-green-600' : 'border'}`}
                  >
                    Team
                  </Button>
                </div>
              </div>

              {scope === 'team' && (
                <>
                  <div>
                    <label className="text-sm font-medium">Team</label>
                    <Select
                      onValueChange={(v) => setValue('teamId', v)}
                      defaultValue={teamId}
                      value={teamId}
                    >
                      <SelectTrigger aria-label="Select team">
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        {teams.map((t: any) => (
                          <SelectItem key={t._id} value={t._id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Project (optional)</label>
                    <Select onValueChange={(v) => setValue('projectId', v)}>
                      <SelectTrigger aria-label="Select project">
                        <SelectValue
                          placeholder={
                            projectsQuery.isLoading
                              ? 'Loading projects...'
                              : 'Select project (optional)'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        {projectsQuery?.data?.map((p: any) => (
                          <SelectItem key={p._id} value={p._id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium">Channels</label>
                <ChannelSelector />
              </div>
            </div>
          </div>
        </Card>

        {files.length > 0 && (
          <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Uploads</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
                aria-label="Clear uploads"
              >
                Clear
              </Button>
            </div>

            <div role="list" className="space-y-2">
              {files.map((f) => (
                <div
                  key={f.id}
                  role="listitem"
                  className="flex items-center justify-between gap-4 border rounded-md p-3"
                >
                  <div className="flex items-center gap-2 truncate">
                    {getFileIcon(f.file)}
                    <span className="truncate text-sm">{f.file.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {uploadMutation.isPending && (
                      <Progress
                        value={70}
                        className="w-24"
                        aria-label={`Uploading ${f.file.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={70}
                      />
                    )}
                    {uploadMutation.isSuccess && (
                      <Badge variant="default" aria-label={`${f.file.name} uploaded`}>
                        <CheckCircle2 className="w-4 h-4 mr-1" aria-hidden="true" /> Uploaded
                      </Badge>
                    )}
                    {uploadMutation.isError && (
                      <Badge variant="destructive" aria-label={`Error uploading ${f.file.name}`}>
                        Error
                      </Badge>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setFiles((prev) => prev.filter((file) => file.id !== f.id))}
                      aria-label={`Remove ${f.file.name}`}
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </FormProvider>
  )
}

export default UploadZone
