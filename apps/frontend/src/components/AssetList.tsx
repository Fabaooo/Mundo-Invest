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
  isSelecting?: boolean
}

function AssetList({ assets, isLoading, onAssetSelect }: AssetListProps) {
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Carregando ativos...</div>
      </div>
    )
  }

  if (!assets || assets.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyText}>Nenhum ativo disponível</div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerItem}>Ativo</div>
        <div style={styles.headerItem}>Preço</div>
        <div style={styles.headerItem}>24h</div>
        <div style={styles.headerItem}>Market Cap</div>
      </div>

      <div style={styles.list}>
        {assets.map((asset) => (
          <div
            key={asset.symbol}
            style={{
              ...styles.itemContainer,
              cursor: onAssetSelect ? 'pointer' : 'default',
              opacity: onAssetSelect ? 0.9 : 1,
            }}
            onClick={() => onAssetSelect?.(asset)}
            onMouseEnter={(e) => {
              if (onAssetSelect) {
                e.currentTarget.style.backgroundColor = '#f3f4f6'
              }
            }}
            onMouseLeave={(e) => {
              if (onAssetSelect) {
                e.currentTarget.style.backgroundColor = '#ffffff'
              }
            }}
          >
            <div style={styles.assetInfo}>
              <div style={styles.assetRank}>#{asset.rank || '-'}</div>
              <div style={styles.assetSymbol}>{asset.symbol}</div>
              <div style={styles.assetName}>{asset.name}</div>
            </div>

            <div style={styles.price}>${asset.price.toFixed(2)}</div>

            <div
              style={{
                ...styles.change,
                color: asset.change24h >= 0 ? '#10b981' : '#ef4444',
              }}
            >
              <span>{asset.change24h >= 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(asset.change24h).toFixed(2)}%</span>
            </div>

            <div style={styles.marketCap}>
              {asset.marketCap ? `$${formatNumber(asset.marketCap)}` : '-'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
  return num.toFixed(0)
}

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  } as React.CSSProperties,

  header: {
    display: 'grid',
    gridTemplateColumns: '1fr 120px 100px 150px',
    gap: '16px',
    padding: '16px 20px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  headerItem: {
    textAlign: 'right',
  } as React.CSSProperties,

  list: {
    maxHeight: '600px',
    overflowY: 'auto',
  } as React.CSSProperties,

  itemContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 120px 100px 150px',
    gap: '16px',
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  assetInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,

  assetRank: {
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: 'bold',
    minWidth: '30px',
  } as React.CSSProperties,

  assetSymbol: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1f2937',
  } as React.CSSProperties,

  assetName: {
    fontSize: '12px',
    color: '#9ca3af',
  } as React.CSSProperties,

  price: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right' as const,
  },

  change: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    textAlign: 'right' as const,
  } as React.CSSProperties,

  marketCap: {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: 'right' as const,
  } as React.CSSProperties,

  loadingText: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#9ca3af',
    fontSize: '16px',
  },

  emptyText: {
    textAlign: 'center' as const,
    padding: '40px',
    color: '#9ca3af',
    fontSize: '16px',
  },
}

export default AssetList
