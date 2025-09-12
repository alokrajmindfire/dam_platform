import { teamApi } from '../apis/teamApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.list,
  })
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teamApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  })
}

export const useAddTeamMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teamApi.addMember,
    onSuccess: (_, { teamId }) => {
      // refresh members after adding
      queryClient.invalidateQueries({ queryKey: ['teamMembers', teamId] })
    },
  })
}

export const useTeamAssets = (teamId: string) =>
  useQuery({
    queryKey: ['teamAssets', teamId],
    queryFn: () => teamApi.getAssets(teamId),
    enabled: !!teamId && teamId !== '0',
  })

export const useTeamMembers = (teamId: string) =>
  useQuery({
    queryKey: ['teamMembers', teamId],
    queryFn: () => teamApi.getMembers(teamId),
    enabled: !!teamId && teamId !== '0',
  })
