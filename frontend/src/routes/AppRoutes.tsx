import React, { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from './ProtectedRoute'

const Layout = lazy(() => import('@/components/layout/Layout'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const LoginForm = lazy(() => import('@/components/auth/LoginForm'))
const RegisterForm = lazy(() => import('@/components/auth/RegisterForm'))
const NetworkIssue = lazy(() => import('@/components/layout/NetworkIssue'))
const NotFound = lazy(() => import('@/components/layout/NotFound'))

const FullPageLoader = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
)

export const AppRoutes: React.FC = () => {
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
          <Route path="network-issue" element={<NetworkIssue />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
