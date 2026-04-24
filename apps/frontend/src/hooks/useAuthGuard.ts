import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export function useAuthGuard(redirectTo = '/login') {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!user) {
      navigate(redirectTo, { replace: true, state: { from: location } })
    }
  }, [user, navigate, location, redirectTo])

  return { user }
}
