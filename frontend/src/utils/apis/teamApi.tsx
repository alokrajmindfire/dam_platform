import api from '../axios'

export const teamApi = {
  create: async (payload: { name: string; description?: string }) => {
    const res = await api.post('/teams', payload)
    return res.data.data
  },
  addMember: async ({
    teamId,
    payload,
  }: {
    teamId: string
    payload: { userId: string; role?: 'admin' | 'member' }
  }) => {
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
  getMembers: async (teamId: string) => {
    const res = await api.get(`/teams/${teamId}/members`)
    return res.data.data
  },
}
