import React from 'react'

import { Menu, X } from 'lucide-react'
import { DesktopNav } from './DesktopNav'
import { UserMenu } from './UserMenu'
import { MobileNav } from './MobileNav'
import { ModeToggle } from '../ui/mode-toggle'

interface HeaderProps {
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const Header: React.FC<HeaderProps> = ({ mobileOpen, setMobileOpen }) => {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-lg font-bold" aria-label="Platform Home">
            Dam Platform
          </h1>

          <DesktopNav />
          <div className="flex items-center gap-3">
            <UserMenu />
            <button
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <ModeToggle />
          </div>
        </div>
      </div>

      {mobileOpen && <MobileNav setMobileOpen={setMobileOpen} />}
    </header>
  )
}
