import React, { memo } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const LoadingSpinner = memo(() => (
  <div className="flex h-screen items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
))

LoadingSpinner.displayName = 'LoadingSpinner'

export const ProtectedRoute: React.FC<ProtectedRouteProps> = memo(({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
})

ProtectedRoute.displayName = 'ProtectedRoute'
