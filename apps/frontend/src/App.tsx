import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
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
          path="/risk-assessment"
          element={
            <ProtectedRoute>
              <MainLayout>
                <RiskAssessmentPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MarketDataPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
