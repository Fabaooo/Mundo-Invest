import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import * as authService from '../services/authService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const setTokens = useAuthStore((state) => state.setTokens)

  const togglePassword = () => setShowPassword((prev) => !prev)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const loginResult = await authService.login(email, password)
    if (loginResult.error || !loginResult.data) {
      setError(loginResult.error || 'Falha ao efetuar login.')
      setIsLoading(false)
      return
    }

    const { user, session } = loginResult.data
    setTokens(session.access_token, session.refresh_token)

    const profileResult = await authService.getProfile()
    if (profileResult.error || !profileResult.data) {
      setError('Não foi possível carregar o perfil. Tente novamente.')
      setIsLoading(false)
      return
    }

    const profile = profileResult.data
    setUser({
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      riskProfile: profile.risk_profile,
    })

    navigate(profile.risk_profile ? '/dashboard' : '/risk-assessment')
    setIsLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <header className="auth-topbar">
          <Link to="/" className="auth-brand-mark" aria-label="Mundo Invest">
            <img src="/mundo-invest-logo-cutout.png" alt="Mundo Invest" />
          </Link>

          <nav className="auth-nav" aria-label="Recursos principais">
            <Link to="/#markets">Mercado</Link>
            <Link to="/dashboard">Carteira</Link>
            <Link to="/risk-assessment">Risco</Link>
          </nav>

          <Link to="/signup" className="auth-topbar-cta">Criar conta</Link>
        </header>

        <section className="auth-hero">
          <div className="hero-headline">
            <span className="hero-tag">Inteligência de mercado com IA</span>
            <h1>Decisões de investimento guiadas por dados.</h1>
            <p className="hero-copy">
              Monitore risco, volatilidade e sinais de entrada em criptoativos com modelos
              analíticos, alertas em tempo real e leitura clara de carteira.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="hero-primary-link">Começar agora</Link>
              <Link to="/#markets" className="hero-secondary-link">Ver preços ao vivo</Link>
            </div>

            <div className="hero-kpis" aria-label="Indicadores da plataforma">
              <div>
                <strong>+50</strong>
                <span>ativos monitorados</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>leituras de mercado</span>
              </div>
              <div>
                <strong>IA</strong>
                <span>score de risco</span>
              </div>
            </div>

            <div className="trust-strip" aria-label="Sinais de confiança">
              <span>BRL e PIX preparados</span>
              <span>Dados em tempo real</span>
              <span>Segurança por design</span>
            </div>

            <ul className="hero-features">
              <li>Detecção de volatilidade e anomalias de preço</li>
              <li>Score proprietário para risco, retorno e liquidez</li>
              <li>Alertas objetivos para proteger capital e capturar oportunidade</li>
            </ul>
          </div>

          <div className="preview-panel">
            <div className="preview-topbar">
              <span className="preview-chip">Carteira inteligente</span>
              <span className="preview-badge">Modelo ativo</span>
            </div>

            <div className="app-showcase" aria-label="Prévia ilustrativa do aplicativo">
              <div className="phone-mockup">
                <div className="phone-speaker" />
                <img src="/mundo-invest-logo-cutout.png" alt="" className="phone-logo" />
                <div className="phone-balance">
                  <span>Patrimônio</span>
                  <strong>R$ 84.920</strong>
                  <small>+6,8% no mês</small>
                </div>
                <div className="phone-bars">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="asset-card-stack">
                <div className="asset-card-card active">
                  <span>BTC</span>
                  <strong>R$ 532.410</strong>
                  <small>+2,4%</small>
                </div>
                <div className="asset-card-card">
                  <span>ETH</span>
                  <strong>R$ 18.290</strong>
                  <small>+1,1%</small>
                </div>
              </div>
            </div>

            <div className="preview-title">
              <div>
                <strong>BTC / BRL</strong>
                <small>Previsão intraday</small>
              </div>
              <span>+12,4% hoje</span>
            </div>

            <div className="preview-chart">
              <div className="preview-grid" />
              <div className="preview-confidence confidence-low" />
              <div className="preview-confidence confidence-high" />
              <div className="preview-line" />
              <div className="preview-point" />
            </div>

            <div className="preview-stats">
              <div className="preview-stat">
                <span>R$ 1,27M</span>
                <small>valor monitorado</small>
              </div>
              <div className="preview-stat positive-stat">
                <span>8,2%</span>
                <small>retorno ajustado</small>
              </div>
              <div className="preview-stat risk-stat">
                <span>0,41</span>
                <small>drawdown risk</small>
              </div>
            </div>

            <div className="risk-meter" aria-label="Distribuição de risco">
              <div className="risk-meter-header">
                <span>Score de risco da carteira</span>
                <strong>Moderado</strong>
              </div>
              <div className="risk-meter-track">
                <span className="risk-meter-fill" />
              </div>
            </div>

            <div className="preview-footer">
              <div className="preview-card-mini">
                <strong>VaR 95%</strong>
                <span>-3,8% em 24h</span>
              </div>
              <div className="preview-card-mini">
                <strong>Liquidez</strong>
                <span>Alta nos top pares</span>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-form-card">
          <header className="auth-form-header">
            <p className="auth-form-badge">Acesso seguro</p>
            <h2>Entre no painel</h2>
            <p className="auth-form-copy">
              Acompanhe posições, alertas quantitativos e recomendações em tempo real.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="form-grid">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  minLength={8}
                  required
                  className="pr-24"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-200"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {error && <div className="rounded-md bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

            <Button type="submit" isLoading={isLoading} className="w-full">
              Entrar
            </Button>

            <p className="text-center text-sm text-slate-500">
              Não tem conta?{' '}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Criar conta
              </Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  )
}

export default LoginPage

