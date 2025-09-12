import api from '../axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const teamApi = {
  create: async (payload: { name: string; description?: string }) => {
    const res = await api.post('/teams', payload)
    return res.data.data
  },
  addMember: async (teamId: string, payload: { userId: string; role?: 'admin' | 'member' }) => {
    const res = await api.post(`/teams/${teamId}/members`, payload)
    return res.data.data
  },
  list: async () => {
    const res = await api.get('/teams')
    return res.data.data
  },
  get: async (teamId: string) => {
    const res = await api.get(`/teams/${teamId}`)
    return res.data.data
  },
  getAssets: async (teamId: string, params?: any) => {
    const res = await api.get(`/teams/${teamId}/assets`, { params })
    return res.data.data
  },
}

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
