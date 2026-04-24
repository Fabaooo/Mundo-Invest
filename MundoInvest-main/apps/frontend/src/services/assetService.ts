import api from './api'

export interface Asset {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap?: number
  volume24h?: number
  rank?: number
  icon?: string
}

export interface PriceHistoryPoint {
  timestamp: number
  price: number
  date: string
}

export async function getTopAssets(limit = 20) {
  const response = await api.get('/assets/top', {
    params: { limit },
  })

  return response.data?.assets as Asset[]
}

export async function getAssetPriceHistory(symbol: string, days = 30) {
  const response = await api.get(`/assets/${symbol}/prices`, {
    params: { days },
  })

  const incoming = (response.data?.data?.prices ?? []) as Array<{ timestamp: number; price: number }>

  return incoming.map((point) => ({
    ...point,
    date: new Date(point.timestamp * 1000).toLocaleDateString('pt-BR'),
  }))
}
