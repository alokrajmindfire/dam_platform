import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../header/Header'
import BottomNav from '../header/BottomNav'

const Layout: React.FC = memo(() => {
  return (
    <main className="min-h-screen transition-colors" role="main" id="main-content" tabIndex={-1}>
      <Header />
      <div className="flex-1 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 focus:outline-none">
        <Outlet />
      </div>
      <BottomNav />
    </main>
  )
})

Layout.displayName = 'Layout'
export default Layout
