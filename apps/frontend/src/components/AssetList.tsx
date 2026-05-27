import React from 'react'

interface Asset {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap?: number
  volume24h?: number
  rank?: number
  icon?: string
}

interface AssetListProps {
  assets: Asset[]
  isLoading?: boolean
  onAssetSelect?: (asset: Asset) => void
}

function formatBRL(value: number) {
  return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatCompact(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
  return num.toFixed(0)
}

export default function AssetList({ assets, isLoading, onAssetSelect }: AssetListProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="text-center text-slate-400 py-8">Carregando ativos...</div>
      </div>
    )
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="text-center text-slate-400 py-8">Nenhum ativo disponível</div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="grid grid-cols-[1fr_150px_120px_180px] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
        <div className="text-left">Ativo</div>
        <div className="text-right">Preço</div>
        <div className="text-right">24h</div>
        <div className="text-right">Market Cap</div>
      </div>

      <div className="max-h-[520px] overflow-y-auto">
        {assets.map((asset) => (
          <button
            key={asset.symbol}
            type="button"
            onClick={() => onAssetSelect?.(asset)}
            className="w-full grid grid-cols-[1fr_150px_120px_180px] gap-4 px-4 py-3 items-center border-t last:border-b hover:bg-slate-50 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-400">#{asset.rank ?? '-'}</div>
              <div>
                <div className="font-semibold text-slate-800">{asset.symbol}</div>
                <div className="text-xs text-slate-500">{asset.name}</div>
              </div>
            </div>

            <div className="text-right font-semibold text-slate-800">{formatBRL(asset.price)}</div>

            <div className={`text-right font-semibold ${asset.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              <span className="mr-1">{asset.change24h >= 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(asset.change24h).toFixed(2)}%</span>
            </div>

            <div className="text-right text-sm text-slate-500">{asset.marketCap ? formatCompact(asset.marketCap) : '-'}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
