import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { authApi } from '@/lib/api'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'

interface MobileNavProps {
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const navigationItems = Object.freeze([{ path: '/', label: 'Dashboard', icon: Home }])

export const MobileNav: React.FC<MobileNavProps> = ({ setMobileOpen }) => {
  const location = useLocation()
  const { logout } = useAuth()

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => logout(),
    onError: (error: Error) => toast.error(error.message || 'Logout failed'),
  })

  return (
    <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="flex flex-col p-2 space-y-2">
        {navigationItems.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={() => logoutMutation.mutate()}
          className="flex gap-2"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </Button>
      </div>
    </div>
  )
}
