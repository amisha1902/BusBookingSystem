import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Auth/Login.jsx'
import PassengerSignup from './pages/Auth/PassengerSignup.jsx'
import OperatorSignup from './pages/Auth/OperatorSignup.jsx'
import PassengerDashboard from './pages/Dashboard/PassengerDashboard.jsx'
import OperatorDashboard from './pages/Dashboard/OperatorDashboard.jsx'
import { useAuth } from './hooks/useAuth.jsx'
import './styles/global.css'
import './App.css'
import Dashboard from './pages/Dashboard/Dashboard.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

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
                  <Dashboard />
                </ProtectedRoute>
              }
            />
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