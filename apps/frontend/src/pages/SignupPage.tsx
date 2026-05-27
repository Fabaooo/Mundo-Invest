import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import * as authService from '../services/authService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function SignupPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)
  const setTokens = useAuthStore((state) => state.setTokens)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const signupResult = await authService.signup(email, password, fullName)
    if (signupResult.error) {
      setError(signupResult.error)
      setIsLoading(false)
      return
    }

    const loginResult = await authService.login(email, password)
    if (loginResult.error || !loginResult.data) {
      setError('Conta criada, mas falha ao fazer login. Tente novamente.')
      setIsLoading(false)
      return
    }

    const { user, session } = loginResult.data
    setTokens(session.access_token, session.refresh_token)

    setUser({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      riskProfile: user.risk_profile,
    })

    navigate(user.risk_profile ? '/dashboard' : '/risk-assessment')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <img
          src="/mundo-invest-logo-cutout.png"
          alt="Mundo Invest"
          className="mx-auto h-28 w-auto rounded-2xl object-contain shadow-lg"
        />
        <p className="text-center text-slate-500 mt-2 mb-6">Crie sua conta</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Nome Completo"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Seu nome completo"
            required
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />

          {error ? <div className="rounded-md bg-red-50 text-red-700 p-2 text-sm">{error}</div> : null}

          <Button type="submit" isLoading={isLoading} className="w-full" disabled={isLoading}>
            Criar Conta
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-4">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Fazer login
          </Link>
        </p>
      </section>
    </div>
  )
}

export default SignupPage
