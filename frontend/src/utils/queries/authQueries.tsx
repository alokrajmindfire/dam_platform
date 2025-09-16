import { useMutation } from '@tanstack/react-query'
import { authApi } from '../apis/userApi'
import { toast } from 'sonner'
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
      navigate('/')
    },
  })
}

export const useLogout = () => {
  const { logout } = useAuth()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      toast.success('Logged out successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Logout failed')
    },
  })
}
