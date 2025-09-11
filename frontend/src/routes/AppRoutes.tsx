import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'

const Layout = lazy(() =>
  import('@/components/layout/Layout').then((module) => {
    import('@/pages/Dashboard')
    return module
  }),
)
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const AssetGallery = lazy(() => import('@/pages/AssetGallery'))
const LoginForm = lazy(() => import('@/components/auth/LoginForm'))
const RegisterForm = lazy(() => import('@/components/auth/RegisterForm'))
const NetworkIssue = lazy(() => import('@/components/layout/NetworkIssue'))
const NotFound = lazy(() => import('@/components/layout/NotFound'))

const FullPageLoader = React.memo(() => (
  <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
))

FullPageLoader.displayName = 'FullPageLoader'

export const AppRoutes: React.FC = React.memo(() => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <FullPageLoader />
  }

  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="gallery" element={<AssetGallery />} />
          <Route path="network-issue" element={<NetworkIssue />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
})

AppRoutes.displayName = 'AppRoutes'
