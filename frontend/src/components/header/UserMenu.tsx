import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/utils/apis/userApi'
import { useMutation } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { useUpdateVisibility } from '@/utils/queries/userQueries'
import { useLogout } from '@/utils/queries/authQueries'

export default function UserMenu() {
  const { user, loading } = useAuth()
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>(
    user?.profileVisibility || 'public',
  )
  const logoutMutation = useLogout()
  const updateVisibilityMutation = useUpdateVisibility()

  const handleLogout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  const handleVisibilityToggle = useCallback(async () => {
    const newValue = profileVisibility === 'public' ? 'private' : 'public'
    updateVisibilityMutation.mutate(newValue)
    setProfileVisibility(newValue)
  }, [profileVisibility, updateVisibilityMutation])

  if (loading) {
    return <span className="text-sm text-gray-400">Loading...</span>
  }

  if (!user) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 p-0 font-bold"
          aria-label="User Menu"
        >
          {user.fullName.charAt(0).toUpperCase()}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 p-2 space-y-2">
        <div className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome, {user.fullName}
        </div>

        <DropdownMenuItem
          className="flex items-center justify-between cursor-default"
          onClick={handleVisibilityToggle}
        >
          <span className="text-sm">
            Visibility - {user?.profileVisibility == 'public' ? 'Public' : 'Private'}
          </span>
          <Switch
            checked={profileVisibility === 'public'}
            // onCheckedChange={handleVisibilityToggle}
          />
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
