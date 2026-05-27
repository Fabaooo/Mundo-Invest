import { useNavigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Button from '../components/ui/Button'

export default function MainLayout() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-slate-100">
      <div className="ambient-layer pointer-events-none" aria-hidden="true" />
      <header className="relative z-10 backdrop-blur-md border-b border-white/10 bg-white/10">
        <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 p-0 text-2xl font-extrabold tracking-wide text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          >
            <img src="/mundo-invest-logo-cutout.png" alt="Logo Mundo Invest" className="h-12 w-auto rounded-xl object-contain" />
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-200">{user?.fullName || user?.email || 'Usuário'}</span>
            <Button variant="secondary" className="px-3 py-1.5" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="app-shell relative z-10 mx-auto flex w-full max-w-7xl gap-6 px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <aside className="main-sidebar hidden w-72 flex-col gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 shadow-[0_35px_80px_-40px_rgba(0,0,0,0.6)] backdrop-blur-md md:flex">
          <span className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">Navegação</span>
          <Button variant="ghost" className="justify-start w-full text-left px-3 py-2" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button variant="ghost" className="justify-start w-full text-left px-3 py-2" onClick={() => navigate('/market')}>Mercado</Button>
          <Button variant="ghost" className="justify-start w-full text-left px-3 py-2" onClick={() => navigate('/risk-assessment')}>Avaliação de Risco</Button>
        </aside>

        <main className="main-content flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
