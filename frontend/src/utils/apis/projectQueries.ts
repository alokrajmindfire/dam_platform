import api from '../axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const projectApi = {
  create: async (payload: { name: string; teamId: string; description?: string }) => {
    const res = await api.post('/projects', payload)
    return res.data.data
  },
  listByTeam: async (teamId: string) => {
    const res = await api.get(`/projects/team/${teamId}`)
    return res.data.data
  },
}

export const useProjectsByTeam = (teamId?: string) =>
  useQuery({
    queryKey: ['projects', teamId],
    queryFn: () => (teamId ? projectApi.listByTeam(teamId) : []),
    enabled: !!teamId,
  })

export const useCreateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['projects', variables.teamId] })
    },
  })
}
