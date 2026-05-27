import api from './api'

export interface AuthUserResponse {
  id: string
  email: string
  full_name?: string
  risk_profile?: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
}

export interface AuthSession {
  access_token: string
  refresh_token: string
}

export interface AuthLoginResponse {
  user: AuthUserResponse
  session: AuthSession
}

export async function signup(
  email: string,
  password: string,
  fullName: string
) {
  try {
    const response = await api.post('/auth/signup', {
      email,
      password,
      fullName,
    })
    return { data: response.data, error: null }
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.error?.message || 'Falha ao criar a conta',
    }
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await api.post<AuthLoginResponse>('/auth/login', {
      email,
      password,
    })

    return { data: response.data, error: null }
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.error?.message || error.message || 'Falha ao fazer login',
    }
  }
}

export async function getProfile() {
  try {
    const response = await api.get('/auth/profile')
    return { data: response.data as AuthUserResponse, error: null }
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.error?.message || 'Falha ao buscar perfil',
    }
  }
}

export async function updateProfile(updates: { risk_profile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE' }) {
  try {
    const response = await api.put('/auth/profile', updates)
    return { data: response.data as AuthUserResponse, error: null }
  } catch (error: any) {
    return {
      data: null,
      error: error.response?.data?.error?.message || 'Falha ao atualizar perfil',
    }
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout')
    return { error: null }
  } catch (error: any) {
    return {
      error: error.response?.data?.error?.message || 'Falha ao sair',
    }
  }
}
