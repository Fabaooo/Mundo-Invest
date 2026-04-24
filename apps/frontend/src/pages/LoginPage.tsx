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

  const logoFallback = '/mundo-invest-logo.png'

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <section className="auth-hero">
          <div className="auth-hero-image" aria-label="Mundo Invest login hero" role="img">
            <img
              src={logoFallback}
              alt="Logo Mundo Invest"
              className="auth-hero-image-src"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement
                target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20120%20120%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%230b1a3d%22%20/%3E%3Ctext%20x%3D%2260%22%20y%3D%2268%22%20fill%3D%22%23fff%22%20font-size%3D%2220%22%20font-family%3D%22Arial%22%20text-anchor%3D%22middle%22%3EMundo%20Invest%3C/text%3E%3C/svg%3E'
              }}
            />
            <div className="auth-hero-text">
              <h1>Mundo Invest</h1>
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
