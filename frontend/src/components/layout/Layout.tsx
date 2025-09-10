import React, { useState, memo } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'

const Layout: React.FC = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen transition-colors">
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
})
export default Layout
