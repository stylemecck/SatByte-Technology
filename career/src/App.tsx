import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { useAuth } from './contexts/AuthContext'

// Real Pages
import HomePage from './pages/HomePage'
import CareersPage from './pages/CareersPage'
import JobDetailsPage from './pages/JobDetailsPage'
import InternshipsPage from './pages/InternshipsPage'
import CertificationsPage from './pages/CertificationsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>
  
  if (!user) return <Navigate to="/login" replace />
  
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />
  
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="careers" element={<CareersPage />} />
        <Route path="careers/:id" element={<JobDetailsPage />} />
        <Route path="internships" element={<InternshipsPage />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        
        {/* Protected User Routes */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
