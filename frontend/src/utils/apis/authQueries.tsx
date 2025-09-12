import { useMutation } from '@tanstack/react-query'
import { authApi } from './api'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export const useloginMutation = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (user) => {
      login(user)
      navigate('/')
    },
  })
}
export const useRegisterMutation = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
    }: {
      email: string
      password: string
      fullName: string
    }) => authApi.register(email, password, fullName),
    onSuccess: (user) => {
      login(user)
      toast.success('Registration successful!')
      navigate('/')
    },
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>
      const message = err.response?.data?.message || 'Login failed'
      toast.error(message)
    },
  })
}
