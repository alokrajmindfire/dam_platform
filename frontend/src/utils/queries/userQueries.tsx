import { useMutation, useQuery } from '@tanstack/react-query'
import { userApi } from '../apis/userApi'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import type { User } from '@/types'

export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.list(),
  })

export const useUpdateVisibility = () => {
  const { user, login } = useAuth()

  return useMutation({
    mutationKey: ['user-visibility'],
    mutationFn: (isPublic: 'public' | 'private') => userApi.updateVisibility(isPublic),
    onSuccess: (updatedVisibility: User) => {
      if (user) {
        const updatedUser = { ...user, profileVisibility: updatedVisibility.profileVisibility }
        login(updatedUser)
        toast.success(`Profile visibility set to ${updatedVisibility.profileVisibility}`)
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update visibility')
    },
  })
}
