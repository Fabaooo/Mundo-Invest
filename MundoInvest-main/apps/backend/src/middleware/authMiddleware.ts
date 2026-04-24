import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/supabaseService'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      user?: any
    }
  }
}

/**
 * Middleware to verify JWT token from Authorization header
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Missing or invalid token' },
      })
    }

    const token = authHeader.slice(7) // Remove 'Bearer ' prefix
    const { user, error } = await verifyToken(token)

    if (error || !user) {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
      })
    }

    req.userId = user.id
    req.user = user
    next()
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
}

/**
 * Optional auth middleware - doesn't fail if no token
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.slice(7)
    const { user, error } = await verifyToken(token)

    if (!error && user) {
      req.userId = user.id
      req.user = user
    }

    next()
  } catch (error) {
    // Ignore errors in optional auth
    next()
  }
}
