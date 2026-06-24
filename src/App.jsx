import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/simulate" element={<Navigate to="/dashboard?sim=1" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}