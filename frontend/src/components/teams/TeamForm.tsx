import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useCreateTeam } from '@/utils/apis/teamQueries'
import { toast } from 'sonner'

type FormValues = {
  name: string
  description?: string
}

export const TeamForm: React.FC = () => {
  const methods = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: { name: '', description: '' },
  })
  const create = useCreateTeam()

  const onSubmit = (vals: FormValues) => {
    create.mutate(vals, {
      onSuccess: () => {
        toast.success('Team created successfully!')
        methods.reset()
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to create team')
      },
    })
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Create Team</h3>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-3">
          <Input
            {...methods.register('name', { required: 'Team name is required' })}
            placeholder="Team name"
            aria-invalid={!!methods.formState.errors.name}
          />
          {methods.formState.errors.name && (
            <p className="text-sm text-red-500">{methods.formState.errors.name.message}</p>
          )}

          <Input {...methods.register('description')} placeholder="Short description (optional)" />

          <div>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Card>
  )
}

export default TeamForm
