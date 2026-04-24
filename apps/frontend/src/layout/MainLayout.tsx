import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-slate-100">
      <header className="backdrop-blur-md border-b border-white/10 bg-white/10">
        <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-2xl font-extrabold tracking-wide text-white drop-shadow-lg"
          >
            Mundo Invest
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-200">{user?.fullName || user?.email || 'Usuário'}</span>
            <Button variant="secondary" className="px-3 py-1.5" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="app-shell mx-auto flex w-full max-w-7xl gap-6 px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <aside className="main-sidebar hidden w-72 flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur md:flex">
          <span className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Navegação</span>
          <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-white/20" onClick={() => navigate('/')}>Dashboard</button>
          <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-white/20" onClick={() => navigate('/market')}>Mercado</button>
          <button className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-white/20" onClick={() => navigate('/risk-assessment')}>Avaliação de Risco</button>
        </aside>

        <main className="main-content flex-1">{children}</main>
      </div>
    </div>
  )
}
