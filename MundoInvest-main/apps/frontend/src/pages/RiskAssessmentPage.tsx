import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import * as authService from '../services/authService'

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

function RiskAssessmentPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE'>>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()

  const currentQuestion = RISK_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / RISK_QUESTIONS.length) * 100

  const handleAnswer = (value: 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE') => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))

    if (currentQuestionIndex < RISK_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    // Calculate final risk profile
    const scores = {
      CONSERVATIVE: 0,
      MODERATE: 0,
      AGGRESSIVE: 0,
    }

    Object.values(answers).forEach((answer) => {
      scores[answer]++
    })

    const finalProfile = 
      scores.AGGRESSIVE > scores.MODERATE && scores.AGGRESSIVE > scores.CONSERVATIVE
        ? 'AGGRESSIVE'
        : scores.MODERATE > scores.CONSERVATIVE
        ? 'MODERATE'
        : 'CONSERVATIVE'

    // Save to backend
    const { error } = await authService.updateProfile({
      risk_profile: finalProfile,
    })

    if (error) {
      console.error('Error saving profile:', error)
      setIsLoading(false)
      return
    }

    // Update store
    if (user) {
      setUser({ ...user, riskProfile: finalProfile })
    }

    // Redirect to dashboard
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>🌍 Mundo Invest</h1>
          <p style={styles.subtitle}>Questões sobre Perfil de Risco</p>
        </div>

        {/* Progress bar */}
        <div style={styles.progressContainer}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`,
            }}
          />
          <p style={styles.progressText}>
            Pergunta {currentQuestionIndex + 1} de {RISK_QUESTIONS.length}
          </p>
        </div>

        {/* Question */}
        <div style={styles.questionContainer}>
          <h2 style={styles.questionText}>{currentQuestion.question}</h2>

          <div style={styles.optionsContainer}>
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                style={{
                  ...styles.optionButton,
                  backgroundColor:
                    answers[currentQuestion.id] === option.value
                      ? '#4f46e5'
                      : '#e5e7eb',
                  color:
                    answers[currentQuestion.id] === option.value
                      ? 'white'
                      : '#1f2937',
                  borderColor:
                    answers[currentQuestion.id] === option.value
                      ? '#4f46e5'
                      : '#d1d5db',
                }}
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom buttons */}
        <div style={styles.buttonContainer}>
          <button
            onClick={() =>
              setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
            }
            disabled={currentQuestionIndex === 0}
            style={{
              ...styles.secondaryButton,
              opacity: currentQuestionIndex === 0 ? 0.5 : 1,
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Voltar
          </button>

          {currentQuestionIndex === RISK_QUESTIONS.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !answers[currentQuestion.id]}
              style={{
                ...styles.primaryButton,
                opacity:
                  isLoading || !answers[currentQuestion.id] ? 0.5 : 1,
                cursor:
                  isLoading || !answers[currentQuestion.id]
                    ? 'not-allowed'
                    : 'pointer',
              }}
            >
              {isLoading ? 'Salvando...' : 'Finalizar'}
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(prev + 1, RISK_QUESTIONS.length - 1)
                )
              }
              disabled={!answers[currentQuestion.id]}
              style={{
                ...styles.primaryButton,
                opacity: !answers[currentQuestion.id] ? 0.5 : 1,
                cursor: !answers[currentQuestion.id]
                  ? 'not-allowed'
                  : 'pointer',
              }}
            >
              Próximo
            </button>
          )}
        </div>

        <p style={styles.disclaimer}>
          ⚠️ Suas respostas ajudam a personalizar suas recomendações educativas.
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    fontFamily: 'sans-serif',
    padding: '1rem',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '600px',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4f46e5',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: '#666',
    margin: 0,
    fontSize: '0.875rem',
  },
  progressContainer: {
    marginBottom: '2rem',
  },
  progressBar: {
    height: '4px',
    backgroundColor: '#4f46e5',
    borderRadius: '2px',
    marginBottom: '0.5rem',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '0.875rem',
    color: '#666',
    margin: 0,
  },
  questionContainer: {
    marginBottom: '2rem',
  },
  questionText: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem',
    margin: '0 0 1.5rem 0',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  optionButton: {
    padding: '1rem',
    border: '2px solid',
    borderRadius: '6px',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left' as const,
    fontWeight: '500' as const,
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  },
  primaryButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '600' as const,
    cursor: 'pointer',
  },
  secondaryButton: {
    flex: 1,
    padding: '0.75rem 1rem',
    backgroundColor: '#e5e7eb',
    color: '#1f2937',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: '600' as const,
    cursor: 'pointer',
  },
  disclaimer: {
    fontSize: '0.75rem',
    color: '#666',
    textAlign: 'center' as const,
    marginTop: '1.5rem',
    margin: '1.5rem 0 0 0',
  },
}

export default RiskAssessmentPage
