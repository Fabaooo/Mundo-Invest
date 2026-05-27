import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import RiskAssessmentPage from './pages/RiskAssessmentPage'
import MarketDataPage from './pages/MarketDataPage'
import ProtectedRoute from './components/ui/ProtectedRoute'
import RiskAssessmentRoute from './components/ui/RiskAssessmentRoute'
import MainLayout from './layout/MainLayout'
import AuthLayout from './layout/AuthLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthLayout>
              <SignupPage />
            </AuthLayout>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/market" element={<MarketDataPage />} />
          <Route
            path="/risk-assessment"
            element={
              <RiskAssessmentRoute>
                <RiskAssessmentPage />
              </RiskAssessmentRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
