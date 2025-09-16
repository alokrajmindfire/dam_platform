import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useTeams } from '@/utils/queries/teamQueries'
import { useCreateProject } from '@/utils/queries/projectQueries'
import { toast } from 'sonner'

type FormValues = {
  teamId: string
  name: string
  description?: string
}

export const ProjectForm: React.FC = () => {
  const { data: teams = [] } = useTeams()
  const methods = useForm<FormValues>({
    defaultValues: { teamId: '', name: '', description: '' },
  })
  const create = useCreateProject()
  const teamId = methods.watch('teamId')
  const isDisabled = teamId === '0'
  const onSubmit = (vals: FormValues) => {
    if (vals.teamId === '0') return
    create.mutate(vals, {
      onSuccess: () => {
        toast.success('Project created successfully!')
        methods.reset()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to create project')
      },
    })
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Create Project</h3>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-3">
        <Controller
          name="teamId"
          control={methods.control}
          rules={{ required: 'Team is required' }}
          render={({ field, fieldState }) => (
            <div>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
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
              {fieldState.error && (
                <p className="text-sm text-red-500">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        <div>
          <Input
            {...methods.register('name', { required: 'Project name is required' })}
            placeholder="Project name"
            aria-invalid={!!methods.formState.errors.name}
          />
          {methods.formState.errors.name && (
            <p className="text-sm text-red-500">{methods.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Input {...methods.register('description')} placeholder="Short description" />
        </div>

        <div>
          <Button type="submit" disabled={isDisabled || create.isPending}>
            {create.isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
