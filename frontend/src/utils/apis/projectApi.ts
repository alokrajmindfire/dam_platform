import api from '../axios'

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
