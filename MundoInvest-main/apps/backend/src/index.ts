import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import assetsRoutes from './routes/assets'

dotenv.config()

const app = express()
const PORT = process.env.BACKEND_PORT || 3000

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://mundo-invest.vercel.app'
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Mundo Invest API',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      assets: '/api/assets',
      prices: '/api/prices',
      chat: '/api/chat',
      portfolio: '/api/portfolio',
    },
  })
})

// Auth routes
app.use('/api/auth', authRoutes)

// Assets routes
app.use('/api/assets', assetsRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Mundo Invest API running on http://localhost:${PORT}`)
  console.log(`📝 GET http://localhost:${PORT}/ for available endpoints`)
})
