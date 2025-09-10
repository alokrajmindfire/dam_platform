import React, { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/lib/api'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => logout(),
    onError: (error: Error) => toast.error(error.message || 'Logout failed'),
  })

  const handleLogout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  return (
    <>
      {user?.fullName && (
        <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 truncate max-w-[120px]">
          {user.fullName}
        </span>
      )}
      <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex gap-2">
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Logout</span>
      </Button>
    </>
  )
}
