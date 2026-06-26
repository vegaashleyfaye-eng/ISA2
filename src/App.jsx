import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import './App.css'

function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sim = searchParams.get('sim') === '1'
  return <Login onLogin={() => navigate(sim ? '/dashboard?sim=1' : '/dashboard')} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/simulate" element={<Navigate to="/login?sim=1" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
