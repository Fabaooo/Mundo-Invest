import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthGuard } from '../hooks/useAuthGuard'
import * as authService from '../services/authService'
import { getTopAssets, Asset } from '../services/assetService'
import AssetList from '../components/AssetList'
import Button from '../components/ui/Button'

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
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-700">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white/80 p-8 shadow-lg">
          Carregando perfil...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Olá, {user.fullName || user.email}</h1>
              <p className="mt-2 text-sm text-slate-500">
                Bem-vindo ao seu painel. Acompanhe as métricas mais importantes e acesse o mercado.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="ghost" onClick={handleOpenMarket}>
                📊 Ver mercado
              </Button>
              <Button variant="secondary" onClick={handleLogout} isLoading={isLoggingOut}>
                {isLoggingOut ? 'Saindo...' : 'Sair'}
              </Button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-6">
            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Seu perfil de risco</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {user.riskProfile
                      ? riskProfileMap[user.riskProfile] ?? 'Perfil não definido'
                      : 'Perfil de risco não definido'}
                  </p>
                </div>
                <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                  {user.riskProfile || 'N/A'}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Patrimônio projetado</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{formatCurrency(1234567.89)}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Retorno 30d</p>
                  <p className="mt-3 text-2xl font-semibold text-emerald-600">+8,4%</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Risco</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{user.riskProfile || 'N/A'}</p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Top ativos</h3>
                  <p className="mt-1 text-sm text-slate-500">Dados simulados para referência rápida.</p>
                </div>
                {isLoading && <span className="text-sm text-slate-500">Carregando...</span>}
              </div>

              {error && (
                <div className="mt-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
                  {error}
                </div>
              )}

              <div className="mt-6">
                <AssetList assets={assets} isLoading={isLoading} />
              </div>
            </article>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Aviso de Risco</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Este dashboard é informativo e não constitui recomendação de investimento. Faça sua própria pesquisa antes de investir.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Próximos passos</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Conectar carteira real</li>
                <li>• Simular ordens</li>
                <li>• Relatórios de desempenho</li>
              </ul>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default DashboardPage
