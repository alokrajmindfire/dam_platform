import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../header/Header'
import BottomNav from '../header/BottomNav'

const Layout: React.FC = memo(() => {
  return (
    <div className="min-h-screen transition-colors">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
})

Layout.displayName = 'Layout'
export default Layout
