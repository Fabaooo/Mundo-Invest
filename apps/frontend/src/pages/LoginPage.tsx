import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import * as authService from '../services/authService'

function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

  const togglePassword = () => setShowPassword((prev) => !prev)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error: loginError } = await authService.login(email, password)
    if (loginError) {
      setError(loginError)
      setIsLoading(false)
      return
    }

    const { data: profile, error: profileError } = await authService.getProfile()
    if (!profileError && profile) {
      setUser({
        id: profile.id,
        email: profile.email,
        fullName: profile.full_name,
        riskProfile: profile.risk_profile,
      })

      if (!profile.risk_profile) {
        navigate('/risk-assessment')
      } else {
        navigate('/dashboard')
      }
    } else {
      setError('Nao foi possivel ler o perfil. Tente novamente.')
      setIsLoading(false)
      return
    }

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
            <span className="hero-tag">Intelig&ecirc;ncia de mercado com IA</span>
            <h1>Decis&otilde;es de investimento guiadas por dados.</h1>
            <p className="hero-copy">
              Monitore risco, volatilidade e sinais de entrada em criptoativos com modelos
              anal&iacute;ticos, alertas em tempo real e leitura clara de carteira.
            </p>

            <div className="hero-actions">
              <Link to="/signup" className="hero-primary-link">Come&ccedil;ar agora</Link>
              <Link to="/#markets" className="hero-secondary-link">Ver pre&ccedil;os ao vivo</Link>
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

            <div className="trust-strip" aria-label="Sinais de confianca">
              <span>BRL e PIX preparados</span>
              <span>Dados em tempo real</span>
              <span>Seguran&ccedil;a por design</span>
            </div>

            <ul className="hero-features">
              <li>Detec&ccedil;&atilde;o de volatilidade e anomalias de pre&ccedil;o</li>
              <li>Score propriet&aacute;rio para risco, retorno e liquidez</li>
              <li>Alertas objetivos para proteger capital e capturar oportunidade</li>
            </ul>
          </div>

          <div className="preview-panel">
            <div className="preview-topbar">
              <span className="preview-chip">Carteira inteligente</span>
              <span className="preview-badge">Modelo ativo</span>
            </div>

            <div className="app-showcase" aria-label="Previa ilustrativa do aplicativo">
              <div className="phone-mockup">
                <div className="phone-speaker" />
                <img src="/mundo-invest-logo-cutout.png" alt="" className="phone-logo" />
                <div className="phone-balance">
                  <span>Patrim&ocirc;nio</span>
                  <strong>R$ 84.920</strong>
                  <small>+6,8% no m&ecirc;s</small>
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
                <small>Previs&atilde;o intraday</small>
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

            <div className="risk-meter" aria-label="Distribuicao de risco">
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
              Acompanhe posi&ccedil;&otilde;es, alertas quantitativos e recomenda&ccedil;&otilde;es em tempo real.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="form-grid">
            <label className="input-label">
              <span>Email</span>
              <div className="input-with-icon">
                <span className="input-icon" aria-hidden="true">E</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </label>

            <label className="input-label">
              <span>Senha</span>
              <div className="input-with-icon">
                <span className="input-icon" aria-hidden="true">S</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={togglePassword}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </label>

            {error && <div className="form-error">{error}</div>}

            <div className="form-meta">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Lembrar acesso
              </label>
              <Link to="/reset-password">Esqueceu a senha?</Link>
            </div>

            <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
              {isLoading ? 'Validando acesso...' : 'Entrar na plataforma'}
            </button>

            <div className="auth-socials">
              <button type="button" className="social-btn google">
                Entrar com Google
              </button>
              <button type="button" className="social-btn apple">
                Entrar com Apple
              </button>
            </div>

            <div className="form-links">
              <span>Novo por aqui?</span>
              <Link to="/signup">Criar conta de investidor</Link>
            </div>
          </form>

          <div className="auth-trust-badges" aria-label="Recursos de confianca">
            <span>2FA pronto</span>
            <span>Alertas de risco</span>
            <span>Monitoramento 24/7</span>
          </div>

          <p className="security-tip">
            Ambiente protegido para acompanhar mercado, risco e carteira com mais clareza.
          </p>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
