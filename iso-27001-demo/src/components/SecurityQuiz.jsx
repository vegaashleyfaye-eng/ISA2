import React, { useState } from 'react'
import { Check, X, Volume2 } from 'lucide-react'
import './SecurityQuiz.css'

export default function SecurityQuiz() {
  const quizData = [
    {
      id: 1,
      question: 'What is the minimum password length required by our policy?',
      options: ['6 characters', '8 characters', '10 characters', '12 characters'],
      correct: 1,
      explanation: 'ISO 27001 password policy requires a minimum of 8 characters to ensure adequate password strength.'
    },
    {
      id: 2,
      question: 'How often should passwords be changed?',
      options: ['Monthly', 'Quarterly', 'Every 90 days', 'Annually'],
      correct: 2,
      explanation: 'Passwords must be changed every 90 days to maintain compliance with security policy.'
    },
    {
      id: 3,
      question: 'What should you do if you suspect a security breach?',
      options: [
        'Wait and monitor',
        'Report it within 24 hours',
        'Tell a colleague first',
        'Try to fix it yourself'
      ],
      correct: 1,
      explanation: 'All suspected security incidents must be reported within 24 hours to the security team for proper investigation.'
    },
    {
      id: 4,
      question: 'Which of these is NOT a strong password?',
      options: [
        'BlueSky@2024#Secure',
        'password123',
        'MyDog!RunsFast42',
        'Tr@nsf0rm@t1on'
      ],
      correct: 1,
      explanation: 'Password123 is weak because it contains a common word and simple substitution, making it vulnerable to dictionary attacks.'
    },
    {
      id: 5,
      question: 'What does MFA stand for?',
      options: [
        'Multi-Factor Authentication',
        'Maximum File Access',
        'Most Frequently Accessed',
        'Multi-Flag Authorization'
      ],
      correct: 0,
      explanation: 'MFA (Multi-Factor Authentication) requires multiple verification methods to confirm your identity.'
    },
    {
      id: 6,
      question: 'How should sensitive data be transmitted?',
      options: [
        'Via email',
        'Via encrypted channels (TLS 1.2+)',
        'Via instant messaging',
        'Via plain HTTP'
      ],
      correct: 1,
      explanation: 'Sensitive data must always be transmitted over encrypted channels using TLS 1.2 or higher to prevent interception.'
    },
    {
      id: 7,
      question: 'What is the frequency of compliance audits?',
      options: [
        'Annually',
        'Quarterly',
        'Bi-annually (twice yearly)',
        'Monthly'
      ],
      correct: 2,
      explanation: 'ISO 27001 compliance audits are conducted bi-annually to ensure continuous adherence to security controls.'
    },
    {
      id: 8,
      question: 'What happens after 5 failed login attempts?',
      options: [
        'Nothing',
        'Warning message',
        'Account is locked',
        'Email is sent'
      ],
      correct: 2,
      explanation: 'After 5 failed login attempts, the account is automatically locked to prevent unauthorized access attempts.'
    }
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [answers, setAnswers] = useState([])

  const handleAnswerClick = (index) => {
    if (!answered) {
      setSelectedAnswer(index)
      const isCorrect = index === quizData[currentQuestion].correct
      setAnswered(true)
      setAnswers([...answers, { questionId: quizData[currentQuestion].id, userAnswer: index, correct: isCorrect }])
      if (isCorrect) {
        setScore(score + 1)
      }
    }
  }

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setScore(0)
    setShowResults(false)
    setAnswers([])
  }

  if (showResults) {
    const percentage = Math.round((score / quizData.length) * 100)
    const passed = percentage >= 70

    return (
      <div className="quiz-results">
        <div className="results-card">
          <div className={`results-icon ${passed ? 'passed' : 'failed'}`}>
            {passed ? '✓' : '✗'}
          </div>
          <h2>{passed ? 'Great Job!' : 'Keep Learning'}</h2>
          <div className="results-score">
            <div className="score-number">{score}/{quizData.length}</div>
            <div className="score-percentage">{percentage}%</div>
          </div>
          <p className="results-message">
            {passed
              ? 'You have demonstrated good security awareness! Continue to stay vigilant.'
              : 'Review the security policies and try again to improve your score.'}
          </p>

          <div className="results-breakdown">
            <h3>Review Your Answers</h3>
            <div className="answer-review">
              {quizData.map((q, idx) => {
                const userAnswer = answers.find(a => a.questionId === q.id)
                const isCorrect = userAnswer?.correct
                return (
                  <div key={q.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="review-icon">
                      {isCorrect ? <Check size={16} /> : <X size={16} />}
                    </div>
                    <div className="review-content">
                      <p className="review-question">{q.question}</p>
                      <p className="review-answer">
                        Your answer: <strong>{q.options[userAnswer?.userAnswer]}</strong>
                      </p>
                      {!isCorrect && (
                        <p className="review-correct">
                          Correct answer: <strong>{q.options[q.correct]}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button className="btn-restart" onClick={handleRestart}>
            Retake Quiz
          </button>
        </div>
      </div>
    )
  }

  const question = quizData[currentQuestion]
  const progress = ((currentQuestion + 1) / quizData.length) * 100

  return (
    <div className="security-quiz">
      <div className="quiz-header">
        <h2>Security Awareness Quiz</h2>
        <p>Test your knowledge of ISO 27001 security policies</p>
      </div>

      <div className="quiz-card">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">
            Question {currentQuestion + 1} of {quizData.length}
          </div>
        </div>

        <div className="quiz-content">
          <h3>{question.question}</h3>

          <div className="options">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                className={`option ${selectedAnswer === idx ? 'selected' : ''} ${
                  answered && idx === question.correct ? 'correct' : ''
                } ${answered && selectedAnswer === idx && idx !== question.correct ? 'incorrect' : ''}`}
                onClick={() => handleAnswerClick(idx)}
                disabled={answered}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option}</span>
                {answered && idx === question.correct && <Check size={18} />}
                {answered && selectedAnswer === idx && idx !== question.correct && <X size={18} />}
              </button>
            ))}
          </div>

          {answered && (
            <div className={`feedback ${selectedAnswer === question.correct ? 'correct' : 'incorrect'}`}>
              <p>
                <strong>{selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect'}</strong>
              </p>
              <p className="explanation">{question.explanation}</p>
            </div>
          )}
        </div>

        {answered && (
          <button className="btn-next" onClick={handleNext}>
            {currentQuestion === quizData.length - 1 ? 'View Results' : 'Next Question'}
          </button>
        )}

        <div className="quiz-footer">
          <p>🎓 ISO 27001 Information Security Management</p>
        </div>
      </div>
    </div>
  )
}
