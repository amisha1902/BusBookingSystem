import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Auth/Login.jsx'
import PassengerSignup from './pages/Auth/PassengerSignup.jsx'
import OperatorSignup from './pages/Auth/OperatorSignup.jsx'
import { useAuth } from './hooks/useAuth.jsx'
import './styles/global.css'
import OperatorLayout from './pages/Operator/Layout.jsx'
import OperatorDashboard from './pages/Operator/Dashboard.jsx'
import OperatorBusOperators from './pages/Operator/BusOperators.jsx'
import OperatorBuses from './pages/Operator/OperatorBuses.jsx'
import Buses from './pages/Operator/Buses.jsx'
import OperatorProfile from './pages/Operator/Profile.jsx'
import PassengerDashboard from './pages/Passenger/PassengerDashboard'
import TripDetails from './pages/Passenger/TripDetails'
import BookingDetails from './pages/Passenger/BookingDetails'
import PassengerProfile from './pages/Passenger/PassengerProfile'
import PassengerSearchResults from './pages/Passenger/PassengerSearchResult.jsx'
import BoardingDropPage from './pages/Passenger/BoardingDropPage.jsx'
import PassengerDetailsPage from './pages/Passenger/PassengerDetailsPage.jsx'
import MyBookings from './pages/Passenger/MyBookings.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>

  if (!isAuthenticated) return <Navigate to="/" replace />

  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />

  return children
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

            {/* Passenger Routes */}
            <Route
              path="/passenger/dashboard"
              element={
                <ProtectedRoute requiredRole="passenger">
                  <PassengerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/passenger/trip/:tripId"
              element={
                <ProtectedRoute requiredRole="passenger">
                  <TripDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/passenger/booking/:bookingId"
              element={
                <ProtectedRoute requiredRole="passenger">
                  <BookingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/passenger/profile"
              element={
                <ProtectedRoute requiredRole="passenger">
                  <PassengerProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/passenger/search" element={<PassengerSearchResults />} />
            <Route path="/select-points" element={<BoardingDropPage />} />
            <Route path="/passenger-details" element={<PassengerDetailsPage />} />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute requiredRole="passenger">
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Operator Routes */}
            <Route
              path="/operator"
              element={
                <ProtectedRoute requiredRole="operator">
                  <OperatorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<OperatorDashboard />} />
              <Route path="bus-operators" element={<OperatorBusOperators />} />
              <Route path="bus-operators/:operatorId/buses" element={<OperatorBuses />} />
              <Route path="buses/all" element={<Buses />} />
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