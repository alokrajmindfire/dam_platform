import { projectApi } from '../apis/projectApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useProjectsByTeam = (teamId?: string) => {
  return useQuery({
    queryKey: ['projects', teamId],
    queryFn: () => (teamId ? projectApi.listByTeam(teamId) : []),
    enabled: !!teamId && teamId !== '0',
  })
}

export const useCreateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['projects', variables.teamId] })
    },
  })
}
