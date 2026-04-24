/**
 * CoinGecko API Service
 * Integrates with CoinGecko free API for cryptocurrency data
 * https://www.coingecko.com/api/docs/v3
 */

import axios from 'axios'

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

// Cache for API responses (in-memory)
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const cache = new Map<string, CacheEntry<any>>()

/**
 * Get data from cache if still valid
 */
function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null

  const now = Date.now()
  if (now - entry.timestamp > entry.ttl) {
    cache.delete(key)
    return null
  }

  return entry.data
}

/**
 * Store data in cache
 */
function setCache<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  })
}

/**
 * Get list of cryptocurrencies with basic info
 * Used to populate the assets in the database
 */
export async function getCryptocurrencies(perPage: number = 50, page: number = 1) {
  try {
    const cacheKey = `cryptocurrencies_${page}_${perPage}`
    const cached = getCached(cacheKey)
    if (cached) {
      console.log(`📦 Cache HIT: cryptocurrencies`)
      return { data: cached, error: null }
    }

    console.log(`🌐 Fetching cryptocurrencies from CoinGecko...`)
    const response = await axios.get(`${COINGECKO_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: false,
      },
      timeout: 10000,
    })

    setCache(cacheKey, response.data, 30 * 60 * 1000) // Cache for 30 minutes

    return { data: response.data, error: null }
  } catch (error: any) {
    console.error(`❌ Error fetching cryptocurrencies:`, error.message)
    return { data: null, error: error.message }
  }
}

/**
 * Get current price of cryptocurrencies
 */
export async function getPrices(ids: string[]) {
  try {
    const cacheKey = `prices_${ids.join(',')}`
    const cached = getCached(cacheKey)
    if (cached) {
      console.log(`📦 Cache HIT: prices`)
      return { data: cached, error: null }
    }

    console.log(`🌐 Fetching prices for ${ids.length} assets...`)
    const response = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
      params: {
        ids: ids.join(','),
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_vol: true,
        include_24hr_change: true,
        include_last_updated_at: true,
      },
      timeout: 10000,
    })

    setCache(cacheKey, response.data, 1 * 60 * 1000) // Cache for 1 minute (price updates frequently)

    return { data: response.data, error: null }
  } catch (error: any) {
    console.error(`❌ Error fetching prices:`, error.message)
    return { data: null, error: error.message }
  }
}

/**
 * Get historical prices for a cryptocurrency
 * timeframe: '1' | '7' | '30' | '365'
 */
export async function getHistoricalPrices(
  assetSymbol: string,
  timeframeInDays: number = 30
) {
  try {
    // Map common symbols to CoinGecko IDs
    const symbolToCoinGeckoId: Record<string, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      ADA: 'cardano',
      SOL: 'solana',
      DOGE: 'dogecoin',
      XRP: 'ripple',
      IBOV: 'ibovespa', // This won't work - need Yahoo Finance for this
    }

    const coinId = symbolToCoinGeckoId[assetSymbol.toUpperCase()]
    if (!coinId) {
      throw new Error(`Unknown cryptocurrency: ${assetSymbol}`)
    }

    const cacheKey = `historical_${coinId}_${timeframeInDays}`
    const cached = getCached(cacheKey)
    if (cached) {
      console.log(`📦 Cache HIT: historical prices for ${coinId}`)
      return { data: cached, error: null }
    }

    console.log(`🌐 Fetching ${timeframeInDays}d price history for ${coinId}...`)
    const response = await axios.get(
      `${COINGECKO_BASE_URL}/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: 'usd',
          days: timeframeInDays,
          interval: 'daily',
        },
        timeout: 10000,
      }
    )

    // Format response with timestamps and prices
    const formattedData = {
      symbol: assetSymbol,
      timeframeInDays,
      prices: response.data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        date: new Date(timestamp).toISOString().split('T')[0],
        price,
      })),
      marketCaps: response.data.market_caps?.map(([timestamp, cap]: [number, number]) => ({
        timestamp,
        marketCap: cap,
      })) || [],
      volumes: response.data.volumes?.map(([timestamp, volume]: [number, number]) => ({
        timestamp,
        volume,
      })) || [],
    }

    // Cache for longer period since historical data doesn't change
    setCache(cacheKey, formattedData, 24 * 60 * 60 * 1000) // 24 hours

    return { data: formattedData, error: null }
  } catch (error: any) {
    console.error(`❌ Error fetching historical prices:`, error.message)
    return { data: null, error: error.message }
  }
}

/**
 * Search for cryptocurrencies by query
 */
export async function searchCryptocurrencies(query: string) {
  try {
    const cacheKey = `search_${query.toLowerCase()}`
    const cached = getCached(cacheKey)
    if (cached) {
      console.log(`📦 Cache HIT: search for "${query}"`)
      return { data: cached, error: null }
    }

    console.log(`🌐 Searching for "${query}"...`)
    const response = await axios.get(`${COINGECKO_BASE_URL}/search`, {
      params: {
        query,
      },
      timeout: 10000,
    })

    setCache(cacheKey, response.data, 60 * 60 * 1000) // Cache for 1 hour

    return { data: response.data, error: null }
  } catch (error: any) {
    console.error(`❌ Error searching cryptocurrencies:`, error.message)
    return { data: null, error: error.message }
  }
}

/**
 * Get global cryptocurrency market data
 */
export async function getGlobalMarketData() {
  try {
    const cacheKey = 'global_market_data'
    const cached = getCached(cacheKey)
    if (cached) {
      console.log(`📦 Cache HIT: global market data`)
      return { data: cached, error: null }
    }

    console.log(`🌐 Fetching global market data...`)
    const response = await axios.get(`${COINGECKO_BASE_URL}/global`, {
      timeout: 10000,
    })

    setCache(cacheKey, response.data.data, 5 * 60 * 1000) // Cache for 5 minutes

    return { data: response.data.data, error: null }
  } catch (error: any) {
    console.error(`❌ Error fetching global market data:`, error.message)
    return { data: null, error: error.message }
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const stats = {
    entries: cache.size,
    keys: Array.from(cache.keys()),
  }
  return stats
}

/**
 * Clear cache
 */
export function clearCache() {
  cache.clear()
  console.log('🗑️ Cache cleared')
}
