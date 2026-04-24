import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface RiskAssessmentRouteProps {
  children: React.ReactNode
}

export default function RiskAssessmentRoute({ children }: RiskAssessmentRouteProps) {
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (user.riskProfile) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
