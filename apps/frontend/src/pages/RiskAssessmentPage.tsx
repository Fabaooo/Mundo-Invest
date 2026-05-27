import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import * as authService from '../services/authService'
import Button from '../components/ui/Button'

interface Question {
  id: string
  question: string
  options: {
    text: string
    value: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'
    points: number
  }[]
}

const RISK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: 'Qual é seu horizonte de investimento?',
    options: [
      { text: 'Curto prazo (menos de 1 ano)', value: 'CONSERVATIVE', points: 1 },
      { text: 'Médio prazo (1-5 anos)', value: 'MODERATE', points: 2 },
      { text: 'Longo prazo (mais de 5 anos)', value: 'AGGRESSIVE', points: 3 },
    ],
  },
  {
    id: 'q2',
    question: 'Como você reagiria se seus investimentos caíssem 20% em um mês?',
    options: [
      { text: 'Venderia tudo para evitar maiores perdas', value: 'CONSERVATIVE', points: 1 },
      { text: 'Manteria e monitoraria a situação', value: 'MODERATE', points: 2 },
      { text: 'Compraria mais aproveitar o preço baixo', value: 'AGGRESSIVE', points: 3 },
    ],
  },
  {
    id: 'q3',
    question: 'Qual é seu nível de experiência com investimentos?',
    options: [
      { text: 'Sou iniciante/sem experiência', value: 'CONSERVATIVE', points: 1 },
      { text: 'Tenho experiência moderada', value: 'MODERATE', points: 2 },
      { text: 'Sou muito experiente', value: 'AGGRESSIVE', points: 3 },
    ],
  },
  {
    id: 'q4',
    question: 'Qual percentual do seu patrimônio você alocaria em investimentos arriscados?',
    options: [
      { text: 'Menos de 10%', value: 'CONSERVATIVE', points: 1 },
      { text: '10-40%', value: 'MODERATE', points: 2 },
      { text: 'Mais de 40%', value: 'AGGRESSIVE', points: 3 },
    ],
  },
  {
    id: 'q5',
    question: 'Como você prefere diversificar seus investimentos?',
    options: [
      { text: 'Somente ativos seguros (renda fixa)', value: 'CONSERVATIVE', points: 1 },
      { text: 'Mix balanceado entre segurança e crescimento', value: 'MODERATE', points: 2 },
      { text: 'Foco em ativos com alto potencial de crescimento', value: 'AGGRESSIVE', points: 3 },
    ],
  },
]

const riskProfileLabels: Record<string, string> = {
  CONSERVATIVE: 'Conservador',
  MODERATE: 'Moderado',
  AGGRESSIVE: 'Agressivo',
}

function calculateRiskProfile(answers: Record<string, 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'>) {
  const scores = {
    CONSERVATIVE: 0,
    MODERATE: 0,
    AGGRESSIVE: 0,
  }

  Object.values(answers).forEach((answer) => {
    scores[answer]++
  })

  if (scores.AGGRESSIVE > scores.MODERATE && scores.AGGRESSIVE > scores.CONSERVATIVE) {
    return 'AGGRESSIVE'
  }

  if (scores.MODERATE > scores.CONSERVATIVE) {
    return 'MODERATE'
  }

  return 'CONSERVATIVE'
}

function RiskAssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'>>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)

  const currentQuestion = RISK_QUESTIONS[currentQuestionIndex]
  const selectedAnswer = answers[currentQuestion.id]
  const progress = ((currentQuestionIndex + 1) / RISK_QUESTIONS.length) * 100

  const finalRiskProfile = useMemo(
    () => calculateRiskProfile(answers),
    [answers],
  )

  const handleAnswer = (value: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE') => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = () => {
    if (!selectedAnswer) {
      return
    }
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, RISK_QUESTIONS.length - 1))
  }

  const handleSubmit = async () => {
    if (!user) {
      return
    }

    setIsLoading(true)
    setError(null)

    const profile = calculateRiskProfile(answers)
    const { error: updateError } = await authService.updateProfile({
      risk_profile: profile,
    })

    if (updateError) {
      setError('Falha ao salvar seu perfil. Tente novamente.')
      setIsLoading(false)
      return
    }

    setUser({ ...user, riskProfile: profile })
    navigate('/dashboard')
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-slate-200">
        <div className="mb-8 flex flex-col gap-3 text-center">
          <img
            src="/mundo-invest-logo-cutout.png"
            alt="Mundo Invest"
            className="mx-auto h-24 w-auto rounded-2xl object-contain"
          />
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Avaliação de risco</p>
          <h1 className="text-3xl font-semibold text-slate-900">Responda algumas perguntas</h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600">
            Suas respostas ajudam a personalizar recomendações e a definir seu perfil de risco.
          </p>
        </div>

        <div className="mb-6 rounded-3xl bg-slate-100 p-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-slate-600">Pergunta {currentQuestionIndex + 1} de {RISK_QUESTIONS.length}</p>
        </div>

        <article className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">{currentQuestion.question}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-1">
              {currentQuestion.options.map((option) => {
                const active = selectedAnswer === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAnswer(option.value)}
                    className={`rounded-3xl border p-4 text-left transition-shadow ${
                      active
                        ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm font-semibold text-slate-900">{option.text}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestionIndex === 0}
            >
              Voltar
            </Button>
            {currentQuestionIndex === RISK_QUESTIONS.length - 1 ? (
              <Button
                className="w-full sm:w-auto"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={isLoading || !selectedAnswer}
              >
                Finalizar
              </Button>
            ) : (
              <Button
                className="w-full sm:w-auto"
                variant="secondary"
                onClick={handleNext}
                disabled={!selectedAnswer}
              >
                Próximo
              </Button>
            )}
          </div>

          <div className="rounded-3xl bg-slate-100 p-4 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Status atual:</p>
            <p>Perfil previsto: <strong>{riskProfileLabels[finalRiskProfile]}</strong></p>
            <p>Respostas selecionadas: {Object.keys(answers).length} de {RISK_QUESTIONS.length}</p>
          </div>
        </article>
      </div>
    </div>
  )
}

export default RiskAssessmentPage
