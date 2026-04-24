import { Router, Request, Response } from 'express'
import * as supabaseService from '../services/supabaseService'
import * as mockAuthService from '../services/mockAuthService'
import { authMiddleware } from '../middleware/authMiddleware'

const router = Router()

/**
 * POST /api/auth/signup
 * Create a new user account
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email, password, and fullName are required',
        },
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 6 characters',
        },
      })
    }

    const { user, error } = await supabaseService.signUp(email, password, fullName)

    if (error) {
      return res.status(409).json({
        error: { code: 'CONFLICT', message: error },
      })
    }

    // Handle both mock and real Supabase responses
    const nameField = (user as any)?.full_name || (user as any)?.user_metadata?.full_name || ''

    res.status(201).json({
      user: {
        id: user?.id,
        email: user?.email,
        fullName: nameField,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      })
    }

    const { session, user, error } = await supabaseService.signIn(email, password)

    if (error) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: error },
      })
    }

    res.json({
      user: {
        id: user?.id,
        email: user?.email,
        full_name: user?.full_name || '',
      },
      session: {
        access_token: session?.access_token,
        refresh_token: session?.refresh_token,
        expires_in: session?.expires_in || 3600,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

/**
 * GET /api/auth/profile
 * Get current user profile (requires auth)
 */
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId

    const { user, error } = await supabaseService.getUserProfile(userId!)

    if (error) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error },
      })
    }

    res.json(user)
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

/**
 * PUT /api/auth/profile
 * Update user profile (requires auth)
 */
router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.userId
    const updates = req.body

    // Sanitize - don't allow ID or email changes
    delete updates.id
    delete updates.email

    const { user, error } = await supabaseService.updateUserProfile(userId!, updates)

    if (error) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: error },
      })
    }

    res.json(user)
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

/**
 * POST /api/auth/logout
 * Logout (just advisory - JWT is stateless)
 */
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' })
})

/**
 * GET /api/auth/test-credentials
 * Get available test credentials (only in mock mode)
 */
router.get('/test-credentials', async (req: Request, res: Response) => {
  try {
    const credentials = mockAuthService.getTestCredentials()
    res.json({
      mode: 'mock',
      testCredentials: credentials,
      message: 'Use these credentials to test the app before connecting Supabase',
    })
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

export default router
