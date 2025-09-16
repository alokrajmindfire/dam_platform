import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useAddTeamMember, useTeams, useTeamMembers } from '@/utils/queries/teamQueries'
import { useUsers } from '@/utils/queries/userQueries'
import { toast } from 'sonner'

type FormValues = { teamId: string; userId: string }

export const ManageMember: React.FC = () => {
  const { control, handleSubmit, reset, watch } = useForm<FormValues>()
  const addMember = useAddTeamMember()
  const { data: users = [] } = useUsers()
  const { data: teams = [] } = useTeams()
  const selectedTeamId = watch('teamId')
  const { data: members = [] } = useTeamMembers(selectedTeamId || '')

  const onSubmit = (vals: FormValues) => {
    addMember.mutate(
      { teamId: vals.teamId, payload: { userId: vals.userId, role: 'member' } },
      {
        onSuccess: () => {
          toast.success('Member added successfully!')
          reset()
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Failed to add member')
        },
      },
    )
  }

  const availableUsers = users.filter(
    (u: { _id: string }) =>
      !members.some((m: { userId: { _id: string } }) => m.userId._id === u._id),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Team</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-5">
            <div className="space-y-2">
              <Label>Select Team</Label>
              <Controller
                name="teamId"
                control={control}
                rules={{ required: 'Select a team' }}
                render={({ field, fieldState }) => (
                  <div>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
                        {teams.length === 0 ? (
                          <SelectItem value="0" disabled>
                            No teams available
                          </SelectItem>
                        ) : (
                          teams.map((t: { _id: string; name: string }) => (
                            <SelectItem key={t._id} value={t._id}>
                              {t.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Add Member</Label>
              <Controller
                name="userId"
                control={control}
                rules={{ required: 'Select a user' }}
                render={({ field, fieldState }) => (
                  <div>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!selectedTeamId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableUsers.length === 0 ? (
                          <SelectItem value="0" disabled>
                            No users available
                          </SelectItem>
                        ) : (
                          availableUsers.map((u: { _id: string; name: string; email: string }) => (
                            <SelectItem key={u._id} value={u._id}>
                              {u.name} ({u.email})
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <p className="text-sm text-red-500 mt-1">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          {selectedTeamId && (
            <div className="space-y-2">
              <Label className="font-medium">Team Members</Label>
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground">No members in this team yet.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {members.map(
                    (m: {
                      userId: { _id: string; fullName: string; name: string; email: string }
                      role: string
                    }) => (
                      <li key={m.userId._id}>
                        {m.userId.fullName || m.userId.name} ({m.userId.email}) –{' '}
                        <span className="italic text-muted-foreground">{m.role}</span>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={addMember.isPending || !selectedTeamId || availableUsers.length === 0}
          >
            {addMember.isPending ? 'Adding...' : 'Add Member'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
