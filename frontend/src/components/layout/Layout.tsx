import React, { useState, memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

const Layout: React.FC = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
})
export default Layout
