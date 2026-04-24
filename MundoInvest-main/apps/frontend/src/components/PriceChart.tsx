import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PriceChartProps {
  symbol: string
  data: Array<{
    date: string
    price: number
    timestamp: number
  }>
  days: number
  isLoading?: boolean
}

const chartConfig = {
  colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'],
}

function PriceChart({ symbol, data, days, isLoading }: PriceChartProps) {
  if (isLoading) {
    return (
      <div style={styles.chartContainer}>
        <div style={styles.loadingText}>Carregando gráfico...</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div style={styles.chartContainer}>
        <div style={styles.emptyText}>Sem dados disponíveis</div>
      </div>
    )
  }

  const timeframeLabel = {
    1: 'Últimas 24 horas',
    7: 'Últimos 7 dias',
    30: 'Últimos 30 dias',
    365: 'Último ano',
  }[days] || `${days} dias`

  const minPrice = Math.min(...data.map((d) => d.price))
  const maxPrice = Math.max(...data.map((d) => d.price))
  const currentPrice = data[data.length - 1]?.price
  const previousPrice = data[0]?.price
  const change = previousPrice ? ((currentPrice - previousPrice) / previousPrice) * 100 : 0

  return (
    <div style={styles.chartContainer}>
      <div style={styles.chartHeader}>
        <div>
          <h3 style={styles.chartTitle}>{symbol}</h3>
          <p style={styles.chartSubtitle}>{timeframeLabel}</p>
        </div>
        <div style={styles.priceStats}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Preço Atual</span>
            <span style={styles.statValue}>${currentPrice.toFixed(2)}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Variação</span>
            <span
              style={{
                ...styles.statValue,
                color: change >= 0 ? '#10b981' : '#ef4444',
              }}
            >
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Min</span>
            <span style={styles.statValue}>${minPrice.toFixed(2)}</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Max</span>
            <span style={styles.statValue}>${maxPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            style={{ fontSize: 12, fill: '#6b7280' }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            style={{ fontSize: 12, fill: '#6b7280' }}
            tick={{ fontSize: 12 }}
            domain={['dataMin - 100', 'dataMax + 100']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value) => `$${Number(value).toFixed(2)}`}
            labelStyle={{ color: '#000' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke={chartConfig.colors[0]}
            dot={false}
            strokeWidth={2}
            name={`${symbol} (USD)`}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const styles = {
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  } as React.CSSProperties,

  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '20px',
  } as React.CSSProperties,

  chartTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    color: '#1f2937',
  } as React.CSSProperties,

  chartSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  } as React.CSSProperties,

  priceStats: {
    display: 'flex',
    gap: '16px',
    minWidth: '400px',
  } as React.CSSProperties,

  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  } as React.CSSProperties,

  statLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  statValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: '4px',
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

export default PriceChart
