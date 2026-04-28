import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import * as authService from '../services/authService'

function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuthStore()

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
        navigate('/')
      }
    } else {
      setError('Não foi possível ler o perfil. Tente novamente.')
      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <section className="auth-hero">
          <div className="auth-hero-image" aria-label="Mundo Invest login hero" role="img">
            <div className="auth-brand">
              <img
                src="/crypto-logo.svg"
                alt="Logo Mundo Invest"
                className="auth-brand-icon"
              />
              <h1>Mundo Invest</h1>
            </div>
            <div className="auth-hero-text">
              <p>A plataforma de trading e gestão de cripto mais segura do Brasil</p>
            </div>
          </div>

          <p className="hero-tagline">A próxima geração de gerenciamento de carteira cripto</p>
          <ul>
            <li>Dados em tempo real das 50 maiores criptomoedas</li>
            <li>Painel de risco com recomendações</li>
            <li>Autenticação segura com tokens e dois fatores</li>
          </ul>
        </section>

        <section className="auth-form-card">
          <header>
            <h2>Entrar</h2>
            <p>Faça login na sua conta para acessar o painel.</p>
          </header>

          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </label>

            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>

            <div className="form-links">
              <Link to="/reset-password">Esqueceu a senha?</Link>
              <Link to="/signup">Criar conta</Link>
            </div>
          </form>

          <p className="security-tip">Dica de segurança: Nunca compartilhe sua senha e ative a autenticação em dois fatores.</p>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
