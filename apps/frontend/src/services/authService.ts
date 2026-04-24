import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Sign up with email and password
 */
export async function signup(
  email: string,
  password: string,
  fullName: string
) {
  try {
    const response = await apiClient.post('/auth/signup', {
      email,
      password,
      fullName,
    })
    return { data: response.data, error: null }
  } catch (error: any) {
    return { data: null, error: error.response?.data?.error?.message || 'Signup failed' }
  }
}

/**
 * Sign in with email and password
 */
export async function login(email: string, password: string) {
  try {
    console.log(`🔐 Frontend: Attempting login with ${email}`)
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    })

    console.log(`✅ Frontend: Login successful`, response.data)

    // Store tokens and user
    const { user, session } = response.data
    useAuthStore.getState().setUser(user)
    useAuthStore.getState().setTokens(session.access_token, session.refresh_token)

    return { data: response.data, error: null }
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || error.message || 'Login failed'
    console.error(`❌ Frontend: Login failed - ${errorMessage}`, error)
    return { data: null, error: errorMessage }
  }
}

/**
 * Get current user profile
 */
export async function getProfile() {
  try {
    const response = await apiClient.get('/auth/profile')
    return { data: response.data, error: null }
  } catch (error: any) {
    return { data: null, error: error.response?.data?.error?.message || 'Failed to fetch profile' }
  }
}

/**
 * Update user profile
 */
export async function updateProfile(updates: any) {
  try {
    const response = await apiClient.put('/auth/profile', updates)
    useAuthStore.getState().setUser(response.data)
    return { data: response.data, error: null }
  } catch (error: any) {
    return { data: null, error: error.response?.data?.error?.message || 'Failed to update profile' }
  }
}

/**
 * Logout endpoint (advisory only, since JWT is stateless)
 */
export async function logout() {
  try {
    await apiClient.post('/auth/logout')
    useAuthStore.getState().logout()
    return { error: null }
  } catch (error: any) {
    return { error: error.response?.data?.error?.message || 'Logout failed' }
  }
}
