import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallbackPath?: string
}

export default function ProtectedRoute({ children, fallbackPath = '/login' }: ProtectedRouteProps) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to={fallbackPath} replace state={{ from: location }} />
  }

  return <>{children}</>
}
