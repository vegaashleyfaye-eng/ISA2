import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import SimulationLogin from './pages/SimulationLogin'
import Dashboard from './pages/Dashboard'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<LandingPage />} />
      <Route path="/simulate"  element={<SimulationLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  )
}
