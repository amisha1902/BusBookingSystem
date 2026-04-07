import { useState, useEffect } from 'react'
import { useAdmin } from '../../hooks/useAdmin'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import AdminNav from '../../components/Admin/AdminNav'
import AdminOverview from '../../components/Admin/AdminOverview'
import AdminPassengers from '../../components/Admin/AdminPassenger'
import AdminOperators from '../../components/Admin/AdminOperators'
import AdminRoutes from '../../components/Admin/AdminRoutes'
import AdminTrips from '../../components/Admin/AdminTrips'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { loading } = useAdmin()
  const [activeTab, setActiveTab] = useState('overview')

  // check if user is admin 
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/')
    }
  }, [user, navigate])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <AdminNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-4">
        {activeTab === 'overview' && <AdminOverview />}
        {activeTab === 'passengers' && <AdminPassengers />}
        {activeTab === 'operators' && <AdminOperators />}
        {activeTab === 'routes' && <AdminRoutes />}
        {activeTab === 'trips' && <AdminTrips />}
      </div>
    </div>
  )
}