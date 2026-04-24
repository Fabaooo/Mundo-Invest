import React from 'react'
import { useAuthGuard } from '../hooks/useAuthGuard'
import PriceChart from '../components/PriceChart'
import AssetList from '../components/AssetList'
import Button from '../components/ui/Button'
import { useMarketData } from '../hooks/useMarketData'

function MarketDataPage() {
  const { user } = useAuthGuard()
  const {
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
  } = useMarketData()

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">📊 Mercado de Criptomoedas</h1>
            <p className="text-sm text-slate-500">
              Bem-vindo, <strong>{user?.fullName ?? 'investidor'}</strong>! Explore os ativos em tempo real.
            </p>
          </div>
          <Button onClick={refresh} className="px-4 py-2" variant="secondary">
            🔄 Atualizar
          </Button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {selectedAsset ? (
          <section className="mb-6 rounded-xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-800">{selectedAsset.name} ({selectedAsset.symbol.toUpperCase()})</h2>
              <div className="flex gap-2">
                {[1, 7, 30, 365].map((days) => (
                  <Button
                    key={days}
                    variant={timeframe === days ? 'primary' : 'secondary'}
                    onClick={() => setTimeframe(days)}
                  >
                    {days === 1 ? '1D' : days === 7 ? '1W' : days === 30 ? '1M' : '1Y'}
                  </Button>
                ))}
              </div>
            </div>

            <PriceChart symbol={selectedAsset.symbol} data={priceHistory} days={timeframe} isLoading={isLoadingChart} />
          </section>
        ) : (
          <div className="mb-6 rounded-xl bg-white p-6 text-sm text-slate-500">Nenhum ativo selecionado.</div>
        )}

        <section className="rounded-xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold text-slate-800">🏆 Principais Ativos</h2>
          <AssetList
            assets={assets}
            isLoading={isLoadingAssets}
            onAssetSelect={setSelectedAsset}
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-sm text-indigo-700">💡 Dica</h3>
            <p className="mt-2 text-sm text-slate-600">Selecione um ativo para ver o gráfico de preços históricos com diferentes períodos.</p>
          </article>
          <article className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-sm text-amber-600">⚠️ Disclaimer</h3>
            <p className="mt-2 text-sm text-slate-600">Os dados são informativos, não recomendação de investimento.</p>
          </article>
          <article className="rounded-xl bg-white p-4 shadow-sm">
            <h3 className="font-semibold text-sm text-emerald-600">📈 Próximos Passos</h3>
            <p className="mt-2 text-sm text-slate-600">Em breve: simulação de ordens e portfólio real via API persistente.</p>
          </article>
        </section>
      </div>
    </div>
  )
}

export default MarketDataPage
