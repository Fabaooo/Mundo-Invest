import { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  isLoading?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  isLoading,
  disabled,
  className = '',
  ...rest
}: Props) {
  const baseClasses = 'rounded-lg px-4 py-2 font-semibold transition-all duration-200 text-sm shadow-sm '
  const variantClasses =
    variant === 'primary'
      ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-[0_24px_70px_-30px_rgba(59,130,246,0.75)] hover:shadow-[0_30px_90px_-30px_rgba(56,189,248,0.65)] hover:-translate-y-0.5 focus:ring-2 focus:ring-sky-400/60'
      : variant === 'secondary'
      ? 'bg-white/10 text-white border border-white/15 shadow-[0_10px_24px_-12px_rgba(255,255,255,0.6)] hover:bg-white/20 focus:ring-2 focus:ring-white/20'
      : 'bg-transparent text-slate-600 hover:bg-slate-100'
  const stateClasses = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''

  return (
    <button
      className={`${baseClasses}${variantClasses} ${stateClasses} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  )
}
