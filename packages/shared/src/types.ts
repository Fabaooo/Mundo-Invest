// Types for financial assets and user data

export interface Asset {
  id: string
  symbol: string
  name: string
  type: 'CRYPTO' | 'STOCK' | 'FII' | 'ETF'
  currentPrice: number
  priceChange24h: number
  marketCap?: number
  volume24h?: number
  lastUpdated: Date
}

export interface PriceHistory {
  assetId: string
  timestamp: Date
  price: number
  volume?: number
}

export interface UserProfile {
  id: string
  email: string
  riskProfile: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
  createdAt: Date
  questionsRemaining: number
  lastQuestionResetAt: Date
}

export interface PortfolioAsset {
  assetId: string
  quantity: number
  buyPrice: number
  currentValue: number
  percentageOfPortfolio: number
}

export interface Portfolio {
  id: string
  userId: string
  assets: PortfolioAsset[]
  totalValue: number
  totalInvested: number
  gainLoss: number
  gainLossPercentage: number
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  assetContext?: string
  createdAt: Date
}

export interface AIResponse {
  message: string
  disclaimer: string
  relatedAssets?: Asset[]
  sources?: string[]
}

export interface ScreeningFilter {
  minPrice?: number
  maxPrice?: number
  minVolume?: number
  types?: Asset['type'][]
  searchTerm?: string
}

export interface DailyQuotaUsage {
  userId: string
  date: Date
  questionsUsed: number
  questionsLimit: number
}
