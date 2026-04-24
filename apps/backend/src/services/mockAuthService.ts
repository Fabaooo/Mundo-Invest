/**
 * Mock Authentication Service
 * Simulates user database and auth operations without Supabase
 * Perfect for testing the full flow before Supabase integration
 */

interface MockUser {
  id: string
  email: string
  password: string
  full_name: string
  risk_profile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
}

// In-memory store of mock users
const mockUsers = new Map<string, MockUser>()

// Pre-populate with test users
const SEED_USERS: MockUser[] = [
  {
    id: 'user_test_001',
    email: 'teste@email.com',
    password: '123456',
    full_name: 'Usuário Teste',
    risk_profile: 'MODERATE',
  },
  {
    id: 'user_demo_001',
    email: 'demo@email.com',
    password: 'demo123',
    full_name: 'Demo User',
    risk_profile: 'CONSERVATIVE',
  },
]

// Initialize mock users
SEED_USERS.forEach((user) => {
  mockUsers.set(user.email, user)
})

export function signUp(
  email: string,
  password: string,
  fullName: string,
): { user: MockUser | null; error: string | null } {
  try {
    // Check if user already exists
    if (mockUsers.has(email)) {
      return { user: null, error: 'User already exists' }
    }

    // Create new user
    const user: MockUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In real app, this would be hashed
      full_name: fullName,
      risk_profile: 'MODERATE',
    }

    mockUsers.set(email, user)

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export function signIn(
  email: string,
  password: string,
): {
  user: MockUser | null
  accessToken: string | null
  refreshToken: string | null
  error: string | null
} {
  try {
    console.log(`🔐 Mock Auth - Attempting login: ${email}`)
    const user = mockUsers.get(email)

    if (!user) {
      console.log(`❌ User not found: ${email}`)
      console.log(`Available users: ${Array.from(mockUsers.keys()).join(', ')}`)
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: 'User not found',
      }
    }

    if (user.password !== password) {
      console.log(`❌ Invalid password for ${email}`)
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: 'Invalid password',
      }
    }

    console.log(`✅ Login successful: ${email}`)
    // Generate mock JWT tokens (not real JWT, just for testing)
    const accessToken = `mock_access_${user.id}_${Date.now()}`
    const refreshToken = `mock_refresh_${user.id}_${Date.now()}`

    return { user, accessToken, refreshToken, error: null }
  } catch (error: any) {
    console.error(`❌ Mock Auth Error: ${error.message}`)
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      error: error.message,
    }
  }
}

export function getUserProfile(userId: string): { user: MockUser | null; error: string | null } {
  try {
    // Find user by ID
    for (const user of mockUsers.values()) {
      if (user.id === userId) {
        return { user, error: null }
      }
    }

    return { user: null, error: 'User not found' }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export function updateUserProfile(
  userId: string,
  updates: Partial<MockUser>,
): { user: MockUser | null; error: string | null } {
  try {
    // Find user by ID
    for (const user of mockUsers.values()) {
      if (user.id === userId) {
        // Update only allowed fields
        if (updates.full_name) user.full_name = updates.full_name
        if (updates.risk_profile) user.risk_profile = updates.risk_profile

        return { user, error: null }
      }
    }

    return { user: null, error: 'User not found' }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export function verifyToken(token: string): { userId: string | null; error: string | null } {
  try {
    // Mock token verification - just extract user ID from token
    if (token.startsWith('mock_access_')) {
      const parts = token.split('_')
      if (parts.length >= 3) {
        const userId = parts[2]
        return { userId, error: null }
      }
    }

    return { userId: null, error: 'Invalid token' }
  } catch (error: any) {
    return { userId: null, error: error.message }
  }
}

// Helper to get test credentials (for documentation)
export function getTestCredentials() {
  return SEED_USERS.map((user) => ({
    email: user.email,
    password: user.password,
    fullName: user.full_name,
  }))
}
