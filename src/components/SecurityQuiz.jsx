import React, { useState, useEffect } from 'react'
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
    },
    {
      id: 9,
      question: 'What is the primary goal of ISO 27001?',
      options: [
        'Increase company profits',
        'Protect information assets through risk management',
        'Improve website performance',
        'Reduce employee workload'
      ],
      correct: 1,
      explanation: 'The primary goal of ISO 27001 is to protect information assets through comprehensive risk management and security controls.'
    },
    {
      id: 10,
      question: 'Which of the following is considered confidential information?',
      options: [
        'Public advertisements',
        'Company logo',
        'Employee salary records',
        'Published press releases'
      ],
      correct: 2,
      explanation: 'Employee salary records are confidential information that must be protected and only accessible to authorized personnel.'
    },
    {
      id: 11,
      question: 'What should you do before opening an email attachment from an unknown sender?',
      options: [
        'Open it immediately',
        'Forward it to colleagues',
        'Verify the sender and scan for threats',
        'Delete all emails'
      ],
      correct: 2,
      explanation: 'Always verify the sender and scan attachments for threats before opening them to prevent malware infections.'
    },
    {
      id: 12,
      question: 'What is phishing?',
      options: [
        'A software update process',
        'An attempt to trick users into revealing sensitive information',
        'A data backup method',
        'A type of firewall'
      ],
      correct: 1,
      explanation: 'Phishing is a fraudulent attempt to trick users into revealing sensitive information by impersonating trusted sources.'
    },
    {
      id: 13,
      question: 'Which principle ensures that information is accessible only to authorized individuals?',
      options: [
        'Availability',
        'Integrity',
        'Confidentiality',
        'Authentication'
      ],
      correct: 2,
      explanation: 'Confidentiality is the principle that ensures information is accessible only to authorized individuals through access controls.'
    },
    {
      id: 14,
      question: 'Which action helps protect sensitive information on your workstation?',
      options: [
        'Sharing passwords with coworkers',
        'Leaving your computer unlocked',
        'Locking your screen when away',
        'Writing passwords on sticky notes'
      ],
      correct: 2,
      explanation: 'Locking your screen when away is a critical security practice to prevent unauthorized access to sensitive information.'
    },
    {
      id: 15,
      question: 'What is the purpose of data backup?',
      options: [
        'To increase internet speed',
        'To recover data in case of loss or damage',
        'To improve password strength',
        'To monitor employee activities'
      ],
      correct: 1,
      explanation: 'Data backup is essential for recovering information in case of loss, damage, or security incidents.'
    },
    {
      id: 16,
      question: 'Which of the following is an example of social engineering?',
      options: [
        'Installing antivirus software',
        'Updating operating systems',
        'Impersonating IT support to obtain passwords',
        'Encrypting files'
      ],
      correct: 2,
      explanation: 'Social engineering is a manipulation tactic, such as impersonating IT support, used to trick people into revealing sensitive information.'
    },
    {
      id: 17,
      question: 'Why is software patching important?',
      options: [
        'It changes the user interface',
        'It removes unnecessary files',
        'It fixes security vulnerabilities and bugs',
        'It increases storage capacity'
      ],
      correct: 2,
      explanation: 'Software patching is critical as it fixes security vulnerabilities and bugs that could be exploited by attackers.'
    },
    {
      id: 18,
      question: 'What should you do if you receive a suspicious email?',
      options: [
        'Click the links to investigate',
        'Reply asking for more details',
        'Report it to the IT/Security team',
        'Forward it to everyone'
      ],
      correct: 2,
      explanation: 'Always report suspicious emails to the IT/Security team for investigation rather than interacting with them directly.'
    },
    {
      id: 19,
      question: 'Which of the following is a secure practice for password management?',
      options: [
        'Using the same password for all accounts',
        'Sharing passwords with trusted coworkers',
        'Using unique passwords for different accounts',
        'Storing passwords in a public document'
      ],
      correct: 2,
      explanation: 'Using unique passwords for different accounts significantly reduces the risk of unauthorized access across multiple systems.'
    },
    {
      id: 20,
      question: 'What is the purpose of access control?',
      options: [
        'To increase internet bandwidth',
        'To restrict access to authorized users only',
        'To monitor printer usage',
        'To reduce hardware costs'
      ],
      correct: 1,
      explanation: 'Access control ensures that only authorized users can access specific resources and information, maintaining security and confidentiality.'
    }
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [answers, setAnswers] = useState([])
  const [shuffledQuestions, setShuffledQuestions] = useState([])

  const shuffleQuestions = () => {
    const shuffled = [...quizData].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }

  useEffect(() => {
    shuffleQuestions()
  }, [])

  const currentQuizData = shuffledQuestions.length > 0 ? shuffledQuestions : quizData

  const handleAnswerClick = (index) => {
    if (!answered) {
      setSelectedAnswer(index)
      const isCorrect = index === currentQuizData[currentQuestion].correct
      setAnswered(true)
      setAnswers([...answers, { questionId: currentQuizData[currentQuestion].id, userAnswer: index, correct: isCorrect }])
      if (isCorrect) {
        setScore(score + 1)
      }
    }
  }

  const handleNext = () => {
    if (currentQuestion < currentQuizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    shuffleQuestions()
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setScore(0)
    setShowResults(false)
    setAnswers([])
  }

  if (showResults) {
    const percentage = Math.round((score / currentQuizData.length) * 100)
    const passed = percentage >= 70

    return (
      <div className="quiz-results">
        <div className="results-card">
          <div className={`results-icon ${passed ? 'passed' : 'failed'}`}>
            {passed ? '✓' : '✗'}
          </div>
          <h2>{passed ? 'Great Job!' : 'Keep Learning'}</h2>
          <div className="results-score">
            <div className="score-number">{score}/{currentQuizData.length}</div>
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
              {currentQuizData.map((q, idx) => {
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

  const question = currentQuizData[currentQuestion]
  const progress = ((currentQuestion + 1) / currentQuizData.length) * 100

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
            Question {currentQuestion + 1} of {currentQuizData.length}
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
            {currentQuestion === currentQuizData.length - 1 ? 'View Results' : 'Next Question'}
          </button>
        )}

        <div className="quiz-footer">
          <p>🎓 ISO 27001 Information Security Management</p>
        </div>
      </div>
    </div>
  )
}
