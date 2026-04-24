import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthGuard } from '../hooks/useAuthGuard'
import * as authService from '../services/authService'
import { getTopAssets, Asset } from '../services/assetService'

const formatCurrency = (value: number) =>
  Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(value)

const riskProfileMap: Record<string, string> = {
  CONSERVATIVE: '🛡️ Conservador: segurança primeiro',
  MODERATE: '⚖️ Moderado: risco controlado',
  AGGRESSIVE: '🚀 Agressivo: alto potencial',
}

function DashboardPage() {
  const { user } = useAuthGuard()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const topAssets = await getTopAssets(8)
        setAssets(topAssets)
      } catch (e) {
        setError('Erro ao carregar ativos. Tente novamente mais tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await authService.logout()
    navigate('/login')
  }

  const handleOpenMarket = () => {
    navigate('/market')
  }

  if (!user) {
    return <div className="page-loading">Carregando perfil...</div>
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-layout">
          <h1>🌍 Mundo Invest</h1>
          <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={handleOpenMarket}>
              📊 Ver mercado
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="card">
          <div className="card-header">
            <h2>Olá, {user.fullName || user.email}</h2>
            <span className="status-chip">
              {user.riskProfile
                ? riskProfileMap[user.riskProfile] ?? 'Perfil não definido'
                : 'Perfil de risco não definido'}
            </span>
          </div>

          <p className="subtitle">
            Bem-vindo ao seu painel de investimentos. Aqui você acompanha suas
            posições principais, performance e recomendações.
          </p>

          <div className="dashboard-metrics">
            <article className="metric-card">
              <h3>Patrimônio Projetado</h3>
              <strong>{formatCurrency(1234567.89)}</strong>
            </article>
            <article className="metric-card">
              <h3>Retorno 30d</h3>
              <strong>+ 8,4%</strong>
            </article>
            <article className="metric-card">
              <h3>Risco</h3>
              <strong>{user.riskProfile || 'N/A'}</strong>
            </article>
          </div>
        </section>

        <section className="card">
          <div className="card-header">
            <h3>Top ativos (dados simulados)</h3>
            {isLoading && <small>Carregando...</small>}
            {error && <small className="error-text">{error}</small>}
          </div>

          <div className="asset-table-wrapper">
            <table className="asset-table">
              <thead>
                <tr>
                  <th>Ativo</th>
                  <th>Preço (BRL)</th>
                  <th>Osc. 24h</th>
                  <th>Market Cap</th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={`skeleton-${idx}`}>
                        <td colSpan={4} className="skeleton-row">
                          Carregando...
                        </td>
                      </tr>
                    ))
                  : assets.map((asset) => (
                      <tr key={asset.symbol}>
                        <td>
                          <strong>{asset.name}</strong> · {asset.symbol}
                        </td>
                        <td>{formatCurrency(asset.price)}</td>
                        <td className={asset.change24h >= 0 ? 'positive' : 'negative'}>
                          {asset.change24h.toFixed(2)}%
                        </td>
                        <td>{asset.marketCap ? formatCurrency(asset.marketCap) : '-'}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card card-warning">
          <h3>Aviso de Risco</h3>
          <p>
            Este dashboard é informativo e não constitui recomendação de
            investimento. Faça sua própria pesquisa antes de investir.
          </p>
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
