import { useEffect, useState } from 'react'
import { Asset, PriceHistoryPoint, getTopAssets, getAssetPriceHistory } from '../services/assetService'

export function useMarketData() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([])
  const [timeframe, setTimeframe] = useState(30)
  const [isLoadingAssets, setIsLoadingAssets] = useState(true)
  const [isLoadingChart, setIsLoadingChart] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadTopAssets = async () => {
    setIsLoadingAssets(true)
    setError(null)
    try {
      const data = await getTopAssets()
      setAssets(data)
      if (data.length > 0) {
        setSelectedAsset((prev) => prev || data[0])
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar ativos')
    } finally {
      setIsLoadingAssets(false)
    }
  }

  const loadPriceHistory = async (symbol: string, days: number) => {
    setIsLoadingChart(true)
    setError(null)
    try {
      const data = await getAssetPriceHistory(symbol, days)
      setPriceHistory(data)
    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar histórico de preços')
    } finally {
      setIsLoadingChart(false)
    }
  }

  useEffect(() => {
    loadTopAssets()
  }, [])

  useEffect(() => {
    if (selectedAsset) {
      loadPriceHistory(selectedAsset.symbol, timeframe)
    }
  }, [selectedAsset, timeframe])

  const refresh = () => {
    loadTopAssets()
    if (selectedAsset) {
      loadPriceHistory(selectedAsset.symbol, timeframe)
    }
  }

  return {
    assets,
    selectedAsset,
    setSelectedAsset,
    priceHistory,
    timeframe,
    setTimeframe,
    isLoadingAssets,
    isLoadingChart,
    error,
    refresh,
  }
}
