import { create } from 'zustand'

export interface User {
  id: string
  email: string
  fullName?: string
  riskProfile?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null

  setUser: (user: User | null) => void
  setTokens: (accessToken: string | null, refreshToken?: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
}

const STORAGE_KEY = 'mundo-invest-auth'

type PersistedAuth = Pick<AuthState, 'user' | 'accessToken' | 'refreshToken'>

function loadStoredAuth(): PersistedAuth {
  if (typeof window === 'undefined') {
    return { user: null, accessToken: null, refreshToken: null }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { user: null, accessToken: null, refreshToken: null }
    }

    return JSON.parse(raw) as PersistedAuth
  } catch {
    return { user: null, accessToken: null, refreshToken: null }
  }
}

function persistAuth(state: PersistedAuth) {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const storedAuth = loadStoredAuth()

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storedAuth.user,
  accessToken: storedAuth.accessToken,
  refreshToken: storedAuth.refreshToken,
  isLoading: false,
  error: null,

  setUser: (user) => {
    set({ user })
    const state = get()
    persistAuth({
      user,
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    })
  },

  setTokens: (accessToken, refreshToken = null) => {
    set({ accessToken, refreshToken })
    const state = get()
    persistAuth({
      user: state.user,
      accessToken,
      refreshToken,
    })
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,
    })
  },
}))
