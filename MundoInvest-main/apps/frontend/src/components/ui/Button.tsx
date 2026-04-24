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
  const baseClasses = 'rounded-lg px-4 py-2 font-semibold transition-all text-sm '
  const variantClasses =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
      : variant === 'secondary'
      ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
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
