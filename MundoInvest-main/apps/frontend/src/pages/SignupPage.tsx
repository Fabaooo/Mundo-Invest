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
  const { setUser } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error: signupError } = await authService.signup(email, password, fullName)

    if (signupError) {
      setError(signupError)
      setIsLoading(false)
      return
    }

    const { error: loginError } = await authService.login(email, password)

    if (loginError) {
      setError('Conta criada, mas falha ao fazer login. Tente novamente.')
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

      navigate('/risk-assessment')
    } else {
      navigate('/')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-extrabold text-indigo-700 text-center">Mundo Invest</h1>
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
