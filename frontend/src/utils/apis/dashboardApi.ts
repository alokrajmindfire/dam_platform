import api from '../axios'

export const dashboardApi = {
  stash: async () => {
    const res = await api.get('/admin/dashboard')
    if (res?.data?.data) return res.data.data
    return res.data
  },
}
