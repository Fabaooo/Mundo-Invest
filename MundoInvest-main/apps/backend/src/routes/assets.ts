import { Router, Request, Response } from 'express'
import * as coinGeckoService from '../services/coinGeckoService'
import { optionalAuthMiddleware } from '../middleware/authMiddleware'

const router = Router()

/**
 * GET /api/assets
 * Get list of all available assets (from hardcoded list for MVP)
 * In production, this would come from database
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    // For MVP, return hardcoded list of popular assets
    const assets = [
      { symbol: 'BTC', name: 'Bitcoin', type: 'CRYPTO', icon: '₿' },
      { symbol: 'ETH', name: 'Ethereum', type: 'CRYPTO', icon: '⟠' },
      { symbol: 'ADA', name: 'Cardano', type: 'CRYPTO', icon: '⬥' },
      { symbol: 'SOL', name: 'Solana', type: 'CRYPTO', icon: '◎' },
      { symbol: 'DOGE', name: 'Dogecoin', type: 'CRYPTO', icon: '🐕' },
      { symbol: 'XRP', name: 'Ripple', type: 'CRYPTO', icon: '✕' },
    ]

    res.json({
      assets,
      total: assets.length,
      cached: false,
    })
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

/**
 * GET /api/assets/top
 * Get top cryptocurrencies with current prices
 * Query params: limit (default 20)
 */
router.get('/top', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20

    const { data, error } = await coinGeckoService.getCryptocurrencies(limit, 1)

    if (error) {
      return res.status(400).json({
        error: { code: 'EXTERNAL_API_ERROR', message: error },
      })
    }

    // Transform CoinGecko response
    const assets = data.map((crypto: any) => ({
      symbol: crypto.symbol?.toUpperCase(),
      name: crypto.name,
      price: crypto.current_price,
      marketCap: crypto.market_cap,
      volume24h: crypto.total_volume,
      change24h: crypto.price_change_percentage_24h,
      icon: crypto.image,
      rank: crypto.market_cap_rank,
    }))

    res.json({
      assets,
      total: assets.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

/**
 * GET /api/assets/:symbol/prices
 * Get historical prices for an asset
 * Query params: days (1, 7, 30, 365 - default 30)
 */
router.get('/:symbol/prices', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params
    const days = parseInt(req.query.days as string) || 30

    // Validate days parameter
    if (![1, 7, 30, 365].includes(days)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'days must be 1, 7, 30, or 365' },
      })
    }

    const { data, error } = await coinGeckoService.getHistoricalPrices(symbol, days)

    if (error) {
      return res.status(400).json({
        error: { code: 'EXTERNAL_API_ERROR', message: error },
      })
    }

    res.json({
      symbol,
      days,
      data,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

/**
 * GET /api/assets/search
 * Search for cryptocurrencies
 * Query params: q (search query)
 */
router.get('/search', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string

    if (!query || query.length < 2) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Search query must be at least 2 characters' },
      })
    }

    const { data, error } = await coinGeckoService.searchCryptocurrencies(query)

    if (error) {
      return res.status(400).json({
        error: { code: 'EXTERNAL_API_ERROR', message: error },
      })
    }

    // Format response
    const results = {
      coins: data.coins?.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol?.toUpperCase(),
        icon: coin.large,
      })) || [],
    }

    res.json(results)
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

/**
 * GET /api/assets/prices
 * Get current prices for multiple assets
 * Query params: ids (comma-separated, e.g., bitcoin,ethereum)
 */
router.get('/prices', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const ids = (req.query.ids as string)?.split(',').map(id => id.trim())

    if (!ids || ids.length === 0) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'ids parameter required (comma-separated)' },
      })
    }

    const { data, error } = await coinGeckoService.getPrices(ids)

    if (error) {
      return res.status(400).json({
        error: { code: 'EXTERNAL_API_ERROR', message: error },
      })
    }

    res.json({
      prices: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

/**
 * GET /api/assets/market
 * Get global crypto market data
 */
router.get('/market', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { data, error } = await coinGeckoService.getGlobalMarketData()

    if (error) {
      return res.status(400).json({
        error: { code: 'EXTERNAL_API_ERROR', message: error },
      })
    }

    res.json({
      marketData: {
        totalMarketCap: data.total_market_cap?.usd,
        btcDominance: data.btc_market_cap_percentage,
        total24hVolume: data.total_24h_vol?.usd,
        btcPrice: data.bitcoin_percentage_of_market_cap,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: error.message },
    })
  }
})

export default router
