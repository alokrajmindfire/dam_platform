'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/utils/api'
import { useMutation } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'

export default function UserMenu() {
  const location = useLocation()
  const { logout, user, loading } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout()
      // onClose()
      toast.success('Logged out successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Logout failed')
    },
  })

  const handleLogout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  if (loading) {
    return <span className="text-sm text-gray-400">Loading...</span>
  }

  if (!user) return null

  return (
    <div className="flex items-center space-x-4">
      <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-200">
        Welcome, {user.fullName}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center space-x-2"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </div>
  )
}
