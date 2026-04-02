import { useAuth } from '../../hooks/useAuth.jsx'
import { USER_TYPES } from '../../utils/Constants'
import PassengerDashboard from './PassengerDashboard.jsx'
import OperatorDashboard from './OperatorDashboard.jsx'

export default function Dashboard() {
  const { user } = useAuth()

  const isOperator = user?.role === 'operator'
  const isPassenger = user?.role === 'passenger'

  if (isPassenger) {
    return <PassengerDashboard />
  }

  if (isOperator) {
    return <OperatorDashboard />
  }

  return (
    <div className="dashboard-page py-5">
      <div className="container">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-5 text-center">
            <h2></h2>
            <p className="text-muted">Unknown user type</p>
          </div>
        </div>
      </div>
    </div>
  )
}