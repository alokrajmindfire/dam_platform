import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'

const navigationItems = Object.freeze([{ path: '/', label: 'Dashboard', icon: Home }])

export const DesktopNav: React.FC = () => {
  const location = useLocation()

  return (
    <nav className="hidden md:flex space-x-6" aria-label="Main Navigation">
      {navigationItems.map((item) => {
        const active = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
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
    </nav>
  )
}
