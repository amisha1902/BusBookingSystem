import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import './Home.css'
import BusChase from '../../components/BusChase.jsx'

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="home-page">
      <section className="hero-section bg-gradient text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4 text-black">
            🚌 Bus Booking System
          </h1>
          <p className="lead mb-5 text-dark">
            Book your bus tickets easily and travel with comfort
          </p>
          <BusChase/>
          {!isAuthenticated ? (
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/login" className="btn btn-light btn-lg">
                Login
              </Link>
              <Link to="/signup/passenger" className="btn btn-outline-light btn-lg">
                Get Started as Passenger
              </Link>
            </div>
          ) : (
            <div>
              <p className="mb-4">Welcome back, {user?.name}!</p>
              <Link to="/dashboard" className="btn btn-dark btn-lg">
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features-section py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Why Choose Us?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card text-center p-4">
                <div className="feature-icon mb-3">💳</div>
                <h5>Easy Booking</h5>
                <p className="text-muted">
                  Simple and quick booking process. Get your ticket in seconds.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center p-4">
                <div className="feature-icon mb-3">🛡️</div>
                <h5>Secure Payment</h5>
                <p className="text-muted">
                  Your payment information is safe and encrypted with us.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center p-4">
                <div className="feature-icon mb-3">🚌</div>
                <h5>Best Operators</h5>
                <p className="text-muted">
                  Travel with the most trusted and reliable bus operators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="operator-section bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4 fw-bold">Are You a Bus Operator?</h2>
          <p className="lead mb-5 text-muted">
            Register your bus company and start accepting bookings today
          </p>
          <Link to="/signup/operator" className="btn btn-primary btn-lg">
            Register as Operator
          </Link>
        </div>
      </section>
    </div>
  )
}