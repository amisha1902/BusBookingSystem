
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Auth/Login.jsx'
import PassengerSignup from './pages/Auth/PassengerSignup.jsx'
import OperatorSignup from './pages/Auth/OperatorSignup.jsx'
import PassengerDashboardPage from './pages/Dashboard/PassengerDashboard.jsx'
import { useAuth } from './hooks/useAuth.jsx'
import './styles/global.css'

import OperatorLayout from './pages/Operator/Layout.jsx'
import OperatorDashboard from './pages/Operator/Dashboard.jsx'
import OperatorBusOperators from './pages/Operator/BusOperators.jsx'
import OperatorBuses from './pages/Operator/OperatorBuses.jsx'
import Buses from './pages/Operator/Buses.jsx' //---all buses page
import OperatorProfile from './pages/Operator/Profile.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return isAuthenticated ? children : <Home />
}

function AppContent() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1">
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup/passenger" element={<PassengerSignup />} />
            <Route path="/signup/operator" element={<OperatorSignup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PassengerDashboardPage />
                </ProtectedRoute>
              }
            />

           //operator
            <Route
              path="/operator"
              element={
                <ProtectedRoute>
                  <OperatorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="dashboard" element={<OperatorDashboard />} />

              <Route path="bus-operators" element={<OperatorBusOperators />} />

              <Route
                path="bus-operators/:operatorId/buses"
                element={<OperatorBuses />}
              />

              <Route
                path="buses/all"
                element={<Buses />}
              />

              <Route path="profile" element={<OperatorProfile />} />
            </Route>

            <Route path="*" element={<Home />} />

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
