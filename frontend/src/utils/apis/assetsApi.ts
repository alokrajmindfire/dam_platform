import api from '../axios'

export const assetsApi = {
  list: async () => {
    const res = await api.get('/assets')
    if (res?.data?.data) return res.data.data
    return res.data
  },
  listWithQuery: async (params: Record<string, any>) => {
    const res = await api.get('/assets', { params })
    if (res?.data?.data) return res.data.data
    return res.data
  },
  upload: async (formData: FormData) => {
    const res = await api.post('/assets/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (res?.data?.data) return res.data.data
    return res.data
  },
}
