import { createClient } from '@supabase/supabase-js'
import * as mockAuthService from './mockAuthService'

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || ''

const USE_MOCK_AUTH = !supabaseUrl || !supabaseServiceKey

if (USE_MOCK_AUTH) {
  console.log(
    '✅ Using MOCK authentication. Test credentials:\n' +
      mockAuthService
        .getTestCredentials()
        .map((c) => `   ${c.email} / ${c.password}`)
        .join('\n'),
  )
} else {
  console.log('✅ Using Supabase authentication')
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseServiceKey || 'placeholder', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

/**
 * Create a new user with email and password
 */
export async function signUp(email: string, password: string, fullName: string) {
  try {
    if (USE_MOCK_AUTH) {
      const { user, error } = mockAuthService.signUp(email, password, fullName)
      if (error) throw error
      return { user, error: null }
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name: fullName },
      email_confirm: true, // Auto-confirm in development
    })

    if (error) throw error

    // Create user profile in users table
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        risk_profile: 'MODERATE', // Default risk profile
      })

      if (profileError) throw profileError
    }

    return { user: data.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

/**
 * Authenticate user with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    if (USE_MOCK_AUTH) {
      const { user, accessToken, refreshToken, error } = mockAuthService.signIn(email, password)
      if (error) throw error
      return { session: { access_token: accessToken, refresh_token: refreshToken }, user, error: null }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { session: data.session, user: data.user, error: null }
  } catch (error: any) {
    return { session: null, user: null, error: error.message }
  }
}

/**
 * Get user by ID
 */
export async function getUserProfile(userId: string) {
  try {
    if (USE_MOCK_AUTH) {
      const { user, error } = mockAuthService.getUserProfile(userId)
      if (error) throw error
      return { user, error: null }
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return { user: data, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: any) {
  try {
    if (USE_MOCK_AUTH) {
      const { user, error } = mockAuthService.updateUserProfile(userId, updates)
      if (error) throw error
      return { user, error: null }
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return { user: data, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string) {
  try {
    if (USE_MOCK_AUTH) {
      const { userId, error } = mockAuthService.verifyToken(token)
      if (error) throw error
      // For mock, return a user object
      const { user, error: userError } = mockAuthService.getUserProfile(userId!)
      if (userError) throw userError
      return { user, error: null }
    }

    const { data, error } = await supabase.auth.getUser(token)

    if (error) throw error

    return { user: data.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}
