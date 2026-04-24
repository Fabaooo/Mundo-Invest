// Shared utilities and helper functions

export function formatCurrency(value: number, locale = 'pt-BR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPercentage(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function calculateReturn(invested: number, current: number): number {
  return (current - invested) / invested
}

export function calculateGainLoss(invested: number, current: number): number {
  return current - invested
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function getAssetIcon(assetType: string): string {
  const icons: Record<string, string> = {
    CRYPTO: '₿',
    STOCK: '📈',
    FII: '🏢',
    ETF: '📊',
  }
  return icons[assetType] || '💹'
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength - 3) + '...'
}
