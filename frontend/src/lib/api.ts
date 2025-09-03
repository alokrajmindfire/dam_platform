import type { User } from '@/types'
import api, { setAuthToken } from './axios'

export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    const { data } = await api.post('/auth/login', { email, password })
    console.log('data', data)
    const { accessToken, user } = data?.data

    localStorage.setItem('token', accessToken)
    setAuthToken(accessToken)

    return user
  },

  register: async (email: string, password: string, fullName: string): Promise<User> => {
    const { data } = await api.post('/auth/register', { email, password, fullName })
    const { accessToken, user } = data.data

    localStorage.setItem('token', accessToken)
    setAuthToken(accessToken)

    return user
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
    setAuthToken(null)
  },
}
